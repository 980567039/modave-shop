// 获取用户订单列表
import { authOptions } from "@/lib/authOptions";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function handleGet(req, res) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const session = await getServerSession(authOptions);

    if (session) {
        const byId = searchParams.get("id");
        const byCustomId = searchParams.get("customId");
        const slug = searchParams.get("slug");
        const limitParam = searchParams.get("limit");


        const filter = {
            delete: false,
            user: session?.user.id,
        }

        if (byId) {
            filter._id = byId;
        }
        if (byCustomId) {
            filter.customOrderId = byCustomId;
        }
        if (slug) {
            filter.titleSlug = slug
        }


        const limitInt = limitParam || 10; // Default limit to 10 if not provided parseInt(limit) ||
        const pageInt = 1; // Default page to 1 if not provided parseInt(page) ||

        const orders = await Order.find(filter)
            .limit(limitInt)
            .skip((pageInt - 1) * limitInt).sort({ createdAt: -1 }).select('-ipAddress -ipAddressData -userSiteUniqueID -isNewOrder -isRead -user -paymentId');

        // update single order is read status
        // if(byId && orders && !orders?.isRead){
        //     await Order.updateOne({ _id: byId }, { $set: { isRead: true, isNewOrder: false } });
        // }

        return NextResponse.json({ message: "GET request success", data: orders }, { status: 200 });
    } else {
        return NextResponse.json({ message: "You don't have an access" }, { status: 500 });
    }
}

async function handlePut(req, res) { }
async function handlePost(req, res) { }

export { handlePut as PUT, handleGet as GET, handlePost as POST };