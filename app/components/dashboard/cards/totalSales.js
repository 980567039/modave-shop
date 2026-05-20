"use client";
import { BadgeDollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import CounterTexts from './counterTexts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { apiReq } from '@/lib/common';
import { Skeleton } from '@/components/ui/skeleton';

export default function TotalSales() {
    const [isClient, setIsClient] = useState(false);
    const [total, setTotal] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [weekComparison, setWeekComparison] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const weekMap = {
        Sunday: '周日',
        Monday: '周一',
        Tuesday: '周二',
        Wednesday: '周三',
        Thursday: '周四',
        Friday: '周五',
        Saturday: '周六',
      };

    const getStackedData = async () => {
        try {
            setIsLoading(true);
            const res = await apiReq('admin/dashboard/total-sales', 'GET');
            const { data } = await res.json()

            if (res.ok) {
                setChartData(data?.chartData || []);
                setTotal(data?.totalSales);
                setWeekComparison(data?.weekComparison);
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
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    const thisWeekColor = weekComparison.direction === 'down' ? "#ff0000" : "#22c55e";
    const lastWeekColor = weekComparison.direction === 'down' ? "#22c55e" : "#ff0000";

    const chartConfig = {
        lastWeek: {
            label: "上周",
            color: lastWeekColor,
        },
        thisWeek: {
            label: "本周",
            color: thisWeekColor,
        },
    }

    return (
        <div className='overflow-hidden'>
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
                    icon={<BadgeDollarSign />}
                    count={total}
                    status={weekComparison?.direction}
                    parentage={weekComparison?.percentageDiff}
                    tagline="销售总数"
                // taglinePosition="right"
                />
                <ChartContainer config={chartConfig} className="mt-2">
                    <BarChart accessibilityLayer data={chartData}>
                        {/* <CartesianGrid vertical={false} /> */}
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => weekMap[value] || value}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="lastWeek" fill={lastWeekColor} radius={4} />
                        <Bar dataKey="thisWeek" fill={thisWeekColor} radius={4} />
                    </BarChart>
                </ChartContainer>
                <div className='p-3 px-5 space-y-2'>
                    <div className="flex gap-2 text-xs font-medium leading-none">
                            {weekComparison.direction === "down"
                                ? `本周销售额下降了 -${parseFloat(weekComparison.percentageDiff)}%`
                                : `本周销售额上升了 +${parseFloat(weekComparison.percentageDiff)}%`
                            }
                            {weekComparison.direction === "down" ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}                  
                    </div>
                    <div className="leading-none text-muted-foreground text-xs">
                    此图显示过去7天的总销售额。
                    </div>
                </div>
            </>}
        </div>
    )
}