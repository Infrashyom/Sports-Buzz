import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Search, Filter, CheckCircle, XCircle, Plus, MapPin, Mail, Phone, Edit2 } from 'lucide-react';
import { MOCK_SCHOOLS } from '../../services/mockData';
import { School } from '../../types';
import toast from 'react-hot-toast';
import api from '../../services/api';

import { exportToExcel } from '../../services/export';

export const SchoolManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive' | 'Paid' | 'Pending' | 'Overdue'>('All');
  
  // Initialize schools with mock data and default payment status if missing
  const [schools, setSchools] = useState<School[]>(MOCK_SCHOOLS.map(s => ({ ...s, paymentStatus: s.isSubscribed ? 'Paid' : 'Pending' })));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<School> & { password?: string }>({
    name: '',
    address: '',
    contactEmail: '',
    phone: '',
    studentCount: 0,
    participatedStudents: 0,
    isSubscribed: true,
    paymentStatus: 'Paid',
    password: ''
  });

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterStatus === 'Active') matchesFilter = school.isSubscribed;
    else if (filterStatus === 'Inactive') matchesFilter = !school.isSubscribed;
    else if (filterStatus === 'Paid') matchesFilter = school.paymentStatus === 'Paid';
    else if (filterStatus === 'Pending') matchesFilter = school.paymentStatus === 'Pending';
    else if (filterStatus === 'Overdue') matchesFilter = school.paymentStatus === 'Overdue';
    
    return matchesSearch && matchesFilter;
  });

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setFormData({ name: '', address: '', contactEmail: '', phone: '', studentCount: 0, participatedStudents: 0, isSubscribed: true, paymentStatus: 'Paid', password: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (school: School) => {
    setIsEditMode(true);
    setSelectedSchoolId(school.id);
    setFormData({
      name: school.name,
      address: school.address,
      contactEmail: school.contactEmail,
      phone: school.phone,
      studentCount: school.studentCount,
      participatedStudents: school.participatedStudents || 0,
      isSubscribed: school.isSubscribed,
      paymentStatus: school.paymentStatus || 'Pending',
      password: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.contactEmail || !formData.address || (!isEditMode && !formData.password)) {
      toast.error("Please fill all mandatory fields.");
      return;
    }

    if (isEditMode && selectedSchoolId) {
      setSchools(schools.map(s => s.id === selectedSchoolId ? { ...s, ...formData } as School : s));
      toast.success("School updated successfully.");
      setIsModalOpen(false);
    } else {
      try {
        // Create user and school in backend
        await api.post('/auth/register', {
          name: formData.name,
          email: formData.contactEmail,
          password: formData.password,
          role: 'SCHOOL',
          schoolName: formData.name,
          schoolAddress: formData.address,
          schoolEmail: formData.contactEmail
        });

        const school: School = {
          id: `s${Date.now()}`,
          name: formData.name!,
          address: formData.address!,
          contactEmail: formData.contactEmail!,
          phone: formData.phone,
          logo: `https://picsum.photos/seed/${formData.name}/100`, // Mock logo
          isSubscribed: !!formData.isSubscribed,
          paymentStatus: formData.paymentStatus,
          studentCount: Number(formData.studentCount) || 0,
          participatedStudents: Number(formData.participatedStudents) || 0,
          cityRank: schools.length + 1,
          facilities: []
        };
        setSchools([...schools, school]);
        toast.success("School created successfully. Credentials sent to email.");
        setIsModalOpen(false);
      } catch {
        // Fallback for demo
        const school: School = {
          id: `s${Date.now()}`,
          name: formData.name!,
          address: formData.address!,
          contactEmail: formData.contactEmail!,
          phone: formData.phone,
          logo: `https://picsum.photos/seed/${formData.name}/100`, // Mock logo
          isSubscribed: !!formData.isSubscribed,
          paymentStatus: formData.paymentStatus,
          studentCount: Number(formData.studentCount) || 0,
          participatedStudents: Number(formData.participatedStudents) || 0,
          cityRank: schools.length + 1,
          facilities: []
        };
        setSchools([...schools, school]);
        toast.success("School created locally (Demo mode).");
        setIsModalOpen(false);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">School Management</h1>
          <p className="text-slate-500">Manage registrations, subscriptions, and approvals.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => exportToExcel(schools, 'Schools')}>Export Excel</Button>
          <Button onClick={handleOpenAddModal} className="flex items-center">
             <Plus className="h-4 w-4 mr-2" /> Add New School
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search schools..." 
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
                onChange={(e) => setFilterStatus(e.target.value as 'All' | 'Active' | 'Inactive' | 'Paid' | 'Pending' | 'Overdue')}
             >
                 <option value="All">All Status</option>
                 <option value="Active">Subscribed (Active)</option>
                 <option value="Inactive">Unsubscribed</option>
                 <option value="Paid">Payment: Paid</option>
                 <option value="Pending">Payment: Pending</option>
                 <option value="Overdue">Payment: Overdue</option>
             </select>
          </div>
        </div>
      </Card>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
                <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">School Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Total Students</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Participated</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Subscription</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
                {filteredSchools.map((school) => (
                <tr key={school.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover border border-slate-200" src={school.logo} alt="" />
                        </div>
                        <div className="ml-4">
                        <div className="text-sm font-bold text-slate-900">{school.name}</div>
                        <div className="text-xs text-slate-500 flex items-center mt-0.5">
                            <MapPin className="h-3 w-3 mr-1" /> {school.address.split(',')[0]}
                        </div>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex flex-col space-y-1">
                             <div className="flex items-center text-sm text-slate-600">
                                 <Mail className="h-3.5 w-3.5 mr-2 text-slate-400" /> {school.contactEmail}
                             </div>
                             <div className="flex items-center text-sm text-slate-600">
                                 <Phone className="h-3.5 w-3.5 mr-2 text-slate-400" /> {school.phone || 'N/A'}
                             </div>
                         </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-slate-700">
                    {school.studentCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-slate-700">
                    {school.participatedStudents || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                    {school.isSubscribed ? (
                        <span className="px-2.5 py-0.5 inline-flex text-xs font-bold rounded-full bg-green-100 text-green-700 border border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1 self-center" /> Active
                        </span>
                    ) : (
                        <span className="px-2.5 py-0.5 inline-flex text-xs font-bold rounded-full bg-red-100 text-red-700 border border-red-200">
                        <XCircle className="h-3 w-3 mr-1 self-center" /> Inactive
                        </span>
                    )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2.5 py-0.5 inline-flex text-xs font-bold rounded-full border ${
                            school.paymentStatus === 'Paid' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                            school.paymentStatus === 'Overdue' ? 'bg-red-100 text-red-700 border-red-200' :
                            'bg-yellow-100 text-yellow-700 border-yellow-200'
                        }`}>
                            {school.paymentStatus || 'Pending'}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-800 font-bold text-sm">
                            #{school.cityRank}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                        <button 
                            onClick={() => handleOpenEditModal(school)}
                            className="text-slate-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit School"
                        >
                            <Edit2 className="h-4 w-4" />
                        </button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

      {/* School Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? "Edit School Details" : "Add New School"}
      >
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">School Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                    placeholder="e.g. Westside High"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Contact Email <span className="text-red-500">*</span></label>
                    <input 
                        type="email" 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                        placeholder="admin@school.edu"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                    <input 
                        type="tel" 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                        placeholder="(555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
              </div>

              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Address <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                    placeholder="123 Education Lane, Cityville"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Total Students <span className="text-red-500">*</span></label>
                    <input 
                        type="number" 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                        placeholder="e.g. 1200"
                        value={formData.studentCount}
                        onChange={(e) => setFormData({...formData, studentCount: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Participated Students</label>
                    <input 
                        type="number" 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                        placeholder="e.g. 150"
                        value={formData.participatedStudents}
                        onChange={(e) => setFormData({...formData, participatedStudents: parseInt(e.target.value)})}
                    />
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Payment Status</label>
                    <select
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                        value={formData.paymentStatus}
                        onChange={(e) => setFormData({...formData, paymentStatus: e.target.value as 'Paid' | 'Pending' | 'Overdue'})}
                    >
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                  {!isEditMode && (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Initial Password <span className="text-red-500">*</span></label>
                      <input 
                          type="password" 
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                          placeholder="Set initial password"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                    </div>
                  )}
              </div>

              <div className="flex items-center pt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                        checked={formData.isSubscribed}
                        onChange={(e) => setFormData({...formData, isSubscribed: e.target.checked})}
                      />
                      <span className="text-sm font-medium text-slate-900">Active Subscription</span>
                  </label>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 gap-2">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleSubmit} disabled={!formData.name || !formData.contactEmail}>
                      {isEditMode ? 'Update School' : 'Create School'}
                  </Button>
              </div>
          </div>
      </Modal>
    </DashboardLayout>
  );
};