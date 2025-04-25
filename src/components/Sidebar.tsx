
import { useState } from "react";
import { Link } from "react-router-dom";
import { Book, FileText, Home, LayoutDashboard, Mic, Settings, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Home", icon: Home, path: "/" },
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Vocabulary", icon: Book, path: "/vocabulary" },
  { title: "Flashcards", icon: Book, path: "/flashcards" },
  { title: "Exercises", icon: FileText, path: "/exercises" },
  { title: "Voice Conversation", icon: Mic, path: "/voice" },
  { title: "Settings", icon: Settings, path: "/settings" },
  { title: "Profile", icon: User, path: "/profile" },
];

interface MainSidebarProps {
  children: React.ReactNode;
}

export function MainSidebar({ children }: MainSidebarProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild>
                        <Link to={item.path} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1">
          <SidebarTrigger className="m-2" />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
