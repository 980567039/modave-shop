// 获取产品元数据
import connectDB from "@/lib/db";
import ProductAttributes from "@/models/product/attribute/ProductAttributes";
import ProductCategory from "@/models/product/category/ProductCategory";
import ProductMaterial from "@/models/product/material/ProductMaterial";
import Product from "@/models/product/Product";
import { NextResponse } from "next/server";

function reorganizeAttributes(attributes) {
    return attributes.map(attr => ({
        name: attr.name.toLowerCase(),
        terms: attr.terms.map(term => {
            const termObj = { termName: term.termName, slug: term.slug };
            if (term.color) {
                termObj.color = term.color;
            }
            return termObj;
        }),
        id: attr._id
    }));
}

export async function GET(req) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const categorySlug = searchParams.get('category');

    try {
        await connectDB();

        const [attributes, allMaterials] = await Promise.all([
            ProductAttributes.find({ delete: false }).lean(),
            ProductMaterial.find({ delete: false }).lean(),
        ]);

        let categories;
        let selectedCategory;
        let materials = allMaterials;

        if (categorySlug) {
            const parentCategory = await ProductCategory.findOne({ slug: categorySlug, delete: false });
            if (!parentCategory) {
                return NextResponse.json({ error: 'Category not found' }, { status: 404 });
            }
            categories = await ProductCategory.find({
                delete: false,
                $or: [
                    { _id: parentCategory._id },
                    { parentId: parentCategory._id }
                ]
            }).select('_id slug title parentId').lean();

            selectedCategory = parentCategory?.title

            const products = await Product.find({ category: { $in: categories.map(cat => cat._id) } }).select('material');
            
            if (products.length > 0) {
                const materialIds = products.reduce((ids, product) => {
                    if (product.material && Array.isArray(product.material)) {
                        ids.push(...product.material);
                    } else if (product.material) {
                        ids.push(product.material);
                    }
                    return ids;
                }, []);

                if (materialIds.length > 0) {
                    const uniqueMaterialIds = [...new Set(materialIds)];
                    materials = allMaterials.filter(material => 
                        uniqueMaterialIds.some(id => id.toString() === material._id.toString())
                    );
                } else {
                    // If no materials are found, we keep all materials
                    console.log('No materials found for the selected category. Returning all materials.');
                }
            } else {
                console.log('No products found for the selected category. Returning all materials.');
            }
        } else {
            categories = await ProductCategory.find({ delete: false })
                .select('_id slug title parentId').lean();
        }

        const response = {
            attributes: reorganizeAttributes(attributes),
            categories,
            materials,
            selectedCategory
        };

        return NextResponse.json({ data: response }, { status: 200 });

    } catch (error) {
        console.error('Error in GET request:', error);
        return NextResponse.json({ error: 'Failed to process GET request', message: error.message }, { status: 500 });
    }
}