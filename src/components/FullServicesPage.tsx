import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  X, 
  CheckCircle2, 
  MessageSquare, 
  Globe, 
  Layout, 
  Zap, 
  Shield, 
  BrainCircuit,
  ChevronRight,
  Search
} from 'lucide-react';
import { ServiceCategory, LandingContent } from '../types';
import { Footer } from './Footer';

interface FullServicesPageProps {
  onBack: () => void;
  onContact: (serviceName: string, packageName: string, price: number) => void;
  onNavigate?: (page: 'refund' | 'terms' | 'contact' | 'portfolio' | 'services' | 'about' | 'home') => void;
  content: LandingContent;
}

export const FullServicesPage: React.FC<FullServicesPageProps> = ({ onBack, onContact, onNavigate, content }) => {
  const { services, settings } = content;
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-primary-500/30 selection:text-primary-900">
      {/* Navigation */}
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
          <header className="mb-12">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 uppercase mb-4">
              Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">Services</span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-base max-w-2xl">
              Explore our full range of digital marketing and development solutions designed to scale your brand.
            </p>
          </header>

          {/* Search */}
          <div className="mb-10">
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={16} />
              <input 
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedService(service)}
                  className="group bg-slate-50 border border-slate-100 p-8 rounded-[32px] hover:border-primary-500/30 transition-all cursor-pointer relative overflow-hidden shadow-sm"
                >
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-primary-600 group-hover:to-accent-600 group-hover:text-white group-hover:border-primary-600 transition-all shadow-sm">
                    {getServiceIcon(service.icon, index)}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight uppercase group-hover:text-primary-600 transition-colors">{service.name}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-2 text-primary-600 group-hover:text-accent-600 text-[9px] font-bold uppercase tracking-widest transition-colors">
                    View Packages <ChevronRight size={12} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 w-full max-w-4xl rounded-[32px] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                      {getServiceIcon(selectedService.icon)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{selectedService.name}</h3>
                      <p className="text-slate-500 text-[10px] font-medium uppercase tracking-widest">Specialized Packages</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedService(null)}
                    className="w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center transition-all border border-slate-200"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedService.packages.map((pkg) => (
                    <div key={pkg.id} className="bg-slate-50 border border-slate-100 p-6 rounded-2xl hover:border-primary-500/30 transition-all flex flex-col shadow-sm">
                      <div className="mb-4">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{pkg.duration}</p>
                        <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight mb-1">{pkg.name}</h4>
                        <p className="text-xl font-bold text-primary-600">₹{pkg.price.toLocaleString()}</p>
                      </div>
                      <ul className="space-y-2 mb-6 flex-grow">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-[10px] text-slate-500">
                            <CheckCircle2 size={12} className="text-primary-600 mt-0.5 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button 
                        onClick={() => {
                          setSelectedService(null);
                          onContact(selectedService.name, pkg.name, pkg.price);
                        }}
                        className="w-full py-2.5 bg-white hover:bg-primary-600 hover:text-white text-primary-600 border border-primary-600/20 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all"
                      >
                        Select Package
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Footer */}
      <Footer 
        content={content} 
        onNavigate={onNavigate} 
      />
    </div>
  );
};

function getServiceIcon(iconName: string, index: number = 0) {
  const colors = ['text-primary-600', 'text-accent-500', 'text-indigo-600', 'text-blue-600', 'text-red-500'];
  const colorClass = colors[index % colors.length];

  switch (iconName) {
    case 'MessageSquare': return <MessageSquare size={24} className={colorClass} />;
    case 'Globe': return <Globe size={24} className={colorClass} />;
    case 'Layout': return <Layout size={24} className={colorClass} />;
    case 'Zap': return <Zap size={24} className={colorClass} />;
    case 'Shield': return <Shield size={24} className={colorClass} />;
    default: return <BrainCircuit size={24} className={colorClass} />;
  }
}
