// 获取用户元数据信息
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import UserMeta from "@/models/UserMeta";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Function to handle GET request
export async function POST(req, res) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "You must be logged in." }, { status: 401 });
    }

    await connectDB();

    const reqData = await req.json();

    if (reqData && reqData.userId) {
        const findExists = await UserMeta.findOne({
            $or: [{ user: reqData.userId }]
        }).populate({
            path: 'user',
            select: '-password'  // Exclude the password field
        });

        if (findExists) {
            const userMetaData = JSON.stringify(findExists);
            const getUserData = {
                userMetaData: JSON.parse(userMetaData)
            };

            return NextResponse.json(getUserData, { status: 200 });
        } else {
            // return NextResponse.json({ message: 'User not log in' }, { status: 500 })
        }
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
}