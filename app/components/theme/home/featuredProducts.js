import React, { useEffect, useState } from 'react'
import ProductCard from '../cards/productCard'
import { apiReq } from '@/lib/common';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function FeaturedProducts() {
    const [selectedTab, setSelectedTab] = useState('women');
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState([]);


    const getProducts = async (tab) => {
        try {
            setIsLoading(true);
            const response = await apiReq(`site/home/featured-products?type=${tab}`, "GET", null, 60000);


            if (!response.ok) {
                toast.error("Failed to fetch latest products", {
                    description: "Please try again later"
                });
                throw new Error('Failed fetch latest products');
            }

            const { data } = await response.json();
            setProducts(data || []);
            setIsLoading(false);

        } catch (error) {
            setIsLoading(false);
        } finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getProducts(selectedTab);
    }, [selectedTab])

    return (
        <div>
            <div className="px-3 md:px-[10vw] py-6 md:py-[150px] space-y-7">
                <div className="rounded-full border-[1px] border-black/10 w-max flex items-center mx-auto p-1 gap-1">
                    <button onClick={() => setSelectedTab('women')} className={`border-0 ${selectedTab === "women" ? 'bg-black text-white' : 'hover:bg-black/5'} py-2 md:py-5 px-5 md:px-10 md:w-[300px] rounded-full  uppercase font-headingFontMedium tracking-widest flex items-center gap-2 justify-center`}>Women {selectedTab === "women" && isLoading && <Loader2 size={16} className='animate-spin'/>}</button>
                    <button onClick={() => setSelectedTab('men')} className={`border-0 ${selectedTab === "men" ? 'bg-black text-white' : 'hover:bg-black/5'} py-2 md:py-5 px-5 md:px-10 md:w-[300px] rounded-full  uppercase font-headingFontMedium tracking-widest  flex items-center gap-2 justify-center`}>Men {selectedTab === "men" && isLoading && <Loader2 size={16} className='animate-spin'/>}</button>
                </div>


                {/* <div className="mx-auto w-full overflow-x-auto md:w-max md:overflow-x-visible">
                    <ul className="list-none flex w-max md:w-auto items-center gap-3 text-sm uppercase font-headingFontMedium tracking-widest transition-all ease-in-out duration-100">
                    <li className="px-2 py-[2px] bg-black rounded-full text-white transition-all ease-in-out duration-100">Hot</li>
                    <li className="px-2 py-[2px] rounded-full transition-all ease-in-out duration-100 hover:bg-black/5 cursor-pointer flex items-center gap-2">Clearance Sale<Loader2 size={12} className="animate-spin" strokeWidth={1} /></li>
                    <li className="px-2 py-[2px] rounded-full transition-all ease-in-out duration-100 hover:bg-black/5 cursor-pointer">Sport Dress</li>
                    <li className="px-2 py-[2px] rounded-full transition-all ease-in-out duration-100 hover:bg-black/5 cursor-pointer">Party Dress</li>
                    </ul>
                </div> */}

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {products && products?.length > 0 && products?.map((d, i) => (
                        <ProductCard data={d} key={`featured-p-${i}`}/>
                    ))}
                </div>
            </div>
        </div>
    )
}
