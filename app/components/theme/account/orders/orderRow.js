import React from 'react'
import Link from 'next/link'
import { MoveRight } from 'lucide-react'
import moment from 'moment'
import { formatPrice } from '@/lib/common'

export default function OrderRow({ order }) {

    if(!order){
        return null
    }

    const getOrderItems = () => {
        const { items } = order;
        const orderTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
        return (
            <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                Total Price: {formatPrice(orderTotal)}
            </div>
        )
    }

    return (
        <Link href={`/account/orders/${order?.customOrderId}`} className='flex gap-3 items-center justify-between border-[1px] p-3'>
            <div className='space-y-2'>
                <h5>Order ID: <span className='font-semibold'>#{order?.customOrderId}</span></h5>
                <h4 className='text-sm text-muted-foreground'>Date: {moment(order?.date).format('LLL')}</h4>
                {getOrderItems()}
            </div>
            <div>
                <div className='flex gap-2 items-center text-sm'>View Order<MoveRight className='w-5 h-5 text-muted-foreground' /></div>
            </div>
        </Link>
    )
}
