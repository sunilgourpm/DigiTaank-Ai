import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ExternalLink, 
  X, 
  BarChart3, 
  Search,
  Filter
} from 'lucide-react';
import { PortfolioProject, LandingContent } from '../types';
import { Footer } from './Footer';

interface FullPortfolioPageProps {
  onBack: () => void;
  onNavigate?: (page: 'refund' | 'terms' | 'contact' | 'portfolio' | 'services' | 'about' | 'home') => void;
  content: LandingContent;
}

export const FullPortfolioPage: React.FC<FullPortfolioPageProps> = ({ onBack, onNavigate, content }) => {
  const { portfolio, settings } = content;
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(portfolio.map(p => p.businessType)))];

  const filteredProjects = portfolio.filter(project => {
    const matchesSearch = project.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.businessType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || project.businessType === activeFilter;
    return matchesSearch && matchesFilter;
  });

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
              <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 tracking-tighter">{settings.agencyName}</span>
            )}
          </div>
          <div className="w-24"></div> {/* Spacer */}
        </div>
      </nav>

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 uppercase mb-4">
              Full <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">Portfolio</span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-base max-w-2xl">
              A comprehensive showcase of our digital excellence and client success stories.
            </p>
          </header>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-6 mb-10 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border ${
                    activeFilter === cat
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-primary-500/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={16} />
              <input 
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedProject(project)}
                  className="group relative aspect-[4/3] rounded-[40px] overflow-hidden cursor-pointer bg-slate-50 border border-slate-100 shadow-sm"
                >
                  <img 
                    src={project.thumbnail} 
                    alt={project.clientName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-8 flex flex-col justify-end">
                    <p className="text-[9px] font-bold text-accent-400 uppercase tracking-[0.3em] mb-1">{project.businessType}</p>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight group-hover:text-primary-400 transition-colors">{project.clientName}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProjects.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">No projects found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
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
              className="bg-white border border-slate-200 w-full max-w-5xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
            >
              <div className="md:w-1/2 relative bg-slate-50 aspect-video md:aspect-auto">
                <img 
                  src={selectedProject.thumbnail} 
                  alt={selectedProject.clientName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 left-6 w-10 h-10 bg-white/80 backdrop-blur-md text-slate-900 rounded-xl flex items-center justify-center md:hidden shadow-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="md:w-1/2 p-8 sm:p-12 relative">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-8 right-8 w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl hidden md:flex items-center justify-center transition-all border border-slate-200"
                >
                  <X size={20} />
                </button>
                
                <div className="mb-8">
                  <p className="text-[9px] font-bold text-primary-600 uppercase tracking-[0.3em] mb-2">{selectedProject.businessType}</p>
                  <h3 className="text-2xl font-bold text-slate-900 uppercase tracking-tight mb-4">{selectedProject.clientName}</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.servicesUsed.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 text-[9px] font-bold text-slate-500 rounded-lg uppercase tracking-widest">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 mb-10">
                  <div>
                    <h4 className="text-slate-900 font-bold uppercase tracking-tight mb-2 flex items-center gap-2 text-sm">
                      <BarChart3 size={16} className="text-primary-600" /> Results Achieved
                    </h4>
                    <p className="text-slate-500 text-sm leading-relaxed italic">
                      "{selectedProject.results}"
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {selectedProject.websiteUrl && (
                    <a 
                      href={selectedProject.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold uppercase tracking-widest text-[9px] flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20"
                    >
                      Visit Website <ExternalLink size={14} />
                    </a>
                  )}
                  {selectedProject.appUrl && (
                    <a 
                      href={selectedProject.appUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-[9px] flex items-center gap-2 hover:bg-slate-800 transition-all"
                    >
                      Open App <ExternalLink size={14} />
                    </a>
                  )}
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
