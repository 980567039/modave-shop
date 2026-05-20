import { AdminContext } from '@/app/contexts/adminContexts'
import { Store, MapPinHouse} from 'lucide-react'
import moment from 'moment';
import React, { useContext } from 'react'

export default function BillingAddress({ data }) {
    const { store } = useContext(AdminContext);
    

    const getPickupLocation = store?.theme?.storeLocations?.locations?.find((d) => d.locationName === data?.pickUpLocation);

    const renderAddress = () => {
        if (!data.hasOwnProperty('fulfillmentType')) {
            return (
                <div className='mb-5'>
                    <span className='text-muted-foreground uppercase text-xs mb-2 block'>地址</span>
                    <address className='not-italic text-sm  mb-2'>
                        <div>{data?.billingAddress?.street && `${data?.billingAddress?.street}`}</div>
                        <div>{data?.billingAddress?.addressLine2}</div>
                        <div>{data?.billingAddress?.city}</div>
                        {data?.billingAddress?.country}
                    </address>
                    <p className='text-sm'>邮政编码: {data?.billingAddress?.zip}</p>
                </div>
            );
        } else if (data?.fulfillmentType === 'delivery') {
            return (
                <div className='mb-5'>
                    <span className='text-muted-foreground uppercase text-xs mb-2 block'>地址</span>
                    <address className='not-italic text-sm  mb-2'>
                        <div>{data?.billingAddress?.street && `${data?.billingAddress?.street}`}</div>
                        <div>{data?.billingAddress?.addressLine2}</div>
                        <div>{data?.billingAddress?.city}</div>
                        {data?.billingAddress?.country}
                    </address>
                    <p className='text-sm'>邮政编码: {data?.billingAddress?.zip}</p>
                </div>
            );
        } else {
            return (
                <div>
                    <div className='flex flex-col gap-3 mt-3 mb-2'>
                        <div className='flex items-center gap-2'>
                            <Store strokeWidth={1} /><h3 className='text-[16px] font-bold'>自提订单</h3>
                        </div>

                        <address className='not-italic text-sm  mb-2'>
                            <div>{getPickupLocation?.locationName}</div>
                            <div>{getPickupLocation?.address}</div>
                            <div>{getPickupLocation?.emailAddress}</div>
                        </address>

                        <p className="text-sm mb-3 flex items-center gap-1">{data?.pickupDate ? `自提日期: ${moment(data?.pickupDate).format('YYYY-MM-DD')}` : ''}</p>
                    </div>

                </div>
            )
        }
    }

    return (
        <div className='p-4 border-[1px] rounded-md flex-1'>
            <h3 className='text-xl font-bold mb-2'>账单详情</h3>

            {renderAddress()}


            {data?.billingAddress?.phone && <div className='mb-5'>
                <span className='text-muted-foreground uppercase text-xs mb-1 block'>联系方式</span>
                <p className='text-sm'>电话: {data?.billingAddress?.phone}</p>
            </div>}

            {data?.billingAddress?.email && <div className=''>
                <span className='text-muted-foreground uppercase text-xs mb-1 block'>电子邮箱</span>
                <a href={`mailTo:${data?.billingAddress?.email}`} className='text-sm text-blue-500 underline block'>{data?.billingAddress?.email}</a>
            </div>}
        </div>
    )
}
