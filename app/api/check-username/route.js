// 检查用户名是否已被使用
import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectDB();
        const requestUserName = await request?.json();
        debugger
        if (requestUserName && requestUserName.username) {
            const { username } = requestUserName;
            const findExists = await User.findOne({
                $or: [{ username: username }]
            });

            if (findExists && findExists?.username === username) {
                return NextResponse.json({ message: 'username already exists, please use another one' }, { status: 200 })
            } else {
                return NextResponse.json({ message: 'ok' }, { status: 200 })
            }
        } else {
            return NextResponse.json({ message: 'Please provide a username', }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error, message: 'Please provide a username' }, { status: 400 });
    }
}