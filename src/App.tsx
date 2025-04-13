
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
import StudentCourses from "@/pages/student/StudentCourses";
import StudentAssignments from "@/pages/student/StudentAssignments";
import StudentAttendance from "@/pages/student/StudentAttendance";
import StudentProfile from "@/pages/student/StudentProfile";

// Faculty Pages
import FacultyDashboard from "@/pages/faculty/FacultyDashboard";
import FacultyCourses from "@/pages/faculty/FacultyCourses";
import FacultyMaterials from "@/pages/faculty/FacultyMaterials";
import FacultyAssignments from "@/pages/faculty/FacultyAssignments";
import FacultyAnalytics from "@/pages/faculty/FacultyAnalytics";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminFaculty from "@/pages/admin/AdminFaculty";
import AdminStudents from "@/pages/admin/AdminStudents";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminSettings from "@/pages/admin/AdminSettings";

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
              <Route path="/student/courses" element={<StudentCourses />} />
              <Route path="/student/assignments" element={<StudentAssignments />} />
              <Route path="/student/attendance" element={<StudentAttendance />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              
              {/* Faculty Routes */}
              <Route path="/faculty" element={<FacultyDashboard />} />
              <Route path="/faculty/courses" element={<FacultyCourses />} />
              <Route path="/faculty/materials" element={<FacultyMaterials />} />
              <Route path="/faculty/assignments" element={<FacultyAssignments />} />
              <Route path="/faculty/analytics" element={<FacultyAnalytics />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/courses" element={<AdminCourses />} />
              <Route path="/admin/faculty" element={<AdminFaculty />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              
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
