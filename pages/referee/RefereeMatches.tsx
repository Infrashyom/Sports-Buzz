import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { MOCK_MATCHES } from '../../services/mockData';
import { MapPin, Clock, Search, Filter, AlertCircle, CheckCircle, FileText, ChevronRight, ChevronLeft, Eye } from 'lucide-react';
import { Match } from '../../types';
import { MatchDetailModal } from '../../components/fixtures/MatchDetailModal';

const InputField = ({ placeholder, label }: { placeholder: string, label: string }) => (
    <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase">{label}</label>
        <input 
            type="number" 
            placeholder={placeholder} 
            className="w-full p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 placeholder-slate-400" 
        />
    </div>
);

const ScoreInput = ({ match }: { match: Match }) => {
    if (match.sport === 'Cricket') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 md:p-6 rounded-xl border border-slate-200">
                <div className="space-y-4">
                    <div className="font-bold text-lg text-slate-900 border-b border-slate-200 pb-2">{match.teamA}</div>
                    <InputField label="Runs" placeholder="0" />
                    <InputField label="Wickets" placeholder="0" />
                    <InputField label="Overs" placeholder="0.0" />
                </div>
                <div className="space-y-4">
                    <div className="font-bold text-lg text-slate-900 border-b border-slate-200 pb-2">{match.teamB}</div>
                    <InputField label="Runs" placeholder="0" />
                    <InputField label="Wickets" placeholder="0" />
                    <InputField label="Overs" placeholder="0.0" />
                </div>
            </div>
        )
    }
    if (match.sport === 'Badminton' || match.sport === 'Tennis') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 md:p-6 rounded-xl border border-slate-200">
                <div className="space-y-4">
                    <div className="font-bold text-lg text-slate-900 border-b border-slate-200 pb-2">{match.teamA}</div>
                    <InputField label="Sets Won" placeholder="0" />
                    <div className="col-span-1 md:col-span-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Set Scores (Comma separated)</label>
                        <input type="text" placeholder="21-19, 15-21, 21-10" className="w-full p-2 mt-1 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="font-bold text-lg text-slate-900 border-b border-slate-200 pb-2">{match.teamB}</div>
                    <InputField label="Sets Won" placeholder="0" />
                </div>
            </div>
        )
    }
    // Default (Basketball, Soccer)
    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 py-8 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-center w-full md:w-auto">
                <label className="block text-sm font-bold text-slate-900 mb-3">{match.teamA}</label>
                <input type="number" className="w-24 h-24 text-center text-4xl font-bold bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all mx-auto" placeholder="0" />
            </div>
            <span className="hidden md:inline-block text-4xl font-bold text-slate-300">-</span>
            <div className="text-center w-full md:w-auto">
                <label className="block text-sm font-bold text-slate-900 mb-3">{match.teamB}</label>
                <input type="number" className="w-24 h-24 text-center text-4xl font-bold bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all mx-auto" placeholder="0" />
            </div>
        </div>
    );
};

import { exportToExcel } from '../../services/export';

export const RefereeMatches = () => {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'HISTORY'>('PENDING');
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('All');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null); // For scoring
  const [reportMatch, setReportMatch] = useState<Match | null>(null); // For viewing report
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
  const [currentRuleSport, setCurrentRuleSport] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset pagination on filter change
  // Removed useEffect to avoid cascading renders

  // Filtering Logic
  const filteredMatches = MOCK_MATCHES.filter(match => {
    const isPending = match.status === 'SCHEDULED' || match.status === 'LIVE';
    const matchesTab = activeTab === 'PENDING' ? isPending : !isPending;
    
    const matchesSearch = match.teamA.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          match.teamB.toLowerCase().includes(searchTerm.toLowerCase());
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

  const handleOpenRules = (sport: string) => {
    setCurrentRuleSport(sport);
    setRulesModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Match Management</h1>
          <p className="text-slate-500">View schedules, officiate games, and verify scores.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => exportToExcel(filteredMatches, 'Matches')}>Export Excel</Button>
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

      {/* Filters */}
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
                     <option value="Basketball">Basketball</option>
                     <option value="Badminton">Badminton</option>
                 </select>
                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                     <ChevronRight className="h-4 w-4 text-slate-400 rotate-90" />
                 </div>
            </div>
        </div>
      </Card>

      {/* Matches List */}
      <div className="space-y-4">
          {filteredMatches.length === 0 ? (
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
                        {/* Match Info */}
                        <div className="flex items-start space-x-4 flex-1">
                             <div className={`p-4 rounded-xl flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 shadow-sm transition-transform group-hover:scale-105 ${
                                 match.sport === 'Cricket' ? 'bg-blue-50 text-blue-600' :
                                 match.sport === 'Basketball' ? 'bg-orange-50 text-orange-600' :
                                 'bg-green-50 text-green-600'
                             }`}>
                                 <span className="text-2xl mb-1">
                                     {match.sport === 'Cricket' ? '🏏' : match.sport === 'Basketball' ? '🏀' : '🏸'}
                                 </span>
                                 <span className="text-[10px] font-bold uppercase tracking-wider">{match.sport.substring(0,3)}</span>
                             </div>
                             <div>
                                 <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">
                                     <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{match.status}</span>
                                     <span>•</span>
                                     <span className="flex items-center text-slate-500"><Clock className="h-3 w-3 mr-1" /> {match.date}</span>
                                 </div>
                                 <h3 className="text-lg font-bold text-slate-900 mt-1">{match.teamA} <span className="text-slate-400 font-light mx-2">vs</span> {match.teamB}</h3>
                                 <p className="text-sm text-slate-500 flex items-center mt-2">
                                     <MapPin className="h-3.5 w-3.5 mr-1.5 text-slate-400" /> {match.location}
                                 </p>
                             </div>
                        </div>
                        
                        {/* Score Display (History) */}
                        {activeTab === 'HISTORY' && (
                             <div className="text-center px-6 py-3 bg-slate-50 rounded-xl border border-slate-200">
                                 <span className="text-3xl font-mono font-bold text-slate-900 tracking-tight">{match.scoreA} - {match.scoreB}</span>
                                 <div className="text-[10px] text-green-700 font-bold uppercase mt-1 flex items-center justify-center bg-green-100 px-2 py-0.5 rounded-full">
                                     <CheckCircle className="h-3 w-3 mr-1" /> Verified
                                 </div>
                             </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0 items-center">
                             <Button variant="outline" size="sm" onClick={() => handleOpenRules(match.sport)} className="w-full md:w-auto">
                                 <FileText className="h-4 w-4 mr-2" /> Rules
                             </Button>
                             {activeTab === 'PENDING' && (
                                 <Button size="sm" onClick={() => setSelectedMatch(match)} className="w-full md:w-auto shadow-sm shadow-blue-200">
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

            {/* Pagination Controls */}
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
            <ul className="space-y-3 mt-4">
                <li className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                    <span>All equipment must be checked by the referee 15 minutes prior to start.</span>
                </li>
                <li className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                    <span>Teams must have full rosters present. Late arrival ({'>'}15 mins) results in forfeit.</span>
                </li>
            </ul>
        </div>
      </Modal>

      {/* Scoring Modal */}
      <Modal
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        title="Enter Match Result"
      >
        {selectedMatch && (
            <div className="space-y-6">
                 {/* Match Header */}
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

                <ScoreInput match={selectedMatch} />

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <label className="text-sm font-bold text-slate-700">Referee Notes</label>
                        <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded">(Optional)</span>
                    </div>
                    <textarea 
                        className="w-full p-3 bg-white border border-slate-300 rounded-lg h-24 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" 
                        placeholder="Log any disciplinary actions, injuries, or weather interruptions here..."
                    ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                    <Button variant="outline" onClick={() => setSelectedMatch(null)}>Cancel</Button>
                    <Button onClick={() => setSelectedMatch(null)} className="px-6 shadow-lg shadow-blue-200">
                        <CheckCircle className="h-4 w-4 mr-2" /> Verify & Submit
                    </Button>
                </div>
            </div>
        )}
      </Modal>

      <MatchDetailModal 
        match={reportMatch} 
        onClose={() => setReportMatch(null)} 
        isAdmin={false} 
      />
    </DashboardLayout>
  );
};