
import { useState } from "react";
import { Link } from "react-router-dom";
import { Book, FileText, Home, LayoutDashboard, Settings, User, CreditCard, Mic, ChevronDown, ChevronRight } from "lucide-react";
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const basicMenuItems = [
  { title: "Home", icon: Home, path: "/" },
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Flashcards", icon: CreditCard, path: "/flashcards" },
  { title: "Voice Conversation", icon: Mic, path: "/voice-conversation" },
  { title: "Settings", icon: Settings, path: "/settings" },
  { title: "Profile", icon: User, path: "/profile" },
];

const vocabularySubItems = [
  { title: "Categorized", path: "/vocabulary/categorized" },
  { title: "Custom", path: "/vocabulary/custom" },
  { title: "Exercises", path: "/vocabulary/exercises" },
];

const exercisesSubItems = [
  { title: "All", path: "/exercises/all" },
  { title: "Describe a Picture", path: "/exercises/describe-picture" },
  { title: "Grammar", path: "/exercises/grammar" },
  { title: "Mixed", path: "/exercises/mixed" },
];

interface MainSidebarProps {
  children: React.ReactNode;
}

export function MainSidebar({ children }: MainSidebarProps) {
  const [vocabularyOpen, setVocabularyOpen] = useState(false);
  const [exercisesOpen, setExercisesOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {basicMenuItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild>
                        <Link to={item.path} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  
                  <Collapsible open={vocabularyOpen} onOpenChange={setVocabularyOpen}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <Book className="h-4 w-4" />
                            <span>Vocabulary</span>
                          </div>
                          {vocabularyOpen ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {vocabularySubItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.path}>
                              <SidebarMenuSubButton asChild>
                                <Link to={subItem.path}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>

                  <Collapsible open={exercisesOpen} onOpenChange={setExercisesOpen}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>Exercises</span>
                          </div>
                          {exercisesOpen ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {exercisesSubItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.path}>
                              <SidebarMenuSubButton asChild>
                                <Link to={subItem.path}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
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
