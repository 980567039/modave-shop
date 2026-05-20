// 获取指定日期范围内的最新订单列表
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import moment from "moment";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

async function handleGet(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                message: "Unauthorized access. Please login first."
            }, {
                status: 401
            });
        }

        await connectDB();

        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.search);

        const fromDate = searchParams.get("from");
        const toDate = searchParams.get("to");
        const limit = 6; // Fixed limit

        let dateFilter = {};

        if (fromDate && toDate) {
            dateFilter = {
                createdAt: {
                    $gte: moment(fromDate).startOf('day').toDate(),
                    $lte: moment(toDate).endOf('day').toDate()
                }
            };
        } else {
            const today = moment().startOf('day');
            dateFilter = {
                createdAt: {
                    $gte: today.toDate(),
                    $lte: moment().endOf('day').toDate()
                }
            };
        }

        const query = {
            ...dateFilter,
            delete: false
        };

        // Get total count first
        const totalCount = await Order.countDocuments(query);

        // Get limited records
        const sales = await Order.find(query)
            .select('date customOrderId paymentId status user')
            .populate('user')
            .populate('paymentId')
            .limit(limit);

        // Calculate remaining records
        const remaining = Math.max(0, totalCount - limit);

        return NextResponse.json({
            success: true,
            message: "Successfully retrieved total sales",
            data: sales,
            pagination: {
                total: totalCount,
                showing: sales.length,
                remaining: remaining,
                hasMore: remaining > 0
            },
            dateRange: {
                from: dateFilter.createdAt.$gte,
                to: dateFilter.createdAt.$lte
            }
        }, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, must-revalidate',
                'Pragma': 'no-cache'
            }
        });

    } catch (error) {
        console.error('Error in total sales API:', error);

        return NextResponse.json({
            success: false,
            message: "Failed to fetch total sales",
            error: error.message
        }, {
            status: 500
        });
    }
}

export { handleGet as GET };