// CyberSource 支付验证
import { NextResponse } from "next/server";
import querystring from 'querystring';
import crypto from 'crypto';
import Order from "@/models/Order";
import OrderPayments from "@/models/OrderPayments";
import OrderStatus from "@/models/OrderStatus";
import moment from "moment";
import { cookies } from "next/headers";
import OrderPaymentStatus from "@/models/OrderPaymentStatus";

export const POST = async (req) => {
    const contentType = req.headers.get('content-type');
    const cookiesList = cookies();
    const lastOrder = cookiesList.get('lastOrder');
    const cookieMaxAge = process.env.COOKIE_MAX_AGE || 15;

    const parseData = lastOrder?.value ? JSON.parse(lastOrder.value) : {};

    let data;

    if (contentType === 'application/x-www-form-urlencoded') {
        // Parse URL-encoded data
        const rawBody = await req.text();
        data = querystring.parse(rawBody);
    } else if (contentType === 'application/json') {
        // Parse JSON data
        data = await req.json();
    } else {
        return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
    }


    // Extract the signature sent by CyberSource
    const signatureSentByCyberSource = data.signature;
    delete data.signature; // Remove signature from the data before recreating it

    // Get the signed_field_names from the data and split them into an array
    const signedFieldNames = data.signed_field_names.split(',');

    // Recreate the string to sign based on signed_field_names
    const stringToSign = signedFieldNames.map(key => `${key}=${data[key]}`).join(',');



    // Generate the HMAC SHA256 signature
    const secretKey = process.env.CYBERSOURCE_SECRET_KEY; // Use the server-side environment variable
    if (!secretKey) {
        console.error('Secret key is not defined');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const generatedSignature = crypto.createHmac('sha256', secretKey)
        .update(stringToSign)
        .digest('base64');


    // Compare the signatures
    if (generatedSignature !== signatureSentByCyberSource) {
        console.log("Payment is invalid: Signature mismatch");
        return NextResponse.json({ status: 'Payment is invalid', reason: 'Signature mismatch' }, { status: 400 });
    }

    const responses = {
        statusMessage: '',
        paymentDetails: data,
        return: {},
        orderStatus: ''
    }; 


    const { req_reference_number } = data;
    const orderId = req_reference_number.split('_')[0];


    // Check payment decision
    if (data.decision === 'ACCEPT') {
        console.log("Payment is approved");
        responses.statusMessage = `Visa card payment successful! Order status has been updated from {{PREV_STATUS}} to {{CURRENT_STATUS}}.`
        responses.return = { message: 'Payment is approved', status: 200 }
        responses.orderStatus = 'confirmPayment'
    } else if (data.decision === 'DECLINE') {
        console.log("Payment is declined");
        responses.statusMessage = `Visa card payment is declined! Order status has been updated from {{PREV_STATUS}} to {{CURRENT_STATUS}}.`
        responses.return = { message: data.message, status: 400 }
        responses.orderStatus = 'paymentFailed';
    } else if (data.decision === 'CANCEL') {
        console.log("Payment is CANCEL");
        responses.statusMessage = `The consumer cancelled the transaction! Order status has been updated from {{PREV_STATUS}} to {{CURRENT_STATUS}}.`
        responses.return = { message: data.message, status: 400 }
        responses.orderStatus = 'paymentCancel';
    } else {
        console.log("Payment status unknown");
        responses.statusMessage = `Visa card payment is declined! Order status has been updated from {{PREV_STATUS}} to {{CURRENT_STATUS}}.`
        responses.return = { message: data.message, status: 400 }
        responses.orderStatus = 'paymentFailed';
    }

    if (orderId) {
        await Promise.all([
            Order.updateOne(
                { _id: orderId },
                {
                    $set: {
                        status: responses.orderStatus,
                        paymentStatus: responses.orderStatus
                    },
                }
            ),
            OrderStatus.create({
                status: responses.orderStatus,
                orderId: orderId,
                statusDate: moment(new Date()),
                changeBy: "customer",
                customMessage: responses.statusMessage,
                previousStatus: parseData?.status,
            }),

            OrderPaymentStatus.create({
                status: responses.orderStatus,
                orderId: orderId,
                statusDate: moment(new Date()),
                changeBy: "customer",
                customMessage: responses.statusMessage,
                previousStatus: parseData?.status,
            }),

            OrderPayments.updateOne(
                { orderId: orderId },
                {
                    $set: {
                        paymentData: data,
                        status: responses.return.message,
                        paymentDate: moment(new Date())
                    },
                }
            ),
        ]);

        const redirectUrl = `${process.env.NEXTAUTH_URL}/order-confirm?orderId=${orderId}`;
        const failedRedirectUrl = `${process.env.NEXTAUTH_URL}/order-failed?orderId=${orderId}`;

        const cookieValue = JSON.stringify({
            ...parseData,
            status: responses.orderStatus || 'pending',
            timestamp: Date.now(),
        });


        if(responses.return?.status === 200){
            cookiesList.set('lastOrder', cookieValue, { path: '/', maxAge: cookieMaxAge });

            return new Response(null, {
                status: 302, // 302 Found is a common status for temporary redirects
                headers: {
                    'Location': redirectUrl,
                    'Set-Cookie': `lastOrder=${cookieValue}; Path=/; HttpOnly; Max-Age=${cookieMaxAge}`,
                },
            });
        } else{
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
    }
};