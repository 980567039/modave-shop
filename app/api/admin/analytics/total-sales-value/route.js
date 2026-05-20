// 获取指定日期范围内的总销售金额和订单统计
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import moment from "moment";
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

        // Configure date filter
        let dateFilter = {};

        if (fromDate && toDate) {
            // Use provided date range
            dateFilter = {
                createdAt: {
                    $gte: moment(fromDate).startOf('day').toDate(),
                    $lte: moment(toDate).endOf('day').toDate()
                }
            };
        } else {
            // Default to today's date range
            const today = moment().startOf('day');
            dateFilter = {
                createdAt: {
                    $gte: today.toDate(),
                    $lte: moment().endOf('day').toDate()
                }
            };
        }

        // Combine all query filters
        const query = {
            ...dateFilter,
            status: { $in: validStatuses },
            delete: false
        };

        // Get orders with items array
        const orders = await Order.find(query).select('items');

        // Calculate total sales
        const orderTotals = orders.map(order => {
            // Calculate total for each order by summing up items
            const orderTotal = order.items.reduce((sum, item) => {
                // Use salePrice if available and not 0, otherwise use regular price
                const itemPrice = (item.salePrice && item.salePrice > 0) ? item.salePrice : item.price;
                return sum + (itemPrice * item.quantity);
            }, 0);

            return {
                orderId: order._id,
                total: orderTotal
            };
        });

        // Calculate overall statistics
        const totalAmount = orderTotals.reduce((sum, order) => sum + order.total, 0);
        const orderCount = orders.length;

        // Return success response with detailed information
        return NextResponse.json({
            success: true,
            message: "Successfully retrieved total sales",
            data: {
                orders: orderTotals,
                totalAmount,
                orderCount,
                averageOrderValue: orderCount > 0 ? totalAmount / orderCount : 0
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