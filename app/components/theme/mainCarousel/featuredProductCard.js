import { ChevronUp, X } from 'lucide-react'
import React, { useState } from 'react'
import ProductCard from '../cards/productCard'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/common'

export default function FeaturedProductCard({
    product
}) {
    const [isActive, setIsActive] = useState(true);
    const [salePrice, setSalePrice] = useState(product?.salePrice || '');

    return (
        <div className='absolute z-40 bottom-10 right-4 md:right-[9.2vw] text-white  rounded-3xl backdrop-blur-md border-[1px] border-white/15 bg-black/10 '>
            <div className={`flex justify-end pr-2 ${isActive ? 'md:pr-7 md:pt-3' : 'absolute right-0 top-0 z-10'} `}>
                <div className='w-10 h-10 grid place-items-center border-[1px] border-transparent rounded-full transition-all ease-in-out opacity-40 hover:opacity-100 hover:scale-105  cursor-pointer'>
                    {isActive ? <X size={20} onClick={() => setIsActive(false)} /> : <ChevronUp size={20} onClick={() => setIsActive(true)} />}
                </div>

            </div>
            <div className={`pt-0 ${isActive ? 'px-5 md:px-10 md:py-3 ' : 'px-0 md:px-3 md:py-3'} py-1 w-[220px] md:w-[320px]`}>
                {!isActive ? <Link href={`/product/${product.titleSlug}`} className='flex items-center gap-3 max-w-[60vw] p-3 cursor-pointer'>
                    <div className='w-[80px] h-[90px] overflow-hidden rounded-xl relative'>
                        <Image unoptimized={true} src={product?.defaultImage?.url || ''} alt="featured product" width={80} height={100} className='w-full h-full object-cover absolute left-0 top-0' />
                    </div>
                    <div className='flex-1 w-[calc(100%-80px)]'>
                        <div className={`flex items-center gap-1 text-[11px] text-white/65 mb-2`}>Code: <span className='font-semibold'>{product.sku}</span></div>
                        <h3 className='cursor-pointer text-sm md:text-[14px] font-semibold font-headingFontRegular truncate'>
                            {product?.title}
                        </h3>
                        

                        <div className='flex gap-2 mb-2 cursor-pointer'>
                            {salePrice && (
                                <div className='text-sm opacity-75 '>
                                    <del>{formatPrice(salePrice)}</del>
                                </div>
                            )}
                            <div className='text-sm font-semibold'>
                                {formatPrice(product?.salePrice || product?.price)}
                            </div>
                        </div>
                    </div>
                </Link> : <ProductCard data={product || {}} onBlack={true} />}
            </div>
        </div>
    )
}
