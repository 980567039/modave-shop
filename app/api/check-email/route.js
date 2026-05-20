// 检查邮箱地址是否已被注册
import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectDB();
        const requestEmailAddress = await request?.json();

        if (requestEmailAddress && requestEmailAddress.email) {
            const { email } = requestEmailAddress;
            const findExists = await User.findOne({
                $or: [{ email: email }]
            });

            if (findExists && findExists?.email === email) {
                return NextResponse.json({ message: 'Email address already exists, please use another one' }, { status: 200 })
            } else {
                return NextResponse.json({ message: 'ok' }, { status: 200 })
            }
        } else {
            return NextResponse.json({ message: 'Please provide a email address', }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error, message: 'Please provide a email address' }, { status: 400 });
    }
}