"use client";

import * as React from "react";
import { LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";

const navigation = [
  {
    label: "Analytics",
    items: [
      { title: "Overview", icon: "dashboard", url: "/", active: true },
      { title: "Reports", icon: "monitoring", url: "/reports" },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "Users", icon: "group", url: "/users" },
      { title: "Tenants", icon: "apartment", url: "/tenants" },
      { title: "Sessions", icon: "timer", url: "/sessions" },
    ],
  },
  {
    label: "Education",
    items: [
      { title: "Academic", icon: "school", url: "/academic" },
      { title: "Question Bank", icon: "quiz", url: "/question-bank" },
    ],
  },
  {
    label: "System",
    items: [{ title: "Settings", icon: "settings", url: "/settings" }],
  },
];

export function AppSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className={cn("sidebar-glass", className)} {...props}>
      <SidebarHeader className="h-24 px-8 flex flex-row items-center border-none">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-shikhonary-teal to-shikhonary-cyan flex items-center justify-center shadow-lg shadow-shikhonary-teal/20 text-white">
            <span className="material-symbols-outlined text-[20px]">
              school
            </span>
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-foreground leading-none">
              Shikhonary
            </h1>
            <span className="text-[10px] font-semibold text-shikhonary-teal tracking-wider uppercase mt-1 block">
              Admin Portal
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-4 px-0 space-y-4">
        {navigation.map((group) => (
          <SidebarGroup key={group.label} className="px-0">
            <SidebarGroupLabel className="px-8 text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "flex items-center gap-3 px-8 py-3.5 text-sm font-medium transition-all duration-200 border-l-4 border-transparent rounded-none h-auto transition-colors",
                        item.active
                          ? "nav-active -ml-[1px]"
                          : "!bg-transparent text-muted-foreground hover:!bg-shikhonary-teal/5 hover:text-shikhonary-teal",
                      )}
                    >
                      <a href={item.url}>
                        <span
                          className={cn(
                            "material-symbols-outlined text-[20px]",
                            item.active
                              ? "text-shikhonary-teal"
                              : "text-muted-foreground/60 group-hover:text-shikhonary-teal",
                          )}
                        >
                          {item.icon}
                        </span>
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-6 border-t border-border/60 bg-white/40 backdrop-blur-sm dark:bg-black/20">
        <div className="flex items-center gap-3 p-3 rounded-2xl border border-border/50 bg-white/60 dark:bg-black/40 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md transition-all duration-300 group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-shikhonary-teal-light to-shikhonary-teal/20 border-2 border-white dark:border-slate-800 flex items-center justify-center text-shikhonary-teal-dark font-bold text-sm shadow-sm">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate group-hover:text-shikhonary-teal transition-colors">
              Anichur Anis
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Super Admin
            </p>
          </div>
          <LogOut className="w-5 h-5 text-muted-foreground group-hover:text-shikhonary-teal transition-colors" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
