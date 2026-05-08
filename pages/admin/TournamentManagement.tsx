import React, { useState, useEffect } from 'react';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Plus, Calendar, Users, ChevronRight, Flag, AlertCircle, ArrowLeft, Edit2, UserCheck } from 'lucide-react';
import { Tournament, School, Match, UserRole, PointsTableEntry } from '../../types';
import { MatchDetailModal } from '../../components/fixtures/MatchDetailModal';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

import { exportToExcel } from '../../services/export';

export const TournamentManagement = () => {
  const { user } = useAuth();
  const [view, setView] = useState<'LIST' | 'DETAIL'>('LIST');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TEAMS' | 'FIXTURES' | 'STANDINGS' | 'REFEREES'>('OVERVIEW');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedSchoolForDetails, setSelectedSchoolForDetails] = useState<School | null>(null);
  
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [sports, setSports] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [allMatches, setAllMatches] = useState<any[]>([]);
  const [referees, setReferees] = useState<any[]>([]);
  const [, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UPCOMING' | 'ONGOING' | 'COMPLETED'>('ALL');
  const [sportFilter, setSportFilter] = useState<string>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);
  const [pointsTableData, setPointsTableData] = useState<PointsTableEntry[]>([]);
  
  const [selectedTeamsForRegistration, setSelectedTeamsForRegistration] = useState<string[]>([]);
  
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [newMatchData, setNewMatchData] = useState({
      teamA: '',
      teamB: '',
      date: '',
      location: ''
  });

  const handleScheduleMatch = async () => {
      if (!selectedTournament || !newMatchData.teamA || !newMatchData.teamB || !newMatchData.date) return;
      try {
          const payload = {
              tournamentId: selectedTournament._id || selectedTournament.id,
              sport: selectedTournament.sport,
              teamA: newMatchData.teamA,
              teamB: newMatchData.teamB,
              date: new Date(newMatchData.date).toISOString(),
              location: newMatchData.location,
              status: 'SCHEDULED'
          };
          const res = await api.post('/matches', payload);
          setAllMatches([...allMatches, res.data.data.match]);
          toast.success("Match scheduled successfully");
          setIsAddMatchModalOpen(false);
          setNewMatchData({ teamA: '', teamB: '', date: '', location: '' });
      } catch (err: any) {
          toast.error(err?.response?.data?.message || 'Failed to schedule match');
      }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sportsRes, tourRes, schoolsRes, teamsRes, matchesRes, refRes, studentsRes] = await Promise.all([
        api.get('/sports').catch(() => null),
        api.get('/tournaments').catch(() => null),
        api.get('/schools').catch(() => null),
        api.get('/teams').catch(() => null),
        api.get('/matches').catch(() => null),
        api.get('/users/referees').catch(() => null),
        api.get('/students').catch(() => null),
      ]);

      if (sportsRes?.data?.data?.sports) setSports(sportsRes.data.data.sports);
      
      if (tourRes?.data?.data?.tournaments?.length) {
        setTournaments(tourRes.data.data.tournaments);
      } else {
        setTournaments([]);
      }
      
      if (schoolsRes?.data?.data?.schools) setSchools(schoolsRes.data.data.schools);
      if (teamsRes?.data?.data?.teams) setTeams(teamsRes.data.data.teams);
      if (matchesRes?.data?.data?.matches) setAllMatches(matchesRes.data.data.matches);
      if (refRes?.data?.data?.referees) setReferees(refRes.data.data.referees);
      if (studentsRes?.data?.data?.students) setStudents(studentsRes.data.data.students);
      
    } catch {
      // Keep MOCK fallback values which are already default
    } finally {
      setIsLoading(false);
    }
  };

  // Filter Logic
  const filteredTournaments = tournaments.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
      const matchesSport = sportFilter === 'ALL' || t.sport === sportFilter;
      return matchesSearch && matchesStatus && matchesSport;
  });
  
  // Form State for Create/Edit
  const [formData, setFormData] = useState<Partial<Tournament>>({
      name: '',
      sport: 'Cricket',
      startDate: '',
      endDate: '',
      description: '',
      prizePool: '',
      location: '',
      organizer: '',
      isPublished: false
  });

  // Sub-modals state
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [isAddMatchModalOpen, setIsAddMatchModalOpen] = useState(false);
  const [isAssignRefModalOpen, setIsAssignRefModalOpen] = useState(false);

  const getSportIcon = (sportName: string) => {
      const sport = sports.find(s => s.name === sportName);
      return sport ? sport.icon : '🏆';
  };

  const getSportColor = (sportName: string) => {
      const sport = sports.find(s => s.name === sportName);
      if (!sport) return 'bg-slate-100';
      return sport.type === 'Indoor' ? 'bg-purple-100' : 'bg-blue-100';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONGOING': return 'bg-green-100 text-green-700 border-green-200';
      case 'UPCOMING': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'COMPLETED': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setFormData({ name: '', sport: 'Cricket', startDate: '', endDate: '', description: '', prizePool: '', location: '', organizer: '', isPublished: false });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Tournament) => {
    setIsEditMode(true);
    setFormData({ 
      ...t, 
      startDate: new Date(t.startDate).toISOString().split('T')[0],
      endDate: new Date(t.endDate).toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleSaveTournament = async () => {
    try {
      let calculatedStatus = formData.status || 'UPCOMING';
      if (formData.startDate && formData.endDate) {
          const today = new Date();
          today.setHours(0,0,0,0);
          const start = new Date(formData.startDate);
          start.setHours(0,0,0,0);
          const end = new Date(formData.endDate);
          end.setHours(23,59,59,999);
          if (today < start) calculatedStatus = 'UPCOMING';
          else if (today >= start && today <= end) calculatedStatus = 'ONGOING';
          else if (today > end) calculatedStatus = 'COMPLETED';
      }
      
      const payloadToSave = { ...formData, status: calculatedStatus };

      if (isEditMode && selectedTournament) {
          try {
            const response = await api.patch(`/tournaments/${selectedTournament._id || selectedTournament.id}`, payloadToSave);
            const updated = response.data.data.tournament;
            setTournaments(tournaments.map(t => (t._id === updated._id || t.id === updated.id) ? updated : t));
            setSelectedTournament(updated);
            toast.success("Tournament updated successfully.");
          } catch {
            const updated = { ...selectedTournament, ...payloadToSave } as Tournament;
            setTournaments(tournaments.map(t => (t._id === updated._id || t.id === updated.id) ? updated : t));
            setSelectedTournament(updated);
            toast.success("Tournament updated locally (Demo mode).");
          }
      } else {
          try {
            const response = await api.post('/tournaments', payloadToSave);
            setTournaments([response.data.data.tournament, ...tournaments]);
            toast.success("Tournament created successfully.");
          } catch {
            // Fallback for demo
            const newTournament = { ...payloadToSave, id: `t${Date.now()}`, _id: `t${Date.now()}` } as Tournament;
            setTournaments([newTournament, ...tournaments]);
            toast.success("Tournament created locally (Demo mode).");
          }
      }
      setIsModalOpen(false);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to save tournament');
    }
  };

  const handleSavePointsTable = async () => {
    try {
      if (!selectedTournament) return;
      
      const response = await api.patch(`/tournaments/${selectedTournament._id || selectedTournament.id}/points`, {
        pointsTable: pointsTableData
      });
      
      const updatedTournament = response.data.data.tournament;
      setSelectedTournament(updatedTournament);
      setTournaments(tournaments.map(t => (t._id === updatedTournament._id || t.id === updatedTournament.id) ? updatedTournament : t));
      toast.success("Points table updated successfully.");
      setIsPointsModalOpen(false);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to update points table');
    }
  };

  const handlePublishToggle = async () => {
      if (!selectedTournament) return;
      try {
          const newStatus = !selectedTournament.isPublished;
          const response = await api.patch(`/tournaments/${selectedTournament._id || selectedTournament.id}`, { isPublished: newStatus });
          const updated = response.data.data.tournament;
          setSelectedTournament(updated);
          setTournaments(tournaments.map(t => (t._id === updated._id || t.id === updated.id) ? updated : t));
          toast.success(`Tournament ${newStatus ? 'published' : 'unpublished'} successfully.`);
          setIsPublishModalOpen(false);
      } catch {
          // Fallback
          const newStatus = !selectedTournament.isPublished;
          const updated = { ...selectedTournament, isPublished: newStatus };
          setSelectedTournament(updated);
          setTournaments(tournaments.map(t => (t._id === updated._id || t.id === updated.id) ? updated : t));
          toast.success(`Tournament ${newStatus ? 'published' : 'unpublished'} locally (Demo).`);
          setIsPublishModalOpen(false);
      }
  };

  const handleManage = (t: Tournament) => {
      setSelectedTournament(t);
      setView('DETAIL');
      setActiveTab('OVERVIEW');
  };

  // --- Render Functions for Tabs ---

  const renderOverview = () => {
      if (!selectedTournament) return null;
      return (
          <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="md:col-span-2">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">About Tournament</h3>
                      <p className="text-slate-600 mb-6 leading-relaxed">{selectedTournament.description || 'No description provided.'}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Organizer</p>
                              <p className="font-medium text-slate-900">{selectedTournament.organizer || 'N/A'}</p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Prize Pool</p>
                              <p className="font-medium text-slate-900">{selectedTournament.prizePool || 'N/A'}</p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Location</p>
                              <p className="font-medium text-slate-900">{selectedTournament.location || 'N/A'}</p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Dates</p>
                              <p className="font-medium text-slate-900">
                                  {new Date(selectedTournament.startDate).toLocaleDateString()} - {new Date(selectedTournament.endDate).toLocaleDateString()}
                              </p>
                          </div>
                      </div>
                  </Card>

                  <div className="space-y-6">
                      <Card>
                          <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Participation</h3>
                          <div className="flex items-center justify-between mb-2">
                              <span className="text-slate-600">Registered Teams</span>
                              <span className="font-bold text-2xl text-slate-900">{selectedTournament.registeredTeams?.length || 0}</span>
                          </div>
                      </Card>

                      <Card className="bg-blue-50 border-blue-100">
                          <div className="flex items-start space-x-3">
                              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                              <div>
                                  <h4 className="font-bold text-blue-900 text-sm">Tournament Status</h4>
                                  <p className="text-xs text-blue-700 mt-1">
                                      This tournament is currently <strong>{selectedTournament.status}</strong>. 
                                      {selectedTournament.status === 'UPCOMING' && ' Ensure all fixtures are uploaded before start date.'}
                                  </p>
                              </div>
                          </div>
                      </Card>
                  </div>
              </div>
          </div>
      );
  };

  const renderTeams = () => {
      if (!selectedTournament) return null;
      const participatingSchools = schools.filter(s => selectedTournament.registeredTeams?.includes(s._id || s.id));
      
      return (
          <div className="space-y-6">
              <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900">Registered Schools</h3>
                  <Button size="sm" onClick={() => setIsAddTeamModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" /> Add School
                  </Button>
              </div>

              {participatingSchools.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">No schools registered yet.</p>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {participatingSchools.map(school => (
                          <Card 
                            key={school.id} 
                            className="flex items-center space-x-4 cursor-pointer hover:shadow-md transition-all"
                            onClick={() => setSelectedSchoolForDetails(school)}
                          >
                              <img src={school.logo} alt="" className="h-12 w-12 rounded-full border border-slate-200" />
                              <div>
                                  <h4 className="font-bold text-slate-900">{school.name}</h4>
                                  <p className="text-xs text-slate-500">{school.studentCount} Students</p>
                              </div>
                          </Card>
                      ))}
                  </div>
              )}
          </div>
      );
  };

  const renderFixtures = () => {
      if (!selectedTournament) return null;
      const tournamentMatches = allMatches.filter(m => m.tournamentId === (selectedTournament._id || selectedTournament.id));

      return (
          <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="text-lg font-bold text-slate-900">Match Fixtures</h3>
                  <div className="flex space-x-2">
                      <Button size="sm" onClick={() => setIsAddMatchModalOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" /> Add Match
                      </Button>
                  </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                          <tr>
                              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Match</th>
                              <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Venue</th>
                              <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
                          </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                          {tournamentMatches.length === 0 ? (
                              <tr>
                                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic">
                                      No fixtures scheduled yet. Upload or add matches manually.
                                  </td>
                              </tr>
                          ) : (
                              tournamentMatches.map(match => (
                                  <tr 
                                    key={match.id} 
                                    className="hover:bg-slate-50 cursor-pointer"
                                    onClick={() => setSelectedMatch(match)}
                                  >
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                          {new Date(match.date).toLocaleDateString()} <span className="text-xs text-slate-400 ml-1">{new Date(match.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="font-bold text-slate-900">{match.teamA} <span className="text-slate-400 font-normal mx-1">vs</span> {match.teamB}</div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-600">
                                          {match.location}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-center">
                                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                              match.status === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                                              match.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                                              'bg-yellow-100 text-yellow-700'
                                          }`}>
                                              {match.status}
                                          </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-center font-mono font-bold text-slate-900">
                                          {match.scoreA !== null ? `${match.scoreA} - ${match.scoreB}` : '-'}
                                      </td>
                                  </tr>
                              ))
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
      );
  };

  const renderStandings = () => {
      if (!selectedTournament) return null;
      const standings = selectedTournament.pointsTable?.length ? selectedTournament.pointsTable : [];

      const canEdit = user?.role === UserRole.ADMIN || (user?.role === UserRole.REFEREE && !selectedTournament.refereeEditedPointsTable);

      return (
          <div className="space-y-6">
              <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900">Points Table</h3>
                  {canEdit && (
                      <Button size="sm" onClick={() => {
                          setPointsTableData(standings);
                          setIsPointsModalOpen(true);
                      }}>
                          <Edit2 className="h-4 w-4 mr-2" /> Edit Points Table
                      </Button>
                  )}
              </div>
              
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                          <tr>
                              <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-12">Pos</th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Team</th>
                              <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">P</th>
                              <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">W</th>
                              <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">L</th>
                              <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">D</th>
                              <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Pts</th>
                          </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                          {standings.length === 0 ? (
                              <tr>
                                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 italic">
                                      No standings data available yet.
                                  </td>
                              </tr>
                          ) : (
                              standings.map((row: PointsTableEntry, idx: number) => (
                                  <tr key={idx} className="hover:bg-slate-50">
                                      <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-slate-900">
                                          {idx + 1}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                                          {row.team}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-center text-slate-600">{row.played}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-center text-green-600 font-bold">{row.won}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-center text-red-600">{row.lost}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-center text-slate-600">{row.draw}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-blue-700 text-lg">{row.points}</td>
                                  </tr>
                              ))
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
      );
  };

  const renderReferees = () => {
      if (!selectedTournament) return null;
      const tournamentMatches = allMatches.filter(m => m.tournamentId === (selectedTournament._id || selectedTournament.id));
      const matchRefereeIds = [...new Set(tournamentMatches.map(m => m.refereeId).filter(Boolean))];
      const tournamentReferees = referees.filter(r => matchRefereeIds.includes(r._id || r.id));

      return (
          <div className="space-y-6">
              <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900">Assigned Officials</h3>
              </div>

              {tournamentReferees.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      <UserCheck className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">No referees are currently assigned to any matches.</p>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tournamentReferees.map(ref => (
                          <Card key={ref.id || ref._id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                              <div className="flex items-center space-x-4 min-w-0">
                                  <img src={ref.avatar} alt="" className="h-12 w-12 rounded-full bg-slate-200 shrink-0" />
                                  <div className="min-w-0">
                                      <h4 className="font-bold text-slate-900 truncate">{ref.name}</h4>
                                      <p className="text-xs text-slate-500 truncate">{ref.email}</p>
                                  </div>
                              </div>
                              <span className="shrink-0 self-start sm:self-auto px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">
                                  Active
                              </span>
                          </Card>
                      ))}
                  </div>
              )}
          </div>
      );
  };

  // --- Main Render ---

  const renderTournamentForm = () => (
      <div className="space-y-4">
          <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Tournament Name</label>
              <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                  placeholder="e.g. City Summer Cup"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
          </div>

          <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Sport</label>
              <select 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                  value={formData.sport}
                  onChange={(e) => setFormData({...formData, sport: e.target.value})}
              >
                  <option value="">Select Sport</option>
                  {sports.map(s => (
                      <option key={s._id || s.id} value={s.name}>{s.name}</option>
                  ))}
              </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Start Date</label>
                  <input 
                      type="date" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
              </div>
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">End Date</label>
                  <input 
                      type="date" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
              </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Organizer</label>
                  <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                      placeholder="e.g. City Sports Dept"
                      value={formData.organizer}
                      onChange={(e) => setFormData({...formData, organizer: e.target.value})}
                  />
              </div>
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Prize Pool</label>
                  <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                      placeholder="e.g. ₹5,000 + Trophy"
                      value={formData.prizePool}
                      onChange={(e) => setFormData({...formData, prizePool: e.target.value})}
                  />
              </div>
          </div>

          <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Location</label>
              <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                  placeholder="e.g. Main Stadium"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
          </div>

          <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
              <textarea 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none h-24"
                  placeholder="Enter tournament details, rules summary, and location..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
          </div>
          
          {!isEditMode && (
              <div className="bg-blue-50 p-3 rounded-lg flex items-start space-x-2 text-sm text-blue-800 border border-blue-100">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p>Once created, schools will be able to register teams immediately. Ensure dates are finalized.</p>
              </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-100 gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveTournament} disabled={!formData.name || !formData.startDate}>
                  {isEditMode ? 'Save Changes' : 'Launch Tournament'}
              </Button>
          </div>
      </div>
  );

  if (view === 'DETAIL' && selectedTournament) {
      return (
          <>
              <div className="mb-6">
                  <button 
                      onClick={() => setView('LIST')}
                      className="flex items-center text-slate-500 hover:text-slate-900 transition-colors mb-4"
                  >
                      <ArrowLeft className="h-4 w-4 mr-1" /> Back to Tournaments
                  </button>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start space-x-4">
                          <div className={`h-16 w-16 rounded-xl flex items-center justify-center text-3xl shadow-sm ${getSportColor(selectedTournament.sport)}`}>
                              {getSportIcon(selectedTournament.sport)}
                          </div>
                          <div>
                              <h1 className="text-2xl font-bold text-slate-900">{selectedTournament.name}</h1>
                              <div className="flex items-center space-x-3 mt-1">
                                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${getStatusColor(selectedTournament.status)}`}>
                                      {selectedTournament.status}
                                  </span>
                                  <span className="text-slate-500 text-sm flex items-center">
                                      <Calendar className="h-3.5 w-3.5 mr-1" /> 
                                      {new Date(selectedTournament.startDate).getFullYear()} Season
                                  </span>
                              </div>
                          </div>
                      </div>
                      <div className="flex space-x-2">
                          <Button variant="outline" onClick={() => handleOpenEdit(selectedTournament)}>
                              <Edit2 className="h-4 w-4 mr-2" /> Edit Details
                          </Button>
                          <Button onClick={() => setIsPublishModalOpen(true)} variant={selectedTournament.isPublished ? 'outline' : 'primary'}>
                              {selectedTournament.isPublished ? 'Unpublish' : 'Publish Changes'}
                          </Button>
                      </div>
                  </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-slate-200 mb-6 overflow-x-auto">
                  <div className="flex space-x-8 min-w-max">
                      {['OVERVIEW', 'TEAMS', 'FIXTURES', 'STANDINGS', 'REFEREES'].map((tab) => (
                          <button
                              key={tab}
                              onClick={() => setActiveTab(tab as 'OVERVIEW' | 'TEAMS' | 'FIXTURES' | 'STANDINGS' | 'REFEREES')}
                              className={`pb-4 text-sm font-bold border-b-2 transition-colors ${
                                  activeTab === tab 
                                  ? 'border-blue-600 text-blue-600' 
                                  : 'border-transparent text-slate-500 hover:text-slate-700'
                              }`}
                          >
                              {tab.charAt(0) + tab.slice(1).toLowerCase()}
                          </button>
                      ))}
                  </div>
              </div>

              {/* Tab Content */}
              <div className="animate-in fade-in duration-300">
                  {activeTab === 'OVERVIEW' && renderOverview()}
                  {activeTab === 'TEAMS' && renderTeams()}
                  {activeTab === 'FIXTURES' && renderFixtures()}
                  {activeTab === 'STANDINGS' && renderStandings()}
                  {activeTab === 'REFEREES' && renderReferees()}
              </div>

              {/* Modals for Detail View */}
              <MatchDetailModal 
                match={selectedMatch} 
                onClose={() => setSelectedMatch(null)} 
                isAdmin={true}
                teams={teams}
                students={students}
                referees={referees}
              />

              <Modal 
                isOpen={!!selectedSchoolForDetails} 
                onClose={() => setSelectedSchoolForDetails(null)} 
                title={selectedSchoolForDetails?.name || 'School Details'}
              >
                {selectedSchoolForDetails && (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <img src={selectedSchoolForDetails.logo} className="h-16 w-16 rounded-full border" />
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{selectedSchoolForDetails.name}</h3>
                                <p className="text-sm text-slate-500">{selectedSchoolForDetails.address}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-3 border-b pb-2">Participating Teams</h4>
                            {teams.filter(t => t.schoolId === selectedSchoolForDetails.id || t.schoolId === selectedSchoolForDetails._id).length > 0 ? (
                                <div className="space-y-4">
                                    {teams.filter(t => t.schoolId === selectedSchoolForDetails.id || t.schoolId === selectedSchoolForDetails._id).map(team => (
                                        <div key={team.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h5 className="font-bold text-slate-900">{team.name}</h5>
                                                    <span className="text-xs font-bold text-slate-500 uppercase">{team.sport}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-3">
                                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Roster</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {team.playerIds.map((pid: string) => {
                                                        const player = students.find(s => s.id === pid || s._id === pid);
                                                        return player ? (
                                                            <div key={player.id} className="flex items-center space-x-1 bg-white px-2 py-1 rounded border border-slate-200 text-xs">
                                                                <img src={player.avatar} className="h-4 w-4 rounded-full" />
                                                                <span>{player.name}</span>
                                                            </div>
                                                        ) : null;
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500 italic">No teams found for this school.</p>
                            )}
                        </div>
                        
                        <div className="flex justify-end pt-4">
                            <Button onClick={() => setSelectedSchoolForDetails(null)}>Close</Button>
                        </div>
                    </div>
                )}
              </Modal>

              {/* Add Team Modal */}
              <Modal isOpen={isAddTeamModalOpen} onClose={() => { setIsAddTeamModalOpen(false); setSelectedTeamsForRegistration([]); }} title="Add Team to Tournament">
                  <div className="space-y-4">
                      <p className="text-sm text-slate-500">Select teams to register for this tournament.</p>
                      <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-2">
                          {(teams.filter(t => t.sport === selectedTournament.sport && !selectedTournament.registeredTeams?.includes(t.id || t._id))).length === 0 ? (
                              <p className="text-sm text-slate-500 text-center py-4">No eligible teams found.</p>
                          ) : (
                              teams.filter(t => t.sport === selectedTournament.sport && !selectedTournament.registeredTeams?.includes(t.id || t._id)).map(team => {
                                  const school = schools.find(s => s._id === team.schoolId || s.id === team.schoolId);
                                  return (
                                      <div key={team.id || team._id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded cursor-pointer"
                                           onClick={() => {
                                               const tid = team._id || team.id;
                                               if (selectedTeamsForRegistration.includes(tid)) {
                                                   setSelectedTeamsForRegistration(selectedTeamsForRegistration.filter(id => id !== tid));
                                               } else {
                                                   setSelectedTeamsForRegistration([...selectedTeamsForRegistration, tid]);
                                               }
                                           }}
                                      >
                                          <div className="flex items-center space-x-3">
                                              {school?.logo ? <img src={school.logo} className="h-8 w-8 rounded-full" /> : <div className="h-8 w-8 rounded-full bg-slate-200"></div>}
                                              <div>
                                                  <span className="font-medium text-slate-900 block leading-tight">{team.name}</span>
                                                  <span className="text-xs text-slate-500">{school?.name || 'Unknown School'}</span>
                                              </div>
                                          </div>
                                          <input 
                                              type="checkbox" 
                                              className="h-4 w-4 text-blue-600 rounded cursor-pointer" 
                                              checked={selectedTeamsForRegistration.includes(team._id || team.id)} 
                                              readOnly
                                          />
                                      </div>
                                  );
                              })
                          )}
                      </div>
                      <div className="flex justify-end pt-4 gap-2">
                          <Button variant="outline" onClick={() => { setIsAddTeamModalOpen(false); setSelectedTeamsForRegistration([]); }}>Cancel</Button>
                          <Button 
                                onClick={async () => {
                                    if (!selectedTournament || selectedTeamsForRegistration.length === 0) return;
                                    try {
                                        let updatedTour = selectedTournament;
                                        for (const teamId of selectedTeamsForRegistration) {
                                            const res = await api.post(`/tournaments/${selectedTournament._id || selectedTournament.id}/register`, { teamId });
                                            updatedTour = res.data.data.tournament;
                                        }
                                        setSelectedTournament(updatedTour);
                                        setTournaments(tournaments.map(t => (t._id === updatedTour._id || t.id === updatedTour.id) ? updatedTour : t));
                                        toast.success("Teams registered successfully");
                                    } catch (err: any) {
                                        toast.error(err?.response?.data?.message || 'Failed to register teams');
                                    }
                                    setIsAddTeamModalOpen(false);
                                    setSelectedTeamsForRegistration([]);
                                }} 
                                disabled={selectedTeamsForRegistration.length === 0}
                          >
                                Register Selected
                          </Button>
                      </div>
                  </div>
              </Modal>

              <Modal isOpen={isAddMatchModalOpen} onClose={() => { setIsAddMatchModalOpen(false); setNewMatchData({ teamA: '', teamB: '', date: '', location: '' }); }} title="Schedule New Match">
                  <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Team A</label>
                              <select 
                                  className="w-full p-2 border rounded-lg"
                                  value={newMatchData.teamA}
                                  onChange={(e) => setNewMatchData({ ...newMatchData, teamA: e.target.value })}
                              >
                                  <option value="">Select Team</option>
                                  {teams.filter(t => selectedTournament?.registeredTeams?.includes(t._id || t.id)).map(t => (
                                      <option key={t.id || t._id} value={t.id || t._id}>{t.name}</option>
                                  ))}
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Team B</label>
                              <select 
                                  className="w-full p-2 border rounded-lg"
                                  value={newMatchData.teamB}
                                  onChange={(e) => setNewMatchData({ ...newMatchData, teamB: e.target.value })}
                              >
                                  <option value="">Select Team</option>
                                  {teams.filter(t => selectedTournament?.registeredTeams?.includes(t._id || t.id)).map(t => (
                                      <option key={t.id || t._id} value={t.id || t._id}>{t.name}</option>
                                  ))}
                              </select>
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date & Time</label>
                          <input 
                              type="datetime-local" 
                              className="w-full p-2 border rounded-lg"
                              value={newMatchData.date}
                              onChange={(e) => setNewMatchData({ ...newMatchData, date: e.target.value })}
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Venue</label>
                          <input 
                              type="text" 
                              className="w-full p-2 border rounded-lg" 
                              placeholder="e.g. City Stadium"
                              value={newMatchData.location}
                              onChange={(e) => setNewMatchData({ ...newMatchData, location: e.target.value })}
                          />
                      </div>
                      <div className="flex justify-end pt-4">
                          <Button onClick={handleScheduleMatch}>Schedule Match</Button>
                      </div>
                  </div>
              </Modal>
              
              <Modal isOpen={isAssignRefModalOpen} onClose={() => setIsAssignRefModalOpen(false)} title="Assign Referee">
                  <div className="space-y-4">
                      <p className="text-sm text-slate-500">Select referees to officiate this tournament.</p>
                      <div className="space-y-2">
                          {referees.map(ref => (
                              <div key={ref.id || ref._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                                  <div className="flex items-center space-x-3">
                                      <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center font-bold text-xs">
                                          {ref.name.charAt(0)}
                                      </div>
                                      <div>
                                          <p className="text-sm font-bold text-slate-900">{ref.name}</p>
                                          <p className="text-xs text-slate-500">Rating: 4.8/5</p>
                                      </div>
                                  </div>
                                  <Button size="sm" variant="outline">Assign</Button>
                              </div>
                          ))}
                      </div>
                  </div>
              </Modal>
              
              <Modal isOpen={isPublishModalOpen} onClose={() => setIsPublishModalOpen(false)} title="Confirm Publish">
                  <div className="space-y-4">
                      <p className="text-sm text-slate-600">
                          Are you sure you want to {selectedTournament.isPublished ? 'unpublish' : 'publish'} this tournament? 
                          {selectedTournament.isPublished 
                              ? ' It will be hidden from the public home page.' 
                              : ' It will be visible on the public home page.'}
                      </p>
                      <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline" onClick={() => setIsPublishModalOpen(false)}>Cancel</Button>
                          <Button onClick={handlePublishToggle}>Confirm</Button>
                      </div>
                  </div>
              </Modal>

              {/* Edit Modal Reuse */}
              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Tournament Details">
                  {renderTournamentForm()}
              </Modal>
          </>
      );
  }

  // --- List View ---

  return (<>
    
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tournaments</h1>
          <p className="text-slate-500">Create and manage inter-school leagues.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => exportToExcel(tournaments, 'Tournaments')}>Export Excel</Button>
          <Button onClick={handleOpenCreate} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" /> Create Tournament
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full md:w-auto relative">
                  <input 
                      type="text" 
                      placeholder="Search tournaments..." 
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute left-3 top-2.5 text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                  </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                  <select 
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'UPCOMING' | 'ONGOING' | 'COMPLETED')}
                  >
                      <option value="ALL">All Status</option>
                      <option value="UPCOMING">Upcoming</option>
                      <option value="ONGOING">Ongoing</option>
                      <option value="COMPLETED">Completed</option>
                  </select>
                  <select 
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      value={sportFilter}
                      onChange={(e) => setSportFilter(e.target.value)}
                  >
                      <option value="ALL">All Sports</option>
                      {sports.map(s => (
                          <option key={s._id || s.id} value={s.name}>{s.name}</option>
                      ))}
                  </select>
              </div>
          </div>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {filteredTournaments.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500 font-medium">No tournaments found matching your criteria.</p>
            </div>
        ) : (
            filteredTournaments.map((tournament) => (
          <Card key={tournament._id || tournament.id} className="hover:shadow-md transition-shadow group">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className={`h-16 w-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 shadow-sm ${getSportColor(tournament.sport)}`}>
                  {getSportIcon(tournament.sport)}
                </div>
                <div>
                  <div className="flex items-center flex-wrap gap-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{tournament.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${getStatusColor(tournament.status)}`}>
                      {tournament.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-slate-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1.5" />
                      {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1.5" />
                      {tournament.teams} Teams
                    </div>
                    <div className="flex items-center font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      <Flag className="h-3 w-3 mr-1" />
                      {tournament.sport}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 border-t lg:border-t-0 pt-4 lg:pt-0">
                <Button variant="primary" className="flex items-center flex-1 lg:flex-none justify-center w-full lg:w-auto" onClick={() => handleManage(tournament)}>
                  Manage Tournament <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </Card>
        )))}
      </div>

      {/* Create Tournament Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Tournament"
      >
          {renderTournamentForm()}
      </Modal>

      <Modal isOpen={isPointsModalOpen} onClose={() => setIsPointsModalOpen(false)} title="Edit Points Table">
          <div className="space-y-4">
              <div className="bg-yellow-50 p-3 rounded-lg flex items-start space-x-2 text-sm text-yellow-800 border border-yellow-100">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p>Update the points table carefully. Referees can only edit this once.</p>
              </div>
              
              <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                          <tr>
                              <th className="px-2 py-2 text-left text-xs font-bold text-slate-500 uppercase">Team</th>
                              <th className="px-2 py-2 text-center text-xs font-bold text-slate-500 uppercase">P</th>
                              <th className="px-2 py-2 text-center text-xs font-bold text-slate-500 uppercase">W</th>
                              <th className="px-2 py-2 text-center text-xs font-bold text-slate-500 uppercase">L</th>
                              <th className="px-2 py-2 text-center text-xs font-bold text-slate-500 uppercase">D</th>
                              <th className="px-2 py-2 text-center text-xs font-bold text-slate-500 uppercase">Pts</th>
                          </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                          {pointsTableData.map((row, idx) => (
                              <tr key={idx}>
                                  <td className="px-2 py-2">
                                      <input 
                                          type="text" 
                                          className="w-full p-1 border border-slate-300 rounded text-sm"
                                          value={row.team}
                                          onChange={(e) => {
                                              const newData = [...pointsTableData];
                                              newData[idx].team = e.target.value;
                                              setPointsTableData(newData);
                                          }}
                                      />
                                  </td>
                                  <td className="px-2 py-2">
                                      <input 
                                          type="number" 
                                          className="w-12 p-1 border border-slate-300 rounded text-sm text-center"
                                          value={row.played}
                                          onChange={(e) => {
                                              const newData = [...pointsTableData];
                                              newData[idx].played = parseInt(e.target.value) || 0;
                                              setPointsTableData(newData);
                                          }}
                                      />
                                  </td>
                                  <td className="px-2 py-2">
                                      <input 
                                          type="number" 
                                          className="w-12 p-1 border border-slate-300 rounded text-sm text-center"
                                          value={row.won}
                                          onChange={(e) => {
                                              const newData = [...pointsTableData];
                                              newData[idx].won = parseInt(e.target.value) || 0;
                                              setPointsTableData(newData);
                                          }}
                                      />
                                  </td>
                                  <td className="px-2 py-2">
                                      <input 
                                          type="number" 
                                          className="w-12 p-1 border border-slate-300 rounded text-sm text-center"
                                          value={row.lost}
                                          onChange={(e) => {
                                              const newData = [...pointsTableData];
                                              newData[idx].lost = parseInt(e.target.value) || 0;
                                              setPointsTableData(newData);
                                          }}
                                      />
                                  </td>
                                  <td className="px-2 py-2">
                                      <input 
                                          type="number" 
                                          className="w-12 p-1 border border-slate-300 rounded text-sm text-center"
                                          value={row.draw}
                                          onChange={(e) => {
                                              const newData = [...pointsTableData];
                                              newData[idx].draw = parseInt(e.target.value) || 0;
                                              setPointsTableData(newData);
                                          }}
                                      />
                                  </td>
                                  <td className="px-2 py-2">
                                      <input 
                                          type="number" 
                                          className="w-12 p-1 border border-slate-300 rounded text-sm text-center font-bold"
                                          value={row.points}
                                          onChange={(e) => {
                                              const newData = [...pointsTableData];
                                              newData[idx].points = parseInt(e.target.value) || 0;
                                              setPointsTableData(newData);
                                          }}
                                      />
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                  <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4 w-full"
                      onClick={() => setPointsTableData([...pointsTableData, { team: '', played: 0, won: 0, lost: 0, draw: 0, points: 0, rank: pointsTableData.length + 1, sport: selectedTournament?.sport || '' }])}
                  >
                      <Plus className="h-4 w-4 mr-2" /> Add Team Row
                  </Button>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 gap-2">
                  <Button variant="outline" onClick={() => setIsPointsModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleSavePointsTable}>Save Points Table</Button>
              </div>
          </div>
      </Modal></>
    
  );
};