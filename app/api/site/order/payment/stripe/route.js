// Stripe 支付处理
import { NextResponse } from "next/server";
import Order from "@/models/Order";
import Product from "@/models/product/Product";
import OrderPaymentStatus from "@/models/OrderPaymentStatus";
import moment from "moment";
import Stripe from "stripe";

export const dynamic = 'force-dynamic';

// 初始化 Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 获取产品价格函数
const getProductPrice = (cartItems, dbProduct) => {
  return cartItems.map(item => {
    const matchedAttribute = dbProduct.attributes.find(attr => {
      const hasSize = attr.attributes.size?.value;
      const hasColor = attr.attributes.color?.value;
      const sizeMatch = hasSize ? attr.attributes.size.value === item.size : true;
      const colorMatch = hasColor ? attr.attributes.color.value === item.color : true;
      return sizeMatch && colorMatch;
    });

    if (matchedAttribute) {
      item.price = Number(matchedAttribute.price || dbProduct.price);
      item.stock = matchedAttribute.stock;
    } else {
      item.price = Number(dbProduct.price)
    }
    return item;
  });
};

export async function POST(req) {
  const { id, shippingRate } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "ID not found" }, { status: 400 });
  }

  try {
    const cookies = req.cookies;
    const lastOrder = cookies.get('lastOrder');
    const parseData = lastOrder?.value ? JSON.parse(lastOrder.value) : {};

    if (!parseData || parseData?.status !== "awaitingPayment") {
      return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
    }

    const getOrder = await Order.findById(parseData?.orderId);
    if (!getOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 400 });
    }

    // 更新产品价格
    if (getOrder?.items?.length > 0) {
      const updatedItems = await Promise.all(getOrder.items.map(async (product) => {
        const getDBProducts = await Product.findOne({ _id: product?.productId });
        if (getDBProducts) {
          const updatedProduct = getProductPrice([product], getDBProducts);
          return updatedProduct[0];
        }
        return product;
      }));
      getOrder.items = updatedItems;
    }

    // 计算小计
    const subtotal = getOrder?.items?.reduce((total, item) => {
      return total + ((Number(item.salePrice) || item.price) * item.quantity);
    }, 0);

    const isHaveSalesItems = getOrder?.items?.some((d) => (d.salePrice !== null && d.salePrice !== 0));
    const isGiftCardAvailable = getOrder?.items?.some((d) => d.isGiftCard);

    // 计算标准折扣
    let discountedAmount = subtotal;
    if (!isGiftCardAvailable && getOrder?.typeOfOffer?.enabledOffer && !isHaveSalesItems) {
      const standardDiscount = subtotal * Number(getOrder?.typeOfOffer?.parentage) / 100;
      discountedAmount = subtotal - standardDiscount;
    }

    // 添加运费
    const shouldAddShipping = subtotal < 15000;
    let finalAmount = discountedAmount;
    if (shouldAddShipping) {
      finalAmount += shippingRate;
    }

    // 创建 Stripe 支付会话
    const lineItems = getOrder.items.map(item => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round((Number(item.salePrice) || item.price) * 100), // Stripe 需要以分为单位
        },
        quantity: item.quantity,
      };
    });

    // 如果有运费，添加运费项
    if (shouldAddShipping) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: '运费',
          },
          unit_amount: Math.round(shippingRate * 100),
        },
        quantity: 1,
      });
    }

    // 创建 Stripe Checkout 会话
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/api/site/order/payment/stripe/validate?session_id={CHECKOUT_SESSION_ID}&order_id=${id}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/order-failed?orderId=${id}`,
      metadata: {
        orderId: id,
      },
    });

    // 记录支付状态
    await OrderPaymentStatus.create({
      status: 'awaitingPayment',
      orderId: parseData?.orderId,
      statusDate: moment(new Date()),
      changeBy: "customer",
      customMessage: "Customer initiated Stripe payment",
      previousStatus: 'pending',
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    }, { status: 200 });

  } catch (error) {
    console.error('Stripe payment error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}