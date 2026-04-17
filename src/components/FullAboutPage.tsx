import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Rocket, 
  BrainCircuit, 
  Users, 
  Briefcase, 
  ExternalLink,
  Target,
  Eye,
  Award
} from 'lucide-react';
import { LandingContent } from '../types';
import { Footer } from './Footer';

interface FullAboutPageProps {
  onBack: () => void;
  onNavigate?: (page: 'refund' | 'terms' | 'contact' | 'portfolio' | 'services' | 'about' | 'home') => void;
  content: LandingContent;
}

export const FullAboutPage: React.FC<FullAboutPageProps> = ({ onBack, onNavigate, content }) => {
  const { team, partners, products, settings } = content;
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
          <div className="w-24"></div>
        </div>
      </nav>

      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="px-6 mb-24">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 uppercase leading-[0.9] mb-10">
                We Build <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">Digital Legacies.</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-2xl">
                {settings.agencyName} is more than just a marketing agency. We are a team of innovators, creators, and strategists dedicated to pushing the boundaries of what's possible in the digital space.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="px-6 mb-24 py-16 sm:py-20 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
              <div className="p-8 sm:p-10 bg-white border border-slate-200 rounded-[32px] space-y-6 shadow-sm">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
                  <Target size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Our Mission</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  To empower businesses with innovative digital tools and strategies that drive measurable impact and sustainable growth in an ever-evolving landscape.
                </p>
              </div>
              <div className="p-8 sm:p-10 bg-white border border-slate-200 rounded-[32px] space-y-6 shadow-sm">
                <div className="w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center text-accent-600">
                  <Eye size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Our Vision</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  To be the global benchmark for intelligence-driven digital marketing and agency operations, setting new standards for creativity and performance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="px-6 mb-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 uppercase mb-3">
                  The <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">Team</span>
                </h2>
                <p className="text-slate-500 text-sm sm:text-base">Meet the minds behind the magic. A diverse group of {team.length}+ experts.</p>
              </div>
              <div className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-primary-600 font-bold text-xl leading-none">{team.length}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Core Members</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="aspect-[4/5] rounded-[32px] overflow-hidden mb-5 relative bg-slate-100">
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60"></div>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight mb-1">{member.name}</h4>
                  <p className="text-primary-600 text-[9px] font-bold uppercase tracking-widest mb-2">{member.position}</p>
                  <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <Award size={10} /> {member.experience} Experience
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Side Scroll */}
        <section className="mb-24 py-16 border-y border-slate-100 overflow-hidden bg-slate-50/30">
          <div className="max-w-7xl mx-auto px-6 mb-10">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em] text-center">Our Trusted Partners</p>
          </div>
          <div className="flex gap-10 animate-scroll whitespace-nowrap">
            {[...partners, ...partners].map((logo, i) => (
              <div key={i} className="w-40 h-16 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-5 grayscale hover:grayscale-0 transition-all shrink-0 shadow-sm">
                <img src={logo} alt="Partner" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </section>

        {/* Products Section */}
        <section className="px-6 mb-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 uppercase mb-3">
                Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">Products</span>
              </h2>
              <p className="text-slate-500 text-sm sm:text-base">Innovative solutions built in-house to solve real-world problems.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <motion.a
                  key={product.name}
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-8 bg-slate-50 border border-slate-100 rounded-[32px] hover:border-primary-500/30 transition-all shadow-sm"
                >
                  <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-6 overflow-hidden group-hover:border-primary-500/30 transition-all shadow-sm">
                    <img src={product.logo} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-2 flex items-center justify-between">
                    {product.name}
                    <ExternalLink size={18} className="text-slate-300 group-hover:text-primary-600 transition-colors" />
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-6">
                    {product.description}
                  </p>
                  <div className="text-[9px] font-bold text-primary-600 uppercase tracking-widest">
                    Visit {product.name}
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer 
        content={content} 
        onNavigate={onNavigate} 
      />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}} />
    </div>
  );
};
