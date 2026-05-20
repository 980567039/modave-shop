// 获取首页推荐产品
const { default: connectDB } = require("@/lib/db");
const { default: ProductCategory } = require("@/models/product/category/ProductCategory");
const { default: Product } = require("@/models/product/Product");
const { default: ProductMaterial } = require("@/models/product/material/ProductMaterial");
const { NextResponse } = require("next/server");

async function handleGet(req) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const type = searchParams.get("type");

    let baseCategoryDoc = null;
    let products = [];

    try {
        await connectDB();

        if (!type) {
            return NextResponse.json({ error: "Missing 'type' parameter" }, { status: 400 });
        }

        baseCategoryDoc = await ProductCategory.findOne({ slug: type });
        if (!baseCategoryDoc) {
            return NextResponse.json({ error: "Base category not found" }, { status: 404 });
        }


        const subCategories = await ProductCategory.find({ parentId: baseCategoryDoc._id });
        const categoryIds = [baseCategoryDoc._id, ...subCategories.map(cat => cat._id)];

        const filter = {
            delete: false,
            visibility: true,
            category: { $in: categoryIds },
        };

        products = await Product.find(filter)
            .populate("defaultImage")
            .populate("imageGallery")
            .populate("category")
            .populate("material")
            .select(
                "attributes defaultImage imageGallery inStock price salePrice stock title titleSlug category material sku sizeChart isGiftCard createdAt"
            )
            .limit(15)
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ data: products }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                message: "Internal error",
                error: error.message,
                stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
            },
            { status: 500 }
        );
    }
}

export { handleGet as GET };
