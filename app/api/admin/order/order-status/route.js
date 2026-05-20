// 更新订单状态
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import { generateEmailTemplate } from "@/lib/emailTemplates/emailTemplate";
import EmailService from "@/lib/services/email-service";
import ActivityLogs from "@/models/ActivityLogs";
import Order from "@/models/Order";
import OrderPayments from "@/models/OrderPayments";
import OrderStatus from "@/models/OrderStatus";
import Product from "@/models/product/Product";
import moment from "moment";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from 'mongoose';
import { getShippingAddress } from "@/lib/server-common";

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => {
    try {
        new mongoose.Types.ObjectId(id);
        return true;
    } catch (error) {
        return false;
    }
};

// Helper function to safely convert to ObjectId
const toObjectId = (id) => {
    try {
        return new mongoose.Types.ObjectId(id);
    } catch (error) {
        return null;
    }
};

async function handleGet(req) {
    try {
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.searchParams);
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { message: "You don't have access" },
                { status: 401 }
            );
        }

        const byId = searchParams.get("id");
        const type = searchParams.get("type");

        const filter = {
            delete: searchParams.get("delete")
        };

        if (byId) {
            if (!isValidObjectId(byId)) {
                return NextResponse.json(
                    { message: "Invalid order ID format" },
                    { status: 400 }
                );
            }
            filter.orderId = byId;
        }

        let results;
        if (type === "payment") {
            results = await OrderPayments.find(filter).sort({ createdAt: -1 });
        } else {
            results = await OrderStatus.find(filter).sort({ createdAt: -1 });
        }

        return NextResponse.json(
            { message: "GET request success", data: results },
            { status: 200 }
        );
    } catch (error) {
        console.error('GET Request Error:', error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

async function handlePost(req) {
    try {
        const session = await getServerSession(authOptions);
        const acceptRoles = ['admin', 'sales', 'manager', 'marketing', 'inventoryManager'];

        if (!session || !acceptRoles.includes(session?.user?.role)) {
            return NextResponse.json(
                { message: "Access denied" },
                { status: 401 }
            );
        }

        await connectDB();
        const reqData = await req.json();

        if (!reqData || !reqData.orderId || !isValidObjectId(reqData.orderId)) {
            return NextResponse.json(
                { message: "Invalid request data" },
                { status: 400 }
            );
        }

        // Handle cancelled orders and stock updates
        if (reqData?.status === "cancelled" && reqData?.previousStatus !== "cancelled") {
            if (!reqData?.orderObj?.items || !Array.isArray(reqData.orderObj.items)) {
                return NextResponse.json(
                    { message: "Invalid order items data" },
                    { status: 400 }
                );
            }

            try {
                await handleCancelledOrderStock(reqData.orderObj.items);
            } catch (error) {
                console.error('Stock Update Error:', error);
                return NextResponse.json(
                    { message: "Error updating product stock" },
                    { status: 500 }
                );
            }
        }

        // Create order status
        const orderStatus = await OrderStatus.create({
            status: reqData.status,
            orderId: reqData.orderId,
            statusDate: reqData.date,
            changeBy: reqData.changeBy,
            customMessage: reqData.customMessage,
            previousStatus: reqData.previousStatus
        });

        // Send email notification
        try {
            console.log('Sending email for order:', reqData);
            await sendStatusChangeEmail(reqData, session);
        } catch (error) {
            console.error('Email Send Error:', error);
            // Continue processing even if email fails
        }

        // Update main order status
        await Order.updateOne(
            { _id: reqData.orderId },
            { $set: { status: reqData.status } }
        );

        // Log activity
        await logActivity(req, reqData, session);

        return NextResponse.json(
            { message: 'Success', data: orderStatus },
            { status: 200 }
        );

    } catch (error) {
        console.error('POST Request Error:', error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

// Helper function to handle cancelled order stock updates
async function handleCancelledOrderStock(items) {
    await Promise.all(items.map(async (product) => {
        const quantityToAdd = Number(product?.quantity) || 0;
        const productId = toObjectId(product?.productId);

        if (!productId) {
            console.error(`Invalid product ID format: ${product?.productId}`);
            return;
        }

        const currentProduct = await Product.findOne({ _id: productId });
        if (!currentProduct) {
            console.error(`Product not found: ${productId}`);
            return;
        }

        const currentStock = Number(currentProduct.stock) || 0;
        const newStock = currentStock + quantityToAdd;

        // Update main product stock
        await Product.updateOne(
            { _id: productId },
            {
                $set: {
                    inStock: true,
                    stock: newStock
                }
            }
        );

        // Handle attribute-specific stock updates
        if (product?.color || product?.size) {
            await updateAttributeStock(productId, product, quantityToAdd);
        }
    }));
}

// Helper function to update attribute-specific stock
async function updateAttributeStock(productId, product, quantityToAdd) {
    const attributeQuery = {
        _id: productId,
        "attributes": {
            $elemMatch: {
                "attributes.color.value": product.color,
                "attributes.size.value": product.size
            }
        }
    };

    const productWithAttrs = await Product.findOne(attributeQuery);
    if (!productWithAttrs) {
        console.error(`No product found with matching attributes for ${productId}`);
        return;
    }

    const matchedAttribute = productWithAttrs.attributes.find(attr =>
        attr.attributes.color.value === product.color &&
        attr.attributes.size.value === product.size
    );

    if (matchedAttribute) {
        const currentAttrStock = Number(matchedAttribute.stock) || 0;
        const newAttrStock = currentAttrStock + quantityToAdd;

        await Product.updateOne(
            {
                _id: productId,
                "attributes.attributes.color.value": product.color,
                "attributes.attributes.size.value": product.size
            },
            {
                $set: {
                    "attributes.$.stock": newAttrStock
                }
            }
        );
    }
}



// Helper function to send status change email
async function sendStatusChangeEmail(reqData, session) {
    const mailBody = {
        to: reqData?.customer?.email,
        subject: `Your order(${reqData.customOrderId}) status was changed!`,
        text: `Order status change, from ${reqData?.previousStatus} to ${reqData?.status}`,
        purpose: `Order status change, from ${reqData?.previousStatus} to ${reqData?.status}`,
        requestBy: session?.user?.id,
        emailType: reqData?.emailType
    };

    const orderData = {
        orderStatus: reqData?.statusText,
        orderNumber: reqData?.orderObj?.customOrderId || '',
        orderDate: moment(reqData?.orderObj?.createdAt).format('YYYY-MM-DD hh:mm a'),
        orderTotal: reqData?.orderObj?.orderTotal,
        customerEmail: reqData?.orderObj?.billingAddress?.email,
        shippingAddress: getShippingAddress(reqData?.orderObj),
        items: reqData?.orderObj?.items,
        subtotal: reqData?.orderObj?.subtotal,
        shipping: reqData?.orderObj?.shipping || 0,
        discounts: '0.00',
        tax: '0.00',
        mainTitle: 'Your Order Status Was Changed',
        subTitle: '',
    };

    const host = process.env.NEXTAUTH_URL;

    await EmailService.sendEmail({
        to: mailBody?.to,
        subject: mailBody?.subject,
        text: mailBody?.text || '',
        html: generateEmailTemplate(orderData, 'statusChange', host),
    });
}

// Helper function to log activity
async function logActivity(req, reqData, session) {
    await ActivityLogs.create({
        userId: session?.user?.id,
        activityType: `Order status change by - ${session?.user?.firstName || ''} (${session?.user?.role}) - ${session?.user?.email}`,
        activityDetails: `Change order(${reqData?.orderId}) status from ${reqData?.previousStatus} to ${reqData?.status}`,
        endpoint: req.url || '',
        method: "POST",
    });
}

export { handleGet as GET, handlePost as POST };