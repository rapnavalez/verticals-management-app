"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  RiCalendarLine,
  RiGroupLine,
  RiHome2Line,
  RiScissorsLine,
  RiSettingsLine,
  RiStoreLine,
  RiTeamLine,
} from "@remixicon/react"
import type { AuthUser } from "@/lib/auth/session"

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <RiHome2Line />,
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: <RiCalendarLine />,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: <RiGroupLine />,
  },
  {
    title: "Services",
    url: "/services",
    icon: <RiScissorsLine />,
  },
  {
    title: "Staff",
    url: "/staff",
    icon: <RiTeamLine />,
  },
]

const navSecondary = [
  {
    title: "Settings",
    url: "/settings",
    icon: <RiSettingsLine />,
  },
]

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: AuthUser }) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <RiStoreLine className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.businessName}</span>
                  <span className="truncate text-xs capitalize">{user.role}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
