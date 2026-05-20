// 店铺设置管理
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import Store from "@/models/Store";
import StoreTheme from "@/models/StoreTheme";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const acceptRoles = ['admin', 'sales', 'manager', 'marketing', 'inventoryManager'];


// POST
async function handlePost(req, res) {
    const session = await getServerSession(authOptions);

    if (!session || !acceptRoles.includes(session.user.role)) {
        return NextResponse.json({ message: "access denied" }, { status: 403 });
    }

    try {
        await connectDB();
        const reqData = await req.json();

        const store = await Store.create({
            ...reqData,
            user: session.user.id
        });

        if (store) {
            await StoreTheme.create({ storeId: store._id });
        }

        return NextResponse.json({ message: 'Success', data: store }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error, message: 'Error' }, { status: 400 });
    }
}



// PUT
async function handlePut(req) {
    const session = await getServerSession(authOptions);

    if (!session || !acceptRoles.includes(session.user.role)) {
        return NextResponse.json({ message: "access denied" }, { status: 403 });
    }

    await connectDB();
    const reqData = await req.json();

    if (!reqData || !reqData.id) {
        return NextResponse.json({ message: "ID not found" }, { status: 400 });
    }

    // remove undefined fields
    const updateData = Object.fromEntries(
        Object.entries(reqData).filter(([k, v]) => v !== undefined && k !== "id")
    );

    await Store.updateOne({ _id: reqData.id }, { $set: updateData });

    const store = await Store.findById(reqData.id);

    return NextResponse.json({
        message: "PUT request success",
        data: store
    }, { status: 200 });
}



// GET
async function handleGet(req) {
    const session = await getServerSession(authOptions);

    if (!session || !acceptRoles.includes(session.user.role)) {
        return NextResponse.json({ message: "access denied" }, { status: 403 });
    }

    await connectDB();

    try {
        const url = new URL(req.url);
        const searchParams = url.searchParams;

        const byId = searchParams.get("id");

        const filter = { status: "active" };
        if (byId) filter._id = byId;

        // ✅ use filter!
        const storeData = await Store.find(filter).sort({ createdAt: 1 });

        return NextResponse.json({
            message: "GET request success",
            data: storeData
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            error: 'Failed to process GET request',
            message: error.message
        }, { status: 500 });
    }
}


export { handlePut as PUT, handleGet as GET, handlePost as POST };