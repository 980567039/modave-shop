// 根据 ID 列表批量获取产品
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import Product from "@/models/product/Product";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Define individual handler functions for each HTTP method
async function handlePost(req, res) {
    const session = await getServerSession(authOptions);
    const acceptRoles = ['admin', 'sales', 'manager', 'marketing', 'inventoryManager'];
    
    if (session && acceptRoles.some((d) => d === session?.user?.role)) {
        try {
            await connectDB();

            const { ids } = await req?.json();
            
            if (ids && ids?.length > 0) {     
                
                
                try {
                    const changeIdToObjectId = ids?.map((id) => {
                        if(mongoose.Types.ObjectId.isValid(id)){
                            return new mongoose.Types.ObjectId(id)
                        }
                    });
                    
                    const findProducts = await Product.find({
                      _id: { $in: changeIdToObjectId }
                    }).populate('defaultImage'); // Populate the defaultImage field

                    
              
                    return NextResponse.json({ message: 'Success', data: findProducts }, { status: 200 });
                  } catch (error) {
                    return NextResponse.json({ error, message: 'Something went wrong' }, { status: 500 });
                  }
            } else {
                return NextResponse.json({ error, message: 'Ids not found' }, { status: 400 });
            }
        } catch (error) {
            return NextResponse.json({ error, message: 'Error' }, { status: 400 });
        }
    } else {
        return NextResponse.json({ message: "access denied" }, { status: 500 });
    }
}


export { handlePost as POST };