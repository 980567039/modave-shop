// 通用前台数据
import connectDB from "@/lib/db";
import Store from "@/models/Store";
import StoreTheme from "@/models/StoreTheme";
import { NextResponse } from "next/server";

async function handleGet(req, res) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    
    try {
        await connectDB();
        
        const byId = searchParams.get("id");
        const storeId = process.env.NEXT_STORE_ID; //searchParams.get("storeId");
        const slug = searchParams.get("slug");
        

        const storeData = await Store.find().sort({ createdAt: -1 }).select('-user -general').lean();


        const theme = await StoreTheme.find().sort({ createdAt: -1 }).select('-user -header -latestArrival -highlightedCategories -bestSelling -featuredCollection -instagramFeed -shopByCategories').lean();
        
        if (theme) {
            return NextResponse.json({ message: "GET request success", data: {
                ...theme[0],
                storeData: storeData[0]
            } }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Theme not found" }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process GET request', message: error.message }, { status: 500 });
    }
}

export { handleGet as GET };
