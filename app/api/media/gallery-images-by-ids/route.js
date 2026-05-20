// 根据 ID 列表获取图库图片
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import MediaLibrary from "@/models/MediaLibrary";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function handlePost(req, res) {
    const session = await getServerSession(authOptions);
    
    const acceptRoles = ['admin', 'sales', 'manager', 'marketing', 'inventoryManager'];
    
    if (session && acceptRoles.some((d) => d === session?.user?.role)) {
        try {
            await connectDB();

            const { userId, ids } = await req.json();
            

            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                throw new Error("IDs array is missing or empty");
            }

            // Convert the string IDs to ObjectId if they are stored as ObjectId in MongoDB
            const objectIds = ids.map(id => {
                if (mongoose.Types.ObjectId.isValid(id)) {
                    return new mongoose.Types.ObjectId(id);
                } else {
                    throw new Error(`Invalid ID format: ${id}`);
                }
            });

            

            // Query the database with the array of ObjectIds
            const findImages = await MediaLibrary.find({ _id: { $in: objectIds } });

            if (!findImages || findImages.length === 0) {
                return NextResponse.json({ message: 'No images found' }, { status: 404 });
            }

            return NextResponse.json({ message: 'Success', data: findImages }, { status: 200 });
        } catch (error) {
            console.error("Error:", error);
            return NextResponse.json({ error: error.message, message: 'Error during image retrieval' }, { status: 400 });
        }
    } else {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }
}

export { handlePost as POST };
