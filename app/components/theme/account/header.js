import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { ChevronRight, Slash } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function AccountHeader({ mainTitle }) {
    return (
        <div className='p-3 relative text-center flex flex-col items-center gap-3'>
        <div className='w-full relative rounded-xl pt-[100px] md:pt-[150px] overflow-hidden bg-black'>
            <div className='relative z-10 px-[9.5vw]'>
                <h1 className='text-xl md:text-2xl font-headingFontExtraBold uppercase mb-2 text-white'>{mainTitle}</h1>
                <div className='border-t-[1px] border-t-white/25 flex items-center justify-center pt-3'>
                    <Breadcrumb className="pb-10 text-white font-headingFontMedium">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href="/" className='text-white text-xs font-headingFontMedium uppercase'>Home</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <ChevronRight className='text-white' />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem className='text-white/55 text-xs font-headingFontMedium uppercase'>
                                {mainTitle}
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>
        </div>
    </div>
    )
}
