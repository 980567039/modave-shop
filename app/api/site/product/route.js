// 前台产品查询
import connectDB from "@/lib/db";
import ProductCategory from "@/models/product/category/ProductCategory";
import ProductMaterial from "@/models/product/material/ProductMaterial";
import Product from "@/models/product/Product";
import { NextResponse } from "next/server";


async function handleGet(req, res) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 9;
    const isDelete = searchParams.get('delete') === 'true';
    const categoryName = searchParams.get('category');
    const materialSlug = searchParams.get('material');
    const color = searchParams.get('color');
    const size = searchParams.get('size');
    const sort = searchParams.get('sort');
    const isShopPage = searchParams.get('isShopPage');
    const inCategoryLevel = searchParams.get('inCategoryLevel') === 'true';
    const baseCategory = searchParams.get('baseCategory');
    const isSales = searchParams.get('isSales');
    const search = searchParams.get('search');



    try {
        await connectDB();

        let filter = {
            delete: isDelete,
            visibility: true,
            showInShopPage: true
            // ...(isShopPage === 'true' ? { showInShopPage: true } : {})
        };

        let selectedCategory = '';
        let categoryCustomTitle = '';
        let categoryImage = '';
        let categoryDescription = '';

        if (isSales) {
            filter.salePrice = { $gt: 0 };
            delete filter.showInShopPage;
        }

        if (search) {
             filter.title = { $regex: new RegExp(search, 'i') };
        }


        if (inCategoryLevel && baseCategory) {
            const baseCategoryDoc = await ProductCategory.findOne({ slug: baseCategory, delete: false });

            if (!baseCategoryDoc) {
                return NextResponse.json({ error: 'Base category not found' }, { status: 404 });
            }

            selectedCategory = baseCategoryDoc?.title;
            categoryCustomTitle = baseCategoryDoc?.customCategoryTitle || baseCategoryDoc?.title;
            categoryDescription = baseCategoryDoc?.description;
            categoryImage = baseCategoryDoc?.categoryImage?.url || '';

            const subCategories = await ProductCategory.find({ parentId: baseCategoryDoc._id, delete: false });
            const categoryIds = [baseCategoryDoc._id, ...subCategories.map(cat => cat._id)];

            filter.category = { $in: categoryIds };


            delete filter.showInShopPage;
        }

        if (categoryName) {
            const category = await ProductCategory.findOne({ slug: categoryName, delete: false }).lean();

            if (category) {
                filter.category = category._id;
                delete filter.showInShopPage;
            } else {
                return NextResponse.json({ error: 'Category not found' }, { status: 404 });
            }
        }

        if (materialSlug) {
            const material = await ProductMaterial.findOne({ slug: materialSlug });
            if (material) {
                filter.material = material._id;
                delete filter.showInShopPage;
            } else {
                return NextResponse.json({ error: 'Material not found' }, { status: 404 });
            }
        }

        if (color || size) {
            
            if (color) {
                filter['attributes.attributes.color.value'] = { $regex: new RegExp(`^${color}$`, 'i') };
            }

            if (size) {
                 filter['attributes.attributes.size.value'] = { $regex: new RegExp(`^${size}$`, 'i') };
            }
        }

        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        for (const [key, value] of searchParams.entries()) {
            if (!['page', 'limit', 'delete', 'category', 'material', 'color', 'size', 'inCategoryLevel', 'baseCategory', 'isSales', 'minPrice', 'maxPrice', 'sort', 'search'].includes(key)) {
                filter[key] = value;
            }
        }

        // // Define the sort order based on the type
        // let sortOrder = { createdAt: -1 }; // Default sort order

        // if (sort && sort === 'sku') {
        //     sortOrder = { sku: 1 };
        // }

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .populate('defaultImage')
            .populate('imageGallery')
            .populate('category')
            .populate('material')
            .select('attributes defaultImage imageGallery inStock price salePrice stock title titleSlug category material sku sizeChart isGiftCard createdAt')
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        const response = {
            products: products,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalProducts,
            },
            selectedCategory,
            categoryCustomTitle,
            categoryDescription,
            categoryImage,
        };

        return NextResponse.json({ data: response }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to process GET request', message: error.message }, { status: 500 });
    }
}

export { handleGet as GET };