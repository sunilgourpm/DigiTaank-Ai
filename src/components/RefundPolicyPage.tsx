import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { LandingContent } from '../types';
import { Footer } from './Footer';

interface RefundPolicyPageProps {
  onBack: () => void;
  onNavigate?: (page: 'refund' | 'terms' | 'contact' | 'portfolio' | 'services' | 'about' | 'home') => void;
  content: LandingContent;
}

export const RefundPolicyPage: React.FC<RefundPolicyPageProps> = ({ onBack, onNavigate, content }) => {
  const { settings } = content;
  
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-primary-500/30 selection:text-primary-900">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[9px] font-bold text-slate-400 hover:text-primary-600 transition-colors uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={14} /> Back to Home
          </button>
          <div className="flex items-center gap-3">
            {settings.logo ? (
              <img src={settings.logo} alt={settings.agencyName} className="h-6 w-auto object-contain" />
            ) : (
              <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 tracking-tighter">{settings.agencyName}</span>
            )}
          </div>
          <div className="w-24"></div>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 uppercase mb-4">
              Refund <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">Policy</span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-base">
              Last Updated: April 16, 2026
            </p>
          </header>

          <div className="prose prose-slate max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                  <ShieldCheck size={18} />
                </div>
                General Overview
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                At {settings.agencyName}, we strive to provide high-quality digital services. Due to the nature of digital products and services (including but not limited to web development, digital marketing, and AI solutions), our refund policy is designed to be fair to both our clients and our creative team.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Service Cancellation</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Clients may cancel their service subscription or project at any time. However, payments already made for services initiated or delivered are non-refundable. For milestone-based projects, refunds are only applicable to milestones that have not yet been started.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Non-Refundable Items</h3>
              <ul className="list-disc list-inside text-slate-600 text-sm space-y-2 ml-4">
                <li>Domain registration and hosting fees</li>
                <li>Third-party software or API integration costs</li>
                <li>Ad spend on platforms like Google, Meta, or LinkedIn</li>
                <li>Completed design or development work</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Contact Us for Refund Requests</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                If you have any questions about our Refund Policy, please contact us at:
              </p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                  <Mail size={16} className="text-primary-600" />
                  <span>{settings.contactEmail}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                  <Phone size={16} className="text-primary-600" />
                  <span>{settings.contactPhone}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                  <MapPin size={16} className="text-primary-600" />
                  <span>{settings.location}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer 
        content={content} 
        onNavigate={onNavigate} 
      />
    </div>
  );
};
