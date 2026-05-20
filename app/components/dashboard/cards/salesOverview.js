"use client"
import React, { useContext, useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';
import { AdminContext } from '@/app/contexts/adminContexts';
import { apiReq } from '@/lib/common';

// const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function SalesOverview() {
    const [isClient, setIsClient] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(false);
    const { store } = useContext(AdminContext);
    const Year  = {
        January : "1月",
        February : "2月",
        March : "3月",
        April : "4月",
        May : "5月",
        June : "6月",
        July : "7月",
        August : "8月",
        September : "9月",
        October : "10月",
        November : "11月",
        December : "12月"
    };

    const fetchLatestData = async () => {
        try {
            setIsLoading(true);

            let url = `admin/dashboard/sales-overview`;

            const res = await apiReq(url, 'GET');

            if (res && res.status === 200) {
                const { data } = await res.json();

                setData(data);
            } else {
                setData([]);
            }

            setIsLoading(false);

        } catch (error) {
            // console.log(error);
            toast.error("Something went wrong!", {
                description: 'Something went wrong with fetching data, please try again later!',
            })
            setIsLoading(false);
        }
    }

    const chartConfig = {
        value: {
            label: "订单总数",
            color: "hsl(var(--chart-1))",
        },
        label: {
            color: "hsl(var(--background))",
        },
    }

    useEffect(() => {
        setIsClient(true);
        fetchLatestData()
    }, []);

    if (!isClient) {
        return null;
    }
    return (
        <div className='p-3 h-full'>
            <ChartContainer config={chartConfig}>
                <BarChart accessibilityLayer data={data}>
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#000000" />
                            <stop offset="100%" stopColor="#686868" />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => Year[value] || value}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="value" fill="url(#barGradient)" radius={[40, 40, 0, 0]} />
                </BarChart>
            </ChartContainer>
        </div>
    )
}
