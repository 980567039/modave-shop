// 销售概览数据
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import moment from "moment";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function handleGet(req, res) {
    const session = await getServerSession(authOptions);
    if (session) {
        await connectDB();

        const confirmedStatuses = ['confirmPayment', 'confirmed', 'processing', 'shipped', 'outForDelivery', 'delivered', 'completed'];

        try {
            // Aggregate orders by month across all years
            const monthlyData = await Order.aggregate([
                {
                    $match: {
                        status: { $in: confirmedStatuses },
                        delete: false
                    }
                },
                {
                    $group: {
                        _id: {
                            month: { $month: "$createdAt" },
                            year: { $year: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: "$_id.month",
                        value: { $sum: "$count" }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);

            // Create a map of month number to value
            const monthValueMap = new Map(
                monthlyData.map(item => [item._id, item.value])
            );

            // Define all months and create the final array
            const months = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            // Create the final array with all months, using 0 for months without data
            const formattedData = months.map((month, index) => ({
                month: month,
                value: monthValueMap.get(index + 1) || 0
            }));

            return NextResponse.json({
                message: "GET request success",
                data: formattedData
            }, { status: 200 });

        } catch (error) {
            console.error('Error fetching monthly data:', error);
            return NextResponse.json({ 
                message: "Error fetching data",
                error: error.message 
            }, { status: 500 });
        }
    }

    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export { handleGet as GET };