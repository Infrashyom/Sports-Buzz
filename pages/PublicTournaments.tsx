import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Calendar, MapPin, Trophy, Users, Search, Info, ArrowUpRight, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Tournament } from '../types';
import { MOCK_TOURNAMENTS } from '../services/mockData';
import api from '../services/api';

export const PublicTournaments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await api.get('/tournaments');
      if (response.data.data.tournaments.length === 0) {
        setTournaments(MOCK_TOURNAMENTS);
      } else {
        setTournaments(response.data.data.tournaments);
      }
    } catch {
      setTournaments(MOCK_TOURNAMENTS);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTournaments = tournaments.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.sport.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRegisterClick = () => {
    navigate('/login');
  };

  return (
    <PublicLayout>
      {/* Header Section */}
      <section className="pt-32 pb-12 bg-[#0A0F1C] px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 font-medium text-sm mb-6 backdrop-blur-md">
            <Zap className="h-4 w-4" />
            <span>Live & Upcoming</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            Tournaments <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">& Events</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl">
            Discover upcoming leagues, championships, and inter-school competitions happening across the network.
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-6 bg-[#131C31] border-y border-white/5 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-3 border border-white/10 bg-[#0A0F1C] rounded-full text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
                placeholder="Search tournaments or sports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              {['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                      : 'bg-[#0A0F1C] text-slate-400 hover:text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tournaments Grid */}
      <section className="py-16 bg-[#0A0F1C] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTournaments.map((tournament) => (
                <div 
                  key={tournament._id || tournament.id} 
                  className="group bg-[#131C31] rounded-[2rem] p-4 shadow-xl border border-white/5 hover:border-blue-500/50 transition-all cursor-pointer flex flex-col h-full relative overflow-hidden"
                  onClick={() => setSelectedTournament(tournament)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="h-56 bg-[#0A0F1C] rounded-[1.5rem] relative overflow-hidden mb-6 border border-white/5">
                    <img 
                      src={`https://picsum.photos/seed/${tournament._id || tournament.id}/800/600`} 
                      alt={tournament.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-luminosity group-hover:mix-blend-normal opacity-80 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-[#0A0F1C]/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
                        <Trophy className="h-4 w-4 text-blue-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{tournament.sport}</span>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg ${
                        tournament.status === 'ONGOING' ? 'bg-emerald-500 text-[#0A0F1C]' :
                        tournament.status === 'UPCOMING' ? 'bg-blue-500 text-white' :
                        'bg-slate-700 text-white'
                      }`}>
                        {tournament.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="px-2 flex-grow flex flex-col relative z-10">
                    <h3 className="text-2xl font-black text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">{tournament.name}</h3>
                    <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-grow">{tournament.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-[#0A0F1C] p-3 rounded-xl border border-white/5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Dates</p>
                        <p className="text-sm font-semibold text-white">{new Date(tournament.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                      </div>
                      <div className="bg-[#0A0F1C] p-3 rounded-xl border border-white/5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Teams</p>
                        <p className="text-sm font-semibold text-white">{tournament.teams || 0} Registered</p>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-400 flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-blue-500" /> {tournament.location}
                      </span>
                      <div className="h-10 w-10 rounded-full bg-blue-600/20 flex items-center justify-center group-hover:bg-blue-600 transition-colors border border-blue-500/30">
                        <ArrowUpRight className="h-5 w-5 text-blue-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#131C31] border border-white/10 mb-6">
                <Search className="h-10 w-10 text-slate-500" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">No tournaments found</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">We couldn't find any tournaments matching your current search or filter criteria.</p>
              <button 
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition-colors"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Tournament Details Modal */}
      <Modal
        isOpen={!!selectedTournament}
        onClose={() => setSelectedTournament(null)}
        title="Tournament Details"
      >
        {selectedTournament && (
          <div className="space-y-6">
            <div className="h-48 bg-slate-200 rounded-xl relative overflow-hidden">
              <img 
                src={`https://picsum.photos/seed/${selectedTournament._id || selectedTournament.id}/800/400`} 
                alt={selectedTournament.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  selectedTournament.status === 'ONGOING' ? 'bg-green-100 text-green-800' :
                  selectedTournament.status === 'UPCOMING' ? 'bg-blue-100 text-blue-800' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  {selectedTournament.status}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center text-sm text-blue-600 font-semibold mb-2">
                <Trophy className="h-4 w-4 mr-1" />
                {selectedTournament.sport}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedTournament.name}</h3>
              <p className="text-slate-600">{selectedTournament.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center text-slate-500 mb-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Dates</span>
                </div>
                <p className="text-slate-900 font-semibold">
                  {new Date(selectedTournament.startDate).toLocaleDateString()} - {new Date(selectedTournament.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center text-slate-500 mb-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Location</span>
                </div>
                <p className="text-slate-900 font-semibold">{selectedTournament.location}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center text-slate-500 mb-1">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Teams</span>
                </div>
                <p className="text-slate-900 font-semibold">{selectedTournament.teams || 0} Registered</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center text-slate-500 mb-1">
                  <Info className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Organizer</span>
                </div>
                <p className="text-slate-900 font-semibold">{selectedTournament.organizer || 'Sports Buzz Admin'}</p>
              </div>
            </div>

            {selectedTournament.prizePool && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <h4 className="text-sm font-bold text-yellow-800 mb-1">Prize Pool</h4>
                <p className="text-yellow-900 font-bold text-lg">{selectedTournament.prizePool}</p>
              </div>
            )}

            <div className="pt-6 border-t border-slate-100">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-800 text-center">
                  Registration is only available for school administrators. Please log in to your school portal to register your teams for this tournament.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button variant="outline" onClick={() => setSelectedTournament(null)}>Close</Button>
                {selectedTournament.status === 'UPCOMING' && (
                  <Button onClick={handleRegisterClick}>Login to Register School</Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </PublicLayout>
  );
};
