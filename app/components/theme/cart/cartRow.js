"use client";

import { Button } from '@/components/ui/button'
import { formatImageUrl, formatPrice } from '@/lib/common'
import { Loader2, Trash, X } from 'lucide-react'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import QuantityChanger from './quantityChanger'
import { SiteContext } from '@/app/contexts/siteContexts';
import Link from 'next/link';

export default function CartRow({
    data,
    className,
    isOutOfStock,
    popupCartRow
}) {
    const [quantity, setQuantity] = useState(data?.quantity || 1);
    const { updateCartItem, removeFromCart, isLoading, setOpenCartModal } = useContext(SiteContext);
    
    return (
        <div className={`flex gap-3 justify-between relative mb-4`}>

            <div className={`flex w-full ${className}`}>
                <Link href={`/product/${data?.slug}`} onClick={() => setOpenCartModal(false)} className='overflow-hidden rounded-xl bg-white'>
                    <Image
                        src={formatImageUrl(data?.image)}
                        alt={data?.name}
                        width={50}
                        height={50}
                        className='w-[60px]'
                        unoptimized={true}
                    />
                </Link>
                <div className='flex-1 pl-3 relative'>
                    <div className='mb-3 w-full'>
                        <h5 className='text-xs max-w-[90%] capitalize'>{data?.name}</h5>
                        <div className='text-[10px] text-white/60 flex gap-3 shrink-0 w-full'>
                            {data?.size && <>
                                <div className='flex gap-1'>Size : <p className='uppercase'>{data?.size}</p></div>
                            </>}
                            {data?.color && <>
                                <div className='flex gap-1'>Color : <p className='uppercase'>{data?.color}</p></div>
                            </>}
                        </div>
                    </div>
                    

                    <div className='flex items-center gap-2 justify-between w-full'>

                        <div className='flex gap-2 items-center relative text-white'>
                            {isLoading?.status && isLoading?.item?.randomKey === data?.randomKey && <div className='absolute flex items-center justify-center w-full h-full bg-white/20 backdrop-blur-xl rounded-full'>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin  text-white" strokeWidth={1}/>
                            </div>}
                            <QuantityChanger
                                initValue={quantity}
                                maxCount={Number(data?.stock)}
                                onQuantityChange={(d) => updateCartItem(data, d)}
                                popupCartRow={popupCartRow}
                            />
                        </div>

                        <div className='pr-4 text-white text-sm'>{formatPrice(Number(data?.price * data?.quantity))}</div>
                        <Button variant="ghost" onClick={() => removeFromCart(data)} className="text-red-500 absolute top-0 right-0 p-0 w-7 h-7 hover:bg-white/20 hover:text-white"><Trash className='w-4 h-4' /><div className='hidden'>Remove</div></Button>
                    </div>

                    {isOutOfStock && <div className='text-red-500 font-semibold z-40 text-xs text-right pr-4'>
                        Out Of Stock
                    </div>}
                </div>
            </div>
        </div>
    )
}
