// 订单备注管理
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import ActivityLogs from "@/models/ActivityLogs";
import OrderNote from "@/models/OrderNote";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const isValidObjectId = (id) => {
    try {
        new mongoose.Types.ObjectId(id);
        return true;
    } catch (error) {
        return false;
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

        let results = await OrderNote.find(filter).populate({
            path: 'changeBy',
            select: 'firstName lastName email'
        }).sort({ createdAt: -1 });

        return NextResponse.json(
            { message: "GET request success", data: results[0] },
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

        // Create order status
        const orderNote = await OrderNote.create({
            orderId: reqData?.orderId,
            customMessage: reqData.message,
            changeBy: session?.user?.id
        });

        // Log activity
        await logActivity(req, reqData, session);

        return NextResponse.json(
            { message: 'Success', 
                data:  {
                    message: orderNote?.customMessage,
                    createdAt: orderNote?.createdAt,
                    user: `${session?.user?.firstName || ''}(${session?.user?.email})`
                }
            },
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

async function handleDelete(req) {
    try {
        const session = await getServerSession(authOptions);
        const acceptRoles = ['admin', 'manager'];  // Restricted to admin and manager roles

        if (!session || !acceptRoles.includes(session?.user?.role)) {
            return NextResponse.json(
                { message: "Access denied" },
                { status: 401 }
            );
        }

        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.searchParams);
        const orderId = searchParams.get("id");

        if (!orderId || !isValidObjectId(orderId)) {
            return NextResponse.json(
                { message: "Invalid order ID" },
                { status: 400 }
            );
        }

        await connectDB();
        
        const deletedNote = await OrderNote.findOneAndDelete({ orderId: orderId });
        
        if (!deletedNote) {
            return NextResponse.json(
                { message: "Order note not found" },
                { status: 404 }
            );
        }

        // Log delete activity
        await ActivityLogs.create({
            userId: session?.user?.id,
            activityType: `Order note deleted by - ${session?.user?.firstName || ''} (${session?.user?.role}) - ${session?.user?.email}`,
            activityDetails: `Order note deleted for order ID: ${orderId}`,
            endpoint: req.url || '',
            method: "DELETE",
        });

        return NextResponse.json(
            { message: "Order note deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error('DELETE Request Error:', error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

async function logActivity(req, reqData, session) {
    await ActivityLogs.create({
        userId: session?.user?.id,
        activityType: `Order note added by - ${session?.user?.firstName || ''} (${session?.user?.role}) - ${session?.user?.email}`,
        activityDetails: `Order note added`,
        endpoint: req.url || '',
        method: "POST",
    });
}

export { handleGet as GET, handlePost as POST, handleDelete as DELETE };