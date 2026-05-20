import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { apiReq } from '@/lib/common';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { Label, Pie, PieChart } from 'recharts'

export default function ConfirmAndCancel({
    from, to
}) {
    const [orderData, setOrderData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // 为不同状态类别定义颜色
    const statusColors = {
        pending: "hsl(45, 93%, 47%)",          // 明亮的黄色
        confirmed: "hsl(142, 76%, 36%)",       // 绿色
        processing: "hsl(207, 90%, 54%)",      // 蓝色
        awaitingFulfillment: "hsl(271, 91%, 65%)", // 紫色
        awaitingShipment: "hsl(199, 89%, 48%)", // 浅蓝色
        shipped: "hsl(170, 97%, 15%)",         // 深青色
        outForDelivery: "hsl(150, 100%, 25%)", // 森林绿
        delivered: "hsl(134, 61%, 41%)",       // 酸橙绿
        completed: "hsl(143, 64%, 24%)",       // 深绿色
        onHold: "hsl(32, 95%, 44%)",          // 橙色
        cancelled: "hsl(0, 84%, 60%)",         // 红色
        failed: "hsl(354, 70%, 54%)",          // 深红色
        refunded: "hsl(45, 100%, 51%)",        // 金色
        awaitingPayment: "hsl(26, 100%, 50%)", // 深橙色
        confirmPayment: "hsl(160, 84%, 39%)",  // 翡翠绿
        paymentFailed: "hsl(350, 89%, 60%)",   // 亮红色
        paymentCancel: "hsl(1, 71%, 40%)"      // 深红棕色
    };

    // 为空状态创建占位数据
    const emptyChartData = [
        {
            status: 'noData',
            count: 1,
            fill: 'hsl(var(--muted-foreground))'
        }
    ];

    // 将API数据转换为图表格式，并处理空状态
    const chartData = React.useMemo(() => {
        if (!orderData) return emptyChartData;

        const transformedData = Object.entries(orderData).map(([status, count]) => ({
            status,
            count,
            fill: statusColors[status] || "hsl(var(--muted))"
        })).filter(item => item.count > 0);

        return transformedData.length > 0 ? transformedData : emptyChartData;
    }, [orderData]);

    // 图表配置保持不变
    const chartConfig = React.useMemo(() => {
        const config = {
            count: {
                label: "数量",
            },
            noData: {
                label: "无数据",
                color: "hsl(var(--muted-foreground))"
            }
        };

        Object.entries(statusColors).forEach(([status, color]) => {
            config[status] = {
                label: status.charAt(0).toUpperCase() + status.slice(1).replace(/([A-Z])/g, ' $1'),
                color: color
            };
        });

        return config;
    }, []);

    // 计算订单总数，并处理空状态
    const totalOrders = React.useMemo(() => {
        if (!chartData.length || chartData[0].status === 'noData') return 0;
        return chartData.reduce((acc, curr) => acc + curr.count, 0);
    }, [chartData]);

    const getData = async (f, t) => {
        setIsLoading(true);
        try {
            const res = await apiReq(
                `admin/analytics/confirm-cancel-order?from=${format(new Date(f), 'yyyy-MM-dd')}&to=${format(new Date(t), 'yyyy-MM-dd')}`,
                'GET'
            );
            const { data } = await res.json();
            setOrderData(data);
        } catch (error) {
            console.log(error);
            setOrderData(null);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getData(from, to);
    }, [from, to]);

    return (
        <div className='p-5 border-[1px] rounded-3xl space-y-3 w-full flex-1'>
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
            >
                <PieChart>
                    <ChartTooltip
                        content={({ payload }) => {
                            if (payload && payload.length) {
                                const data = payload[0].payload;
                                if (data.status === 'noData') {
                                    return (
                                        <div className="p-2 bg-background border rounded-lg shadow">
                                            <p className="font-medium">无订单</p>
                                            <p className="text-sm text-muted-foreground">
                                                此期间没有可用数据
                                            </p>
                                        </div>
                                    );
                                }
                                return (
                                    <div className="p-2 bg-background border rounded-lg shadow">
                                        <p className="font-medium">
                                            {data.status.charAt(0).toUpperCase() + data.status.slice(1).replace(/([A-Z])/g, ' $1')}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {data.count} 个订单 ({((data.count / totalOrders) * 100).toFixed(1)}%)
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Pie
                        data={chartData}
                        dataKey="count"
                        nameKey="status"
                        innerRadius={60}
                        strokeWidth={5}
                        paddingAngle={2}
                    >
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
                                                className="fill-foreground text-xl font-bold"
                                            >
                                                {isLoading ? '...' : totalOrders}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 24}
                                                className="fill-muted-foreground text-sm"
                                            >
                                                {totalOrders === 0 ? '无订单' : '订单总数'}
                                            </tspan>
                                        </text>
                                    );
                                }
                            }}
                        />
                    </Pie>
                </PieChart>
            </ChartContainer>

            <div className='text-center'>
                <h4 className='text-xl font-bold'>订单状态分布</h4>
                <p className='text-xs text-muted-foreground'>
                    {from === to ?
                        `${format(new Date(from), 'MMM dd, yyyy')} 的订单` :
                        `${format(new Date(from), 'MMM dd')} 至 ${format(new Date(to), 'MMM dd, yyyy')} 的订单`
                    }
                </p>
            </div>
        </div>
    );
}
