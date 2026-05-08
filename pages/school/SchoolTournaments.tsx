import React, { useState, useEffect } from 'react';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Trophy, Calendar, Users, Search, CheckCircle, MapPin, Award, User, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tournament, Team } from '../../types';
import { StandingsTable } from '../../components/fixtures/StandingsTable';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const SchoolTournaments = () => {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [viewMode, setViewMode] = useState<'BROWSE' | 'MY'>('BROWSE');
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchTournaments = React.useCallback(async () => {
      try {
          const res = await api.get('/tournaments');
          setTournaments(res.data.data.tournaments);
      } catch {
          toast.error("Failed to load tournaments");
      } finally {
          setIsLoading(false);
      }
  }, []);

  const fetchMyTeams = React.useCallback(async () => {
      try {
          const mySchoolId = user?.schoolId || user?.id;
          if (!mySchoolId) return;
          const res = await api.get(`/schools/${mySchoolId}/teams`);
          const allTeams = res.data.data.teams;
          // Result should already be filtered, ensuring compatibility
          setMyTeams(allTeams);
      } catch {
          // ignore or toast
      }
  }, [user?.schoolId, user?.id]);

  useEffect(() => {
     fetchTournaments();
     fetchMyTeams();
  }, [fetchTournaments, fetchMyTeams]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal States
  const [selectedTournamentForDetails, setSelectedTournamentForDetails] = useState<Tournament | null>(null);
  const [selectedTournamentForStandings, setSelectedTournamentForStandings] = useState<Tournament | null>(null);
  const [selectedTournamentForRegistration, setSelectedTournamentForRegistration] = useState<Tournament | null>(null);
  
  // Registration Form State
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const SCHOOL_ID = user?.schoolId || user?.id; 

  const handleViewModeChange = (mode: 'BROWSE' | 'MY') => {
    setViewMode(mode);
    setCurrentPage(1);
  };

  const handleFilterChange = (status: string) => {
    setFilter(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const isParticipating = (tournament: Tournament) => {
    // If any of my teams are in registeredTeams or if my school is in participatingSchools
    const hasMyTeam = tournament.registeredTeams?.some(teamId => myTeams.find(t => (t.id === teamId || t._id === teamId)));
    const hasMySchool = (tournament as any).participatingSchools?.some((s: any) => s._id === SCHOOL_ID || s === SCHOOL_ID);
    return !!(hasMyTeam || hasMySchool);
  };

  const filteredTournaments = tournaments.filter(t => {
    if (!t.isPublished) return false;
    // 1. View Mode Filter (My Tournaments vs Browse)
    if (viewMode === 'MY' && !isParticipating(t)) return false;
    
    // 2. Status Filter
    if (filter !== 'ALL' && t.status !== filter) return false;

    // 3. Search Filter
    if (searchTerm && !t.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;

    return true;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredTournaments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTournaments = filteredTournaments.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'ONGOING': return 'bg-green-100 text-green-700 border-green-200';
      case 'UPCOMING': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'COMPLETED': return 'bg-slate-100 text-slate-500 border-slate-200';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  const getAvailableTeamsForSport = (sport: string) => {
    return myTeams.filter(t => t.sport === sport);
  };

  const handleRegisterSubmit = async () => {
    if (!selectedTournamentForRegistration || !selectedTeamId) return;
    setIsRegistering(true);
    try {
        await api.post(`/tournaments/${selectedTournamentForRegistration.id || selectedTournamentForRegistration._id}/register`, { teamId: selectedTeamId });
        setIsRegistrationSuccess(true);
        // Refresh tournaments
        fetchTournaments();
        setTimeout(() => {
            setIsRegistrationSuccess(false);
            setSelectedTournamentForRegistration(null);
            setSelectedTeamId('');
        }, 2000);
    } catch {
        toast.error("Failed to register. You might be already registered.");
    } finally {
        setIsRegistering(false);
    }
  };

  return (<>
    
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tournament Hub</h1>
          <p className="text-slate-500">Discover leagues, register teams, and track competition status.</p>
        </div>
        <div className="flex items-center gap-4">
        <div className="flex bg-white border border-slate-200 p-1 rounded-xl flex self-start md:self-auto shadow-sm">
              <button 
                  onClick={() => handleViewModeChange('BROWSE')}
                  className={`px-4 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                      viewMode === 'BROWSE' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
                  }`}
              >
                  Browse All
              </button>
              <button 
                  onClick={() => handleViewModeChange('MY')}
                  className={`px-4 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                      viewMode === 'MY' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
                  }`}
              >
                  My Tournaments
              </button>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg overflow-x-auto max-w-full w-full md:w-auto">
            {['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED'].map(status => (
              <button
                key={status}
                onClick={() => handleFilterChange(status)}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all whitespace-nowrap flex-1 md:flex-none ${
                  filter === status ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
             <input 
                type="text" 
                placeholder="Find tournaments..." 
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors outline-none"
             />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-slate-500">Loading tournaments...</p>
            </div>
        ) : filteredTournaments.length === 0 ? (
             <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                <Trophy className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                <p className="text-slate-500 font-medium">No tournaments found matching your criteria.</p>
                {viewMode === 'MY' && <p className="text-sm text-slate-400 mt-1">Join a tournament from the "Browse All" tab to see it here.</p>}
            </div>
        ) : (
            currentTournaments.map(tournament => (
            <div key={tournament.id || tournament._id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4 w-full lg:w-auto">
                    <div className={`h-14 w-14 md:h-16 md:w-16 rounded-xl flex items-center justify-center text-2xl md:text-3xl flex-shrink-0 ${
                    tournament.sport === 'Cricket' ? 'bg-blue-100' : 
                    tournament.sport === 'Badminton' ? 'bg-orange-100' : 'bg-green-100'
                    }`}>
                    {tournament.sport === 'Cricket' ? '🏏' : tournament.sport === 'Badminton' ? '🏸' : '🏸'}
                    </div>
                    <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 md:gap-3 mb-1">
                        <h3 className="text-base md:text-lg font-bold text-slate-900 truncate">{tournament.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${getStatusBadge(tournament.status)}`}>
                        {tournament.status}
                        </span>
                        {isParticipating(tournament) && (
                            <span className="flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-200 uppercase tracking-wide">
                                <CheckCircle className="h-3 w-3 mr-1" /> Registered
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs md:text-sm text-slate-500">
                        <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                        {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                        <Users className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                        {tournament.registeredTeams?.length || 0} Teams
                        </div>
                    </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {/* Conditional Buttons based on status and participation */}
                    {tournament.status === 'UPCOMING' && !isParticipating(tournament) && (
                        <Button onClick={() => setSelectedTournamentForRegistration(tournament)} className="w-full sm:w-auto shadow-sm shadow-blue-200">
                            Register Now
                        </Button>
                    )}
                    
                    {(tournament.status === 'ONGOING' || tournament.status === 'COMPLETED') && (
                        <Button variant="secondary" onClick={() => setSelectedTournamentForStandings(tournament)} className="w-full sm:w-auto">
                            View Standings
                        </Button>
                    )}
                    
                    <Button variant="outline" onClick={() => setSelectedTournamentForDetails(tournament)} className="w-full sm:w-auto">
                         Details
                    </Button>
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

      {/* Details Modal */}
      <Modal 
        isOpen={!!selectedTournamentForDetails} 
        onClose={() => setSelectedTournamentForDetails(null)}
        title={selectedTournamentForDetails?.name || 'Tournament Details'}
      >
        {selectedTournamentForDetails && (
            <div className="space-y-6">
                 {/* Hero Info */}
                 <div className={`p-6 rounded-xl text-white ${
                     selectedTournamentForDetails.sport === 'Cricket' ? 'bg-gradient-to-r from-blue-600 to-blue-800' : 
                     selectedTournamentForDetails.sport === 'Badminton' ? 'bg-gradient-to-r from-orange-500 to-orange-700' : 
                     'bg-gradient-to-r from-green-600 to-green-800'
                 }`}>
                     <div className="flex justify-between items-start">
                         <div>
                             <p className="text-white/80 font-bold uppercase tracking-wider text-xs mb-1">{selectedTournamentForDetails.sport}</p>
                             <h2 className="text-xl md:text-2xl font-bold mb-2">{selectedTournamentForDetails.name}</h2>
                             <div className="flex items-center text-sm text-white/90">
                                 <Calendar className="h-4 w-4 mr-2" />
                                 {new Date(selectedTournamentForDetails.startDate).toDateString()} - {new Date(selectedTournamentForDetails.endDate).toDateString()}
                             </div>
                         </div>
                         <Trophy className="h-10 w-10 md:h-12 md:w-12 text-white/30" />
                     </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                         <h4 className="font-bold text-slate-900 mb-2">Description</h4>
                         <p className="text-sm text-slate-600 leading-relaxed">
                            {selectedTournamentForDetails.description || 'No description available for this tournament.'}
                         </p>
                     </div>
                     <div className="space-y-4">
                         <div className="bg-slate-50 p-3 rounded-lg flex items-start space-x-3">
                             <MapPin className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
                             <div>
                                 <p className="text-xs font-bold text-slate-500 uppercase">Venue</p>
                                 <p className="text-sm font-bold text-slate-900">{selectedTournamentForDetails.location || 'Various Locations'}</p>
                             </div>
                         </div>
                         <div className="bg-slate-50 p-3 rounded-lg flex items-start space-x-3">
                             <Award className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
                             <div>
                                 <p className="text-xs font-bold text-slate-500 uppercase">Prize Pool</p>
                                 <p className="text-sm font-bold text-slate-900">{selectedTournamentForDetails.prizePool || 'Trophy & Certificates'}</p>
                             </div>
                         </div>
                          <div className="bg-slate-50 p-3 rounded-lg flex items-start space-x-3">
                             <User className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
                             <div>
                                 <p className="text-xs font-bold text-slate-500 uppercase">Organizer</p>
                                 <p className="text-sm font-bold text-slate-900">{selectedTournamentForDetails.organizer || 'Sports Buzz Board'}</p>
                             </div>
                         </div>
                     </div>
                 </div>
                 
                 <div className="flex justify-end pt-4 border-t border-slate-100">
                     <Button onClick={() => setSelectedTournamentForDetails(null)}>Close</Button>
                 </div>
            </div>
        )}
      </Modal>

      {/* Standings Modal */}
      <Modal 
        isOpen={!!selectedTournamentForStandings}
        onClose={() => setSelectedTournamentForStandings(null)}
        title={`Standings: ${selectedTournamentForStandings?.name}`}
      >
        {selectedTournamentForStandings && (
            <div className="space-y-4">
                <StandingsTable 
                    entries={(selectedTournamentForStandings.pointsTable as any) || []} 
                    sport={selectedTournamentForStandings.sport} 
                />
                <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setSelectedTournamentForStandings(null)}>Close</Button>
                </div>
            </div>
        )}
      </Modal>

      {/* Registration Modal */}
      <Modal 
        isOpen={!!selectedTournamentForRegistration}
        onClose={() => setSelectedTournamentForRegistration(null)}
        title="Register for Tournament"
      >
        {selectedTournamentForRegistration && (
            <div className="space-y-6">
                {!isRegistrationSuccess ? (
                    <>
                        <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3 border border-blue-100">
                            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-blue-800">
                                <p className="font-bold">You are registering for: {selectedTournamentForRegistration.name}</p>
                                <p className="mt-1">Please select the school team that will be participating in this {selectedTournamentForRegistration.sport} tournament.</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Select Team</label>
                            <select 
                                value={selectedTeamId}
                                onChange={(e) => setSelectedTeamId(e.target.value)}
                                className="w-full p-3 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900"
                            >
                                <option value="">-- Choose a Team --</option>
                                {getAvailableTeamsForSport(selectedTournamentForRegistration.sport).map(team => (
                                    <option key={team.id || team._id} value={team.id || team._id}>{team.name}</option>
                                ))}
                            </select>
                            {getAvailableTeamsForSport(selectedTournamentForRegistration.sport).length === 0 && (
                                <p className="text-xs text-red-500 mt-2 font-bold">
                                    No teams found for {selectedTournamentForRegistration.sport}. Please create a team first in Team Management.
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <Button variant="outline" onClick={() => setSelectedTournamentForRegistration(null)}>Cancel</Button>
                            <Button 
                                onClick={handleRegisterSubmit} 
                                disabled={!selectedTeamId || isRegistering}
                                className="px-6"
                            >
                                {isRegistering ? 'Registering...' : 'Confirm Registration'}
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8 animate-in zoom-in-95">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Registration Successful!</h3>
                        <p className="text-slate-500 mt-2">Your team has been registered. The organizer will review your application.</p>
                    </div>
                )}
            </div>
        )}
      </Modal>
  </>
    
  );
};