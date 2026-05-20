// 管理后台仪表盘数据
import { authOptions } from "@/lib/authOptions";
import Order from "@/models/Order";
import moment from "moment";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function handleGet(req, res) {
    const session = await getServerSession(authOptions);

    if (session) {
        try {
            const today = moment().startOf('day');
            const confirmedStatuses = ['confirmPayment', 'confirmed', 'processing', 'shipped', 'outForDelivery', 'delivered', 'completed'];

            // Get total sales (all confirmed orders)
            const totalSales = await Order.countDocuments({
                status: { $in: confirmedStatuses },
                delete: false
            });

            // Get total revenue (sum of total amount from all confirmed orders)
            const totalRevenueResult = await Order.aggregate([
                {
                    $match: {
                        status: { $in: confirmedStatuses },
                        delete: false
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$totalAmount" }
                    }
                }
            ]);
            const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;

            // Get today's orders count
            const todayOrders = await Order.countDocuments({
                delete: false,
                createdAt: { $gte: today.toDate(), $lt: moment(today).endOf('day').toDate() }
            });

            // Get today's order value (sum of total amount from today's orders)
            const todayOrderValueResult = await Order.aggregate([
                {
                    $match: {
                        delete: false,
                        createdAt: { $gte: today.toDate(), $lt: moment(today).endOf('day').toDate() }
                    }
                },
                {
                    $group: {
                        _id: null,
                        todayOrderValue: { $sum: "$totalAmount" }
                    }
                }
            ]);
            const todayOrderValue = todayOrderValueResult.length > 0 ? todayOrderValueResult[0].todayOrderValue : 0;

            console.log("Dashboard stats:", {
                totalSales,
                totalRevenue,
                todayOrders,
                todayOrderValue
            });

            return NextResponse.json({
                message: "GET request success",
                data: {
                    totalSales,
                    totalRevenue,
                    todayOrders,
                    todayOrderValue
                }
            }, { status: 200 });

        } catch (error) {
            console.error("Error fetching order statistics:", error);
            return NextResponse.json({
                message: "Error fetching order statistics",
                error: error.message
            }, { status: 500 });
        }
    } else {
        return NextResponse.json({
            message: "Unauthorized access"
        }, { status: 401 });
    }
}

export { handleGet as GET };