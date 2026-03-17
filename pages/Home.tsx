import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { ArrowRight, Activity, Users, Trophy, BarChart2, Play, Zap } from 'lucide-react';
import api from '../services/api';
import { MOCK_GALLERY } from '../services/mockData';

interface GalleryItem {
  _id: string;
  title: string;
  imageUrl: string;
  description?: string;
}

export const Home = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        if (res.data.data.items.length === 0) {
          setGalleryItems(MOCK_GALLERY);
        } else {
          setGalleryItems(res.data.data.items);
        }
      } catch (error) {
        console.error('Failed to fetch gallery', error);
        setGalleryItems(MOCK_GALLERY);
      }
    };
    fetchGallery();
  }, []);
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-[#0A0F1C]">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-500 blur-[100px] rounded-full mix-blend-screen"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-medium text-sm mb-8 backdrop-blur-md">
              <Zap className="h-4 w-4" />
              <span>The Next Generation Sports Platform</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-8 leading-[1.1]">
              Elevate your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                school sports
              </span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              The all-in-one operating system for school athletics. Manage tournaments, track live scores, and empower student athletes in one unified platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-2xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/tournaments" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-lg transition-all flex items-center justify-center backdrop-blur-sm">
                <Play className="mr-2 h-5 w-5" /> View Live Events
              </Link>
            </div>
          </div>

          {/* Dashboard Preview Image */}
          <div className="mt-20 relative mx-auto max-w-5xl perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent to-transparent z-20"></div>
            <div className="relative rounded-t-3xl border border-white/10 bg-[#131C31] shadow-2xl overflow-hidden transform rotateX-12 scale-105">
              <div className="h-8 bg-[#1A2642] border-b border-white/5 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1511886929837-354d827aae26?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                alt="Students holding trophy" 
                className="w-full h-[400px] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Floating UI Elements */}
            <div className="absolute -left-12 top-20 bg-[#131C31] border border-white/10 p-4 rounded-2xl shadow-2xl z-30 animate-bounce-slow hidden md:block backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-500/20 p-3 rounded-xl">
                  <Trophy className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Championship</p>
                  <p className="text-white font-bold">Finals Today</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-8 bottom-32 bg-[#131C31] border border-white/10 p-4 rounded-2xl shadow-2xl z-30 animate-float hidden md:block backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-[#131C31] flex items-center justify-center text-white font-bold text-xs">NV</div>
                  <div className="w-10 h-10 rounded-full bg-red-500 border-2 border-[#131C31] flex items-center justify-center text-white font-bold text-xs">SP</div>
                </div>
                <div>
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Live
                  </p>
                  <p className="text-white font-bold text-xl">2 - 1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Sport Showcase */}
      <section className="py-12 bg-[#0A0F1C] overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Supporting All Major Sports</p>
        </div>
        <div className="relative flex overflow-hidden w-full pb-8 group">
          <div className="flex gap-4 animate-marquee w-max px-4">
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                {[
                  { name: 'Basketball', img: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=600&q=80' },
                  { name: 'Football', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80' },
                  { name: 'Tennis', img: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=600&q=80' },
                  { name: 'Volleyball', img: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=600&q=80' },
                  { name: 'Badminton', img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80' },
                  { name: 'Track & Field', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80' },
                ].map((sport, idx) => (
                  <div key={`${i}-${idx}`} className="w-[280px] h-[350px] relative rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 group/card">
                    <img src={sport.img} alt={sport.name} className="w-full h-full object-cover opacity-70 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent to-transparent opacity-90"></div>
                    <div className="absolute bottom-6 left-6">
                      <h3 className="text-2xl font-black text-white tracking-tight">{sport.name}</h3>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 bg-[#0A0F1C] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
              Everything you need to run <br className="hidden md:block" />
              <span className="text-slate-500">world-class tournaments.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
            {/* Large Feature */}
            <div className="md:col-span-2 bg-gradient-to-br from-[#131C31] to-[#0A0F1C] rounded-[2rem] p-10 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-colors"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="bg-blue-500/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                  <Trophy className="h-7 w-7 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4">Tournament Engine</h3>
                  <p className="text-slate-400 text-lg max-w-md">
                    Create brackets, schedule matches, and manage venues with our powerful automated engine.
                  </p>
                </div>
              </div>
            </div>

            {/* Square Feature */}
            <div className="bg-gradient-to-br from-[#131C31] to-[#0A0F1C] rounded-[2rem] p-10 border border-white/5 relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px] group-hover:bg-emerald-500/20 transition-colors"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="bg-emerald-500/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                  <Activity className="h-7 w-7 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Live Scoring</h3>
                  <p className="text-slate-400">Real-time updates straight from the referees to the fans.</p>
                </div>
              </div>
            </div>

            {/* Square Feature */}
            <div className="bg-gradient-to-br from-[#131C31] to-[#0A0F1C] rounded-[2rem] p-10 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[50px] group-hover:bg-purple-500/20 transition-colors"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="bg-purple-500/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="h-7 w-7 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Roster Management</h3>
                  <p className="text-slate-400">Easily manage student athletes, teams, and staff.</p>
                </div>
              </div>
            </div>

            {/* Large Feature */}
            <div className="md:col-span-2 bg-gradient-to-br from-[#131C31] to-[#0A0F1C] rounded-[2rem] p-10 border border-white/5 relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] group-hover:bg-orange-500/20 transition-colors"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="bg-orange-500/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                  <BarChart2 className="h-7 w-7 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4">Advanced Analytics</h3>
                  <p className="text-slate-400 text-lg max-w-md">
                    Track performance, participation rates, and historical data across all your sports programs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Big Numbers */}
      <section className="py-24 bg-emerald-500 text-[#0A0F1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-[#0A0F1C]/10">
            <div className="text-center px-4">
              <p className="text-5xl md:text-7xl font-black tracking-tighter mb-2">150+</p>
              <p className="font-bold text-[#0A0F1C]/70 uppercase tracking-widest text-sm">Active Schools</p>
            </div>
            <div className="text-center px-4">
              <p className="text-5xl md:text-7xl font-black tracking-tighter mb-2">12k</p>
              <p className="font-bold text-[#0A0F1C]/70 uppercase tracking-widest text-sm">Student Athletes</p>
            </div>
            <div className="text-center px-4">
              <p className="text-5xl md:text-7xl font-black tracking-tighter mb-2">5k+</p>
              <p className="font-bold text-[#0A0F1C]/70 uppercase tracking-widest text-sm">Matches Played</p>
            </div>
            <div className="text-center px-4">
              <p className="text-5xl md:text-7xl font-black tracking-tighter mb-2">48</p>
              <p className="font-bold text-[#0A0F1C]/70 uppercase tracking-widest text-sm">Tournaments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {galleryItems.length > 0 && (
        <section className="py-24 bg-[#0A0F1C] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
                Moments of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Glory</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Explore the best highlights from our recent tournaments and events.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.slice(0, 6).map((item) => (
                <div key={item._id} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#131C31]">
                  <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform">
                    <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity delay-100 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-32 bg-[#0A0F1C] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558365849-6ebd8b0454b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8">
            Ready to change the game?
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Join hundreds of schools already using Sports Buzz to manage their athletic programs.
          </p>
          <Link to="/contact" className="inline-flex items-center px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xl transition-all hover:scale-105 shadow-[0_0_40px_rgba(37,99,235,0.3)]">
            Request a Demo <ArrowRight className="ml-3 h-6 w-6" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};