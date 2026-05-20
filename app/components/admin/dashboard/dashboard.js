"use client";

import React, { Suspense, useEffect } from 'react'
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


const TotalSales = dynamic(() => import('../components/dashboard/cards/totalSales'), {
    loading: () => <DashboardCardLoading />,
    ssr: false // Set this to true if you want server-side rendering
});

const OrdersValue = dynamic(() => import('../components/dashboard/cards/ordersValue'), {
    loading: () => <DashboardCardLoading />,
    ssr: false // Set this to true if you want server-side rendering
});

const DailyOrders = dynamic(() => import('../components/dashboard/cards/dailyOrders'), {
    loading: () => <DashboardCardLoading />,
    ssr: false // Set this to true if you want server-side rendering
});

export default function Admin() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const welcomeMessage = `
        很高兴您回来。探索功能，管理您的数据，充分利用您的体验。
        如果您需要任何帮助，请随时联系我们的支持团队。
        
        祝您工作愉快！
    `;


    if (status === "loading") {
        return <p>加载中...</p>;
    }

    return (
        <div className='space-y-5'>
            <div className='relative p-10 rounded-2xl shadow-md'>
                <BlurIn>
                    <div className="text-2xl font-bold">欢迎回来！</div>
                </BlurIn>
                <TypingAnimation text={welcomeMessage} className="text-sm" duration={10} />
                <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>
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
                    <CardWrapper title="Daily Revenue">
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
                    <CardWrapper title="Recent Customers">
                        <RecentCustomers />
                    </CardWrapper>
                </div> */}
                {/* <div className="w-8/12">
                    <CardWrapper title="Revenue By Category">
                        <RevenueByCategory />
                    </CardWrapper>
                </div> */}
                {/* <div className="w-6/12">
                    <CardWrapper title="Top Selling Product">
                        <TopSellingProduct />
                    </CardWrapper>
                </div> */}
            </div>

        </div>
    )
}
