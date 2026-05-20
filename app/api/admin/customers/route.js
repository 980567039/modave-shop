// 客户管理
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import User from "@/models/User";
import UserMeta from "@/models/UserMeta";
import Product from "@/models/product/Product";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Define individual handler functions for each HTTP method
async function handlePost(req, res) {

}

// put data
async function handlePut(req) {

};


async function handleGet(req, res) {
    // get all the attribute
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const session = await getServerSession(authOptions);

    const acceptRoles = ['admin', 'sales', 'manager', 'marketing', 'inventoryManager'];
    
    if (session && acceptRoles.some((d) => d === session?.user?.role)) {
        try {
            const byId = searchParams.get("id");
            const type = searchParams.get("type");

            const filter = {
                status: "active"
            }

            if (byId) {
                filter._id = byId
            }

            if (type !== 'all') {
                filter.role = type
            }

            const users = await User.find(filter).sort({ createdAt: 1 }).select('-password');

            if (byId) {
                const [user, userMeta] = await Promise.all([
                    User.findById(byId).select('-password').lean(),
                    UserMeta.aggregate([
                        { $match: { user: new mongoose.Types.ObjectId(byId) } },
                        {
                            $group: {
                                _id: '$_id',
                                user: { $first: '$user' },
                                uniqueID: { $first: '$uniqueID' },
                                billingAddress: { $first: '$billingAddress' },
                                shippingAddress: { $first: '$shippingAddress' },
                                interestProducts: { $first: '$interestProducts' },
                                interestCategories: { $first: '$interestCategories' },
                                interestMaterials: { $first: '$interestMaterials' },
                                interestAttributes: { $first: '$interestAttributes' },
                                parches: { $first: '$parches' },
                                wishlist: { $first: '$wishlist' },
                                reviews: { $first: '$reviews' }
                            }
                        },
                        {
                            $lookup: {
                                from: 'products',
                                localField: 'interestProducts',
                                foreignField: '_id',
                                pipeline: [
                                    {
                                        $project: {
                                            attributes: 0,
                                            seoTitle: 0,
                                            seoDescription: 0,
                                            seoKeywords: 0,
                                            ogTitle: 0,
                                            ogDescription: 0,
                                            category: 0,
                                            imageGallery: 0,
                                            description: 0
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: 'medialibraries',
                                            localField: 'defaultImage',
                                            foreignField: '_id',
                                            pipeline: [
                                                {
                                                    $project: {
                                                        url: 1,
                                                    }
                                                }
                                            ],
                                            as: 'defaultImage'
                                        }
                                    },
                                    {
                                        $unwind: {
                                            path: '$defaultImage',
                                            preserveNullAndEmptyArrays: true
                                        }
                                    }
                                ],
                                as: 'interestProducts'
                            }
                        },
                        {
                            $lookup: {
                                from: 'orders',
                                localField: 'parches',
                                foreignField: '_id',
                                pipeline: [
                                    {
                                        $project: {
                                            // items: 0,
                                            ipAddress: 0,
                                            ipAddressData: 0,
                                            billingAddress: 0,
                                            payment: 0,
                                            user: 0
                                        }
                                    }
                                ],
                                as: 'parches'
                            }
                        }
                    ])
                ]);

                return NextResponse.json({
                    message: "GET request success", data: {
                        user: user,
                        userMeta: userMeta[0]
                    }
                }, { status: 200 });
            }

            // remove password from users;
            if (users) {
                // Add your GET logic here
                return NextResponse.json({ message: "GET request success", data: users }, { status: 200 });
            } else {
                return NextResponse.json({ message: "Did not find user" }, { status: 500 });
            }

        } catch (error) {
            return NextResponse.json({ error: 'Failed to process GET request', message: error.message }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: "access denied" }, { status: 500 });
    }
};



export { handlePut as PUT, handleGet as GET, handlePost as POST };