import React from 'react';
import { Shield } from 'lucide-react';
import { SITE_DETAILS } from '../constants';
import { PublicLayout } from '../components/layout/PublicLayout';

export const PrivacyPolicy = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-slate-50 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-8 py-12 md:px-12 md:py-16">
              <div className="flex items-center justify-center mb-8">
                  <div className="bg-blue-50 p-5 rounded-2xl text-blue-600">
                      <Shield className="h-10 w-10" />
                  </div>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 text-center mb-6 tracking-tight">Privacy Policy</h1>
              <p className="text-center text-slate-500 mb-12 font-medium">Last updated: {new Date().toLocaleDateString()}</p>
              
              <div className="space-y-10 text-slate-600 leading-relaxed max-w-3xl mx-auto format format-invert">
                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
                  <p>
                    At {SITE_DETAILS.platformName}, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our platform for school sports management and tournament tracking.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
                  <p className="mb-4">We collect several different types of information for various purposes to provide and improve our service to you:</p>
                  <ul className="list-disc pl-6 space-y-3 marker:text-blue-500">
                    <li><strong className="text-slate-900">Personal Data:</strong> Name, email address, phone number, and school association.</li>
                    <li><strong className="text-slate-900">Usage Data:</strong> Information on how the service is accessed and used.</li>
                    <li><strong className="text-slate-900">Sports Data:</strong> Tournament results, match statistics, and referee reviews.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Use of Data</h2>
                  <p className="mb-4">{SITE_DETAILS.platformName} uses the collected data for various purposes:</p>
                  <ul className="list-disc pl-6 space-y-3 marker:text-blue-500">
                    <li>To provide and maintain our service</li>
                    <li>To notify you about changes to our service</li>
                    <li>To allow you to participate in interactive features of our service</li>
                    <li>To provide customer support</li>
                    <li>To gather analysis or valuable information so that we can improve our service</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Security of Data</h2>
                  <p>
                    The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                  </p>
                </section>

                <section className="bg-slate-50 rounded-2xl p-8 border border-slate-200 mt-12">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Contact Us</h2>
                  <p className="mb-6">
                    If you have any questions about this Privacy Policy, please contact us:
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center space-x-3">
                      <span className="text-slate-500 font-bold uppercase text-sm tracking-wider w-16">Email</span>
                      <a href={`mailto:${SITE_DETAILS.contactEmail}`} className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline">{SITE_DETAILS.contactEmail}</a>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="text-slate-500 font-bold uppercase text-sm tracking-wider w-16">Phone</span>
                      <a href={`tel:${SITE_DETAILS.contactPhone.replace(/[^0-9+]/g, '')}`} className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline">{SITE_DETAILS.contactPhone}</a>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};
