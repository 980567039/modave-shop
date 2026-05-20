// PayHere 支付验证
import { NextResponse } from "next/server";
import querystring from 'querystring';
import crypto from 'crypto';
import Order from "@/models/Order";
import OrderPayments from "@/models/OrderPayments";
import OrderStatus from "@/models/OrderStatus";
import moment from "moment";
import { cookies } from "next/headers";
import OrderPaymentStatus from "@/models/OrderPaymentStatus";
import Store from "@/models/Store";

export const GET = async (req) => {
    const cookiesList = cookies();
    const { searchParams } = new URL(req.url);

    const orderId = searchParams.get('order_id');

    const cookieMaxAge = process.env.COOKIE_MAX_AGE || 15;

    // const retrievalApi = 'https://sandbox.payhere.lk/merchant/v1/oauth/token';
    const retrievalApi = 'https://www.payhere.lk/merchant/v1/oauth/token';

    // const searchOrderApi = 'https://sandbox.payhere.lk/merchant/v1/payment/search?order_id=';
    const searchOrderApi = 'https://www.payhere.lk/merchant/v1/payment/search?order_id=';

    if (!orderId) {
        return res.status(400).json({ error: 'Missing order_id parameter' });
    }


    // Check the initial status from the query (useful for redirect cases)
    const responses = {
        statusMessage: '',
        paymentDetails: {},
        return: {},
        orderStatus: ''
    };

    try {
        // const payhereAuth = "NEo5TUlmWWYwblI0RHZtUUZFbTc0WjNzWVdicGJVT0VqMTd1R25LQ1Q4STo4Y0swU1hiZ05DejhXenpGdk1EZ0pCOExQdldGU1E2UjU0a3FsbHA0ZkpYRw==";

        // Step 3: Get access token
        // const tokenResponse = await fetch(retrievalApi, {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Basic NEo5TUlmWWYwblI0RHZtUUZFbTc0WjNzWVdicGJVT0VqMTd1R25LQ1Q4STo4Y0swU1hiZ05DejhXenpGdk1EZ0pCOExQdldGU1E2UjU0a3FsbHA0ZkpYRw==`,
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //     },
        //     body: 'grant_type=client_credentials'
        // });

        // const tokenData = await tokenResponse.json();

        // console.log("tokenData ===", tokenData);



        // if (!tokenData.access_token) {
        //     return NextResponse.json({ error: 'Missing required parameters', details: tokenData }, { status: 400 });
        // }

        // // Step 4: Use the access token to get payment details
        // const paymentUrl = `${searchOrderApi}${orderId}`;
        // const paymentResponse = await fetch(paymentUrl, {
        //     method: 'GET',
        //     headers: {
        //         'Authorization': `Bearer ${tokenData.access_token}`,
        //         'Content-Type': 'application/json'
        //     }
        // });

        // const paymentData = await paymentResponse.json();

        // console.log("paymentData ===", paymentData);


        // if (paymentData.data[0] && Object.keys(paymentData.data[0]).length !== 0) {

        // const { status } = paymentData.data[0];
        // console.log("status===", status);

        // if (status === 'RECEIVED') {
        //     console.log("Payment is approved");
        //     responses.statusMessage = `Payhere payment successful! Order status has been updated from {{PREV_STATUS}} to {{CURRENT_STATUS}}.`
        //     responses.return = { message: 'Payment is approved', status: 200 }
        //     responses.orderStatus = 'confirmPayment'
        // } else {
        //     console.log("Payment status unknown");
        //     responses.statusMessage = `Payhere payment is declined! Order status has been updated from {{PREV_STATUS}} to {{CURRENT_STATUS}}.`
        //     responses.return = { message: 'Payment Issue', status: 400 }
        //     responses.orderStatus = 'paymentFailed';
        // }

        console.log("Payment is approved");
        responses.statusMessage = `Payhere payment successful! Order status has been updated from {{PREV_STATUS}} to {{CURRENT_STATUS}}.`
        responses.return = { message: 'Payment is approved', status: 200 }
        responses.orderStatus = 'confirmPayment';
        

        const [order, store] = await Promise.all([
            Order.findOne({ customOrderId: orderId }).lean(),
            Store.find().lean(),
        ]);

        if (orderId) {

            const getDBOrderId = order?._id;
            
            await Promise.all([
                Order.updateOne(
                    { customOrderId: orderId },
                    {
                        $set: {
                            status: responses.orderStatus,
                            paymentStatus: responses.orderStatus
                        },
                    }
                ),
                OrderStatus.create({
                    status: responses.orderStatus,
                    orderId: getDBOrderId,
                    statusDate: moment(new Date()),
                    changeBy: "customer",
                    customMessage: responses.statusMessage,
                    previousStatus: 'awaitingPayment',
                }),
                OrderPaymentStatus.create({
                    status: responses.orderStatus,
                    orderId: getDBOrderId,
                    statusDate: moment(new Date()),
                    changeBy: "customer",
                    customMessage: responses.statusMessage,
                    previousStatus: 'awaitingPayment',
                }),
                OrderPayments.updateOne(
                    { orderId: getDBOrderId },
                    {
                        $set: {
                            paymentData: {}, // paymentData.data[0] ||
                            status: responses?.orderStatus,
                            paymentDate: moment(new Date())
                        },
                    }
                ),
            ]);

            const redirectUrl = `${process.env.NEXTAUTH_URL}/order-confirm?orderId=${getDBOrderId}`;
            const failedRedirectUrl = `${process.env.NEXTAUTH_URL}/order-failed?orderId=${getDBOrderId}`;

            const cookieValue = JSON.stringify({
                orderId: getDBOrderId.toString(),
                status: responses.orderStatus || 'pending',
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

            if (responses.return?.status === 200) {
                cookiesList.set('lastOrder', cookieValue, { path: '/', maxAge: cookieMaxAge });

                return new Response(null, {
                    status: 302, // 302 Found is a common status for temporary redirects
                    headers: {
                        'Location': redirectUrl,
                        'Set-Cookie': `lastOrder=${cookieValue}; Path=/; HttpOnly; Max-Age=${cookieMaxAge}`,
                    },
                });
            } else {
                cookiesList.set('lastOrder', '', { path: '/', maxAge: 0 });

                return new Response({
                    message: responses?.return.message
                }, {
                    status: 302, // 302 Found is a common status for temporary redirects
                    headers: {
                        'Location': failedRedirectUrl,
                        'Set-Cookie': `lastOrder=; Path=/; HttpOnly; Max-Age=0`,
                    },
                });
            }
        } else {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }
        // } else {
        //     return NextResponse.json({ error: 'Missing order data' }, { status: 400 });
        // }


        // return res.status(200).json(paymentData);
    } catch (error) {
        console.error("Error fetching from PayHere:", error);
        return NextResponse.json({ error: 'Failed to retrieve payment information' }, { status: 400 });
    }

};