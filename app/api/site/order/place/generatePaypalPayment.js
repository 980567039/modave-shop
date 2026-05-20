import OrderPaymentStatus from '@/models/OrderPaymentStatus';
import moment from 'moment';

const getPaypalApiUrl = () =>
    (process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com').trim();

/**
 * 生成 PayPal 支付参数
 * @param {Object} order - 订单对象
 * @param {Number} amount - 支付金额
 * @param {String} customReturnUrl - 自定义返回 URL (可选)
 * @param {String} customCancelUrl - 自定义取消 URL (可选)
 * @returns {Object} PayPal 支付参数
 */
const generatePaypalPayment = async (order, amount, customReturnUrl = null, customCancelUrl = null) => {

    // 安全处理 ObjectId 转换
    const getOrderId = (order) => {
        if (!order?._id) {
            throw new Error('Order ID is required');
        }

        // 处理不同类型的 _id
        if (typeof order._id === 'object') {
            // 如果是 MongoDB ObjectId
            return order._id.toString();
        } else if (typeof order._id === 'string') {
            // 如果已经是字符串
            return order._id;
        } else {
            throw new Error('Invalid order ID format');
        }
    };

    try {
        const orderId = order?.customOrderId || getOrderId(order);
        const baseUrl = process.env.NEXTAUTH_URL;
        const paypalApiUrl = getPaypalApiUrl();

        if (!baseUrl) {
            throw new Error('NEXTAUTH_URL environment variable is not set');
        }

        if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET) {
            throw new Error('PayPal credentials are not configured');
        }

        // 安全访问嵌套属性并提供默认值
        const firstName = order?.billingAddress?.firstName || '';
        const lastName = order?.billingAddress?.lastName || '';
        const email = order?.billingAddress?.email || '';

        // 准备 PayPal 请求
        const paypalItems = order?.items?.map(item => {
            const unitAmount = Number(item.salePrice) || Number(item.price) || 0;
            return {
                name: item.name || item.title || item.slug || 'Product',
                unit_amount: {
                    currency_code: 'USD',
                    value: unitAmount.toFixed(2)
                },
                quantity: item.quantity.toString()
            };
        }) || [];

        // 获取 PayPal 访问令牌
        const tokenResponse = await fetch(`${paypalApiUrl}/v1/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64')}`
            },
            body: 'grant_type=client_credentials'
        });

        const tokenData = await tokenResponse.json();

        if (!tokenData.access_token) {
            throw new Error(`Failed to get PayPal access token: ${JSON.stringify(tokenData)}`);
        }

        // 创建 PayPal 订单
        const paypalRequest = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    reference_id: orderId,
                    amount: {
                        currency_code: 'USD',
                        value: amount.toFixed(2),
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: amount.toFixed(2)
                            }
                        }
                    },
                    items: paypalItems
                }
            ],
            application_context: {
                return_url: customReturnUrl || `${baseUrl}/api/site/order/payment/paypal/validate?order_id=${orderId}`,
                cancel_url: customCancelUrl || `${baseUrl}/order-failed?orderId=${orderId}`
            }
        };

        const orderResponse = await fetch(`${paypalApiUrl}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenData.access_token}`
            },
            body: JSON.stringify(paypalRequest)
        });

        const orderData = await orderResponse.json();

        if (!orderData.id) {
            throw new Error('Failed to create PayPal order: ' + JSON.stringify(orderData));
        }

        if (orderData.error) {
            throw new Error(orderData.error_description || 'PayPal order creation failed');
        }

        // 查找重定向 URL
        const approveUrl = orderData.links.find(link => link.rel === 'approve')?.href;

        if (!approveUrl) {
            throw new Error('No approval URL found in PayPal response');
        }

        // 创建支付状态记录
        await OrderPaymentStatus.create({
            orderId: getOrderId(order),
            status: 'awaitingPayment',
            paymentMethod: 'paypal',
            paymentDate: moment(new Date()),
            paymentData: orderData,
            changeBy: "customer",
            customMessage: "Customer generated PayPal payment link",
            previousStatus: 'pending',
        });

        // 返回包含重定向 URL 的对象
        return {
            ...order.toObject(),
            redirectUrl: approveUrl,
            paypalOrderId: orderData.id,
            amount: amount,
            currency: 'USD',
            orderId: orderId,
            payment: {
                type: "paypal"
            }
        };

    } catch (error) {
        console.error('Error in generatePaypalPayment:', error);

        // 如果出错，记录失败状态
        await OrderPaymentStatus.create({
            status: 'failed',
            orderId: order?._id,
            statusDate: moment(new Date()),
            changeBy: "system",
            customMessage: `PayPal payment generation failed: ${error.message}`,
            previousStatus: 'pending',
        });

        throw error;
    }
};

export default generatePaypalPayment;
