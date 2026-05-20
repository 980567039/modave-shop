// 获取指定日期范围内按支付方式分类的销售统计数据
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

        // Get total count of valid orders
        const data = await Order.find(query).select('paymentId items').populate('paymentId');

        // Aggregate payment totals from items
        const paymentTotals = data.reduce((acc, order) => {
            if (!order.paymentId || !order.items) return acc;

            const paymentMethod = order.paymentId.paymentMethod;

            // Calculate total amount from items
            const itemsTotal = order.items.reduce((sum, item) => {
                const quantity = item.quantity || 1;
                const price = item.price || 0;
                return sum + (quantity * price);
            }, 0);

            const existingEntry = acc.find(entry => entry.type === paymentMethod);

            if (existingEntry) {
                existingEntry.totalAmount += itemsTotal;
                existingEntry.orderCount = (existingEntry.orderCount || 0) + 1;
                existingEntry.itemCount = (existingEntry.itemCount || 0) + order.items.length;
            } else {
                acc.push({
                    type: paymentMethod,
                    totalAmount: itemsTotal,
                    orderCount: 1,
                    itemCount: order.items.length
                });
            }

            return acc;
        }, []);

        // Calculate additional statistics
        const totalSalesAmount = paymentTotals.reduce((sum, entry) => sum + entry.totalAmount, 0);
        const totalOrders = paymentTotals.reduce((sum, entry) => sum + entry.orderCount, 0);
        const totalItems = paymentTotals.reduce((sum, entry) => sum + entry.itemCount, 0);

        // Return success response with enhanced payment totals
        return NextResponse.json({
            success: true,
            message: "Successfully retrieved total sales",
            paymentTotals: paymentTotals,
            summary: {
                totalSalesAmount,
                totalOrders,
                totalItems,
                averageOrderValue: totalOrders ? (totalSalesAmount / totalOrders) : 0
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