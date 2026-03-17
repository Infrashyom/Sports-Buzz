import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { MOCK_REFEREES, MOCK_MATCHES } from '../../services/mockData';
import { Search, Filter, Phone, Award, Plus, Star, Calendar } from 'lucide-react';
import { User, UserRole } from '../../types';
import toast from 'react-hot-toast';
import api from '../../services/api';

export const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Pending'>('All');
  
  // Initialize with mock referees and some pending ones
  const [referees, setReferees] = useState<User[]>([
      ...MOCK_REFEREES.map(r => ({...r, status: 'Active' as const})),
      { id: 'u3', name: 'Pending Referee', email: 'new.ref@gmail.com', role: UserRole.REFEREE, status: 'Pending', certifications: [{ name: 'State Umpire L1', status: 'Pending' }], mobile: '555-0123' }
  ]);

  const [selectedReferee, setSelectedReferee] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newReferee, setNewReferee] = useState({ name: '', email: '', experience: '', mobile: '', password: '' });

  const filteredReferees = referees.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            r.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesFilter = true;
      if (filterStatus === 'Active') matchesFilter = r.status === 'Active';
      else if (filterStatus === 'Pending') matchesFilter = r.status === 'Pending';

      return matchesSearch && matchesFilter;
  });

  const handleVerify = (id: string) => {
      setReferees(referees.map(r => r.id === id ? { ...r, status: 'Active' } : r));
      setSelectedReferee(null);
      toast.success("Referee approved and activated.");
  };

  const handleAddReferee = async () => {
      if (!newReferee.name || !newReferee.email || !newReferee.password) {
          toast.error("Please fill all mandatory fields.");
          return;
      }
      try {
          await api.post('/auth/register', {
              name: newReferee.name,
              email: newReferee.email,
              password: newReferee.password,
              role: UserRole.REFEREE,
              mobile: newReferee.mobile
          });

          const referee: User = {
              id: `r${Date.now()}`,
              name: newReferee.name,
              email: newReferee.email,
              role: UserRole.REFEREE,
              status: 'Active', // Admin added referees are auto-active
              experience: newReferee.experience,
              mobile: newReferee.mobile,
              avatar: `https://ui-avatars.com/api/?name=${newReferee.name}&background=random`
          };
          setReferees([...referees, referee]);
          setIsAddModalOpen(false);
          setNewReferee({ name: '', email: '', experience: '', mobile: '', password: '' });
          toast.success("Independent referee added successfully. Credentials sent to email.");
      } catch {
          // Fallback for demo
          const referee: User = {
              id: `r${Date.now()}`,
              name: newReferee.name,
              email: newReferee.email,
              role: UserRole.REFEREE,
              status: 'Active', // Admin added referees are auto-active
              experience: newReferee.experience,
              mobile: newReferee.mobile,
              avatar: `https://ui-avatars.com/api/?name=${newReferee.name}&background=random`
          };
          setReferees([...referees, referee]);
          setIsAddModalOpen(false);
          setNewReferee({ name: '', email: '', experience: '', mobile: '', password: '' });
          toast.success("Independent referee added locally (Demo mode).");
      }
  };

  return (
    <DashboardLayout>
       <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Referee Management</h1>
            <p className="text-slate-500">Manage independent referees and view certifications.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center">
             <Plus className="h-4 w-4 mr-2" /> Add Independent Referee
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
             <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input 
                    type="text" 
                    placeholder="Search referees..." 
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="w-full md:w-auto relative">
                 <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                 <select 
                    className="w-full md:w-48 pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 appearance-none cursor-pointer"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as 'All' | 'Active' | 'Pending')}
                 >
                     <option value="All">All Status</option>
                     <option value="Active">Active</option>
                     <option value="Pending">Pending Review</option>
                 </select>
             </div>
        </div>
      </Card>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Referee</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Experience</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {filteredReferees.map(referee => (
                        <tr key={referee.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold overflow-hidden">
                                        {referee.avatar ? <img src={referee.avatar} alt="" className="h-full w-full object-cover" /> : referee.name.charAt(0)}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-bold text-slate-900">{referee.name}</div>
                                        <div className="text-xs text-slate-500">{referee.email}</div>
                                        {referee.mobile && <div className="text-xs text-slate-400 flex items-center mt-0.5"><Phone className="h-3 w-3 mr-1" /> {referee.mobile}</div>}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-slate-600">{referee.experience || 'N/A'}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                {referee.status === 'Pending' ? (
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Pending Review</span>
                                ) : (
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Active</span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <Button size="sm" variant="outline" onClick={() => setSelectedReferee(referee)}>
                                    View Details
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* View/Review Modal */}
      <Modal
        isOpen={!!selectedReferee}
        onClose={() => setSelectedReferee(null)}
        title="Referee Profile"
      >
          {selectedReferee && (
              <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                       <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-bold text-slate-500 overflow-hidden">
                            {selectedReferee.avatar ? <img src={selectedReferee.avatar} alt="" className="h-full w-full object-cover" /> : selectedReferee.name.charAt(0)}
                       </div>
                       <div>
                           <h3 className="text-xl font-bold text-slate-900">{selectedReferee.name}</h3>
                           <p className="text-slate-500">{selectedReferee.email}</p>
                           {selectedReferee.mobile && <p className="text-sm text-slate-500 flex items-center mt-1"><Phone className="h-3 w-3 mr-1" /> {selectedReferee.mobile}</p>}
                           <div className="flex items-center mt-1">
                               <p className="text-sm font-bold text-orange-600 uppercase mr-3">Referee</p>
                               <div className="flex items-center text-yellow-500">
                                   <Star className="h-4 w-4 fill-current" />
                                   <span className="ml-1 text-sm font-bold text-slate-700">{selectedReferee.rating || '4.5'}</span>
                               </div>
                           </div>
                       </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4">
                      <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                          <Award className="h-4 w-4 mr-2 text-blue-500" /> Certifications
                      </h4>
                      {selectedReferee.certifications && selectedReferee.certifications.length > 0 ? (
                          <div className="space-y-2">
                              {selectedReferee.certifications.map((cert: { name: string, status: 'Pending' | 'Verified' }, idx: number) => (
                                  <div key={idx} className="bg-white p-3 border border-slate-100 rounded-lg text-sm text-slate-600 flex justify-between items-center">
                                      <span>{cert.name}</span>
                                      <div className="flex items-center gap-2">
                                          <span className={`text-xs px-2 py-0.5 rounded-full ${cert.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                              {cert.status}
                                          </span>
                                          {cert.status === 'Pending' && (
                                              <Button 
                                                  size="sm" 
                                                  variant="outline" 
                                                  className="text-xs py-1 px-2 h-auto"
                                                  onClick={() => {
                                                      const updatedCerts = [...(selectedReferee.certifications || [])];
                                                      updatedCerts[idx] = { ...cert, status: 'Verified' };
                                                      const updatedReferee = { ...selectedReferee, certifications: updatedCerts };
                                                      setReferees(referees.map(r => r.id === selectedReferee.id ? updatedReferee : r));
                                                      setSelectedReferee(updatedReferee);
                                                      toast.success('Certification verified successfully');
                                                  }}
                                              >
                                                  Verify
                                              </Button>
                                          )}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <p className="text-sm text-slate-500 italic">No certifications listed.</p>
                      )}
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4">
                      <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-blue-500" /> Match Involvement
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                          {MOCK_MATCHES.filter(m => m.refereeId === selectedReferee.id).length > 0 ? (
                              MOCK_MATCHES.filter(m => m.refereeId === selectedReferee.id).map(match => (
                                  <div key={match.id} className="bg-white p-3 border border-slate-100 rounded-lg text-sm text-slate-600 flex justify-between items-center">
                                      <div>
                                          <p className="font-bold text-slate-800">{match.teamA} vs {match.teamB}</p>
                                          <p className="text-xs text-slate-500">{new Date(match.date).toLocaleDateString()} • {match.sport}</p>
                                      </div>
                                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${match.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                          {match.status}
                                      </span>
                                  </div>
                              ))
                          ) : (
                              <p className="text-sm text-slate-500 italic">No matches assigned yet.</p>
                          )}
                      </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4">
                      <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                          <Star className="h-4 w-4 mr-2 text-yellow-500" /> Rate Referee
                      </h4>
                      <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                              <button 
                                  key={star} 
                                  onClick={() => {
                                      setReferees(referees.map(r => r.id === selectedReferee.id ? { ...r, rating: star } : r));
                                      setSelectedReferee({ ...selectedReferee, rating: star });
                                      toast.success(`Rated ${star} stars!`);
                                  }}
                                  className={`p-1 hover:scale-110 transition-transform ${selectedReferee.rating && selectedReferee.rating >= star ? 'text-yellow-500' : 'text-slate-300'}`}
                              >
                                  <Star className={`h-6 w-6 ${selectedReferee.rating && selectedReferee.rating >= star ? 'fill-current' : ''}`} />
                              </button>
                          ))}
                      </div>
                  </div>

                  {(selectedReferee.status === 'Pending' || selectedReferee.status === undefined) && (
                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                          <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:border-red-200">Reject</Button>
                          <Button onClick={() => handleVerify(selectedReferee.id)}>Approve & Activate</Button>
                      </div>
                  )}
              </div>
          )}
      </Modal>

      {/* Add Referee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Independent Referee"
      >
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                    placeholder="e.g. John Doe"
                    value={newReferee.name}
                    onChange={(e) => setNewReferee({...newReferee, name: e.target.value})}
                  />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                        placeholder="john@example.com"
                        value={newReferee.email}
                        onChange={(e) => setNewReferee({...newReferee, email: e.target.value})}
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Initial Password <span className="text-red-500">*</span></label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                        placeholder="Set initial password"
                        value={newReferee.password}
                        onChange={(e) => setNewReferee({...newReferee, password: e.target.value})}
                      />
                  </div>
              </div>
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                    placeholder="(555) 000-0000"
                    value={newReferee.mobile}
                    onChange={(e) => setNewReferee({...newReferee, mobile: e.target.value})}
                  />
              </div>
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Experience / Bio</label>
                  <textarea 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                    placeholder="Years of experience, sports specialized in..."
                    rows={3}
                    value={newReferee.experience}
                    onChange={(e) => setNewReferee({...newReferee, experience: e.target.value})}
                  />
              </div>
              <div className="flex justify-end pt-4 gap-2">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddReferee} disabled={!newReferee.name || !newReferee.email || !newReferee.password}>Add Referee</Button>
              </div>
          </div>
      </Modal>
    </DashboardLayout>
  );
};