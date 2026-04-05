import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { MOCK_TEAMS, MOCK_STUDENTS } from '../../services/mockData';
import { Users, Plus, ChevronRight, Trophy, UserPlus, Trash2, User } from 'lucide-react';
import { Team } from '../../types';
import toast from 'react-hot-toast';

import { exportToExcel } from '../../services/export';

export const TeamManagement = () => {
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);
  
  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Form States
  const [newTeam, setNewTeam] = useState({ name: '', sport: 'Cricket', coach: '', season: '2024' });
  const [selectedStudentId, setSelectedStudentId] = useState('');

  const getPlayerCount = (playerIds: string[]) => playerIds.length;
  
  // Get available students (not in selected team)
  const availableStudents = MOCK_STUDENTS.filter(s => 
    selectedTeam ? !selectedTeam.playerIds.includes(s.id) : true
  );

  const handleCreateTeam = () => {
    const team: Team = {
        id: `team${teams.length + 1}`,
        name: newTeam.name,
        sport: newTeam.sport,
        schoolId: 's1', // Hardcoded for demo
        coach: newTeam.coach,
        playerIds: [],
        season: newTeam.season,
        stats: { played: 0, won: 0, lost: 0, draw: 0 }
    };
    setTeams([...teams, team]);
    setIsCreateModalOpen(false);
    setNewTeam({ name: '', sport: 'Cricket', coach: '', season: '2024' }); // Reset
    toast.success("Team created successfully.");
  };

  const handleOpenRoster = (team: Team) => {
    setSelectedTeam(team);
    setIsRosterModalOpen(true);
  };

  const handleAddPlayer = () => {
    if (selectedTeam && selectedStudentId) {
        const updatedTeam = { 
            ...selectedTeam, 
            playerIds: [...selectedTeam.playerIds, selectedStudentId] 
        };
        setTeams(teams.map(t => t.id === updatedTeam.id ? updatedTeam : t));
        setSelectedTeam(updatedTeam);
        setSelectedStudentId('');
        toast.success("Player added to roster.");
    }
  };

  const handleRemovePlayer = (playerId: string) => {
      if (selectedTeam) {
          const updatedTeam = {
              ...selectedTeam,
              playerIds: selectedTeam.playerIds.filter(id => id !== playerId)
          };
          setTeams(teams.map(t => t.id === updatedTeam.id ? updatedTeam : t));
          setSelectedTeam(updatedTeam);
          toast.success("Player removed from roster.");
      }
  };

  const getStudentName = (id: string) => {
      const s = MOCK_STUDENTS.find(student => student.id === id);
      return s ? s.name : 'Unknown Student';
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Teams</h1>
          <p className="text-slate-500">Manage your sports teams, coaches, and rosters.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => exportToExcel(teams, 'Teams')}>Export Excel</Button>
          <Button className="flex items-center" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Create Team
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card key={team.id} className="relative group hover:shadow-lg transition-shadow border border-slate-200">
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
                <div className="flex items-center text-xs text-slate-500 mt-1">
                     <User className="h-3 w-3 mr-1" /> Coach: {team.coach}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-slate-100 my-4 text-center">
              <div>
                 <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Played</p>
                 <p className="font-bold text-slate-900 text-lg">{team.stats.played}</p>
              </div>
              <div>
                 <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Won</p>
                 <p className="font-bold text-green-600 text-lg">{team.stats.won}</p>
              </div>
              <div>
                 <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Win Rate</p>
                 <p className="font-bold text-blue-600 text-lg">
                   {team.stats.played > 0 ? Math.round((team.stats.won / team.stats.played) * 100) : 0}%
                 </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-slate-600 font-medium">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{getPlayerCount(team.playerIds)} Players</span>
                </div>
                <div className="flex -space-x-2">
                  {team.playerIds.slice(0, 3).map((pid, idx) => (
                    <img 
                      key={idx} 
                      className="h-7 w-7 rounded-full border-2 border-white bg-slate-200" 
                      src={`https://picsum.photos/seed/${pid}/50`} 
                      alt="" 
                    />
                  ))}
                  {team.playerIds.length > 3 && (
                    <div className="h-7 w-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                      +{team.playerIds.length - 3}
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
                        <option value="Basketball">Basketball</option>
                        <option value="Badminton">Badminton</option>
                        <option value="Football">Football</option>
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

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Assign Coach</label>
                <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-slate-900"
                    placeholder="Enter Coach Name"
                    value={newTeam.coach}
                    onChange={(e) => setNewTeam({...newTeam, coach: e.target.value})}
                />
                <p className="text-xs text-slate-500 mt-1">
                    Enter the full name of the school staff member managing this team.
                </p>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 gap-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateTeam} disabled={!newTeam.name || !newTeam.coach}>Create Team</Button>
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
                <div className="bg-blue-50 p-4 rounded-lg flex items-end gap-3 border border-blue-100">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-blue-800 uppercase mb-1">Add Player to Roster</label>
                        <select 
                            className="w-full p-2.5 bg-white border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900"
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                        >
                            <option value="">Select a student...</option>
                            {availableStudents.map(student => (
                                <option key={student.id} value={student.id}>{student.name} ({student.grade})</option>
                            ))}
                        </select>
                    </div>
                    <Button onClick={handleAddPlayer} disabled={!selectedStudentId} className="h-[42px]">
                        <UserPlus className="h-4 w-4 mr-1" /> Add
                    </Button>
                </div>

                <div>
                    <h4 className="font-bold text-slate-900 mb-3 flex items-center justify-between">
                        Current Roster 
                        <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            {selectedTeam.playerIds.length} Players
                        </span>
                    </h4>
                    <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50">
                        {selectedTeam.playerIds.length === 0 ? (
                            <div className="p-8 text-center text-sm text-slate-500 italic">No players assigned yet. Add players from above.</div>
                        ) : (
                            selectedTeam.playerIds.map(pid => (
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
                            ))
                        )}
                    </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <Button onClick={() => setIsRosterModalOpen(false)}>Done</Button>
                </div>
            </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};