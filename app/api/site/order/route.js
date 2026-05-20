// 前台订单查询
import { authOptions } from "@/lib/authOptions";
import { generateEmailTemplate } from "@/lib/emailTemplates/emailTemplate";
import EmailService from "@/lib/services/email-service";
import Order from "@/models/Order";
import moment from "moment";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// 路由说明：
// - GET：根据 cookies 中的 lastOrder 信息，尝试为最近订单发送确认邮件，并在处理后清理订单相关 cookies。
// - POST：按需清理订单相关 cookies（例如在客户端主动请求清理时）。
// - PUT：预留扩展（当前未实现）。
//
// 设计考虑：
// - 为避免重复发送邮件，使用数据库原子更新 emailSent 标记；
// - 所有响应统一通过 createResponseWithCookieRemoval 清除 lastOrder / orderStatus / orderId cookies，保证幂等与后续流程安全。

// Helper function to create response with cookie removal
const createResponseWithCookieRemoval = (data, status) => {
    const response = NextResponse.json(data, { status });

    // Remove all order-related cookies
    response.headers.set('Set-Cookie', [
        'lastOrder=; Path=/; HttpOnly; Max-Age=0',
        'orderStatus=; Path=/; HttpOnly; Max-Age=0',
        'orderId=; Path=/; HttpOnly; Max-Age=0'
    ].join(', '));

    return response;
};

async function handleGet(req, res) {
    // 读取请求与 cookies，并构建必要的环境变量
    const cookiesList = cookies();
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const host = process.env.NEXTAUTH_URL;
    const enabledEmail = process.env.ENABLED_EMAIL; // 可用于开启/关闭邮件发送（当前逻辑未直接使用）
    const lastOrder = cookiesList.get('lastOrder');
    let parseData = {};

    try {
        parseData = lastOrder?.value ? JSON.parse(lastOrder.value) : {};
    } catch (error) {
        console.error("Failed to parse lastOrder cookie:", error);
        parseData = {};
    }

    const queryOrderId = searchParams.get('id');
    const orderId = parseData?.orderId || queryOrderId;
    const status = parseData?.status;

    // If no valid order data, return early
    // 校验：必须存在 lastOrder 且包含 orderId，并且订单状态为允许的范围（pending 或 confirmPayment）。
    if (!orderId || (status && status !== "pending" && status !== "confirmPayment")) {
        return createResponseWithCookieRemoval(
            { message: "Order not found or cookies removed" },
            400
        );
    }


    try {
        // Use findOneAndUpdate to atomically check and update emailSent flag
        // 原子性更新：仅当 emailSent 不为 true 时更新为 true，避免重复发送邮件。
        // 同时根据状态过滤，确保只为目标状态订单进行发送。
        const orders = await Order.findOneAndUpdate(
            {
                delete: false,
                _id: orderId,
                ...(status && { status }),
                emailSent: { $ne: true }
            },
            { $set: { emailSent: true } },
            {
                new: false,
                select: '-ipAddress -ipAddressData -userSiteUniqueID'
            }
        );
 console.log('orders:', orders)
        // If no order found or email already sent, return early
        // 分支：
        // - 若订单不存在，返回 404；
        // - 若订单存在但邮件已发送，则返回 200（不再重复发送），并清理 cookies。
        if (!orders) {
            const existingOrder = await Order.findOne({ _id: orderId }).lean();
            if (!existingOrder) {
                return createResponseWithCookieRemoval(
                    { message: "Order not found" },
                    404
                );
            }

            return createResponseWithCookieRemoval(
                {
                    message: "Email already sent for this order",
                    data: {
                        ...existingOrder,
                        ...parseData
                    }
                },
                200
            );
        }

        // 计算优惠百分比：优先普通优惠，其次 Koko 优惠（若开启）
        const offerParentage = (orders?.typeOfOffer?.enabledOffer ? orders?.typeOfOffer?.parentage : 0) ||
            (orders?.typeOfOffer?.enabledKokoOffer ? orders?.typeOfOffer?.kokoParentage : 0);

        // 组装邮件模板所需的订单数据（展示用途）
        const orderData = {
            orderStatus: parseData?.orderStatus || '',
            orderNumber: orders?.customOrderId || '',
            orderDate: moment(orders?.date).format('YYYY-MM-DD hh:mm a'),
            orderTotal: parseData?.totalAmount,
            customerEmail: orders?.billingAddress?.email,
            shippingAddress: orders?.billingAddress,
            fulfillmentType: orders?.fulfillmentType || '',
            pickUpLocation: orders?.pickUpLocation || '',
            pickupDate: orders?.pickupDate || '',
            items: orders?.items,
            subtotal: (parseData?.totalAmount - parseData?.shipping) || 0,
            shipping: parseData?.shipping || 0,
            discounts: `${offerParentage}% Off` || '0.00',
            tax: '0.00',
            mainTitle: 'Your Order Successfully Placed!',
            subTitle: 'Thank you for your purchase!',
            enabledOffers: parseData.enabledOffer || false,
            typeOfOffer: parseData.offers || {},
        };

        // 发送邮件：根据模板生成 HTML 并派发
        if (enabledEmail === 'true') {
            await EmailService.sendEmail({
                to: orderData?.customerEmail,
                subject: orderData?.mainTitle,
                text: '',
                orderId: orders?._id || '',
                userName: orders?.billingAddress?.firstName || '',
                html: generateEmailTemplate(orderData, 'newOrder', host),
            });
        }

        // 成功：返回订单数据，并清理 cookies 防止重复触发
        return createResponseWithCookieRemoval(
            { message: "GET request success", data: orders },
            200
        );

    } catch (error) {
        console.error("Operation failed:", error);
        // 失败：统一返回错误信息，并清理 cookies 以保证后续流程安全
        return createResponseWithCookieRemoval(
            { message: "Operation failed" },
            500
        );
    }
}

async function handlePost(req, res) {
    const rawBody = await req.json();

    if (rawBody && rawBody?.isRemoveOrderCookies) {
        // 主动清理订单相关 cookies 的接口（用于客户端手动触发）
        return createResponseWithCookieRemoval(
            { message: "Cookies removed" },
            200
        );
    } else {
        // 非预期的请求体，返回 400 并清理 cookies
        return createResponseWithCookieRemoval(
            { message: "Invalid request" },
            400
        );
    }
}

async function handlePut(req, res) {
    // 预留：若后续需要扩展订单状态或更新逻辑，可在此实现。
}

export { handlePut as PUT, handleGet as GET, handlePost as POST };
