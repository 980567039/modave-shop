'use client';

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../contexts/authUserProvider";
import { useContext, useEffect } from "react";
import DashboardSidebar from "../components/dashboard/sidebar";

import { CircleUser, Menu } from "lucide-react";
import DashboardMainMenus from "../components/dashboard/mainMenus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import TopBarNavigation from "../components/dashboard/topBarNavigation";
import { AdminContext, AdminProvider } from "../contexts/adminContexts";
import Link from "next/link";
import { NotificationProvider } from "../contexts/notificationProvider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import DynamicBreadcrumb from "../components/dynamicBreadcrumb";


export default function AdminLayout({ children }) {
    const { status } = useSession();
    const router = useRouter();
    const { data } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>;
    }

    return (
        <AdminProvider>
            <NotificationProvider>
                <SidebarProvider>
                    <AppSidebar/>
                    <SidebarInset>
                        <header className="flex h-16 shrink-0 items-center gap-2">
                            <div className="flex items-center gap-2 px-4">
                                <SidebarTrigger className="-ml-1" />
                                <Separator orientation="vertical" className="mr-2 h-4" />
                                <DynamicBreadcrumb />
                            </div>
                        </header>
                        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                            {children}
                        </div>
                    </SidebarInset>
                </SidebarProvider>

                
            </NotificationProvider>
        </AdminProvider>
    );
}