import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Save, Phone, Mail, MapPin, Edit2, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  const [platformName, setPlatformName] = useState('Sports Buzz');
  const [timezone] = useState('IST (Indian Standard Time)');
  const [logoUrl, setLogoUrl] = useState('https://ui-avatars.com/api/?name=Sports+Buzz&background=2563eb&color=fff');
  
  // Contact Info State
  const [contactEmail, setContactEmail] = useState('support@sportsbuzz.com');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [contactAddress, setContactAddress] = useState('Tilak nagar Paota jodhpur 342006');

  useEffect(() => {
    // Load from local storage if available
    const savedContact = localStorage.getItem('sportsBuzzContact');
    if (savedContact) {
      const parsed = JSON.parse(savedContact);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (parsed.email) setContactEmail(parsed.email);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (parsed.phone) setContactPhone(parsed.phone);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (parsed.address) setContactAddress(parsed.address);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (parsed.logoUrl) setLogoUrl(parsed.logoUrl);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (parsed.platformName) setPlatformName(parsed.platformName);
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
      const contactData = {
          email: contactEmail,
          phone: contactPhone,
          address: contactAddress,
          logoUrl: logoUrl,
          platformName: platformName
      };
      localStorage.setItem('sportsBuzzContact', JSON.stringify(contactData));
      toast.success("Settings saved successfully.");
      setIsEditing(false);
  };

  const handleCancel = () => {
    // Revert changes by reloading from local storage
    const savedContact = localStorage.getItem('sportsBuzzContact');
    if (savedContact) {
      const parsed = JSON.parse(savedContact);
      if (parsed.email) setContactEmail(parsed.email);
      if (parsed.phone) setContactPhone(parsed.phone);
      if (parsed.address) setContactAddress(parsed.address);
      if (parsed.logoUrl) setLogoUrl(parsed.logoUrl);
      if (parsed.platformName) setPlatformName(parsed.platformName);
    }
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>
          <p className="text-slate-500">Global configurations for the Sports Buzz instance.</p>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="flex items-center">
              <Edit2 className="h-4 w-4 mr-2" /> Edit Settings
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel} className="flex items-center">
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
              <Button onClick={handleSave} className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white">
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-6 max-w-4xl">
        <Card title="General Configuration">
            <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-xl border-2 border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Platform Logo" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-slate-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Platform Logo</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleLogoUpload}
                          disabled={!isEditing} 
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                        />
                        <p className="text-xs text-slate-500 mt-1">Upload an image for the platform logo (recommended size: 256x256px).</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Platform Name</label>
                        <input 
                          type="text" 
                          value={platformName} 
                          disabled={true} 
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none disabled:text-slate-500 disabled:cursor-not-allowed transition-colors" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Timezone</label>
                        <input 
                          type="text" 
                          value={timezone} 
                          disabled={true} 
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none disabled:text-slate-500 disabled:cursor-not-allowed transition-colors" 
                        />
                    </div>
                </div>
            </div>
        </Card>

        <Card title="Contact Information (Public)">
            <p className="text-sm text-slate-500 mb-6">This information will be displayed on the public Contact page.</p>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center"><Mail className="h-4 w-4 mr-1 text-slate-400"/> Email Address</label>
                      <input 
                        type="email" 
                        value={contactEmail} 
                        onChange={(e) => setContactEmail(e.target.value)} 
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors" 
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center"><Phone className="h-4 w-4 mr-1 text-slate-400"/> Phone Number</label>
                      <input 
                        type="text" 
                        value={contactPhone} 
                        onChange={(e) => setContactPhone(e.target.value)} 
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors" 
                      />
                  </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center"><MapPin className="h-4 w-4 mr-1 text-slate-400"/> Physical Address</label>
                    <textarea 
                      value={contactAddress} 
                      onChange={(e) => setContactAddress(e.target.value)} 
                      rows={3} 
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
                    ></textarea>
                </div>
            </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};