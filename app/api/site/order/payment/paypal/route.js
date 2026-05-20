// PayPal 支付处理
import { NextResponse } from "next/server";
import Order from "@/models/Order";
import Product from "@/models/product/Product";
import OrderPaymentStatus from "@/models/OrderPaymentStatus";
import moment from "moment";

export const dynamic = 'force-dynamic';

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

    // 创建 PayPal 订单
    const paypalOrderItems = getOrder.items.map(item => {
      return {
        name: item.name,
        unit_amount: {
          currency_code: 'USD',
          value: (Number(item.salePrice) || item.price).toString()
        },
        quantity: item.quantity.toString()
      };
    });

    // 如果有运费，添加运费项
    if (shouldAddShipping) {
      paypalOrderItems.push({
        name: '运费',
        unit_amount: {
          currency_code: 'USD',
          value: shippingRate.toString()
        },
        quantity: '1'
      });
    }

    // 准备 PayPal 请求
    const paypalRequest = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: id,
          amount: {
            currency_code: 'USD',
            value: finalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: finalAmount.toFixed(2)
              }
            }
          },
          items: paypalOrderItems
        }
      ],
      application_context: {
        return_url: `${process.env.NEXTAUTH_URL}/api/site/order/payment/paypal/validate?order_id=${id}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/order-failed?orderId=${id}`
      }
    };

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
      throw new Error('Failed to get PayPal access token');
    }

    // 创建 PayPal 订单
    const orderResponse = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenData.access_token}`
      },
      body: JSON.stringify(paypalRequest)
    });

    const paypalOrderData = await orderResponse.json();

    if (paypalOrderData.error) {
      throw new Error(paypalOrderData.error_description || 'PayPal order creation failed');
    }

    // 记录支付状态
    await OrderPaymentStatus.create({
      status: 'awaitingPayment',
      orderId: parseData?.orderId,
      statusDate: moment(new Date()),
      changeBy: "customer",
      customMessage: "Customer initiated PayPal payment",
      previousStatus: 'pending',
    });

    // 查找 PayPal 批准链接
    const approvalUrl = paypalOrderData.links.find(link => link.rel === 'approve').href;

    return NextResponse.json({ 
      paypalOrderId: paypalOrderData.id,
      approvalUrl: approvalUrl
    }, { status: 200 });

  } catch (error) {
    console.error('PayPal payment error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}