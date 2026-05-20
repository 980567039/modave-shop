"use client"

import { useEffect, useState } from "react"
import { apiReq, orderPaymentStatus, orderStatus } from "@/lib/common"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import moment from "moment"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

export default function OrderPaymentStatusChanger({ data }) {
    const [selectedStatus, setSelectedStatus] = useState(data?.paymentStatus || '');
    const [changedStatus, setChangedStatus] = useState(data?.paymentStatus || '');
    // const [openConfirmAlert, setOpenConfirmAlert] = useState(false);
    const [orderStatusRecords, setOrderStatusRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [orderData, setOrderData] = useState(data);
    const orderStatusMap = {
        'Pending': '待处理',
        'Confirmed': '已确认',
        'Processing': '处理中',
        'Awaiting Fulfillment': '等待履行',
        'Awaiting Shipment': '等待发货',
        'Shipped': '已发货',
        'Out for Delivery': '派送中',
        'Delivered': '已送达',
        'Completed': '已完成',
        'On Hold': '挂起',
        'Cancelled': '已取消',
        'Failed': '失败',
        'Refunded': '已退款',
        'Awaiting Payment': '等待付款',
        'Confirm Payment': '确认付款',
        'Payment Confirm': '付款确认',
        'Payment Failed': '付款失败',
        'Payment Cancel': '付款已取消',
      };

    const paymentStatus = orderPaymentStatus();

    const session = useSession();
    

    const handlerChange = (e) => {
        // setOpenConfirmAlert(true);
        setSelectedStatus(e);
        handlerConfirm(e)
    }

    const handlerAlertClose = () => {
        // setOpenConfirmAlert(false);
        handlerConfirm()
    }

    const statusColorChanger = (status) => {
        switch (status) {
            case "Confirmed":
                return "bg-green-600";
            case "Payment Failed":
                return "bg-red-600";
            case "Payment Cancel":
                return "bg-red-600";
            case "Cancelled":
                return "bg-red-600";

            default:
                return '';
        }
    }

    const MessageWithBadges = ({ message, currentStatus, previousStatus }) => {
        const parseMessage = () => {
            const parts = message.split(/(\{\{CURRENT_STATUS\}\}|\{\{PREV_STATUS\}\})/g);

            return parts.map((part, index) => {
                if (part === '{{CURRENT_STATUS}}') {
                    return <Badge key={index} className={`${statusColorChanger(currentStatus)}`}>{currentStatus}</Badge>;
                }
                if (part === '{{PREV_STATUS}}') {
                    return <Badge variant="outline" key={index}>{previousStatus}</Badge>;
                }
                return part;
            });
        };

        return <>{parseMessage()}</>;
    };

    // create a DB call
    const handlerConfirm = async (status) => {
        try {
            setIsLoading(true);

            const payload = {
                orderId: orderData?._id,
                status,
                statusDate: moment(),
                previousStatus: data?.paymentStatus,
                paymentDate: moment().format('YYYY-MM-DDTHH:mm'),
                customMessage: `${session?.data?.user?.role}(${session?.data?.user?.email}) 将订单状态从 {{PREV_STATUS}} 更改为 {{CURRENT_STATUS}}`,
                changeBy: session?.data?.user?.role || 'admin',
            }


            const res = await apiReq(`admin/order/payment-status`, 'POST', payload);

            if (!res.ok) {
                throw new Error(res.message);
            }


            setIsLoading(false);
            setOrderData((prevState) => ({
                ...prevState,
                status: selectedStatus
            }))

            setOrderStatusRecords((prevState) => (
                [payload, ...prevState]
            ))

            toast.success("更新成功", {
                description: `订单支付状态已从 ${paymentStatus?.find((d) => d.value === orderData?.status)?.label} 更改为 ${paymentStatus?.find((d) => d.value === selectedStatus)?.label}，客户已收到通知。`
            });

            setChangedStatus(selectedStatus)

        } catch (error) {
            toast.error("出现错误。", {
                description: "请稍后再试"
            })
            console.log(error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }


    }

    const getOrderStatusRecord = async (orderId) => {
        // fetch data from DB
        try {
            setIsLoading(true)
            const response = await apiReq(`admin/order/payment-status?id=${orderId}&type=payment`, 'GET');

            const resData = await response.json();
           

            if (!response.ok) {
                route.push('/admin/order')
                throw new Error(resData.message);
            }

            setOrderStatusRecords(resData?.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error);
            setIsLoading(false)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setOrderData(data)
        if (data?.status) {
            getOrderStatusRecord(data?._id)
        }
    }, [data])

    return (
        <div className="w-full flex flex-col gap-3">
           
            <Select onValueChange={handlerChange} value={changedStatus}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="订单支付状态" value={changedStatus} />
                </SelectTrigger>
                <SelectContent>
                    {paymentStatus && paymentStatus.map((status, index) => (
                        <SelectItem key={index} value={status.value} className={status.value === "cancelled" && status.value === "failed" ? 'text-red-500' : ''}><div>{status.label+' - '+orderStatusMap[status.label]}</div></SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {isLoading && <div className="flex flex-col gap-2">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-7/12 h-4" />
            </div>}

            {orderStatusRecords && orderStatusRecords.length > 0 && <div className="">
                {orderStatusRecords?.map((record, i) => {
                    return (
                        <div key={i} className="flex gap-2 pt-3 relative">
                            <div className="flex-1 absolute left-[5px] top-0 h-full w-[1px] bg-slate-300 z-0" />
                            <div className="w-[10px] h-[10px] bg-slate-300 rounded-full relative z-10 mt-1" />
                            <div className="flex flex-col text-muted-foreground text-sm">
                                <div className="capitalize mb-3">
                                    <MessageWithBadges
                                        message={record?.customMessage || ''}
                                        currentStatus={paymentStatus?.find((d) => d.value === record?.status)?.label}
                                        previousStatus={paymentStatus?.find((d) => d.value === record?.previousStatus)?.label}
                                    />
                                </div>
                                <span className="block text-xs">时间 {moment(record?.statusDate).format("YYYY-MM-DDThh:mm a").replace('T', ' 于 ')}</span>
                            </div>
                        </div>
                    )
                })}
            </div>}

        </div>
    )
}
