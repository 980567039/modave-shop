import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function AuthLayout({
    children,
}) {
    return (
        <div>
            {/* <div className='fixed top-0 left-0 w-full h-screen bg-black'>
                <Image src="/images/background-login.jpg" alt='background' width={1800} height={900} className='object-cover w-full h-full'/>
            </div> */}
            <div className='lg:overflow-auto'>
                <div className='w-[100%] lg:h-lvh lg:relative'>
                    <div className='lg:absolute lg:top-1/2 lg:left-1/2 lg:w-[400px] lg:translate-y-[-50%] lg:translate-x-[-50%] xl:w-[800px] pt-[100px]'>
                        {children}
                       
                    </div>
                </div>
            </div>
        </div>
    )
}
