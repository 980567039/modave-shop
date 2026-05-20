import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ShieldOff } from 'lucide-react'
import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import BillingAddress from './billingAddress'
import OrderItems from './orderItems'
import PaymentDetails from './paymentDetails'
import OrderStatusChanger from './orderStatusChanger'
import OrderPaymentStatusChanger from './orderPaymentStatusChanger'
import CustomerInvoice from './customerInvoice'
import CustomerCard from '../customers/customerCard'
import ShippingAddress from './shippingAddress'
import { apiReq } from '@/lib/common'
import { useRouter } from 'next/navigation'
import { AdminContext } from '@/app/contexts/adminContexts'
import OrderNote from './orderNote'

export default function OrderView({
    data,
    params,
    isGetNew,
    orderId
}) {
    const route = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [orderNote, setOrderNote] = useState('');
    const [orderData, setOrderData] = useState(data || []);
    const { setStore } = useContext(AdminContext);

    const getOrderData = async (orderId) => {
        try {
            // get order data
            setIsLoading(true);
            const response = await apiReq(`admin/order?id=${orderId}`, 'GET');

            const resData = await response.json();

            if (!response.ok) {
                route.push('/admin/order')
                throw new Error(resData.message);
            }

            setOrderData(resData?.data[0]);

            setStore((prevState) => ({
                ...prevState,
                orderCount: resData?.data.orderCount,
            }));

            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (orderId && isGetNew) {
            getOrderData(orderId);
        }
    }, [isGetNew, orderId]);


    return (
        <div>
            {(orderData.status === "paymentCancel" || orderData.status === "paymentFailed") && <Alert variant="destructive" className="mb-5">
                <ShieldOff className="h-4 w-4" />
                <AlertTitle>支付取消或失败！</AlertTitle>
                <AlertDescription>此订单尚未支付。</AlertDescription>
            </Alert>}


            <div className='flex gap-5 flex-row'>
                <div className='basis-2/3'>
                    <div className='p-4 rounded-md bg-slate-100 text-muted-foreground text-xs border-[1px] flex flex-col gap-1 mb-5'>
                        <div className='flex gap-1'>
                            <span>订单号 - </span>
                            <span>{orderData?.customOrderId}</span>
                        </div>
                        <div className='flex gap-1'>
                            <span>密钥 - </span>
                            <span>{orderId || params?.orderId}</span>
                        </div>
                        <div className='flex gap-1'>
                            <span>日期 - </span>
                            <span>{moment(orderData?.date).format('YYYY-MM-DD')}</span>
                        </div>
                        <div className='flex gap-1'>
                            <span>时间 - </span>
                            <span>{moment(orderData?.date).format('hh:mm a')}</span>
                        </div>
                    </div>

                    <div className='flex flex-col gap-5'>
                        <div className='flex gap-3'>
                            <BillingAddress data={orderData || []} />
                            {orderData?.shippingAddress && <ShippingAddress data={orderData || []} />}
                        </div>

                        {/* Order item table */}
                        <OrderItems data={orderData?.items || []} fullOrder={orderData} />

                        {/* payment details */}
                        <PaymentDetails data={orderData?.payment || {}} order={orderData} />
                    </div>
                </div>
                <div className='basis-1/3'>
                    <div className='border-[1px] p-5 rounded-md mb-5'>
                        <h4 className='text-xl font-semibold mb-3'>订单状态</h4>
                        <p className='text-muted-foreground text-xs mb-3'>按照以下说明处理此订单的所有订单状态。一旦您更改状态，客户将通过电子邮件收到通知。</p>
                        <OrderStatusChanger data={orderData} />
                    </div>
                    <div className='border-[1px] p-5 rounded-md mb-5'>
                        <h4 className='text-xl font-semibold mb-3'>订单备注</h4>
                        <p className='text-muted-foreground text-xs mb-3'>为将来参考记录订单备注，或者如果有任何问题或其他订单相关事项，请做记录。</p>
                        <OrderNote orderData={orderData} orderNoteText={(d) => setOrderNote(d)}/>
                    </div>

                    {orderData?.payment?.type !== 'cod' && <div className='border-[1px] p-5 rounded-md mb-5'>
                        <h4 className='text-xl font-semibold mb-3'>支付状态</h4>
                        <p className='text-muted-foreground text-xs mb-3'>处理此订单的所有订单支付状态</p>
                        <OrderPaymentStatusChanger data={orderData} />
                    </div>}

                    {/* Download invoice */}
                    <CustomerInvoice data={orderData} orderNote={orderNote}/>

                    <div className='border-[1px] rounded-md mb-5'>
                        <CustomerCard data={orderData} />
                    </div>
                </div>
            </div>
        </div>
    )
}
