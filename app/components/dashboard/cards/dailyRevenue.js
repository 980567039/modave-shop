"use client";
import { CalendarRange, PiggyBank, ShoppingCart } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import CounterTexts from './counterTexts';

import dynamic from 'next/dynamic';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis } from 'recharts';

// const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });


export default function DailyRevenue() {
    const [isClient, setIsClient] = useState(false);

    const chartData = [
        { month: "January", desktop: 186 },
        { month: "February", desktop: 305 },
        { month: "March", desktop: 237 },
        { month: "April", desktop: 73 },
        { month: "May", desktop: 209 },
        { month: "June", desktop: 214 },
    ]

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
        },
    }


    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }


    return (
        <div>
            <CounterTexts
                icon={<PiggyBank />}
                count={486}
                status="down"
                parentage="1.05"
                tagline="Compared to Jan 2023"
            />
            <ChartContainer config={chartConfig}>
                <LineChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                        left: 12,
                        right: 12,
                    }}
                >
                    {/* <CartesianGrid vertical={false} /> */}
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Line
                        dataKey="desktop"
                        type="natural"
                        stroke="var(--color-desktop)"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ChartContainer>
        </div>
    )
}
