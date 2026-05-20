import { MapPin } from 'lucide-react'
import React from 'react'

export default function ShippingAddress({ data }) {
    return (
        <div className='p-4 border-[1px] rounded-md flex-1'>
            <h3 className='text-xl font-bold mb-2'>配送地址</h3>

            <div className='mb-5'>
                <span className='text-muted-foreground uppercase text-xs mb-2 block'>地址</span>
                <address className='not-italic text-sm  mb-2'>
                    <div>{data?.shippingAddress?.street && `${data?.shippingAddress?.street}`}</div>
                    <div>{data?.shippingAddress?.addressLine2}</div>
                    <div>{data?.shippingAddress?.city}</div>
                    {data?.shippingAddress?.country}
                </address>
                <p className='text-sm'>邮政编码: {data?.shippingAddress?.zip}</p>
            </div>

            {data?.shippingAddress?.phone && <div className='mb-5'>
                <span className='text-muted-foreground uppercase text-xs mb-1 block'>联系方式</span>
                <p className='text-sm'>电话: {data?.shippingAddress?.phone}</p>
            </div>}

            {data?.shippingAddress?.email && <div className=''>
                <span className='text-muted-foreground uppercase text-xs mb-1 block'>电子邮箱</span>
                <a href={`mailTo:${data?.shippingAddress?.email}`} className='text-sm text-blue-500 underline block'>{data?.shippingAddress?.email}</a>
            </div>}
        </div>
    )
}
