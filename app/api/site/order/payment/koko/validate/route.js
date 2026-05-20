// Koko 支付验证
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import crypto from 'crypto';
import Order from "@/models/Order";
import OrderStatus from "@/models/OrderStatus";
import moment from "moment";
import OrderPayments from "@/models/OrderPayments";
import { cookies } from "next/headers";
import OrderPaymentStatus from "@/models/OrderPaymentStatus";
import Store from "@/models/Store";


// Function to generate the signature
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


const validateKokoPayment = async (id) => {
    const mId = process.env.KOKO_MERCHANT_ID;
    const apiKey = process.env.KOKO_API_KEY;
    const pluginName = "customapi";
    const pluginVersion = "1";

    // Generate signature data string
    const dataString = `${mId}${pluginName}${pluginVersion}${id}${apiKey}`;
    const signature = generateSignature(dataString);

    const requestBody = new URLSearchParams({
        _mId: mId,
        api_key: apiKey,
        _orderId: id,
        _pluginName: pluginName,
        _pluginVersion: pluginVersion,
        signature: signature,
    });

    // Make request to KOKO API
    // const resUrl = 'https://qaapi.paykoko.com/api/merchants/orderView';

    const resUrl = 'https://prodapi.paykoko.com/api/merchants/orderView'

    const response = await fetch(resUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestBody.toString(),
    });

    if (!response.ok) {
        return response.status
    }

    const kokoResponse = await response.json();

    return kokoResponse;
}

// // Function to verify the signature
// const verifySignature = (dataString, signature, publicKey) => {
//     try {
//         const verifier = crypto.createVerify('RSA-SHA256');
//         verifier.update(dataString);
//         verifier.end();

//         const isValid = verifier.verify(publicKey, signature, 'base64');
//         return isValid;
//     } catch (error) {
//         console.error('Error verifying signature:', error.message);
//         throw error;
//     }
// };

export const GET = async (req, res) => {
    try {
        // Extract query parameters from the URL
        const cookiesList = cookies();
        const { searchParams } = new URL(req.url);
        const trnId = searchParams.get('trnId');
        const orderId = searchParams.get('orderId');

        const status = searchParams.get('status');

        const cookieMaxAge = process.env.COOKIE_MAX_AGE || 15;

        const lastOrder = cookiesList.get('lastOrder');

        const parseData = lastOrder?.value ? JSON.parse(lastOrder.value) : {};

        // Validate required parameters
        if (!trnId || !orderId || !status) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // Check the initial status from the query (useful for redirect cases)
        const responses = {
            statusMessage: '',
            paymentDetails: {
                trnId,
            },
            return: {},
            orderStatus: ''
        };

        const getOrderCUstomId = await Order.findOne({ customOrderId: orderId }).lean();

        if(getOrderCUstomId) {
            const getKokoValidation = await validateKokoPayment(getOrderCUstomId?.customOrderId);
    
    
            if (getKokoValidation && Object.keys(getKokoValidation).length !== 0) {
    
                const { content } = getKokoValidation;
    
                if (content?.status === 'SUCCESS') {
                    console.log("Payment is approved");
                    responses.statusMessage = `KOKO payment successful! Order status has been updated from {{PREV_STATUS}} to {{CURRENT_STATUS}}.`
                    responses.return = { message: 'Payment is approved', status: 200 }
                    responses.orderStatus = 'confirmPayment'
                } else if (content?.status === 'DECLINE') {
                    console.log("Payment is declined");
                    responses.statusMessage = `KOKO payment is declined! Order status has been updated from {{PREV_STATUS}} to {{CURRENT_STATUS}}.`
                    responses.return = { message: data.message, status: 400 }
                    responses.orderStatus = 'paymentFailed';
                } else {
                    console.log("Payment status unknown");
                    responses.statusMessage = `KOKO payment is declined! Order status has been updated from {{PREV_STATUS}} to {{CURRENT_STATUS}}.`
                    responses.return = { message: data.message, status: 400 }
                    responses.orderStatus = 'paymentFailed';
                }

                const dbOrderId = getOrderCUstomId?._id;
    
    
                const [order, store] = await Promise.all([
                    Order.findOne({ _id: dbOrderId }),
                    Store.find().lean(),
                ]);
    
                
    
    
                if (dbOrderId) {
                    await Promise.all([
                        Order.updateOne(
                            { _id: dbOrderId },
                            {
                                $set: {
                                    status: responses.orderStatus,
                                    paymentStatus: responses.orderStatus
                                },
                            }
                        ),
                        OrderStatus.create({
                            status: responses.orderStatus,
                            orderId: dbOrderId,
                            statusDate: moment(new Date()),
                            changeBy: "customer",
                            customMessage: responses.statusMessage,
                            previousStatus: 'awaitingPayment',
                        }),
                        OrderPaymentStatus.create({
                            status: responses.orderStatus,
                            orderId: dbOrderId,
                            statusDate: moment(new Date()),
                            changeBy: "customer",
                            customMessage: responses.statusMessage,
                            previousStatus: 'awaitingPayment',
                        }),
                        OrderPayments.updateOne(
                            { orderId: dbOrderId },
                            {
                                $set: {
                                    paymentData: responses.paymentDetails || {},
                                    status: responses.return.message,
                                    paymentDate: moment(new Date())
                                },
                            }
                        ),
                    ]);
    
                    const redirectUrl = `${process.env.NEXTAUTH_URL}/order-confirm?orderId=${dbOrderId}`;
                    const failedRedirectUrl = `${process.env.NEXTAUTH_URL}/order-failed?orderId=${dbOrderId}`;
    
                    const cookieValue = JSON.stringify({
                        orderId: dbOrderId.toString(),
                        status: responses.orderStatus || 'pending',
                        timestamp: Date.now(),
                        paymentType: order.payment,
                        user: order.user,
                        totalAmount: order?.totalOrderAmount || 0,
                        shipping: order?.shippingTotal || 0,
                        orderStatus: order?.orderStatus || '',
                        fulfillmentType:  order?.fulfillmentType,
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
            } else {
                return new Response({
                    message: "Order data not found!"
                }, {
                    status: 302, // 302 Found is a common status for temporary redirects
                    headers: {
                        'Location': `${process.env.NEXTAUTH_URL}/order-failed`,
                        'Set-Cookie': `lastOrder=; Path=/; HttpOnly; Max-Age=0`,
                    },
                });
            }
        }




    } catch (error) {
        console.error('Payment validation error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};