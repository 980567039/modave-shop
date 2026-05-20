"use client";

import { Button } from '@/components/ui/button';
import { apiReq } from '@/lib/common';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'

export default function PaymentDetails({ data, order }) {
  const [paymentData, setPaymentData] = useState({});
  const [kokoValidation, setKokoValidation] = useState({});
  const [stripeValidation, setStripeValidation] = useState({});
  const [paypalValidation, setPaypalValidation] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const formatPaymentName = (key) => {
    switch (key) {
      case "cod":
        return '货到付款'
      case "bankTransfer":
        return '银行转账'
      case "payhere":
        return "Payhere"
      case "stripe":
        return "Stripe"
      case "paypal":
        return "PayPal"
      default:
        return key
    }
  }

  const validateKokoPayment = async () => {
    try {
      setIsLoading(true);
      const response = await apiReq(`admin/order/payment/koko/check-order`, 'POST', order);

      const resData = await response.json();

      setKokoValidation(resData?.status?.content)

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }
  const validateStripePayment = async () => {
    try {
      setIsLoading(true);
      const response = await apiReq(`admin/order/payment/stripe/check-order`, 'POST', order);

      const resData = await response.json();

      setStripeValidation(resData?.status?.content)

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  const validatePaypalPayment = async () => {
    try {
      setIsLoading(true);
      const response = await apiReq(`admin/order/payment/paypal/check-order`, 'POST', order);

      const resData = await response.json();

      setPaypalValidation(resData?.status?.content)

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (order?.paymentId?.paymentData && Object.keys(order?.paymentId?.paymentData).length !== 0) {
      const data = order?.paymentId?.paymentData;
      delete data?.req_access_key;
      delete data?.signed_field_names;
      delete data?.utf8;
      delete data?.request_token;
      delete data?.items;
      delete data?.customer;
      delete data?.request;

      setPaymentData(data);
    }
  }, [order?.paymentId?.paymentData])

  return (
    <div>
      <h3 className='text-lg font-semibold mb-5'>支付详情</h3>
      <div className='mb-3'>
        <span className='block text-xs uppercase text-muted-foreground'>支付方式</span>
        <p className='text-sm uppercase'>{formatPaymentName(data?.type)}</p>
      </div>
      {order?.paymentId?.paymentMethod === "koko" && <Button onClick={validateKokoPayment} className="mb-2" disabled={isLoading}>{isLoading && <Loader2 className='w-8 h-8 animate-spin' />} 验证KOKO支付</Button>}
      {order?.paymentId?.paymentMethod === "stripe" && <Button onClick={validateStripePayment} className="mb-2" disabled={isLoading}>{isLoading && <Loader2 className='w-8 h-8 animate-spin' />} 验证Stripe支付</Button>} 
      {order?.paymentId?.paymentMethod === "paypal" && <Button onClick={validatePaypalPayment} className="mb-2" disabled={isLoading}>{isLoading && <Loader2 className='w-8 h-8 animate-spin' />} 验证PayPal支付</Button>}
     
      {kokoValidation && Object.keys(kokoValidation).length !== 0 &&
        <div className='bg-slate-50 p-3 mt-3 border-[1px] rounded-md max-w-[50%] mb-3'>
          <table border="1" className='text-sm border-collapse w-full '>
            <tbody>
              <tr>
                <td>状态</td>
                <td>{kokoValidation?.status}</td>
              </tr>
            </tbody>
          </table>
        </div>}

      {stripeValidation && Object.keys(stripeValidation).length !== 0 &&
        <div className='bg-slate-50 p-3 mt-3 border-[1px] rounded-md max-w-[50%] mb-3'>
          <table border="1" className='text-sm border-collapse w-full '>
            <tbody>
              <tr>
                <td>状态</td>
                <td>{stripeValidation?.status}</td>
              </tr>
            </tbody>
          </table>
        </div>}

      {paypalValidation && Object.keys(paypalValidation).length !== 0 &&
        <div className='bg-slate-50 p-3 mt-3 border-[1px] rounded-md max-w-[50%] mb-3'>
          <table border="1" className='text-sm border-collapse w-full '>
            <tbody>
              <tr>
                <td>状态</td>
                <td>{paypalValidation?.status}</td>
              </tr>
            </tbody>
          </table>
        </div>}

      {data?.type !== "cod" && <div className='space-y-3'>
        <div className='mb-3'>
          <span className='block text-xs uppercase text-muted-foreground'>支付 ID</span>
          <p className='text-sm'>{order?.paymentId?._id}</p>
        </div>
        <div className='mb-3'>
          <span className='block text-xs uppercase text-muted-foreground'>状态</span>
          <p className='text-sm'>{order?.paymentId?.status}</p>
        </div>

        {data?.type === "payhere" ? paymentData && Object.keys(paymentData).length !== 0 && (
          <div className='mb-3 text-sm'>
            <span className='block text-xs uppercase text-muted-foreground'>支付数据</span>
            <div className='bg-slate-50 p-3 mt-3 border-[1px] rounded-md space-y-2'>
              <div>
                <span className='font-medium'>订单号：</span> {paymentData.order_id}
              </div>
              <div>
                <span className='font-medium'>支付编号：</span> {paymentData.payment_id}
              </div>
              <div>
                <span className='font-medium'>日期：</span> {paymentData.date}
              </div>
              <div>
                <span className='font-medium'>状态：</span>
                <span className={`ml-1 px-2 py-1 text-xs rounded ${paymentData.status === 'RECEIVED' ? 'bg-green-100 text-green-800' :
                  paymentData.status === 'REFUNDED' ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                  {paymentData.status}
                </span>
              </div>
              <div>
                <span className='font-medium'>金额：</span> {paymentData.currency} {paymentData.amount}
              </div>

              {paymentData.amount_detail && (
                <div>
                  <span className='font-medium block mb-2'>金额详情：</span>
                  <div className='pl-4'>
                    <div><span className='text-sm text-gray-600'>总额：</span> {paymentData.amount_detail.currency} {paymentData.amount_detail.gross}</div>
                    <div><span className='text-sm text-gray-600'>手续费：</span> {paymentData.amount_detail.currency} {paymentData.amount_detail.fee}</div>
                    <div><span className='text-sm text-gray-600'>净额：</span> {paymentData.amount_detail.currency} {paymentData.amount_detail.net}</div>
                  </div>
                </div>
              )}

              {paymentData.payment_method && (
                <div>
                  <span className='font-medium block mb-2'>支付方式：</span>
                  <div className='pl-4'>
                    <div><span className='text-sm text-gray-600'>方式：</span> {paymentData.payment_method.method}</div>
                    <div><span className='text-sm text-gray-600'>持卡人：</span> {paymentData.payment_method.card_customer_name}</div>
                    <div><span className='text-sm text-gray-600'>卡号：</span> {paymentData.payment_method.card_no}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : data?.type === "stripe" && paymentData && Object.keys(paymentData).length !== 0 ? (
          <div className='mb-3 text-sm'>
            <span className='block text-xs uppercase text-muted-foreground'>支付数据</span>
            <div className='bg-slate-50 p-3 mt-3 border-[1px] rounded-md space-y-2'>
              <div>
                <span className='font-medium'>会话 ID：</span> {paymentData.sessionId || paymentData.id}
              </div>
              {paymentData.paymentIntent && (
                <div>
                  <span className='font-medium'>支付意图：</span> {paymentData.paymentIntent}
                </div>
              )}
              {paymentData.amountTotal && (
                <div>
                  <span className='font-medium'>金额：</span> ${(paymentData.amountTotal / 100).toFixed(2)}
                </div>
              )}
              {paymentData.customer && (
                <div>
                  <span className='font-medium'>客户：</span> {paymentData.customer}
                </div>
              )}
              {paymentData.payment_status && (
                <div>
                  <span className='font-medium'>状态：</span>
                  <span className={`ml-1 px-2 py-1 text-xs rounded ${paymentData.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                      paymentData.payment_status === 'refunded' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {paymentData.payment_status.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : data?.type === "paypal" && paymentData && Object.keys(paymentData).length !== 0 ? (
          <div className='mb-3 text-sm'>
            <span className='block text-xs uppercase text-muted-foreground'>支付数据</span>
            <div className='bg-slate-50 p-3 mt-3 border-[1px] rounded-md space-y-2'>
              <div>
                <span className='font-medium'>PayPal 订单号：</span> {paymentData.paypalOrderId || paymentData.id}
              </div>
              {paymentData.payerId && (
                <div>
                  <span className='font-medium'>付款人 ID：</span> {paymentData.payerId}
                </div>
              )}
              {paymentData.captureId && (
                <div>
                  <span className='font-medium'>捕获 ID：</span> {paymentData.captureId}
                </div>
              )}
              {paymentData.amount && (
                <div>
                  <span className='font-medium'>金额：</span> {paymentData.currency || 'USD'} {paymentData.amount}
                </div>
              )}
              {paymentData.status && (
                <div>
                  <span className='font-medium'>状态：</span>
                  <span className={`ml-1 px-2 py-1 text-xs rounded ${paymentData.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      paymentData.status === 'REFUNDED' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {paymentData.status}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : paymentData && Object.keys(paymentData).length !== 0 && <div className='mb-3'>
          <span className='block text-xs uppercase text-muted-foreground'>支付数据</span>
          <div className='bg-slate-50 p-3 mt-3 border-[1px] rounded-md'>
            <table border="1" className='text-sm border-collapse w-full'>
              <tbody>
                {Object.entries(paymentData).map(([key, value]) => (
                  <tr key={key}>
                    <td className="p-2 border">{key}</td>
                    <td className="p-2 border">
                      {typeof value === 'object' && value !== null
                        ? JSON.stringify(value)
                        : value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>}
      </div>}
    </div>
  )
}
