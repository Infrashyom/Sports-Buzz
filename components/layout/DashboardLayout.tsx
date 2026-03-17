import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  School, 
  Users, 
  Calendar, 
  Trophy, 
  LogOut, 
  ClipboardCheck, 
  BarChart2,
  Settings,
  Shirt,
  Dumbbell,
  Menu,
  X,
  User,
  Briefcase,
  Camera,
  Key
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

const NavItem = ({ to, icon: Icon, label, onClick }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
};

export const DashboardLayout = ({ children }: { children?: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [platformName, setPlatformName] = useState('Sports Buzz');

  useEffect(() => {
    const savedContact = localStorage.getItem('sportsBuzzContact');
    if (savedContact) {
      const parsed = JSON.parse(savedContact);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (parsed.logoUrl) setLogoUrl(parsed.logoUrl);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (parsed.platformName) setPlatformName(parsed.platformName);
    }
  }, []);

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      toast.success("Profile picture updated successfully.");
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwordData.new.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    toast.success("Password changed successfully.");
    setIsProfileModalOpen(false);
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  // Close mobile menu when route changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center">
             {logoUrl ? (
               <img src={logoUrl} alt="Logo" className="h-8 w-8 mr-2 rounded-md object-cover" />
             ) : (
               <Trophy className="h-6 w-6 text-blue-600 mr-2" />
             )}
             <span className="text-xl font-bold text-slate-900">{platformName}</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-md focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col
        transform transition-transform duration-300 ease-in-out shadow-xl md:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:sticky md:top-0 md:h-screen
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-200 bg-slate-50">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-8 w-8 mr-2 rounded-md object-cover" />
          ) : (
            <Trophy className="h-6 w-6 text-blue-600 mr-2" />
          )}
          <span className="text-xl font-bold text-slate-900">{platformName}</span>
        </div>
        
        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {user?.role === UserRole.ADMIN && (
            <>
              <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Platform
              </div>
              <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Overview" onClick={closeMobileMenu} />
              <NavItem to="/admin/schools" icon={School} label="Schools" onClick={closeMobileMenu} />
              <NavItem to="/admin/users" icon={Users} label="Users & Referees" onClick={closeMobileMenu} />
              
              <div className="px-4 py-2 mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Configuration
              </div>
              <NavItem to="/admin/sports" icon={Dumbbell} label="Sports Config" onClick={closeMobileMenu} />
              <NavItem to="/admin/tournaments" icon={Trophy} label="Tournaments" onClick={closeMobileMenu} />
              <NavItem to="/admin/gallery" icon={Trophy} label="Gallery" onClick={closeMobileMenu} />
              <NavItem to="/admin/queries" icon={Briefcase} label="Contact Queries" onClick={closeMobileMenu} />
              <NavItem to="/admin/analytics" icon={BarChart2} label="Analytics" onClick={closeMobileMenu} />
              <NavItem to="/admin/settings" icon={Settings} label="Settings" onClick={closeMobileMenu} />
            </>
          )}

          {user?.role === UserRole.SCHOOL && (
            <>
              <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Management
              </div>
              <NavItem to="/school/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={closeMobileMenu} />
              <NavItem to="/school/profile" icon={School} label="School Profile" onClick={closeMobileMenu} />
              <NavItem to="/school/students" icon={Users} label="Student Athletes" onClick={closeMobileMenu} />
              <NavItem to="/school/teams" icon={Shirt} label="Teams" onClick={closeMobileMenu} />
              <NavItem to="/school/staff" icon={Briefcase} label="Staff (Ref/Coach)" onClick={closeMobileMenu} />
              
              <div className="px-4 py-2 mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Competition
              </div>
              <NavItem to="/school/fixtures" icon={Calendar} label="Matches & Results" onClick={closeMobileMenu} />
              <NavItem to="/school/tournaments" icon={Trophy} label="Tournaments" onClick={closeMobileMenu} />
            </>
          )}

          {user?.role === UserRole.REFEREE && (
            <>
              <NavItem to="/referee/dashboard" icon={LayoutDashboard} label="Stats & Overview" onClick={closeMobileMenu} />
              <NavItem to="/referee/matches" icon={ClipboardCheck} label="Match Management" onClick={closeMobileMenu} />
              <NavItem to="/admin/tournaments" icon={Trophy} label="Tournaments & Points" onClick={closeMobileMenu} />
              <NavItem to="/referee/profile" icon={User} label="My Profile" onClick={closeMobileMenu} />
            </>
          )}

          {user?.role === UserRole.STUDENT && (
            <>
              <NavItem to="/student/dashboard" icon={LayoutDashboard} label="My Stats" onClick={closeMobileMenu} />
              <NavItem to="/student/teams" icon={Shirt} label="My Teams" onClick={closeMobileMenu} />
              <NavItem to="/student/matches" icon={Calendar} label="Match Schedule" onClick={closeMobileMenu} />
            </>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div 
            className="flex items-center space-x-3 mb-4 px-2 cursor-pointer hover:bg-slate-100 p-2 rounded-lg transition-colors"
            onClick={() => setIsProfileModalOpen(true)}
          >
            <img 
              src={avatarUrl || "https://ui-avatars.com/api/?name=" + (user?.name || 'User') + "&background=random"} 
              alt="Profile" 
              className="h-9 w-9 rounded-full bg-white border border-slate-200 object-cover" 
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user?.role.toLowerCase()}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-slate-600 hover:text-red-600 px-2 py-2 w-full text-left rounded-md hover:bg-slate-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 w-full min-w-0 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Profile Settings Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Profile Settings"
      >
        <div className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200">
            <div className="relative mb-4">
              <img 
                src={avatarUrl || "https://ui-avatars.com/api/?name=" + (user?.name || 'User') + "&background=random"} 
                alt="Profile" 
                className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{user?.name}</h3>
            <p className="text-sm text-slate-500 capitalize">{user?.role.toLowerCase()}</p>
          </div>

          {/* Change Password */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-md font-bold text-slate-900 mb-4 flex items-center">
              <Key className="h-4 w-4 mr-2 text-slate-500" /> Change Password
            </h4>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Current Password</label>
                <input 
                  type="password" 
                  required
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">New Password</label>
                <input 
                  type="password" 
                  required
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  required
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <Button type="submit" className="w-full mt-2">Update Password</Button>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};
