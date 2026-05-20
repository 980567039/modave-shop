"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { transformS3UrlsInObject } from '@/lib/common';




export default function MainMenu({
    isScroll,
    data = [],
    onClick = null
}) {
    const [menus, setMenus] = useState([]);

    const pathname = usePathname();
    const route = useRouter();


    useEffect(() => {
        if (data && data?.length > 0) {
            setMenus(transformS3UrlsInObject(data))
        }
    }, [data])


    const renderMobileMenu = () => (
        <div className='lg:hidden px-2 pt-10'>
            {menus && menus.map((item) => {
                if (item.type === 'simple') {
                    return (
                        <Accordion key={item.id} type="single">
                            <Link
                                onClick={onClick}
                                href={item.url}
                                className={`flex items-center text-sm gap-3 rounded-lg ${pathname === item.url ? "font-bold underline" : "text-muted-foreground"
                                    } px-3 py-2 transition-all hover:text-primary hover:underline`}
                            >
                                {item.label}
                            </Link>
                        </Accordion>
                    );
                }

                return (
                    <Accordion key={item.id} type="single" collapsible>
                        <AccordionItem value={item.label.toLowerCase()} className="p-0 border-none">
                            <AccordionTrigger className='p-0 font-normal'>
                                <Link
                                    onClick={onClick}
                                    href={item.url}
                                    className={`flex text-sm items-center gap-3 rounded-lg ${pathname === item.url ? "" : "text-muted-foreground"
                                        } px-3 py-2 transition-all hover:text-primary hover:underline`}
                                >
                                    {item.label}
                                </Link>
                            </AccordionTrigger>
                            <AccordionContent className='bg-slate-50 py-2 px-3'>
                                <div className='flex flex-col space-y-2'>
                                    {item.subMenus.map((subMenu, index) => (
                                        <Link
                                            onClick={onClick}
                                            key={index}
                                            href={subMenu.url}
                                            className='text-sm text-muted-foreground hover:text-primary transition-colors'
                                        >
                                            {subMenu.label}
                                        </Link>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                );
            })}
        </div>
    );

    const renderDesktopMenu = () => (
        <div className='hidden lg:block '>
            <NavigationMenu className="w-full max-w-full text-left">

                <NavigationMenuList>
                    {menus && menus?.length > 0 && menus.map((item) => (
                        <NavigationMenuItem key={item.id}>
                            {item.type === 'simple' ? (
                                <Link href={item.url} legacyBehavior passHref>
                                    <NavigationMenuLink
                                        className={`${navigationMenuTriggerStyle()} bg-transparent rounded-none font-semibold ${isScroll ? 'text-white' : 'text-primary'
                                            }`}
                                    >
                                        {item.label}
                                    </NavigationMenuLink>
                                </Link>
                            ) : (
                                <>
                                    <NavigationMenuTrigger
                                        onClick={() => route.push(item.url)}
                                        className={`bg-transparent rounded-none font-semibold ${isScroll ? 'text-white' : 'text-primary'
                                            }`}
                                    >
                                        {item.label}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent className="rounded-none">
                                        <div className='flex'>
                                            {item.imageUrl && (
                                                <div className='w-[300px]'>
                                                    <Image
                                                        src={item.imageUrl}
                                                        alt={item.label}
                                                        width={300}
                                                        height={500}
                                                        unoptimized={true}
                                                    />
                                                </div>
                                            )}
                                            <div className='p-5 w-[400px]'>
                                                {item.bigTitle && (
                                                    <label className='font-semibold uppercase mb-4 block'>
                                                        {item.bigTitle}
                                                    </label>
                                                )}
                                                <div className='grid grid-cols-2 grid-flow-row gap-2'>
                                                    {item.subMenus.map((subMenu, index) => (
                                                        <Link
                                                            key={index}
                                                            href={subMenu.url}
                                                            className='text-sm text-muted-foreground hover:text-primary flex items-center group transition-all ease-in-out py-1'
                                                        >
                                                            {subMenu.label}
                                                            <ArrowUpRight className='w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ease-in-out' />
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </NavigationMenuContent>
                                </>
                            )}
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );

    return (
        <div>
            {renderMobileMenu()}
            {renderDesktopMenu()}
        </div>
    );
}