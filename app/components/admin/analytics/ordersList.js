import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { apiReq, formatPrice, orderStatus } from '@/lib/common';
import moment from 'moment';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

export default function OrdersList({
    from, to
}) {

    const [data, setData] = useState(0);
    const [pagination, setPagination] = useState({});

    const orderStatusData = orderStatus();


    const getData = async (f, t) => {
        try {
            const res = await apiReq(`admin/analytics/latest-orders?from=${moment(f).format('YYYY-MM-DD')}&to=${moment(t).format('YYYY-MM-DD')}`, 'GET');

            const { data, pagination } = await res.json();
            setData(data);
            setPagination(pagination)

        } catch (error) {
            console.log(error);

        }
    }

    const getOrderStatusLabel = (status) => {
        if (status && orderStatusData && orderStatusData?.length > 0) {
            const d = orderStatusData?.find((s) => s.value === status);

            return d?.label;

        }

        return ""
    }

    useEffect(() => {

        const checkFrom = from ? from : moment().format('YYYY-MM-DD');
        const checkTo = to ? to : moment().format('YYYY-MM-DD');
        getData(checkFrom, checkTo);
    }, [from, to]);
    


    return (
        <div className='p-5 border-[1px] rounded-3xl space-y-3 w-full flex-1'>
            <div>
                <h4 className='text-xl font-bold'>订单</h4>
                <p className='text-xs text-muted-foreground'>显示所选日期内的所有订单，以及不含运费的总金额。</p>
            </div>



            {data && data?.length > 0 ? <div className='flex flex-col gap-2'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px] text-xs">订单ID</TableHead>
                            <TableHead className="text-xs">状态</TableHead>
                            <TableHead className="text-xs">支付方式</TableHead>
                            <TableHead className="text-right">金额</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((d, i) => (
                            <TableRow key={i}>
                                <TableCell className="font-medium">{d.customOrderId}</TableCell>
                                <TableCell>{getOrderStatusLabel(d.status)}</TableCell>
                                <TableCell className="uppercase">{d.paymentId?.paymentMethod}</TableCell>
                                <TableCell className="text-right">{formatPrice(d.paymentId?.amount || 0)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>

                {pagination?.hasMore && <div className='text-xs italic text-muted-foreground'>还有 {pagination?.remaining} 行可用</div>}
            </div>
                : <>
                    <div className='flex flex-col items-center justify-start py-10'>
                        <img src="/images/no-products.svg" alt='无订单' width={150} height={150} />
                        未找到订单
                    </div>
                </>}
        </div>
    )
}
