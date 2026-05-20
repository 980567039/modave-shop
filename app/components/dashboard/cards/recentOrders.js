"use client";

import { AdminContext } from '@/app/contexts/adminContexts';
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { apiReq, formatPrice } from '@/lib/common';
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner';

export default function RecentOrders() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(false);
    const { store } = useContext(AdminContext);

    const fetchLatestData = async () => {
        try {
            setIsLoading(true);

            let url = `admin/order?limit=4&page=1&status=all`;

            const res = await apiReq(url, 'GET');

            if (res && res.status === 200) {
                const { data } = await res.json();
                

                const reFormat = data?.orders?.map((order) => {
                    const totalAmount = order?.items.reduce((total, item) => {
                        return total + ((item.salesPrice || item.price) * item.quantity);
                    }, 0);

                    const checkIfPickup = order?.fulfillmentType === 'pickup' || false

                    return {
                        ...order,
                        amount: order?.paymentId?.amount,
                    }
                });

                setData(reFormat);
            } else {
                setData([]);
            }

            setIsLoading(false);

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!", {
                description: 'Something went wrong with fetching data, please try again later!',
            })
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchLatestData()
    }, []);

    return (
        <div>
            <Table>
                {/* <TableCaption className="pb-3 text-xs text-right pr-3">In here only listed latest 5 orders.</TableCaption> */}
                <TableHeader>
                    <TableRow>
                        <TableHead>订单ID</TableHead>
                        <TableHead>订单日期 </TableHead>
                        {/* <TableHead>QTY</TableHead> */}
                        <TableHead>客户</TableHead>
                        <TableHead className="text-right">价格</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? <>
                        <TableRow>
                            <TableCell colSpan={4}>
                                <Skeleton className="w-full h-16" />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4}>
                                <Skeleton className="w-full h-16" />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4}>
                                <Skeleton className="w-full h-16" />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4}>
                                <Skeleton className="w-full h-16" />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4}>
                                <Skeleton className="w-full h-16" />
                            </TableCell>
                        </TableRow>
                    </> : data && data.length > 0 && data.map((row, index) => (
                        <TableRow key={index} >
                            <TableCell>
                                <div className='flex gap-3 items-center'>
                                    <Link href={`/admin/orders/${row?._id}`} className='hover:underline'>{row?.customOrderId}</Link>
                                </div>
                            </TableCell>
                            <TableCell>{moment(row?.date).fromNow()}</TableCell>
                            {/* <TableCell>1</TableCell> */}
                            <TableCell>
                                <Button variant="link">{row?.billingAddress?.firstName} {row?.billingAddress?.lastName}</Button>
                            </TableCell>
                            <TableCell className="text-right">{formatPrice(row?.amount)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </div>
    )
}
