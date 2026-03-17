import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { MOCK_STUDENTS } from '../../services/mockData';
import { Trophy, TrendingUp, Activity, Medal, Star, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
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

// Mock performance data generator
const getPerformanceData = (sport: string) => {
  if (sport === 'Cricket') {
    return [
      { match: 'M1', runs: 45, wickets: 0 },
      { match: 'M2', runs: 12, wickets: 1 },
      { match: 'M3', runs: 78, wickets: 0 },
      { match: 'M4', runs: 32, wickets: 2 },
      { match: 'M5', runs: 55, wickets: 0 },
    ];
  } else if (sport === 'Basketball') {
    return [
      { match: 'M1', points: 12, assists: 4 },
      { match: 'M2', points: 18, assists: 6 },
      { match: 'M3', points: 8, assists: 2 },
      { match: 'M4', points: 24, assists: 5 },
      { match: 'M5', points: 15, assists: 7 },
    ];
  } else if (sport === 'Badminton') {
    return [
      { match: 'M1', points: 21, sets: 2 },
      { match: 'M2', points: 19, sets: 1 },
      { match: 'M3', points: 21, sets: 2 },
      { match: 'M4', points: 15, sets: 0 },
      { match: 'M5', points: 21, sets: 2 },
    ];
  } else {
    // Default fallback
    return [
      { match: 'M1', score: 10 },
      { match: 'M2', score: 15 },
      { match: 'M3', score: 12 },
      { match: 'M4', score: 20 },
      { match: 'M5', score: 18 },
    ];
  }
};

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Alex Johnson', points: 450, avatar: 'https://picsum.photos/seed/alex/100' },
  { rank: 2, name: 'Jordan Mike', points: 412, avatar: 'https://picsum.photos/seed/st1/100' }, // Current User
  { rank: 3, name: 'Sam Smith', points: 389, avatar: 'https://picsum.photos/seed/sam/100' },
  { rank: 4, name: 'Casey Neistat', points: 350, avatar: 'https://picsum.photos/seed/casey/100' },
  { rank: 5, name: 'Drew Berry', points: 310, avatar: 'https://picsum.photos/seed/drew/100' },
  { rank: 6, name: 'Morgan Lee', points: 290, avatar: 'https://picsum.photos/seed/morgan/100' },
  { rank: 7, name: 'Jamie Fox', points: 275, avatar: 'https://picsum.photos/seed/jamie/100' },
  { rank: 8, name: 'Taylor Swift', points: 260, avatar: 'https://picsum.photos/seed/taylor/100' },
];

const MOCK_REWARDS = [
  { id: 1, title: 'Man of the Match', date: 'Oct 15, 2023', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100', sport: 'Cricket', tournamentName: 'Inter-School Cricket Championship 2023' },
  { id: 2, title: 'Best Bowler', date: 'Sep 22, 2023', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-100', sport: 'Cricket', tournamentName: 'Summer T20 Cup' },
  { id: 3, title: 'Hat-trick Hero', date: 'Aug 10, 2023', icon: Medal, color: 'text-purple-500', bg: 'bg-purple-100', sport: 'Soccer', tournamentName: 'Regional Football League' },
  { id: 4, title: 'MVP Finals', date: 'July 05, 2023', icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-100', sport: 'Basketball', tournamentName: 'State Basketball Finals' },
  { id: 5, title: 'Fair Play', date: 'June 12, 2023', icon: Trophy, color: 'text-green-500', bg: 'bg-green-100', sport: 'Badminton', tournamentName: 'District Badminton Open' },
];

export const StudentDashboard = () => {
  const { user } = useAuth();
  const student = MOCK_STUDENTS.find(s => s.id === user?.id) || MOCK_STUDENTS[0];
  const [selectedSport, setSelectedSport] = useState(student.sports[0]);
  const [isAvailable, setIsAvailable] = useState(student.status === 'Active');
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<GroupedReward | null>(null);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

  const performanceData = getPerformanceData(selectedSport);

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    toast.success(`Status updated to ${!isAvailable ? 'Active' : 'Away'}`);
  };

  const groupedRewards = MOCK_REWARDS.reduce((acc, reward) => {
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
  
  const uniqueRewards = Object.values(groupedRewards);

  return (
    <DashboardLayout>
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
                {student.sports.map(sport => (
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
            <h3 className="text-xl md:text-3xl font-bold">12</h3>
            <Activity className="h-4 w-4 md:h-6 md:w-6 text-blue-200" />
          </div>
        </Card>
        
        <Card className="p-3 md:p-4 flex flex-col justify-between h-full">
          <p className="text-slate-500 text-[10px] md:text-xs font-medium uppercase tracking-wider truncate">Win Rate</p>
          <div className="flex justify-between items-end mt-1">
            <h3 className="text-xl md:text-3xl font-bold text-slate-900">75%</h3>
            <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-green-500" />
          </div>
        </Card>

        <Card className="p-3 md:p-4 flex flex-col justify-between h-full">
          <p className="text-slate-500 text-[10px] md:text-xs font-medium uppercase tracking-wider truncate">MVP</p>
          <div className="flex justify-between items-end mt-1">
            <h3 className="text-xl md:text-3xl font-bold text-slate-900">3</h3>
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
                    dataKey={selectedSport === 'Cricket' ? 'runs' : selectedSport === 'Basketball' ? 'points' : 'points'} 
                    stroke="#2563eb" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 6 }}
                  />
                  {selectedSport === 'Cricket' && (
                    <Line type="monotone" dataKey="wickets" stroke="#ef4444" strokeWidth={2} />
                  )}
                  {selectedSport === 'Basketball' && (
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
              {MOCK_LEADERBOARD.slice(0, 5).map((item) => (
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
            {MOCK_LEADERBOARD.map((item) => (
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
      </Modal>
    </DashboardLayout>
  );
};