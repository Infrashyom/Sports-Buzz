import { Award, Calendar, Trophy, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const SchoolDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<{
    schoolName: string;
    cityRank: number;
    totalAthletes: number;
    recentMatches: any[];
    nextMatch: any | null;
    topTeams: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const targetId = user?.schoolId || user?.id;
        const res = await api.get(`/schools/${targetId}/dashboard`);
        setData(res.data.data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  if (!data) return null;

  return (<>
    
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{data.schoolName || 'School Dashboard'}</h1>
        <p className="text-slate-500">School Administration Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium">City Rank</p>
              <h3 className="text-4xl font-bold mt-2">#{data.cityRank || '--'}</h3>
            </div>
            <Trophy className="h-8 w-8 text-blue-200" />
          </div>
          <p className="mt-4 text-sm text-blue-100">Among all schools</p>
        </Card>

        <Card>
          <div className="flex items-center space-x-3 mb-2">
            <Users className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-slate-700">Total Athletes</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{data.totalAthletes || 0}</p>
          <p className="text-sm text-slate-500 mt-1">Active registered players</p>
        </Card>

        <Card>
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-slate-700">Next Match</span>
          </div>
          {data.nextMatch ? (
            <>
              <p className="text-lg font-bold text-slate-900 truncate">
                vs {data.nextMatch.teamA?._id === user?.id ? data.nextMatch.teamB?.name : data.nextMatch.teamB?.name}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {new Date(data.nextMatch.date).toLocaleDateString()} • {data.nextMatch.sport}
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-bold text-slate-400">No Upcoming Match</p>
              <p className="text-sm text-slate-400 mt-1">Check fixtures</p>
            </>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card title="Recent Match Results">
            {data.recentMatches && data.recentMatches.length > 0 ? (
              <div className="space-y-4">
                {data.recentMatches.map((match, idx) => (
                  <div key={match._id || idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100/50">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-12 text-center bg-white p-2 rounded border border-slate-100 shadow-sm">
                        <span className="block text-[10px] text-slate-500 font-bold uppercase">{match.sport?.slice(0,3)}</span>
                        <span className="block font-bold text-slate-800 leading-tight">{new Date(match.date).getDate()}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm md:text-base">
                          {match.teamA?.name} <span className="text-slate-400 mx-1 font-normal text-sm">vs</span> {match.teamB?.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{match.location || 'Home Ground'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black tracking-tight text-slate-900 text-lg md:text-xl">
                        {match.scoreA ?? '-'} : {match.scoreB ?? '-'}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">Final</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                No recent matches recorded yet.
              </div>
            )}
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/school/fixtures')}
                className="w-full sm:w-auto"
              >
                View All History
              </Button>
            </div>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card title="Top Performing Teams">
            {data.topTeams && data.topTeams.length > 0 ? (
              <div className="space-y-4">
                {data.topTeams.map((team, idx) => (
                  <div key={team._id || idx} className="flex items-center p-3 bg-white rounded-lg border border-slate-100/50 shadow-sm">
                    <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3 ${idx === 0 ? 'bg-yellow-100 text-yellow-600' : idx === 1 ? 'bg-slate-100 text-slate-500' : idx === 2 ? 'bg-orange-100 text-orange-600' : 'bg-blue-50 text-blue-500'}`}>
                      <Award className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 text-sm">{team.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{team.sport}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-slate-900">{team.stats?.won || 0}</div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">Wins</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                No team performance data yet.
              </div>
            )}
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/school/teams')}
                className="w-full sm:w-auto"
              >
                View All Teams
              </Button>
            </div>
          </Card>
        </div>
      </div></>
    
  );
};