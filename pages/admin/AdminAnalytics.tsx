import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../../components/ui/Card';
import api from '../../services/api';

export const AdminAnalytics = () => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const [data, setData] = useState({
      participationBySport: [],
      tournamentStatus: [],
      registrationGrowth: [],
      matchesMonthly: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     api.get('/admin/analytics').then(res => {
         setData(res.data.data);
     }).catch(err => {
         console.error('Failed to load analytics', err);
     }).finally(() => setLoading(false));
  }, []);

  if (loading) {
      return <div className="p-8 text-center text-slate-500">Loading analytics...</div>;
  }

  return (<>
    
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Analytics</h1>
          <p className="text-slate-500">Deep dive into engagement and growth metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
         <Card title="Registration Growth">
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.registrationGrowth}>
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
                            data={data.participationBySport}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label
                        >
                            {data.participationBySport.map((entry, index) => (
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
                       <BarChart data={data.tournamentStatus} layout="vertical">
                           <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                           <XAxis type="number" hide />
                           <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} />
                           <Tooltip />
                           <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={40}>
                               {data.tournamentStatus.map((entry, index) => (
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
                <BarChart data={data.matchesMonthly}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
             </div>
          </Card>
      </div></>
    
  );
};