import React, { useState, useEffect } from 'react';

import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { Users } from 'lucide-react';
import { Team } from '../../types';

import api from '../../services/api';

// Helper to render player grid (reused in card and modal)
const PlayerGrid = ({ playerIds, limit = 100, currentUserId }: { playerIds: string[], limit?: number, currentUserId?: string }) => (
    <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
        {playerIds.slice(0, limit).map((pid, i) => (
            <div key={i} className="flex flex-col items-center">
            <div className="relative">
                <img 
                    src={`https://picsum.photos/seed/${pid}/100`} 
                    alt="Player" 
                    className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 bg-slate-700 text-white text-[9px] px-1 rounded-full border border-white">
                    #{10 + i}
                </span>
            </div>
            <span className="text-[10px] font-medium text-slate-700 mt-1 truncate w-full text-center">
                {pid === currentUserId ? 'You' : `Player ${i+1}`}
            </span>
            <span className="text-[9px] text-slate-400">
                {i === 0 ? 'Captain' : 'Member'}
            </span>
            </div>
        ))}
    </div>
);

export const StudentTeams = () => {
  const { user } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  const [myTeams, setMyTeams] = useState<any[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
        try {
            if (!user) return;
            const res = await api.get('/teams');
            const filtered = res.data.data.teams.filter((t: any) => t.players && t.players.some((p: any) => p.studentId === user.email || p._id === user.id || p.id === user.id));
            setMyTeams(filtered);
        } catch (err) { console.error(err); }
    };
    fetchTeams();
  }, [user]);

  return (<>
    
      <div className="mb-8 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">My Teams</h1>
            <p className="text-slate-500">Squad details, rosters, and stats.</p>
        </div>
      </div>

      {myTeams.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <Users className="h-10 w-10 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">No Teams Yet</h3>
            <p className="text-slate-500">You are not currently part of any teams for the active season.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myTeams.map(team => (
          <Card key={team.id} className="overflow-visible h-full flex flex-col">
            <div className="relative pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                        {team.sport === 'Cricket' ? '🏏' : team.sport === 'Badminton' ? '🏸' : '🏸'}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">{team.name}</h3>
                        <p className="text-sm text-slate-500">{team.season} Season</p>
                    </div>
                </div>
                {/* Win Rate Badge */}
                <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Win Rate</p>
                    <p className="text-lg font-bold text-green-600">
                        {team.stats.played > 0 ? Math.round((team.stats.won / team.stats.played) * 100) : 0}%
                    </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 flex-1">
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-sm font-semibold text-slate-700 flex items-center">
                            <Users className="h-4 w-4 mr-2" /> Teammates ({(team.players || []).length})
                        </p>
                    </div>
                    
                    {/* Show first 8 players, truncate if more */}
                    <PlayerGrid playerIds={(team.players || []).map((p: any) => p.name || p.id || p)} limit={8} currentUserId={user?.name || user?.id} />

                    {(team.players || []).length > 8 && (
                         <div className="mt-4 text-center">
                            <Button variant="outline" size="sm" onClick={() => setSelectedTeam(team)} className="w-full">
                                View Full Roster ({(team.players || []).length})
                            </Button>
                         </div>
                    )}
                </div>
            </div>
             
             {/* Stats Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100">
                 <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                        <p className="text-slate-400 text-xs uppercase">Played</p>
                        <p className="font-bold text-slate-900">{team.stats.played}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase">Won</p>
                        <p className="font-bold text-green-600">{team.stats.won}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase">Lost</p>
                        <p className="font-bold text-red-600">{team.stats.lost}</p>
                    </div>
                </div>
            </div>
          </Card>
        ))}
      </div>
      )}

      {/* Full Roster Modal */}
      <Modal 
        isOpen={!!selectedTeam} 
        onClose={() => setSelectedTeam(null)} 
        title={selectedTeam ? `${selectedTeam.name} - Full Roster` : ''}
      >
        {selectedTeam && (
            <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-sm text-blue-800 font-bold">Season: {selectedTeam.season}</p>
                    </div>
                    <span className="text-2xl">{selectedTeam.sport === 'Cricket' ? '🏏' : selectedTeam.sport === 'Badminton' ? '🏸' : '🏸'}</span>
                </div>
                
                <div>
                    <h4 className="font-bold text-slate-900 mb-4">Players ({(selectedTeam.players || []).length})</h4>
                    <PlayerGrid playerIds={(selectedTeam.players || []).map((p: any) => p.name || p.id || p)} currentUserId={user?.name || user?.id} />
                </div>
            </div>
        )}
      </Modal></>
    
  );
};