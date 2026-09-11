import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';

// Public pages
import Welcome from '@/pages/Welcome';
import VolunteerRegister from '@/pages/VolunteerRegister';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// Layout
import AppLayout from '@/components/AppLayout';

// Student pages
import Dashboard from '@/pages/Dashboard';
import SupportCenter from '@/pages/SupportCenter';
import Quiz from '@/pages/Quiz';
import Diary from '@/pages/Diary';
import Chat from '@/pages/Chat';
import Appointments from '@/pages/Appointments';

// Volunteer pages
import VolunteerDashboard from '@/pages/VolunteerDashboard';
import VolunteerChat from '@/pages/VolunteerChat';
import VolunteerSchedule from '@/pages/VolunteerSchedule';
import VolunteerTraining from '@/pages/VolunteerTraining';

// Psychologist pages
import PsychologistDashboard from '@/pages/PsychologistDashboard';
import PsychologistPatients from '@/pages/PsychologistPatients';
import PsychologistChat from '@/pages/PsychologistChat';
import PsychologistSchedule from '@/pages/PsychologistSchedule';
import PsychologistProfile from '@/pages/PsychologistProfile';

// Admin pages
import AdminDashboard from '@/pages/AdminDashboard';
import AdminVolunteers from '@/pages/AdminVolunteers';
import AdminUsers from '@/pages/AdminUsers';
import AdminStats from '@/pages/AdminStats';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-emerald-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/volunteer-register" element={<VolunteerRegister />} />

      {/* Protected routes with layout */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AppLayout />}>
          {/* Student */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/support-center" element={<SupportCenter />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/appointments" element={<Appointments />} />

          {/* Volunteer */}
          <Route path="/volunteer" element={<VolunteerDashboard />} />
          <Route path="/volunteer/chat" element={<VolunteerChat />} />
          <Route path="/volunteer/schedule" element={<VolunteerSchedule />} />
          <Route path="/volunteer/training" element={<VolunteerTraining />} />

          {/* Psychologist */}
          <Route path="/psychologist" element={<PsychologistDashboard />} />
          <Route path="/psychologist/patients" element={<PsychologistPatients />} />
          <Route path="/psychologist/chat" element={<PsychologistChat />} />
          <Route path="/psychologist/schedule" element={<PsychologistSchedule />} />
          <Route path="/psychologist/profile" element={<PsychologistProfile />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/volunteers" element={<AdminVolunteers />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/stats" element={<AdminStats />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
