import React, { useState, useEffect } from 'react';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Users, Plus, ChevronRight, Trophy, UserPlus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Student {
  _id: string;
  id: string;
  name: string;
  grade: string;
  email?: string;
  studentId?: string;
}

interface Team {
  _id?: string;
  id?: string;
  name: string;
  sport: string;
  schoolId: string;
  players: any[];
  season: string;
  stats: any;
}

export const TeamManagement = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  
  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Form States
  const [newTeam, setNewTeam] = useState({ name: '', sport: 'Cricket', season: '2024' });

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        if (user?.schoolId) {
          const res = await api.get(`/schools/${user.schoolId}/teams`);
          setTeams(res.data.data.teams);
        }
      } catch {
        toast.error('Failed to load teams');
      }
    };

    const fetchStudents = async () => {
      try {
        if (user?.schoolId) {
          const res = await api.get(`/schools/${user.schoolId}/students`);
          const formatted = res.data.data.students.map((s: any) => ({ ...s, id: s._id }));
          setAllStudents(formatted);
        }
      } catch {
        toast.error('Failed to load students');
      }
    };

    if (user) {
      fetchTeams();
      fetchStudents();
    }
  }, [user]);

  const getPlayerCount = (players: any[]) => players?.length || 0;
  
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  // Get available students (not in selected team)
  const availableStudents = allStudents.filter(s => 
    selectedTeam ? !(selectedTeam.players || []).some((p: any) => p._id === s._id || p === s._id) : true
  );

  const filteredAvailableStudents = availableStudents.filter(s => {
    const q = studentSearchQuery.toLowerCase();
    const idString = s._id || s.id || '';
    return s.name.toLowerCase().includes(q) || 
           (s.email && s.email.toLowerCase().includes(q)) || 
           (s.studentId && s.studentId.toLowerCase().includes(q)) || 
           idString.toLowerCase().includes(q);
  });

  const handleCreateTeam = async () => {
    try {
      const teamPayload = {
        name: newTeam.name,
        sport: newTeam.sport,
        schoolId: user?.schoolId,
        season: newTeam.season,
      };
      const res = await api.post('/teams', teamPayload);
      setTeams([...teams, res.data.data.team]);
      setIsCreateModalOpen(false);
      setNewTeam({ name: '', sport: 'Cricket', season: '2024' });
      toast.success("Team created successfully.");
    } catch {
      toast.error("Failed to create team.");
    }
  };

  const handleOpenRoster = (team: Team) => {
    setSelectedTeam(team);
    setIsRosterModalOpen(true);
  };

  const handleAddPlayer = async (studentId: string) => {
    if (selectedTeam && studentId) {
      try {
        const currentPlayers = selectedTeam.players ? selectedTeam.players.map((p: any) => p._id || p) : [];
        const updatedPlayers = [...currentPlayers, studentId];
        const res = await api.patch(`/teams/${selectedTeam._id || selectedTeam.id}`, { players: updatedPlayers });
        setTeams(teams.map(t => (t._id || t.id) === res.data.data.team._id ? res.data.data.team : t));
        setSelectedTeam(res.data.data.team);
        toast.success("Player added to roster.");
      } catch {
        toast.error("Failed to add player.");
      }
    }
  };

  const handleRemovePlayer = async (playerId: string) => {
    if (selectedTeam) {
      try {
        const currentPlayers = selectedTeam.players ? selectedTeam.players.map((p: any) => p._id || p) : [];
        const updatedPlayers = currentPlayers.filter((id: string) => id !== playerId);
        const res = await api.patch(`/teams/${selectedTeam._id || selectedTeam.id}`, { players: updatedPlayers });
        setTeams(teams.map(t => (t._id || t.id) === res.data.data.team._id ? res.data.data.team : t));
        setSelectedTeam(res.data.data.team);
        toast.success("Player removed from roster.");
      } catch {
        toast.error("Failed to remove player.");
      }
    }
  };

  const getStudentName = (id: string) => {
    const s = allStudents.find(student => student._id === id || student.id === id);
    return s ? s.name : 'Unknown Student';
  };

  return (<>
    
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Teams</h1>
          <p className="text-slate-500">Manage your sports teams and rosters.</p>
        </div>
        <div className="flex space-x-2">
          <Button className="flex items-center" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Create Team
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card key={team._id || team.id} className="relative group hover:shadow-lg transition-shadow border border-slate-200">
            <div className="absolute top-4 right-4">
               <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase border border-slate-200">
                 {team.season}
               </span>
            </div>
            
            <div className="flex items-start space-x-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-xl">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight">{team.name}</h3>
                <p className="text-sm text-slate-500 mt-1 font-medium">{team.sport}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-slate-100 my-4 text-center">
              <div>
                 <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Played</p>
                 <p className="font-bold text-slate-900 text-lg">{team.stats?.played || 0}</p>
              </div>
              <div>
                 <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Won</p>
                 <p className="font-bold text-green-600 text-lg">{team.stats?.won || 0}</p>
              </div>
              <div>
                 <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Win Rate</p>
                 <p className="font-bold text-blue-600 text-lg">
                   {(team.stats?.played || 0) > 0 ? Math.round((team.stats.won / team.stats.played) * 100) : 0}%
                 </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-slate-600 font-medium">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{getPlayerCount(team.players)} Players</span>
                </div>
                <div className="flex -space-x-2">
                  {(team.players || []).slice(0, 3).map((player: any, idx: number) => (
                    <img 
                      key={idx} 
                      className="h-7 w-7 rounded-full border-2 border-white bg-slate-200" 
                      src={`https://picsum.photos/seed/${player._id || player}/50`} 
                      alt="" 
                    />
                  ))}
                  {(team.players || []).length > 3 && (
                    <div className="h-7 w-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                      +{(team.players?.length || 0) - 3}
                    </div>
                  )}
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-between group-hover:bg-slate-50 group-hover:border-blue-200 transition-colors"
                onClick={() => handleOpenRoster(team)}
              >
                Manage Roster <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}

        {/* Create New Card */}
        <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors h-full min-h-[250px] group bg-white"
        >
          <div className="h-12 w-12 rounded-full bg-slate-100 group-hover:bg-blue-200 flex items-center justify-center mb-4 transition-colors">
            <Plus className="h-6 w-6 text-slate-400 group-hover:text-blue-600" />
          </div>
          <h3 className="font-bold text-slate-900">Create New Team</h3>
          <p className="text-sm text-slate-500 text-center mt-2 max-w-[200px]">
            Form a new team for the upcoming season.
          </p>
        </button>
      </div>

      {/* Create Team Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Team"
      >
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Team Name</label>
                <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-slate-900"
                    placeholder="e.g. Springfield Spartans"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Sport</label>
                    <select 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-slate-900"
                        value={newTeam.sport}
                        onChange={(e) => setNewTeam({...newTeam, sport: e.target.value})}
                    >
                        <option value="Cricket">Cricket</option>
                        <option value="Badminton">Badminton</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Season</label>
                    <input 
                        type="text" 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-slate-900"
                        placeholder="e.g. 2024"
                        value={newTeam.season}
                        onChange={(e) => setNewTeam({...newTeam, season: e.target.value})}
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 gap-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateTeam} disabled={!newTeam.name}>Create Team</Button>
            </div>
        </div>
      </Modal>

      {/* Roster Management Modal */}
      <Modal
        isOpen={isRosterModalOpen}
        onClose={() => setIsRosterModalOpen(false)}
        title={selectedTeam ? `Manage Roster: ${selectedTeam.name}` : 'Manage Roster'}
      >
        {selectedTeam && (
            <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg flex flex-col gap-3 border border-blue-100">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-blue-800 uppercase mb-1">Search & Add Player to Roster</label>
                        <div className="flex items-center gap-2 mb-3">
                            <input 
                                type="text" 
                                placeholder="Search by name, email or ID..."
                                className="w-full px-3 py-2 border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                value={studentSearchQuery}
                                onChange={(e) => setStudentSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="max-h-40 overflow-y-auto border border-blue-200 rounded-lg divide-y divide-blue-100 bg-white">
                            {filteredAvailableStudents.length === 0 ? (
                                <div className="p-4 text-center text-sm text-slate-500 italic">No available students found.</div>
                            ) : (
                                filteredAvailableStudents.slice(0, studentSearchQuery ? undefined : 5).map(student => (
                                    <div key={student._id || student.id} className="flex justify-between items-center p-2.5 hover:bg-slate-50 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-800">{student.name}</span>
                                            <span className="text-xs text-slate-500">{student.grade} | {student.studentId || student.email || 'No ID'}</span>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            onClick={() => handleAddPlayer(student._id || student.id)}
                                            className="h-7 text-xs py-1 px-3"
                                        >
                                            <UserPlus className="h-3 w-3 mr-1" /> Add
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-slate-900 mb-3 flex items-center justify-between">
                        Current Roster 
                        <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            {selectedTeam.players?.length || 0} Players
                        </span>
                    </h4>
                    <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50">
                        {!selectedTeam.players || selectedTeam.players.length === 0 ? (
                            <div className="p-8 text-center text-sm text-slate-500 italic">No players assigned yet. Add players from above.</div>
                        ) : (
                            selectedTeam.players.map((p: any) => {
                                const pid = p._id || p;
                                return (
                                <div key={pid} className="flex justify-between items-center p-3 hover:bg-white transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-8 w-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-700 shadow-sm">
                                            {getStudentName(pid).charAt(0)}
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{getStudentName(pid)}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleRemovePlayer(pid)}
                                        className="text-slate-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                )
                            })
                        )}
                    </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <Button onClick={() => setIsRosterModalOpen(false)}>Done</Button>
                </div>
            </div>
        )}
      </Modal></>
    
  );
};