// 更新订单信息
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function handlePost(req, res) {
    const session = await getServerSession(authOptions);
    const acceptRoles = ['admin', 'sales', 'manager', 'marketing', 'inventoryManager'];
    
    if (session && acceptRoles.some((d) => d === session?.user?.role)) {
        try {
            await connectDB();

            const reqData = await req?.json();

            if (reqData && reqData?.id) {
                const dataId = reqData?.id;
                delete reqData?.id;

                const [updated, orderCount] = await Promise.all([
                    Order.updateOne({ _id: dataId }, { $set: reqData }),
                    Order.countDocuments({ isNewOrder: true, delete: false })
                ]);

                return NextResponse.json({
                    message: 'Success', data: {
                        ...updated,
                        orderCount,
                    }
                }, { status: 200 });
            } else {
                return NextResponse.json({ message: 'Error missing ID' }, { status: 200 });
            }

        } catch (error) {
            return NextResponse.json({ error, message: 'Error' }, { status: 400 });
        }
    }
}

export { handlePost as POST };