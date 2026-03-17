import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { MOCK_MATCHES } from '../../services/mockData';
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

export const RefereeDashboard = () => {
  const { user } = useAuth();
  
  // Stats
  const totalMatches = MOCK_MATCHES.length; 
  const pendingMatches = MOCK_MATCHES.filter(m => m.status === 'SCHEDULED' || m.status === 'LIVE').length;
  const adminRating = 4.8; 

  // Modal States
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
  const [currentRuleSport, setCurrentRuleSport] = useState('');
  const [certDetailsOpen, setCertDetailsOpen] = useState(false);

  const handleOpenRules = (sport: string) => {
    setCurrentRuleSport(sport);
    setRulesModalOpen(true);
  };
  
  return (
    <DashboardLayout>
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
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900">98%</h3>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                        onClick={() => handleOpenRules('Cricket')}
                        className="flex flex-col items-start p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all group text-left h-full"
                    >
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <span className="text-xl">🏏</span>
                        </div>
                        <h4 className="font-bold text-slate-900">Cricket</h4>
                        <p className="text-xs text-slate-500 mt-1 flex-1">T20 & One Day Regulations</p>
                        <div className="mt-4 text-xs font-bold text-blue-600 flex items-center bg-blue-50 px-2 py-1 rounded group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            View Rules <ChevronRight className="h-3 w-3 ml-1" />
                        </div>
                    </button>

                    <button 
                        onClick={() => handleOpenRules('Basketball')}
                        className="flex flex-col items-start p-4 bg-white border border-slate-200 rounded-xl hover:border-orange-500 hover:shadow-md transition-all group text-left h-full"
                    >
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg mb-3 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <span className="text-xl">🏀</span>
                        </div>
                        <h4 className="font-bold text-slate-900">Basketball</h4>
                        <p className="text-xs text-slate-500 mt-1 flex-1">FIBA Standard Rules</p>
                        <div className="mt-4 text-xs font-bold text-orange-600 flex items-center bg-orange-50 px-2 py-1 rounded group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            View Rules <ChevronRight className="h-3 w-3 ml-1" />
                        </div>
                    </button>

                    <button 
                        onClick={() => handleOpenRules('Badminton')}
                        className="flex flex-col items-start p-4 bg-white border border-slate-200 rounded-xl hover:border-green-500 hover:shadow-md transition-all group text-left h-full"
                    >
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg mb-3 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <span className="text-xl">🏸</span>
                        </div>
                        <h4 className="font-bold text-slate-900">Badminton</h4>
                        <p className="text-xs text-slate-500 mt-1 flex-1">BWF Scoring System</p>
                        <div className="mt-4 text-xs font-bold text-green-600 flex items-center bg-green-50 px-2 py-1 rounded group-hover:bg-green-600 group-hover:text-white transition-colors">
                            View Rules <ChevronRight className="h-3 w-3 ml-1" />
                        </div>
                    </button>
                </div>
            </div>
        </div>

        {/* Right Column: Certifications */}
        <div className="space-y-6">
             <Card title="My Certifications">
                 <div className="space-y-4">
                     <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                         <div className="mt-1">
                             <CheckCircle className="h-4 w-4 text-green-500" />
                         </div>
                         <div>
                             <p className="text-sm font-bold text-slate-900">Level 2 Cricket Umpire</p>
                             <p className="text-xs text-slate-500">Valid until Dec 2024</p>
                         </div>
                     </div>
                     <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                         <div className="mt-1">
                             <CheckCircle className="h-4 w-4 text-green-500" />
                         </div>
                         <div>
                             <p className="text-sm font-bold text-slate-900">State Basketball Ref</p>
                             <p className="text-xs text-slate-500">Valid until Mar 2025</p>
                         </div>
                     </div>
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
        title={`${currentRuleSport} Rules & Regulations`}
      >
        <div className="prose prose-sm max-w-none text-slate-600">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="font-bold text-blue-900">Official Regulations 2024</p>
                <p className="text-blue-700">These rules are effective for the current academic session.</p>
            </div>
            <ul className="space-y-4 mt-4">
                <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold mr-3 text-slate-600 border border-slate-200">1</span>
                    <span><strong>Equipment Check:</strong> All equipment must be checked by the referee 15 minutes prior to start.</span>
                </li>
                <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold mr-3 text-slate-600 border border-slate-200">2</span>
                    <span><strong>Rosters:</strong> Teams must have full rosters present. Late arrival ({'>'}15 mins) results in immediate forfeit.</span>
                </li>
                {currentRuleSport === 'Cricket' && (
                    <>
                        <li className="flex items-start">
                            <span className="flex-shrink-0 h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold mr-3 text-slate-600 border border-slate-200">3</span>
                            <span><strong>Powerplay:</strong> T20 Format includes a mandatory powerplay for the first 6 overs.</span>
                        </li>
                    </>
                )}
                 {currentRuleSport === 'Basketball' && (
                    <>
                        <li className="flex items-start">
                            <span className="flex-shrink-0 h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold mr-3 text-slate-600 border border-slate-200">3</span>
                            <span><strong>Timeouts:</strong> Each team is allowed two timeouts per half.</span>
                        </li>
                    </>
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
            {/* Active Certs */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-3">
                         <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <Award className="h-6 w-6" />
                         </div>
                         <div>
                             <h4 className="font-bold text-slate-900">Level 2 Cricket Umpire</h4>
                             <p className="text-xs text-slate-500">State Cricket Association</p>
                         </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase">Active</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-100 text-sm">
                    <div>
                        <span className="text-slate-400 text-xs block uppercase font-semibold">License ID</span>
                        <span className="font-mono text-slate-900">UMP-2022-8821</span>
                    </div>
                     <div>
                        <span className="text-slate-400 text-xs block uppercase font-semibold">Valid Until</span>
                        <div className="flex items-center text-slate-900">
                            <Calendar className="h-3 w-3 mr-1 text-slate-400" /> Dec 31, 2024
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-3">
                         <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <Award className="h-6 w-6" />
                         </div>
                         <div>
                             <h4 className="font-bold text-slate-900">State Basketball Referee</h4>
                             <p className="text-xs text-slate-500">National Basketball Federation</p>
                         </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase">Active</span>
                </div>
                 <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-100 text-sm">
                    <div>
                        <span className="text-slate-400 text-xs block uppercase font-semibold">License ID</span>
                        <span className="font-mono text-slate-900">NBF-REF-091</span>
                    </div>
                     <div>
                        <span className="text-slate-400 text-xs block uppercase font-semibold">Valid Until</span>
                        <div className="flex items-center text-slate-900">
                            <Calendar className="h-3 w-3 mr-1 text-slate-400" /> Mar 15, 2025
                        </div>
                    </div>
                </div>
            </div>

             {/* Expiring Certs */}
             <div className="p-4 bg-white border border-yellow-200 rounded-xl shadow-sm ring-1 ring-yellow-100">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-3">
                         <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                            <Award className="h-6 w-6" />
                         </div>
                         <div>
                             <h4 className="font-bold text-slate-900">Standard First Aid</h4>
                             <p className="text-xs text-slate-500">Red Cross Society</p>
                         </div>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded uppercase">Expiring</span>
                </div>
                 <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-100 text-sm">
                    <div>
                        <span className="text-slate-400 text-xs block uppercase font-semibold">License ID</span>
                        <span className="font-mono text-slate-900">MED-FA-2020</span>
                    </div>
                     <div>
                        <span className="text-slate-400 text-xs block uppercase font-semibold">Valid Until</span>
                        <div className="flex items-center text-red-600 font-bold">
                            <Calendar className="h-3 w-3 mr-1" /> Expiring in 14 days
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};