import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import RoleCatalog from "./pages/RoleCatalog";
import SimulationSetup from "./pages/SimulationSetup";
import ActiveSimulation from "./pages/ActiveSimulation";
import PerformanceReport from "./pages/PerformanceReport";
import InternshipSimulation from "./pages/InternshipSimulation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/onboarding" element={
                <ProtectedRoute requireOnboarding>
                  <Onboarding />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/roles" element={
                <ProtectedRoute><RoleCatalog /></ProtectedRoute>
              } />
              <Route path="/simulation/setup/:roleId" element={
                <ProtectedRoute><SimulationSetup /></ProtectedRoute>
              } />
              <Route path="/simulation/active" element={
                <ProtectedRoute><ActiveSimulation /></ProtectedRoute>
              } />
              <Route path="/report" element={
                <ProtectedRoute><PerformanceReport /></ProtectedRoute>
              } />
              <Route path="/internship-simulation" element={
                <ProtectedRoute><InternshipSimulation /></ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
