import React from 'react';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Users, Target, Globe, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
                Building the <br />
                <span className="text-blue-500">future</span> of <br />
                school sports.
              </h1>
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                We believe that every student athlete deserves a professional platform to showcase their talent, and every school deserves the tools to manage them effortlessly.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-12 h-12 rounded-full border-2 border-slate-900" alt="User" />
                  ))}
                </div>
                <p className="text-sm font-bold text-slate-400">Trusted by 150+ schools</p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-[3rem] transform rotate-3 scale-105 opacity-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Team huddle" 
                className="rounded-[3rem] shadow-2xl relative z-10 object-cover h-[600px] w-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 md:flex justify-between items-end">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight max-w-2xl">
              Our core values drive everything we build.
            </h2>
            <Link to="/contact" className="hidden md:inline-flex items-center font-bold text-blue-400 hover:text-blue-300 transition-colors">
              Get in touch <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Target, title: 'Precision', desc: 'Accurate data tracking and verified results for every match.' },
              { icon: Globe, title: 'Community', desc: 'Building a network of schools, coaches, and athletes.' },
              { icon: Users, title: 'Collaboration', desc: 'Seamless tools for admins, referees, and students.' },
              { icon: Award, title: 'Excellence', desc: 'Celebrating achievements and fostering growth.' }
            ].map((val, i) => (
              <div key={i} className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:bg-slate-800 transition-colors">
                <div className="h-14 w-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <val.icon className="h-7 w-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{val.title}</h3>
                <p className="text-slate-400 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
