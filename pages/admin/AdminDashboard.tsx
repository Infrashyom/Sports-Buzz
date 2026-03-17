import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, School, Trophy, AlertCircle } from 'lucide-react';
import { MOCK_STATS_PARTICIPATION } from '../../services/mockData';

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
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
        <p className="text-slate-500">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Schools" value="48" icon={School} color="#3b82f6" trend="+2 this month" />
        <StatCard title="Active Students" value="12,450" icon={Users} color="#10b981" trend="+5% growth" />
        <StatCard title="Tournaments" value="6" icon={Trophy} color="#f59e0b" trend="2 ongoing" />
        <StatCard title="Pending Approvals" value="12" icon={AlertCircle} color="#ef4444" trend="Requires attention" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Participation by Sport">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_STATS_PARTICIPATION}>
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
              {[
                { name: 'North Valley High', date: '2 hours ago', status: 'Pending' },
                { name: 'St. Peter\'s Academy', date: '1 day ago', status: 'Approved' },
                { name: 'Grand Oak International', date: '2 days ago', status: 'Approved' },
                { name: 'City Public School', date: '3 days ago', status: 'Rejected' },
                { name: 'Mountain View School', date: '4 days ago', status: 'Approved' },
              ].map((school, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                      {school.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{school.name}</p>
                      <p className="text-xs text-slate-500">{school.date}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    school.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    school.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {school.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};