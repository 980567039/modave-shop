// 用户注册接口,创建新用户账号和用户元数据
import User from "@/models/User";
import UserMeta from "@/models/UserMeta";
import { getBcrypt } from "@/lib/bcrypt";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ActivityLogs from "@/models/ActivityLogs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(request) {
    try {
        await connectDB();
        const formData = await request.json();
        const session = await getServerSession(authOptions);



        // Validate email and password
        if (formData && formData.email && formData.capabilities && formData.password) {
            const findExists = await User.findOne({
                $or: [{ email: formData.email }]
            });


            if (findExists && findExists?.email === formData.email) {
                return NextResponse.json({ message: 'Email address already exists, please use another one' }, { status: 500 })
            }

            const bcrypt = await getBcrypt();
            const hashedPassword = await bcrypt.hash(formData.password, 10);

            const newUser = await User.create({
                email: formData.email,
                password: hashedPassword,
                role: formData.role,
                capabilities: formData.capabilities,
                username: formData?.username
            });

            // create a new  user meta for this user with no data yet, only for this user ID
            await UserMeta.create({
                user: newUser.id,
            });


            await ActivityLogs.create({
                userId: session?.user?.id,
                activityType: "Add new user",
                activityDetails: `${session?.user?.firstName} created new user - ${formData.email}`,
                endpoint: request.url || '',
                method: "POST",
            });


            return NextResponse.json({ message: 'Registration success' }, { status: 200 });
        } else {
            return NextResponse.json({
                message: 'Invalid form data',
            }, { status: 400 });
        }


        if (session?.user?.role === 'admin') {

            // Validate email and password
            if (formData && formData.email && formData.capabilities && formData.password) {
                const findExists = await User.findOne({
                    $or: [{ email: formData.email }]
                });


                if (findExists && findExists?.email === formData.email) {
                    return NextResponse.json({ message: 'Email address already exists, please use another one' }, { status: 500 })
                }

                const bcrypt = await getBcrypt();
                const hashedPassword = await bcrypt.hash(formData.password, 10);

                const newUser = await User.create({
                    email: formData.email,
                    password: hashedPassword,
                    role: formData.role,
                    capabilities: formData.capabilities,
                    username: formData?.username
                });

                // create a new  user meta for this user with no data yet, only for this user ID
                await UserMeta.create({
                    user: newUser.id,
                });


                await ActivityLogs.create({
                    userId: session?.user?.id,
                    activityType: "Add new user",
                    activityDetails: `${session?.user?.firstName} created new user - ${formData.email}`,
                    endpoint: request.url || '',
                    method: "POST",
                });


                return NextResponse.json({ message: 'Registration success' }, { status: 200 });
            } else {
                return NextResponse.json({
                    message: 'Invalid form data',
                }, { status: 400 });
            }
        } else {
            return NextResponse.json({ message: 'You are not authorized to perform this action' }, { status: 401 });
        }


    } catch (error) {
        console.error('Error in API endpoint:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
