import React, { useState, useEffect } from 'react';

import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { 
  Trophy, 
  ClipboardCheck, 
  Star, 
  Clock, 
  CheckCircle,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Award,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const RefereeDashboard = () => {
  const { user } = useAuth();
  
  const [totalMatches, setTotalMatches] = useState(0);
  const [pendingMatches, setPendingMatches] = useState(0);
  const [sports, setSports] = useState<any[]>([]);

  useEffect(() => {
      const fetchDashboardData = async () => {
          if (!user || (!user.id && !(user as any)._id)) return;
          const refereeId = user.id || (user as any)._id;
          if (!refereeId || refereeId === 'undefined') return;
          
          try {
              const res = await api.get(`/matches?refereeId=${refereeId}`);
              const matches = res.data.data.matches;
              setTotalMatches(matches.length);
              setPendingMatches(matches.filter((m: any) => m.status === 'SCHEDULED' || m.status === 'LIVE').length);
          } catch (err) {
              console.error("Matches fetch error:", err);
          }

          try {
              const sportsRes = await api.get('/sports');
              setSports(sportsRes.data.data.sports || []);
          } catch (err) {
              console.error("Sports fetch error:", err);
          }
      };
     fetchDashboardData();
  }, [user]);

  const adminRating = typeof user?.rating === 'number' ? user.rating : 0; 
  const certs = user?.certifications || [];
  const verifiedCerts = certs.filter((c: any) => c.status === 'Verified').length;
  const verificationPercent = certs.length > 0 ? Math.round((verifiedCerts / certs.length) * 100) : 100;

  // Modal States
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
  const [currentSport, setCurrentSport] = useState<any>(null);
  const [certDetailsOpen, setCertDetailsOpen] = useState(false);

  const handleOpenRules = (sport: any) => {
    setCurrentSport(sport);
    setRulesModalOpen(true);
  };
  
  return (<>
    
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Referee Analytics</h1>
        <p className="text-slate-500">Welcome back, {user?.name}.</p>
      </div>

      {/* Top Stats Row - Mobile optimized grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-l-blue-500 p-4">
          <div className="flex flex-col">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Total Matches</p>
            <div className="flex justify-between items-end mt-1">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{totalMatches}</h3>
                <Trophy className="h-5 w-5 md:h-6 md:w-6 text-blue-500 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 p-4">
          <div className="flex flex-col">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Admin Rating</p>
            <div className="flex justify-between items-end mt-1">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center">{adminRating}</h3>
                <Star className="h-5 w-5 md:h-6 md:w-6 text-yellow-500 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-green-500 p-4">
          <div className="flex flex-col">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Verification</p>
            <div className="flex justify-between items-end mt-1">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{verificationPercent}%</h3>
                <ClipboardCheck className="h-5 w-5 md:h-6 md:w-6 text-green-500 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-purple-500 p-4">
           <div className="flex flex-col">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Pending</p>
            <div className="flex justify-between items-end mt-1">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{pendingMatches}</h3>
                <Clock className="h-5 w-5 md:h-6 md:w-6 text-purple-500 opacity-50" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column: Rulebooks */}
        <div className="lg:col-span-2 space-y-6">
             {/* Official Rulebooks CTAs */}
             <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-slate-500" /> Official Rulebooks
                </h3>
                <p className="text-sm text-slate-500 mb-4">Quick access to the latest regulations and scoring guidelines.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sports.map((sport) => (
                      <button
                        key={sport._id}
                        onClick={() => handleOpenRules(sport)}
                        className="flex flex-col items-start p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all group text-left h-full"
                      >
                          <div className="p-2 bg-slate-50 text-slate-600 rounded-lg mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <span className="text-xl">{sport.icon || '🏆'}</span>
                          </div>
                          <h4 className="font-bold text-slate-900">{sport.name}</h4>
                          <p className="text-xs text-slate-500 mt-1 flex-1">
                            {sport.rules && sport.rules.length > 0 ? `${sport.rules.length} Regulations` : 'Regulations Available'}
                          </p>
                          <div className="mt-4 text-xs font-bold text-blue-600 flex items-center bg-blue-50 px-2 py-1 rounded group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              View Rules <ChevronRight className="h-3 w-3 ml-1" />
                          </div>
                      </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Column: Certifications */}
        <div className="space-y-6">
             <Card title="My Certifications">
                 <div className="space-y-4">
                     {certs.length > 0 ? (
                         certs.map((cert: any, i: number) => (
                             <div key={i} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                 <div className="mt-1">
                                     <CheckCircle className={`h-4 w-4 ${cert.status === 'Verified' ? 'text-green-500' : 'text-orange-500'}`} />
                                 </div>
                                 <div>
                                     <p className="text-sm font-bold text-slate-900">{cert.name}</p>
                                     <p className="text-xs text-slate-500">{cert.status}</p>
                                 </div>
                             </div>
                         ))
                     ) : (
                         <div className="text-sm text-slate-500 text-center py-4">No certifications added.</div>
                     )}
                     <button 
                        onClick={() => setCertDetailsOpen(true)}
                        className="w-full py-2 text-xs text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center"
                    >
                        View All Details <ExternalLink className="h-3 w-3 ml-1" />
                     </button>
                 </div>
             </Card>
        </div>
      </div>

      {/* Rules Modal */}
      <Modal 
        isOpen={rulesModalOpen} 
        onClose={() => setRulesModalOpen(false)}
        title={`${currentSport?.name || ''} Rules & Regulations`}
      >
        <div className="prose prose-sm max-w-none text-slate-600">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="font-bold text-blue-900">Official Regulations</p>
                <p className="text-blue-700">Ensure to enforce these rules thoroughly.</p>
            </div>
            <ul className="space-y-4 mt-4">
                {currentSport?.rules && currentSport.rules.length > 0 ? (
                  currentSport.rules.map((rule: string, i: number) => (
                    <li key={i} className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold mr-3 text-slate-600 border border-slate-200">
                          {i + 1}
                        </span>
                        <span>{rule}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-slate-500 mt-2">No specific rules found in the system. Use standard international regulations.</p>
                )}
            </ul>
        </div>
      </Modal>

      {/* All Certifications Details Modal */}
      <Modal
        isOpen={certDetailsOpen}
        onClose={() => setCertDetailsOpen(false)}
        title="My Certifications (Full Details)"
      >
        <div className="space-y-4">
            {certs.length > 0 ? certs.map((cert: any, i: number) => {
                const isVerified = cert.status === 'Verified';
                return (
                    <div key={i} className={`p-4 bg-white border ${isVerified ? 'border-green-200 ring-1 ring-green-100' : 'border-yellow-200 ring-1 ring-yellow-100'} rounded-xl shadow-sm`}>
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-3">
                                 <div className={`p-2 ${isVerified ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'} rounded-lg`}>
                                    <Award className="h-6 w-6" />
                                 </div>
                                 <div>
                                     <h4 className="font-bold text-slate-900">{cert.name}</h4>
                                     <p className="text-xs text-slate-500">{cert.authority || 'Issuing Authority'}</p>
                                 </div>
                            </div>
                            <span className={`px-2 py-1 ${isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} text-xs font-bold rounded uppercase`}>{cert.status}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-100 text-sm">
                            <div>
                                <span className="text-slate-400 text-xs block uppercase font-semibold">License ID</span>
                                <span className="font-mono text-slate-900">{cert.licenseId || 'N/A'}</span>
                            </div>
                             <div>
                                <span className="text-slate-400 text-xs block uppercase font-semibold">Valid Until</span>
                                <div className="flex items-center text-slate-900">
                                    <Calendar className="h-3 w-3 mr-1 text-slate-400" /> 
                                    {cert.validUntil ? new Date(cert.validUntil).toLocaleDateString() : 'Lifetime'}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }) : (
                <div className="text-sm text-slate-500 text-center py-4">No certifications added.</div>
            )}
        </div>
      </Modal></>
    
  );
};