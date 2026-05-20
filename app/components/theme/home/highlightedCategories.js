"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight, Home, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import { VelocityScroll } from '../text/scrollBasedVelocity';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import CategoryCardItem from './categoryCardItem';
import { generateCategoryUrls, getFullDomain } from '@/lib/common';

export default function HighlightedCategories({ highlightedCategories, selectedFeaturedCategories }) {
    
    // const setImageUrl = (url) => {
        // const findUrl = url?.startsWith('/uploads/');
        // if (findUrl) {
            // return getFullDomain() + url;
        // } else {
            // return url
        // }
    // }
    
    const returnFormatObject = generateCategoryUrls(selectedFeaturedCategories || []);
    

    return (
        <div className='flex flex-col overflow-hidden'>
            {highlightedCategories && highlightedCategories?.length > 0 && <div className="flex flex-col md:flex-row p-3 gap-3">
                {highlightedCategories?.map((d, i) => (
                    <div key={`highlightedCategories-${i}`} className="w-full lg:w-6/12 rounded-3xl overflow-hidden">                        
                        <Link href={d.link || '#'} className="overflow-hidden relative md:pt-[95%] block group">
                            <img
                                // unoptimized={true}
                                src={d.image || 'https://dummyimage.com/1000x800/ddd/000'}
                                alt={d.linkText}
                                width={1000}
                                height={800}
                                className="w-full z-20 md:absolute md:left-0 md:top-0 md:h-full md:object-cover md:object-top transform transition-transform duration-700 ease-out group-hover:scale-105"
                            />

                            <div className='absolute z-30 w-full h-full transition-all duration-500 ease-out bg-black/0 group-hover:bg-black/40 left-0 top-0 grid place-items-center text-white'>
                                <div className='flex items-center gap-2 uppercase text-[20px] md:text-[40px] font-headingFontExtraBold text-center'>
                                    <h4 className="transform transition-transform duration-500 ease-out group-hover:translate-x-[-8px] [text-shadow:_5px_4px_4px_rgba(131,131,131,0.43)]">{d.linkText}</h4>
                                    <ChevronRight
                                        size={40}
                                        strokeWidth={1}
                                        className='transform translate-x-[-10px] opacity-0 scale-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-hover:scale-100'
                                    />
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>}

            {returnFormatObject && returnFormatObject?.length > 0 && <div className='px-3'>
                <div className='relative bg-black rounded-3xl py-20'>
                    <div className='absolute -top-[74px] -right-10 text-[100px] md:text-[280px] text-white font-headingFontMedium uppercase leading-[280px] tracking-[5px]'>Find</div>
                    <div className='text-white px-[10vw]'>

                        <Carousel
                            opts={{
                                align: "start",
                            }}>
                            <CarouselContent>
                                {returnFormatObject?.map((d, i) => (
                                    <CarouselItem className="w-full md:basis-1/4" key={`featured-cat-${i}`}>
                                        <CategoryCardItem title={d?.title} url={d?.generatedUrl} imageUrl={d?.categoryFeaturedImage?.url || 'https://dummyimage.com/400x600/ddd/000'} />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            <CarouselPrevious className="bg-transparent border-0 -left-5" />
                            <CarouselNext className="bg-transparent border-0 -right-5" />
                        </Carousel>


                        <div className='flex justify-center md:justify-end pt-5'>
                            <Link href="/shop/categories" className='
                                flex 
                                items-center 
                                gap-2 
                                uppercase 
                                text-xs 
                                tracking-[2px] 
                                group 
                                transition-all 
                                ease-in-out 
                                duration-100 
                                hover:underline 
                                underline-offset-8
                                '>
                                <span>Explore all categories</span>
                                <Plus strokeWidth={1.5} size={20} className='transition-all ease-in-out duration-100 group-hover:rotate-180' />
                            </Link>
                        </div>

                    </div>
                </div>
            </div>}

        </div>
    );
}
