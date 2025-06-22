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
import ModulePage from './pages/admin/ModulePage';
import LoginPage from "@/pages/admin/LoginPage";
import RequireAuth from "@/components/auth/RequireAuth";
import PlacementDrives from './pages/admin/PlacementDrives';
import { createContext, useContext, useEffect, useState } from "react";
import LeaderboardAdmin from './pages/admin/LeaderboardAdmin';
import Announcements from './pages/admin/Announcements';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';
import Colleges from './pages/admin/Colleges';

// AuthProvider context - simplified for now
export const AuthContext = createContext<{ user: any | null, loading: boolean }>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Placeholder for AWS authentication
    setUser("AWS_USER");
    setLoading(false);
  }, []);
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Login route is public */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* All other routes require authentication */}
            <Route element={<RequireAuth />}>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="modules" element={<ModulePage />} />
                <Route path="content" element={<LearningContent />} />
                <Route path="code-challenges" element={<CodeChallenges />} />
                <Route path="quizzes" element={<Quizzes />} />
                <Route path="text-tutorials" element={<TextTutorials />} />
                <Route path="video-tutorials" element={<VideoTutorials />} />
                <Route path="project-tasks" element={<ProjectTasks />} />
                <Route path="drives" element={<PlacementDrives />} />
                <Route path="leaderboards" element={<LeaderboardAdmin />} />
                <Route path="announcements" element={<Announcements />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
                <Route path="colleges" element={<Colleges />} />
                {/* More admin routes will be added later */}
              </Route>
              {/* Catch-all route (also protected) */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
