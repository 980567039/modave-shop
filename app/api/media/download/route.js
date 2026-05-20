// 获取产品图片 URL 列表,用于批量下载或处理
// pages/api/download.js
import connectDB from "@/lib/db";
import Product from "@/models/product/Product";
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

// Helper function to extract all image URLs from a product
const extractImageUrls = (product) => {
    const imageUrls = [];

    // Add defaultImage URL if it exists
    if (product.defaultImage?.url) {
        imageUrls.push(product.defaultImage.url);
    }

    // Add URLs from attributes array
    if (Array.isArray(product.attributes)) {
        product.attributes.forEach(attr => {
            if (attr.image) {
                imageUrls.push(attr.image);
            }
        });
    }

    // Add URLs from imageGallery array
    if (Array.isArray(product.imageGallery)) {
        product.imageGallery.forEach(gallery => {
            if (gallery.image) {
                imageUrls.push(gallery.image);
            }
        });
    }

    return imageUrls;
};

export async function GET(req) {
    try {
        await connectDB();

        const startDate = new Date('2025-01-16T00:00:00.000Z');

        const products = await Product.find({
            createdAt: {
                $gte: startDate,
            }
        })
            .select('imageGallery defaultImage attributes')
            .populate('imageGallery')
            .populate('defaultImage');

        // Extract all image URLs from all products
        const allImageUrls = products.reduce((acc, product) => {
            const productUrls = extractImageUrls(product);
            return [...acc, ...productUrls];
        }, []);

        return NextResponse.json({
            message: 'Files fetched successfully',
            images: allImageUrls,
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: 'File fetch failed',
            error,
        }, { status: 500 });
    }
}