// PayPal 支付验证
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import Order from "@/models/Order";
import OrderPayments from "@/models/OrderPayments";
import OrderStatus from "@/models/OrderStatus";
import moment from "moment";
import { cookies } from "next/headers";
import OrderPaymentStatus from "@/models/OrderPaymentStatus";
import Store from "@/models/Store";

export async function GET(req) {
  const cookiesList = cookies();
  const { searchParams } = new URL(req.url);
  
  const paypalOrderId = searchParams.get('token');
  const orderId = searchParams.get('order_id');
  const PayerID = searchParams.get('PayerID');
  
  const cookieMaxAge = process.env.COOKIE_MAX_AGE || 15;
  
  if (!paypalOrderId || !orderId || !PayerID) {
    return NextResponse.json({ error: '缺少必需的参数' }, { status: 400 });
  }
  
  // 初始化响应对象
  const responses = {
    statusMessage: '',
    paymentDetails: {},
    return: {},
    orderStatus: ''
  };
  
  try {
    // 获取 PayPal 访问令牌
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
      throw new Error('获取 PayPal 访问令牌失败');
    }
    
    // 捕获 PayPal 支付
    const captureResponse = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });
    
    const captureData = await captureResponse.json();
    // console.log("PayPal capture response:", JSON.stringify(captureData, null, 2));
    
    // 验证支付状态
    if (captureData.status === 'COMPLETED') {
      // console.log("PayPal payment is approved");
      responses.statusMessage = `PayPal 付款成功！订单状态已更新 {{PREV_STATUS}} -> {{CURRENT_STATUS}}.`;
      responses.return = { message: '付款已获批准', status: 200 };
      responses.orderStatus = 'confirmPayment';
      
      // 安全地获取支付详情，添加错误处理
      try {
        const purchaseUnit = captureData.purchase_units?.[0];
        const capture = purchaseUnit?.payments?.captures?.[0];
        
        responses.paymentDetails = {
          paypalOrderId: paypalOrderId,
          payerId: PayerID,
          captureId: capture?.id || 'unknown',
          amount: capture?.amount?.value || '0',
          currency: capture?.amount?.currency_code || 'USD'
        };
      } catch (detailError) {
        // console.error("Error extracting payment details:", detailError);
        // 设置默认值，确保不会因为缺少数据而崩溃
        responses.paymentDetails = {
          paypalOrderId: paypalOrderId,
          payerId: PayerID,
          captureId: 'unknown',
          amount: '0',
          currency: 'USD'
        };
      }
    } else {
      // console.log("PayPal payment failed or pending");
      responses.statusMessage = `PayPal 付款未完成！订单状态已更新 {{PREV_STATUS}} -> {{CURRENT_STATUS}}.`;
      responses.return = { message: '付款问题', status: 400 };
      responses.orderStatus = 'paymentFailed';
      
      // 即使支付失败，也设置基本的支付详情
      responses.paymentDetails = {
        paypalOrderId: paypalOrderId,
        payerId: PayerID,
        status: captureData.status || 'FAILED'
      };
    }
    
    // 获取订单和商店数据
    const [order, store] = await Promise.all([
      Order.findOne({ customOrderId: orderId }).lean(),
      Store.find().lean(),
    ]);
    
    if (order) {
      const getDBOrderId = order?._id;
      
      // 更新订单状态
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
              paymentData: responses.paymentDetails,
              status: responses.orderStatus,
              paymentDate: moment(new Date())
            },
          }
        ),
      ]);
      
      // 设置重定向 URL
      const redirectUrl = `${process.env.NEXTAUTH_URL}/order-confirm?orderId=${getDBOrderId}`;
      const failedRedirectUrl = `${process.env.NEXTAUTH_URL}/order-failed?orderId=${getDBOrderId}`;
      
      // 准备 cookie 值
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
      
      // 根据支付状态重定向
      if (responses.return?.status === 200) {
        cookiesList.set('lastOrder', cookieValue, { path: '/', maxAge: cookieMaxAge });
        
        return new Response(null, {
          status: 302,
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
          status: 302,
          headers: {
            'Location': failedRedirectUrl,
            'Set-Cookie': `lastOrder=; Path=/; HttpOnly; Max-Age=0`,
          },
        });
      }
    } else {
      return NextResponse.json({ error: '未找到订单' }, { status: 404 });
    }
  } catch (error) {
    // console.error("Error processing PayPal payment:", error);
    return NextResponse.json({ error: '付款处理失败', message: error.message }, { status: 500 });
  }
}