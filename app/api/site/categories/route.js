// 获取前台商品分类列表
import connectDB from "@/lib/db";
import ProductCategory from "@/models/product/category/ProductCategory";
import Product from "@/models/product/Product";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await connectDB();

        // Get pagination parameters from query string
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        // Get total count
        const totalCount = await ProductCategory.countDocuments({
            delete: false
        });

        // Get paginated categories
        const categories = await ProductCategory.find({
            delete: false
        })
        .skip(skip)
        .limit(limit)
        .lean();

        const categoriesWithCounts = await Promise.all(categories.map(async (item) => {
            const count = await Product.countDocuments({
                category: item._id,
                delete: false
            });
            // Return a new object or modify the existing one
            return { ...item, productCount: count };
        }));

        return NextResponse.json({ 
            message: "success", 
            data: categoriesWithCounts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                limit
            }
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to process GET request', message: error.message }, { status: 500 });
    }
}