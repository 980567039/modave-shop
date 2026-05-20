import { Divide } from 'lucide-react'
import React, { useEffect, useState } from 'react'

export default function RecentlyViewedProducts({
    product
}) {
    const [recentProducts, setRecentProducts] = useState([]);


    useEffect(() => {
        
    }, [product]);
    return (
        <div className='mt-10 space-y-5'>
            <hr className='mt-10 block'/>
            <h2 className='text-xl font-semibold mb-5 px-5 lg:px-5 xl:px-0'>Recently Viewed Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4  gap-5 p-5 xl:p-0">
                {/* {relatedProducts?.map((product) => <ProductCard key={product.id} data={product} />)} */}
            </div>
        </div>
    )
}
