import OrderPaymentStatus from '@/models/OrderPaymentStatus';
import Product from '@/models/product/Product';
import moment from 'moment';

/**
 * Generate Cross-Site Payment URL
 * Redirects to Site B for payment processing
 * @param {Object} order - Order object
 * @param {Number} amount - Total amount
 * @param {String} paymentType - Payment type (paypal, stripe)
 * @returns {Object} Payment parameters with redirect URL
 */
const generateCrossSitePayment = async (order, amount, paymentType = 'paypal') => {
    try {
        const paymentSiteUrl = process.env.NEXT_PUBLIC_PAYMENT_SITE_URL;
        const originSiteUrl = process.env.NEXT_PUBLIC_ORIGIN_SITE_URL || process.env.NEXTAUTH_URL;

        if (!paymentSiteUrl) {
            throw new Error('NEXT_PUBLIC_PAYMENT_SITE_URL is not defined');
        }

        // Fetch products to get mappedSku
        const itemsWithSku = await Promise.all(order.items.map(async (item) => {
            const product = await Product.findById(item.productId).select('mappedSku sku');
            return {
                ...item,
                mappedSku: product?.mappedSku || product?.sku || item.sku, // Fallback to sku
                originalSku: product?.sku
            };
        }));

        // Construct payload
        const payload = {
            orderId: order.customOrderId || order._id,
            amount: amount,
            currency: 'USD',
            paymentType: paymentType,
            items: itemsWithSku.map(item => ({
                name: item.name,
                sku: item.mappedSku, // Send mapped SKU as the primary SKU for Site B
                quantity: item.quantity,
                price: item.salePrice || item.price,
                image: item.image
            })),
            returnUrl: `${originSiteUrl}/api/site/order/payment/cross-site/validate`,
            cancelUrl: `${originSiteUrl}/order-failed?orderId=${order._id}`,
            customer: {
                billingAddress: order.billingAddress,
                shippingAddress: order.shippingAddress,
            }
        };
        // console.log('order:', order);
        // console.log('payload:', payload);
        // return;

        // Encode payload to base64 to pass safely in URL
        const payloadString = Buffer.from(JSON.stringify(payload)).toString('base64');
        const redirectUrl = `${paymentSiteUrl}/payment-gateway?data=${payloadString}`;

        // Create payment status record
        await OrderPaymentStatus.create({
            orderId: order._id,
            status: 'awaitingPayment',
            paymentMethod: 'cross-site',
            paymentDate: moment(new Date()),
            changeBy: "customer",
            customMessage: "Redirecting to external payment site",
            previousStatus: 'pending',
        });

        return {
            ...order.toObject(),
            redirectUrl: redirectUrl,
            payment: {
                type: paymentType // 'paypal' or 'stripe'
            }
        };

    } catch (error) {
        console.error('Error in generateCrossSitePayment:', error);
        throw error;
    }
};

export default generateCrossSitePayment;
