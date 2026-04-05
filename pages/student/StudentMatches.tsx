import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { MOCK_MATCHES, MOCK_TEAMS, MOCK_STUDENTS } from '../../services/mockData';
import { MapPin, Calendar, Clock, ChevronRight, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { MatchDetailModal } from '../../components/fixtures/MatchDetailModal';
import { Match } from '../../types';

import { exportToExcel } from '../../services/export';

export const StudentMatches = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'HISTORY'>('UPCOMING');
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(5);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  
  const student = MOCK_STUDENTS.find(s => s.id === user?.id) || MOCK_STUDENTS[0];
  const myTeams = MOCK_TEAMS.filter(t => t.playerIds.includes(student.id));
  const myTeamNames = myTeams.map(t => t.name);

  // Filter matches
  const allMyMatches = MOCK_MATCHES.filter(m => 
    myTeamNames.some(teamName => m.teamA === teamName || m.teamB === teamName) ||
    (m.teamA.includes('Springfield') || m.teamB.includes('Springfield'))
  );

  const filteredMatches = allMyMatches.filter(m => {
    const matchesTab = activeTab === 'UPCOMING' 
        ? (m.status === 'SCHEDULED' || m.status === 'LIVE')
        : (m.status === 'VERIFIED' || m.status === 'COMPLETED');
    
    const matchesSearch = m.teamA.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.teamB.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSport = sportFilter === 'All' || m.sport === sportFilter;

    return matchesTab && matchesSearch && matchesSport;
  });

  const displayedMatches = filteredMatches.slice(0, visibleCount);
  const hasMore = visibleCount < filteredMatches.length;

  const loadMore = () => setVisibleCount(prev => prev + 5);

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Match Center</h1>
          <p className="text-slate-500">Track fixtures and past results.</p>
        </div>
        <Button variant="outline" onClick={() => exportToExcel(filteredMatches, 'Matches')}>Export Excel</Button>
      </div>

      {/* Filters and Tabs */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex space-x-1 bg-white border border-slate-200 p-1 rounded-lg inline-flex self-start">
            <button
            onClick={() => { setActiveTab('UPCOMING'); setVisibleCount(5); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'UPCOMING' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
            >
            Upcoming
            </button>
            <button
            onClick={() => { setActiveTab('HISTORY'); setVisibleCount(5); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'HISTORY' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
            >
            History
            </button>
        </div>

        <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input 
                    type="text" 
                    placeholder="Search teams..." 
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <select 
                className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 text-slate-700"
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value)}
            >
                <option value="All">All Sports</option>
                <option value="Cricket">Cricket</option>
                <option value="Basketball">Basketball</option>
                <option value="Badminton">Badminton</option>
            </select>
        </div>
      </div>

      <div className="space-y-4">
        {displayedMatches.length > 0 ? (
          <>
            {displayedMatches.map(match => {
                const isSpringfieldA = match.teamA.includes('Springfield');
                const myScore = isSpringfieldA ? match.scoreA : match.scoreB;
                const oppScore = isSpringfieldA ? match.scoreB : match.scoreA;
                const isWin = (myScore || 0) > (oppScore || 0);

                return (
                <Card key={match.id} className="hover:shadow-md transition-shadow border border-slate-200">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Date & Sport */}
                    <div className="flex items-center md:flex-col md:items-start w-full md:w-auto justify-between md:justify-start">
                        <div className="flex flex-col items-center md:items-start text-center md:text-left min-w-[60px]">
                            <span className="text-xs font-bold text-red-500 uppercase">{new Date(match.date).toLocaleString('default', { month: 'short' })}</span>
                            <span className="text-2xl font-bold text-slate-800">{new Date(match.date).getDate()}</span>
                        </div>
                        <span className="md:hidden px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase">
                            {match.sport}
                        </span>
                    </div>

                    {/* Teams */}
                    <div className="flex-1 w-full text-center md:text-left border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                        <div className="flex items-center justify-between md:justify-start md:space-x-8">
                        <div className="flex-1 text-right md:text-left">
                            <p className={`font-bold ${isSpringfieldA ? 'text-slate-900' : 'text-slate-500'}`}>{match.teamA}</p>
                        </div>
                        
                        <div className="px-4">
                            {activeTab === 'HISTORY' ? (
                                <div className="bg-slate-100 px-3 py-1 rounded text-lg font-mono font-bold whitespace-nowrap text-slate-900 border border-slate-200">
                                    {match.scoreA} - {match.scoreB}
                                </div>
                            ) : (
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">VS</span>
                            )}
                        </div>

                        <div className="flex-1 text-left">
                            <p className={`font-bold ${!isSpringfieldA ? 'text-slate-900' : 'text-slate-500'}`}>{match.teamB}</p>
                        </div>
                        </div>
                        
                        <div className="flex items-center justify-center md:justify-start mt-3 text-sm text-slate-500 space-x-4">
                            <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> {match.location}</span>
                            <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {new Date(match.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <span className="hidden md:inline-flex px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase">
                                {match.sport}
                            </span>
                        </div>
                    </div>

                    {/* Action/Result */}
                    <div className="w-full md:w-auto flex justify-center border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                        {activeTab === 'HISTORY' ? (
                            <div className="flex flex-col items-center space-y-2">
                                <div className={`px-4 py-2 rounded-full font-bold text-sm ${isWin ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {isWin ? 'VICTORY' : 'DEFEAT'}
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setSelectedMatch(match)}>
                                    Details
                                </Button>
                            </div>
                        ) : (
                            <Button variant="outline" size="sm" className="w-full md:w-auto" onClick={() => setSelectedMatch(match)}>
                                Details <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        )}
                    </div>
                    </div>
                </Card>
                );
            })}
            
            {hasMore && (
                <div className="text-center pt-4">
                    <Button variant="secondary" onClick={loadMore}>Load More Matches</Button>
                </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <Calendar className="h-10 w-10 mx-auto text-slate-300 mb-2" />
            <p className="text-slate-500">No {activeTab.toLowerCase()} matches found.</p>
            {(searchTerm || sportFilter !== 'All') && (
                <button 
                    onClick={() => { setSearchTerm(''); setSportFilter('All'); }}
                    className="text-blue-600 text-sm mt-2 hover:underline"
                >
                    Clear Filters
                </button>
            )}
          </div>
        )}
      </div>

      <MatchDetailModal 
        match={selectedMatch} 
        onClose={() => setSelectedMatch(null)} 
        isAdmin={false} 
      />
    </DashboardLayout>
  );
};