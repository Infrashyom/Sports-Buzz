import React, { useState, useEffect } from 'react';

import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, Activity, Star, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface GroupedReward {
  id: number;
  title: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  sport: string;
  count: number;
  tournaments: { name: string; date: string; sport: string }[];
}

export const StudentDashboard = () => {
  const { user } = useAuth();
  
  const [student, setStudent] = useState<any>(null);
  const [selectedSport, setSelectedSport] = useState('Cricket');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<GroupedReward | null>(null);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

  const [matches, setMatches] = useState<any[]>([]);
  const [myTeamNames, setMyTeamNames] = useState<string[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [allTeams, setAllTeams] = useState<any[]>([]);

  const [activeSports, setActiveSports] = useState<string[]>([]);

  useEffect(() => {
    const fetchStudentData = async () => {
        try {
            if (!user) return;
            
            let allStudentsData: any[] = [];
            let allTeamsData: any[] = [];
            let allMatchesData: any[] = [];

            try {
                const studentRes = await api.get('/students');
                allStudentsData = studentRes.data?.data?.students || [];
            } catch (err) { console.error('Failed to fetch students', err); }

            try {
                const teamRes = await api.get('/teams');
                allTeamsData = teamRes.data?.data?.teams || [];
            } catch (err) { console.error('Failed to fetch teams', err); }

            try {
                const matchRes = await api.get('/matches');
                allMatchesData = matchRes.data?.data?.matches || [];
            } catch (err) { console.error('Failed to fetch matches', err); }
            
            setAllStudents(allStudentsData);
            
            let myStudent = allStudentsData.find((s: any) => s.studentId === user.email || s.id === user.id || s._id === user.id);
            if (!myStudent) {
                myStudent = {
                    _id: user.id,
                    id: user.id,
                    name: user.name || 'Student',
                    studentId: user.email,
                    status: 'Active',
                    schoolId: user.schoolId,
                    sports: [] 
                };
            }
            setStudent(myStudent);
            setIsAvailable(myStudent.status === 'Active');
            
            setAllTeams(allTeamsData);
            const myTeams = allTeamsData.filter((t: any) => {
                if (!myStudent) return false;
                if (!t.players) return false;
                const studentId = myStudent._id || myStudent.id;
                return t.players.some((p: any) => p._id === studentId || p.id === studentId || p === studentId);
            });
            const myTeamNamesList = myTeams.map((t: any) => t.name);
            setMyTeamNames(myTeamNamesList);
            
            const transformedMatches = allMatchesData.map((m: any) => ({
                ...m,
                id: m._id,
                teamA: typeof m.teamA === 'string' ? m.teamA : m.teamA?.name,
                teamB: typeof m.teamB === 'string' ? m.teamB : m.teamB?.name
            }));
            setMatches(transformedMatches);

            // Compute sports
            const playedSports = new Set<string>();
            myStudent.sports?.forEach((s: string) => playedSports.add(s));
            myTeams.forEach((t: any) => {
                if (t.sport) playedSports.add(t.sport);
            });
            transformedMatches.forEach((m: any) => {
                const isMyTeamA = myTeamNamesList.includes(m.teamA);
                const isMyTeamB = myTeamNamesList.includes(m.teamB);
                if (isMyTeamA || isMyTeamB) {
                    if (m.sport) playedSports.add(m.sport);
                }
            });

            const uniqueSportsArray = Array.from(playedSports);
            setActiveSports(uniqueSportsArray);
            if (uniqueSportsArray.length > 0) {
                setSelectedSport(uniqueSportsArray[0]);
            }
            
        } catch (err) { console.error(err); }
    };
    fetchStudentData();
  }, [user]);

  const toggleAvailability = async () => {
    try {
        const newStatus = isAvailable ? 'Inactive' : 'Active';
        if (student && (student._id || student.id)) {
            const studentId = student._id || student.id;
            await api.patch(`/students/${studentId}/status`, { status: newStatus });
        }
        setIsAvailable(!isAvailable);
        toast.success(`Status updated to ${!isAvailable ? 'Active' : 'Away'}`);
    } catch (err) {
        toast.error('Failed to update status');
        console.error(err);
    }
  };

  // Process authentic match data
  const mySportMatches = matches.filter(m => 
    m.sport === selectedSport &&
    myTeamNames.some(teamName => m.teamA === teamName || m.teamB === teamName)
  );

  const completedMatches = mySportMatches.filter(m => m.status === 'VERIFIED' || m.status === 'COMPLETED');
  
  let totalWins = 0;
  const performanceData = completedMatches.map((m, idx) => {
      const isMyTeamA = myTeamNames.includes(m.teamA);
      const myScore = isMyTeamA ? m.scoreA : m.scoreB;
      const oppScore = isMyTeamA ? m.scoreB : m.scoreA;
      const isWin = (myScore || 0) > (oppScore || 0);
      if (isWin) totalWins++;
      
      const statValue = myScore || 0; // runs/points
      
      return {
          match: `M${idx + 1}`,
          points: statValue,
          runs: statValue, // we map both so recharts finds one
          isWin
      };
  });
  
  const winRate = completedMatches.length > 0 ? Math.round((totalWins / completedMatches.length) * 100) : 0;
  
  // Calculate MVP
  const mvpCount = completedMatches.filter(m => m.manOfTheMatchId === user?.id || m.manOfTheMatchId === student?._id).length;

  const authenticLeaderboard = allStudents.map(s => {
      let pts = 0;
      const sId = s.id || s._id;
      const sTeams = allTeams.filter(t => t.players && t.players.some((p: any) => p._id === sId || p.id === sId || p === sId)).map(t => t.name);
      const sMatches = matches.filter(m => m.status === 'VERIFIED' || m.status === 'COMPLETED');
      sMatches.forEach(m => {
          const isSA = sTeams.includes(m.teamA) || String(m.teamA).includes(s.schoolId?.name || '');
          const isSB = sTeams.includes(m.teamB) || String(m.teamB).includes(s.schoolId?.name || '');
          if (isSA || isSB) {
              pts += 10; // participation
              const isWin = isSA ? (m.scoreA || 0) > (m.scoreB || 0) : (m.scoreB || 0) > (m.scoreA || 0);
              if (isWin) pts += 20;
          }
          if (m.manOfTheMatchId === sId) {
              pts += 50;
          }
      });
      return { 
          rank: 0, 
          name: s.name, 
          points: pts, 
          avatar: s.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=random` 
      };
  }).sort((a,b) => b.points - a.points).map((item, idx) => ({ ...item, rank: idx + 1 }));

  const authenticRewards: any[] = [];
  let rewardId = 1;
  completedMatches.forEach(m => {
      const isMyTeamA = myTeamNames.includes(m.teamA);
      const isMyTeamB = myTeamNames.includes(m.teamB);
      
      if (m.manOfTheMatchId === (user?.id || student?._id)) {
          authenticRewards.push({
              id: rewardId++,
              title: 'Man of the Match',
              date: new Date(m.date).toLocaleDateString(),
              icon: Star,
              color: 'text-yellow-500',
              bg: 'bg-yellow-100',
              sport: m.sport,
              tournamentName: m.tournamentId?.name || 'Tournament Match'
          });
      }
      if (isMyTeamA || isMyTeamB) {
          const myScore = isMyTeamA ? m.scoreA : m.scoreB;
          const oppScore = isMyTeamA ? m.scoreB : m.scoreA;
          const isWin = (myScore || 0) > (oppScore || 0);
          if (isWin && (myScore || 0) - (oppScore || 0) > 10) {
              authenticRewards.push({
                  id: rewardId++,
                  title: 'Dominant Victory',
                  date: new Date(m.date).toLocaleDateString(),
                  icon: Zap,
                  color: 'text-blue-500',
                  bg: 'bg-blue-100',
                  sport: m.sport,
                  tournamentName: m.tournamentId?.name || 'Tournament Match'
              });
          }
      }
  });

  const groupedRewards = authenticRewards.reduce((acc, reward) => {
    if (!acc[reward.title]) {
      acc[reward.title] = { 
        ...reward, 
        count: 1, 
        tournaments: [{ name: reward.tournamentName, date: reward.date, sport: reward.sport }] 
      };
    } else {
      acc[reward.title].count += 1;
      acc[reward.title].tournaments.push({ name: reward.tournamentName, date: reward.date, sport: reward.sport });
    }
    return acc;
  }, {} as Record<string, GroupedReward>);
  
  const uniqueRewards: GroupedReward[] = Object.values(groupedRewards);

  if (!student) {
    return <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div></div>;
  }

  return (<>
    
      {/* Header Section: Compact on Mobile */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center space-x-3 md:space-x-4">
           <img 
            src={student.avatar} 
            alt={student.name} 
            className="h-14 w-14 md:h-20 md:w-20 rounded-full border-2 md:border-4 border-white shadow-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-3xl font-bold text-slate-900 truncate">{student.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-sm text-slate-500">{student.grade} • {student.studentId}</span>
                
                {/* Status Toggle Compact */}
                <div className="flex items-center space-x-2 bg-slate-100 px-2 py-0.5 rounded-full">
                    <button
                        onClick={toggleAvailability}
                        className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${
                        isAvailable ? 'bg-green-500' : 'bg-slate-300'
                        }`}
                    >
                        <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            isAvailable ? 'translate-x-4' : 'translate-x-0.5'
                        }`}
                        />
                    </button>
                    <span className={`text-[10px] uppercase font-bold ${isAvailable ? 'text-green-600' : 'text-slate-500'}`}>
                        {isAvailable ? 'Active' : 'Away'}
                    </span>
                </div>
            </div>
          </div>
        </div>
        
        {/* Scalable Sports Selector */}
        <div className="w-full overflow-hidden">
            <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
                {activeSports.map((sport: string) => (
                <button
                    key={sport}
                    onClick={() => setSelectedSport(sport)}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    selectedSport === sport 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    {sport}
                </button>
                ))}
            </div>
        </div>
      </div>

      {/* Overview Cards: 3 Columns on Mobile to save space */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
        <Card className="p-3 md:p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none flex flex-col justify-between h-full">
          <p className="text-blue-100 text-[10px] md:text-xs font-medium uppercase tracking-wider truncate">Matches</p>
          <div className="flex justify-between items-end mt-1">
            <h3 className="text-xl md:text-3xl font-bold">{completedMatches.length}</h3>
            <Activity className="h-4 w-4 md:h-6 md:w-6 text-blue-200" />
          </div>
        </Card>
        
        <Card className="p-3 md:p-4 flex flex-col justify-between h-full">
          <p className="text-slate-500 text-[10px] md:text-xs font-medium uppercase tracking-wider truncate">Win Rate</p>
          <div className="flex justify-between items-end mt-1">
            <h3 className="text-xl md:text-3xl font-bold text-slate-900">{winRate}%</h3>
            <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-green-500" />
          </div>
        </Card>

        <Card className="p-3 md:p-4 flex flex-col justify-between h-full">
          <p className="text-slate-500 text-[10px] md:text-xs font-medium uppercase tracking-wider truncate">MVP</p>
          <div className="flex justify-between items-end mt-1">
            <h3 className="text-xl md:text-3xl font-bold text-slate-900">{mvpCount}</h3>
            <Star className="h-4 w-4 md:h-6 md:w-6 text-purple-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Graph: Reduced Height on Mobile & Fixed Alignment */}
        <div className="lg:col-span-2">
          <Card title={`${selectedSport} Trends`} className="h-full">
            <div className="h-56 md:h-80 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="match" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 11, fill: '#64748b'}}
                    interval="preserveStartEnd"
                    padding={{ left: 20, right: 20 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 11, fill: '#64748b'}}
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={selectedSport === 'Cricket' ? 'runs' : selectedSport === 'Badminton' ? 'points' : 'points'} 
                    stroke="#2563eb" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 6 }}
                  />
                  {selectedSport === 'Cricket' && (
                    <Line type="monotone" dataKey="wickets" stroke="#ef4444" strokeWidth={2} />
                  )}
                  {selectedSport === 'Badminton' && (
                    <Line type="monotone" dataKey="assists" stroke="#10b981" strokeWidth={2} />
                  )}
                  {selectedSport === 'Badminton' && (
                    <Line type="monotone" dataKey="sets" stroke="#10b981" strokeWidth={2} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-1">
          <Card title="Leaderboard" className="h-full">
            <div className="space-y-3">
              {authenticLeaderboard.slice(0, 5).map((item) => (
                <div key={item.rank} className={`flex items-center justify-between p-2 rounded-lg ${item.name === student.name ? 'bg-blue-50 border border-blue-100 ring-1 ring-blue-200' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 text-center font-bold text-sm ${item.rank <= 3 ? 'text-yellow-600' : 'text-slate-400'}`}>
                      #{item.rank}
                    </div>
                    <img src={item.avatar} alt="" className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-slate-200" />
                    <span className={`text-xs md:text-sm font-medium ${item.name === student.name ? 'text-blue-700' : 'text-slate-700'} truncate max-w-[100px] md:max-w-full`}>
                      {item.name} {item.name === student.name && '(You)'}
                    </span>
                  </div>
                  <span className="font-mono text-xs md:text-sm font-bold text-slate-900">{item.points} pts</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                <button 
                  onClick={() => setIsLeaderboardOpen(true)}
                  className="text-xs md:text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors"
                >
                  View Full School Rankings
                </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Rewards: Horizontal Scroll on Mobile to reduce height */}
      <Card title="Trophy Cabinet" className="mb-6">
        <div className="flex overflow-x-auto pb-4 gap-3 md:grid md:grid-cols-4 md:gap-4 md:pb-0 hide-scrollbar snap-x">
            {uniqueRewards.map((reward) => (
            <div 
              key={reward.id} 
              className="min-w-[140px] md:min-w-0 snap-center flex flex-col items-center text-center p-3 bg-slate-50 rounded-xl border border-slate-100 flex-shrink-0 cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => {
                setSelectedReward(reward);
                setIsRewardModalOpen(true);
              }}
            >
                <div className={`p-2 rounded-full mb-2 ${reward.bg} ${reward.color} relative`}>
                    <reward.icon className="h-5 w-5" />
                    {reward.count > 1 && (
                      <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {reward.count}
                      </span>
                    )}
                </div>
                <div>
                    <p className="text-xs md:text-sm font-bold text-slate-900 truncate w-full">{reward.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{reward.tournaments[0].date}</p>
                    <span className="inline-block mt-2 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-semibold uppercase text-slate-400">
                        {reward.sport}
                    </span>
                </div>
            </div>
            ))}
        </div>
      </Card>

      {/* Full Leaderboard Modal */}
      <Modal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        title={`Standings - ${selectedSport}`}
      >
        <div className="space-y-2">
            <div className="flex justify-between items-center px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 rounded">
                <span>Rank & Player</span>
                <span>Points</span>
            </div>
            {authenticLeaderboard.map((item) => (
                <div key={item.rank} className={`flex items-center justify-between p-3 rounded-lg border border-transparent ${item.name === student.name ? 'bg-blue-50 border-blue-100 shadow-sm' : 'hover:bg-slate-50'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                        item.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                        item.rank === 2 ? 'bg-slate-200 text-slate-700' :
                        item.rank === 3 ? 'bg-orange-100 text-orange-700' :
                        'text-slate-500'
                    }`}>
                      {item.rank}
                    </div>
                    <img src={item.avatar} alt="" className="h-8 w-8 rounded-full bg-slate-200 object-cover" />
                    <div>
                        <p className={`text-sm font-bold ${item.name === student.name ? 'text-blue-700' : 'text-slate-900'}`}>
                            {item.name}
                        </p>
                        <p className="text-[10px] text-slate-500">{selectedSport}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-sm text-slate-900">{item.points}</span>
                </div>
            ))}
        </div>
      </Modal>

      {/* Reward Details Modal */}
      <Modal
        isOpen={isRewardModalOpen}
        onClose={() => setIsRewardModalOpen(false)}
        title="Badge Details"
      >
        {selectedReward && (
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`p-4 rounded-full ${selectedReward.bg} ${selectedReward.color}`}>
              <selectedReward.icon className="h-12 w-12" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{selectedReward.title}</h2>
              <p className="text-slate-500 mt-1">Earned {selectedReward.count} time{selectedReward.count > 1 ? 's' : ''}</p>
            </div>
            
            <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 mt-4 text-left">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Tournaments</h3>
              <div className="space-y-3">
                {selectedReward.tournaments.map((t: { name: string; date: string; sport: string }, idx: number) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-slate-500">{t.date}</span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold uppercase">
                        {t.sport}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal></>
    
  );
};