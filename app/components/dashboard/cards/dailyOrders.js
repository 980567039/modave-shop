"use client";
import { CalendarRange, ShoppingCart, TrendingDown, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import CounterTexts from './counterTexts';

import dynamic from 'next/dynamic';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { apiReq } from '@/lib/common';
import { Skeleton } from '@/components/ui/skeleton';

// const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });


export default function DailyOrders() {
    const [total, setTotal] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [weekComparison, setWeekComparison] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const weekMap = {
        Sun: '周日',
        Mon: '周一',
        Tue: '周二',
        Wed: '周三',
        Thu: '周四',
        Fri: '周五',
        Sat: '周六',
      };

    const chartConfig = {
        confirm: {
            label: "确认",
            color: "#22c55e",
        },
        cancel: {
            label: "取消",
            color: "#ff0000",
        },
    }

    const getStackedData = async () => {
        try {
            setIsLoading(true);
            const res = await apiReq('admin/dashboard/daily-orders', 'GET');
            const { data } = await res.json()

            if (res.ok) {
                setChartData(data?.chartData || []);
                setTotal(data?.thisWeekTotal);
                setWeekComparison({
                    thisWeekConfirm: data?.thisWeekConfirm,
                    thisWeekCancel: data?.thisWeekCancel
                });
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error);
            setIsLoading(false)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getStackedData()
    }, []);


    return (
        <div>
            {isLoading ? <>
                <div className='flex gap-2 px-3'>
                    <div className='flex gap-2 items-center'>
                        <Skeleton className="w-[40px] h-[40px] rounded-full" />
                    </div>
                    <div className='block flex-1'>
                        <div className='flex items-center justify-between'>

                            <Skeleton className="w-[120px] h-5 mb-3" />

                            <div className={`flex items-center gap-1`}>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center`}>
                                    <Skeleton className="w-[10px] h-[10px]" />
                                </div>
                                <Skeleton className="w-[20px] h-3" />

                            </div>
                        </div>
                        <Skeleton className="w-[100px] h-2" />
                    </div>
                </div>
                <Skeleton className="w-full h-[270px] mt-3 mb-3" />
                <Skeleton className="w-full h-[54px] mt-3" />
            </> : <>
                <CounterTexts
                    icon={<CalendarRange />}
                    count={total}
                    status="down"
                    parentage="1.05"
                    tagline="本周"
                    hideParsonage
                />
                <ChartContainer config={chartConfig} className="mt-3 mb-3">
                    <BarChart accessibilityLayer data={chartData}>
                        {/* <CartesianGrid vertical={false} /> */}
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => weekMap[value] || value}
                        />
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar
                            dataKey="confirm"
                            stackId="a"
                            fill="#22c55e"
                            radius={[0, 0, 4, 4]}
                        />
                        <Bar
                            dataKey="cancel"
                            stackId="a"
                            fill="#ff0000"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>

                <div className='flex justify-between items-center gap-3 px-5'>
                    <div className="text-xs font-medium leading-none">
                    本周确认订单
                        <div className='flex items-center gap-2 text-2xl'>
                            {weekComparison.thisWeekConfirm} <TrendingUp className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-xs font-medium leading-none">
                    本周取消订单
                        <div className='flex items-center gap-2 text-2xl'>
                            {weekComparison.thisWeekCancel} <TrendingDown className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </>}
        </div>
    )
}
