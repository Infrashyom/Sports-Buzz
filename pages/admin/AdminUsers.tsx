import React, { useState, useEffect } from 'react';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Search, Phone, Plus, Star, Calendar, Eye, EyeOff, Award } from 'lucide-react';
import { UserRole } from '../../types';
import toast from 'react-hot-toast';
import api from '../../services/api';


export const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [referees, setReferees] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    // Fetch referees
    api.get('/users/referees').then(res => {
      setReferees(res.data.data.referees);
    }).catch(err => console.error(err));

    // Fetch matches for match involvement stats
    api.get('/matches').then(res => {
      setMatches(res.data.data.matches);
    }).catch(err => console.error(err));
  }, []);

  const [selectedReferee, setSelectedReferee] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newReferee, setNewReferee] = useState({ name: '', email: '', experience: '', mobile: '', password: '' });
  const [editReferee, setEditReferee] = useState({ _id: '', name: '', email: '', experience: '', mobile: '' });

  const filteredReferees = referees.filter(r => {
      return r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
             r.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAddReferee = async () => {
      if (!newReferee.name || !newReferee.email || !newReferee.password) {
          toast.error("Please fill all mandatory fields.");
          return;
      }
      try {
          const res = await api.post('/users', {
              name: newReferee.name,
              email: newReferee.email,
              password: newReferee.password,
              role: UserRole.REFEREE,
              mobile: newReferee.mobile,
              experience: newReferee.experience,
              status: 'Active' // Admin auto-activates
          });

          setReferees([...referees, res.data.data.user]);
          setIsAddModalOpen(false);
          setNewReferee({ name: '', email: '', experience: '', mobile: '', password: '' });
          toast.success("Independent referee added successfully.");
      } catch {
          toast.error("Failed to add referee.");
      }
  };

  const handleEditReferee = async () => {
    if (!editReferee.name || !editReferee.email) {
        toast.error("Please fill all mandatory fields.");
        return;
    }
    try {
        const res = await api.patch(`/users/${editReferee._id}`, {
            name: editReferee.name,
            email: editReferee.email,
            mobile: editReferee.mobile,
            experience: editReferee.experience
        });

        setReferees(referees.map(r => r._id === editReferee._id ? res.data.data.user : r));
        setIsEditModalOpen(false);
        if (selectedReferee && selectedReferee._id === editReferee._id) {
            setSelectedReferee(res.data.data.user);
        }
        toast.success("Referee details updated successfully.");
    } catch {
        toast.error("Failed to update referee.");
    }
  };

  return (<>
    
       <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Referee Management</h1>
            <p className="text-slate-500">Manage independent referees and view certifications.</p>
        </div>
        <div className="flex space-x-2">
            <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center">
                 <Plus className="h-4 w-4 mr-2" /> Add Independent Referee
            </Button>
        </div>
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
        </div>
      </Card>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Referee</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Experience</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Added By</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {filteredReferees.map(referee => (
                        <tr key={referee._id || referee.id} className="hover:bg-slate-50">
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
                                <span className="text-sm text-slate-600">{referee.experience ? `${referee.experience} years` : 'N/A'}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                {referee.schoolId ? (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{referee.schoolId.name || 'School Referee'}</span>
                                ) : (
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">Independent Tracker</span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <Button size="sm" variant="outline" className="mr-2" onClick={() => {
                                    setEditReferee({
                                        _id: referee._id || referee.id,
                                        name: referee.name,
                                        email: referee.email,
                                        mobile: referee.mobile || '',
                                        experience: referee.experience || ''
                                    });
                                    setIsEditModalOpen(true);
                                }}>
                                    Edit
                                </Button>
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
                                   <span className="ml-1 text-sm font-bold text-slate-700">{selectedReferee.rating || 0}</span>
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
                              {selectedReferee.certifications.map((cert: { name: string, status: 'Pending' | 'Verified', licenseId?: string }, idx: number) => (
                                  <div key={idx} className="bg-white p-3 border border-slate-100 rounded-lg text-sm text-slate-600 flex justify-between items-center">
                                      <span>
                                        {cert.name}
                                        {cert.licenseId && cert.licenseId.startsWith('http') && (
                                            <a href={cert.licenseId} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline block mt-1">
                                                View Document
                                            </a>
                                        )}
                                      </span>
                                      <div className="flex items-center gap-2">
                                          <span className={`text-xs px-2 py-0.5 rounded-full ${cert.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                              {cert.status}
                                          </span>
                                          {cert.status === 'Pending' && !selectedReferee.schoolId && (
                                              <Button 
                                                  size="sm" 
                                                  variant="outline" 
                                                  className="text-xs py-1 px-2 h-auto"
                                                  onClick={async () => {
                                                      const updatedCerts = [...(selectedReferee.certifications || [])];
                                                      updatedCerts[idx] = { ...cert, status: 'Verified' };
                                                      try {
                                                        await api.patch(`/users/${selectedReferee._id}`, { certifications: updatedCerts });
                                                        const updatedReferee = { ...selectedReferee, certifications: updatedCerts };
                                                        setReferees(referees.map(r => r._id === selectedReferee._id ? updatedReferee : r));
                                                        setSelectedReferee(updatedReferee);
                                                        toast.success('Certification verified successfully');
                                                      } catch {
                                                        toast.error('Failed to verify certification');
                                                      }
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
                          {matches.filter(m => m.refereeId === (selectedReferee._id || selectedReferee.id)).length > 0 ? (
                              matches.filter(m => m.refereeId === (selectedReferee._id || selectedReferee.id)).map(match => (
                                  <div key={match._id || match.id} className="bg-white p-3 border border-slate-100 rounded-lg text-sm text-slate-600 flex justify-between items-center">
                                      <div>
                                          <p className="font-bold text-slate-800">{match.title || `${match.teamA} vs ${match.teamB}`}</p>
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
                                  onClick={async () => {
                                      try {
                                        await api.patch(`/users/${selectedReferee._id}`, { rating: star });
                                        setReferees(referees.map(r => r._id === selectedReferee._id ? { ...r, rating: star } : r));
                                        setSelectedReferee({ ...selectedReferee, rating: star });
                                        toast.success(`Rated ${star} stars!`);
                                      } catch {
                                        toast.error("Failed to rate referee");
                                      }
                                  }}
                                  className={`p-1 hover:scale-110 transition-transform ${selectedReferee.rating && selectedReferee.rating >= star ? 'text-yellow-500' : 'text-slate-300'}`}
                              >
                                  <Star className={`h-6 w-6 ${selectedReferee.rating && selectedReferee.rating >= star ? 'fill-current' : ''}`} />
                              </button>
                          ))}
                      </div>
                  </div>
              </div>
          )}
      </Modal>

      {/* Add Referee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Independent Referee"
      >
          <form autoComplete="off" onSubmit={(e) => e.preventDefault()} className="space-y-4">
              {/* Dummy inputs to trick password managers */}
              <input type="email" style={{display:'none'}} autoComplete="email" />
              <input type="password" style={{display:'none'}} autoComplete="new-password" />
              
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
                        autoComplete="off"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                        placeholder="john@example.com"
                        value={newReferee.email}
                        onChange={(e) => setNewReferee({...newReferee, email: e.target.value})}
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Initial Password <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          autoComplete="new-password"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none pr-10"
                          placeholder="Set initial password"
                          value={newReferee.password}
                          onChange={(e) => setNewReferee({...newReferee, password: e.target.value})}
                        />
                        <button 
                          type="button" 
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                  </div>
              </div>
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                    placeholder="+91 98765 43210"
                    value={newReferee.mobile}
                    onChange={(e) => setNewReferee({...newReferee, mobile: e.target.value})}
                  />
              </div>
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Experience (Years)</label>
                  <input 
                    type="number"
                    min="0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                    placeholder="e.g. 5"
                    value={newReferee.experience}
                    onChange={(e) => setNewReferee({...newReferee, experience: e.target.value})}
                  />
              </div>
              <div className="flex justify-end pt-4 gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                  <Button type="button" onClick={handleAddReferee} disabled={!newReferee.name || !newReferee.email || !newReferee.password}>Add Referee</Button>
              </div>
          </form>
      </Modal>
      
      {/* Edit Referee Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Independent Referee"
      >
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                    placeholder="e.g. John Doe"
                    value={editReferee.name}
                    onChange={(e) => setEditReferee({...editReferee, name: e.target.value})}
                  />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        disabled
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-500 outline-none cursor-not-allowed"
                        value={editReferee.email}
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Mobile Number</label>
                      <input 
                        type="tel" 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                        placeholder="+91 98765 43210"
                        value={editReferee.mobile}
                        onChange={(e) => setEditReferee({...editReferee, mobile: e.target.value})}
                      />
                  </div>
              </div>
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Experience (Years)</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                    placeholder="e.g. 5"
                    value={editReferee.experience}
                    onChange={(e) => setEditReferee({...editReferee, experience: e.target.value})}
                  />
              </div>
              <div className="flex justify-end pt-4 gap-2">
                  <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleEditReferee} disabled={!editReferee.name || !editReferee.email}>Save Changes</Button>
              </div>
          </div>
      </Modal>
      </>
    
  );
};