// 每日订单统计
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

        const confirmedStatuses = ['confirmPayment', 'confirmed', 'processing', 'shipped', 'outForDelivery', 'delivered', 'completed'];
        const cancelledStatuses = ['paymentFailed', 'paymentCancel', 'cancelled', 'failed'];

        // Function to get daily orders for a week
        const getWeekData = async (startDate, endDate) => {
            let weekData = [];
            for (let i = 0; i < 7; i++) {
                const currentDay = moment(startDate).add(i, 'days');
                const dayStart = currentDay.startOf('day').toDate();
                const dayEnd = currentDay.endOf('day').toDate();

                const confirmedOrders = await Order.countDocuments({
                    status: { $in: confirmedStatuses },
                    delete: false,
                    createdAt: { $gte: dayStart, $lt: dayEnd }
                });

                const cancelledOrders = await Order.countDocuments({
                    status: { $in: cancelledStatuses },
                    delete: false,
                    createdAt: { $gte: dayStart, $lt: dayEnd }
                });

                weekData.push({
                    day: currentDay.format('ddd'),
                    confirm: confirmedOrders,
                    cancel: cancelledOrders
                });
            }
            return weekData;
        };

        // Get data for this week
        const thisWeekData = await getWeekData(sevenDaysAgo, today);

        // Calculate totals for this week
        const thisWeekConfirm = thisWeekData.reduce((total, day) => total + day.confirm, 0);
        const thisWeekCancel = thisWeekData.reduce((total, day) => total + day.cancel, 0);
        const thisWeekTotal = thisWeekConfirm + thisWeekCancel;

        // Prepare the chart data (which is the same as thisWeekData)
        const chartData = thisWeekData;

        return NextResponse.json({
            message: "GET request success",
            data: {
                thisWeekConfirm,
                thisWeekCancel,
                thisWeekTotal,
                chartData
            }
        }, { status: 200 });
    }

    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export { handleGet as GET };