import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Shield, 
  BarChart3, 
  Globe, 
  MessageSquare, 
  Layout, 
  Rocket,
  Users,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  X,
  ChevronRight,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Maximize2,
  Send,
  Menu,
  Quote,
  ChevronLeft
} from 'lucide-react';
import { ServiceCategory, PortfolioProject, LandingContent } from '../types';

interface LandingPageProps {
  onGetStarted: () => void;
  onViewAllPortfolio: () => void;
  onViewAllServices: () => void;
  onViewAllAbout: () => void;
  initialSelectedPlan?: string;
  onClearInitialPlan?: () => void;
  content: LandingContent;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onGetStarted, 
  onViewAllPortfolio, 
  onViewAllServices,
  onViewAllAbout,
  initialSelectedPlan,
  onClearInitialPlan,
  content
}) => {
  const { services, portfolio, testimonials, settings } = content;
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: '',
    businessName: '',
    whatsapp: '',
    services: [] as string[],
    selectedPlan: '',
    budget: '',
    message: ''
  });

  React.useEffect(() => {
    if (initialSelectedPlan) {
      const serviceName = initialSelectedPlan.split(' - ')[0];
      setContactForm(prev => ({
        ...prev,
        selectedPlan: initialSelectedPlan,
        services: prev.services.includes(serviceName) ? prev.services : [...prev.services, serviceName]
      }));
      
      // Scroll to contact section after a short delay to ensure component is rendered
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
        if (onClearInitialPlan) onClearInitialPlan();
      }, 100);
    }
  }, [initialSelectedPlan, onClearInitialPlan]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setContactForm({ name: '', businessName: '', whatsapp: '', services: [], selectedPlan: '', budget: '', message: '' });
  };

  const nextTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const toggleServiceSelection = (serviceName: string) => {
    setContactForm(prev => ({
      ...prev,
      services: prev.services.includes(serviceName)
        ? prev.services.filter(s => s !== serviceName)
        : [...prev.services, serviceName]
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-200 scroll-smooth">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.logo ? (
              <img src={settings.logo} alt={settings.agencyName} className="h-8 w-[100px] object-contain" />
            ) : (
              <span className="text-xl font-bold tracking-tight text-white">{settings.agencyName}</span>
            )}
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            {['Home', 'Services', 'Portfolio', 'About'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className="text-[10px] font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-[0.2em]"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="#contact"
              className="hidden sm:flex px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
            >
              Contact Us
            </a>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-zinc-900 border-b border-zinc-800 overflow-hidden"
            >
              <div className="px-6 py-8 flex flex-col gap-6">
                {['Home', 'Services', 'Portfolio', 'About', 'Contact'].map((item) => (
                  <a 
                    key={item}
                    href={`#${item.toLowerCase()}`} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-[0.2em]"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <header id="home" className="relative pt-40 pb-32 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #27272a 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/20 blur-[140px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/20 blur-[140px] rounded-full animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-10">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {settings.agencyName} Agency
                </div>
                <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tight text-white leading-[0.85] mb-10 uppercase italic">
                  Let's make <br />
                  your Brand <br />
                  <span className="text-emerald-500 not-italic relative">
                    famous.
                    <span className="absolute -inset-2 bg-emerald-500/20 blur-2xl -z-10 rounded-full animate-pulse"></span>
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-zinc-400 font-medium leading-relaxed mb-12 max-w-2xl">
                  We don't just manage accounts; we build legacies. Experience the fusion of AI-driven precision and creative brilliance.
                </p>
                <div className="flex flex-wrap gap-6 items-center">
                  <a 
                    href="#contact"
                    className="px-12 py-6 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-bold uppercase tracking-widest transition-all shadow-2xl shadow-emerald-500/40 flex items-center gap-4 group text-lg"
                  >
                    Get Started <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                  </a>
                  <div className="flex -space-x-4 items-center">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-zinc-950 bg-zinc-800 flex items-center justify-center overflow-hidden">
                        <img src={`https://picsum.photos/seed/agency${i}/100/100`} alt="Client" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                    <div className="ml-8">
                      <p className="text-white font-bold text-lg leading-none">500+</p>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Global Clients</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Floating Elements Column */}
            <div className="hidden lg:block lg:col-span-4 relative h-[500px]">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute top-0 right-0 w-full h-full"
              >
                <div className="absolute top-10 right-0 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 rounded-3xl shadow-2xl rotate-6 hover:rotate-0 transition-all duration-500 group cursor-default">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                      <Zap size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Growth Rate</p>
                      <p className="text-xl font-bold text-white">+142%</p>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[85%] animate-pulse"></div>
                  </div>
                </div>

                <div className="absolute bottom-20 left-0 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 rounded-3xl shadow-2xl -rotate-12 hover:rotate-0 transition-all duration-500 group cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Leads</p>
                      <p className="text-xl font-bold text-white">1,284</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <BrainCircuit size={120} className="text-zinc-800 animate-spin-slow opacity-50" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-emerald-500 to-transparent"></div>
        </motion.div>
      </header>

      {/* Services Section */}
      <section id="services" className="py-32 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase mb-6">
                Our <span className="text-emerald-500">Expertise</span>
              </h2>
              <p className="text-zinc-400 font-medium text-base sm:text-lg leading-relaxed">
                Comprehensive digital solutions tailored to your business goals. Click on a service to view our specialized packages.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedService(service)}
                className="group bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 rounded-[32px] hover:border-emerald-500/50 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={20} className="text-emerald-500" />
                </div>
                <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  {getServiceIcon(service.icon)}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight uppercase">{service.name}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                  {service.description}
                </p>
                <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                  View Packages <ChevronRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button 
              onClick={onViewAllServices}
              className="px-12 py-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold uppercase tracking-widest transition-all border border-zinc-800 flex items-center gap-3 mx-auto group"
            >
              View All Services <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase mb-6">
              Client <span className="text-emerald-500">Success</span>
            </h2>
            <p className="text-zinc-400 font-medium max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Explore how we've helped businesses across different industries achieve their digital potential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolio.slice(0, 6).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedProject(project)}
                className="group relative aspect-[4/3] rounded-[40px] overflow-hidden cursor-pointer bg-zinc-900"
              >
                <img 
                  src={project.thumbnail} 
                  alt={project.clientName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent p-8 flex flex-col justify-end">
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em] mb-2">{project.businessType}</p>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{project.clientName}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button 
              onClick={onViewAllPortfolio}
              className="px-12 py-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold uppercase tracking-widest transition-all border border-zinc-800 flex items-center gap-3 mx-auto group"
            >
              View All Projects <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-zinc-950 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase mb-6">
              Client <span className="text-emerald-500">Voices</span>
            </h2>
            <p className="text-zinc-500 font-medium max-w-2xl mx-auto text-base sm:text-lg">
              Don't just take our word for it. Here's what our partners have to say about working with DigiTaank.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {testimonials.length > 0 ? (
              <>
                <div className="absolute -top-12 -left-12 text-emerald-500/20">
                  <Quote size={120} />
                </div>

                <div className="relative z-10 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTestimonial}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                      className="bg-zinc-900/50 border border-zinc-800 p-10 sm:p-16 rounded-[40px] sm:rounded-[60px] backdrop-blur-xl"
                    >
                      <p className="text-xl sm:text-3xl font-medium text-white leading-relaxed mb-12 italic">
                        "{testimonials[currentTestimonial].content}"
                      </p>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500/20">
                            <img 
                              src={testimonials[currentTestimonial].avatar} 
                              alt={testimonials[currentTestimonial].name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-white uppercase tracking-tight">
                              {testimonials[currentTestimonial].name}
                            </h4>
                            <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest">
                              {testimonials[currentTestimonial].role}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <button 
                            onClick={prevTestimonial}
                            className="w-14 h-14 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl flex items-center justify-center transition-all border border-zinc-700/50"
                          >
                            <ChevronLeft size={24} />
                          </button>
                          <button 
                            onClick={nextTestimonial}
                            className="w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-emerald-500/20"
                          >
                            <ChevronRight size={24} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex justify-center gap-2 mt-12">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentTestimonial(i)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i === currentTestimonial ? 'w-12 bg-emerald-500' : 'w-3 bg-zinc-800 hover:bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-zinc-900/30 rounded-[40px] border border-zinc-800">
                <p className="text-zinc-500 font-bold uppercase tracking-widest">No testimonials yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-square rounded-[60px] overflow-hidden border border-zinc-800">
                <img 
                  src="https://picsum.photos/seed/founder/800/800" 
                  alt="Sunil Gour" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-emerald-500 p-10 rounded-[40px] shadow-2xl hidden sm:block">
                <p className="text-white font-bold text-3xl leading-none mb-2">10+</p>
                <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest">Years Experience</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase mb-6">
                  Behind <br />
                  <span className="text-emerald-500">DigiTaank</span>
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  Founded by Sunil Gour, DigiTaank is a creative-led digital agency that believes in the power of smart marketing. We don't just run ads; we build ecosystems for growth.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-white font-bold uppercase tracking-tight mb-3 flex items-center gap-2">
                    <Rocket size={18} className="text-emerald-500" /> Our Mission
                  </h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    To empower businesses with innovative digital tools and strategies that drive measurable impact.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-tight mb-3 flex items-center gap-2">
                    <BrainCircuit size={18} className="text-emerald-500" /> Our Vision
                  </h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    To be the global benchmark for intelligence-driven digital marketing and agency operations.
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-zinc-800">
                <p className="text-zinc-300 font-bold mb-6 italic">"Innovation is not just about technology, it's about how we solve human problems with it."</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden">
                      <img src="https://picsum.photos/seed/sunil/100/100" alt="Sunil Gour" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <p className="text-white font-bold uppercase tracking-widest text-xs">Sunil Gour</p>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Founder & CEO</p>
                    </div>
                  </div>
                  <button 
                    onClick={onViewAllAbout}
                    className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all border border-zinc-800 flex items-center gap-2 group"
                  >
                    Know More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-10 sm:p-16 rounded-[60px]">
              <h2 className="text-3xl font-bold tracking-tight text-white uppercase mb-8">
                Let's <span className="text-emerald-500">Connect</span>
              </h2>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={contactForm.name}
                      onChange={e => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Business Name</label>
                    <input 
                      type="text" 
                      required
                      value={contactForm.businessName}
                      onChange={e => setContactForm({...contactForm, businessName: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all"
                      placeholder="Acme Corp"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">WhatsApp Number</label>
                    <input 
                      type="tel" 
                      required
                      value={contactForm.whatsapp}
                      onChange={e => setContactForm({...contactForm, whatsapp: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Selected Plan</label>
                    <input 
                      type="text" 
                      readOnly
                      value={contactForm.selectedPlan}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 text-emerald-500 font-bold text-sm outline-none cursor-default"
                      placeholder="Select a package above"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Your Budget</label>
                    <select 
                      value={contactForm.budget}
                      onChange={e => setContactForm({...contactForm, budget: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all appearance-none"
                    >
                      <option value="">Select Budget Range</option>
                      <option value="10k-50k">₹10,000 - ₹50,000</option>
                      <option value="50k-1L">₹50,000 - ₹1,00,000</option>
                      <option value="1L+">₹1,00,000+</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Services Required</label>
                  <div className="flex flex-wrap gap-3">
                    {services.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleServiceSelection(s.name)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                          contactForm.services.includes(s.name)
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    rows={4}
                    value={contactForm.message}
                    onChange={e => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-bold uppercase tracking-widest transition-all shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-3 group"
                >
                  Send Message <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col justify-center space-y-12">
              <div>
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-6">Contact <span className="text-emerald-500">Details</span></h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Call Us</p>
                      <p className="text-lg font-bold text-white">{settings.contactPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
                      <Mail size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Email Us</p>
                      <p className="text-lg font-bold text-white">{settings.contactEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Our Location</p>
                      <p className="text-lg font-bold text-white">{settings.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-12 border-t border-zinc-900">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">Follow Our Journey</p>
                <div className="flex gap-4">
                  {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
                    <a key={i} href="#" className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-emerald-500 hover:border-emerald-500/50 transition-all">
                      <Icon size={20} />
                    </a>
                  ))}
                </div>
              </div>

              <a 
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 px-8 py-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-3xl font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all w-fit"
              >
                <MessageSquare size={24} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-3">
              {settings.logo ? (
                <img src={settings.logo} alt={settings.agencyName} className="h-8 w-auto object-contain" />
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg rotate-12 flex items-center justify-center">
                    <span className="text-white font-bold text-sm -rotate-12">{settings.agencyName.charAt(0)}</span>
                  </div>
                  <span className="text-xl font-bold tracking-tight text-white">{settings.agencyName}</span>
                </div>
              )}
            </div>
            <div className="flex gap-8 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
              <button onClick={onGetStarted} className="hover:text-emerald-500 transition-colors uppercase">Admin</button>
            </div>
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
              © 2026 {settings.agencyName}. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

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
                      <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">{selectedService.name}</h3>
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
                        <h4 className="text-xl font-bold text-white uppercase tracking-tight mb-1">{pkg.name}</h4>
                        <p className="text-2xl font-bold text-emerald-500">₹{pkg.price.toLocaleString()}</p>
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
                          window.location.href = '#contact';
                          setContactForm(prev => ({
                            ...prev, 
                            services: [selectedService.name],
                            selectedPlan: `${selectedService.name} - ${pkg.name} (₹${pkg.price.toLocaleString()})`
                          }));
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

      {/* Portfolio Detail Modal */}
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
                  <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-4 sm:mb-6">{selectedProject.clientName}</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.servicesUsed.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-zinc-800 text-[10px] font-bold text-zinc-400 rounded-lg uppercase tracking-widest">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 sm:space-y-8 mb-10 sm:mb-12">
                  <div>
                    <h4 className="text-white font-bold uppercase tracking-tight mb-2 sm:mb-3 flex items-center gap-2">
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
                      className="px-6 sm:px-8 py-3 sm:py-4 bg-emerald-500 text-white rounded-xl sm:rounded-2xl font-bold uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2 hover:bg-emerald-400 transition-all"
                    >
                      Visit Website <ExternalLink size={16} />
                    </a>
                  )}
                  {selectedProject.appUrl && (
                    <a 
                      href={selectedProject.appUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 sm:px-8 py-3 sm:py-4 bg-zinc-800 text-white rounded-xl sm:rounded-2xl font-bold uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2 hover:bg-zinc-700 transition-all"
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

export default LandingPage;
