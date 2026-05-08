import React, { useState, useEffect } from 'react';

import { Card } from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, School, Trophy, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  trend?: string;
}

const StatCard = ({ title, value, icon: Icon, color, trend }: StatCardProps) => (
  <Card className="border-l-4" style={{ borderLeftColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        {trend && <p className="text-xs text-green-600 mt-1">{trend}</p>}
      </div>
      <div className={`p-3 rounded-full bg-opacity-10`} style={{ backgroundColor: `${color}20` }}>
        <Icon className="h-6 w-6" style={{ color: color }} />
      </div>
    </div>
  </Card>
);

export const AdminDashboard = () => {
  const [data, setData] = useState<{
    totalSchools: number;
    activeStudents: number;
    ongoingTournaments: number;
    pendingApprovals: number;
    recentSchools: any[];
    participationBySport: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setData(res.data.data);
      } catch (error) {
        console.error('Failed to load admin stats:', error);
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  if (!data) return null;

  return (<>
    
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
        <p className="text-slate-500">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Schools" value={data.totalSchools.toString()} icon={School} color="#3b82f6" trend="Registered" />
        <StatCard title="Active Students" value={data.activeStudents.toLocaleString()} icon={Users} color="#10b981" trend="Registered" />
        <StatCard title="Tournaments" value={data.ongoingTournaments.toString()} icon={Trophy} color="#f59e0b" trend="Ongoing" />
        <StatCard title="Pending Approvals" value={data.pendingApprovals.toString()} icon={AlertCircle} color="#ef4444" trend="Requires attention" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Participation by Sport">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.participationBySport}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recent School Registrations">
          <div className="h-80 overflow-y-auto pr-2">
            <div className="space-y-4">
              {data.recentSchools.map((school, index) => (
                <div key={school._id || index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                      {school.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 truncate max-w-[150px] sm:max-w-xs">{school.name}</p>
                      <p className="text-xs text-slate-500">{new Date(school.createdAt).toLocaleDateString()}{school.phone ? ` • ${school.phone}` : ''}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold ${
                    school.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {school.paymentStatus || 'Pending'}
                  </span>
                </div>
              ))}
              {data.recentSchools.length === 0 && (
                <div className="text-center text-slate-500 py-8">No recent registrations</div>
              )}
            </div>
          </div>
        </Card>
      </div></>
  );
};