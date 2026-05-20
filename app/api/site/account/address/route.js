// 用户地址管理
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import UserMeta from "@/models/UserMeta";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "You must be logged in." }, { status: 401 });
    }

    try {
        await connectDB();
        const userMeta = await UserMeta.findOne({ user: session.user.id });

        if (!userMeta) {
             return NextResponse.json({ data: [] }, { status: 200 });
        }

        return NextResponse.json({ data: userMeta.shippingAddress || [] }, { status: 200 });
    } catch (error) {
        console.error("Fetch address error:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "You must be logged in." }, { status: 401 });
    }

    try {
        await connectDB();
        const formData = await request.json();

        const updatedUserMeta = await UserMeta.findOneAndUpdate(
            { user: session?.user?.id }, // Find the document by user ID
            { $set: formData },           // Update with formData
            { new: true }                 // Return the updated document
        );


        

        return NextResponse.json(updatedUserMeta, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}