"use client";

import { Skeleton } from '@/components/ui/skeleton'
import React, { useState, useMemo, useEffect } from 'react'
import StockCard from './stockCard'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { apiReq, formatPrice, transformS3UrlsInObject } from '@/lib/common';

export default function StockAvailabilityCards() {
  const [isLoadingStockData, setIsLoadingStockData] = useState(true);
  const [stockData, setStockData] = useState(null);

  useEffect(() => {
    async function fetchStockData() {
      let url = `admin/product/get-stocks-data`;
      try {
        const res = await apiReq(url, 'GET');
        if (res && res.status === 200) {
          const { data } = await res.json();
          
          setStockData(data);
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setIsLoadingStockData(false);
      }
    }

    fetchStockData();
  }, []);

  const { inStockCount, outOfStockCount, bestSellingProduct } = useMemo(() => {
    if (!stockData) return { inStockCount: 0, outOfStockCount: 0, bestSellingProduct: {} };

    return {
      inStockCount: stockData.inStockCount || 0,
      outOfStockCount: stockData.outOfStockCount || 0,
      bestSellingProduct: transformS3UrlsInObject(stockData.bestSellingProduct) || {}
    };
  }, [stockData]);

  return (
    <div>
      {isLoadingStockData ? (
        <div className='grid grid-cols-3 grid-flow-row gap-4'>
          <Skeleton className="w-full h-[200px] rounded-2xl" />
          <Skeleton className="w-full h-[200px] rounded-2xl" />
          <Skeleton className="w-full h-[200px] rounded-2xl" />
        </div>
      ) : (
        <div className='grid grid-cols-3 grid-flow-row gap-4'>
          <StockCard
            title="库存中"
            tagline="库存中的产品总数。"
            number={inStockCount}
            custom={<div className='flex items-end gap-3 border-t-[1px] pt-2'>
                <div className='flex flex-col gap-1'>
                  <h3 className='text-xl font-semibold'>{stockData?.totalStockCount || 0}</h3>
                  <p className='text-xs uppercase font-headingFontMedium'>总库存数量</p>
                </div>
                <div className='flex flex-col gap-1'>
                  <h3 className='text-xl font-semibold'>{formatPrice(stockData?.totalInventoryValue || 0)}</h3>
                  <p className='text-xs uppercase font-headingFontMedium'>总库存价值</p>
                </div>
            </div>}
          />
          <StockCard
            title="缺货"
            tagline="缺货产品总数。"
            number={outOfStockCount}
            textColor="text-red-500"
          />
          <StockCard
            title="最畅销产品"
            tagline="最受欢迎的产品"
            custom={
              <div className='border-[1px] p-2 rounded-2xl flex items-center gap-2 justify-between'>
                <div className='flex items-center gap-2'>
                  <Link href={`/product/${bestSellingProduct?.productSlug}`} className='w-10 h-10 overflow-hidden rounded-xl relative'>
                    <img src={bestSellingProduct?.productImage || 'https://dummyimage.com/400x400/ddd/000'} alt={bestSellingProduct?.productName} width={50} height={50} className='absolute left-0 top-0 w-full h-full object-cover' />
                  </Link>
                  <div className='flex flex-col'>
                    <Link href={`/product/${bestSellingProduct?.productSlug}`} className='text-xs truncate'>{bestSellingProduct?.productName}</Link>
                    <Badge className="inline w-max-content text-xs">总销量 {bestSellingProduct?.totalSold}</Badge>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      )}
    </div>
  )
}