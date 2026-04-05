import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Lock, Mail, Key, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export const Login = () => {
  const { login, user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      switch (user.role) {
        case UserRole.ADMIN:
          navigate('/admin/dashboard');
          break;
        case UserRole.SCHOOL:
          navigate('/school/dashboard');
          break;
        case UserRole.REFEREE:
          navigate('/referee/dashboard');
          break;
        case UserRole.STUDENT:
          navigate('/student/dashboard');
          break;
        default:
          navigate('/');
      }
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      switch (user.role) {
        case UserRole.ADMIN:
          navigate('/admin/dashboard');
          break;
        case UserRole.SCHOOL:
          navigate('/school/dashboard');
          break;
        case UserRole.REFEREE:
          navigate('/referee/dashboard');
          break;
        case UserRole.STUDENT:
          navigate('/student/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error(error);
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        setEmail('admin@sportsbuzz.com');
        setPassword('password123');
        break;
      case UserRole.SCHOOL:
        setEmail('school@springfield.edu');
        setPassword('password123');
        break;
      case UserRole.REFEREE:
        setEmail('referee@sportsbuzz.com');
        setPassword('password123');
        break;
      case UserRole.STUDENT:
        setEmail('student@springfield.edu');
        setPassword('password123');
        break;
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-slate-600">
              Enter your credentials or use a demo account below.
            </p>
          </div>
          
          <Card className="p-6 space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or try a demo account</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button 
                onClick={() => handleDemoLogin(UserRole.SCHOOL)} 
                variant="outline"
                className="text-xs"
              >
                School Demo
              </Button>
              <Button 
                onClick={() => handleDemoLogin(UserRole.REFEREE)} 
                variant="outline"
                className="text-xs"
              >
                Referee Demo
              </Button>
              <Button 
                onClick={() => handleDemoLogin(UserRole.STUDENT)} 
                variant="outline"
                className="text-xs"
              >
                Student Demo
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
};