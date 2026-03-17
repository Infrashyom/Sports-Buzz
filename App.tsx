import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserRole } from './types';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { PublicTournaments } from './pages/PublicTournaments';
import { Gallery } from './pages/Gallery';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminGallery } from './pages/admin/AdminGallery';
import { SchoolManagement } from './pages/admin/SchoolManagement';
import { SportsConfig } from './pages/admin/SportsConfig';
import { TournamentManagement } from './pages/admin/TournamentManagement';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminQueries } from './pages/admin/AdminQueries';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminSettings } from './pages/admin/AdminSettings';
import { SchoolDashboard } from './pages/school/SchoolDashboard';
import { SchoolProfile } from './pages/school/SchoolProfile';
import { StudentManagement } from './pages/school/StudentManagement';
import { TeamManagement } from './pages/school/TeamManagement';
import { SchoolFixtures } from './pages/school/SchoolFixtures';
import { SchoolStaff } from './pages/school/SchoolStaff';
import { SchoolTournaments } from './pages/school/SchoolTournaments';
import { RefereeDashboard } from './pages/referee/RefereeDashboard';
import { RefereeMatches } from './pages/referee/RefereeMatches';
import { RefereeProfile } from './pages/referee/RefereeProfile';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentTeams } from './pages/student/StudentTeams';
import { StudentMatches } from './pages/student/StudentMatches';

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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/tournaments" element={<PublicTournaments />} />
      <Route path="/login" element={<Login />} />
      
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
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}