"use client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

export default function StoreCarousel({ locations }) {
    const [api, setApi] = useState(null);
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api]);


    if (!locations) {
        return null;
    }

    return (
        <div>
            <Carousel
                setApi={setApi}
                className="z-0 m-0 p-0"
                opts={{
                    loop: true,
                }}
                plugins={[
                    // Autoplay({
                    //     delay: 5000,
                    // }),
                ]}
            >
                <CarouselContent className="-ml-4">
                    {locations.map((locations, index) => (
                        <CarouselItem key={`location_slider_${index}`} className="m-0 p-0 relative md:basis-1/2 lg:basis-1/3 pl-4">
                            <div className='p-4 border-[1px]'>
                                <div className='flex gap-2 items-baseline mb-3'>
                                    <MapPin strokeWidth={0.8} className='w-[15px] h-[15px]' />
                                    <div className='w-[calc(100%-15px)]'>
                                        {locations?.locationName && <span className='block font-semibold uppercase'>{locations?.locationName}</span>}
                                        {locations?.address && <address className='font-normal text-sm not-italic text-muted-foreground' dangerouslySetInnerHTML={{ __html: locations?.address }}></address>}
                                    </div>
                                </div>
                                {locations?.emailAddress && <div className='flex gap-2 items-center mb-3'>
                                    <Mail strokeWidth={0.8} className='w-[15px] h-[15px]'/>
                                    <Link href={`mailto:${locations?.emailAddress}`} className='w-[calc(100%-15px)] font-normal text-sm not-italic text-muted-foreground underline'>{locations?.emailAddress}</Link>
                                </div>}
                                {locations?.contactNumber && <div className='flex gap-2 items-center mb-3'>
                                    <Phone strokeWidth={0.8} className='w-[15px] h-[15px]'/>
                                    <Link href={`tel:${locations?.contactNumber}`} className='w-[calc(100%-15px)] font-normal text-sm not-italic text-muted-foreground underline'>{locations?.contactNumber}</Link>
                                </div>}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute bottom-0 left-[-10px] xl:left-[-50px]" />
                <CarouselNext className="absolute bottom-0 right-[-10px] xl:right-[-50px]" />
            </Carousel>
        </div>
    )
}
