import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Mail, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { MOCK_QUERIES } from '../../services/mockData';

interface Query {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: string;
}

export const AdminQueries = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const response = await api.get('/contact-queries');
      if (response.data.data.queries.length === 0) {
        setQueries(MOCK_QUERIES as Query[]);
      } else {
        setQueries(response.data.data.queries);
      }
    } catch {
      setQueries(MOCK_QUERIES as Query[]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'PENDING' | 'RESOLVED') => {
    try {
      await api.patch(`/contact-queries/${id}`, { status: newStatus });
      toast.success('Query status updated');
      fetchQueries();
    } catch {
      // Fallback for demo
      setQueries(queries.map(q => q._id === id ? { ...q, status: newStatus } : q));
      toast.success('Query status updated locally (Demo mode)');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contact Queries</h1>
          <p className="text-slate-500">Manage inquiries from the public contact form.</p>
        </div>
      </div>

      <Card>
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading queries...</div>
        ) : queries.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No queries found.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {queries.map((query) => (
              <div key={query._id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {query.firstName} {query.lastName}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                      query.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {query.status === 'RESOLVED' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {query.status}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-500 text-sm mb-4 gap-2">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${query.email}`} className="hover:text-blue-600 transition-colors">{query.email}</a>
                    <span className="text-slate-300">•</span>
                    <span>{new Date(query.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-slate-700 whitespace-pre-wrap">
                    {query.message}
                  </div>
                </div>
                <div className="flex flex-col gap-2 justify-start md:w-48 shrink-0">
                  {query.status === 'PENDING' ? (
                    <Button 
                      variant="outline" 
                      className="w-full justify-center text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => handleStatusChange(query._id, 'RESOLVED')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> Mark Resolved
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full justify-center text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                      onClick={() => handleStatusChange(query._id, 'PENDING')}
                    >
                      <Clock className="h-4 w-4 mr-2" /> Mark Pending
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};
