// Stripe 支付验证
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import Stripe from "stripe";
import Order from "@/models/Order";
import OrderPayments from "@/models/OrderPayments";
import OrderStatus from "@/models/OrderStatus";
import moment from "moment";
import { cookies } from "next/headers";
import OrderPaymentStatus from "@/models/OrderPaymentStatus";
import Store from "@/models/Store";

// 初始化 Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  const cookiesList = cookies();
  const { searchParams } = new URL(req.url);
  
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  
  const cookieMaxAge = process.env.COOKIE_MAX_AGE || 15;
  
  if (!sessionId || !orderId) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }
  
  // 初始化响应对象
  const responses = {
    statusMessage: '',
    paymentDetails: {},
    return: {},
    orderStatus: ''
  };
  
  try {
    // 从 Stripe 获取会话信息
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // 验证支付状态
    if (session.payment_status === 'paid') {
      console.log("Stripe payment is approved");
      responses.statusMessage = `Stripe 付款成功！订单状态已更新 {{PREV_STATUS}} to {{CURRENT_STATUS}}.`;
      responses.return = { message: 'Payment is approved', status: 200 };
      responses.orderStatus = 'confirmPayment';
      responses.paymentDetails = {
        sessionId: sessionId,
        paymentIntent: session.payment_intent,
        amountTotal: session.amount_total,
        customer: session.customer
      };
    } else {
      console.log("Stripe payment failed or pending");
      responses.statusMessage = `Stripe 付款未完成！订单状态已更新 {{PREV_STATUS}} to {{CURRENT_STATUS}}.`;
      responses.return = { message: 'Payment Issue', status: 400 };
      responses.orderStatus = 'paymentFailed';
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
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
  } catch (error) {
    console.error("Error processing Stripe payment:", error);
    return NextResponse.json({ error: 'Failed to process payment', message: error.message }, { status: 500 });
  }
}