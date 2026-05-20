// 用户管理
import { authOptions } from "@/lib/authOptions";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function handlePost(req, res) {
    const reqData = await req?.json();
    const session = await getServerSession(authOptions);

    if( session?.user?.role === "admin"){
        const updateOne = await User.findOneAndUpdate({ 
            _id: reqData?.id 
        }, { 
            $set: { 
                capabilities: reqData?.capabilities,
            } 
        }, { new: true }).select('-password');

        return NextResponse.json({ message: "PUT request success", data: updateOne }, { status: 200 });
    }
}


export { handlePost as POST };