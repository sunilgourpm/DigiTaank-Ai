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

interface FullPortfolioPageProps {
  onBack: () => void;
  content: LandingContent;
}

export const FullPortfolioPage: React.FC<FullPortfolioPageProps> = ({ onBack, content }) => {
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
          <div className="w-24"></div> {/* Spacer */}
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-16">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-white uppercase mb-6">
              Full <span className="text-emerald-500">Portfolio</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl">
              A comprehensive showcase of our digital excellence and client success stories.
            </p>
          </header>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    activeFilter === cat
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-5 py-4 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedProject(project)}
                  className="group relative aspect-[4/3] rounded-[40px] overflow-hidden cursor-pointer bg-zinc-900 border border-zinc-800"
                >
                  <img 
                    src={project.thumbnail} 
                    alt={project.clientName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent p-8 flex flex-col justify-end">
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em] mb-2">{project.businessType}</p>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{project.clientName}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProjects.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-zinc-500 font-bold uppercase tracking-widest">No projects found matching your criteria.</p>
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/90 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-5xl rounded-[32px] sm:rounded-[60px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
            >
              <div className="md:w-1/2 relative bg-zinc-950 aspect-video md:aspect-auto">
                <img 
                  src={selectedProject.thumbnail} 
                  alt={selectedProject.clientName}
                  className="w-full h-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 left-6 w-10 h-10 bg-zinc-950/50 backdrop-blur-md text-white rounded-xl flex items-center justify-center md:hidden"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="md:w-1/2 p-8 sm:p-16 relative">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-12 right-12 w-12 h-12 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl hidden md:flex items-center justify-center transition-all"
                >
                  <X size={24} />
                </button>
                
                <div className="mb-8 sm:mb-10">
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em] mb-2 sm:mb-3">{selectedProject.businessType}</p>
                  <h3 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter mb-4 sm:mb-6">{selectedProject.clientName}</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.servicesUsed.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-zinc-800 text-[10px] font-bold text-zinc-400 rounded-lg uppercase tracking-widest">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 sm:space-y-8 mb-10 sm:mb-12">
                  <div>
                    <h4 className="text-white font-black uppercase tracking-tight mb-2 sm:mb-3 flex items-center gap-2">
                      <BarChart3 size={18} className="text-emerald-500" /> Results Achieved
                    </h4>
                    <p className="text-zinc-400 text-base sm:text-lg leading-relaxed italic">
                      "{selectedProject.results}"
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {selectedProject.websiteUrl && (
                    <a 
                      href={selectedProject.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 sm:px-8 py-3 sm:py-4 bg-emerald-500 text-white rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2 hover:bg-emerald-400 transition-all"
                    >
                      Visit Website <ExternalLink size={16} />
                    </a>
                  )}
                  {selectedProject.appUrl && (
                    <a 
                      href={selectedProject.appUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 sm:px-8 py-3 sm:py-4 bg-zinc-800 text-white rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2 hover:bg-zinc-700 transition-all"
                    >
                      Open App <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
