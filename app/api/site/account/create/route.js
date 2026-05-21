// 创建用户账号
import User from "@/models/User";
import UserMeta from "@/models/UserMeta";
import { getBcrypt } from "@/lib/bcrypt";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ActivityLogs from "@/models/ActivityLogs";

export async function POST(request) {
    try {
        await connectDB();
        const formData = await request.json();

        // Validate email and password
        if (formData && formData.email && formData.password) {

            const findExists = await User.findOne({
                $or: [{ email: formData.email }]
            });

            if (findExists && findExists?.email === formData.email) {
                return NextResponse.json({ message: 'Email address already exists, please use another one' }, { status: 500 })
            }

            const bcrypt = await getBcrypt();
            const hashedPassword = await bcrypt.hash(formData.password, 10);

            const newUser = await User.create({
                username: formData.username,
                email: formData.email,
                password: hashedPassword,
                uniqueID: formData.uniqueID,
                contactNumber: formData.contactNumber
            });

            // create a new  user meta for this user with no data yet, only for this user ID
            await UserMeta.create({
                user: newUser.id,
                uniqueID: formData.uniqueID, 
            });


            await ActivityLogs.create({
                userId: newUser.id,
                activityType: "Create new account",
                activityDetails: `Add new user - ${newUser.id}`,
                endpoint: request.url || '',
                method: "POST",
            });

            return NextResponse.json({ message: 'Registration success', data: newUser }, { status: 200 });
        } else {
            return NextResponse.json({
                message: 'Invalid form data',
            }, { status: 400 });
        }

    } catch (error) {
        console.error('Error in API endpoint:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

