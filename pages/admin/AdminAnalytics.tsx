import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { MOCK_STATS_PARTICIPATION, MOCK_STATS_REVENUE } from '../../services/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

export const AdminAnalytics = () => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Mock data for new charts
  const REGISTRATION_GROWTH = [
      { name: 'Jan', schools: 2, students: 120 },
      { name: 'Feb', schools: 5, students: 350 },
      { name: 'Mar', schools: 8, students: 580 },
      { name: 'Apr', schools: 12, students: 900 },
      { name: 'May', schools: 15, students: 1200 },
      { name: 'Jun', schools: 18, students: 1500 },
  ];

  const TOURNAMENT_STATUS = [
      { name: 'Completed', value: 12 },
      { name: 'Ongoing', value: 5 },
      { name: 'Upcoming', value: 8 },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Platform Analytics</h1>
        <p className="text-slate-500">Deep dive into engagement and growth metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
         <Card title="Registration Growth">
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REGISTRATION_GROWTH}>
                    <defs>
                        <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="students" stroke="#3b82f6" fillOpacity={1} fill="url(#colorStudents)" />
                </AreaChart>
                </ResponsiveContainer>
            </div>
         </Card>
         
         <Card title="Sport Popularity (Participation)">
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={MOCK_STATS_PARTICIPATION}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label
                        >
                            {MOCK_STATS_PARTICIPATION.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title="Tournament Status Distribution">
               <div className="h-80 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={TOURNAMENT_STATUS} layout="vertical">
                           <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                           <XAxis type="number" hide />
                           <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} />
                           <Tooltip />
                           <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={40}>
                               {TOURNAMENT_STATUS.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                               ))}
                           </Bar>
                       </BarChart>
                   </ResponsiveContainer>
               </div>
          </Card>

          <Card title="Matches Played (Monthly)">
             <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_STATS_REVENUE}> {/* Reusing mock data structure for demo */}
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
             </div>
          </Card>
      </div>
    </DashboardLayout>
  );
};