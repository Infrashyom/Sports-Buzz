import React from 'react';
import { Shield } from 'lucide-react';
import { SITE_DETAILS } from '../constants';

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          <div className="px-8 py-12 md:px-12 md:py-16">
            <div className="flex items-center justify-center mb-8">
                <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                    <Shield className="h-10 w-10" />
                </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 text-center mb-4 tracking-tight">Privacy Policy</h1>
            <p className="text-center text-slate-500 mb-12">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="space-y-8 text-slate-600 leading-relaxed max-w-3xl mx-auto marker:text-blue-500">
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">1. Introduction</h2>
                <p>
                  At {SITE_DETAILS.platformName}, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our platform for school sports management and tournament tracking.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
                <p className="mb-3">We collect several different types of information for various purposes to provide and improve our service to you:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Personal Data:</strong> Name, email address, phone number, and school association.</li>
                  <li><strong>Usage Data:</strong> Information on how the service is accessed and used.</li>
                  <li><strong>Sports Data:</strong> Tournament results, match statistics, and referee reviews.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">3. Use of Data</h2>
                <p className="mb-3">{SITE_DETAILS.platformName} uses the collected data for various purposes:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>To provide and maintain our service</li>
                  <li>To notify you about changes to our service</li>
                  <li>To allow you to participate in interactive features of our service</li>
                  <li>To provide customer support</li>
                  <li>To gather analysis or valuable information so that we can improve our service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">4. Security of Data</h2>
                <p>
                  The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">5. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul className="list-none mt-2 space-y-1 font-medium">
                  <li>Email: <a href={`mailto:${SITE_DETAILS.contactEmail}`} className="text-blue-600 hover:underline">{SITE_DETAILS.contactEmail}</a></li>
                  <li>Phone: <a href={`tel:${SITE_DETAILS.contactPhone.replace(/[^0-9+]/g, '')}`} className="text-blue-600 hover:underline">{SITE_DETAILS.contactPhone}</a></li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
