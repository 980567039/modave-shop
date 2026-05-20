// 跨站支付回调
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import Order from "@/models/Order";
import OrderPaymentStatus from "@/models/OrderPaymentStatus";
import OrderPayments from "@/models/OrderPayments";
import OrderStatus from "@/models/OrderStatus";
import moment from "moment";

import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    const token = searchParams.get('token'); // PayPal token
    const PayerID = searchParams.get('PayerID');
    const sessionId = searchParams.get('session_id'); // Stripe session ID

    if (!orderId || (!token && !sessionId)) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    try {
        let isSuccess = false;
        let message = '';

        if (sessionId) {
            // Stripe Verification
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            isSuccess = session.payment_status === 'paid';
            message = isSuccess ? 'Stripe payment completed via Cross-Site flow' : 'Stripe payment failed';
        } else if (token && PayerID) {
            // PayPal Verification
            const tokenResponse = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64')}`
                },
                body: 'grant_type=client_credentials'
            });

            const tokenData = await tokenResponse.json();
            if (!tokenData.access_token) {
                throw new Error('Failed to get PayPal access token');
            }

            const captureResponse = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders/${token}/capture`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenData.access_token}`
                }
            });

            const captureData = await captureResponse.json();
            isSuccess = captureData.status === 'COMPLETED';
            message = isSuccess ? 'PayPal payment completed via Cross-Site flow' : 'PayPal payment failed';
        }

        // 2. Update Site B Order Status
        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        const status = isSuccess ? 'confirmPayment' : 'paymentFailed';

        await Promise.all([
            Order.updateOne({ _id: orderId }, { $set: { status, paymentStatus: status } }),
            OrderStatus.create({
                status,
                orderId,
                statusDate: moment(new Date()),
                changeBy: "customer",
                customMessage: message,
                previousStatus: 'awaitingPayment',
            }),
            OrderPaymentStatus.create({
                status,
                orderId,
                statusDate: moment(new Date()),
                changeBy: "customer",
                customMessage: message,
                previousStatus: 'awaitingPayment',
            })
        ]);

        // 3. Redirect back to Site A
        const returnUrl = order.crossSiteReturnUrl;
        if (!returnUrl) {
            throw new Error('Return URL not found in order');
        }

        const redirectUrl = new URL(returnUrl);
        redirectUrl.searchParams.append('status', isSuccess ? 'success' : 'failed');
        redirectUrl.searchParams.append('message', message);

        if (order.customOrderId) {
            redirectUrl.searchParams.append('orderId', order.customOrderId);
        }

        return NextResponse.redirect(redirectUrl.toString());

    } catch (error) {
        console.error('Error in cross-site callback:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
