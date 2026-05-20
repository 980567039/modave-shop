import NumberTicker from '@/components/magicui/number-ticker';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { apiReq, formatPrice, orderStatus } from '@/lib/common';
import moment from 'moment';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

export default function PaymentCategories({
    from, to
}) {

    const [data, setData] = useState(0);

    const orderStatusData = orderStatus();


    const getData = async (f, t) => {
        try {
            const res = await apiReq(`admin/analytics/payment-categories?from=${moment(f).format('YYYY-MM-DD')}&to=${moment(t).format('YYYY-MM-DD')}`, 'GET');

            const { paymentTotals } = await res.json();
            setData(paymentTotals);

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

    return data && data?.length > 0 ? (
        <div className='p-5 border-[1px] rounded-3xl space-y-3 w-full flex-1 flex gap-5 items-center'>

            {data && data?.length > 0 ? data?.map((d, i) => (
                <div className='flex-1 text-center py-10' key={i}>
                    <div className='mx-auto w-[100px] mb-5'>
                        {d?.type === 'cod' ? <div className='text-4xl font-bold'>COD</div> : <img src={`${d?.type === "koko" ? '/images/daraz-koko.png' : '/images/Visa-Logo-2006.png'}`} alt={d?.type} width={100} height={80} />}
                        

                        {/* daraz-koko.png */}
                    </div>
                    <h3 className='flex gap-1 items-center justify-center'>总<div className='uppercase'>{d?.type}</div>支付</h3>
                    <div className='text-4xl font-bold'>
                        {d?.totalAmount === 0 ? <span className='text-muted-foreground'>LKR 0</span> : <NumberTicker value={Number(d?.totalAmount) || 0} currency={'LKR'} removePriceFormat={false} />}
                    </div>
                </div>
            )) :
                <div>未找到任何支付记录！</div>
            }

        </div>
    ) : null
}
