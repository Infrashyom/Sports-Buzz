import React, { useState, useRef, useEffect } from 'react';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { Mail, Award, Calendar, CheckCircle, Plus, Upload, AlertCircle, Edit2, Save, X, Star, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export const RefereeProfile = () => {
  const { user, updateProfile } = useAuth();
  const [availability, setAvailability] = useState<boolean>((user as any)?.availability ?? true);
  const [isEditingContact, setIsEditingContact] = useState(false);
  
  const handleAvailabilityToggle = async () => {
    const newStatus = !availability;
    setAvailability(newStatus);
    try {
       await updateProfile({ availability: newStatus });
       toast.success(`Availability updated to ${newStatus ? 'Accepting Matches' : 'Unavailable'}`);
    } catch {
       setAvailability(!newStatus);
       toast.error("Failed to update availability");
    }
  };

  const [contactForm, setContactForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: (user as any)?.mobile || '',
  });

  useEffect(() => {
    // Optionally fetch active matching data if needed elsewhere, 
    // removed matches array as match involvement box has been removed
  }, []);

  // State for Admin Request (Certifications only)
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certForm, setCertForm] = useState({ name: '', authority: '', validUntil: '' });
  const [isSubmittingCert, setIsSubmittingCert] = useState(false);
  
  // Upload handling
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const certifications = user?.certifications || [];

  const handleSaveContact = async () => {
    setIsEditingContact(false);
    try {
      const updates: any = {};
      if (contactForm.name !== user?.name) updates.name = contactForm.name;
      if (contactForm.mobile !== (user as any)?.mobile) updates.mobile = contactForm.mobile;
      
      if (Object.keys(updates).length > 0) {
          await updateProfile(updates);
      }
      toast.success("Profile details updated successfully.");
    } catch {
      toast.error("Failed to update profile details.");
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
          await updateProfile({ avatar: base64String });
          toast.success("Profile picture updated successfully.");
        } catch {
          toast.error("Failed to update profile picture.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitCertification = async () => {
    if (!certForm.name || !certForm.authority || !selectedFile) {
        toast.error("Please fill all required fields and upload a certificate.");
        return;
    }
    
    setIsSubmittingCert(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
            await api.post('/auth/certifications', {
                ...certForm,
                fileUrl: base64String
            });
            setIsCertModalOpen(false);
            setCertForm({ name: '', authority: '', validUntil: '' });
            setSelectedFile(null); // Reset file
            toast.success("Certification submitted! The school/admin will review it shortly.");
            // We can optionally refresh user here by calling an endpoint or it updates on next load
        } catch {
            toast.error("Failed to submit certification.");
        } finally {
            setIsSubmittingCert(false);
        }
    };
    reader.readAsDataURL(selectedFile);
  };

  return (<>
    
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500">Manage your personal details and credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Contact & Availability (Self-Serve) */}
        <div className="md:col-span-1 space-y-6">
            <Card className="text-center relative overflow-visible">
                {/* Edit Toggle */}
                {!isEditingContact ? (
                    <button 
                        onClick={() => setIsEditingContact(true)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                        title="Edit Details"
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                ) : (
                    <div className="absolute top-4 right-4 flex space-x-1">
                        <button onClick={() => setIsEditingContact(false)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"><X className="h-4 w-4" /></button>
                        <button onClick={handleSaveContact} className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-full"><Save className="h-4 w-4" /></button>
                    </div>
                )}

                <div className={`relative inline-block mb-4 group ${isEditingContact ? 'cursor-pointer' : ''}`} onClick={() => isEditingContact && avatarInputRef.current?.click()}>
                     <img 
                        src={user?.avatar || "https://ui-avatars.com/api/?name=" + (user?.name || 'User') + "&background=random"} 
                        alt="Profile" 
                        className="h-28 w-28 rounded-full object-cover border-4 border-slate-100 mx-auto" 
                    />
                    {isEditingContact && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload className="h-6 w-6 text-white" />
                        </div>
                    )}
                    <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    <div className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md z-10">
                         <div className={`h-4 w-4 rounded-full ${availability ? 'bg-green-500' : 'bg-red-500'} border-2 border-white`}></div>
                    </div>
                </div>

                {isEditingContact ? (
                    <div className="space-y-4 text-left px-2">
                        {/* Name (Editable) */}
                         <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Full Name</label>
                            <input 
                                type="text" 
                                value={contactForm.name}
                                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                                className="w-full p-2.5 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                         {/* Email (Read Only in Edit Mode) */}
                         <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Mobile Number</label>
                            <input 
                                type="tel" 
                                value={contactForm.mobile}
                                onChange={(e) => setContactForm({...contactForm, mobile: e.target.value})}
                                placeholder="+1 234 567 8900"
                                className="w-full p-2.5 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                         {/* Email (Read Only in Edit Mode) */}
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Email (Read-Only)</label>
                            <input 
                                type="email" 
                                value={contactForm.email}
                                disabled
                                className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
                            />
                        </div>

                         <Button size="sm" onClick={handleSaveContact} className="w-full mt-4">Save Changes</Button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                        <p className="text-sm text-slate-500 mb-4 capitalize">{user?.role?.toLowerCase()}</p>
                        
                        <div className="border-t border-slate-100 pt-4 text-left space-y-3">
                            <div className="flex items-center text-sm text-slate-600 break-all">
                                <Mail className="h-4 w-4 mr-3 text-slate-400 flex-shrink-0" />
                                {user?.email}
                            </div>
                            <div className="flex items-center text-sm text-slate-600">
                                <Phone className="h-4 w-4 mr-3 text-slate-400 flex-shrink-0" />
                                {(user as any)?.mobile || 'No mobile added'}
                            </div>
                            <div className="flex items-center text-sm text-slate-600">
                                <Star className="h-4 w-4 mr-3 text-yellow-500 flex-shrink-0" />
                                Rating: <span className="font-bold ml-1 text-slate-900 text-xs">{(user as any)?.rating ?? 'Not rated'}</span>
                            </div>
                        </div>
                    </>
                )}
            </Card>
            
            <Card title="Availability Status">
                <p className="text-xs text-slate-500 mb-4">
                    Instantly toggle if you are open for matches.
                </p>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className={`font-bold text-sm ${availability ? 'text-green-700' : 'text-slate-500'}`}>
                        {availability ? 'Accepting Matches' : 'Unavailable'}
                    </span>
                    <button 
                        onClick={handleAvailabilityToggle}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            availability ? 'bg-green-500' : 'bg-slate-300'
                        }`}
                    >
                         <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                            availability ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                    </button>
                </div>
            </Card>
        </div>

        {/* Right Column: Certifications (Requires Admin) */}
        <div className="md:col-span-2 space-y-6">
            <Card>
                <div className="flex flex-row items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Certifications</h3>
                        <p className="text-sm text-slate-500">Official badges verified by Admin.</p>
                    </div>
                    {/* Add Button */}
                    <button 
                        onClick={() => setIsCertModalOpen(true)}
                        className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg flex items-center transition-colors"
                    >
                        <Plus className="h-4 w-4 mr-1" /> Add New
                    </button>
                </div>

                <div className="space-y-4">
                    {certifications.length > 0 ? certifications.map((cert: any, i: number) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all bg-white">
                            <div className="flex items-start space-x-4">
                                <div className="mt-1 p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Award className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm md:text-base">{cert.name}</h4>
                                    <div className="flex items-center text-xs text-slate-500 mt-1">
                                        <Calendar className="h-3 w-3 mr-1" /> {cert.validUntil ? `Valid Until: ${new Date(cert.validUntil).toLocaleDateString()}` : 'Lifetime validity'}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 sm:mt-0 sm:ml-4 flex items-center">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                    cert.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {cert.status}
                                </span>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-6 text-sm text-slate-500">No certifications on file.</div>
                    )}
                </div>
            </Card>
            
            <Card title="Assigned School">
                <p className="text-sm text-slate-500 mb-4">
                    The school that has added you to their preferred referee list.
                </p>
                <div className="grid grid-cols-1 gap-4">
                    {(user as any)?.schoolId ? (
                     <div className="flex items-center space-x-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                         <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center border border-blue-200 font-bold text-blue-700 text-sm">
                            {((user as any)?.schoolId?.name || 'S').substring(0, 2).toUpperCase()}
                         </div>
                         <div>
                             <p className="font-bold text-sm text-slate-900">{(user as any)?.schoolId?.name || 'Unknown School'}</p>
                             <div className="flex items-center text-xs text-green-600 font-medium">
                                <CheckCircle className="h-3 w-3 mr-1" /> Verified Referee
                             </div>
                         </div>
                     </div>
                    ) : (
                     <div className="text-center py-6 text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
                        Independent Referee (Added by Admin).
                     </div>
                    )}
                </div>
            </Card>
        </div>
      </div>

      {/* Add Certification Modal */}
      <Modal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        title="Add New Certification"
      >
        <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3 text-sm text-blue-800 border border-blue-100">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p>New certifications must be verified by an Administrator before appearing on your public profile.</p>
            </div>

            <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Certification Name</label>
                    <input 
                        type="text" 
                        value={certForm.name}
                        onChange={(e) => setCertForm({...certForm, name: e.target.value})}
                        className="w-full p-2.5 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                        placeholder="e.g. BWF Level 1 Umpire" 
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Issuing Authority</label>
                        <input 
                            type="text" 
                            value={certForm.authority}
                            onChange={(e) => setCertForm({...certForm, authority: e.target.value})}
                            className="w-full p-2.5 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                            placeholder="e.g. State Board" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Valid Until</label>
                        <input 
                            type="date" 
                            value={certForm.validUntil}
                            onChange={(e) => setCertForm({...certForm, validUntil: e.target.value})}
                            className="w-full p-2.5 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Upload Certificate</label>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*,.pdf"
                    />
                    <div 
                        onClick={triggerFileUpload}
                        className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-slate-50 transition-all cursor-pointer bg-white"
                    >
                        <Upload className={`h-8 w-8 mx-auto mb-2 ${selectedFile ? 'text-blue-500' : 'text-slate-400'}`} />
                        {selectedFile ? (
                            <p className="text-sm font-medium text-blue-600 break-all">{selectedFile.name}</p>
                        ) : (
                             <>
                                <p className="text-sm font-medium text-slate-700">Click to upload or drag & drop</p>
                                <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 5MB</p>
                             </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 gap-3">
                <Button variant="outline" onClick={() => setIsCertModalOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmitCertification} disabled={isSubmittingCert}>
                    {isSubmittingCert ? 'Submitting...' : 'Submit for Verification'}
                </Button>
            </div>
        </div>
      </Modal></>
    
  );
};