import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LocaleProvider } from './contexts/LocaleContext';
import { HomePage } from './components/HomePage';
import ExhibitionsPage from './components/ExhibitionsPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { AdminDashboard } from './components/AdminDashboard';
import { ArtisanDashboard } from './components/ArtisanDashboard';
import { CustomerDashboard } from './components/CustomerDashboard';
import { ConsultantDashboard } from './components/ConsultantDashboard';
import { Toaster } from './components/ui/sonner';
import { initializeSampleData } from './utils/sampleData';

// Initialize sample data on app load
initializeSampleData();

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Convenience handlers to pass to pages that still expect callback props
  const onNavigateToLogin = () => navigate('/login');
  const onNavigateToRegister = () => navigate('/register');
  const onNavigateToExhibitions = () => navigate('/exhibitions');

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/exhibitions" element={<ExhibitionsPage onBack={() => navigate('/')} />} />
        <Route path="/login" element={<LoginPage onSwitchToRegister={() => navigate('/register')} />} />
        <Route path="/register" element={<RegisterPage onSwitchToLogin={() => navigate('/login')} />} />
        <Route path="/" element={<HomePage onNavigateToLogin={onNavigateToLogin} onNavigateToRegister={onNavigateToRegister} onNavigateToExhibitions={onNavigateToExhibitions} />} />
      </Routes>
    );
  }

  // Authenticated - route to role-specific dashboard
  return (
    <Routes>
      <Route path="/" element={
        (() => {
          switch (user?.role) {
            case 'admin': return <AdminDashboard />;
            case 'artisan': return <ArtisanDashboard />;
            case 'customer': return <CustomerDashboard />;
            case 'consultant': return <ConsultantDashboard />;
            default: return <div>Invalid user role</div>;
          }
        })()
      } />
      {/* Redirect any unmatched paths (e.g. /register when already signed in) back to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-200">
      <ThemeProvider>
        <LocaleProvider>
          <AuthProvider>
            <AppContent />
            <Toaster />
          </AuthProvider>
        </LocaleProvider>
      </ThemeProvider>
    </div>
  );
}
