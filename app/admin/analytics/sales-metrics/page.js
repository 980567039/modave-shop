"use client";

import AdminHeader from '@/app/components/adminHeader'
import { BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { ref, child, push, get, set, onValue } from 'firebase/database';

import analytics from '@/lib/analytics';

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { database } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { sendNotification } from '@/lib/services/notifications';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

export default function SalesMetricsPage() {
    const [salesMetrics, setSalesMetrics] = useState([]);

    useEffect(() => {
        if (!database) {
            return undefined;
        }

        // Listen to data changes
        const dbRef = ref(database);
        const salesRef = child(dbRef, 'salesMetrics');

        onValue(salesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const metricsArray = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
                setSalesMetrics(metricsArray);
            }
        });
    }, []);

    const handlerAddData = () => {
        if (!database) {
            toast.error("Firebase is not configured");
            return;
        }

        const dbRef = ref(database);
        const newMetricRef = push(child(dbRef, 'salesMetrics'));
        const newMetric = {
            date: new Date().toISOString(),
            amount: Math.floor(Math.random() * 1000) + 100, // Random amount between 100 and 1099
            product: "示例产品"
        };

        set(newMetricRef, newMetric)
            .then(() => {
                console.log("新销售指标添加成功");
            })
            .catch((error) => {
                console.error("添加新销售指标时出错: ", error);
            });
    };

    // const sendNotificationMessage = async () => {
    //     await sendNotification({
    //         title: '新消息',
    //         body: '您收到了一条新消息！',
    //         icon: '/images/daraz-koko.png',
    //         data: {
    //             url: '/messages/123',
    //         },
    //     });
    // }

    const chartData = [
        { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
      ]

    const chartConfig = {
        visitors: {
          label: "访问者",
        },
        safari: {
          label: "Safari",
          color: "hsl(var(--chart-2))",
        },
      }

    return (
        <div className='space-y-5'>
            <AdminHeader
                title="销售指标"
                buttons={
                    <>
                        {/* <AddNewAttribute onSavedData={handlerNewRecord} edit={editAttributeObject} onCloseSheet={() => setEditAttributeObject({})} /> */}
                    </>
                }
            >
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Link href="/admin">控制面板</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Link href="/admin/analytics">分析</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>销售指标</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </AdminHeader>

            <div className='flex items-center justify-between'>
                <h3>按日期筛选</h3>
                <div>日期</div>
            </div>

            <div>
                <Card className="p-5 flex items-center gap-5">
                    <div>
                        <h3 className='font-semibold text-muted-foreground uppercase'>总销售额</h3>

                        <ChartContainer
                            config={chartConfig}
                            className="mx-auto aspect-square max-h-[250px]"
                        >
                            <RadialBarChart
                                data={chartData}
                                startAngle={0}
                                endAngle={250}
                                innerRadius={80}
                                outerRadius={110}
                            >
                                <PolarGrid
                                    gridType="circle"
                                    radialLines={false}
                                    stroke="none"
                                    className="first:fill-muted last:fill-background"
                                    polarRadius={[86, 74]}
                                />
                                <RadialBar dataKey="visitors" background cornerRadius={10} />
                                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                                    <Label
                                        content={({ viewBox }) => {
                                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                return (
                                                    <text
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                    >
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={viewBox.cy}
                                                            className="fill-foreground text-4xl font-bold"
                                                        >
                                                            {chartData[0].visitors.toLocaleString()}
                                                        </tspan>
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={(viewBox.cy || 0) + 24}
                                                            className="fill-muted-foreground"
                                                        >
                                                            访问者
                                                        </tspan>
                                                    </text>
                                                )
                                            }
                                        }}
                                    />
                                </PolarRadiusAxis>
                            </RadialBarChart>
                        </ChartContainer>
                    </div>
                </Card>
            </div>

            {/* <Button onClick={() => {
                toast.error("获取订单时出错", {
                    description: '出现了问题！'
                },
                    
                );
            }}>
                添加提示
            </Button> */}
            {/* <button onClick={sendNotificationMessage} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                添加新销售指标
            </button> */}

            <div>
                {/* <h2 className="text-xl font-bold mb-2">销售指标：</h2> */}
                {/* <ul>
                    {salesMetrics.map((metric) => (
                        <li key={metric.id} className="mb-2">
                            日期: {new Date(metric.date).toLocaleDateString()} - 
                            金额: ${metric.amount} - 
                            产品: {metric.product}
                        </li>
                    ))}
                </ul> */}
            </div>
        </div>
    )
}
