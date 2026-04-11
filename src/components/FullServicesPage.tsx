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

interface FullServicesPageProps {
  onBack: () => void;
  onContact: (serviceName: string, packageName: string, price: number) => void;
  content: LandingContent;
}

export const FullServicesPage: React.FC<FullServicesPageProps> = ({ onBack, onContact, content }) => {
  const { services, settings } = content;
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={16} /> Back to Home
          </button>
          <div className="flex items-center gap-3">
            {settings.logo ? (
              <img src={settings.logo} alt={settings.agencyName} className="h-8 w-auto object-contain" />
            ) : (
              <span className="text-xl font-black tracking-tighter text-white">{settings.agencyName}</span>
            )}
          </div>
          <div className="w-24"></div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-16">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-white uppercase mb-6">
              Our <span className="text-emerald-500">Services</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl">
              Explore our full range of digital marketing and development solutions designed to scale your brand.
            </p>
          </header>

          {/* Search */}
          <div className="mb-12">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-5 py-4 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedService(service)}
                  className="group bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 rounded-[32px] hover:border-emerald-500/50 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    {getServiceIcon(service.icon)}
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3 tracking-tight uppercase">{service.name}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                    View Packages <ChevronRight size={14} />
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/90 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 sm:p-12">
                <div className="flex items-center justify-between mb-8 sm:mb-12">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-12 h-12 sm:w-16 h-16 bg-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                      {getServiceIcon(selectedService.icon)}
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tighter">{selectedService.name}</h3>
                      <p className="text-zinc-500 text-[10px] sm:text-sm font-medium">Specialized Packages</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedService(null)}
                    className="w-10 h-10 sm:w-12 h-12 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl sm:rounded-2xl flex items-center justify-center transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  {selectedService.packages.map((pkg) => (
                    <div key={pkg.id} className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl hover:border-emerald-500/50 transition-all flex flex-col">
                      <div className="mb-6">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2">{pkg.duration}</p>
                        <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1">{pkg.name}</h4>
                        <p className="text-2xl font-black text-emerald-500">₹{pkg.price.toLocaleString()}</p>
                      </div>
                      <ul className="space-y-3 mb-8 flex-grow">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                            <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button 
                        onClick={() => {
                          setSelectedService(null);
                          onContact(selectedService.name, pkg.name, pkg.price);
                        }}
                        className="w-full py-3 bg-zinc-800 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
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
    </div>
  );
};

function getServiceIcon(iconName: string) {
  switch (iconName) {
    case 'MessageSquare': return <MessageSquare size={28} />;
    case 'Globe': return <Globe size={28} />;
    case 'Layout': return <Layout size={28} />;
    case 'Zap': return <Zap size={28} />;
    case 'Shield': return <Shield size={28} />;
    default: return <BrainCircuit size={28} />;
  }
}
