import React, { useState, useEffect, useCallback } from 'react';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { MapPin, Clock, Search, Filter, AlertCircle, CheckCircle, FileText, ChevronRight, ChevronLeft, Eye } from 'lucide-react';
import { Match } from '../../types';
import { MatchDetailModal } from '../../components/fixtures/MatchDetailModal';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const InputField = ({ placeholder, label, value, onChange }: { placeholder: string, label: string, value: string | number, onChange: (val: string) => void }) => (
    <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase">{label}</label>
        <input 
            type="number" 
            placeholder={placeholder} 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 placeholder-slate-400" 
        />
    </div>
);

const ScoreInput = ({ match, scoreData, setScoreData }: { match: Match, scoreData: any, setScoreData: (data: any) => void }) => {
    const updateField = (field: string, value: any) => {
        setScoreData({ ...scoreData, [field]: value });
    };

    const updateDetail = (field: string, value: any) => {
        setScoreData({ ...scoreData, details: { ...scoreData.details, [field]: value } });
    };

    if (match.sport === 'Cricket') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 md:p-6 rounded-xl border border-slate-200">
                <div className="space-y-4">
                    <div className="font-bold text-lg text-slate-900 border-b border-slate-200 pb-2">{typeof match.teamA === 'string' ? match.teamA : (match.teamA as any).name}</div>
                    <InputField label="Runs" placeholder="0" value={scoreData.scoreA || ''} onChange={(val) => updateField('scoreA', val)} />
                    <InputField label="Wickets" placeholder="0" value={scoreData.details?.wicketsA || ''} onChange={(val) => updateDetail('wicketsA', val)} />
                    <div className="space-y-1">
                         <label className="text-xs font-semibold text-slate-500 uppercase">Overs</label>
                         <input type="text" placeholder="0.0" value={scoreData.details?.overs || ''} onChange={(e) => updateDetail('overs', e.target.value)} className="w-full p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"/>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="font-bold text-lg text-slate-900 border-b border-slate-200 pb-2">{typeof match.teamB === 'string' ? match.teamB : (match.teamB as any).name}</div>
                    <InputField label="Runs" placeholder="0" value={scoreData.scoreB || ''} onChange={(val) => updateField('scoreB', val)} />
                    <InputField label="Wickets" placeholder="0" value={scoreData.details?.wicketsB || ''} onChange={(val) => updateDetail('wicketsB', val)} />
                </div>
            </div>
        )
    }
    if (match.sport === 'Badminton') {
        return (
            <div className="bg-slate-50 p-4 md:p-6 rounded-xl border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div className="space-y-4">
                        <div className="font-bold text-lg text-slate-900 border-b border-slate-200 pb-2">{typeof match.teamA === 'string' ? match.teamA : (match.teamA as any).name}</div>
                        <InputField label="Sets Won" placeholder="0" value={scoreData.scoreA || ''} onChange={(val) => updateField('scoreA', val)} />
                    </div>
                    <div className="space-y-4">
                        <div className="font-bold text-lg text-slate-900 border-b border-slate-200 pb-2">{typeof match.teamB === 'string' ? match.teamB : (match.teamB as any).name}</div>
                        <InputField label="Sets Won" placeholder="0" value={scoreData.scoreB || ''} onChange={(val) => updateField('scoreB', val)} />
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Set Scores (Comma separated)</label>
                    <input type="text" placeholder="21-19, 15-21, 21-10" value={scoreData.details?.quarters || ''} onChange={(e) => updateDetail('quarters', e.target.value)} className="w-full p-2 mt-1 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-slate-900" />
                </div>
            </div>
        )
    }
    // Default 
    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 py-8 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-center w-full md:w-auto">
                <label className="block text-sm font-bold text-slate-900 mb-3">{typeof match.teamA === 'string' ? match.teamA : (match.teamA as any).name}</label>
                <input type="number" className="w-24 h-24 text-center text-4xl font-bold bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all mx-auto text-slate-900" placeholder="0" value={scoreData.scoreA || ''} onChange={(e) => updateField('scoreA', e.target.value)} />
            </div>
            <span className="hidden md:inline-block text-4xl font-bold text-slate-300">-</span>
            <div className="text-center w-full md:w-auto">
                <label className="block text-sm font-bold text-slate-900 mb-3">{typeof match.teamB === 'string' ? match.teamB : (match.teamB as any).name}</label>
                <input type="number" className="w-24 h-24 text-center text-4xl font-bold bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all mx-auto text-slate-900" placeholder="0" value={scoreData.scoreB || ''} onChange={(e) => updateField('scoreB', e.target.value)} />
            </div>
        </div>
    );
};


export const RefereeMatches = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'PENDING' | 'HISTORY'>('PENDING');
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('All');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null); 
  const [reportMatch, setReportMatch] = useState<Match | null>(null); 
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
  const [currentRuleSport, setCurrentRuleSport] = useState<any>(null);
  const [sports, setSports] = useState<any[]>([]);
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scoreData, setScoreData] = useState<any>({ details: {} });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMatches = useCallback(async () => {
      if (!user) return;
      const refereeId = user.id || (user as any)._id;
      if (!refereeId || refereeId === 'undefined') return;
      try {
          const res = await api.get(`/matches?refereeId=${refereeId}`);
          const transformed = res.data.data.matches.map((m: any) => ({
              ...m,
              id: m._id,
              teamA: m.teamA?.name || m.teamA,
              teamB: m.teamB?.name || m.teamB
          }));
          setMatches(transformed);
      } catch {
          toast.error("Failed to load matches");
      } finally {
          setIsLoading(false);
      }
  }, [user]);

  useEffect(() => {
     if (user && (user.id || (user as any)._id)) {
        fetchMatches();
     }
     fetchSports();
  }, [user, fetchMatches]);

  const fetchSports = async () => {
      try {
          const res = await api.get('/sports');
          setSports(res.data.data.sports || []);
      } catch (err) {
          console.error(err);
      }
  };

  const handleOpenScoreModal = (match: Match) => {
      setSelectedMatch(match);
      setScoreData({
          scoreA: match.scoreA || '',
          scoreB: match.scoreB || '',
          details: match.details || {}
      });
  };

  const handleVerifyAndSubmit = async () => {
      if (!selectedMatch) return;
      setIsSubmitting(true);
      try {
          // Send updated score
          await api.patch(`/matches/${selectedMatch.id}`, {
              scoreA: Number(scoreData.scoreA),
              scoreB: Number(scoreData.scoreB),
              details: scoreData.details,
              status: 'VERIFIED'
          });
          toast.success("Result verified and submitted!");
          setSelectedMatch(null);
          // Refresh
          fetchMatches();
      } catch {
          toast.error("Failed to submit result");
      } finally {
          setIsSubmitting(false);
      }
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredMatches = matches.filter(match => {
    const isPending = match.status === 'SCHEDULED' || match.status === 'LIVE';
    const matchesTab = activeTab === 'PENDING' ? isPending : !isPending;
    
    // Safety check if teamA / teamB are populated objects or strings
    const matchSearchA = typeof match.teamA === 'string' ? match.teamA : '';
    const matchSearchB = typeof match.teamB === 'string' ? match.teamB : '';
    
    const matchesSearch = matchSearchA.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          matchSearchB.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = sportFilter === 'All' || match.sport === sportFilter;

    return matchesTab && matchesSearch && matchesSport;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSportFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSportFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: 'PENDING' | 'HISTORY') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredMatches.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMatches = filteredMatches.slice(indexOfFirstItem, indexOfLastItem);

  const handleOpenRules = (sportName: string) => {
    const sportObj = sports.find(s => s.name === sportName) || { name: sportName, rules: [] };
    setCurrentRuleSport(sportObj);
    setRulesModalOpen(true);
  };

  return (<>
    
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Match Management</h1>
          <p className="text-slate-500">View schedules, officiate games, and verify scores.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white border border-slate-200 p-1 rounded-lg shadow-sm">
               <button 
                  onClick={() => handleTabChange('PENDING')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'PENDING' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
               >
                  Pending
               </button>
               <button 
                  onClick={() => handleTabChange('HISTORY')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'HISTORY' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
               >
                  History
               </button>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input 
                    type="text" 
                    placeholder="Search by team name..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-shadow shadow-sm placeholder-slate-400 text-slate-900"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="w-full md:w-56 relative">
                 <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                 <select 
                    className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-sm appearance-none cursor-pointer text-slate-700 font-medium"
                    value={sportFilter}
                    onChange={handleSportFilterChange}
                 >
                     <option value="All">All Sports</option>
                     <option value="Cricket">Cricket</option>
                     <option value="Badminton">Badminton</option>
                 </select>
                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                     <ChevronRight className="h-4 w-4 text-slate-400 rotate-90" />
                 </div>
            </div>
        </div>
      </Card>

      <div className="space-y-4">
          {isLoading ? (
             <div className="text-center py-12">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
             </div>
          ) : filteredMatches.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                  <div className="mx-auto h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                      <Search className="h-6 w-6 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">No matches found</h3>
                  <p className="text-slate-500 max-w-sm mx-auto mt-1">We couldn't find any matches matching your current filters. Try adjusting your search criteria.</p>
                  <button onClick={() => {setSearchTerm(''); setSportFilter('All')}} className="text-blue-600 text-sm mt-4 font-bold hover:underline">Clear All Filters</button>
              </div>
          ) : (
            <>
            {currentMatches.map(match => (
                <Card key={match.id} className="hover:shadow-md transition-shadow group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start space-x-4 flex-1">
                             <div className={`p-4 rounded-xl flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 shadow-sm transition-transform group-hover:scale-105 ${
                                 match.sport === 'Cricket' ? 'bg-blue-50 text-blue-600' :
                                 match.sport === 'Badminton' ? 'bg-orange-50 text-orange-600' :
                                 'bg-green-50 text-green-600'
                             }`}>
                                 <span className="text-2xl mb-1">
                                     {match.sport === 'Cricket' ? '🏏' : match.sport === 'Badminton' ? '🏸' : '🏸'}
                                 </span>
                                 <span className="text-[10px] font-bold uppercase tracking-wider">{match.sport.substring(0,3)}</span>
                             </div>
                             <div>
                                 <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">
                                     <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{match.status}</span>
                                     <span>•</span>
                                     <span className="flex items-center text-slate-500"><Clock className="h-3 w-3 mr-1" /> {new Date(match.date).toLocaleDateString()}</span>
                                 </div>
                                 <h3 className="text-lg font-bold text-slate-900 mt-1">{match.teamA as unknown as string} <span className="text-slate-400 font-light mx-2">vs</span> {match.teamB as unknown as string}</h3>
                                 <p className="text-sm text-slate-500 flex items-center mt-2">
                                     <MapPin className="h-3.5 w-3.5 mr-1.5 text-slate-400" /> {match.location}
                                 </p>
                             </div>
                        </div>
                        
                        {activeTab === 'HISTORY' && (
                             <div className="text-center px-6 py-3 bg-slate-50 rounded-xl border border-slate-200">
                                 {match.sport === 'Cricket' ? (
                                    <span className="text-xl md:text-2xl font-mono font-bold text-slate-900 tracking-tight block">
                                        {match.scoreA||0}/{match.details?.wicketsA||0} - {match.scoreB||0}/{match.details?.wicketsB||0}
                                    </span>
                                 ) : match.sport === 'Badminton' ? (
                                    <span className="text-xl md:text-2xl font-mono font-bold text-slate-900 tracking-tight block">
                                        {match.scoreA||0} - {match.scoreB||0}
                                    </span>
                                 ) : (
                                    <span className="text-3xl font-mono font-bold text-slate-900 tracking-tight">{match.scoreA||0} - {match.scoreB||0}</span>
                                 )}
                                 <div className="text-[10px] text-green-700 font-bold uppercase mt-1 inline-flex items-center justify-center bg-green-100 px-2 py-0.5 rounded-full">
                                     <CheckCircle className="h-3 w-3 mr-1" /> Verified
                                 </div>
                             </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0 items-center">
                             <Button variant="outline" size="sm" onClick={() => handleOpenRules(match.sport)} className="w-full md:w-auto">
                                 <FileText className="h-4 w-4 mr-2" /> Rules
                             </Button>
                             {activeTab === 'PENDING' && (
                                 <Button size="sm" onClick={() => handleOpenScoreModal(match)} className="w-full md:w-auto shadow-sm shadow-blue-200">
                                     Enter Result <ChevronRight className="h-4 w-4 ml-1" />
                                 </Button>
                             )}
                             {activeTab === 'HISTORY' && (
                                 <Button variant="secondary" size="sm" className="w-full md:w-auto" onClick={() => setReportMatch(match)}>
                                     View Report <Eye className="h-4 w-4 ml-2" />
                                 </Button>
                             )}
                        </div>
                    </div>
                </Card>
            ))}

            {totalPages > 1 && (
                <div className="flex justify-between items-center pt-6 border-t border-slate-200 mt-6">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="flex items-center"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                        Page <span className="text-slate-900 font-bold">{currentPage}</span> of {totalPages}
                    </span>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="flex items-center"
                    >
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            )}
            </>
          )}
      </div>

      <Modal 
        isOpen={rulesModalOpen} 
        onClose={() => setRulesModalOpen(false)}
        title={`${currentRuleSport?.name || ''} Rules & Regulations`}
      >
        <div className="prose prose-sm max-w-none text-slate-600">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="font-bold text-blue-900">Official Regulations</p>
                <p className="text-blue-700">Ensure to enforce these rules thoroughly.</p>
            </div>
            <ul className="space-y-4 mt-4">
                {currentRuleSport?.rules && currentRuleSport.rules.length > 0 ? (
                  currentRuleSport.rules.map((rule: string, i: number) => (
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

      <Modal
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        title="Enter Match Result"
      >
        {selectedMatch && (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <div className="text-sm text-slate-500">
                        <span className="font-bold text-slate-900 block text-base">{selectedMatch.sport}</span>
                        {selectedMatch.location}
                    </div>
                    <div className="text-right text-xs text-slate-400">
                        Match ID: #{selectedMatch.id.toUpperCase()}
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3 border border-blue-100">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                        <p className="font-bold">Final Verification Required</p>
                        <p>Submitting this score will update the public leaderboard immediately.</p>
                    </div>
                </div>

                <ScoreInput match={selectedMatch} scoreData={scoreData} setScoreData={setScoreData} />

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <label className="text-sm font-bold text-slate-700">Referee Notes</label>
                        <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded">(Optional)</span>
                    </div>
                    <textarea 
                        className="w-full p-3 bg-white border border-slate-300 rounded-lg h-24 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-900" 
                        placeholder="Log any disciplinary actions, injuries, or weather interruptions here..."
                    ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                    <Button variant="outline" onClick={() => setSelectedMatch(null)}>Cancel</Button>
                    <Button onClick={handleVerifyAndSubmit} disabled={isSubmitting} className="px-6 shadow-lg shadow-blue-200">
                        <CheckCircle className="h-4 w-4 mr-2" /> {isSubmitting ? 'Verifying...' : 'Verify & Submit'}
                    </Button>
                </div>
            </div>
        )}
      </Modal>

      <MatchDetailModal 
        match={reportMatch} 
        onClose={() => setReportMatch(null)} 
        isAdmin={false} 
      /></>
    
  );
};
