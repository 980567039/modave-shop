// 获取产品库存数据
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
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
            await connectDB();

            // Get product counts
            const [inStockCount, outOfStockCount] = await Promise.all([
                Product.countDocuments({ delete: false, inStock: true }),
                Product.countDocuments({ delete: false, inStock: false })
            ]);

            // Get all products to calculate total stock and value
            const allProducts = await Product.find({ delete: false });
            
            // Calculate total stock and inventory value
            let totalStockCount = 0;
            let totalInventoryValue = 0;
            
            allProducts.forEach(product => {
                // Count main product stock
                const mainStock = parseInt(product.stock || 0);
                totalStockCount += mainStock;
                
                // Calculate main product value
                const mainPrice = parseFloat(product.price || 0);
                totalInventoryValue += mainStock * mainPrice;
                
                // Count attribute variants stock
                if (product.attributes && Array.isArray(product.attributes)) {
                    product.attributes.forEach(attr => {
                        const attrStock = parseInt(attr.stock || 0);
                        totalStockCount += attrStock;
                        
                        // Calculate attribute variant value
                        const attrPrice = parseFloat(attr.price || product.price || 0);
                        totalInventoryValue += attrStock * attrPrice;
                    });
                }
            });

            // Get best selling product
            const bestSellingProduct = await Order.aggregate([
                { 
                    $match: { 
                        delete: false,
                        status: "completed"  
                    } 
                },
                { $unwind: "$items" },
                {
                    $group: {
                        _id: "$items.productId",
                        totalSold: { $sum: "$items.quantity" },
                        productName: { $first: "$items.name" },
                        productImage: { $first: "$items.image" },
                        productSlug: { $first: "$items.slug" }
                    }
                },
                { $sort: { totalSold: -1 } },
                { $limit: 1 }
            ]);
            
            return NextResponse.json({
                message: "GET request success", 
                data: {
                    inStockCount,
                    outOfStockCount,
                    totalStockCount,
                    totalInventoryValue: Math.round(totalInventoryValue * 100) / 100, // Round to 2 decimal places
                    bestSellingProduct: bestSellingProduct[0] || null,
                }
            }, { status: 200 });

        } catch (error) {
            return NextResponse.json({ error: 'Failed to process GET request', message: error.message }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: "access denied" }, { status: 500 });
    }
};

export { handleGet as GET };