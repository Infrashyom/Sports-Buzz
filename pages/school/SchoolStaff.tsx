import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { Plus, Award, Mail, Phone, Ban, Edit2, ShieldCheck, Briefcase, CheckCircle, FileText, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Coach' | 'Referee';
  sport: string;
  certification?: string;
  status: 'Active' | 'Pending Approval' | 'Inactive' | 'Banned';
  password?: string;
  rating?: number;
}

const MOCK_STAFF: StaffMember[] = [
  { id: '1', name: 'Coach Carter', email: 'carter@springfield.edu', phone: '555-0101', role: 'Coach', sport: 'Basketball', status: 'Active' },
  { id: '2', name: 'John Whistle', email: 'john.w@gmail.com', phone: '555-0102', role: 'Referee', sport: 'Cricket', certification: 'Level 2 Umpire', status: 'Active', rating: 4 },
  { id: '3', name: 'Sarah Line', email: 'sarah.l@gmail.com', phone: '555-0103', role: 'Referee', sport: 'Badminton', certification: 'BWF Basic', status: 'Pending Approval', rating: 5 },
];

export const SchoolStaff = () => {
  const [activeTab, setActiveTab] = useState<'Coach' | 'Referee'>('Coach');
  const [staffList, setStaffList] = useState<StaffMember[]>(MOCK_STAFF);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT'>('ADD');
  
  const [banId, setBanId] = useState<string | null>(null);
  const [selectedStaffForBan, setSelectedStaffForBan] = useState<StaffMember | null>(null);
  const [selectedRefereeCerts, setSelectedRefereeCerts] = useState<StaffMember | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<StaffMember>>({
    name: '', email: '', phone: '', sport: 'Cricket', role: 'Coach', certification: '', password: ''
  });

  const filteredStaff = staffList.filter(s => s.role === activeTab);

  const openAddModal = () => {
      setModalMode('ADD');
      setFormData({ name: '', email: '', phone: '', sport: 'Cricket', role: activeTab, certification: '', password: '' });
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
            await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: activeTab === 'Coach' ? 'SCHOOL' : 'REFEREE', // Assuming Coach logs in as SCHOOL or we need a new role. For now, let's use REFEREE for referees.
                mobile: formData.phone
            });

            const staff: StaffMember = {
                id: Date.now().toString(),
                name: formData.name || '',
                email: formData.email || '',
                phone: formData.phone || '',
                role: activeTab,
                sport: formData.sport || 'Cricket',
                certification: activeTab === 'Referee' ? formData.certification : undefined,
                status: activeTab === 'Referee' ? 'Pending Approval' : 'Active'
            };
            setStaffList([...staffList, staff]);
            toast.success(`${activeTab} added successfully. Credentials sent to email.`);
            setIsModalOpen(false);
        } catch {
            // Fallback for demo
            const staff: StaffMember = {
                id: Date.now().toString(),
                name: formData.name || '',
                email: formData.email || '',
                phone: formData.phone || '',
                role: activeTab,
                sport: formData.sport || 'Cricket',
                certification: activeTab === 'Referee' ? formData.certification : undefined,
                status: activeTab === 'Referee' ? 'Pending Approval' : 'Active'
            };
            setStaffList([...staffList, staff]);
            toast.success(`${activeTab} added locally (Demo mode).`);
            setIsModalOpen(false);
        }
    } else {
        setStaffList(staffList.map(s => s.id === formData.id ? { ...s, ...formData } as StaffMember : s));
        toast.success(`${activeTab} details updated.`);
        setIsModalOpen(false);
    }
  };

  const initiateBan = (staff: StaffMember) => {
    setSelectedStaffForBan(staff);
    setBanId(staff.id);
  };

  const handleToggleBan = () => {
    if (banId) {
      setStaffList(staffList.map(s => {
          if (s.id === banId) {
              const newStatus = s.status === 'Banned' ? 'Active' : 'Banned';
              toast.success(`Staff member status changed to ${newStatus}.`);
              return { ...s, status: newStatus };
          }
          return s;
      }));
      setBanId(null);
      setSelectedStaffForBan(null);
    }
  };

  const viewCertifications = (staff: StaffMember) => {
      setSelectedRefereeCerts(staff);
      setIsCertModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
          <p className="text-slate-500">Manage your Coaches and nominate Referees for official tournaments.</p>
        </div>
        <Button onClick={openAddModal} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" /> Add {activeTab}
        </Button>
      </div>

      {/* Tabs */}
      <div className="bg-white p-1 rounded-xl border border-slate-200 inline-flex mb-6 shadow-sm">
        <button
          onClick={() => setActiveTab('Coach')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'Coach' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Coaches
        </button>
        <button
          onClick={() => setActiveTab('Referee')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'Referee' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Referees
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((staff) => (
          <Card key={staff.id} className="relative group hover:shadow-md transition-shadow">
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
              <div className={`h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold ${
                staff.role === 'Coach' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
              }`}>
                {staff.role === 'Coach' ? <Briefcase className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
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
                <Phone className="h-4 w-4 mr-3 text-slate-400" /> {staff.phone}
              </div>
              {staff.role === 'Referee' && (
                <>
                  <div className="flex items-center text-slate-600">
                    <Star className="h-4 w-4 mr-3 text-yellow-500" /> 
                    {staff.rating ? `${staff.rating}.0 / 5.0` : 'Not rated yet'}
                  </div>
                  <div className="flex items-center text-blue-600 cursor-pointer hover:underline" onClick={() => viewCertifications(staff)}>
                    <FileText className="h-4 w-4 mr-3" /> View Certifications
                  </div>
                </>
              )}
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
          <h3 className="font-bold text-slate-900">Add New {activeTab}</h3>
          <p className="text-sm text-slate-500 text-center mt-2 max-w-[200px]">
            {activeTab === 'Referee' 
              ? 'Nominate a qualified referee for upcoming tournaments.' 
              : 'Add coaching staff to manage school teams.'}
          </p>
        </button>
      </div>

      {/* Add/Edit Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'ADD' ? `Add New ${activeTab}` : `Edit ${activeTab} Details`}
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100">
             {activeTab === 'Referee' 
               ? 'Referees added here will be reviewed by the Platform Admin before they can officiate official matches.'
               : 'Coaches added here will be able to manage team rosters and view student details.'}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
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
                <label className="block text-sm font-bold text-slate-700 mb-1">Email {modalMode === 'EDIT' && '(Read-Only)'}</label>
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
                <option value="Cricket">Cricket</option>
                <option value="Basketball">Basketball</option>
                <option value="Badminton">Badminton</option>
                <option value="Football">Football</option>
              </select>
            </div>
            {modalMode === 'ADD' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Temporary Password <span className="text-red-500">*</span></label>
                <input 
                  type="password"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 focus:bg-white outline-none transition-colors"
                  placeholder="Enter password"
                  value={formData.password || ''}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
             <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
             <Button onClick={handleSubmit}>{modalMode === 'ADD' ? `Add ${activeTab}` : 'Save Changes'}</Button>
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
                <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="mt-1 p-2 bg-blue-100 rounded text-blue-600">
                        <Award className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-sm">Primary Certification</h4>
                        <p className="text-sm text-slate-700">{selectedRefereeCerts.certification || 'No active certification on file.'}</p>
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Verified</span>
                </div>
                
                {/* Mocking a history list for visual completeness */}
                <div className="border-t border-slate-100 pt-4 mt-2">
                    <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">History</h5>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex justify-between">
                            <span>Basic Umpire Course</span>
                            <span className="text-slate-400">2021</span>
                        </li>
                    </ul>
                </div>
                
                <div className="flex justify-end pt-4">
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
      />
    </DashboardLayout>
  );
};