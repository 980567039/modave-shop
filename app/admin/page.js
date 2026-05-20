// import { headers } from "next/headers";

// async function getDashboard(page = 1, params = '') {
//     try {
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/total-sales`;
//         if (params) {
//             url += `&${params}`;
//         }

//         const res = await fetch(url, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'origin': process.env.NEXTAUTH_URL,
//                 'host': process.env.NEXTAUTH_URL,
//             },
//             next: {
//                 revalidate: 60 // revalidate every 60 seconds
//             }
//         });

//         if (!res.ok) {
//             throw new Error('Failed to fetch shop data');
//         }

//         const { data } = await res.json();

//         console.log("data ===", data);

//         return data;
//     } catch (error) {
//         console.error('Error fetching shop data:', error);
//         return null;
//     }
// }

// export default async function MainShopPage({ searchParams }) {
//     const getHost = () => {
//         const headersList = headers();
//         return headersList.get('host');
//     };

//     // Convert searchParams to query string
//     const queryString = new URLSearchParams(searchParams).toString();

//     // Fetch initial data
//     const initialData = await getDashboard(1, queryString);
//     const host = getHost();

//     return (
//         <div>Test</div>
//     );
// }


"use client";

import React, { Suspense, useContext, useEffect } from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminHeader from '../components/adminHeader';
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import CardWrapper from '../components/dashboard/cards/cardWrapper';

import DailyRevenue from '../components/dashboard/cards/dailyRevenue';
import RecentOrders from '../components/dashboard/cards/recentOrders';
import SalesOverview from '../components/dashboard/cards/salesOverview';
import RecentCustomers from '../components/dashboard/cards/recentCustomers';
import RevenueByCategory from '../components/dashboard/cards/revenueByCategory';
import TopSellingProduct from '../components/dashboard/cards/topSellingProduct';
import BlurIn from '../components/theme/text/blurInText';
import TypingAnimation from '../components/theme/text/typingAnimation';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardCardLoading from '../components/common/dashboardCardLoading';
import { AdminContext } from '../contexts/adminContexts';
import RestrictPage from '../components/admin/restrictPage/restrictPage';
import { Button } from '@/components/ui/button';
import { apiReq } from '@/lib/common';
import WelcomeCard from '../components/admin/dashboard/welcomeCard';


const TotalSales = dynamic(() => import('../components/dashboard/cards/totalSales'), {
    loading: () => <DashboardCardLoading />,
    ssr: false // 如果你想要服务器端渲染，请将此设置为 true
});

const OrdersValue = dynamic(() => import('../components/dashboard/cards/ordersValue'), {
    loading: () => <DashboardCardLoading />,
    ssr: false // 如果你想要服务器端渲染，请将此设置为 true
});

const DailyOrders = dynamic(() => import('../components/dashboard/cards/dailyOrders'), {
    loading: () => <DashboardCardLoading />,
    ssr: false // 如果你想要服务器端渲染，请将此设置为 true
});

export default function Admin() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { store, isLoading } = useContext(AdminContext);


    if (status === "loading") {
        return <p>加载中...</p>;
    }

    // if (!isLoading && !store?.loginUserData?.capabilities?.includes('dashboard')) {
    //     return <RestrictPage />;
    // }


    return (
        <div className='space-y-5'>
            <WelcomeCard />
            
            <div className="grid grid-cols-3 gap-5">
                <div>
                    <CardWrapper title="总销售额">
                        <Suspense fallback={<DashboardCardLoading />}>
                            <TotalSales />
                        </Suspense>
                    </CardWrapper>
                </div>
                <div>
                    <CardWrapper title="订单价值">
                        <Suspense fallback={<DashboardCardLoading />}>
                            <OrdersValue />
                        </Suspense>
                    </CardWrapper>
                </div>
                <div>
                    <CardWrapper title="每日订单">
                        <Suspense fallback={<DashboardCardLoading />}>
                            <DailyOrders />
                        </Suspense>
                    </CardWrapper>
                </div>
                {/* <div>
                    <CardWrapper title="每日收入">
                        <DailyRevenue />
                    </CardWrapper>
                </div> */}
            </div>

            <div className="flex gap-5">
                <div className="w-3/4">
                    <CardWrapper title="最近订单">
                        <RecentOrders />
                    </CardWrapper>
                </div>
                <div className="w-2/4 ">
                    <CardWrapper tagline="这是全年销售概览" title="销售概览">
                        <SalesOverview />
                    </CardWrapper>
                </div>
            </div>

            <div className="flex gap-5">
                {/* <div className="w-4/12">
                    <CardWrapper title="最近客户">
                        <RecentCustomers />
                    </CardWrapper>
                </div> */}
                {/* <div className="w-8/12">
                    <CardWrapper title="按类别的收入">
                        <RevenueByCategory />
                    </CardWrapper>
                </div> */}
                {/* <div className="w-6/12">
                    <CardWrapper title="畅销产品">
                        <TopSellingProduct />
                    </CardWrapper>
                </div> */}
            </div>

        </div>
    )
}
