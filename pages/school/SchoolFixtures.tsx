import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MOCK_MATCHES, MOCK_REFEREES, MOCK_POINTS_TABLE, MOCK_TOURNAMENTS } from '../../services/mockData';
import { Calendar, CheckCircle, Clock, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Match } from '../../types';
import { MatchDetailModal } from '../../components/fixtures/MatchDetailModal';
import { StandingsTable } from '../../components/fixtures/StandingsTable';

export const SchoolFixtures = () => {
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>('t1'); // Default to first tournament
  const [activeTab, setActiveTab] = useState<'FIXTURES' | 'STANDINGS'>('FIXTURES');
  const [matchTypeFilter, setMatchTypeFilter] = useState<'UPCOMING' | 'HISTORY'>('UPCOMING');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset pagination when filters change
  // Removed useEffect to avoid cascading renders

  // Get current tournament details
  const currentTournament = MOCK_TOURNAMENTS.find(t => t.id === selectedTournamentId);

  const handleTournamentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTournamentId(e.target.value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: 'FIXTURES' | 'STANDINGS') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleMatchTypeChange = (type: 'UPCOMING' | 'HISTORY') => {
    setMatchTypeFilter(type);
    setCurrentPage(1);
  };

  // 1. Filter matches by Tournament AND Type (Upcoming/History)
  const filteredMatches = MOCK_MATCHES.filter(match => {
    // Filter by Tournament ID
    if (match.tournamentId !== selectedTournamentId) return false;

    // Filter by Match Type (Upcoming vs History)
    const isHistory = match.status === 'COMPLETED' || match.status === 'VERIFIED';
    const isUpcoming = match.status === 'SCHEDULED' || match.status === 'LIVE';
    
    if (matchTypeFilter === 'HISTORY' && !isHistory) return false;
    if (matchTypeFilter === 'UPCOMING' && !isUpcoming) return false;

    return true;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredMatches.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMatches = filteredMatches.slice(indexOfFirstItem, indexOfLastItem);

  // 2. Filter Standings by Tournament
  const filteredStandings = MOCK_POINTS_TABLE.filter(entry => entry.tournamentId === selectedTournamentId);

  const getRefereeName = (id: string) => {
    const ref = MOCK_REFEREES.find(r => r.id === id);
    return ref ? ref.name : 'Unassigned';
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Matches & Results</h1>
        <p className="text-slate-500">Track fixtures, results, and point tables for every league.</p>
      </div>

      {/* 1. Tournament Selector (Context Switcher) */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-full md:w-1/3">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Tournament</label>
                <div className="relative">
                    <select 
                        value={selectedTournamentId}
                        onChange={handleTournamentChange}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold appearance-none text-sm"
                    >
                        {MOCK_TOURNAMENTS.map(t => (
                            <option key={t.id} value={t.id}>{t.name} ({t.sport})</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <Filter className="h-4 w-4 text-slate-500" />
                    </div>
                </div>
            </div>
            
            {/* Context Info */}
            <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-4">
                <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Status</p>
                    <p className={`text-sm font-bold truncate ${currentTournament?.status === 'ONGOING' ? 'text-green-600' : 'text-slate-700'}`}>
                        {currentTournament?.status}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Dates</p>
                    <p className="text-sm font-bold text-slate-900 truncate">
                        {currentTournament ? `${new Date(currentTournament.startDate).toLocaleDateString()} - ${new Date(currentTournament.endDate).toLocaleDateString()}` : '-'}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Sport</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{currentTournament?.sport}</p>
                </div>
            </div>
        </div>
      </Card>

      {/* 2. Main Tab Navigation (Fixtures vs Standings) */}
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto hide-scrollbar">
        <button
            onClick={() => handleTabChange('FIXTURES')}
            className={`px-6 py-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === 'FIXTURES' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
        >
            Fixtures
        </button>
        <button
            onClick={() => handleTabChange('STANDINGS')}
            className={`px-6 py-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === 'STANDINGS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
        >
            Point Table
        </button>
      </div>

      {activeTab === 'FIXTURES' ? (
        <>
            {/* Fixture Filters */}
            <div className="flex justify-end mb-4">
                <div className="flex bg-white border border-slate-200 p-1 rounded-lg shadow-sm">
                    <button 
                        onClick={() => handleMatchTypeChange('UPCOMING')}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${matchTypeFilter === 'UPCOMING' ? 'bg-blue-50 text-blue-700' : 'text-slate-500'}`}
                    >
                        Upcoming
                    </button>
                    <button 
                        onClick={() => handleMatchTypeChange('HISTORY')}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${matchTypeFilter === 'HISTORY' ? 'bg-blue-50 text-blue-700' : 'text-slate-500'}`}
                    >
                        Results
                    </button>
                </div>
            </div>

            {/* Match List */}
            <div className="space-y-4">
                {filteredMatches.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500">No {matchTypeFilter.toLowerCase()} matches found for this tournament.</p>
                    </div>
                ) : (
                    currentMatches.map(match => (
                        <div 
                            key={match.id} 
                            onClick={() => setSelectedMatch(match)}
                            className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group active:scale-[0.99]"
                        >
                            {/* Desktop View (Table-like) */}
                            <div className="hidden md:grid grid-cols-12 gap-4 p-5 items-center">
                                <div className="col-span-4">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${match.sport === 'Cricket' ? 'bg-blue-50 text-blue-600' : match.sport === 'Basketball' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                                            {match.sport === 'Cricket' ? '🏏' : match.sport === 'Basketball' ? '🏀' : '🏸'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{new Date(match.date).toLocaleDateString()}</p>
                                            <p className="text-xs text-slate-500 truncate max-w-[150px]">{match.location}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-span-5 flex flex-col items-center justify-center border-l border-r border-slate-50 px-2">
                                    <div className="flex items-center justify-between w-full">
                                        <span className={`text-sm font-bold flex-1 text-right truncate ${match.teamA.includes('Springfield') ? 'text-slate-900' : 'text-slate-500'}`}>{match.teamA}</span>
                                        <div className="mx-4 text-center">
                                            {matchTypeFilter === 'HISTORY' ? (
                                                <span className="font-mono font-bold bg-slate-100 px-3 py-1 rounded text-slate-900 min-w-[80px] block border border-slate-200 text-sm">
                                                    {match.scoreA} - {match.scoreB}
                                                </span>
                                            ) : (
                                                <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-500 block">VS</span>
                                            )}
                                        </div>
                                        <span className={`text-sm font-bold flex-1 text-left truncate ${match.teamB.includes('Springfield') ? 'text-slate-900' : 'text-slate-500'}`}>{match.teamB}</span>
                                    </div>
                                </div>

                                <div className="col-span-3 text-right pl-4">
                                    {matchTypeFilter === 'HISTORY' ? (
                                        <div className="flex flex-col items-end">
                                            <span className="inline-flex items-center text-xs font-medium text-green-700">
                                                <CheckCircle className="h-3 w-3 mr-1" /> Verified
                                            </span>
                                            <span className="text-[10px] text-slate-400 mt-1 truncate">Ref: {getRefereeName(match.refereeId)}</span>
                                        </div>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            <Clock className="h-3 w-3 mr-1" /> {new Date(match.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Mobile View (Card-like) */}
                            <div className="md:hidden p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center text-slate-500">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        <span className="text-xs font-bold">{new Date(match.date).toLocaleDateString()}</span>
                                    </div>
                                    <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wide ${matchTypeFilter === 'HISTORY' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {matchTypeFilter === 'HISTORY' ? 'Finished' : new Date(match.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between items-center mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <div className="text-left w-2/5 overflow-hidden">
                                        <p className="font-bold text-slate-900 text-sm mb-1 truncate">{match.teamA}</p>
                                        {matchTypeFilter === 'HISTORY' && <p className="text-lg font-mono font-bold text-slate-800">{match.scoreA}</p>}
                                    </div>
                                    <div className="text-xs font-bold text-slate-400">VS</div>
                                    <div className="text-right w-2/5 overflow-hidden">
                                        <p className="font-bold text-slate-900 text-sm mb-1 truncate">{match.teamB}</p>
                                        {matchTypeFilter === 'HISTORY' && <p className="text-lg font-mono font-bold text-slate-800">{match.scoreB}</p>}
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <div className="flex items-center truncate max-w-[60%]">
                                         <Clock className="h-3 w-3 mr-1" /> {new Date(match.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                    <div className="truncate">{match.location}</div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center pt-6 border-t border-slate-200 mt-4">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="flex items-center"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    <span className="text-xs md:text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
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
      ) : (
        /* STANDINGS VIEW */
        <StandingsTable entries={filteredStandings} sport={currentTournament?.sport || 'Generic'} />
      )}

      {/* Detail Modal Component */}
      <MatchDetailModal 
        match={selectedMatch} 
        onClose={() => setSelectedMatch(null)} 
      />
    </DashboardLayout>
  );
};