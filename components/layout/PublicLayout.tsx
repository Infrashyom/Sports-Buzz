import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Menu, X } from 'lucide-react';

export const PublicLayout = ({ children }: { children?: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [logoUrl, setLogoUrl] = React.useState('');
  const [platformName, setPlatformName] = React.useState('Sports Buzz');
  const location = useLocation();

  React.useEffect(() => {
    const savedContact = localStorage.getItem('sportsBuzzContact');
    if (savedContact) {
      const parsed = JSON.parse(savedContact);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (parsed.logoUrl) setLogoUrl(parsed.logoUrl);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (parsed.platformName) setPlatformName(parsed.platformName);
    }
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Tournaments', path: '/tournaments' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pointer-events-none">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/40 backdrop-blur-xl shadow-lg shadow-slate-200/20 rounded-full border border-white/30 px-6 py-3 flex justify-between items-center pointer-events-auto">
            <Link to="/" className="flex items-center space-x-2 group">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="bg-blue-600 p-2 rounded-full group-hover:bg-blue-700 transition-colors">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
              )}
              <span className="text-xl font-black tracking-tight text-slate-900">{platformName}</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={`px-4 py-2 text-sm font-bold rounded-full transition-all ${
                    isActive(link.path) 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="hidden md:block">
              <Link to="/login">
                <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-md">
                  Portal Login
                </button>
              </Link>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 mx-auto max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-4 pointer-events-auto">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={`px-4 py-3 font-bold rounded-xl ${
                    isActive(link.path)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/login" className="px-4 py-3 bg-blue-600 text-white font-black rounded-xl text-center mt-2 shadow-md">Portal Login</Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-8 w-8 rounded-lg object-cover" />
                ) : (
                  <div className="bg-blue-600 p-1.5 rounded-lg">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                )}
                <span className="text-xl font-black text-white tracking-tight">{platformName}</span>
              </div>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                The next-generation platform for school sports management, tournament organization, and athlete tracking.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Quick Links</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/tournaments" className="text-slate-400 hover:text-white transition-colors">Live Tournaments</Link></li>
                <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Portals</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors">School Admin Login</Link></li>
                <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors">Referee Portal</Link></li>
                <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors">Student Dashboard</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center font-medium">
            <p>© {new Date().getFullYear()} {platformName}. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};