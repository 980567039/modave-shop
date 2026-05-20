// 产品属性管理
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import ProductAttributes from "@/models/product/attribute/ProductAttributes";
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

            if (reqData && reqData.terms) {
                const res = await ProductAttributes.create({
                    name: reqData?.name || "",
                    slug: reqData?.slug || "",
                    descriptions: reqData?.descriptions || "",
                    terms: reqData.terms || []
                });

                return NextResponse.json({ message: 'Success', data: res }, { status: 200 });
            } else {
                return NextResponse.json({ error, message: 'Error' }, { status: 400 });
            }
        } catch (error) {
            return NextResponse.json({ error, message: 'Error' }, { status: 400 });
        }
    } else {
        return NextResponse.json({ message: "access denied" }, { status: 500 });
    }
}

// put data
async function handlePut(req) {
    const reqData = await req?.json();
    const session = await getServerSession(authOptions);
    const acceptRoles = ['admin', 'sales', 'manager', 'marketing', 'inventoryManager'];
    
    if (session && acceptRoles.some((d) => d === session?.user?.role)) {
        if (reqData && reqData.id) {
            const updateData = {
                ...reqData,
            }

            delete updateData.id;

            await ProductAttributes.updateOne({ _id: reqData.id }, { $set: updateData });
            const attributes = await ProductAttributes.findOne({ _id: reqData.id });

            return NextResponse.json({ message: "PUT request success", data: attributes }, { status: 200 });
        } else {
            return NextResponse.json({ message: "ID not found" }, { status: 400 });
        }
    } else {
        return NextResponse.json({ message: "access denied" }, { status: 500 });
    }
};


async function handleGet(req, res) {
    // get all the attribute
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const session = await getServerSession(authOptions);

    const acceptRoles = ['admin', 'sales', 'manager', 'marketing', 'inventoryManager'];
    
    if (session && acceptRoles.some((d) => d === session?.user?.role)) {
        try {
            const attributes = await ProductAttributes.find({ delete: searchParams.get("delete") });
            // Add your GET logic here
            return NextResponse.json({ message: "GET request success", data: attributes }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: 'Failed to process GET request', message: error.message }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: "access denied" }, { status: 500 });
    }
};

async function handleDelete(req) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const id = searchParams.get("id");
    const session = await getServerSession(authOptions);

    const acceptRoles = ['admin', 'sales', 'manager', 'marketing', 'inventoryManager'];
    
    if (session && acceptRoles.some((d) => d === session?.user?.role)) {
        if (id) {
            try {
                await connectDB();
                const result = await ProductAttributes.findByIdAndDelete(id);
                
                if (result) {
                    return NextResponse.json({ message: "Product attribute permanently deleted", data: result }, { status: 200 });
                } else {
                    return NextResponse.json({ message: "Product attribute not found" }, { status: 404 });
                }
            } catch (error) {
                return NextResponse.json({ error: 'Failed to process DELETE request', message: error.message }, { status: 500 });
            }
        } else {
            return NextResponse.json({ message: "ID not provided" }, { status: 400 });
        }
    } else {
        return NextResponse.json({ message: "Access denied" }, { status: 500 });
    }
}



export { handlePut as PUT, handleGet as GET, handlePost as POST, handleDelete as DELETE  };