import React from 'react';
import { FileText } from 'lucide-react';
import { SITE_DETAILS } from '../constants';
import { PublicLayout } from '../components/layout/PublicLayout';

export const TermsOfService = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-slate-50 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-8 py-12 md:px-12 md:py-16">
              <div className="flex items-center justify-center mb-8">
                  <div className="bg-blue-50 p-5 rounded-2xl text-blue-600">
                      <FileText className="h-10 w-10" />
                  </div>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 text-center mb-6 tracking-tight">Terms of Service</h1>
              <p className="text-center text-slate-500 mb-12 font-medium">Last updated: {new Date().toLocaleDateString()}</p>
              
              <div className="space-y-10 text-slate-600 leading-relaxed max-w-3xl mx-auto format format-invert">
                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Agreement to Terms</h2>
                  <p>
                    By accessing or using {SITE_DETAILS.platformName}, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Use License</h2>
                  <p className="mb-4">
                    Permission is granted to temporarily download one copy of the materials (information or software) on {SITE_DETAILS.platformName}'s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 marker:text-blue-500">
                    <li>modify or copy the materials;</li>
                    <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                    <li>attempt to decompile or reverse engineer any software contained on the platform;</li>
                    <li>remove any copyright or other proprietary notations from the materials; or</li>
                    <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Accounts and Security</h2>
                  <p>
                    As a user (School, Referee, or Student), you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Limitations</h2>
                  <p>
                    In no event shall {SITE_DETAILS.platformName} or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the platform, even if {SITE_DETAILS.platformName} or an authorized representative has been notified orally or in writing of the possibility of such damage.
                  </p>
                </section>

                <section className="bg-slate-50 rounded-2xl p-8 border border-slate-200 mt-12">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Contact Us</h2>
                  <p className="mb-6">
                    If you have any questions about these Terms, please contact us:
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
