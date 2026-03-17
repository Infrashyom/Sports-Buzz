import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { MOCK_MATCHES } from '../../services/mockData';
import { Calendar, Users, Trophy, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const SchoolDashboard = () => {
  const navigate = useNavigate();

  // Filter only completed matches for the history widget and limit to 3
  const recentMatches = MOCK_MATCHES
    .filter(m => m.status === 'VERIFIED' || m.status === 'COMPLETED')
    .slice(0, 3);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Springfield High</h1>
        <p className="text-slate-500">School Administration Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium">City Ranking</p>
              <h3 className="text-4xl font-bold mt-2">#1</h3>
            </div>
            <Trophy className="h-8 w-8 text-blue-200" />
          </div>
          <p className="mt-4 text-sm text-blue-100">Top 5% in the region</p>
        </Card>

        <Card>
          <div className="flex items-center space-x-3 mb-2">
            <Users className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-slate-700">Total Athletes</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">142</p>
          <p className="text-sm text-slate-500 mt-1">Across 8 different sports</p>
        </Card>

        <Card>
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-slate-700">Next Match</span>
          </div>
          <p className="text-lg font-bold text-slate-900">vs Riverside Academy</p>
          <p className="text-sm text-slate-500 mt-1">Tomorrow, 2:00 PM • Basketball</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Recent Match Results">
            <div className="space-y-4">
              {recentMatches.map(match => (
                <div key={match.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-12 text-center">
                      <span className="block text-xs text-slate-500 uppercase">{match.sport.slice(0,3)}</span>
                      <span className="block font-bold text-slate-700">{new Date(match.date).getDate()}</span>
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">
                        {match.teamA} <span className="text-slate-400 mx-1">vs</span> {match.teamB}
                      </div>
                      <div className="text-sm text-slate-500">{match.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 text-lg">
                      {match.scoreA} - {match.scoreB}
                    </div>
                    <div className="text-xs text-green-600 font-medium">Won</div>
                  </div>
                </div>
              ))}
            </div>
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

        <div className="space-y-6">
          <Card title="Quick Actions">
            <div className="space-y-2">
              <Button 
                variant="secondary" 
                className="w-full justify-between"
                onClick={() => navigate('/school/students')}
              >
                Register New Student <ChevronRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-between"
                onClick={() => navigate('/school/teams')}
              >
                Create Team <ChevronRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-between"
                onClick={() => navigate('/school/fixtures')}
              >
                View Reports <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
          
          <Card title="Upcoming Events">
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-1 bg-blue-500 rounded-full h-full"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">City Winter Championship</p>
                  <p className="text-xs text-slate-500">Starts Nov 1st</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-1 bg-yellow-500 rounded-full h-full"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Inter-House Football</p>
                  <p className="text-xs text-slate-500">Registration Closes in 2 days</p>
                </div>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};