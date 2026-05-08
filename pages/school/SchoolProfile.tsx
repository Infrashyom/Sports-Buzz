import React, { useState, useEffect, useRef } from 'react';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { MapPin, Phone, Mail, Edit2, Plus, Dumbbell, Waves, Warehouse, Upload } from 'lucide-react';
import { Facility } from '../../types';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const SchoolProfile = () => {
  const { user, updateProfile } = useAuth();
  const [schoolData, setSchoolData] = useState<any>(null); 
  const [facilities, setFacilities] = useState<Facility[]>([]);
  
  useEffect(() => {
    if (user?.schoolId) {
      api.get(`/schools/${user.schoolId}`).then(res => {
        setSchoolData(res.data.data.school);
        setFacilities(res.data.data.school.facilities || []);
      }).catch(err => {
        console.error("Failed to load school", err);
      });
    }
  }, [user]);
  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
      phone: '',
      description: '',
      address: '',
      logo: ''
  });
  const [phoneError, setPhoneError] = useState('');
  
  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Add Facility Modal State
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const [newFacility, setNewFacility] = useState<Partial<Facility>>({
      name: '',
      type: 'Indoor',
      status: 'Available'
  });

  const getFacilityIcon = (type: string) => {
    switch (type) {
      case 'Pool': return <Waves className="h-5 w-5" />;
      case 'Gym': return <Dumbbell className="h-5 w-5" />;
      case 'Indoor': return <Warehouse className="h-5 w-5" />;
      default: return <Warehouse className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-700';
      case 'Booked': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const validatePhone = (phone: string) => {
    // Basic validation: 10-15 digits, optional + at start, optional spaces/-
    const regex = /^\+?[\d\s-]{10,15}$/;
    if (!phone) return true; // Optionally empty
    return regex.test(phone.replace(/[\s-]/g, ''));
  };

  const handleSaveChanges = async () => {
      if (editForm.phone && !validatePhone(editForm.phone)) {
        setPhoneError('Please enter a valid phone number (e.g. +1234567890)');
        return;
      }
      setPhoneError('');
      
      try {
        const payload: any = {
           phone: editForm.phone,
           description: editForm.description,
           address: editForm.address,
        };
        if (editForm.logo && editForm.logo.startsWith('data:image')) {
            payload.logo = editForm.logo;
            // Update the auth user's avatar too
            updateProfile({ avatar: editForm.logo });
        }
        
        const res = await api.patch(`/schools/${schoolData._id}`, payload);
        setSchoolData(res.data.data.school);
        toast.success("School profile updated successfully");
        setIsEditModalOpen(false);
        setSelectedFile(null);
      } catch {
        toast.error("Failed to update profile");
      }
  };

  // Add Facility Handlers
  const handleAddFacility = async () => {
      if (newFacility.name) {
          try {
              const res = await api.post(`/schools/${schoolData._id}/facilities`, newFacility);
              setFacilities(res.data.data.school.facilities);
              toast.success("Facility added");
              setIsFacilityModalOpen(false);
              setNewFacility({ name: '', type: 'Indoor', status: 'Available' });
          } catch {
              toast.error("Failed to add facility");
          }
      }
  };

  const handleUpdateFacilityStatus = async (facilityId: string, status: string) => {
    try {
      const res = await api.patch(`/schools/${schoolData._id}/facilities/${facilityId}`, { status });
      setFacilities(res.data.data.school.facilities);
      toast.success("Facility status updated");
    } catch {
      toast.error("Failed to update facility status");
    }
  };

  const openEditModal = () => {
      setEditForm({
          phone: schoolData.phone || '',
          description: schoolData.description || '',
          address: schoolData.address || '',
          logo: schoolData.logo || ''
      });
      setSelectedFile(null);
      setIsEditModalOpen(true);
  };

  if (!schoolData) {
    return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>;
  }

  return (<>
    
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">School Profile</h1>
          <p className="text-slate-500">Manage your institution's details and facilities.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openEditModal} className="flex items-center">
            <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="text-center">
            <div className="relative inline-block">
              <img 
                src={schoolData.logo || "https://ui-avatars.com/api/?name=" + schoolData.name} 
                alt={schoolData.name} 
                className="h-32 w-32 rounded-full object-cover border-4 border-slate-100 mx-auto"
              />
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">{schoolData.name}</h2>
            <div className="mt-1 flex items-center justify-center space-x-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase">
                Rank #{schoolData.cityRank}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase">
                Active
              </span>
            </div>
          </Card>

          <Card title="Contact Information">
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-slate-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Address</p>
                  <p className="text-sm text-slate-500">{schoolData.address}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-slate-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Phone</p>
                  <p className="text-sm text-slate-500">{schoolData.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-slate-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Email</p>
                  <p className="text-sm text-slate-500">{schoolData.contactEmail}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Description & Facilities */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="About Us">
            <p className="text-slate-600 leading-relaxed">
              {schoolData.description || "No description provided."}
            </p>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
               <h3 className="font-semibold text-slate-900">Campus Facilities</h3>
               <Button size="sm" className="flex items-center" onClick={() => setIsFacilityModalOpen(true)}>
                 <Plus className="h-4 w-4 mr-2" /> Add Facility
               </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {facilities.map((facility) => (
                <div key={facility.id} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        {getFacilityIcon(facility.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{facility.name}</h4>
                        <p className="text-xs text-slate-500">{facility.type}</p>
                      </div>
                    </div>
                    <select
                      className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer border-none outline-none appearance-none hover:opacity-80 transition-opacity ${getStatusColor(facility.status)}`}
                      value={facility.status}
                      onChange={(e) => handleUpdateFacilityStatus((facility as any)._id || facility.id, e.target.value)}
                    >
                      <option value="Available" className="bg-white text-slate-900">Available</option>
                      <option value="Maintenance" className="bg-white text-slate-900">Maintenance</option>
                      <option value="Booked" className="bg-white text-slate-900">Booked</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit School Profile"
      >
          <div className="space-y-4">
              {/* Read Only Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-bold text-slate-400 mb-1">School Name (Read-Only)</label>
                      <input 
                          type="text" 
                          value={schoolData.name}
                          disabled
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-slate-400 mb-1">Email Address (Primary)</label>
                      <input 
                          type="text" 
                          value={schoolData.contactEmail}
                          disabled
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                      />
                  </div>
                  <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-400 mb-1">Address (Read-Only)</label>
                      <input 
                          type="text" 
                          value={schoolData.address}
                          disabled
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                      />
                  </div>
              </div>

              <div className="h-px bg-slate-100 my-4"></div>

              {/* Editable Fields */}
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">School Logo</label>
                  <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*"
                  />
                  <div 
                      onClick={triggerFileUpload}
                      className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-slate-50 transition-all cursor-pointer bg-white"
                  >
                      <Upload className={`h-8 w-8 mx-auto mb-2 ${selectedFile ? 'text-blue-500' : 'text-slate-400'}`} />
                      {editForm.logo && editForm.logo.startsWith('data:image') ? (
                          <div className="flex flex-col items-center">
                            <img src={editForm.logo} alt="Preview" className="h-16 w-16 rounded-full object-cover mb-2" />
                            <p className="text-sm font-medium text-blue-600">New logo selected</p>
                          </div>
                      ) : (
                           <>
                              <p className="text-sm font-medium text-slate-700">Click to upload new logo</p>
                              <p className="text-xs text-slate-400 mt-1">JPG, PNG (Max 2MB)</p>
                           </>
                      )}
                  </div>
              </div>

              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                  <input 
                      type="text" 
                      value={editForm.phone}
                      onChange={(e) => {
                        setEditForm({...editForm, phone: e.target.value});
                        if (phoneError) setPhoneError('');
                      }}
                      className={`w-full px-4 py-2 border rounded-lg bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${phoneError ? 'border-red-500' : 'border-slate-300'}`}
                  />
                  {phoneError && <p className="mt-1 text-xs text-red-500">{phoneError}</p>}
              </div>

              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Address</label>
                  <input 
                      type="text" 
                      value={editForm.address}
                      onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                  />
              </div>

              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">About Us</label>
                  <textarea 
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                  ></textarea>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 gap-2">
                  <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveChanges}>Save Changes</Button>
              </div>
          </div>
      </Modal>

      {/* Add Facility Modal */}
      <Modal
        isOpen={isFacilityModalOpen}
        onClose={() => setIsFacilityModalOpen(false)}
        title="Add Campus Facility"
      >
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Facility Name</label>
                  <input 
                      type="text" 
                      placeholder="e.g. West Wing Gym"
                      value={newFacility.name}
                      onChange={(e) => setNewFacility({...newFacility, name: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                  />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                      <select 
                          value={newFacility.type}
                          onChange={(e) => setNewFacility({...newFacility, type: e.target.value as Facility['type']})}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                      >
                          <option value="Indoor">Indoor</option>
                          <option value="Outdoor">Outdoor</option>
                          <option value="Pool">Pool</option>
                          <option value="Gym">Gym</option>
                          <option value="Field">Field</option>
                      </select>
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                      <select 
                          value={newFacility.status}
                          onChange={(e) => setNewFacility({...newFacility, status: e.target.value as Facility['status']})}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                      >
                          <option value="Available">Available</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="Booked">Booked</option>
                      </select>
                  </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 gap-2">
                  <Button variant="outline" onClick={() => setIsFacilityModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddFacility} disabled={!newFacility.name}>Add Facility</Button>
              </div>
          </div>
      </Modal></>
    
  );
};