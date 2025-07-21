import { useState } from "react";
import { Link } from "react-router-dom";
import { Book, FileText, Home, LayoutDashboard, Settings, User, CreditCard, Mic, ChevronDown, ChevronRight, PenTool } from "lucide-react";
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
  { title: "Profile", icon: User, path: "/profile" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

const vocabularySubItems = [
  { title: "Categorized", path: "/vocabulary/categorized" },
  { title: "Custom", path: "/vocabulary/custom" },
];

const exercisesSubItems = [
  { title: "All", path: "/exercises/all" },
  { title: "Gap-Fill", path: "/exercises/gap-fill" },
  { title: "Multiple Choice", path: "/exercises/multiple-choice" },
  { title: "Translation", path: "/exercises/translation" },
  { title: "Matching", path: "/exercises/matching" },
  { title: "Word Formation", path: "/exercises/word-formation" },
  { title: "Describe a Picture", path: "/exercises/describe-picture" },
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
                  {/* Home and Dashboard */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/" className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        <span>Home</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/dashboard" className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  {/* Vocabulary Section */}
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

                  {/* Exercises Section */}
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
                  
                  {/* Other menu items */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/flashcards" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Flashcards</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/exercises/grammar" className="flex items-center gap-2">
                        <PenTool className="h-4 w-4" />
                        <span>Grammar</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/voice-conversation" className="flex items-center gap-2">
                        <Mic className="h-4 w-4" />
                        <span>Voice Conversation</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
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
