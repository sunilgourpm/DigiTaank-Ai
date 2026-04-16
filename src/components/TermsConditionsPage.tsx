import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Scale, Mail, Phone, MapPin } from 'lucide-react';
import { LandingContent } from '../types';
import { Footer } from './Footer';

interface TermsConditionsPageProps {
  onBack: () => void;
  onNavigate?: (page: 'refund' | 'terms' | 'contact' | 'portfolio' | 'services' | 'about' | 'home') => void;
  content: LandingContent;
}

export const TermsConditionsPage: React.FC<TermsConditionsPageProps> = ({ onBack, onNavigate, content }) => {
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
              <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 underline decoration-primary-500/30 decoration-2 underline-offset-4 tracking-tighter">{settings.agencyName}</span>
            )}
          </div>
          <div className="w-24"></div>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 uppercase mb-4">
              Terms & <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">Conditions</span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-base">
              Last Updated: April 16, 2026
            </p>
          </header>

          <div className="prose prose-slate max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                  <Scale size={18} />
                </div>
                Agreement to Terms
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                By accessing our website and using our services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Services Provided</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {settings.agencyName} provides digital marketing, web development, AI integration, and consulting services. The specific scope of work for each client is detailed in individual project proposals or quotations.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Intellectual Property</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                All original content, designs, and code created by {settings.agencyName} during the course of a project remain our intellectual property until full payment is received, at which point ownership of the specific final deliverables is transferred to the client.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Liability</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                In no event shall {settings.agencyName} be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or other intangible losses, resulting from your access to or use of the services.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Contact Information</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                If you have any questions about these Terms, please contact us:
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
