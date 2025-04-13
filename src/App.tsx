
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Context Providers
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";

// Auth Pages
import Login from "@/pages/Login";

// Student Pages
import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentCode from "@/pages/student/StudentCode";

// Faculty Pages
import FacultyDashboard from "@/pages/faculty/FacultyDashboard";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";

// 404 Page
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Default redirect to login */}
              <Route path="/" element={<Navigate to="/login" />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Student Routes */}
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/code" element={<StudentCode />} />
              
              {/* Faculty Routes */}
              <Route path="/faculty" element={<FacultyDashboard />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              
              {/* 404 Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
