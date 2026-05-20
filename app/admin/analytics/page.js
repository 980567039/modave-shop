"use client";

import React, { useState } from 'react'
import { DatePickerWithRange } from '@/app/components/common/datePickerWithRange'
import TotalSales from '@/app/components/admin/analytics/totalSales';
import ConfirmAndCancel from '@/app/components/admin/analytics/confirmAndCancel';
import TotalOrderValue from '@/app/components/admin/analytics/totalOrderValue';
import OrdersList from '@/app/components/admin/analytics/ordersList';
import BestSellingProducts from '@/app/components/admin/analytics/bestSellingProducts';
import moment from 'moment';
import PaymentCategories from '@/app/components/admin/analytics/paymentCategories';

export default function Analytics() {
  const [dateFrom, setDateFrom] = useState(moment().format('YYYY-MM-DD'));
  const [dateTo, setDateTo] = useState(moment().format('YYYY-MM-DD'));

  const handlerChangeDate = (d) => {
    if (d && Object.keys(d).length !== 0) {
      const from = d.from || moment().format('YYYY-MM-DD');
      const to = d.to || moment(d.from || new Date()).format('YYYY-MM-DD');

      setDateFrom(from);
      setDateTo(to);

    }

  }
  return (
    <div className='space-y-7'>
      <div>
        <h1 className='text-xl font-semibold'>分析</h1>
        <p className='text-xs text-muted-foreground'>获取完整分析</p>
      </div>

      <div className=''>
        <div>
          <p className='text-xs mb-2'>按日期范围筛选</p>
          <DatePickerWithRange
            onDateChange={handlerChangeDate}
            onClearDates={() => {
              setDateFrom(moment().format('YYYY-MM-DD'));
              setDateTo(moment(1, 'days').format('YYYY-MM-DD'));
            }}
            disableFutureDates={true}
            />
        </div>
      </div>

      <div className='flex gap-8'>
        <TotalSales from={dateFrom} to={dateTo} />
        <ConfirmAndCancel from={dateFrom} to={dateTo} />
        <TotalOrderValue from={dateFrom} to={dateTo}/>
      </div>
      <div className='flex gap-8'>
        <div className='w-4/12'>
          <OrdersList from={dateFrom} to={dateTo}/>
        </div>
        <div className='w-8/12'>
          <BestSellingProducts from={dateFrom} to={dateTo}/>
        </div>
      </div>

      <div>
        <PaymentCategories from={dateFrom} to={dateTo} />
      </div>
    </div>
  )
}
