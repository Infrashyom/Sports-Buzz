import React, { useState, useEffect } from 'react';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { Plus, Award, Mail, Phone, Ban, Edit2, ShieldCheck, CheckCircle, FileText, Star, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface StaffMember {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  mobile?: string;
  role: string;
  sport?: string;
  certification?: string;
  certifications?: Array<{ name: string; status: string }>;
  status: string;
  password?: string;
  rating?: number;
}

export const SchoolStaff = () => {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [sports, setSports] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT'>('ADD');
  
  const [banId, setBanId] = useState<string | null>(null);
  const [selectedStaffForBan, setSelectedStaffForBan] = useState<StaffMember | null>(null);
  const [selectedRefereeCerts, setSelectedRefereeCerts] = useState<StaffMember | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<StaffMember>>({
    name: '', email: '', phone: '', sport: '', role: 'REFEREE', certification: '', password: ''
  });

  const { user } = useAuth();

  useEffect(() => {
    if (user?.schoolId) {
      api.get(`/users?schoolId=${user.schoolId}`).then(res => {
         setStaffList(res.data.data.users);
      });
    }
    api.get('/sports').then(res => {
      setSports(res.data.data.sports);
      if (res.data.data.sports.length > 0) {
        setFormData(prev => ({ ...prev, sport: prev.sport || res.data.data.sports[0].name }));
      }
    }).catch(console.error);
  }, [user]);

  const filteredStaff = staffList.filter(s => {
      return s.role === 'REFEREE';
  });

  const openAddModal = () => {
      setModalMode('ADD');
      setFormData({ name: '', email: '', phone: '', sport: sports.length > 0 ? sports[0].name : '', role: 'REFEREE', certification: '', password: '' });
      setIsModalOpen(true);
  };

  const openEditModal = (staff: StaffMember) => {
      setModalMode('EDIT');
      setFormData({ ...staff, password: '' });
      setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || (modalMode === 'ADD' && !formData.password)) {
        toast.error("Please fill all mandatory fields.");
        return;
    }

    if (modalMode === 'ADD') {
        try {
            const addedStaff = await api.post('/users', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'REFEREE',
                mobile: formData.phone,
                sport: formData.sport,
                certifications: formData.certification ? [{ name: formData.certification, status: 'Pending' }] : undefined,
                status: 'Pending'
            });
            setStaffList([...staffList, addedStaff.data.data.user]);
            toast.success(`Referee added successfully.`);
            setIsModalOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add staff");
        }
    } else {
        try {
          const res = await api.patch(`/users/${formData._id || formData.id}`, formData);
          setStaffList(staffList.map(s => s._id === formData._id ? res.data.data.user : s));
          toast.success(`Referee details updated.`);
          setIsModalOpen(false);
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to update staff");
        }
    }
  };

  const initiateBan = (staff: any) => {
    setSelectedStaffForBan(staff);
    setBanId(staff._id);
  };

  const handleToggleBan = async () => {
    if (banId && selectedStaffForBan) {
      try {
        const newStatus = selectedStaffForBan.status === 'Banned' ? 'Active' : 'Banned';
        await api.patch(`/users/${banId}/status`, { status: newStatus });
        setStaffList(staffList.map(s => s._id === banId ? { ...s, status: newStatus } : s));
        toast.success(`Staff member status changed to ${newStatus}.`);
        setBanId(null);
        setSelectedStaffForBan(null);
      } catch {
        toast.error('Failed to change status');
      }
    }
  };

  const viewCertifications = (staff: any) => {
      setSelectedRefereeCerts(staff);
      setIsCertModalOpen(true);
  };

  return (<>
    
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Referees</h1>
          <p className="text-slate-500">Nominate Referees for official tournaments.</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={openAddModal} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" /> Add Referee
          </Button>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((staff) => (
          <Card key={staff._id || staff.id} className="relative group hover:shadow-md transition-shadow">
            <div className="absolute top-4 right-4">
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                staff.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                staff.status === 'Pending Approval' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                staff.status === 'Banned' ? 'bg-red-50 text-red-700 border-red-200' :
                'bg-slate-100 text-slate-500 border-slate-200'
              }`}>
                {staff.status}
              </span>
            </div>

            <div className="flex items-start space-x-4 mb-4">
              <div className="h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold bg-purple-100 text-purple-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight">{staff.name}</h3>
                <p className="text-sm text-slate-500 flex items-center mt-1">
                  <Award className="h-3 w-3 mr-1" /> {staff.sport}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 text-sm">
              <div className="flex items-center text-slate-600">
                <Mail className="h-4 w-4 mr-3 text-slate-400" /> {staff.email}
              </div>
              <div className="flex items-center text-slate-600">
                <Phone className="h-4 w-4 mr-3 text-slate-400" /> {staff.mobile || staff.phone || 'N/A'}
              </div>
              <div className="flex items-center text-slate-600">
                <Star className="h-4 w-4 mr-3 text-yellow-500" /> 
                {staff.rating ? `${staff.rating}.0 / 5.0` : 'Not rated yet'}
              </div>
              <div className="flex items-center text-blue-600 cursor-pointer hover:underline" onClick={() => viewCertifications(staff)}>
                <FileText className="h-4 w-4 mr-3" /> View Certifications
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditModal(staff)}>
                <Edit2 className="h-4 w-4 mr-2" /> Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={staff.status === 'Banned' ? "text-green-600 hover:bg-green-50" : "text-slate-400 hover:text-red-600 hover:bg-red-50"}
                onClick={() => initiateBan(staff)}
                title={staff.status === 'Banned' ? "Unban" : "Ban"}
              >
                 {staff.status === 'Banned' ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
              </Button>
            </div>
          </Card>
        ))}

        {/* Empty State / Add New Card */}
        <button 
          onClick={openAddModal}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors min-h-[250px] group"
        >
          <div className="h-12 w-12 rounded-full bg-slate-100 group-hover:bg-blue-200 flex items-center justify-center mb-4 transition-colors">
            <Plus className="h-6 w-6 text-slate-400 group-hover:text-blue-600" />
          </div>
          <h3 className="font-bold text-slate-900">Add New Referee</h3>
          <p className="text-sm text-slate-500 text-center mt-2 max-w-[200px]">
            Nominate a qualified referee for upcoming tournaments.
          </p>
        </button>
      </div>

      {/* Add/Edit Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'ADD' ? `Add New Referee` : `Edit Referee Details`}
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100">
             Referees added here will be reviewed by the Platform Admin before they can officiate official matches.
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
            <input 
              type="text"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 focus:bg-white outline-none transition-colors"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email <span className="text-red-500">*</span> {modalMode === 'EDIT' && '(Read-Only)'}</label>
                <input 
                  type="email"
                  className={`w-full px-4 py-2 border rounded-lg transition-colors ${modalMode === 'EDIT' ? 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200' : 'bg-slate-50 text-slate-900 focus:bg-white border-slate-300 focus:ring-2 focus:ring-blue-500'}`}
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={modalMode === 'EDIT'}
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Phone</label>
                <input 
                  type="tel"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 focus:bg-white outline-none transition-colors"
                  placeholder="(555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Primary Sport</label>
              <select 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 focus:bg-white outline-none transition-colors"
                value={formData.sport}
                onChange={(e) => setFormData({...formData, sport: e.target.value})}
              >
                {sports.map(s => (
                  <option key={s._id || s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            {modalMode === 'ADD' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Temporary Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 focus:bg-white outline-none transition-colors"
                    placeholder="Enter password"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
             <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
             <Button onClick={handleSubmit}>{modalMode === 'ADD' ? `Add Referee` : 'Save Changes'}</Button>
          </div>
        </div>
      </Modal>
      
      {/* View Certifications Modal */}
      <Modal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        title="Referee Certifications"
      >
        {selectedRefereeCerts && (
            <div className="space-y-4">
                {(selectedRefereeCerts.certifications || []).length > 0 ? (
                  (selectedRefereeCerts.certifications || []).map((cert: any, idx: number) => (
                    <div key={idx} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-100 flex-col md:flex-row gap-4 mb-2">
                        <div className="mt-1 p-2 bg-blue-100 rounded text-blue-600 self-start hidden md:block">
                            <Award className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-900 text-sm">{cert.name}</h4>
                            <p className="text-xs text-slate-500">Authority: {cert.authority || 'N/A'}</p>
                            {cert.licenseId && cert.licenseId.startsWith('http') && (
                                <a href={cert.licenseId} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline inline-flex items-center mt-1 font-medium bg-blue-50 px-2 py-1 rounded">
                                    <FileText className="h-3 w-3 mr-1" /> View Document
                                </a>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <span className={`text-xs font-bold ${cert.status === 'Verified' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'} px-2 py-1 rounded`}>
                              {cert.status}
                          </span>
                          {cert.status === 'Pending' && (
                              <Button size="sm" onClick={async () => {
                                 const updatedCerts = [...(selectedRefereeCerts.certifications || [])];
                                 updatedCerts[idx].status = 'Verified';
                                 try {
                                   await api.patch(`/users/${selectedRefereeCerts._id}`, { certifications: updatedCerts, status: 'Active' });
                                   setSelectedRefereeCerts({...selectedRefereeCerts, certifications: updatedCerts, status: 'Active'});
                                   setStaffList(staffList.map(s => s._id === selectedRefereeCerts._id ? {...s, certifications: updatedCerts, status: 'Active'} : s));
                                   toast.success('Certification verified and referee activated');
                                 } catch {
                                   toast.error('Failed to verify');
                                 }
                              }}>Verify</Button>
                          )}
                        </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
                      No certifications on file.
                  </div>
                )}
                
                <div className="flex justify-end pt-4 mt-2 border-t border-slate-100">
                    <Button onClick={() => setIsCertModalOpen(false)}>Close</Button>
                </div>
            </div>
        )}
      </Modal>

      {/* Confirmation Modal (Ban/Unban) */}
      <ConfirmationModal
        isOpen={!!banId}
        onClose={() => setBanId(null)}
        onConfirm={handleToggleBan}
        title={selectedStaffForBan?.status === 'Banned' ? "Unban Staff" : "Ban Staff"}
        message={selectedStaffForBan?.status === 'Banned'
            ? "Are you sure you want to reactivate this staff member? They will regain access to school management features."
            : "Are you sure you want to ban this staff member? They will lose access immediately."
        }
        confirmLabel={selectedStaffForBan?.status === 'Banned' ? "Unban" : "Ban"}
        variant={selectedStaffForBan?.status === 'Banned' ? "primary" : "danger"}
      /></>
    
  );
};