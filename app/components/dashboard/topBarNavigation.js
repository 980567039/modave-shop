"use client"

import * as React from "react"
import Link from "next/link"

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import { Package } from "lucide-react"

export default function TopBarNavigation() {
  return (
    <div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-black/5">Quick Access</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-3 w-max-content">
                <li className="row-span-3">
                  <Link
                    className="flex gap-2 items-center"
                    href="/admin/products/add"
                  >
                    <Package className="h-4 w-4" />
                    <span className="text-sm">Add New Products</span>
                  </Link>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
