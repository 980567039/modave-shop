import OrderPaymentStatus from '@/models/OrderPaymentStatus';
import crypto from 'crypto';
import moment from 'moment';

/**
 * Generates a hash signature for PayHere authentication using the official formula
 * @param {Object} params - Payment parameters
 * @returns {String} MD5 hash signature
 */
const generateSignature = (params) => {
    try {
        const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
        
        // Format amount with exactly 2 decimal places
        const formattedAmount = parseFloat(params.amount).toFixed(2);
        
        // First, hash the merchant secret using MD5 and convert to uppercase
        const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
        
        // Then, create the final hash using the formula from PayHere:
        // hash = md5(merchant_id + order_id + amount + currency + md5(merchant_secret))
        const dataToSign = 
            `${params.merchant_id}` +
            `${params.order_id}` +
            `${formattedAmount}` +
            `${params.currency}` +
            `${hashedSecret}`;
        
        // Log hash components for debugging (remove in production)
       
        
        // Generate final MD5 hash and convert to uppercase
        const hash = crypto.createHash('md5').update(dataToSign).digest('hex').toUpperCase();
        
        return hash;
    } catch (error) {
        console.error('Error generating PayHere signature:', error.message);
        throw error;
    }
};

const getLocationAfterDash = (str) => {
    const parts = str.split(" - ");
    return parts[1] || "Kadawatha";
};

/**
 * Generates PayHere payment parameters for checkout
 * @param {Object} order - Order object with customer and order details
 * @param {Number} amount - Payment amount
 * @returns {Object} PayHere parameters
 */
const generatePayherePayment = async (order, amount) => {
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
        
        // Get customer address based on fulfillment type
        const city = order?.fulfillmentType === "pickup" 
            ? getLocationAfterDash(order?.pickUpLocation) 
            : order?.billingAddress?.city || 'Kadawatha';
            
        const address = order?.fulfillmentType === "pickup" 
            ? order?.pickUpLocation 
            : order?.billingAddress?.street || 'Default Address';

        // Ensure amount is properly formatted with 2 decimal places (exactly as required by PayHere)
        const formattedAmount = parseFloat(amount).toFixed(2);

        // Ensure all string values are properly trimmed to avoid whitespace issues
        const params = {
            merchant_id: process.env.PAYHERE_MERCHANT_ID.trim(),
            return_url: `${process.env.NEXTAUTH_URL}/api/site/order/payment/payhere/validate`.trim(),
            cancel_url: `${process.env.NEXTAUTH_URL}/order-failed?orderId=${orderId}`.trim(),
            notify_url: `${process.env.NEXTAUTH_URL}/api/site/payment/payhere/notify`.trim(),
            order_id: order?.customOrderId,
            items: 'Order Payment'.trim(),
            currency: 'LKR'.trim(),
            amount: formattedAmount,
            first_name: (order?.billingAddress?.firstName || '').trim(),
            last_name: (order?.billingAddress?.lastName || '').trim(),
            email: (order?.billingAddress?.email || '').trim(),
            phone: (order?.billingAddress?.phone || '').trim(),
            address: address.trim(),
            city: city.trim(),
            country: 'Sri Lanka'.trim(),
            delivery_address: (order?.shippingAddress?.street || address).trim(),
            delivery_city: (order?.shippingAddress?.city || city).trim(),
            delivery_country: 'Sri Lanka'.trim(),
            custom_1: (order?.reference || '').trim(),
            custom_2: ''
        };

        // Generate hash after all parameters are set - using PayHere's official formula
        params.hash = generateSignature(params);

        // Create order payment status
        await OrderPaymentStatus.create({
            status: 'awaitingPayment',
            orderId: order?._id,
            statusDate: moment(new Date()),
            changeBy: "customer",
            customMessage: "Customer generated PayHere payment link",
            previousStatus: 'pending',
        });

        return params;
    } catch (error) {
        console.error('Error in generatePayherePayment:', error);

        // If there's an error, record the failed status
        await OrderPaymentStatus.create({
            status: 'failed',
            orderId: order?._id,
            statusDate: moment(new Date()),
            changeBy: "system",
            customMessage: `PayHere payment generation failed: ${error.message}`,
            previousStatus: 'pending',
        });

        throw error;
    }
};

export default generatePayherePayment;