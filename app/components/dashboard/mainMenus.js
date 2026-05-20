"use client";
import { AdminContext } from '@/app/contexts/adminContexts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge'
import { BadgeDollarSign, ChevronDown, Home, Layers2, LineChart, Minus, Package, PackageSearch, Palette, Settings, ShoppingCart, SquareStack, TextQuote, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react'

export default function DashboardMainMenus() {
    const router = useRouter();
    const pathname = usePathname();
    const { store } = useContext(AdminContext);

    // console.log(store?.loginUserData?.capabilities?.includes('dashboard'));


    return (
        <Accordion type="single" collapsible className="w-full">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {store?.loginUserData?.capabilities?.includes('dashboard') && <AccordionItem value="item-1" className="border-none">
                    <Link href="/admin" className={`flex items-center gap-3 rounded-lg ${pathname === "/admin" ? "bg-muted" : "text-muted-foreground"} px-3 py-2  transition-all hover:text-primary hover:underline`}>
                        <Home className="h-4 w-4" />
                        Dashboard
                    </Link>
                </AccordionItem>}

                {store?.loginUserData?.capabilities?.includes('analytics') && <AccordionItem value="item-2" className="border-none">
                    <Link
                        href="/admin/analytics"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === "/admin/analytics" ? "bg-muted" : "text-muted-foreground"} transition-all hover:text-primary`}
                    >
                        <LineChart className="h-4 w-4" />
                        Analytics
                    </Link>
                    <AccordionContent className="pl-2 bg-slate-50 pb-0 rounded-lg">
                        <Link
                            href="/admin/analytics/sales-metrics"
                            className="flex items-center gap-1 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:underline"
                        >
                            <Minus className="h-4 w-4" />
                            <span className='text-xs'>Sales Metrics</span>
                        </Link>
                        <Link
                            href="/admin/analytics/sales-metrics"
                            className="flex items-center gap-1 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:underline"
                        >
                            <Minus className="h-4 w-4" />
                            <span className='text-xs'>Product Metrics</span>
                        </Link>
                    </AccordionContent>
                </AccordionItem>}

                {store?.loginUserData?.capabilities?.includes('orders') && <AccordionItem value="orders" className="border-none">
                    <Link
                        href="/admin/orders"
                        className={`flex items-center gap-3 ${pathname === "/admin/orders" ? "bg-muted text-primary" : ""} rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:underline`}
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Orders
                        {store?.orderCount > 0 && <Badge className="ml-auto flex h-6 shrink-0 items-center justify-center rounded-full">
                            {store?.orderCount > 10 ? store?.orderCount + '+' : store?.orderCount} New
                        </Badge>}
                    </Link>
                </AccordionItem>}
                {store?.loginUserData?.capabilities?.includes('products') && <AccordionItem value="products" className="border-none">
                    <Link
                        href="/admin/products"
                        className={`flex items-center gap-3 ${pathname === "/admin/products" ? "bg-muted text-primary" : ""} rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:underline`}
                    >
                        <Package className="h-4 w-4" />
                        Products{" "}
                    </Link>
                </AccordionItem>}
                {store?.loginUserData?.capabilities?.includes('attributes') && <AccordionItem value="attributes" className="border-none">
                    <Link
                        href="/admin/attributes"
                        className={`flex items-center gap-3 ${pathname === "/admin/attributes" ? "bg-muted text-primary" : ""} rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:underline`}
                    >
                        <SquareStack className="h-4 w-4" />
                        Attributes{" "}
                    </Link>
                </AccordionItem>}
                {store?.loginUserData?.capabilities?.includes('categories') && <AccordionItem value="categories" className="border-none">
                    <Link
                        href="/admin/categories"
                        className={`flex items-center gap-3 ${pathname === "/admin/categories" ? "bg-muted text-primary" : ""} rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:underline`}
                    >
                        <Layers2 className="h-4 w-4" />
                        Categories{" "}
                    </Link>
                </AccordionItem>}
                {store?.loginUserData?.capabilities?.includes('customers') && <AccordionItem value="customers" className="border-none">
                    <Link
                        href="/admin/customers"
                        className={`flex items-center gap-3 ${pathname === "/admin/customers" ? "bg-muted text-primary" : ""} rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:underline`}
                    >
                        <Users className="h-4 w-4" />
                        Customers
                    </Link>
                </AccordionItem>}
                {store?.loginUserData?.capabilities?.includes('settings') && <AccordionItem value="settings" className="border-none">
                    <Link
                        href="/admin/settings"
                        className={`flex items-center gap-3 ${pathname === "/admin/settings" ? "bg-muted text-primary" : ""} rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:underline`}
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                </AccordionItem>}
                {store?.loginUserData?.capabilities?.includes('theme') && <AccordionItem value="theme" className="border-none">
                    <Link
                        href="/admin/theme"
                        className={`flex items-center gap-3 ${pathname === "/admin/theme" ? "bg-muted text-primary" : ""} rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:underline`}
                    >
                        <Palette className="h-4 w-4" />
                        Theme
                    </Link>
                </AccordionItem>}


            </nav>
        </Accordion>
    )
}
