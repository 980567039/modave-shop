import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function SubItems() {
  return (
    <div className='flex'>
      <div className='w-[300px]'>
        <Image unoptimized={true} 
          src="https://uptownsrilanka.com/_next/image?url=https%3A%2F%2Fpub-aab205bc4ae24bca977e05a1c5b36628.r2.dev%2Fdfrtvq1y738zh2d256afur91&w=828&q=75"
          alt="women"
          width={300}
          height={500}
        />
      </div>
      <div className='p-5 w-[400px]'>
        <label className='font-semibold uppercase mb-2 block'>Office wear</label>
        <div className='flex flex-col'>
          <Link href="" className='text-sm text-muted-foreground hover:text-primary flex items-center group transition-all ease-in-out py-1'>Dresses <ArrowUpRight className='w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ease-in-out '/></Link>
          <Link href="" className='text-sm text-muted-foreground hover:text-primary flex items-center group transition-all ease-in-out py-1'>Tops  <ArrowUpRight className='w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ease-in-out '/></Link>
          <Link href="" className='text-sm text-muted-foreground hover:text-primary flex items-center group transition-all ease-in-out py-1'>Pants  <ArrowUpRight className='w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ease-in-out '/></Link>
          <Link href="" className='text-sm text-muted-foreground hover:text-primary flex items-center group transition-all ease-in-out py-1'>Skirt  <ArrowUpRight className='w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ease-in-out '/></Link>
        </div>
      </div>
    </div>
  )
}
