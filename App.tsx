import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserRole } from './types';
import { DashboardLayout } from './components/layout/DashboardLayout';

const Home = React.lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const About = React.lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Contact = React.lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const PublicTournaments = React.lazy(() => import('./pages/PublicTournaments').then(m => ({ default: m.PublicTournaments })));
const Gallery = React.lazy(() => import('./pages/Gallery').then(m => ({ default: m.Gallery })));
const Login = React.lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));

const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminGallery = React.lazy(() => import('./pages/admin/AdminGallery').then(m => ({ default: m.AdminGallery })));
const SchoolManagement = React.lazy(() => import('./pages/admin/SchoolManagement').then(m => ({ default: m.SchoolManagement })));
const SportsConfig = React.lazy(() => import('./pages/admin/SportsConfig').then(m => ({ default: m.SportsConfig })));
const TournamentManagement = React.lazy(() => import('./pages/admin/TournamentManagement').then(m => ({ default: m.TournamentManagement })));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers').then(m => ({ default: m.AdminUsers })));
const AdminQueries = React.lazy(() => import('./pages/admin/AdminQueries').then(m => ({ default: m.AdminQueries })));
const AdminAnalytics = React.lazy(() => import('./pages/admin/AdminAnalytics').then(m => ({ default: m.AdminAnalytics })));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));

const SchoolDashboard = React.lazy(() => import('./pages/school/SchoolDashboard').then(m => ({ default: m.SchoolDashboard })));
const SchoolProfile = React.lazy(() => import('./pages/school/SchoolProfile').then(m => ({ default: m.SchoolProfile })));
const StudentManagement = React.lazy(() => import('./pages/school/StudentManagement').then(m => ({ default: m.StudentManagement })));
const TeamManagement = React.lazy(() => import('./pages/school/TeamManagement').then(m => ({ default: m.TeamManagement })));
const SchoolFixtures = React.lazy(() => import('./pages/school/SchoolFixtures').then(m => ({ default: m.SchoolFixtures })));
const SchoolStaff = React.lazy(() => import('./pages/school/SchoolStaff').then(m => ({ default: m.SchoolStaff })));
const SchoolTournaments = React.lazy(() => import('./pages/school/SchoolTournaments').then(m => ({ default: m.SchoolTournaments })));

const RefereeDashboard = React.lazy(() => import('./pages/referee/RefereeDashboard').then(m => ({ default: m.RefereeDashboard })));
const RefereeMatches = React.lazy(() => import('./pages/referee/RefereeMatches').then(m => ({ default: m.RefereeMatches })));
const RefereeProfile = React.lazy(() => import('./pages/referee/RefereeProfile').then(m => ({ default: m.RefereeProfile })));

const StudentDashboard = React.lazy(() => import('./pages/student/StudentDashboard').then(m => ({ default: m.StudentDashboard })));
const StudentTeams = React.lazy(() => import('./pages/student/StudentTeams').then(m => ({ default: m.StudentTeams })));
const StudentMatches = React.lazy(() => import('./pages/student/StudentMatches').then(m => ({ default: m.StudentMatches })));

const useDynamicFavicon = () => {
  useEffect(() => {
    const updateFavicon = () => {
      const savedContact = localStorage.getItem('sportsBuzzContact');
      if (savedContact) {
        try {
          const parsed = JSON.parse(savedContact);
          if (parsed.logoUrl) {
            let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.head.appendChild(link);
            }
            link.href = parsed.logoUrl;
          }
        } catch (e) {
          console.error("Error parsing sportsBuzzContact for favicon", e);
        }
      }
    };

    updateFavicon();
    window.addEventListener('logoUpdated', updateFavicon);
    return () => window.removeEventListener('logoUpdated', updateFavicon);
  }, []);
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children?: React.ReactNode, allowedRoles?: UserRole[] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const DashboardLayoutWrapper = () => {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="flex items-center justify-center h-[calc(100vh-4rem)]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
        <Outlet />
      </Suspense>
    </DashboardLayout>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
          <Outlet />
        </Suspense>
      }>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tournaments" element={<PublicTournaments />} />
        <Route path="/login" element={<Login />} />
      </Route>
      
      {/* Authenticated Routes */}
      <Route element={<DashboardLayoutWrapper />}>
        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      <Route 
        path="/admin/schools" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <SchoolManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminUsers />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/sports" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <SportsConfig />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/tournaments" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.REFEREE]}>
            <TournamentManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/gallery" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminGallery />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/queries" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminQueries />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/analytics" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminAnalytics />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/settings" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminSettings />
          </ProtectedRoute>
        } 
      />
      <Route path="/admin/*" element={<Navigate to="/admin/dashboard" />} />

      {/* School Routes */}
      <Route 
        path="/school/dashboard" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.SCHOOL]}>
            <SchoolDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/school/profile" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.SCHOOL]}>
            <SchoolProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/school/students" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.SCHOOL]}>
            <StudentManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/school/teams" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.SCHOOL]}>
            <TeamManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/school/fixtures" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.SCHOOL]}>
            <SchoolFixtures />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/school/staff" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.SCHOOL]}>
            <SchoolStaff />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/school/tournaments" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.SCHOOL]}>
            <SchoolTournaments />
          </ProtectedRoute>
        } 
      />
      <Route path="/school/*" element={<Navigate to="/school/dashboard" />} />

      {/* Referee Routes */}
      <Route 
        path="/referee/dashboard" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.REFEREE]}>
            <RefereeDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/referee/matches" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.REFEREE]}>
            <RefereeMatches />
          </ProtectedRoute>
        } 
      />
       <Route 
        path="/referee/profile" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.REFEREE]}>
            <RefereeProfile />
          </ProtectedRoute>
        } 
      />
      <Route path="/referee/*" element={<Navigate to="/referee/dashboard" />} />

      {/* Student Routes */}
      <Route 
        path="/student/dashboard" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/matches" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
            <StudentMatches />
          </ProtectedRoute>
        } 
      />
       <Route 
        path="/student/teams" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
             <StudentTeams />
          </ProtectedRoute>
        } 
      />
      <Route path="/student/*" element={<Navigate to="/student/dashboard" />} />
      </Route>
    </Routes>
  );
};

export default function App() {
  useDynamicFavicon();

  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}