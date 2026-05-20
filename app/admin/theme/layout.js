"use client";

import RestrictPage from "@/app/components/admin/restrictPage/restrictPage";
import AdminHeader from "@/app/components/adminHeader";
import { AdminContext } from "@/app/contexts/adminContexts";
import { BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";

const navItems = [
    { href: "/admin/theme", label: "通用" },
    { href: "/admin/theme/header", label: "首页轮播图" },
    { href: "/admin/theme/header-navigation", label: "首页导航" },
    { href: "/admin/theme/latest-arrival", label: "首页最新上架" },
    { href: "/admin/theme/highlighted-main-category", label: "首页分类" },
    { href: "/admin/theme/trending", label: "首页热门趋势" },
    // { href: "/admin/theme/best-selling", label: "畅销产品" },

    // { href: "/admin/theme/featured-collection", label: "精选系列" },
    // { href: "/admin/theme/shop-by-categories", label: "按分类购物" },
    { href: "/admin/theme/store-locations", label: "店铺位置" },
    // { href: "/admin/theme/instagram", label: "Instagram" },
    { href: "/admin/theme/footer", label: "底部" },
];

export default function ThemeLayout({ children }) {
    const pathname = usePathname();
    const { store } = useContext(AdminContext);


    // if (!store?.loginUserData?.capabilities?.includes('theme')) {
    //     return <RestrictPage />;
    // } else {
        return (
            <div className="space-y-5">
                <AdminHeader title="主题设置">
                   
                </AdminHeader>

                <div className="flex gap-5">
                    <div className="basis-1/5 grid gap-4 text-sm text-muted-foreground">
                        <nav className="flex flex-col ">
                            {navItems.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`${pathname === href ? "text-primary font-semibold" : ""} py-1`}
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="basis-4/5 border-l-[1px] pl-5">{children}</div>
                </div>
            </div>
        );
    // }
}