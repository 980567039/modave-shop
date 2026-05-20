import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function CategoryCardItem({
    url,
    title,
    imageUrl
}) {
    return (
        <Link href={url || '#'} className='rounded-2xl block overflow-hidden relative group'>
            <div className='absolute left-0 top-0 w-full h-full bg-black/25 transition-all ease-in-out duration-75 z-30'></div>
            <div className='font-headingFontExtraBold text-center text-xl px-2 uppercase absolute top-0 left-0 w-full h-full grid place-items-center group-hover:opacity-0 group-hover:scale-90 transition-all ease-in-out duration-300 z-30'>{title}</div>

            <div className='font-headingFontExtraBold text-4xl uppercase absolute top-0 left-0 w-full h-full grid place-items-center bg-black/35 z-30 opacity-0 transition-all ease-in-out duration-300 group-hover:opacity-100 delay-100'>
                <div className='w-[50px] h-[50px] rounded-full bg-white grid place-items-center transition-all ease-in-out duration-300 scale-90 group-hover:scale-100'>
                    <Plus strokeWidth={1} className='text-black' />
                </div>
            </div>
            <Image unoptimized={true} src={imageUrl || ''} alt={title || ''} className='object-cover w-full group-hover:scale-105 transition-all ease-in-out duration-700' width={300} height={600} />
        </Link>
    )
}
