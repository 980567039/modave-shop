// 订单金额统计
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

        const today = moment().startOf('day');
        const sevenDaysAgo = moment(today).subtract(6, 'days');
        const fourteenDaysAgo = moment(today).subtract(13, 'days');

        const validStatuses = ['confirmPayment', 'confirmed', 'processing', 'shipped', 'outForDelivery', 'delivered', 'completed'];

        // Function to calculate total price of items in an order
        const calculateOrderTotal = (order) => {
            return order.items.reduce((total, item) => total + ((item.salesPrice || item.price) * item.quantity), 0);
        };

        // Get total sales value (sum of all order totals with valid statuses)
        const allOrders = await Order.find({ status: { $in: validStatuses }, delete: false });
        const totalOrderValue = allOrders.reduce((total, order) => total + calculateOrderTotal(order), 0);

        // Function to get daily totals for a week
        const getWeekData = async (startDate, endDate) => {
            let weekData = [];
            for (let i = 0; i < 7; i++) {
                const currentDay = moment(endDate).subtract(i, 'days');
                const dayStart = currentDay.startOf('day').toDate();
                const dayEnd = currentDay.endOf('day').toDate();
                const orders = await Order.find({
                    status: { $in: validStatuses },
                    delete: false,
                    createdAt: { $gte: dayStart, $lt: dayEnd }
                });
                const dayTotal = orders.reduce((total, order) => total + calculateOrderTotal(order), 0);
                weekData.unshift({
                    day: currentDay.format('dddd'),
                    total: dayTotal
                });
            }
            return weekData;
        };

        // Get data for this week and last week
        const thisWeekData = await getWeekData(sevenDaysAgo, today);
        const lastWeekData = await getWeekData(fourteenDaysAgo, sevenDaysAgo);

        // Calculate total sales for each week
        const thisWeekTotal = thisWeekData.reduce((a, b) => a + b.total, 0);
        const lastWeekTotal = lastWeekData.reduce((a, b) => a + b.total, 0);

        // Calculate percentage difference
        const percentageDiff = lastWeekTotal !== 0 
            ? ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100 
            : 100;  // If last week was 0, we consider it as 100% increase

        // Determine direction
        const direction = percentageDiff >= 0 ? "up" : "down";

        // Combine the data into the desired format
        const chartData = thisWeekData.map((thisWeek, index) => ({
            day: thisWeek.day,
            lastWeek: lastWeekData[index].total,
            thisWeek: thisWeek.total
        }));

        return NextResponse.json({
            message: "GET request success",
            data: {
                totalOrderValue,
                thisWeekTotal,
                lastWeekTotal,
                chartData,
                weekComparison: {
                    percentageDiff: Math.abs(percentageDiff).toFixed(2),
                    direction,
                }
            }
        }, { status: 200 });
    }

    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export { handleGet as GET };