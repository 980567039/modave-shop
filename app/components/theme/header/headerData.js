"use client";

import React from 'react';
import MobileMenuButton from './mobileMenuButton'
import Navigation from './menus/mainNavigation'
import Link from 'next/link'
import Image from 'next/image'
import RightActionButtons from './rightActionButtons'

export default function HeaderData({
    data
}) {

    return (
        <>
            <div className={`fixed w-full flex px-4 pt-5 lg:px-[3vw] xl:px-[9.3vw] lg:pt-7 z-50`}>
                <div className='w-full  bg-black rounded-[40px] relative border-[1px] border-white/15 shadow-lg'>
                    <div className='flex gap-3 p-1 items-center xl:p-2 xl:px-3 justify-between transition-all ease-in-out delay-75'>
                        <div className='flex-1 xl:hidden w-3/12'>
                            <MobileMenuButton data={data?.mainNavigation} />
                        </div>

                        <div className='hidden xl:block xl:flex-1'>
                            <Navigation data={data?.mainNavigation}/>
                            {/* <MainMenu isScroll={fixedBg || getScrollerPosition > 10} data={themeData?.mainNavigation} /> */}
                        </div>
                        <div className='flex-1 flex items-center justify-center'>
                            <Link href="/" className='block py-2 '>
                                <div>
                                    <Image
                                        src={data?.common?.mainLogo || "/images/main-logo.png"}
                                        alt="Nuvie Clothing"
                                        width={90}
                                        height={30}
                                        placeholder="blur"
                                        blurDataURL="/images/main-logo.png"
                                        unoptimized={true}
                                    />
                                </div>
                            </Link>
                        </div>
                        <div className='flex-1 text-right'>
                            <RightActionButtons />
                        </div>
                    </div>



                </div>
            </div>

            {/* {
                storeData?.general?.enabledSnow && <Snowfall
                    style={{
                        position: 'fixed',
                        width: '100vw',
                        height: '100vh',
                        zIndex: 999,
                        pointerEvents: 'none'
                    }}
                    snowflakeCount={storeData?.general?.snowSpeed || 75}
                />
            } */}
        </>
    )
}
