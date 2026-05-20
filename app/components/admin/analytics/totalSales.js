"use client";


import NumberTicker from '@/components/magicui/number-ticker';
import { Badge } from '@/components/ui/badge';
import { apiReq } from '@/lib/common';
import moment from 'moment';
import React, { useEffect, useState } from 'react';


export default function TotalSales({ from, to }) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timezone;
    const [data, setData] = useState(0);   


    const getData = async (f, t) => {
        try {
            const res = await apiReq(`admin/analytics/total-sales?from=${moment(f).format('YYYY-MM-DD')}&to=${moment(t).format('YYYY-MM-DD')}`, 'GET');

            const { data } = await res.json();
            setData(data);

        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {

        const checkFrom = from ? from : moment().format('YYYY-MM-DD');
        const checkTo = to ? to : moment().format('YYYY-MM-DD');
        getData(checkFrom, checkTo);
    }, [from, to]);


    return (
        <div className='p-5 border-[1px] rounded-3xl space-y-3 flex-1 text-center grid place-items-center'>
            <div className='space-y-5'>
                <div className='w-[150px] h-[150px] mx-auto border-[5px] rounded-full border-black flex items-center justify-center flex-col'>
                    <div className='font-bold text-2xl'>
                        {data === 0 ? <span className='text-muted-foreground'>0</span> : <NumberTicker value={data} currency={null} removePriceFormat={true} />}
                    </div>
                    <h4 className='text-xs text-muted-foreground'>已完成销售</h4>
                </div>

                
                <div className='text-xs text-muted-foreground flex flex-col gap-2'>
                此订单数量反映了在所选日期范围内下的订单总数，按指定的状态条件筛选。
                    <div className='flex flex-wrap items-center space-x-2 text-xs justify-center'>
                        <div className='italic'><sup>*</sup>确认付款</div>
                        <div className='italic'><sup>*</sup>已确认</div>
                        <div className='italic'><sup>*</sup>处理中</div>
                        <div className='italic'><sup>*</sup>已发货</div>
                        <div className='italic'><sup>*</sup>派送中</div>
                        <div className='italic'><sup>*</sup>已送达</div>
                        <div className='italic'><sup>*</sup>已完成</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
