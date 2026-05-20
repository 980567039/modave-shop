// 更新订单支付状态
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import ActivityLogs from "@/models/ActivityLogs";
import Order from "@/models/Order";
import OrderPaymentStatus from "@/models/OrderPaymentStatus";
import OrderStatus from "@/models/OrderStatus";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function handleGet(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized access" },
                { status: 401 }
            );
        }

        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.searchParams);

        const filter = {
            delete: searchParams.get("delete")
        };

        const byId = searchParams.get("id");
        if (byId) {
            filter.orderId = byId;
        }

        const isPaymentType = searchParams.get("type") === "payment";
        const Model = isPaymentType ? OrderPaymentStatus : OrderStatus;

        const results = await Model.find(filter).sort({ createdAt: -1 });

        return NextResponse.json(
            { message: "GET request success", data: results },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in handleGet:', error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}

async function handlePost(req) {
    try {
        const session = await getServerSession(authOptions);
        const acceptRoles = ['admin', 'sales', 'manager', 'marketing', 'inventoryManager'];


        if (!session || !acceptRoles.some((d) => d === session?.user?.role)) {
            return NextResponse.json(
                { message: "Unauthorized access" },
                { status: 403 }
            );
        }

        await connectDB();
        const reqData = await req?.json();

        if (!reqData) {
            return NextResponse.json(
                { message: "Invalid request data" },
                { status: 400 }
            );
        }

        const [statusUpdate, orderUpdate, activityLog] = await Promise.all([
            OrderPaymentStatus.create({
                status: reqData?.status,
                orderId: reqData.orderId,
                statusDate: reqData?.date,
                changeBy: reqData?.changeBy,
                customMessage: reqData?.customMessage,
                previousStatus: reqData?.previousStatus
            }),

            Order.updateOne(
                { _id: reqData.orderId },
                { $set: { paymentStatus: reqData?.status } }
            ),

            ActivityLogs.create({
                userId: session.user.id,
                activityType: "Order status change",
                activityDetails: `Change order(${reqData?.orderId}) status from ${reqData?.previousStatus} to ${reqData?.status}`,
                endpoint: req.url || '',
                method: "POST",
            })
        ]);

        return NextResponse.json(
            { message: 'Success', data: statusUpdate },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in handlePost:', error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}

// Implement handlePut or remove if not needed
async function handlePut(req) {
    return NextResponse.json(
        { message: "Method not implemented" },
        { status: 501 }
    );
}

export { handleGet as GET, handlePost as POST, handlePut as PUT };