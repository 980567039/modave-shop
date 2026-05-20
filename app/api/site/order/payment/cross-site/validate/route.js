// 跨站支付验证
export const dynamic = 'force-dynamic';

import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Order from "@/models/Order";
import OrderPayments from "@/models/OrderPayments";
import OrderStatus from "@/models/OrderStatus";
import moment from "moment";
import { cookies } from "next/headers";
import OrderPaymentStatus from "@/models/OrderPaymentStatus";
import Store from "@/models/Store";

export async function GET(req) {
    const cookiesList = cookies();
    const { searchParams } = new URL(req.url);

    const status = searchParams.get('status');
    const orderId = searchParams.get('orderId');
    const message = searchParams.get('message');

    const cookieMaxAge = process.env.COOKIE_MAX_AGE || 15;

    if (!orderId || !status) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    try {
        const isSuccess = status === 'success';
        const orderStatus = isSuccess ? 'confirmPayment' : 'paymentFailed';
        const statusMessage = message || (isSuccess ? 'Payment completed successfully via external site.' : 'Payment failed on external site.');

        let query = {};
        if (mongoose.Types.ObjectId.isValid(orderId)) {
            query = { $or: [{ _id: orderId }, { customOrderId: orderId }] };
        } else {
            query = { customOrderId: orderId };
        }

        // Get Order and Store data
        const [order, store] = await Promise.all([
            Order.findOne(query).lean(),
            Store.find().lean(),
        ]);

        if (order) {
            const getDBOrderId = order._id;

            // Update Order Status
            await Promise.all([
                Order.updateOne(
                    { _id: getDBOrderId },
                    {
                        $set: {
                            status: orderStatus,
                            paymentStatus: orderStatus
                        },
                    }
                ),
                OrderStatus.create({
                    status: orderStatus,
                    orderId: getDBOrderId,
                    statusDate: moment(new Date()),
                    changeBy: "customer",
                    customMessage: statusMessage,
                    previousStatus: 'awaitingPayment',
                }),
                OrderPaymentStatus.create({
                    status: orderStatus,
                    orderId: getDBOrderId,
                    statusDate: moment(new Date()),
                    changeBy: "customer",
                    customMessage: statusMessage,
                    previousStatus: 'awaitingPayment',
                }),
                OrderPayments.updateOne(
                    { orderId: getDBOrderId },
                    {
                        $set: {
                            status: orderStatus,
                            paymentDate: moment(new Date())
                        },
                    }
                ),
            ]);

            // Redirect URLs
            const redirectUrl = `${process.env.NEXTAUTH_URL}/order-confirm?orderId=${getDBOrderId}`;
            const failedRedirectUrl = `${process.env.NEXTAUTH_URL}/order-failed?orderId=${getDBOrderId}`;

            // Prepare Cookie
            const cookieValue = JSON.stringify({
                orderId: getDBOrderId.toString(),
                status: orderStatus,
                timestamp: Date.now(),
                paymentType: order.payment,
                user: order.user,
                totalAmount: order?.totalOrderAmount || 0,
                shipping: order?.shippingTotal || 0,
                orderStatus: order?.orderStatus || '',
                fulfillmentType: order?.fulfillmentType,
                pickupDate: order?.pickupDate || '',
                items: [],
                enabledOffers: store[0]?.offers?.enabledOffer || false,
                typeOfOffer: store[0]?.offers || {},
            });

            if (isSuccess) {
                cookiesList.set('lastOrder', cookieValue, { path: '/', maxAge: cookieMaxAge });

                return new Response(null, {
                    status: 302,
                    headers: {
                        'Location': redirectUrl,
                        'Set-Cookie': `lastOrder=${cookieValue}; Path=/; HttpOnly; Max-Age=${cookieMaxAge}`,
                    },
                });
            } else {
                cookiesList.set('lastOrder', '', { path: '/', maxAge: 0 });

                return new Response(null, {
                    status: 302,
                    headers: {
                        'Location': failedRedirectUrl,
                        'Set-Cookie': `lastOrder=; Path=/; HttpOnly; Max-Age=0`,
                    },
                });
            }
        } else {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
    } catch (error) {
        console.error("Error processing cross-site payment callback:", error);
        return NextResponse.json({ error: 'Payment processing failed', message: error.message }, { status: 500 });
    }
}
