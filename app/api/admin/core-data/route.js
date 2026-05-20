// 获取核心数据配置
import { authOptions } from "@/lib/authOptions";
import { accessThisRoles } from "@/lib/common";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Store from "@/models/Store";
import StoreTheme from "@/models/StoreTheme";
import ProductAttributes from "@/models/product/attribute/ProductAttributes";
import ProductCategory from "@/models/product/category/ProductCategory";
import ProductMaterial from "@/models/product/material/ProductMaterial";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function handlePut(req, res) { }
async function handlePost(req, res) { }

async function handleGet(req, res) {
    const session = await getServerSession(authOptions);

    const acceptRoles = ['admin', 'sales', 'manager', 'marketing', 'inventoryManager'];
    
    if (session && acceptRoles.some((d) => d === session?.user?.role)) {
        await connectDB();
        try {
            // Run all queries in parallel
            const [attributes, categories, materials, stores, orderCount] = await Promise.all([
                ProductAttributes.find({ delete: false }).lean(),
                ProductCategory.find({ delete: false }).lean(),
                ProductMaterial.find({ delete: false }).lean(),
                Store.find().lean(),
                Order.countDocuments({ isNewOrder: true, delete: false })
            ]);

            const returnDataSet = {
                attributes,
                categories,
                materials,
                store: stores,
                orderCount,
            };

            if (stores?.length) {
                // Run the store theme query if stores exist
                const storeThemes = await StoreTheme.find({ storeId: stores[0]._id }).sort({ createdAt: 1 }).lean();
                if (storeThemes?.length) {
                    returnDataSet.store = {
                        ...returnDataSet.store,
                        theme: storeThemes,
                        userData: session?.user || {}
                    };
                }
            }

            return NextResponse.json({ message: "GET request success", data: returnDataSet }, { status: 200 });

        } catch (error) {
            return NextResponse.json({ error: 'Failed to process GET request', message: error.message }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }
}

export { handlePut as PUT, handleGet as GET, handlePost as POST };
