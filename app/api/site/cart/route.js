// 购物车管理
import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
    const { uniqueID, cart, ip, browser } = await req.json();
    await connectDB();
    
    if (cart && uniqueID) {
        const checkIfAvailable = await Cart.findOne(
            { uniqueID: uniqueID },
        );

        if (checkIfAvailable) {
            const cartItems = await Cart.updateOne(
                { uniqueID: uniqueID },
                { $set: { cart: cart } },
            );

            if (!cartItems) {
                return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
            }

            const getUpdatedCart = await Cart.findOne({ uniqueID: uniqueID });

            return NextResponse.json({ message: "Cart updated successfully", data: getUpdatedCart }, { status: 200 });
        } else {
            const cartResponse = await Cart.create({
                uniqueID,
                cart
            });
            return NextResponse.json({ message: "Cart saved.", data: cartResponse }, { status: 200 });
        }
    }else{
        return NextResponse.json({ message: "Cart not found." }, { status: 400 });
    }

};

export const PUT = async (req, res) => {
    try {
        const { cart } = await req.json();

        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.searchParams);
        const uid = searchParams.get("uid");

        if (!uid) {
            return NextResponse.json({ error: 'Missing unique ID' }, { status: 400 });
        }

        const cartItems = await Cart.updateOne(
            { uniqueID: uid },
            { $set: cart },
            { new: true } // This option returns the updated document
        );

        const getUpdatedCart = await Cart.findOne({ uniqueID: uid });

        if (!cartItems || !getUpdatedCart) {
            return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
        }


        return NextResponse.json({ message: "Cart updated successfully", data: getUpdatedCart }, { status: 200 });
    } catch (error) {
        console.error('Error updating cart:', error);
        return NextResponse.json({ error: 'Failed to update cart', message: error.message }, { status: 500 });
    }
};

export const DELETE = async (req, res) => {
    return await handleDelete(req, res);
};

export const GET = async (req, res) => {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    // console.log("searchParams ===", searchParams);
    try {
        const cartItems = await Cart.find({ uniqueID: searchParams.get("uid") }).sort({ createdAt: -1 }).select('-ipAddress');
        // Add your GET logic here
        if(cartItems){
            return NextResponse.json({ message: "GET request success", cart: cartItems[0]?.cart }, { status: 200 });
        } else{
            return NextResponse.json({ message: "Cart is empty", cartItems }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process GET request', message: error.message }, { status: 500 });
    }
};

// Handle unsupported methods (this part can be handled by your framework, if required)
export const unsupportedMethod = async (req, res) => {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
};
