import React from 'react';
import { LandingContent } from '../types';

interface FooterProps {
  content: LandingContent;
  onAdmin?: () => void;
  onNavigate?: (page: 'refund' | 'terms' | 'contact' | 'portfolio' | 'services' | 'about' | 'home') => void;
}

export const Footer: React.FC<FooterProps> = ({ content, onAdmin, onNavigate }) => {
  const { settings } = content;
  
  return (
    <footer className="py-16 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            {settings.logo ? (
              <img src={settings.logo} alt={settings.agencyName} className="h-6 w-auto object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary-600 rounded-lg rotate-12 flex items-center justify-center">
                  <span className="text-white font-bold text-[10px] -rotate-12">{settings.agencyName.charAt(0)}</span>
                </div>
                <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 underline decoration-primary-500/30 decoration-2 underline-offset-4">{settings.agencyName}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            <button onClick={() => onNavigate?.('home')} className="hover:text-primary-600 transition-colors">Home</button>
            <button onClick={() => onNavigate?.('services')} className="hover:text-primary-600 transition-colors">Services</button>
            <button onClick={() => onNavigate?.('portfolio')} className="hover:text-primary-600 transition-colors">Portfolio</button>
            <button onClick={() => onNavigate?.('about')} className="hover:text-primary-600 transition-colors">About</button>
            <button onClick={() => onNavigate?.('contact')} className="hover:text-primary-600 transition-colors text-primary-600">Contact Us</button>
            <button onClick={() => onNavigate?.('refund')} className="hover:text-primary-600 transition-colors">Refund Policy</button>
            <button onClick={() => onNavigate?.('terms')} className="hover:text-primary-600 transition-colors">Terms & Conditions</button>
            {onAdmin && (
              <button 
                onClick={onAdmin}
                className="hover:text-primary-600 transition-colors uppercase"
              >
                Admin
              </button>
            )}
          </div>

          <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest text-center md:text-right">
            © 2026 <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">{settings.agencyName}</span>. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
