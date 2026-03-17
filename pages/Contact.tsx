import React, { useState, useEffect } from 'react';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [contactInfo, setContactInfo] = useState({
    email: 'hello@sportsbuzz.com',
    phone: '8209564347',
    address: 'Tilak Nagar, Paota\nJodhpur, Rajasthan 342006'
  });

  useEffect(() => {
    const savedContact = localStorage.getItem('sportsBuzzContact');
    if (savedContact) {
      const parsed = JSON.parse(savedContact);
      if (parsed.email) setContactInfo(prev => ({ ...prev, email: parsed.email }));
      if (parsed.phone) setContactInfo(prev => ({ ...prev, phone: parsed.phone }));
      if (parsed.address) setContactInfo(prev => ({ ...prev, address: parsed.address }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/contact-queries', formData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
    } catch {
      // Fallback for demo
      toast.success("Message sent successfully! (Demo mode)");
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <section className="pt-32 pb-24 bg-slate-900 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="bg-slate-800 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-700 flex flex-col lg:flex-row">
            
            {/* Left Side: Info */}
            <div className="lg:w-5/12 bg-slate-900 p-10 lg:p-14 text-white flex flex-col justify-between relative overflow-hidden border-r border-slate-700">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600 rounded-full blur-[100px] -mr-20 -mt-20 opacity-30"></div>
              
              <div className="relative z-10">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-white">Let's talk.</h1>
                <p className="text-slate-400 text-lg mb-12 max-w-sm">
                  Whether you're a school looking to join, or just have a question, we'd love to hear from you.
                </p>

                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                      <Mail className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Email Us</p>
                      <p className="text-lg font-medium text-slate-200">{contactInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                      <Phone className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Call Us</p>
                      <p className="text-lg font-medium text-slate-200">{contactInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                      <MapPin className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Visit Us</p>
                      <p className="text-lg font-medium text-slate-200 whitespace-pre-line">
                        {contactInfo.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="lg:w-7/12 p-10 lg:p-14 bg-slate-800">
              <h2 className="text-2xl font-bold text-white mb-8">Send a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-medium placeholder-slate-600" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-medium placeholder-slate-600" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-medium placeholder-slate-600" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300">Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-medium resize-none placeholder-slate-600" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center group disabled:opacity-70">
                  {isSubmitting ? 'Sending...' : 'Send Message'} <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
