import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import UsersPage from "./pages/admin/UsersPage";
import LearningContent from "./pages/admin/LearningContent";
import CodeChallenges from './pages/admin/CodeChallenges';
import Quizzes from './pages/admin/Quizzes';
import TextTutorials from './pages/admin/TextTutorials';
import VideoTutorials from './pages/admin/VideoTutorials';
import ProjectTasks from './pages/admin/ProjectTasks';
import LearningResources from './pages/LearningResources';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="content" element={<LearningContent />} />
            <Route path="code-challenges" element={<CodeChallenges />} />
            <Route path="quizzes" element={<Quizzes />} />
            <Route path="text-tutorials" element={<TextTutorials />} />
            <Route path="video-tutorials" element={<VideoTutorials />} />
            <Route path="project-tasks" element={<ProjectTasks />} />
            <Route path="learning-resources" element={<LearningResources />} />
            {/* More admin routes will be added later */}
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
