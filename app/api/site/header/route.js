// 获取页头数据
import Store from "@/models/Store";
import StoreTheme from "@/models/StoreTheme";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";

export async function GET(req) {
    await connectDB();
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const storeId = process.env.NEXT_STORE_ID;    

    // console.log("🧩 [API HEADER] Request received");
    // console.log("📦 Store ID:", storeId);
    // console.log("🔍 Query Params:", Object.fromEntries(searchParams.entries()));

    let getStoreData = null; // 提前定义，避免 ReferenceError

    try {
        // console.log("🧠 Fetching StoreTheme...");
        getStoreData = await StoreTheme.findOne({ storeId })
            .sort({ createdAt: -1 })
            .select("common mainNavigation");

        if (getStoreData) {
            // console.log("✅ Theme header found:", getStoreData);
            return NextResponse.json(
                { message: "Theme header found", data: getStoreData },
                { status: 200 }
            );
        } else {
            // console.warn("⚠️ Theme header not found");
            return NextResponse.json(
                { message: "Theme header not found", data: null },
                { status: 404 }
            );
        }
    } catch (error) {
        // console.error("❌ Error fetching theme header:", error);
        return NextResponse.json(
            { message: "Error fetching theme header", error: error.message },
            { status: 500 }
        );
    }
}
