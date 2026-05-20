// 产品管理接口,支持产品的创建、更新、查询等操作
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import Product from "@/models/product/Product";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Define individual handler functions for each HTTP method
async function handlePost(req, res) {
    const session = await getServerSession(authOptions);
    const acceptRoles = ['admin', 'sales', 'manager', 'marketing', 'inventoryManager'];

    if (session && acceptRoles.some((d) => d === session?.user?.role)) {
        try {
            await connectDB();

            const reqData = await req?.json();

            if (reqData && reqData?.title && reqData?.price) {
                // Start by spreading all properties of reqData into payload
                const payload = { ...reqData };

                // Handle the material field
                if (reqData?.material && reqData.material !== "" && mongoose.Types.ObjectId.isValid(reqData.material)) {
                    payload.material = new mongoose.Types.ObjectId(reqData.material);
                } else {
                    delete payload.material; // Remove the field if not valid
                }

                // Handle the defaultImage field
                if (reqData?.defaultImage && reqData.defaultImage !== "" && mongoose.Types.ObjectId.isValid(reqData.defaultImage)) {
                    payload.defaultImage = new mongoose.Types.ObjectId(reqData.defaultImage);
                } else {
                    delete payload.defaultImage; // Remove the field if not valid
                }

                const res = await Product.create({
                    ...payload,
                    createdBy: session?.user?.id,
                    salePrice: Number(reqData?.salePrice || 0)
                });

                return NextResponse.json({ message: 'Success', data: res }, { status: 200 });
            } else {
                return NextResponse.json({ error, message: 'Error' }, { status: 400 });
            }
        } catch (error) {
            return NextResponse.json({ error, message: 'Error, Title and Price is required' }, { status: 400 });
        }
    } else {
        return NextResponse.json({ message: "access denied" }, { status: 500 });
    }
}

// put data
async function handlePut(req) {
    const reqData = await req?.json();
    const session = await getServerSession(authOptions);
    const acceptRoles = ['admin', 'sales', 'manager', 'marketing', 'inventoryManager'];

    if (session && acceptRoles.some((d) => d === session?.user?.role)) {
        if (reqData && reqData.id) {
            const updateData = {
                ...reqData,
            }

            if (reqData?.material && reqData.material !== "" && mongoose.Types.ObjectId.isValid(reqData.material)) {
                updateData.material = new mongoose.Types.ObjectId(reqData.material);
            } else {
                updateData.material = null; // or remove the material field if not needed
            }


            if (reqData?.defaultImage && reqData.defaultImage !== "" && mongoose.Types.ObjectId.isValid(reqData.defaultImage)) {
                updateData.defaultImage = new mongoose.Types.ObjectId(reqData.defaultImage);
            } else {
                updateData.defaultImage = null;
            }

            if (reqData?.imageGallery && reqData.imageGallery?.length > 0) {
                updateData.imageGallery = reqData.imageGallery.map((id) => {
                    return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
                })
            } else {
                updateData.imageGallery = [];
            }


            delete updateData.id;

            await Product.updateOne({ _id: reqData.id }, { $set: updateData });
            const product = await Product.findOne({ _id: reqData.id });

            return NextResponse.json({ message: "PUT request success", data: product }, { status: 200 });
        } else {
            return NextResponse.json({ message: "ID not found" }, { status: 400 });
        }
    } else {
        return NextResponse.json({ message: "access denied" }, { status: 500 });
    }
};

async function handleGet(req, res) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const session = await getServerSession(authOptions);
    const acceptRoles = ['admin', 'sales', 'manager', 'marketing', 'inventoryManager'];

    if (session && acceptRoles.some((d) => d === session?.user?.role)) {
        try {
            await connectDB();
            const byId = searchParams.get("id");
            const slug = searchParams.get("slug");
            const type = searchParams.get("type");
            const category = searchParams.get("category");

            const search = searchParams.get("search");

            const limit = parseInt(searchParams.get("limit"), 10) || null;
            const pageInt = parseInt(searchParams.get("page"), 10) || 1;

            const filter = {}

            if (searchParams.get("delete")) {
                filter.delete = searchParams.get("delete")
            }

            if (byId) {
                filter._id = byId;
            }

            if (slug) {
                filter.titleSlug = slug;
            }

            if (category) {
                filter.category = { $in: [category] };
            }

            // Handle the type parameter
            if ((!byId && !slug) && type !== 'all' && type !== 'trashed' && type !== 'sku') {
                filter.inStock = type === 'inStock';
            }

            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { sku: { $regex: search, $options: 'i' } },
                ];
            }

            // Define the sort order based on the type
            let sortOrder = { createdAt: -1 };

            // If type is 'sku', sort by SKU field
            if (type === 'sku') {
                sortOrder = { sku: -1 };
            }

            let productQuery = Product.find(filter)
                .sort(sortOrder)
                .populate('defaultImage')
                .populate('imageGallery');

            if (limit && pageInt) {
                productQuery = productQuery.limit(limit)
                    .skip((pageInt - 1) * limit);
            }

            let product = await productQuery.exec();

            if (!byId) {
                const productCount = await Product.countDocuments(filter);
                return NextResponse.json({
                    message: "GET request success", data: {
                        products: product,
                        productCount
                    }
                }, { status: 200 });
            }

            return NextResponse.json({ message: "GET request success", data: product }, { status: 200 });

        } catch (error) {
            return NextResponse.json({ error: 'Failed to process GET request', message: error.message }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: "access denied" }, { status: 500 });
    }
};

export { handlePut as PUT, handleGet as GET, handlePost as POST };
