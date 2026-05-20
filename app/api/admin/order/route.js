// 订单管理接口,支持订单的查询、创建、更新等操作
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


async function handleGet(req, res) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const session = await getServerSession(authOptions);

    if (session) {
        await connectDB();
        const byId = searchParams.get("id");
        const slug = searchParams.get("slug");
        const status = searchParams.get("status");

        const from = searchParams.get("from");
        const to = searchParams.get("to");
        const fulfillmentType = searchParams.get("fulfillmentType");

        const search = searchParams.get("search");

        const filter = {
            delete: false
        }

        // if (searchParams.get("delete")) {
        //     filter.delete = searchParams.get("delete");
        // }

        if (byId) {
            filter._id = byId;
        }
        if (slug) {
            filter.titleSlug = slug
        }

        if (status !== 'all') {
            if (status === 'new') {
                filter.isNewOrder = true;
            } else {
                filter.status = status
            }
        }

        if (fulfillmentType === "pickup") {
            filter.fulfillmentType = "pickup";
        }


        // Add date range filtering
        if (from) {
            const fromDate = new Date(from);
            fromDate.setUTCHours(0, 0, 0, 0);

            if (to) {
                const toDate = new Date(to);
                toDate.setUTCHours(23, 59, 59, 999);

                filter.createdAt = {
                    $gte: fromDate.toISOString(),
                    $lte: toDate.toISOString()
                };
            } else {
                // If only 'from' is provided, filter for that specific date
                const endOfDay = new Date(fromDate);
                endOfDay.setUTCHours(23, 59, 59, 999);

                filter.createdAt = {
                    $gte: fromDate.toISOString(),
                    $lte: endOfDay.toISOString()
                };
            }
        }


        if (search) {
            filter.$or = [
                { customOrderId: { $regex: search, $options: 'i' } },
                { 'billingAddress.firstName': { $regex: search, $options: 'i' } },
                { 'billingAddress.lastName': { $regex: search, $options: 'i' } },
                { 'billingAddress.email': { $regex: search, $options: 'i' } }
            ];
        }

        if (byId) {
            const [orders, orderCount] = await Promise.all([
                Order.find({ _id: byId, delete: false }).populate('paymentId').lean(),
                Order.countDocuments({ isNewOrder: true, delete: false })
            ]);


            // update single order is read status
            if (orders && orders.length > 0 && !orders[0]?.isRead) {
                await Order.updateOne({ _id: byId }, { $set: { isRead: true, isNewOrder: false } });
            }

            return NextResponse.json({
                message: "GET request success", data: {
                    ...orders,
                    orderCount,
                }
            }, { status: 200 });
        } else {
            const limitInt = parseInt(searchParams.get("limit")) || 10; // Default limit to 10 if not provided
            const pageInt = parseInt(searchParams.get("page")) || 1; // Default page to 1 if not provided

            const [orders, orderCount] = await Promise.all([
                Order.find(filter)
                    .limit(limitInt)
                    .skip((pageInt - 1) * limitInt)
                    .sort({ createdAt: -1 })
                    .populate('paymentId')
                    .lean(),
                Order.countDocuments(filter)
            ]);

            return NextResponse.json({
                message: "GET request success",
                data: {
                    orders,
                    orderCount
                }
            }, { status: 200 });
        }
    } else {
        return NextResponse.json({ message: "You don't have access" }, { status: 500 });
    }
}


async function handlePut(req, res) { }
async function handlePost(req, res) { }

export { handlePut as PUT, handleGet as GET, handlePost as POST };