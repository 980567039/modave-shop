// 按分类获取产品
import connectDB from "@/lib/db";
import ProductCategory from "@/models/product/category/ProductCategory";
import Product from "@/models/product/Product";
import { NextResponse } from "next/server";

async function handlePost(req, res) {
    try {
        // Parse the request body
        const data = await req.json();

        // Connect to the database
        await connectDB();

        // Create the filter for active (non-deleted) products
        const filter = {
            delete: false,
            visibility: true,
        };

        // If category IDs are provided, filter products by those categories
        if (data?.ids && data?.ids.length > 0) {
            filter.category = {
                $in: data?.ids  // Look for products whose category matches any of the provided IDs
            };
        }

        // Exclude the current product from the results using the $ne operator
        if (data?.currentProduct) {
            filter._id = { $ne: data.currentProduct };
        }

        const page = parseInt(data?.page) || 1;
        const limit = parseInt(data?.limit) || 8;

        const skip = (page - 1) * limit;
        // Find all products that match the filter
        let products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit) // Sort by most recent creation date        
            .populate('defaultImage')
            .populate('imageGallery')
            .populate('category')
            .populate('material')
            .lean();  // Use lean() for better performance

        // Deduplicate products based on their IDs (if necessary)
        const uniqueProducts = Array.from(new Set(products.map(p => p._id.toString())))
            .map(id => products.find(p => p._id.toString() === id));

        // If products are found, return them
        if (uniqueProducts && uniqueProducts.length > 0) {
            return NextResponse.json({ message: "GET request success", data: uniqueProducts }, { status: 200 });
        } else {
            return NextResponse.json({ message: "No products found" }, { status: 404 });
        }
    } catch (error) {
        // Handle any errors
        return NextResponse.json({ error: 'Failed to process GET request', message: error.message }, { status: 500 });
    }
}


async function handleGet(req, res) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    try {
        const byId = searchParams.get("id");
        const slug = searchParams.get("slug");
     

        await connectDB();

        const filter = {
            delete: searchParams.get("delete")
        };

        if (byId) {
            filter._id = byId;
        }
        if (slug) {
            filter.slug = slug;
        }

        let productCategories = await ProductCategory.findOne(filter).sort({ createdAt: -1 });

        if (productCategories) {
            return NextResponse.json({ message: "GET request success", data: productCategories }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Product category not found" }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process GET request', message: error.message }, { status: 500 });
    }
}

export { handlePost as POST, handleGet as GET };