// 检查产品 slug 是否可用
import { authOptions } from "@/lib/authOptions";
import Product from "@/models/product/Product";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req) {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    const session = await getServerSession(authOptions);

    const acceptRoles = ['admin', 'sales', 'manager', 'marketing', 'inventoryManager'];

    if (session && acceptRoles.some((d) => d === session?.user?.role)) {
        try {
            const existingProduct = await Product.findOne({ titleSlug: slug }).lean();

            if (existingProduct) {
                return NextResponse.json({ exists: true }, { status: 200 });
            } else {
                return NextResponse.json({ exists: false }, { status: 200 });
            }
        } catch (error) {
            return NextResponse.json({ error: 'Failed to check slug', message: error.message }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }
}