// 获取指定日期范围内的总销售订单数量
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import moment from "moment-timezone";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Mark this route as dynamic since it uses headers and database
export const dynamic = 'force-dynamic';

// Disable static optimization for database operations
export const fetchCache = 'force-no-store';

// Revalidate data on every request
export const revalidate = 0;

async function handleGet(req) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        const timezone = "Asia/Colombo"; // Sri Lanka timezone

        if (!session) {
            return NextResponse.json({
                message: "Unauthorized access. Please login first."
            }, {
                status: 401
            });
        }

        // Connect to database
        await connectDB();

        // Parse URL and search parameters
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.search);

        // Define valid order statuses
        const validStatuses = [
            'confirmPayment',
            'confirmed',
            'processing',
            'shipped',
            'outForDelivery',
            'delivered',
            'completed'
        ];

        // Get date parameters
        const fromDate = searchParams.get("from");
        const toDate = searchParams.get("to");

        // Configure date filter using custom date strings or Sri Lanka timezone
        let dateFilter = {};

        if (fromDate && toDate) {
            let fromDateObj, toDateObj;

            // Check if the dates are already in ISO format with timezone offset
            if (fromDate.includes('T') && fromDate.includes('+')) {
                // Use the provided ISO string directly
                fromDateObj = moment(fromDate);
            } else {
                // Use the date with Sri Lanka timezone
                fromDateObj = moment.tz(fromDate, timezone).startOf('day');
            }

            if (toDate.includes('T') && toDate.includes('+')) {
                // Use the provided ISO string directly
                toDateObj = moment(toDate);
            } else {
                // Use the date with Sri Lanka timezone
                toDateObj = moment.tz(toDate, timezone).endOf('day');
            }

            // For debugging


            dateFilter = {
                createdAt: {
                    $gte: fromDateObj.toDate(),
                    $lte: toDateObj.toDate()
                }
            };
        } else {
            // Default to today's date range in Sri Lanka timezone
            const todayStart = moment.tz(timezone).startOf('day');
            const todayEnd = moment.tz(timezone).endOf('day');

            // Format using custom format if needed
            const formattedStart = todayStart.format('YYYY-MM-DDT00:00:00.000+05:30');
            const formattedEnd = todayEnd.format('YYYY-MM-DDT23:59:59.999+05:30');



            dateFilter = {
                createdAt: {
                    $gte: todayStart.toDate(),
                    $lte: todayEnd.toDate()
                }
            };
        }

        // Combine all query filters
        const query = {
            ...dateFilter,
            status: { $in: validStatuses },
            delete: false
        };

        // Get total count of valid orders
        const totalSales = await Order.countDocuments(query);

        // Return success response with formatted dates for clarity
        return NextResponse.json({
            success: true,
            message: "Successfully retrieved total sales",
            data: totalSales,
            dateRange: {
                from: moment(dateFilter.createdAt.$gte).format('YYYY-MM-DDT00:00:00.000+05:30'),
                to: moment(dateFilter.createdAt.$lte).format('YYYY-MM-DDT23:59:59.999+05:30'),
                timezone: timezone
            }
        }, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, must-revalidate',
                'Pragma': 'no-cache'
            }
        });

    } catch (error) {
        // Log the error for debugging
        console.error('Error in total sales API:', error);

        // Return error response
        return NextResponse.json({
            success: false,
            message: "Failed to fetch total sales",
            error: error.message
        }, {
            status: 500
        });
    }
}

// Export the GET handler
export { handleGet as GET };