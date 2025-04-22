
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { 
  Activity,
  Users,
  Eye,
  Book,
  FileText,
  Settings,
  Database
} from "lucide-react";

export function AppSidebar() {
  const location = useLocation();
  
  // Menu items grouped by category
  const menuGroups = {
    operations: [
      {
        title: "Collections timeline",
        path: "/",
        icon: Activity,
      },
      {
        title: "Customer segments",
        path: "/customer-segments",
        icon: Database,
      },
    ],
    views: [
      {
        title: "Collections timeline performance",
        path: "/timeline-performance",
        icon: Eye,
      },
      {
        title: "Customer timeline",
        path: "/customer-timeline",
        icon: Eye,
      },
      {
        title: "Portfolio",
        path: "/portfolio",
        icon: Eye,
      },
    ],
    records: [
      {
        title: "Actions library",
        path: "/actions-library",
        icon: Book,
      },
      {
        title: "Customers",
        path: "/customers",
        icon: Users,
      },
      {
        title: "Statements",
        path: "/statements",
        icon: FileText,
      },
    ],
    settings: [
      {
        title: "Company",
        path: "/settings/company",
        icon: Settings,
      },
      {
        title: "Business rules",
        path: "/settings/rules",
        icon: Settings,
      },
      {
        title: "Users",
        path: "/settings/users",
        icon: Settings,
      },
      {
        title: "Integrations",
        path: "/settings/integrations",
        icon: Settings,
      },
    ],
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center px-4 py-2">
        <h1 className="text-lg font-semibold">Collection timeline app</h1>
      </SidebarHeader>
      <SidebarContent>
        {/* Operations Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuGroups.operations.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link to={item.path}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Views Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Views</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuGroups.views.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link to={item.path}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Records Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Records</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuGroups.records.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link to={item.path}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuGroups.settings.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link to={item.path}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
