// CyberSource 支付处理
import { NextResponse } from "next/server";
import crypto from 'crypto';
import Order from "@/models/Order";
import Product from "@/models/product/Product";
import OrderPayments from "@/models/OrderPayments";
import moment from "moment";
import OrderPaymentStatus from "@/models/OrderPaymentStatus";

const generateSignature = (params) => {
    try {
        const secretKey = process.env.CYBERSOURCE_SECRET_KEY;
        const signedFieldNames = params.signed_field_names.split(',');
        const dataToSign = signedFieldNames.map(key => `${key}=${params[key]}`).join(',');
        return crypto.createHmac('sha256', secretKey).update(dataToSign).digest('base64');
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

const getLocationAfterDash = (str) => {
    const parts = str.split(" - ");
    return parts[1] || "Kadawatha";
};

export const POST = async (req, res) => {
    const { id, shippingRate } = await req.json();
    const cookies = req.cookies;
    const lastOrder = cookies.get('lastOrder');
    const parseData = lastOrder?.value ? JSON.parse(lastOrder.value) : {};

    if (!id || Object.keys(parseData).length === 0) {
        return NextResponse.json({ error: "ID not found" }, { status: 400 });
    }

    try {
        if (!lastOrder) {
            return NextResponse.json({ error: "Order expired" }, { status: 400 });
        }

        if (parseData?.status !== "awaitingPayment") {
            return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
        }

        const getOrder = await Order.findById(parseData?.orderId);
        if (!getOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 400 });
        }

        const addressSet = {
            bill_to_address_line1: getOrder?.fulfillmentType === "pickup" ? getOrder?.pickUpLocation : getOrder?.billingAddress?.street || 'Nuvie Clothing',
            bill_to_address_city: getOrder?.fulfillmentType === "pickup" ? getLocationAfterDash(getOrder?.pickUpLocation) : getOrder?.billingAddress?.city || 'Kadawatha',
        };

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

        // Calculate amount with standard offer if applicable
        let discountedAmount = subtotal;
        if (!isGiftCardAvailable && getOrder?.typeOfOffer?.enabledOffer && !isHaveSalesItems) {
            const standardDiscount = subtotal * Number(getOrder?.typeOfOffer?.parentage) / 100;
            discountedAmount = subtotal - standardDiscount;
        }

        // Add shipping if applicable
        let finalAmount = discountedAmount;
        if (subtotal < 15000) {
            finalAmount += shippingRate;
        }

        const params = {
            access_key: process.env.NEXT_PUBLIC_CYBERSOURCE_ACCESS_KEY,
            profile_id: process.env.NEXT_PUBLIC_CYBERSOURCE_PROFILE_ID,
            transaction_uuid: crypto.randomUUID(),
            signed_field_names: 'access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,amount,currency,signed_date_time,locale,transaction_type,reference_number,bill_to_forename,bill_to_email,bill_to_surname,bill_to_address_line1,bill_to_address_city,bill_to_address_country,payment_method',
            unsigned_field_names: '',
            signed_date_time: new Date().toISOString().split('.')[0] + 'Z',
            locale: 'en',
            transaction_type: 'sale',
            reference_number: parseData?.orderId + '_' + Date.now().toString(),
            amount: finalAmount,
            currency: 'LKR',
            bill_to_forename: getOrder?.billingAddress?.firstName || '',
            bill_to_surname: getOrder?.billingAddress?.lastName || '',
            bill_to_email: getOrder?.billingAddress?.email || '',
            bill_to_address_country: "SL",
            payment_method: "card",
            ...addressSet
        };

        params.signature = generateSignature(params);

        await OrderPaymentStatus.create({
            status: 'awaitingPayment',
            orderId: parseData?.orderId,
            statusDate: moment(new Date()),
            changeBy: "customer",
            customMessage: "Customer generate payment link",
            previousStatus: 'pending',
        });

        return NextResponse.json({ ...params }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error }, { status: 400 });
    }
};