
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainSidebar } from "./components/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Vocabulary from "./pages/Vocabulary";
import Flashcards from "./pages/Flashcards";
import Exercises from "./pages/Exercises";
import VoiceConversation from "./pages/VoiceConversation";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import DescribePicture from "./pages/exercises/DescribePicture";
import Grammar from "./pages/exercises/Grammar";
import Mixed from "./pages/exercises/Mixed";
import GapFill from "./pages/exercises/GapFill";
import MultipleChoice from "./pages/exercises/MultipleChoice";
import Translation from "./pages/exercises/Translation";
import Matching from "./pages/exercises/Matching";
import VocabularyCategorized from "./pages/vocabulary/Categorized";
import VocabularyCustom from "./pages/vocabulary/Custom";
import VocabularyExercises from "./pages/vocabulary/Exercises";
import WordDetails from "./pages/vocabulary/WordDetails";
import ExercisesAll from "./pages/exercises/All";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/register" element={<Navigate to="/" replace />} />
      <Route path="*" element={
        <MainSidebar>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/vocabulary/categorized" element={<VocabularyCategorized />} />
            <Route path="/vocabulary/custom" element={<VocabularyCustom />} />
            <Route path="/vocabulary/custom/:wordId" element={<WordDetails />} />
            <Route path="/vocabulary/exercises" element={<VocabularyExercises />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/exercises/all" element={<ExercisesAll />} />
            <Route path="/exercises/gap-fill" element={<GapFill />} />
            <Route path="/exercises/multiple-choice" element={<MultipleChoice />} />
            <Route path="/exercises/translation" element={<Translation />} />
            <Route path="/exercises/matching" element={<Matching />} />
            <Route path="/exercises/describe-picture" element={<DescribePicture />} />
            <Route path="/exercises/grammar" element={<Grammar />} />
            <Route path="/exercises/mixed" element={<Mixed />} />
            <Route path="/voice-conversation" element={<VoiceConversation />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainSidebar>
      } />
    </Routes>
  );
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
