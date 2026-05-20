// 获取单个产品详情
import connectDB from "@/lib/db";
import ProductMaterial from "@/models/product/material/ProductMaterial";
import Product from "@/models/product/Product";
import { NextResponse } from "next/server";

async function handleGet(req, res) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    try {
        const byId = searchParams.get("id");
        const slug = searchParams.get("slug");

        await connectDB();

        const filter = {
            delete: searchParams.get("delete") || false,
            visibility: true,
        };

        if (byId) {
            filter._id = byId;
        }
        if (slug) {
            filter.titleSlug = slug;
        }

        let product = await Product.findOne(filter)
            .sort({ createdAt: -1 })
            .populate('material')
            .populate('defaultImage')
            .populate('imageGallery')
            .populate({
                path: 'category',
                select: '_id title slug'
            }).lean();

        if (product) {
            // Get category IDs from the current product
            const categoryIds = product.category.map(cat => cat._id);

            // Find 5 related products from the same categories
            const relatedProducts = await Product.find({
                _id: { $ne: product._id }, // Exclude current product
                category: { $in: categoryIds }, // Match any of the categories
                visibility: true,
                delete: false
            })
                .populate('defaultImage')
                .populate({
                    path: 'category',
                    select: '_id title slug'
                })
                .limit(10)
                .sort({ createdAt: -1 })
                .lean();

            // Add related products to the response
            return NextResponse.json({
                message: "GET request success",
                data: {
                    ...product,
                    relatedProducts
                }
            }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process GET request', message: error.message }, { status: 500 });
    }
}

export { handleGet as GET };