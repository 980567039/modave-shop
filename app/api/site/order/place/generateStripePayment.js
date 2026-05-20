import OrderPaymentStatus from '@/models/OrderPaymentStatus';
import moment from 'moment';
import Stripe from 'stripe';
import Product from "@/models/product/Product";

// 获取产品价格函数
const getProductPrice = (cartItems, dbProduct) => {
  return cartItems.map(item => {
    const matchedAttribute = dbProduct.attributes.find(attr => {
      const hasSize = attr.attributes.size?.value;
      const hasColor = attr.attributes.color?.value;
      const sizeMatch = hasSize ? attr.attributes.size.value === item.size : true;
      const colorMatch = hasColor ? attr.attributes.color.value === item.color : true;
      return sizeMatch && colorMatch;
    });

    if (matchedAttribute) {
      item.price = Number(matchedAttribute.price || dbProduct.price);
      item.stock = matchedAttribute.stock;
    } else {
      item.price = Number(dbProduct.price)
    }
    return item;
  });
};

/**
 * 生成 Stripe 支付会话
 * @param {Object} order - 订单对象
 * @param {Number} amount - 支付金额
 * @param {Number} shippingRate - 运费
 * @returns {Object} Stripe 会话信息
 */
const generateStripePayment = async (order, amount, shippingRate = 0) => {
    // 安全处理 ObjectId 转换
    const getOrderId = (order) => {
        if (!order?._id) {
            throw new Error('Order ID is required');
        }

        // 处理不同类型的 _id
        if (typeof order._id === 'object') {
            // 如果是 MongoDB ObjectId
            return order._id.toString();
        } else if (typeof order._id === 'string') {
            // 如果已经是字符串
            return order._id;
        } else {
            throw new Error('Invalid order ID format');
        }
    };

    try {
        const orderId = order?.customOrderId;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const baseUrl = process.env.NEXTAUTH_URL;

        if (!baseUrl) {
            throw new Error('NEXTAUTH_URL environment variable is not set');
        }

        // 更新产品价格
        if (order?.items?.length > 0) {
            const updatedItems = await Promise.all(order.items.map(async (product) => {
                const getDBProducts = await Product.findOne({ _id: product?.productId });
                if (getDBProducts) {
                    const updatedProduct = getProductPrice([product], getDBProducts);
                    return updatedProduct[0];
                }
                return product;
            }));
            order.items = updatedItems;
        }

        // 安全访问嵌套属性并提供默认值
        const firstName = order?.billingAddress?.firstName || '';
        const lastName = order?.billingAddress?.lastName || '';
        const email = order?.billingAddress?.email || '';

        // 创建 Stripe 支付项目
        const lineItems = order?.items?.map(item => {
            const unitAmount = Math.round((Number(item.salePrice) || item.price) * 100);
            if (isNaN(unitAmount)) {
                throw new Error(`Invalid price for item: ${item.name}`);
            }
            const imageUrl = item.image ? (item.image.startsWith('http') ? item.image : `${baseUrl}${item.image}`) : null;
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name || item.title || item.slug || 'Product',
                        images: imageUrl ? [imageUrl] : [],
                    },
                    unit_amount: unitAmount,
                },
                quantity: item.quantity,
            };
        }) || [];

        if (lineItems.length === 0) {
            throw new Error('Cannot create a payment for an empty order.');
        }

        // 计算小计
        const subtotal = order?.items?.reduce((total, item) => {
            return total + ((Number(item.salePrice) || item.price) * item.quantity);
        }, 0);

        // 添加运费
        const shouldAddShipping = subtotal < 15000 && shippingRate > 0;
        if (shouldAddShipping) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Shipping',
                    },
                    unit_amount: Math.round(shippingRate * 100),
                },
                quantity: 1,
            });
        }

        // 创建 Stripe Checkout 会话
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${baseUrl}/api/site/order/payment/stripe/validate?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
            cancel_url: `${baseUrl}/order-failed?orderId=${orderId}`,
            customer_email: email,
            client_reference_id: orderId,
            metadata: {
                orderId: orderId,
                customerName: `${firstName} ${lastName}`.trim(),
            },
        });

        // 创建订单支付状态
        await OrderPaymentStatus.create({
            status: 'awaitingPayment',
            orderId: order?._id,
            statusDate: moment(new Date()),
            changeBy: "customer",
            customMessage: "Customer generated Stripe payment link",
            previousStatus: 'pending',
        });

        return {
            sessionId: session.id,
            url: session.url,
            redirectUrl: session.url,
            amount: amount,
            currency: 'USD',
            orderId: orderId,
        };
    } catch (error) {
        console.error('Error in generateStripePayment:', error);

        // 如果出错，记录失败状态
        await OrderPaymentStatus.create({
            status: 'failed',
            orderId: order?._id,
            statusDate: moment(new Date()),
            changeBy: "system",
            customMessage: `Stripe payment generation failed: ${error.message}`,
            previousStatus: 'pending',
        });

        throw error;
    }
};

export default generateStripePayment;
