import React, { useEffect, useState } from 'react'
import { IconMoney } from '../../svgIcons'
import { apiReq } from '@/lib/common';
import moment from 'moment';
import NumberTicker from '@/components/magicui/number-ticker';

export default function TotalOrderValue({ from, to }) {
    const [orderValue, setOrderValue] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const getData = async (f, t) => {

        try {
            setIsLoading(true);
            const res = await apiReq(`admin/analytics/total-sales-value?from=${moment(f).format('YYYY-MM-DD')}&to=${moment(t).format('YYYY-MM-DD')}`, 'GET');

            const { data } = await res.json();
            if (!res.ok) {

            }

            setIsLoading(false);
            setOrderValue(data);

        } catch (error) {
            console.log(error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const checkFrom = from ? from : moment().format('YYYY-MM-DD');
        const checkTo = to ? to : moment().format('YYYY-MM-DD');
        getData(checkFrom, checkTo);
    }, [from, to]);


    return (
        <div className='p-5 border-[1px] rounded-3xl space-y-3 w-full flex-1 grid place-items-center'>
            <div className='text-center'>
                <IconMoney
                    style={{
                        width: '80px',
                        height: '80px',
                        margin: "0 auto 10px"
                    }}
                />
                <h3 className='text-[40px] font-bold'>
                    {orderValue && orderValue?.totalAmount === 0 ? <span className='text-muted-foreground'>LKR 0</span> : <NumberTicker value={orderValue?.totalAmount || 0} currency={'LKR'} removePriceFormat={false} />}
                </h3>
                <div className='space-y-3'>
                    <p className='text-xs text-muted-foreground'>订单总金额（不含运费）。</p>
                    <p className='text-xs text-muted-foreground'>
                        {from === to ?
                            `${moment(from).format('YYYY年MM月DD日')}的订单金额` :
                            `${moment(from).format('MM月DD日')}至${moment(to).format('YYYY年MM月DD日')}的订单金额`
                        }
                    </p>
                </div>
            </div>

        </div>
    )
}
