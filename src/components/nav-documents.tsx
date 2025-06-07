"use client";

import { IconDots } from "@tabler/icons-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { History } from "@/services/querys/getHistory";
import { HistoryActions } from "./HistoryActions";
import Link from "next/link";

interface NavDocumentsProps {
  items: History[];
}

export function NavDocuments({ items }: NavDocumentsProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>History</SidebarGroupLabel>
      <SidebarMenu>
        {items.length === 0 && (
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <span className="text-muted-foreground">No history found</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
        {items.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild>
              <Link href={`/chat/${item.id}`}>
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className="data-[state=open]:bg-accent rounded-sm"
                >
                  <IconDots />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-24 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <HistoryActions history={item} />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
