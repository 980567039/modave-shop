"use client";

import Image from 'next/image'
import Link from 'next/link'
import React, { useContext } from 'react'
import { IconFacebook, IconInstagram, IconLinkend, IconTikTok, IconWhatsapp, IconX, IconYoutube } from '../../svgIcons'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowUpRight, MoveRight, MoveUp, MoveUpRight } from 'lucide-react';
import useScroll from '@/app/hooks/useScroll';
import { cn } from '@/lib/utils';
import { SiteContext } from '@/app/contexts/siteContexts';
import NewsLetter from './newsLetter';
import LocationSelector from './locationSelector';

export default function SiteFooter({
    isLoading
}) {
    const getScrollerPosition = useScroll();
    const { themeData } = useContext(SiteContext);

    // Smooth scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };


    const { storeLocations, footer } = themeData;

    // console.log("themeData===", footerMenus);


    return isLoading ? <Skeleton className="w-full h-72" /> : (
        <div className="p-3">
            <Button
                onClick={scrollToTop}
                className={cn(
                    'fixed md:-bottom-[100px] md:right-2 z-40 w-[40px] h-[40px] rounded-full p-1 transition-all ease-in-out delay-75',
                    getScrollerPosition > 500 ? 'opacity-100 bottom-2' : 'opacity-0'
                )}>
                <ArrowUp />
            </Button>

            <div className='relative rounded-2xl overflow-hidden border-[1px] border-black/10'>
                <div className="text-white bg-black rounded-2xl">

                    <div className='lg:px-[3vw] xl:px-[9.3vw] px-5 py-20 border-b-[1px] border-b-white/20'>
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                            <div className='space-y-5 lg:pr-20'>
                                <h3 className='font-headingFontMedium uppercase tracking-widest text-sm lg:text-[15px]'>Nuvie</h3>
                                <p className='text-[12px] text-white/70'>{footer?.leftContent?.descriptions}</p>
                            </div>
                            {footer && footer?.footerMenus && footer?.footerMenus?.length > 0 && footer?.footerMenus?.slice(0, 1).map((d, i) => (
                                <div className='space-y-5' key={`frt-menu-${i}`}>
                                    <h3 className='font-headingFontMedium uppercase tracking-widest text-sm lg:text-[15px]'>{d?.mainMenuTitle}</h3>
                                    <div className='grid grid-cols-2 text-[12px] gap-1 text-white/70'>
                                        {d?.menuItems && d?.menuItems?.length > 0 && d?.menuItems?.map((mi, index) => (
                                            <Link href={mi?.url} key={`sub-m-${index}`} className='flex items-center gap-1 group hover:text-white transition-all ease-in-out duration-100'>
                                                <div className="transition-all ease-in-out duration-100 group-hover:left-0 group-hover:underline">{mi?.label}</div>
                                                <ArrowUpRight size={15} className='opacity-0 -translate-x-1 transition-all ease-in-out duration-100 group-hover:opacity-100 group-hover:translate-x-0' />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <div className='space-y-5'>
                                <div className='grid grid-cols-2'>
                                    {footer && footer?.footerMenus && footer?.footerMenus?.length > 0 && footer?.footerMenus?.slice(1, footer?.footerMenus?.length).map((d, i) => (<div className='space-y-5' key={`frt-menu-${i}`}>
                                        <h3 className='font-headingFontMedium uppercase tracking-widest text-sm lg:text-[15px]'>{d?.mainMenuTitle}</h3>
                                        <div className='text-[12px] gap-1 text-white/70'>
                                            {d?.menuItems && d?.menuItems?.length > 0 && d?.menuItems?.map((mi, index) => (
                                                <Link href={mi?.url} key={`sub-m-${index}-${i}`} className='flex items-center gap-1 group hover:text-white transition-all ease-in-out duration-100'>
                                                    <div className="transition-all ease-in-out duration-100 group-hover:left-0  group-hover:underline">{mi?.label}</div>
                                                    <ArrowUpRight size={15} className='opacity-0 -translate-x-1 transition-all ease-in-out duration-100 group-hover:opacity-100 group-hover:translate-x-0' />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>))}
                                   
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className='lg:px-[3vw] xl:px-[9.3vw] px-5 pt-10 border-b-[1px] border-b-white/10'>
                        <div className='text-center space-y-4'>
                            <h3 className='font-headingFontMedium uppercase tracking-widest text-sm lg:text-[20px]'>Stay Connected</h3>
                            <p className='capitalize text-xs lg:text-[13px]'>Subscribe to receive the latest product news , trends and exclusive <br /> offers direct to your inbox</p>

                            <NewsLetter />
                        </div>
                    </div> */}
                    <div className='lg:px-[3vw] xl:px-[9.3vw] px-5 pb-5 lg:pb-0 border-b-[1px] border-b-white/10'>
                        <LocationSelector storeLocations={storeLocations?.locations} />
                    </div>




                    {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 py-5 lg:px-0 lg:py-10 border-b-[1px] border-b-white/40 lg:mb-10">
                        {themeData?.footer && themeData?.footer.highlightedCard && themeData?.footer?.highlightedCard.map((row, i) => (
                            <div className="border-[1px] border-white/40 p-2 flex gap-2 flex-col items-center justify-center lg:flex-row lg:items-start lg:justify-start" key={i}>
                                {row?.icon && <Image unoptimized={true} src={row.icon} alt={row.mainTitle} className='w-10 h-10' width={20} height={20} />}
                                <div className="flex flex-col items-center justify-center text-center lg:text-left lg:items-start lg:justify-start">
                                    <label>{row.mainTitle}</label>
                                    <span className="text-xs text-white/50 block">{row.tagline}</span>
                                </div>
                            </div>
                        ))}
                    </div> */}

                    {/* <div className="flex p-5 flex-col gap-5 lg:flex-row lg:p-0">
                        <div className="w-full mb-5 lg:w-3/12 lg:mb-10">
                            <div className="flex flex-col gap-5 ">
                                {themeData?.footer && themeData?.footer?.leftContent?.footerLogo && <Link href="/" aria-label="Nuvie Clothing Home">
                                    <Image
                                        src={themeData?.footer?.leftContent?.footerLogo}
                                        alt="Nuvie Clothing"
                                        width={300}
                                        height={100}
                                        className="w-[200px] mx-auto lg:mx-0"
                                    />
                                </Link>}
                                {themeData?.footer && themeData?.footer?.leftContent?.descriptions && <p className="text-center text-sm lg:text-left">{themeData?.footer?.leftContent?.descriptions}</p>}

                                <div className="flex flex-col items-center justify-center text-sm lg:justify-start lg:items-start">
                                    {themeData?.footer && themeData?.footer?.leftContent?.phone && <div>
                                        Phone: <a href={`tel:${themeData?.footer?.leftContent?.phone?.replace(' ', '')}`}>{themeData?.footer?.leftContent?.phone}</a>
                                    </div>}
                                    {themeData?.footer && themeData?.footer?.leftContent?.email && <div>
                                        Email: <a href={`mailto:${themeData?.footer?.leftContent?.email}`}>{themeData?.footer?.leftContent?.email}</a>
                                    </div>}
                                </div>

                                <div className="flex gap-5 items-center justify-center lg:justify-start lg:items-start">
                                    {themeData?.footer && themeData?.footer?.leftContent?.facebook && <Link href={themeData?.footer?.leftContent?.facebook} className="w-6" aria-label="Facebook" target='_blank'>
                                        <IconFacebook fill="#fff" />
                                    </Link>}
                                    {themeData?.footer && themeData?.footer?.leftContent?.instagram && <Link href={themeData?.footer && themeData?.footer?.leftContent?.instagram} className="w-6" aria-label="Instagram" target='_blank'>
                                        <IconInstagram fill="#fff" />
                                    </Link>}
                                    {themeData?.footer && themeData?.footer?.leftContent?.whatsapp && <Link href={`https://wa.me/${themeData?.footer && themeData?.footer?.leftContent?.whatsapp}/?text=Hi%2C%20anyone%20have%20a%20chat%3F`} className="w-6" aria-label="whatsapp" target='_blank'>
                                        <IconWhatsapp fill="#fff" />
                                    </Link>}
                                    {themeData?.footer && themeData?.footer?.leftContent?.tiktok && <Link href={themeData?.footer && themeData?.footer?.leftContent?.tiktok} className="w-6" aria-label="tiktok" target='_blank'>
                                        <IconTikTok fill="#fff" />
                                    </Link>}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-5 flex-col lg:w-9/12 lg:mb-0 lg:flex-row">
                            {themeData?.footer && themeData?.footer?.footerMenus && themeData?.footer?.footerMenus?.length > 0 && themeData?.footer?.footerMenus.map((menu, i) => (
                                <div className="flex-1" key={i}>
                                    <h3 className="text-center text-lg font-semibold mb-5 lg:text-left uppercase">{menu?.mainMenuTitle}</h3>

                                    <div className="flex flex-col gap-2 items-center lg:items-start">
                                        {menu?.menuItems && menu?.menuItems.map((sub, subi) => (
                                            <Link key={`submenu_${subi}`} href={sub?.url} className="text-sm text-white/50 lg:hover:text-white transition-all ease-in-out lg:hover:translate-x-1" aria-label={sub?.label}>{sub?.label}</Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div> */}

                    {/* owners */}
                    <div className="lg:px-[3vw] xl:px-[9.3vw] px-5 flex flex-col gap-3 items-center justify-center py-5 lg:justify-between lg:flex-row">
                        <div className='flex items-center gap-5'>
                            {themeData?.footer && themeData?.footer?.leftContent?.facebook && <Link href={themeData?.footer && themeData?.footer?.leftContent?.facebook} target='_blank' className='block p-2 transition-all ease-in-out duration-75  border-[1px] border-transparent hover:border-white/35  rounded-2xl hover:scale-110'>
                                <IconFacebook
                                    className={'text-white w-[14px] h-[14px]'}
                                    style={{
                                        width: 14,
                                        height: 14
                                    }} />
                            </Link>}
                            {themeData?.footer && themeData?.footer?.leftContent?.whatsapp && <Link href={themeData?.footer && themeData?.footer?.leftContent?.whatsapp} target='_blank' className='block p-2 transition-all ease-in-out duration-75  border-[1px] border-transparent hover:border-white/35  rounded-2xl hover:scale-110'>
                                <IconWhatsapp
                                    className={'text-white w-[14px] h-[14px]'}
                                    style={{
                                        width: 14,
                                        height: 14
                                    }} />
                            </Link>}
                            {/* <Link href="" className='block p-2 transition-all ease-in-out duration-75  border-[1px] border-transparent hover:border-white/35  rounded-2xl hover:scale-110'>
                                <IconYoutube
                                    fill={'#fff'}
                                    style={{
                                        width: 14,
                                        height: 14
                                    }} />
                            </Link> */}
                            {themeData?.footer && themeData?.footer?.leftContent?.tiktok && <Link href={themeData?.footer && themeData?.footer?.leftContent?.tiktok} target='_blank' className='block p-2 transition-all ease-in-out duration-75  border-[1px] border-transparent hover:border-white/35  rounded-2xl hover:scale-110'>
                                <IconTikTok
                                    className={'text-white w-[14px] h-[14px]'}
                                    style={{
                                        width: 14,
                                        height: 14
                                    }} />
                            </Link>}
                            {themeData?.footer && themeData?.footer?.leftContent?.instagram && <Link href={themeData?.footer && themeData?.footer?.leftContent?.instagram} target='_blank' className='block p-2 transition-all ease-in-out duration-75  border-[1px] border-transparent hover:border-white/35  rounded-2xl hover:scale-110'>
                                <IconInstagram
                                    fill={'#fff'}
                                    style={{
                                        width: 14,
                                        height: 14
                                    }} />
                            </Link>}
                        </div>
                        <div className="text-xs text-center text-white/60 flex flex-col lg:flex lg:flex-row lg:gap-3">
                            <div>© Nuvie Ceylon. All rights reserved</div>
                            {/* <div className='lg:pl-2 lg:border-l-[1px] lg:border-l-white/30'>Website by <Link href="https://aurora365.net/" target='_blank' className="underline text-white" aria-label="Aurora 365 Pvt Ltd">Aurora 365 Pvt Ltd</Link> */}
                            {/* </div> */}
                        </div>
                    </div>

                </div>

                <div className='text-right overflow-hidden h-[40px] lg:h-[100px] flex items-center justify-end pointer-events-none'>
                    <div className='text-[22vw] lg:text-[270px] -right-[4vw] lg:-right-12 absolute leading-[10vw] lg:leading-[140px] font-headingFontMedium uppercase -z-10'>Nuvie</div>
                </div>
            </div>
        </div>
    )
}
