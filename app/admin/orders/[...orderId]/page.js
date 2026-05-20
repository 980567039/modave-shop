"use client";

import OrderView from '@/app/components/admin/orders/orderView';
import RestrictPage from '@/app/components/admin/restrictPage/restrictPage';
import AdminHeader from '@/app/components/adminHeader';
import { AdminContext } from '@/app/contexts/adminContexts';

import { BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { apiReq, transformS3UrlsInObject } from '@/lib/common';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'

export default function OrderDetails({ params }) {
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const { store, setStore } = useContext(AdminContext);

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

      setOrderData(transformS3UrlsInObject(resData?.data[0]));

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
    if (params?.orderId) {
      getOrderData(params?.orderId);
    } else {
      route.push('/admin/order')
    }
  }, [params?.orderId]);

  if (!store?.loginUserData?.capabilities?.includes('orders')) {
    return <RestrictPage />;
  } else{
    return orderData && Object.keys(orderData).length !== 0 ? (
      <div className='flex flex-col gap-5'>
        {isLoading ? <div className='flex items-center justify-center'>
          <LoaderCircle className="w-5 h-5 animate-spin" />
        </div> :
          <>
            <AdminHeader title={`Order Details #${orderData?.customOrderId}`}>
              
            </AdminHeader>
  
            <OrderView data={orderData} params={params} />
          </>
        }
      </div>
    ) : null
  }


}
