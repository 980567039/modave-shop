import OrderPaymentStatus from '@/models/OrderPaymentStatus';
import crypto from 'crypto';
import moment from 'moment';

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

const submitToKoko = async (paymentData) => {
    try {
        const kokoPaymentUrl = 'https://prodapi.paykoko.com/api/merchants/orderCreate'; // Add this to your env variables
        if (!kokoPaymentUrl) {
            throw new Error('KOKO payment URL is not configured');
        }

        const formData = new URLSearchParams();
        // Add all payment data to formData
        Object.entries(paymentData).forEach(([key, value]) => {
            formData.append(key, value?.toString() || '');
        });

        const response = await fetch(kokoPaymentUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
            redirect: 'follow'
        });

        // KOKO might respond with a redirect URL or payment information
        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            const errorData = await response.text();
            throw new Error(`KOKO payment submission failed: ${errorData}`);
        }
    } catch (error) {
        console.error('Error submitting to KOKO:', error);
        throw error;
    }
};



const generateKokoPayment = async (order, amount) => {
    // Safely handle ObjectId conversion
    const getOrderId = (order) => {
        if (!order?._id) {
            throw new Error('Order ID is required');
        }

        // Handle different types of _id
        if (typeof order._id === 'object') {
            // If it's a MongoDB ObjectId
            return order._id.toString();
        } else if (typeof order._id === 'string') {
            // If it's already a string
            return order._id;
        } else {
            throw new Error('Invalid order ID format');
        }
    };

    try {
        const orderId = order?.customOrderId;
        const mId = process.env.KOKO_MERCHANT_ID;
        const currency = 'LKR';
        const pluginName = "customapi";
        const pluginVersion = 1;
        const reference = `${mId}${Math.floor(Math.random() * (999 - 111 + 1) + 111)}-${orderId}`;

        // Safely access nested properties with optional chaining and defaults
        const firstName = order?.billingAddress?.firstName || '';
        const lastName = order?.billingAddress?.lastName || '';
        const email = order?.billingAddress?.email || '';

        const apiKey = process.env.KOKO_API_KEY;
        const baseUrl = process.env.NEXTAUTH_URL;

        if (!baseUrl) {
            throw new Error('NEXTAUTH_URL environment variable is not set');
        }

        const returnUrl = `${baseUrl}/api/site/order/payment/koko/validate`;
        const cancelUrl = `${baseUrl}/order-failed?orderId=${orderId}`;
        const responseUrl = `${baseUrl}/api/site/order/payment/koko/validate`;
        const description = "";

        const dataString = `${mId}${amount}${currency}${pluginName}${pluginVersion}${returnUrl}${cancelUrl}${orderId}${reference}${firstName}${lastName}${email}${description}${apiKey}${responseUrl}`;
        const signature = generateSignature(dataString);

        await OrderPaymentStatus.create({
            status: 'awaitingPayment',
            orderId: order?._id,
            statusDate: moment(new Date()),
            changeBy: "customer",
            customMessage: "Customer generate payment link",
            previousStatus: 'pending',
        });

        return {
            _mId: mId,
            api_key: apiKey,
            _returnUrl: returnUrl,
            _cancelUrl: cancelUrl,
            _responseUrl: responseUrl,
            _amount: amount,
            _currency: currency,
            _reference: reference,
            _orderId: order?.customOrderId,
            _pluginName: pluginName,
            _pluginVersion: pluginVersion,
            _description: description,
            _firstName: firstName,
            _lastName: lastName,
            _email: email,
            dataString: dataString,
            signature: signature,
        };
    } catch (error) {
        console.error('Error in generateKokoPayment:', error);

        // If there's an error, you might want to handle the failed status
        await OrderPaymentStatus.create({
            status: 'failed',
            orderId: order?._id,
            statusDate: moment(new Date()),
            changeBy: "system",
            customMessage: `Payment generation failed: ${error.message}`,
            previousStatus: 'pending',
        });

        throw error;
    }
};

export default generateKokoPayment;