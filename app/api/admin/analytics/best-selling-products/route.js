// 获取指定日期范围内的最畅销产品数据,包括销量、收入等统计信息
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
        const limit = 4; // Fixed limit

        if (!fromDate || !toDate) {
            return NextResponse.json({
                success: false,
                message: "Both 'from' and 'to' date parameters are required"
            }, {
                status: 400
            });
        }

        const validStatuses = [
            'confirmPayment',
            'confirmed',
            'processing',
            'shipped',
            'outForDelivery',
            'delivered',
            'completed'
        ];

        const query = {
            createdAt: {
                $gte: moment(fromDate).startOf('day').toDate(),
                $lte: moment(toDate).endOf('day').toDate()
            },
            status: { $in: validStatuses },
            delete: false
        };

        // First get total count using facet
        const [aggregationResults] = await Order.aggregate([
            { $match: query },
            { $unwind: "$items" },
            {
                $addFields: {
                    "items.numericPrice": { $toInt: "$items.price" },
                    "items.numericQuantity": { $toInt: "$items.quantity" }
                }
            },
            {
                $group: {
                    _id: "$items.productId",
                    totalQuantity: { $sum: "$items.numericQuantity" },
                    totalRevenue: {
                        $sum: {
                            $multiply: ["$items.numericPrice", "$items.numericQuantity"]
                        }
                    },
                    productName: { $first: "$items.name" },
                    productImage: { $first: "$items.image" },
                    productPrice: { $first: "$items.numericPrice" },
                    productSlug: { $first: "$items.slug" },
                    sku: { $first: "$items.sku" },
                    firstOrderDate: { $min: "$createdAt" },
                    lastOrderDate: { $max: "$createdAt" },
                    orderStatuses: { $addToSet: "$status" }
                }
            },
            {
                $facet: {
                    totalCount: [{ $count: 'count' }],
                    paginatedResults: [
                        { $sort: { totalQuantity: -1 } },
                        { $limit: limit },
                        {
                            $project: {
                                _id: 1,
                                productName: 1,
                                productImage: 1,
                                productPrice: 1,
                                productSlug: 1,
                                sku: 1,
                                totalQuantity: 1,
                                totalRevenue: 1,
                                firstOrderDate: 1,
                                lastOrderDate: 1,
                                orderStatuses: 1
                            }
                        }
                    ]
                }
            }
        ]);

        const totalCount = aggregationResults.totalCount[0]?.count || 0;
        const bestSellingProducts = aggregationResults.paginatedResults;
        const remaining = Math.max(0, totalCount - limit);

        return NextResponse.json({
            success: true,
            message: "Successfully retrieved best selling products for the specified date range and order statuses",
            data: bestSellingProducts,
            pagination: {
                total: totalCount,
                showing: bestSellingProducts.length,
                remaining: remaining,
                hasMore: remaining > 0
            },
            dateRange: {
                from: query.createdAt.$gte,
                to: query.createdAt.$lte
            },
            includedStatuses: validStatuses
        }, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, must-revalidate',
                'Pragma': 'no-cache'
            }
        });

    } catch (error) {
        console.error('Error in best selling products API:', error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch best selling products",
            error: error.message
        }, {
            status: 500
        });
    }
}

export { handleGet as GET };