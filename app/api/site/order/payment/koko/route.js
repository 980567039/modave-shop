// Koko 支付处理
import { NextResponse } from "next/server";
import crypto from 'crypto';
import Order from "@/models/Order";
import Product from "@/models/product/Product";
import OrderPaymentStatus from "@/models/OrderPaymentStatus";
import moment from "moment";

const generateSignature = (dataString) => {
    try {
        const privateKey = process.env.KOKO_PRIVATE_KEY.replace(/\\n/g, '\n');
        const signer = crypto.createSign('RSA-SHA256');
        signer.update(dataString);
        signer.end();
        return signer.sign(privateKey, 'base64');
    } catch (error) {
        console.error('Error generating signature:', error.message);
        throw error;
    }
};

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

export const POST = async (req, res) => {
    const { id, shippingRate } = await req.json();

    if (!id) {
        return NextResponse.json({ error: "ID not found" }, { status: 400 });
    }

    try {
        const cookies = req.cookies;
        const lastOrder = cookies.get('lastOrder');
        const parseData = lastOrder?.value ? JSON.parse(lastOrder.value) : {};


        if (!parseData || parseData?.status !== "awaitingPayment") {
            return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
        }

        const getOrder = await Order.findById(parseData?.orderId);
        if (!getOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 400 });
        }

        // Update product prices
        if (getOrder?.items?.length > 0) {
            const updatedItems = await Promise.all(getOrder.items.map(async (product) => {
                const getDBProducts = await Product.findOne({ _id: product?.productId });
                if (getDBProducts) {
                    const updatedProduct = getProductPrice([product], getDBProducts);
                    return updatedProduct[0];
                }
                return product;
            }));
            getOrder.items = updatedItems;
        }

        // Calculate subtotal
        const subtotal = getOrder?.items?.reduce((total, item) => {
            return total + ((Number(item.salePrice) || item.price) * item.quantity);
        }, 0);

        const isHaveSalesItems = getOrder?.items?.some((d) => (d.salePrice !== null && d.salePrice !== 0));
        const isGiftCardAvailable = getOrder?.items?.some((d) => d.isGiftCard);

        // Calculate standard discount first if applicable
        let discountedAmount = subtotal;
        if (!isGiftCardAvailable && getOrder?.typeOfOffer?.enabledOffer && !isHaveSalesItems) {
            const standardDiscount = subtotal * Number(getOrder?.typeOfOffer?.parentage) / 100;
            discountedAmount = subtotal - standardDiscount;
        }

        // Add shipping if applicable
        const shouldAddShipping = subtotal < 15000;
        let finalAmount = discountedAmount;
        if (shouldAddShipping) {
            finalAmount += shippingRate;
        }

        // Apply Koko offer only if standard offer is not applied
        if (!getOrder?.typeOfOffer?.enabledOffer && getOrder?.typeOfOffer?.enabledKokoOffer && !isHaveSalesItems) {
            const kokoDiscount = Math.min(
                finalAmount * getOrder?.typeOfOffer?.kokoParentage / 100,
                2500
            );
            finalAmount = finalAmount - kokoDiscount;
        }

        // Prepare Koko payment request
        const mId = process.env.KOKO_MERCHANT_ID;
        const currency = 'LKR';
        const pluginName = "customapi";
        const pluginVersion = 1;
        const reference = mId + Math.floor(Math.random() * (999 - 111 + 1) + 111) + '-' + id;
        const firstName = getOrder?.billingAddress?.firstName || '';
        const lastName = getOrder?.billingAddress?.lastName || '';
        const email = getOrder?.billingAddress?.email;
        const apiKey = process.env.KOKO_API_KEY;
        const returnUrl = process.env.NEXTAUTH_URL + '/api/site/order/payment/koko/validate';
        const cancelUrl = process.env.NEXTAUTH_URL + "/order-failed?orderId=" + id;
        const responseUrl = process.env.NEXTAUTH_URL + '/api/site/order/payment/koko/validate';
        const description = "";

        const dataString = `${mId}${finalAmount}${currency}${pluginName}${pluginVersion}${returnUrl}${cancelUrl}${id}${reference}${firstName}${lastName}${email}${description}${apiKey}${responseUrl}`;
        const signature = generateSignature(dataString);

        const requestBody = {
            _mId: mId,
            api_key: apiKey,
            _returnUrl: returnUrl,
            _cancelUrl: cancelUrl,
            _responseUrl: responseUrl,
            _amount: finalAmount,
            _currency: currency,
            _reference: reference,
            _orderId: id,
            _pluginName: pluginName,
            _pluginVersion: pluginVersion,
            _description: description,
            _firstName: firstName,
            _lastName: lastName,
            _email: email,
            dataString: dataString,
            signature: signature,
        };

        await OrderPaymentStatus.create({
            status: 'awaitingPayment',
            orderId: parseData?.orderId,
            statusDate: moment(new Date()),
            changeBy: "customer",
            customMessage: "Customer generate payment link",
            previousStatus: 'pending',
        });

        return NextResponse.json({ ...requestBody }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error }, { status: 400 });
    }
};