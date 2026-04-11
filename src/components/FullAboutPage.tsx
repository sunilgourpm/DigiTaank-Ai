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

interface FullAboutPageProps {
  onBack: () => void;
  content: LandingContent;
}

export const FullAboutPage: React.FC<FullAboutPageProps> = ({ onBack, content }) => {
  const { team, partners, products, settings } = content;
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
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg rotate-12 flex items-center justify-center">
                  <span className="text-white font-black text-sm -rotate-12">{settings.agencyName.charAt(0)}</span>
                </div>
                <span className="text-xl font-black tracking-tighter text-white">{settings.agencyName}</span>
              </div>
            )}
          </div>
          <div className="w-24"></div>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="px-6 mb-32">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-9xl font-black tracking-tighter text-white uppercase leading-[0.85] mb-12">
                We Build <br />
                <span className="text-emerald-500">Digital Legacies.</span>
              </h1>
              <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-2xl">
                {settings.agencyName} is more than just a marketing agency. We are a team of innovators, creators, and strategists dedicated to pushing the boundaries of what's possible in the digital space.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="px-6 mb-32 py-16 sm:py-24 bg-zinc-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              <div className="p-8 sm:p-12 bg-zinc-900/50 border border-zinc-800 rounded-[32px] sm:rounded-[40px] space-y-6">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                  <Target size={32} />
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Our Mission</h3>
                <p className="text-zinc-400 leading-relaxed">
                  To empower businesses with innovative digital tools and strategies that drive measurable impact and sustainable growth in an ever-evolving landscape.
                </p>
              </div>
              <div className="p-12 bg-zinc-900/50 border border-zinc-800 rounded-[40px] space-y-6">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                  <Eye size={32} />
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Our Vision</h3>
                <p className="text-zinc-400 leading-relaxed">
                  To be the global benchmark for intelligence-driven digital marketing and agency operations, setting new standards for creativity and performance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="px-6 mb-32">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div>
                <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white uppercase mb-4">
                  The <span className="text-emerald-500">Team</span>
                </h2>
                <p className="text-zinc-400 text-lg">Meet the minds behind the magic. A diverse group of {team.length}+ experts.</p>
              </div>
              <div className="px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                <p className="text-emerald-500 font-black text-2xl leading-none">{team.length}</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Core Members</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="aspect-[4/5] rounded-[32px] overflow-hidden mb-6 relative">
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60"></div>
                  </div>
                  <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1">{member.name}</h4>
                  <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-2">{member.position}</p>
                  <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest flex items-center gap-2">
                    <Award size={12} /> {member.experience} Experience
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Side Scroll */}
        <section className="mb-32 py-20 border-y border-zinc-900 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-12">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] text-center">Our Trusted Partners</p>
          </div>
          <div className="flex gap-12 animate-scroll whitespace-nowrap">
            {[...partners, ...partners].map((logo, i) => (
              <div key={i} className="w-48 h-20 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all shrink-0">
                <img src={logo} alt="Partner" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </section>

        {/* Products Section */}
        <section className="px-6 mb-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white uppercase mb-4">
                Our <span className="text-emerald-500">Products</span>
              </h2>
              <p className="text-zinc-400 text-lg">Innovative solutions built in-house to solve real-world problems.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  className="group p-8 bg-zinc-900/50 border border-zinc-800 rounded-[40px] hover:border-emerald-500/50 transition-all"
                >
                  <div className="w-20 h-20 bg-zinc-950 rounded-3xl flex items-center justify-center mb-8 overflow-hidden border border-zinc-800 group-hover:border-emerald-500/30 transition-all">
                    <img src={product.logo} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3 flex items-center justify-between">
                    {product.name}
                    <ExternalLink size={20} className="text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                    {product.description}
                  </p>
                  <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                    Visit {product.name}
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            © 2026 {settings.agencyName}. All Rights Reserved.
          </p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}} />
    </div>
  );
};
