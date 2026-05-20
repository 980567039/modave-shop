import React, { useEffect, useState } from 'react'
import ProductCard from '../cards/productCard'
import { apiReq } from '@/lib/common';
import { Skeleton } from '@/components/ui/skeleton';

export default function RelatedProducts({
    product
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        setRelatedProducts(product)
    }, [product]);

    if (isLoading) {
        return (
            <div className='mt-10'>
                <h2 className='text-xl font-semibold mb-5 px-5 lg:px-0'><Skeleton className="w-3/12 h-5" /></h2>
                <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5  gap-5 p-5 xl:p-0">
                    <div className='space-y-3'>
                        <Skeleton className="w-full h-[30vh]" />
                        <Skeleton className="w-4/12 h-3" />
                        <Skeleton className="w-1/12 h-3" />
                        <div className='flex gap-2'>
                            <Skeleton className="w-3 h-3 rounded-full" />
                            <Skeleton className="w-3 h-3 rounded-full" />
                            <Skeleton className="w-3 h-3 rounded-full" />
                        </div>
                    </div>
                    <div className='space-y-3'>
                        <Skeleton className="w-full h-[30vh]" />
                        <Skeleton className="w-4/12 h-3" />
                        <Skeleton className="w-1/12 h-3" />
                        <div className='flex gap-2'>
                            <Skeleton className="w-3 h-3 rounded-full" />
                            <Skeleton className="w-3 h-3 rounded-full" />
                            <Skeleton className="w-3 h-3 rounded-full" />
                        </div>
                    </div>
                    <div className='space-y-3'>
                        <Skeleton className="w-full h-[30vh]" />
                        <Skeleton className="w-4/12 h-3" />
                        <Skeleton className="w-1/12 h-3" />
                        <div className='flex gap-2'>
                            <Skeleton className="w-3 h-3 rounded-full" />
                            <Skeleton className="w-3 h-3 rounded-full" />
                            <Skeleton className="w-3 h-3 rounded-full" />
                        </div>
                    </div>
                    <div className='space-y-3'>
                        <Skeleton className="w-full h-[30vh]" />
                        <Skeleton className="w-4/12 h-3" />
                        <Skeleton className="w-1/12 h-3" />
                        <div className='flex gap-2'>
                            <Skeleton className="w-3 h-3 rounded-full" />
                            <Skeleton className="w-3 h-3 rounded-full" />
                            <Skeleton className="w-3 h-3 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        )
    } else{
        return relatedProducts && relatedProducts.length > 0 && (
            <div className='mt-10 xl:px-[9.5vw] space-y-5 px-0'>
                <h2 className='text-xl font-semibold mb-5 lg:px-5 xl:px-0 text-center uppercase font-headingFontMedium'>Related Items</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5  gap-5 p-5 xl:p-0">
                    {relatedProducts?.map((product, index) => <ProductCard key={`${product.id?.toString()}-${index}`} data={product} />)}
                </div>
            </div>
        )
    }

}
