import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Match, Student } from '../../types';
import { MOCK_TEAMS, MOCK_STUDENTS, MOCK_REFEREES } from '../../services/mockData';
import { Flag, MapPin, Clock, Edit2, Award, Medal } from 'lucide-react';
import { Button } from '../ui/Button';

interface MatchDetailModalProps {
  match: Match | null;
  onClose: () => void;
  isAdmin?: boolean;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({ match, onClose, isAdmin = false }) => {
  const [detailTab, setDetailTab] = useState<'SUMMARY' | 'SQUADS'>('SUMMARY');
  const [isEditingReferee, setIsEditingReferee] = useState(false);
  const [selectedRefereeId, setSelectedRefereeId] = useState(match?.refereeId || '');
  
  // MOTM State
  const [isEditingMOTM, setIsEditingMOTM] = useState(false);
  const [selectedMOTMId, setSelectedMOTMId] = useState(match?.manOfTheMatchId || '');

  // Badge State
  const [selectedPlayerForBadge, setSelectedPlayerForBadge] = useState<Student | null>(null);
  const [badgeName, setBadgeName] = useState('');

  if (!match) return null;

  const getRefereeName = (id: string) => {
    const ref = MOCK_REFEREES.find(r => r.id === id);
    return ref ? ref.name : 'Unassigned';
  };

  const getPlayerName = (id: string) => {
    const player = MOCK_STUDENTS.find(s => s.id === id);
    return player ? player.name : 'Unknown Player';
  };

  const handleSaveReferee = () => {
    // In a real app, this would call an API
    console.log(`Saving referee ${selectedRefereeId} for match ${match.id}`);
    setIsEditingReferee(false);
  };

  const handleSaveMOTM = () => {
    // In a real app, this would call an API
    console.log(`Saving MOTM ${selectedMOTMId} for match ${match.id}`);
    setIsEditingMOTM(false);
  };

  const handleAssignBadge = () => {
    if (selectedPlayerForBadge && badgeName) {
        // In a real app, this would call an API
        console.log(`Assigning badge ${badgeName} to player ${selectedPlayerForBadge.id}`);
        
        // Optimistic update (if we were using state for players, but here we just log)
        // const updatedPlayer = { ...selectedPlayerForBadge, badges: [...(selectedPlayerForBadge.badges || []), badgeName] };
        
        setSelectedPlayerForBadge(null);
        setBadgeName('');
    }
  };

  const getSquadForTeam = (teamName: string): Student[] => {
    const team = MOCK_TEAMS.find(t => t.name === teamName);
    if (!team) return []; 
    return team.playerIds.map(pid => MOCK_STUDENTS.find(s => s.id === pid)).filter((s): s is Student => !!s);
  };

  const allPlayers = [
      ...getSquadForTeam(match.teamA),
      ...getSquadForTeam(match.teamB)
  ];

  return (
    <Modal
        isOpen={!!match}
        onClose={onClose}
        title="Match Details"
    >
        <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-slate-900 text-white rounded-xl p-4 md:p-6 shadow-lg">
                <div className="flex justify-between items-start mb-4 md:mb-6">
                    <span className="text-[10px] md:text-xs font-bold bg-slate-700 px-2 py-1 rounded uppercase tracking-wider">{match.sport}</span>
                    <span className="text-[10px] md:text-xs font-bold text-slate-400">{match.status}</span>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-lg md:text-2xl font-bold">{match.teamA}</h3>
                    </div>
                    <div className="bg-slate-800 px-4 py-2 md:px-6 md:py-3 rounded-lg border border-slate-700 min-w-[120px] text-center">
                            <span className="text-xl md:text-3xl font-mono font-bold text-white tracking-widest whitespace-nowrap">
                            {match.scoreA ?? 0} - {match.scoreB ?? 0}
                            </span>
                    </div>
                    <div className="flex-1 text-center md:text-right">
                        <h3 className="text-lg md:text-2xl font-bold">{match.teamB}</h3>
                    </div>
                </div>
                <div className="mt-4 md:mt-6 text-center text-xs md:text-sm text-slate-400 border-t border-slate-800 pt-4">
                    {match.location} • {new Date(match.date).toLocaleDateString()}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
                <button 
                    onClick={() => setDetailTab('SUMMARY')}
                    className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${
                        detailTab === 'SUMMARY' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Summary & Info
                </button>
                <button 
                    onClick={() => setDetailTab('SQUADS')}
                    className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${
                        detailTab === 'SQUADS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Squads
                </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
                {detailTab === 'SUMMARY' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Match Info</h4>
                            <ul className="space-y-3 text-sm">
                                <li className="flex justify-between">
                                    <span className="text-slate-600 flex items-center"><Clock className="h-3 w-3 mr-1"/> Date</span>
                                    <span className="font-medium text-slate-900">{new Date(match.date).toDateString()}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-slate-600 flex items-center"><MapPin className="h-3 w-3 mr-1"/> Venue</span>
                                    <span className="font-medium text-slate-900 truncate ml-2">{match.location}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-slate-600">Toss</span>
                                    <span className="font-medium text-slate-900">Pending Update</span>
                                </li>
                            </ul>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs font-bold text-slate-500 uppercase">Officials</h4>
                                {isAdmin && !isEditingReferee && (
                                    <button onClick={() => setIsEditingReferee(true)} className="text-blue-600 hover:text-blue-800">
                                        <Edit2 className="h-3 w-3" />
                                    </button>
                                )}
                            </div>
                            
                            {isEditingReferee ? (
                                <div className="space-y-2">
                                    <select 
                                        className="w-full text-sm border rounded p-1"
                                        value={selectedRefereeId}
                                        onChange={(e) => setSelectedRefereeId(e.target.value)}
                                    >
                                        <option value="">Select Referee</option>
                                        {MOCK_REFEREES.map(ref => (
                                            <option key={ref.id} value={ref.id}>{ref.name}</option>
                                        ))}
                                    </select>
                                    <div className="flex justify-end space-x-2">
                                        <button onClick={() => setIsEditingReferee(false)} className="text-xs text-slate-500">Cancel</button>
                                        <button onClick={handleSaveReferee} className="text-xs font-bold text-blue-600">Save</button>
                                    </div>
                                </div>
                            ) : (
                                <ul className="space-y-3 text-sm">
                                    <li className="flex justify-between">
                                        <span className="text-slate-600">Referee</span>
                                        <span className="font-medium text-slate-900">{getRefereeName(match.refereeId)}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-slate-600">Scorer</span>
                                        <span className="font-medium text-slate-900">Auto-System</span>
                                    </li>
                                </ul>
                            )}
                        </div>
                        
                        {/* Man of the Match Section */}
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 md:col-span-2">
                             <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs font-bold text-yellow-700 uppercase flex items-center">
                                    <Award className="h-4 w-4 mr-1" /> Man of the Match
                                </h4>
                                {isAdmin && !isEditingMOTM && (
                                    <button onClick={() => setIsEditingMOTM(true)} className="text-yellow-700 hover:text-yellow-900">
                                        <Edit2 className="h-3 w-3" />
                                    </button>
                                )}
                            </div>

                            {isEditingMOTM ? (
                                <div className="space-y-2">
                                    <select 
                                        className="w-full text-sm border rounded p-1"
                                        value={selectedMOTMId}
                                        onChange={(e) => setSelectedMOTMId(e.target.value)}
                                    >
                                        <option value="">Select Player</option>
                                        {allPlayers.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} ({p.schoolId === 's1' ? match.teamA : match.teamB})</option>
                                        ))}
                                    </select>
                                    <div className="flex justify-end space-x-2">
                                        <button onClick={() => setIsEditingMOTM(false)} className="text-xs text-slate-500">Cancel</button>
                                        <button onClick={handleSaveMOTM} className="text-xs font-bold text-blue-600">Save</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    {match.manOfTheMatchId ? (
                                        <>
                                            <div className="h-10 w-10 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-700 font-bold">
                                                {getPlayerName(match.manOfTheMatchId).charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{getPlayerName(match.manOfTheMatchId)}</p>
                                                <p className="text-xs text-slate-500">Outstanding Performance</p>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-sm text-slate-500 italic">Not awarded yet.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2 p-4 bg-green-50 rounded-lg border border-green-100 flex items-start space-x-3">
                            <Flag className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-green-800">Result</h4>
                                <p className="text-sm text-green-700">
                                    {match.status === 'COMPLETED' || match.status === 'VERIFIED' 
                                        ? `${match.scoreA! > match.scoreB! ? match.teamA : match.teamB} won the match.`
                                        : 'Match is yet to be completed.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {detailTab === 'SQUADS' && (
                    <div className="space-y-6 animate-in fade-in">
                        {/* Admin Badge Assignment */}
                        {isAdmin && (
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
                                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center">
                                    <Medal className="h-4 w-4 mr-2 text-blue-600" /> Assign Player Badge
                                </h4>
                                <p className="text-xs text-slate-500 mb-3">
                                    The badge's date, sport, and tournament are automatically linked to this match. The icon and color will be auto-assigned based on the badge title.
                                </p>
                                <div className="flex flex-col md:flex-row gap-2">
                                    <select 
                                        className="flex-1 text-sm border rounded p-2"
                                        onChange={(e) => setSelectedPlayerForBadge(allPlayers.find(p => p.id === e.target.value) || null)}
                                        value={selectedPlayerForBadge?.id || ''}
                                    >
                                        <option value="">Select Player to Award</option>
                                        {allPlayers.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    <input 
                                        type="text" 
                                        placeholder="Badge Name (e.g. Best Defender)" 
                                        className="flex-1 text-sm border rounded p-2"
                                        value={badgeName}
                                        onChange={(e) => setBadgeName(e.target.value)}
                                    />
                                    <Button size="sm" onClick={handleAssignBadge} disabled={!selectedPlayerForBadge || !badgeName}>
                                        Assign
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Team A Squad */}
                            <div>
                                <h4 className="font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2 truncate">{match.teamA}</h4>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                    {getSquadForTeam(match.teamA).length > 0 ? (
                                        getSquadForTeam(match.teamA).map((player, idx) => (
                                            <div key={player.id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg group">
                                                <img src={player.avatar} alt="" className="h-8 w-8 rounded-full bg-slate-200 object-cover flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-bold text-slate-900 truncate">{player.name}</p>
                                                    <p className="text-[10px] text-slate-500">{idx === 0 ? 'Captain' : 'Player'}</p>
                                                </div>
                                                {player.badges && player.badges.length > 0 && (
                                                    <div className="flex space-x-1">
                                                        {player.badges.map((b, i) => (
                                                            <span key={i} title={b} className="h-2 w-2 rounded-full bg-yellow-400"></span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-400 italic p-2">Roster not available.</p>
                                    )}
                                </div>
                            </div>

                            {/* Team B Squad */}
                            <div>
                                <h4 className="font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2 truncate">{match.teamB}</h4>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                    {getSquadForTeam(match.teamB).length > 0 ? (
                                        getSquadForTeam(match.teamB).map((player, idx) => (
                                            <div key={player.id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg group">
                                                <img src={player.avatar} alt="" className="h-8 w-8 rounded-full bg-slate-200 object-cover flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-bold text-slate-900 truncate">{player.name}</p>
                                                    <p className="text-[10px] text-slate-500">{idx === 0 ? 'Captain' : 'Player'}</p>
                                                </div>
                                                {player.badges && player.badges.length > 0 && (
                                                    <div className="flex space-x-1">
                                                        {player.badges.map((b, i) => (
                                                            <span key={i} title={b} className="h-2 w-2 rounded-full bg-yellow-400"></span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-400 italic p-2">Roster not available.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </Modal>
  );
};