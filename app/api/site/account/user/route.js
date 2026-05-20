// 获取用户账号信息
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import ActivityLogs from "@/models/ActivityLogs";
import Cart from "@/models/Cart";
import Store from "@/models/Store";
import User from "@/models/User";
import UserMeta from "@/models/UserMeta";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async (req, res) => {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    // console.log("searchParams ===", searchParams);
    const session = await getServerSession(authOptions);
    let userData = null;

    try {
        await connectDB();
        const storeId = process.env.NEXT_STORE_ID;

        if (session?.user?.id) {
            console.log("Fetching user by session ID:", session.user.id);
            userData = await User.findById(session.user.id).select('-password');
        } else {
            console.log("Fetching user by query UID:", searchParams.get("uid"));
            userData = await User.findOne({ uniqueID: searchParams.get("uid") }).sort({ createdAt: -1 }).select('-password');
        }
        console.log("Fetched userData:", userData);
        
        const cartItems = await Cart.findOne({ uniqueID: searchParams.get("uid") }).sort({ createdAt: -1 }).select('-ipAddress');

        let userMeta;
        if (session) {
            userMeta = await UserMeta.findOne({ user: session?.user.id }).sort({ createdAt: -1 });
        } else {
            userMeta = await UserMeta.findOne({ uniqueID: searchParams.get("uid") }).sort({ createdAt: -1 });
        }


        let payload = {};

        // Add your GET logic here
        if (userData) {
            payload.user = userData || [];
        }

        if (userMeta) {
            payload.userMeta = userMeta || [];
        }

        if (cartItems) {

            payload.cart = cartItems?.cart || [];
            payload.cartId = cartItems?._id || '';
        }

        if (storeId) {
            payload.storeData = await Store.findOne({ _id: storeId }).sort({ createdAt: -1 }).select('-user').lean();
        }

        return NextResponse.json({ message: "GET request success", data: payload }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process GET request', message: error.message }, { status: 500 });
    }
};

export const POST = async (req, res) => {
    try {
        await connectDB();
        const formData = await req.json();

        
        

        if (formData && formData.email) {
            const newUser = await User.create({
                email: formData.email,
                role: "subscriber",
            });

            await UserMeta.create({
                user: newUser.id,
                uniqueID: formData.uniqueID,
            });


            await ActivityLogs.create({
                userId: newUser.id,
                activityType: "Create new subscriber",
                activityDetails: `Add new user to subscribe - ${newUser.id}`,
                endpoint: req.url || '',
                method: "POST",
            });

            return NextResponse.json({ message: 'Registration success', data: newUser }, { status: 200 });
        } else {
            return NextResponse.json({
                message: 'Invalid form data',
            }, { status: 400 });
        }
    } catch (error) {
        console.log("formData===", error);
        return NextResponse.json({
            message: error,
        }, { status: 400 });
    }
}


// Handle unsupported methods (this part can be handled by your framework, if required)
export const unsupportedMethod = async (req, res) => {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
};
