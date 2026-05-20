"use client"

import * as React from "react"
import {
  AlignStartVertical,
  ArrowLeftRight,
  BookOpen,
  Bot,
  Cog,
  Command,
  Frame,
  Group,
  Home,
  Layers2,
  LifeBuoy,
  Map,
  Palette,
  PieChart,
  Send,
  Settings2,
  Shirt,
  SquareTerminal,
  SwatchBook,
  UserRound,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

const defaultData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "仪表盘",
      url: "/admin",
      icon: Group,
      isActive: true,
    },
    {
      title: "分析",
      url: "/admin/analytics",
      icon: PieChart,
    },
    {
      title: "订单",
      url: "/admin/orders",
      icon: ArrowLeftRight,
    },
    {
      title: "产品",
      url: "/admin/products",
      icon: Shirt,
    },
    {
      title: "属性",
      url: "/admin/attributes",
      icon: AlignStartVertical,
    },
    {
      title: "类别",
      url: "/admin/categories",
      icon: Layers2,
    },
    {
      title: "客户",
      url: "/admin/customers",
      icon: UserRound,
    },
    {
      title: "设置",
      url: "/admin/settings",
      icon: Cog,
    },
    {
      title: "主题设置",
      url: "/admin/theme",
      icon: Palette,
    },
  ],
  navSecondary: [
    // {
    //   title: "Feedback",
    //   url: "#",
    //   icon: Send,
    // },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  const { data: sessionData, status } = useSession()
  const [sidebarData, setSidebarData] = useState(defaultData)

  useEffect(() => {
    if (status === "authenticated" && sessionData?.user) {
      setSidebarData((prevState) => ({
        ...prevState,
        user: {
          name: sessionData.user.name || sessionData.user.username || "User",
          email: sessionData.user.email || "",
          avatar: sessionData.user.image || "/avatars/shadcn.jpg",
        }
      }))
    }
  }, [sessionData, status])

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div
                  className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Home className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">后台</span>
                  <span className="truncate text-xs">商店管理后台</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
        {/* <NavProjects projects={sidebarData.projects} /> */}
        <NavSecondary items={sidebarData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
    </Sidebar>
  )
}