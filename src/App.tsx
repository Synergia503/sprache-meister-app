
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainSidebar } from "./components/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./components/ThemeProvider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Vocabulary from "./pages/Vocabulary";
import Flashcards from "./pages/Flashcards";
import Exercises from "./pages/Exercises";
import VoiceConversation from "./pages/VoiceConversation";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import DescribePicture from "./pages/exercises/DescribePicture";
import Grammar from "./pages/exercises/Grammar";
import VocabularyCategorized from "./pages/vocabulary/Categorized";
import VocabularyCustom from "./pages/vocabulary/Custom";
import VocabularyExercises from "./pages/vocabulary/Exercises";
import ExercisesAll from "./pages/exercises/All";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainSidebar>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/vocabulary" element={<Vocabulary />} />
              <Route path="/vocabulary/categorized" element={<VocabularyCategorized />} />
              <Route path="/vocabulary/custom" element={<VocabularyCustom />} />
              <Route path="/vocabulary/exercises" element={<VocabularyExercises />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/exercises" element={<Exercises />} />
              <Route path="/exercises/all" element={<ExercisesAll />} />
              <Route path="/exercises/describe-picture" element={<DescribePicture />} />
              <Route path="/exercises/grammar" element={<Grammar />} />
              <Route path="/voice-conversation" element={<VoiceConversation />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainSidebar>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
