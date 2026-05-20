// 提交订单
import connectDB from "@/lib/db";
import moment from "moment";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";
import UserMeta from "@/models/UserMeta";
import Order from "@/models/Order";
import User from "@/models/User";
import Store from "@/models/Store";
import OrderPayments from "@/models/OrderPayments";
import OrderStatus from "@/models/OrderStatus";

import generateKokoPayment from "./generateKokoPayment";
import generateVisaPayment from "./generateVisaPayment";
import generatePayherePayment from "./generatePayherePayment";
import generatePaypalPayment from "./generatePaypalPayment";
import generateStripePayment from "./generateStripePayment";
import generateCrossSitePayment from "./generateCrossSitePayment";

const isCrossSitePaymentEnabled = () =>
    process.env.NEXT_PUBLIC_ENABLE_CROSS_SITE_PAYMENT === "true" &&
    Boolean(process.env.NEXT_PUBLIC_PAYMENT_SITE_URL);

const updateStockLevels = async (order) => {
    try {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/site/order/stock-update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'origin': process.env.NEXTAUTH_URL,
                'host': process.env.NEXTAUTH_URL,
            },
            body: JSON.stringify({
                items: order.items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    color: item.color,
                    size: item.size,
                    stock: item.stock
                }))
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Stock update failed: ${errorData.error || errorData.message}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating stock levels:', error);
        throw error;
    }
};


// Optimized address comparison
const isAddressEqual = (address1, address2) => {
    const fields = ['firstName', 'lastName', 'phone', 'email', 'street', 'addressLine2', 'city', 'state', 'zip', 'country'];
    return fields.every(field => address1[field] === address2[field]);
};

// Calculate order amount with optimized offer processing
const calculateOrderAmount = (items, store, shippingTotal, paymentType) => {
    const isHaveSalesItems = items.some(d => d.salePrice !== null && d.salePrice !== 0);
    const isGiftCardAvailable = items.some(d => d.isGiftCard);

    const totalAmount = items.reduce((total, item) =>
        total + ((Number(item.salePrice) || item.price) * item.quantity), 0);

    let finalAmount = totalAmount;

    // Process store offers
    if (store?.offers?.enabledOffer && !isHaveSalesItems && !isGiftCardAvailable) {
        const { parentage, enabledKokoOffer, kokoParentage } = store.offers;

        if (enabledKokoOffer && paymentType === "koko") {
            finalAmount = totalAmount;
        } else {
            finalAmount = totalAmount * (1 - Number(parentage) / 100);
        }
    }

    // Apply shipping and KOKO offer
    let amount = totalAmount > 15000 ? finalAmount : finalAmount + (shippingTotal || 0);

    if (store?.offers?.enabledKokoOffer && paymentType === "koko" && !isHaveSalesItems) {
        const maxDiscount = 2500;
        const discountPercentage = Math.min(store.offers.kokoParentage / 100, maxDiscount / amount);
        amount -= amount * discountPercentage;
    }

    return amount;
};

// Update existing user with optimized promise handling
async function updateExistingUser(existingUser, orderData, order) {
    const userMeta = await UserMeta.findOne({ user: existingUser._id });
    if (!userMeta) return;

    const productIds = orderData.items?.map(product =>
        product.productId && mongoose.Types.ObjectId.isValid(product.productId) ?
            new mongoose.Types.ObjectId(product.productId) : null
    ).filter(Boolean);

    // Prepare updates
    userMeta.interestProducts.push(...productIds);
    userMeta.parches.push(order._id);

    const addressExists = userMeta.billingAddress?.some(existingAddress =>
        isAddressEqual(existingAddress, orderData.billingAddress[0])
    );

    if (!addressExists) {
        userMeta.billingAddress.push(...orderData.billingAddress || {});
    }

    if (orderData?.userSiteUniqueID) {
        userMeta.uniqueID = orderData.userSiteUniqueID;
    }

    const userUpdate = {
        firstName: orderData.billingAddress[0]?.firstName || '',
        lastName: orderData.billingAddress[0]?.lastName || '',
        uniqueID: orderData.userSiteUniqueID || '',
        contactNumber: orderData.billingAddress[0]?.phone || '',
    };

    if (orderData?.isNewUser?.password) {
        userUpdate.password = await bcrypt.hash(orderData.isNewUser.password, 10);
    }

    return Promise.all([
        Order.updateOne(
            { _id: order._id },
            { $set: { user: new mongoose.Types.ObjectId(existingUser._id) } }
        ),
        User.updateOne(
            { email: orderData.email },
            { $set: userUpdate }
        ),
        userMeta.save()
    ]);
}

// Create new user with optimized promise handling
async function createNewUser(userData, orderData, productIds) {
    const username = `${userData.firstName.toLowerCase().replace(/\s+/g, '')}_${uuidv4().substring(0, 8)}`;

    const userPayload = {
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        role: 'user',
        username,
        email: userData.email,
        uniqueID: orderData.userSiteUniqueID || '',
        contactNumber: userData.phone || '',
    };


    if (orderData?.isNewUser?.password) {
        userPayload.password = await bcrypt.hash(orderData.isNewUser.password, 10);
    } else {
        userPayload.password = await bcrypt.hash('Test@123', 10);
    }

    const newUser = await User.create(userPayload);

    if (!newUser) throw new Error('Failed to create user');

    return Promise.all([
        UserMeta.create({
            user: newUser._id,
            billingAddress: [{
                ...orderData.billingAddress,
                isDefault: true,
            }],
            interestProducts: productIds,
            parches: [orderData._id],
            uniqueID: orderData.userSiteUniqueID || '',
        }),
        Order.updateOne(
            { _id: orderData._id },
            { $set: { user: new mongoose.Types.ObjectId(newUser._id) } }
        )
    ]);
}

export async function POST(req) {
    try {
        console.log('开始处理订单提交请求');
        const data = await req.json();
        if (!data || !Object.keys(data).length) {
            console.error('请求数据为空或无效');
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }
        console.log('订单数据验证通过，准备连接数据库');
        await connectDB();
        const cookiesList = cookies();

        // 验证支付方式
        if (!data.payment?.status) {
            console.error('未找到支付方式状态');
            return NextResponse.json({ error: "Cannot find payment method" }, { status: 400 });
        }

        console.log(`支付方式: ${data.payment?.type}, 状态: ${data.payment?.status}`);

        try {
            // Parallel database queries
            console.log('查询用户和商店信息');
            const [userExists, store] = await Promise.all([
                User.findOne({ email: data?.email }).lean().catch(err => {
                    console.error('查询用户失败:', err);
                    return null;
                }),
                Store.findOne({ _id: data?.storeData?._id }).lean().catch(err => {
                    console.error('查询商店失败:', err);
                    return null;
                })
            ]);

            console.log(`用户查询结果: ${userExists ? '已存在' : '不存在'}`);
            console.log(`商店查询结果: ${store ? '找到' : '未找到'}`);

            if (!store) {
                console.warn('未找到商店信息，将使用默认价格计算');
            }

            // 计算订单金额
            console.log('计算订单金额');
            const amount = calculateOrderAmount(data.items, store, data.shippingTotal, data.payment.type);
            console.log(`计算的订单金额: ${amount}`);

            // 检查支付类型
            const isOfflinePayment = ["cod", "bankTransfer"].includes(data.payment.type);
            console.log(`支付类型: ${isOfflinePayment ? '线下支付' : '在线支付'}`);

            // 创建订单数据
            console.log('准备创建订单');
            const orderPayload = {
                userSiteUniqueID: data.userSiteUniqueID || '',
                items: data?.items || [],
                emailSent: false,
                status: !isOfflinePayment ? "awaitingPayment" : data.status,
                fulfillmentType: data?.fulfillmentType || "",
                pickUpLocation: data?.pickUpLocation || '',
                pickupDate: data?.pickupDate || new Date(),
                ipAddressData: {},
                date: data.date,
                billingAddress: data?.billingAddress[0] || {},
                shippingAddress: data?.shippingAddress[0] || {},
                delete: false,
                offersApplied: !!(store?.offers?.enabledOffer || store?.offers?.enabledKokoOffer),
                typeOfOffer: store?.offers || {},
                totalOrderAmount: amount,
                payment: data?.payment || {},
            };

            // 创建订单记录
            console.log('创建订单记录');
            const order = await Order.create(orderPayload).catch(err => {
                console.error('创建订单失败:', err);
                throw new Error(`创建订单失败: ${err.message}`);
            });

            if (!order) {
                throw new Error('订单创建返回空结果');
            }

            console.log(`订单创建成功，ID: ${order._id}`);

            // 设置支付方式显示文本
            const paymentTypeDisplay = {
                "cod": "COD",
                "bankTransfer": "Bank Transfer",
                "koko": "KOKO",
                "visa": "VISA",
                "payhere": "PayHere",
                "paypal": "PayPal",
                "stripe": "Stripe"
            }[data.payment?.type] || data.payment?.type.toUpperCase();

            const customMessage = `Customer selected ${paymentTypeDisplay} and order placed as ${orderPayload.status}`;
            console.log(`订单状态消息: ${customMessage}`);

            // 处理用户信息和创建相关记录
            console.log('处理用户信息和创建相关记录');
            try {
                // 提取产品ID
                const productIds = data.items?.map(product => {
                    if (!product.productId) {
                        console.warn('发现没有productId的商品项');
                        return null;
                    }

                    if (!mongoose.Types.ObjectId.isValid(product.productId)) {
                        console.warn(`无效的productId格式: ${product.productId}`);
                        return null;
                    }

                    return new mongoose.Types.ObjectId(product.productId);
                }).filter(Boolean);

                console.log(`有效产品ID数量: ${productIds.length}`);
                // 处理用户和创建相关记录
                const [userResult, payment, orderStatus] = await Promise.all([
                    !userExists ?
                        createNewUser(data.billingAddress[0], data, productIds).catch(err => {
                            console.error('创建新用户失败:', err);
                            return null;
                        }) :
                        updateExistingUser(userExists, data, order).catch(err => {
                            console.error('更新现有用户失败:', err);
                            return null;
                        }),
                    OrderPayments.create({
                        orderId: order._id,
                        amount,
                        paymentMethod: data.payment?.type || '',
                        status: !isOfflinePayment ? 'awaitingPayment' : '',
                        paymentDate: moment(data.date),
                        customMessage,
                    }).catch(err => {
                        console.error('创建支付记录失败:', err);
                        throw new Error(`创建支付记录失败: ${err.message}`);
                    }),
                    OrderStatus.create({
                        status: orderPayload.status,
                        orderId: order._id,
                        statusDate: moment(data.date),
                        changeBy: "customer",
                        customMessage,
                    }).catch(err => {
                        console.error('创建订单状态记录失败:', err);
                        throw new Error(`创建订单状态记录失败: ${err.message}`);
                    })
                ]);

                console.log('用户处理和相关记录创建完成');

                if (!payment) {
                    throw new Error('支付记录创建失败');
                }

                if (!orderStatus) {
                    throw new Error('订单状态记录创建失败');
                }

                // 更新订单支付ID
                console.log('更新订单支付ID');
                await Order.findByIdAndUpdate(
                    order._id,
                    { $set: { paymentId: payment._id } },
                    { new: true }
                ).catch(err => {
                    console.error('更新订单支付ID失败:', err);
                    // 继续处理，不抛出异常
                });

            } catch (userProcessError) {
                console.error('用户处理或相关记录创建失败:', userProcessError);
                // 继续处理，确保我们仍然可以返回订单信息
            }

            // 设置cookie和准备响应
            console.log('设置cookie和准备响应');
            const cookieValue = JSON.stringify({
                orderId: order._id.toString(),
                status: orderPayload.status,
                timestamp: Date.now(),
                paymentType: data.payment,
                user: order.user,
                totalAmount: amount,
                shipping: data?.shippingTotal || 0,
                orderStatus: data?.orderStatus || '',
                fulfillmentType: orderPayload.fulfillmentType,
                pickupDate: data?.pickupDate || '',
                items: [],
                enabledOffers: store?.offers?.enabledOffer || false,
                typeOfOffer: store?.offers || {},
            });

            // 创建带cookie的响应
            const createResponseWithCookie = (responseData, status = 200) => {
                const response = NextResponse.json(responseData, { status });
                response.cookies.set('lastOrder', cookieValue, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 3600 // 1 hour in seconds
                });
                return response;
            };

            // 更新库存
            console.log('更新商品库存');
            try {
                await updateStockLevels(order);
                console.log('库存更新成功');
            } catch (stockError) {
                console.error('更新库存失败，但继续处理订单:', stockError);
                // 继续处理，不中断流程
            }

            // 根据支付类型处理支付
            console.log(`处理${data.payment?.type}支付`);
            if (data?.payment && data?.payment?.type === "koko") {
                try {
                    const getGeneratedKokoPayment = await generateKokoPayment(order, amount);
                    console.log('KOKO支付生成成功');
                    return createResponseWithCookie({
                        message: "Order Details",
                        data: getGeneratedKokoPayment
                    });
                } catch (kokoError) {
                    console.error('生成KOKO支付失败:', kokoError);
                    return createResponseWithCookie({
                        message: "Order created but payment generation failed",
                        error: kokoError.message,
                        data: order
                    }, 500);
                }
            } else if (data?.payment && data?.payment?.type === "visa") {
                try {
                    const getGeneratedVisaPayment = await generateVisaPayment(order, amount);
                    console.log('VISA支付生成成功');
                    return createResponseWithCookie({
                        message: "Order Details",
                        data: getGeneratedVisaPayment
                    });
                } catch (visaError) {
                    console.error('生成VISA支付失败:', visaError);
                    return createResponseWithCookie({
                        message: "Order created but payment generation failed",
                        error: visaError.message,
                        data: order
                    }, 500);
                }
            } else if (data?.payment && data?.payment?.type === "payhere") {
                try {
                    const getGeneratedPayherePayment = await generatePayherePayment(order, amount);
                    console.log('PayHere支付生成成功');
                    return createResponseWithCookie({
                        message: "Order Details",
                        data: getGeneratedPayherePayment
                    });
                } catch (payhereError) {
                    console.error('生成PayHere支付失败:', payhereError);
                    return createResponseWithCookie({
                        message: "Order created but payment generation failed",
                        error: payhereError.message,
                        data: order
                    }, 500);
                }
            } else if (data?.payment && data?.payment?.type === "paypal") {
                try {
                    // Cross-site payment is opt-in. Keep local checkout as the default flow.
                    if (isCrossSitePaymentEnabled()) {
                        console.log('Using Cross-Site Payment Flow');
                        const getGeneratedCrossSitePayment = await generateCrossSitePayment(order, amount);
                        console.log('Cross-Site payment generated successfully');
                        return createResponseWithCookie({
                            message: "Order Details",
                            data: getGeneratedCrossSitePayment
                        });
                    }

                    const getGeneratedPaypalPayment = await generatePaypalPayment(order, amount);
                    console.log('PayPal payment generated successfully');
                    // Ensure returned object contains redirect URL
                    return createResponseWithCookie({
                        message: "Order Details",
                        data: {
                            ...order.toObject(),
                            redirectUrl: getGeneratedPaypalPayment.redirectUrl,
                            payment: {
                                type: "paypal"
                            }
                        }
                    });
                } catch (paypalError) {
                    console.error('Failed to generate payment:', paypalError);
                    return createResponseWithCookie({
                        message: "Order created but payment generation failed",
                        error: paypalError.message,
                        data: order
                    }, 500);
                }
            } else if (data?.payment && data?.payment?.type === "stripe") {
                try {
                    // Cross-site payment is opt-in. Keep local checkout as the default flow.
                    if (isCrossSitePaymentEnabled()) {
                        console.log('Using Cross-Site Payment Flow for Stripe');
                        const getGeneratedCrossSitePayment = await generateCrossSitePayment(order, amount, 'stripe');
                        console.log('Cross-Site Stripe payment generated successfully');
                        return createResponseWithCookie({
                            message: "Order Details",
                            data: getGeneratedCrossSitePayment
                        });
                    }

                    const getGeneratedStripePayment = await generateStripePayment(order, amount);
                    console.log('Stripe支付生成成功');
                    // 确保返回的对象包含重定向 URL
                    return createResponseWithCookie({
                        message: "Order Details",
                        data: {
                            ...order.toObject(),
                            redirectUrl: getGeneratedStripePayment.redirectUrl,
                            payment: {
                                type: "stripe"
                            }
                        }
                    });
                } catch (stripeError) {
                    console.error('生成Stripe支付失败:', stripeError);
                    return createResponseWithCookie({
                        message: "Order created but payment generation failed",
                        error: stripeError.message,
                        data: order
                    }, 500);
                }
            } else {
                // 处理线下支付
                console.log('处理线下支付完成');
                return createResponseWithCookie({
                    message: "Order Details",
                    data: order
                });
            }
        } catch (processingError) {
            console.error('订单处理过程中发生错误:', processingError);
            return NextResponse.json({
                error: '订单处理失败',
                message: processingError.message,
                stack: process.env.NODE_ENV === 'development' ? processingError.stack : undefined
            }, { status: 500 });
        }
    } catch (error) {
        console.error('订单处理失败:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
