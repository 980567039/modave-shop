// 获取订单详情
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async (req, res) => {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const id = searchParams.get("id");
    
    const cookiesList = cookies();

    const lastOrder = cookiesList.get('lastOrder');

    const parseData = lastOrder?.value ? JSON.parse(lastOrder.value) : {};

    if (lastOrder && Object.keys(parseData).length !== 0) {
        return NextResponse.json({ message: "Order Details", data: {...parseData} }, { status: 200 });
    } else {

        return NextResponse.json({ error: "Order not found" }, { status: 500 });
    }
}