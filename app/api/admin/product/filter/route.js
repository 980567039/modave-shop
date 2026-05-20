// 产品筛选查询
import { authOptions } from "@/lib/authOptions";
import Product from "@/models/product/Product";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function handleGet(req, res) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const session = await getServerSession(authOptions);

    const acceptRoles = ['admin', 'sales', 'manager', 'marketing', 'inventoryManager'];
    
    if (session && acceptRoles.some((d) => d === session?.user?.role)) {
        try {
            const query = searchParams.get("query");
            
            let filter = {};

            if (query) {
                filter = {
                    visibility: true,
                    delete: false,
                    $or: [
                        { title: { $regex: query, $options: 'i' } }, // case-insensitive search by title
                        { sku: { $regex: query, $options: 'i' } }    // case-insensitive search by SKU
                    ]
                };
            }

            const products = await Product.find(filter).sort({ createdAt: -1 }).populate('defaultImage').populate('imageGallery').lean();

            return NextResponse.json({ message: "GET request success", data: products }, { status: 200 });

        } catch (error) {
            return NextResponse.json({ error: 'Failed to process GET request', message: error.message }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }
};

export { handleGet as GET };
