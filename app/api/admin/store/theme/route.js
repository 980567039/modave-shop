// 店铺主题设置
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import { validateStoreThemePayload } from "@/lib/validation/storeTheme";
import StoreTheme from "@/models/StoreTheme";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Define individual handler functions for each HTTP method
async function handlePost(req, res) {
    const session = await getServerSession(authOptions);
    
    const acceptRoles = ['admin', 'sales', 'manager', 'marketing', 'inventoryManager'];
    
    if (session && acceptRoles.some((d) => d === session?.user?.role)) {
        try {
            await connectDB();

            const reqData = await req?.json();
            
            const validationErrors = validateStoreThemePayload(reqData);

            if (validationErrors.length > 0) {
                return NextResponse.json(
                    { message: "Validation failed", errors: validationErrors },
                    { status: 422 }
                );
            }

            if (reqData && reqData.storeId) {
                const findExisting = await StoreTheme.findOne({ storeId: reqData.storeId });
                let res;

                if (findExisting) {
                    // Update existing theme
                    res = await StoreTheme.findOneAndUpdate(
                        { storeId: reqData.storeId },
                        { $set: reqData },
                        { new: true }
                    );
                } else {
                    // Create new theme
                    res = await StoreTheme.create({
                        ...reqData,
                        user: session?.user?.id
                    });
                }

                return NextResponse.json({ message: 'Success', data: res }, { status: 200 });
            } else {
                return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
            }
        } catch (error) {
            return NextResponse.json({ error, message: error.message }, { status: 400 });
        }
    } else {
        return NextResponse.json({ message: "access denied" }, { status: 403 });
    }
}

async function handlePut(req, res) {

}


async function handleGet(req, res) {

}


export { handlePut as PUT, handleGet as GET, handlePost as POST };
