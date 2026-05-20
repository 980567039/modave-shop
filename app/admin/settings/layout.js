"use client";

import React, { useContext, useEffect } from 'react'
import AdminHeader from '@/app/components/adminHeader'
import { BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminContext } from '@/app/contexts/adminContexts';
import RestrictPage from '@/app/components/admin/restrictPage/restrictPage';


export default function SettingLayout({
    children,
}) {
    const pathname = usePathname();

    const isActive = (href) => pathname === href;

    const { store } = useContext(AdminContext);


    // if (!store?.loginUserData?.capabilities?.includes('settings')) {
    //     return <RestrictPage />;
    // } else {
        return (
            <div className='space-y-5'>
                <AdminHeader
                    title="Settings"
                >
                   
                </AdminHeader>

                <div className='flex gap-5'>
                    <div className='basis-1/5'>
                        <nav
                            className="grid gap-4 text-sm text-muted-foreground"
                        >
                            <Link href="/admin/settings" className={`${isActive('/admin/settings') ? 'text-primary font-semibold' : ''}`}>
                            通用设置
                            </Link>
                            <Link href="/admin/settings/payments" className={`${isActive('/admin/settings/payments') ? 'text-primary font-semibold' : ''}`}>支付设置</Link>
                            <Link href="/admin/settings/email" className={`${isActive('/admin/settings/email') ? 'text-primary font-semibold' : ''} pointer-events-none opacity-35`}>邮箱设置</Link>
                            <Link href="/admin/settings/product" className={`${isActive('/admin/settings/product') ? 'text-primary font-semibold' : ''}`}>产品设置</Link>
                            <Link href="/admin/settings/shipping" className={`${isActive('/admin/settings/shipping') ? 'text-primary font-semibold' : ''}`}>配送设置</Link>
                            <Link href="/admin/settings/offers" className={`${isActive('/admin/settings/offers') ? 'text-primary font-semibold' : ''}`}>优惠设置</Link>
                        </nav>
                    </div>
                    <div className='basis-4/5 border-l-[1px] pl-5'>
                        {children}
                    </div>
                </div>

            </div>
        )
    // }
}
