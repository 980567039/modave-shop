"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { apiReq, formatCategories } from '@/lib/common';
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

export default function ShopFilters({
    data,
    onChangeFilter,
    type,
    categorySlug,
    hide = {}
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState([]);

    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [materials, setMaterials] = useState([]);

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [subCatSearch, setSubCatSearch] = useState(categorySlug || '');

    const categoriesListDown = (categories, t) => {
        if (t !== 'category') {
            return formatCategories(categories)?.map((cat, index) => (
                <div onClick={() => setSelectedCategory(cat.slug)} key={index} className={`cursor-pointer hover:underline transition-all ease-in-out delay-100 hover:pl-1 py-[2px] ${selectedCategory === cat?.slug ? 'font-bold' : ''}`}>{cat.title}</div>
            ))
        } else {
            return categories?.map((cat, index) => (
                <div onClick={() => setSelectedCategory(cat.slug)} key={index} className={`cursor-pointer hover:underline transition-all ease-in-out delay-100 hover:pl-1 ${selectedCategory === cat?.slug ? 'font-bold' : ''}`}>{cat.title}</div>
            ))
        }
    }

    const getAllProductMeta = async (cat) => {
        try {

            let url = 'site/product/meta';

            if (subCatSearch) {
                url = url + `?category=${subCatSearch}`
            }

            const res = await apiReq(url, 'GET');
            if (!res.ok) {
                toast.error('Something went wrong!')
            }

            const { data } = await res.json();
            if (data) {
                setCategories(data?.categories || [])
                setMaterials(data?.materials || []);

                const findColors = data?.attributes?.find((d) => d.name === "color");
                const findSizes = data?.attributes?.find((d) => d.name === "size");
                setColors(findColors?.terms || []);
                setSizes(findSizes?.terms || []);
            }

        } catch (error) {
            console.log(error);

        }
    }


    useEffect(() => {
        const query = {};
        if (selectedColor) query.color = selectedColor;
        if (selectedSize) query.size = selectedSize;
        if (selectedMaterial) query.material = selectedMaterial;
        if (selectedCategory) query.category = selectedCategory;

        // Build the query string from the query object
        const queryString = new URLSearchParams(query).toString();

        // Navigate to the updated URL
        if (query && Object.keys(query).length !== 0 && queryString) {
            router.push(`?${queryString}`);
            onChangeFilter(queryString);
        } else {
            // router.push('/shop');
        }


    }, [selectedColor, selectedSize, selectedMaterial, selectedCategory])

    useEffect(() => {
        if (searchParams && searchParams?.size !== 0) {
            setSelectedSize(searchParams.get('size'));
            setSelectedMaterial(searchParams.get('material'));
            setSelectedCategory(searchParams.get('category'))
            setSelectedColor(searchParams.get('color'))
        } else {
            setSelectedSize('');
            setSelectedMaterial('');
            setSelectedCategory('')
            setSelectedColor('')
        }
    }, [searchParams]);


    useEffect(() => {
        getAllProductMeta()
    }, [])

    useEffect(() => {
        setSubCatSearch(categorySlug);
    }, [categorySlug])


    return (
        <div className='xl:sticky xl:bottom-0 w-full'>

            <Accordion type="single" collapsible className="w-full gap-0 flex flex-col p-0 border-[1px] rounded-lg">
                {hide && !hide?.category && categories && categories?.length > 0 && <AccordionItem value="item-1" className='border-b-[1px]'>
                    <AccordionTrigger  className="uppercase text-xs font-headingFontMedium px-3">Filter by category</AccordionTrigger>
                    <AccordionContent className="p-3 text-xs font-headingFontRegular font-normal bg-black text-white space-y-1">
                        {categoriesListDown(categories, type)}
                    </AccordionContent>
                </AccordionItem>}


                {colors && colors?.length > 0 && <AccordionItem value="item-2" className='border-b-[1px]'>
                    <AccordionTrigger className="uppercase text-xs font-headingFontMedium px-3">Filter by colors</AccordionTrigger>
                    <AccordionContent>
                        <div className='grid grid-cols-2 text-sm gap-2 p-3 bg-black'>
                            {colors?.map((color, index) => (
                                <TooltipProvider key={index}>
                                    <Tooltip>
                                        <TooltipTrigger onClick={() => setSelectedColor(color?.slug)} key={index.toString()} className={`p-1 cursor-pointer rounded-full border-[1px] border-white/25 text-white flex items-center justify-start text-left gap-2 ${selectedColor === color?.slug ? 'border-black' : ''}`}>
                                            <div className='w-full h-[20px] rounded-full flex-1' style={{
                                                backgroundColor: color?.color?.hex || '#ccc'
                                            }} />

                                            <p className='flex-1 text-xs font-headingFontMedium truncate'>{color.termName}</p>
                                        </TooltipTrigger>
                                        <TooltipContent className="rounded-full bg-black/15 backdrop-blur-md text-white border-none">
                                            <p className='capitalize'>{color.termName}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>}

                {sizes && sizes?.length > 0 && <AccordionItem value="item-3" >
                    <AccordionTrigger className="uppercase text-xs font-headingFontMedium px-3">Filter by sizes</AccordionTrigger>
                    <AccordionContent>
                        <div className='p-3 bg-black flex flex-wrap text-sm gap-2'>
                            {sizes?.map((size, index) => (
                                <Button variant={selectedSize === size?.slug ? '' : 'outline'} onClick={() => setSelectedSize(size?.slug)} key={index.toString()} className={`px-2 py-1 w-auto h-auto uppercase rounded-full border-[1px] bg-white/25 border-white/15 hover:bg-white/25`}>
                                    <div className='w-full h-full rounded-none text-xs text-white'>{size?.termName}</div>
                                </Button>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>}


                {materials && materials?.length > 0 && <AccordionItem value="item-4" className=''>
                    <AccordionTrigger className="uppercase text-xs font-headingFontMedium px-3">Filter by Material</AccordionTrigger>
                    <AccordionContent className="">
                        <div className='flex flex-col text-sm gap-2 p-3 bg-black text-white'>
                            {materials?.map((material, index) => (
                                <div className={`cursor-pointer hover:underline transition-all text-xs ease-in-out delay-100 hover:pl-1 ${selectedMaterial === material?.slug ? 'font-bold' : ''}`} onClick={() => setSelectedMaterial(material?.slug)} href={material?.slug} key={index}>- {material?.title}</div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>}
            </Accordion>

            {/* <div className='p-5 border-[1px]'>
                <h4 className='uppercase text-muted-foreground mb-3 text-sm'>Filter by Price</h4>
                <div className='flex flex-col gap-3'>
                    <Slider defaultValue={[33]} max={100} step={1} />
                    <div className='text-sm'>Price: $0.00 — $159.00</div>
                </div>
            </div> */}
        </div>
    )
}
