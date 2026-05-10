import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { Mail, CheckCircle, Clock, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [queryToResolve, setQueryToResolve] = useState<string | null>(null);
  const itemsPerPage = 5;

  const [dateFilter, setDateFilter] = useState('ALL');

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const response = await api.get('/contact-queries');
      setQueries(response.data.data.queries);
    } catch {
      toast.error('Failed to fetch contact queries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!queryToResolve) return;
    try {
      await api.patch(`/contact-queries/${queryToResolve}`, { status: 'RESOLVED' });
      toast.success('Query status updated');
      fetchQueries();
    } catch {
      toast.error('Failed to update query status');
    } finally {
      setQueryToResolve(null);
    }
  };

  const filteredQueries = useMemo(() => {
    return queries.filter(q => {
      const fullName = `${q.firstName} ${q.lastName}`.toLowerCase();
      const email = q.email.toLowerCase();
      const search = searchTerm.toLowerCase();
      const matchesSearch = fullName.includes(search) || email.includes(search);
      const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter !== 'ALL') {
        const date = new Date(q.createdAt);
        const now = new Date();
        if (dateFilter === 'TODAY') {
          matchesDate = date.toDateString() === now.toDateString();
        } else if (dateFilter === 'WEEK') {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          matchesDate = date >= weekAgo;
        } else if (dateFilter === 'MONTH') {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          matchesDate = date >= monthAgo;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [queries, searchTerm, statusFilter, dateFilter]);

  const totalPages = Math.ceil(filteredQueries.length / itemsPerPage);
  const paginatedQueries = filteredQueries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contact Queries</h1>
          <p className="text-slate-500">Manage inquiries from the public contact form.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select 
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <select 
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Time</option>
            <option value="TODAY">Today</option>
            <option value="WEEK">Last 7 Days</option>
            <option value="MONTH">Last 30 Days</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      <Card>
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading queries...</div>
        ) : filteredQueries.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No queries found matching your search.</div>
        ) : (
          <>
            <div className="divide-y divide-slate-100">
              {paginatedQueries.map((query) => (
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
                    {query.status === 'PENDING' && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-center text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => setQueryToResolve(query._id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" /> Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredQueries.length)}</span> of <span className="font-medium">{filteredQueries.length}</span> results
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      <ConfirmationModal
        isOpen={!!queryToResolve}
        onClose={() => setQueryToResolve(null)}
        onConfirm={handleResolve}
        title="Resolve Query"
        message="Are you sure you want to mark this query as resolved? This action cannot be undone."
        confirmLabel="Mark Resolved"
        cancelLabel="Cancel"
        variant="primary"
      />
    </>
  );
};
