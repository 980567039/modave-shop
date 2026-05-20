// 获取指定日期范围内各订单状态的数量统计
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import moment from "moment";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Mark as dynamic route
export const dynamic = 'force-dynamic';

// Configure runtime
export const runtime = 'nodejs';

/**
 * GET handler for order analytics
 * @param {Request} req - The incoming request object
 * @returns {Promise<NextResponse>} The JSON response
 */
async function handleGet(req) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized access. Please login first."
            }, {
                status: 401
            });
        }

        // Connect to database
        await connectDB();

        // Parse URL and search parameters
        const { searchParams } = new URL(req.url);
        const fromDate = searchParams.get("from");
        const toDate = searchParams.get("to");

        // Configure date filter
        const dateFilter = getDateFilter(fromDate, toDate);

        // Base query with date filter and delete flag
        const baseQuery = {
            ...dateFilter,
            delete: false
        };

        // Get status counts using aggregation
        const statusCounts = await getOrderStatusCounts(baseQuery);

        // Format the response data
        const formattedData = formatStatusCounts(statusCounts);

        // Return success response
        return NextResponse.json({
            success: true,
            message: "Successfully retrieved order counts by status",
            data: formattedData,
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
        console.error('Error in order status count API:', error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch order status counts",
            error: error.message
        }, {
            status: 500
        });
    }
}

/**
 * Get date filter based on provided dates or default to today
 * @param {string} fromDate - Start date string
 * @param {string} toDate - End date string
 * @returns {Object} MongoDB date filter object
 */
function getDateFilter(fromDate, toDate) {
    if (fromDate && toDate) {
        return {
            createdAt: {
                $gte: moment(fromDate).startOf('day').toDate(),
                $lte: moment(toDate).endOf('day').toDate()
            }
        };
    }

    const today = moment().startOf('day');
    return {
        createdAt: {
            $gte: today.toDate(),
            $lte: moment().endOf('day').toDate()
        }
    };
}

/**
 * Get order status counts using MongoDB aggregation
 * @param {Object} baseQuery - Base query object for filtering
 * @returns {Promise<Array>} Aggregation results
 */
async function getOrderStatusCounts(baseQuery) {
    return Order.aggregate([
        { $match: baseQuery },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);
}

/**
 * Format status counts into desired structure
 * @param {Array} statusCounts - Array of status count objects
 * @returns {Object} Formatted status counts
 */
function formatStatusCounts(statusCounts) {
    return statusCounts.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
    }, {});
}

// Export the GET handler
export { handleGet as GET };