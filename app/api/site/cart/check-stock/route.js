// 检查购物车商品库存
import connectDB from "@/lib/db";
import Product from "@/models/product/Product";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
    const { cartItems } = await req.json();
    await connectDB();
    
    if (cartItems && cartItems.length > 0) {
        try {
            // Create an array to store the results of stock checks
            const stockCheckResults = [];

            // Check each cart item
            for (const item of cartItems) {
                // Find the product in the database
                const product = await Product.findById(item.productId);                
                
                if (!product) {
                    return NextResponse.json({ 
                        message: `Product not found: ${item.name}`,
                        showMessage: true,
                    }, { status: 404 });
                }

                if(!product?.isGiftCard){
                    // Find the matching attribute combination
                    const matchingAttribute = product.attributes.find(attr => 
                        attr.attributes.color.value === item.color && 
                        attr.attributes.size.value === item.size
                    );
    
                    if (!matchingAttribute) {
                        return NextResponse.json({ 
                            message: `Combination of size ${item.size} and color ${item.color} not found for product: ${item.name}`,
                            showMessage: true,
                        }, { status: 500 });
                    }
    
                    // Convert stock to number and check if it's sufficient
                    const availableStock = parseInt(matchingAttribute.stock);
                    const isStockSufficient = availableStock >= item.quantity;
    
                    stockCheckResults.push({
                        productId: item.productId,
                        name: item.name,
                        requestedQuantity: item.quantity,
                        availableStock,
                        isStockSufficient,
                        size: item.size,
                        color: item.color
                    });
                }

            }

            // Check if any product has insufficient stock
            const insufficientStock = stockCheckResults.filter(item => !item.isStockSufficient);
            
            if (insufficientStock.length > 0) {
                return NextResponse.json({ 
                    message: "Insufficient stock for some items",
                    insufficientItems: insufficientStock,
                    showMessage: true,
                }, { status: 400 });
            }

            // If all stock checks pass, return success
            return NextResponse.json({ 
                message: "Stock check passed",
                stockStatus: stockCheckResults ,
                showMessage: false,
            }, { status: 200 });

        } catch (error) {
            console.error("Error checking stock:", error);
            return NextResponse.json({ 
                message: "Error checking stock availability" ,
                showMessage: true,
            }, { status: 500 });
        }
    } else {
        return NextResponse.json({ 
            message: "Cart not found." ,
            showMessage: true,
        }, { status: 400 });
    }
};