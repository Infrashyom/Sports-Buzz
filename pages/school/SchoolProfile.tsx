import React, { useState, useRef } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { MOCK_SCHOOLS } from '../../services/mockData';
import { MapPin, Phone, Mail, Edit2, Plus, Dumbbell, Waves, Warehouse, Upload } from 'lucide-react';
import { Facility } from '../../types';

export const SchoolProfile = () => {
  // Simulating fetching the logged-in school's data
  const [schoolData, setSchoolData] = useState(MOCK_SCHOOLS[0]); 
  const [facilities, setFacilities] = useState<Facility[]>(schoolData.facilities || []);
  
  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
      phone: schoolData.phone || '',
      description: schoolData.description || '',
      // Logo is handled separately via file upload simulation
  });
  
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

  // Edit Profile Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file.name);
      const url = URL.createObjectURL(file);
      setSchoolData(prev => ({ ...prev, logo: url }));
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSaveChanges = () => {
      setSchoolData({
          ...schoolData,
          phone: editForm.phone,
          description: editForm.description,
      });
      setIsEditModalOpen(false);
      setSelectedFile(null);
  };

  // Add Facility Handlers
  const handleAddFacility = () => {
      if (newFacility.name) {
          const facility: Facility = {
              id: `fac-${Date.now()}`,
              name: newFacility.name,
              type: newFacility.type as Facility['type'],
              status: newFacility.status as Facility['status']
          };
          setFacilities([...facilities, facility]);
          setIsFacilityModalOpen(false);
          setNewFacility({ name: '', type: 'Indoor', status: 'Available' }); // Reset
      }
  };

  const openEditModal = () => {
      setEditForm({
          phone: schoolData.phone || '',
          description: schoolData.description || ''
      });
      setSelectedFile(null);
      setIsEditModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">School Profile</h1>
          <p className="text-slate-500">Manage your institution's details and facilities.</p>
        </div>
        <Button onClick={openEditModal} className="flex items-center">
          <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="text-center">
            <div className="relative inline-block">
              <img 
                src={schoolData.logo} 
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(facility.status)}`}>
                      {facility.status}
                    </span>
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
                      {selectedFile ? (
                          <p className="text-sm font-medium text-blue-600 break-all">{selectedFile}</p>
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
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
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
      </Modal>
    </DashboardLayout>
  );
};