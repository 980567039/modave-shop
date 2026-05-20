import OrderPaymentStatus from '@/models/OrderPaymentStatus';
import crypto from 'crypto';
import moment from 'moment';

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



const getLocationAfterDash = (str) => {
    const parts = str.split(" - ");
    return parts[1] || "Kadawatha";
};

const generateVisaPayment = async (order, amount) => {
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
        const orderId = getOrderId(order);

        const addressSet = {
            bill_to_address_line1: order?.fulfillmentType === "pickup" ? order?.pickUpLocation : order?.billingAddress?.street || 'Nuvie Clothing',
            bill_to_address_city: order?.fulfillmentType === "pickup" ? getLocationAfterDash(order?.pickUpLocation) : order?.billingAddress?.city || 'Kadawatha',
        };

        const params = {
            access_key: process.env.NEXT_PUBLIC_CYBERSOURCE_ACCESS_KEY,
            profile_id: process.env.NEXT_PUBLIC_CYBERSOURCE_PROFILE_ID,
            transaction_uuid: crypto.randomUUID(),
            signed_field_names: 'access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,amount,currency,signed_date_time,locale,transaction_type,reference_number,bill_to_forename,bill_to_email,bill_to_surname,bill_to_address_line1,bill_to_address_city,bill_to_address_country,payment_method',
            unsigned_field_names: '',
            signed_date_time: new Date().toISOString().split('.')[0] + 'Z',
            locale: 'en',
            transaction_type: 'sale',
            reference_number: orderId + '_' + Date.now().toString(),
            amount: amount,
            currency: 'LKR',
            bill_to_forename: order?.billingAddress?.firstName || '',
            bill_to_surname: order?.billingAddress?.lastName || '',
            bill_to_email: order?.billingAddress?.email || '',
            bill_to_address_country: "SL",
            payment_method: "card",
            ...addressSet
        };

        params.signature = generateSignature(params);

        await OrderPaymentStatus.create({
            status: 'awaitingPayment',
            orderId: order?._id,
            statusDate: moment(new Date()),
            changeBy: "customer",
            customMessage: "Customer generate payment link",
            previousStatus: 'pending',
        });

        return params;
    } catch (error) {
        console.error('Error in generateVisaPayment:', error);

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

export default generateVisaPayment;