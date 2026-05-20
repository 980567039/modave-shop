"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react'
import { useState } from 'react'

export default function LocationSelector({
    storeLocations
}) {
    const [selectedLocation, setSelectedLocation] = useState({});

    useEffect(() => {
        if(storeLocations && storeLocations?.length > 0){
            setSelectedLocation(storeLocations[0])
        }
    }, [storeLocations])

    return (
        <div className='flex items-center flex-col lg:flex-row gap-3 justify-end h-[70px]'>
            {/* <div className='lg:border-r-[1px] lg:pr-3 lg:border-r-white/10'>
                <DropdownMenu>
                    <DropdownMenuTrigger className='flex items-center gap-2 text-xs py-7'>
                        <div>{selectedLocation?.locationName}</div>
                        <ChevronDown size={10}/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="left" className="rounded-2xl bg-black/15 border-[1px] border-white/15 backdrop-blur-lg text-white shadow-md">
                        {storeLocations && storeLocations?.map((d, i) => (
                            <DropdownMenuItem onClick={() => setSelectedLocation(d)} key={`store-location-${i}`} className="rounded-2xl px-4 cursor-pointer">{d.locationName}</DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

            </div> */}

            <div className='flex items-center flex-col lg:flex-row text-center lg:text-right gap-3 text-xs'>
                <div className='text-xs'>{selectedLocation?.address}</div>
                <div className='text-white/30 hidden lg:block'>|</div>
                <Link href={`tel:${selectedLocation?.contactNumber}`} className='hover:underline underline-offset-2 transition-all ease-in-out duration-100'>{selectedLocation?.contactNumber}</Link>
                <div  className='text-white/30 hidden lg:block'>|</div>
                <Link href={`mailto:${selectedLocation?.emailAddress}`} className='hover:underline underline-offset-2 transition-all ease-in-out duration-100'>{selectedLocation?.emailAddress}</Link>
            </div>

        </div>
    )
}
