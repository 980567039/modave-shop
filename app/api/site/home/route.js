// 首页数据
import { NextResponse } from "next/server";
import { cache } from 'react';
import connectDB from "@/lib/db";
import Product from "@/models/product/Product";
import Store from "@/models/Store";
import StoreTheme from "@/models/StoreTheme";

// Cache the store data
const getStoreData = cache(async (storeId) => {
  return await Store.findOne({ _id: storeId }).sort({ createdAt: -1 }).select('-user -general').lean();
});

// Cache the theme data
const getThemeData = cache(async (filter) => {
  return await StoreTheme.findOne(filter).sort({ createdAt: -1 }).select('-user -footer -common');
});

// Cache the products data
const getProducts = cache(async (productIds) => {
  return await Product.find({ _id: { $in: productIds } })
    .populate('defaultImage')
    .populate('imageGallery')
    .select('-modelInfo -material -materialComposition -seoTitle -seoDescription -seoKeywords -ogTitle -ogDescription -ogImage -delete');
});

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  
  try {
    await connectDB();
    
    const byId = searchParams.get("id");
    const storeId = process.env.NEXT_STORE_ID;
    const slug = searchParams.get("slug");

    const filter = {};
    if (byId) filter._id = byId;
    if (storeId) filter.storeId = storeId;

    const [storeData, theme] = await Promise.all([
      storeId ? getStoreData(storeId) : {},
      getThemeData(filter)
    ]);

    if (!theme) {
      return NextResponse.json({ message: "Theme not found" }, { status: 404 });
    }

    const latestArrivalProductIds = theme.latestArrival?.selectedProducts || [];
    const bestSellingProductIds = theme.bestSelling?.selectedProducts || [];
    const trendingProductIds = theme.trending?.selectedProducts || [];
    const hotSellingProductIds = theme.hotSelling?.selectedProducts || [];

    
    

    const allProductIds = [...new Set([...latestArrivalProductIds, ...bestSellingProductIds, ...trendingProductIds, ...hotSellingProductIds])];

    if (allProductIds.length === 0) {
      // return NextResponse.json({ message: "No products found in the theme" }, { status: 404 });
    }

    const products = await getProducts(allProductIds);
    const responseData = {
      ...theme.toObject(),
      latestArrival: latestArrivalProductIds.length > 0 ? {
        ...theme.latestArrival,
        products: products.filter(product => latestArrivalProductIds.includes(product._id.toString()))
      } : theme.latestArrival,
      bestSelling: bestSellingProductIds.length > 0 ? {
        ...theme.bestSelling,
        products: products.filter(product => bestSellingProductIds.includes(product._id.toString()))
      } : theme.bestSelling,
      trending: trendingProductIds.length > 0 ? {
        ...theme.trending,
        products: products.filter(product => trendingProductIds.includes(product._id.toString()))
      } : theme.trending,
      hotSelling: hotSellingProductIds.length > 0 ? {
        ...theme.hotSelling,
        products: products.filter(product => hotSellingProductIds.includes(product._id.toString()))
      } : theme.hotSelling,
      storeData,
    };

    delete responseData.instagramFeed?.accessToken;

    return NextResponse.json({ message: "GET request success", data: responseData }, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process GET request', message: error.message }, { status: 500 });
  }
}
