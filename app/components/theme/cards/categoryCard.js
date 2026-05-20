import { ArrowUpRight, MoveUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function CategoryCard({
    href,
    name,
    image
}) {
  return (
    <Link href={href} className='overflow-hidden relative h-[250px] md:h-[500px] group'>
        <Image unoptimized={true}
            src={image}
            alt={name}
            width={400}
            height={400}
            className='absolute left-0 top-0 w-full h-full object-cover group-hover:scale-105 transition-transform ease-in-out delay-75'
        />

        <div className='px-3 py-2 bg-black/80 absolute left-0 bottom-0 text-white  transition-all ease-in-out delay-75 flex items-center text-xs'>
            {name} <ArrowUpRight className='w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:ml-1 transition-all ease-in-out delay-75 ' />
        </div>
    </Link>
  )
}
