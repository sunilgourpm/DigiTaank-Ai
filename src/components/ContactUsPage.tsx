import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { LandingContent } from '../types';
import { Footer } from './Footer';

interface ContactUsPageProps {
  onBack: () => void;
  onNavigate?: (page: 'refund' | 'terms' | 'contact' | 'portfolio' | 'services' | 'about' | 'home') => void;
  content: LandingContent;
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({ onBack, onNavigate, content }) => {
  const { settings, services } = content;
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for reaching out! We will get back to you shortly.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };
  
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
        <div className="max-w-7xl mx-auto">
          <header className="mb-16 text-center">
            <h1 className="text-3xl sm:text-6xl font-bold tracking-tight text-slate-900 uppercase mb-6">
              Get in <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">Touch</span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-lg max-w-2xl mx-auto">
              Have a question or a project in mind? We'd love to hear from you. 
              Our team usually responds within 24 hours.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <div className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                {[
                  { icon: Mail, label: 'Email Us', value: settings.contactEmail, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { icon: Phone, label: 'Call Us', value: settings.contactPhone, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { icon: MapPin, label: 'Visit Us', value: settings.location, color: 'text-rose-600', bg: 'bg-rose-50' }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group flex items-center gap-6 p-8 bg-white border border-slate-200 rounded-[32px] shadow-sm hover:shadow-xl hover:border-primary-500/30 transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50" />
                    
                    <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform duration-500 relative z-10 shrink-0`}>
                      <item.icon size={28} />
                    </div>
                    
                    <div className="relative z-10">
                      <h3 className="font-bold text-slate-900 uppercase tracking-tight mb-1 text-sm">{item.label}</h3>
                      <p className="text-slate-500 text-sm font-medium">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.a 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-6 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-[32px] font-bold uppercase tracking-[0.2em] transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 text-sm group"
              >
                <div className="bg-white/20 p-2 rounded-lg group-hover:rotate-12 transition-transform">
                  <MessageSquare size={20} />
                </div>
                <span>Chat on WhatsApp</span>
              </motion.a>
            </div>

            {/* Contact Form */}
            <div className="bg-white border border-slate-200 p-8 sm:p-12 rounded-[48px] shadow-xl relative overflow-hidden group">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-colors" />
              
              <div className="relative z-10">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 uppercase mb-8">Send us a <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">Message</span></h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-black text-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all shadow-sm"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-black text-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all shadow-sm"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Subject</label>
                    <input 
                      type="text" 
                      required
                      value={form.subject}
                      onChange={e => setForm({...form, subject: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-black text-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all shadow-sm"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Message</label>
                    <textarea 
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-black text-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all resize-none shadow-sm"
                      placeholder="Tell us everything..."
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-2xl font-bold uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary-500/25 flex items-center justify-center gap-3 group text-[11px]"
                  >
                    Send Inquiry <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>
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
