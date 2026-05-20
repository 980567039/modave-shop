import { ArchiveRestore, BaggageClaim, Earth, Mail, MapPin, MousePointer, Phone, Signpost } from 'lucide-react'
import React from 'react'

export default function CustomerCard({ data }) {
    const firstNameInitial = data?.billingAddress?.firstName ? data.billingAddress.firstName.charAt(0) : '';
    const lastNameInitial = data?.billingAddress?.lastName ? data.billingAddress.lastName.charAt(0) : '';


    return (
        <div>
            <div className='flex items-center justify-center relative pt-5 mb-3'>
                <div className='absolute left-0 top-0 w-full h-2/3 bg-slate-50 z-0' />
                <div className='w-[100px] h-[100px] rounded-full bg-slate-200 text-center flex items-center justify-center z-10 font-extrabold uppercase'>{firstNameInitial}{lastNameInitial}</div>
            </div>
            <div className='text-center mb-3'>
                <h4 className='text-center font-semibold text-md leading-3'>{data?.billingAddress?.firstName} {data?.billingAddress?.lastName}</h4>
                <a href={`mailto:${data?.billingAddress?.email}`} className='text-xs text-muted-foreground'>{data?.billingAddress?.email}</a>
            </div>

            <div className='px-3'>
                <div className='flex gap-2 items-start mb-3'>
                    <MapPin className='w-4 h-4 text-muted-foreground' />
                    <div>
                        <span className='text-xs text-muted-foreground uppercase block'>地址</span>
                        <div className='text-sm text-gray-600'>
                            {data?.fulfillmentType === "pickup" ? <div className='mt-3'>
                                <div className='text-xs text-muted-foreground flex items-center'><ArchiveRestore className='w-4 h-4 mr-1' />自提订单</div>
                                {data?.pickUpLocation || '自提订单'}
                            </div> : <>
                                <div>{data?.billingAddress?.street}</div>
                                <div>{data?.billingAddress?.addressLine2 ? data?.billingAddress?.addressLine2 + ',' : ''}</div>
                                {data?.billingAddress?.city}<br />
                            </>}

                        </div>
                    </div>
                </div>
                {data?.billingAddress?.country && <div className='flex gap-2 items-start mb-3'>
                    <Earth className='w-4 h-4 text-muted-foreground' />
                    <div>
                        <span className='text-xs text-muted-foreground uppercase block'>国家</span>
                        <div className='text-sm text-gray-600'>{data?.billingAddress?.country}</div>
                    </div>
                </div>}
                {!data?.fulfillmentType === "pickup" && <div className='flex gap-2 items-start mb-3'>
                    <Signpost className='w-4 h-4 text-muted-foreground' />
                    <div>
                        <span className='text-xs text-muted-foreground uppercase block'>邮政编码</span>
                        <div className='text-sm text-gray-600'>{data?.billingAddress?.zip}</div>
                    </div>
                </div>}
                <div className='flex gap-2 items-start mb-3'>
                    <Mail className='w-4 h-4 text-muted-foreground' />
                    <div>
                        <span className='text-xs text-muted-foreground uppercase block'>电子邮箱</span>
                        <div className='text-sm text-gray-600'>{data?.billingAddress?.email}</div>
                    </div>
                </div>
                {data?.billingAddress?.phone && <div className='flex gap-2 items-start mb-3'>
                    <Phone className='w-4 h-4 text-muted-foreground' />
                    <div>
                        <span className='text-xs text-muted-foreground uppercase block'>电话</span>
                        <div className='text-sm text-gray-600'>{data?.billingAddress?.phone}</div>
                    </div>
                </div>}
                {data?.ipAddress && <div className='flex gap-2 items-start mb-3'>
                    <MousePointer className='w-4 h-4 text-muted-foreground' />
                    <div>
                        <span className='text-xs text-muted-foreground uppercase block'>IP地址</span>
                        <div className='text-sm text-gray-600'>{data?.ipAddress}</div>
                    </div>
                </div>}
                {/* <div className='flex gap-2 items-start mb-3'>
                    <BaggageClaim className='w-4 h-4 text-muted-foreground' />
                    <div>
                        <span className='text-xs text-muted-foreground uppercase block'>总订单</span>
                        <div className='text-sm text-gray-600'>5 订单</div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}
