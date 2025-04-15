import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Public pages
import PublicLayout from "./pages/public/PublicLayout";
import Home from "./pages/public/Home";
import LeaveRequestForm from "./pages/public/LeaveRequestForm";
import ComplaintForm from "./pages/public/ComplaintForm";
import InquiryForm from "./pages/public/InquiryForm";
import Login from "./pages/auth/Login";

// Dashboard pages
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Route guard for protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { admin, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!admin) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="leave-request" element={<LeaveRequestForm />} />
        <Route path="complaint" element={<ComplaintForm />} />
        <Route path="inquiry" element={<InquiryForm />} />
      </Route>
      
      <Route path="/login" element={<Login />} />
      
      {/* Protected dashboard routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        {/* Other dashboard routes will be added here */}
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
