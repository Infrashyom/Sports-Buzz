import React, { useState, useEffect } from 'react';

import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Calendar, Clock, ChevronRight, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { MatchDetailModal } from '../../components/fixtures/MatchDetailModal';
import { Match } from '../../types';
import api from '../../services/api';

export const StudentMatches = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'HISTORY'>('UPCOMING');
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(5);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [myTeamNames, setMyTeamNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch matches and user's teams
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [matchRes, teamRes] = await Promise.all([
            api.get('/matches'),
            api.get('/teams')
        ]);
        const allTeams = teamRes.data.data.teams;
        const myTeams = allTeams.filter((t: any) => t.playerIds && t.playerIds.includes(user.id));
        setMyTeamNames(myTeams.map((t: any) => t.name));

        const transformedMatches = matchRes.data.data.matches.map((m: any) => ({
            ...m,
            id: m._id,
            teamA: m.teamA?.name || m.teamA,
            teamB: m.teamB?.name || m.teamB
        }));
        setMatches(transformedMatches);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Filter matches
  const allMyMatches = matches.filter(m => 
    myTeamNames.some(teamName => m.teamA === teamName || m.teamB === teamName)
  );

  const filteredMatches = allMyMatches.filter(m => {
    const matchesTab = activeTab === 'UPCOMING' 
        ? (m.status === 'SCHEDULED' || m.status === 'LIVE')
        : (m.status === 'VERIFIED' || m.status === 'COMPLETED');
    
    // Safety check if teamA / teamB are populated objects or strings
    const matchSearchA = typeof m.teamA === 'string' ? m.teamA : '';
    const matchSearchB = typeof m.teamB === 'string' ? m.teamB : '';
    
    const matchesSearch = matchSearchA.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          matchSearchB.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSport = sportFilter === 'All' || m.sport === sportFilter;

    return matchesTab && matchesSearch && matchesSport;
  });

  const displayedMatches = filteredMatches.slice(0, visibleCount);
  const hasMore = visibleCount < filteredMatches.length;

  const loadMore = () => setVisibleCount(prev => prev + 5);

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Match Center</h1>
          <p className="text-slate-500">Track fixtures and past results.</p>
        </div>
      </div>

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
                <option value="Badminton">Badminton</option>
            </select>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
           <div className="text-center py-12">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
           </div>
        ) : displayedMatches.length > 0 ? (
          <>
            {displayedMatches.map(match => {
                const isMyTeamA = myTeamNames.includes(match.teamA as unknown as string);
                const myScore = isMyTeamA ? match.scoreA : match.scoreB;
                const oppScore = isMyTeamA ? match.scoreB : match.scoreA;
                const isWin = (myScore || 0) > (oppScore || 0);

                return (
                <Card key={match.id} className="hover:shadow-md transition-shadow border border-slate-200">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center md:flex-col md:items-start w-full md:w-auto justify-between md:justify-start">
                        <div className="flex flex-col items-center md:items-start text-center md:text-left min-w-[60px]">
                            <span className="text-xs font-bold text-red-500 uppercase">{new Date(match.date).toLocaleString('default', { month: 'short' })}</span>
                            <span className="text-2xl font-bold text-slate-800">{new Date(match.date).getDate()}</span>
                        </div>
                        <span className="md:hidden px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase">
                            {match.sport}
                        </span>
                    </div>

                    <div className="flex-1 w-full text-center md:text-left border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                        <div className="flex items-center justify-between md:justify-start md:space-x-8">
                        <div className="flex-1 text-right md:text-left">
                            <p className={`font-bold ${isMyTeamA ? 'text-slate-900' : 'text-slate-500'}`}>{match.teamA as unknown as string}</p>
                        </div>
                        
                        <div className="px-4">
                            {activeTab === 'HISTORY' ? (
                                <div className="bg-slate-100 px-3 py-1 rounded text-lg font-mono font-bold whitespace-nowrap text-slate-900 border border-slate-200">
                                    {match.sport === 'Cricket' 
                                        ? `${match.scoreA||0}/${match.details?.wicketsA||0} - ${match.scoreB||0}/${match.details?.wicketsB||0}`
                                        : `${match.scoreA||0} - ${match.scoreB||0}`}
                                </div>
                            ) : (
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">VS</span>
                            )}
                        </div>

                        <div className="flex-1 text-left">
                            <p className={`font-bold ${!isMyTeamA ? 'text-slate-900' : 'text-slate-500'}`}>{match.teamB as unknown as string}</p>
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
      /></>
    
  );
};
