import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });
  const [portfolioRef, portfolioApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });
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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary-500/10 selection:text-primary-700 scroll-smooth">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.logo ? (
              <img src={settings.logo} alt={settings.agencyName} className="h-6 w-[80px] object-contain" />
            ) : (
              <span className="text-lg font-bold tracking-tight text-slate-900">{settings.agencyName}</span>
            )}
          </div>
          
          <div className="hidden lg:flex items-center gap-6">
            {['Home', 'Services', 'Portfolio', 'About'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className="text-[9px] font-bold text-slate-500 hover:text-primary-600 transition-colors uppercase tracking-[0.2em]"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="#contact"
              className="hidden sm:flex px-5 py-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all shadow-md shadow-primary-500/10"
            >
              Contact Us
            </a>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-900 transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
      <header id="home" className="relative pt-32 pb-24 overflow-hidden min-h-[85vh] flex items-center">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-40" 
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/15 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-500/15 blur-[120px] rounded-full animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="flex flex-col items-center text-center">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 text-primary-700 text-[9px] font-bold uppercase tracking-[0.2em] mb-8">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-500"></span>
                  </span>
                  {settings.agencyName} Agency
                </div>
                <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tight text-slate-900 leading-[0.9] mb-8 uppercase italic">
                  Let's make <br />
                  your Brand <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 not-italic relative">
                    famous.
                    <span className="absolute -inset-2 bg-accent-500/10 blur-2xl -z-10 rounded-full animate-pulse"></span>
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
                  We don't just manage accounts; we build legacies. Experience the fusion of AI-driven precision and creative brilliance.
                </p>
                <div className="flex flex-col sm:flex-row gap-8 items-center justify-center">
                  <a 
                    href="#contact"
                    className="px-10 py-5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-2xl font-bold uppercase tracking-widest transition-all shadow-2xl shadow-primary-500/25 flex items-center gap-3 group text-base"
                  >
                    Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                  <div className="flex -space-x-3 items-center">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                        <img src={`https://picsum.photos/seed/agency${i}/100/100`} alt="Client" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                    <div className="ml-6 text-left">
                      <p className="text-slate-900 font-bold text-lg leading-none">500+</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Global Clients</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-primary-500 to-transparent"></div>
        </motion.div>
      </header>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 uppercase mb-4">
                Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">Expertise</span>
              </h2>
              <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed">
                Comprehensive digital solutions tailored to your business goals. Explore our specialized packages.
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => emblaApi?.scrollPrev()}
                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-600 transition-all"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => emblaApi?.scrollNext()}
                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-600 transition-all"
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="embla" ref={emblaRef}>
            <div className="embla__container flex gap-6">
              {services.map((service, index) => (
                <div key={service.id} className="embla__slide flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedService(service)}
                    className={`group h-full bg-gradient-to-br from-white to-slate-50/50 border-2 p-10 rounded-[40px] transition-all cursor-pointer relative overflow-hidden shadow-sm hover:shadow-2xl flex flex-col ${
                      index % 2 === 0 ? 'border-primary-100 hover:border-primary-400/50 hover:shadow-primary-500/10' : 'border-accent-100 hover:border-accent-400/50 hover:shadow-accent-500/10'
                    }`}
                  >
                    {/* Background Accent */}
                    <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-colors" />
                    <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-accent-500/5 rounded-full blur-3xl group-hover:bg-accent-500/10 transition-colors" />

                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 size={18} className="text-primary-600" />
                    </div>
                    
                    <div className="w-20 h-20 bg-white border border-slate-100 rounded-3xl flex items-center justify-center mb-10 shadow-sm transition-all duration-500">
                      {getServiceIcon(service.icon, index)}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight uppercase group-hover:text-primary-600 transition-colors">
                      {service.name}
                    </h3>
                    
                    <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-10 flex-grow">
                      {service.description}
                    </p>
                    
                    <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-primary-600 group-hover:text-accent-600 text-xs font-bold uppercase tracking-widest transition-colors">
                        View Packages <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                        <Rocket size={18} />
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <button 
              onClick={onViewAllServices}
              className="px-10 py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 flex items-center gap-3 mx-auto group text-[11px]"
            >
              Explore All Solutions <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 uppercase mb-4">
                Client <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">Success</span>
              </h2>
              <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed">
                Explore how we've helped businesses achieve their potential. Slides to see more projects.
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => portfolioApi?.scrollPrev()}
                className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-600 transition-all shadow-sm"
                aria-label="Previous project"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => portfolioApi?.scrollNext()}
                className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-600 transition-all shadow-sm"
                aria-label="Next project"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="embla" ref={portfolioRef}>
            <div className="embla__container flex gap-6">
              {portfolio.map((project, index) => (
                <div key={project.id} className="embla__slide flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedProject(project)}
                    className={`group h-full bg-gradient-to-br from-white to-slate-50/50 border-2 rounded-[40px] transition-all cursor-pointer relative overflow-hidden shadow-sm hover:shadow-2xl flex flex-col ${
                      index % 2 === 0 ? 'border-primary-100 hover:border-primary-400/50 hover:shadow-primary-500/10' : 'border-accent-100 hover:border-accent-400/50 hover:shadow-accent-500/10'
                    }`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden m-2 rounded-[32px]">
                      <img 
                        src={project.thumbnail} 
                        alt={project.clientName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <p className="text-[10px] font-bold text-white/80 uppercase tracking-[0.3em] mb-1">{project.businessType}</p>
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">{project.clientName}</h3>
                      </div>
                    </div>
                    
                    <div className="p-8 pt-4 flex flex-col justify-between flex-grow">
                      <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                        Strategic growth and digital transformation for {project.clientName}.
                      </p>
                      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-primary-600 group-hover:text-accent-600 text-xs font-bold uppercase tracking-widest transition-colors">
                          View Project <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                          <Maximize2 size={16} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <button 
              onClick={onViewAllPortfolio}
              className="px-10 py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 flex items-center gap-3 mx-auto group text-[11px]"
            >
              Explore All Projects <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 uppercase mb-4">
              Client <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">Voices</span>
            </h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto text-sm sm:text-base">
              Don't just take our word for it. Here's what our partners have to say about working with DigiTaank.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {testimonials.length > 0 ? (
              <>
                <div className="absolute -top-8 -left-8 text-accent-500/10">
                  <Quote size={100} />
                </div>

                <div className="relative z-10 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTestimonial}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                      className="bg-slate-50 border border-slate-100 p-8 sm:p-12 rounded-[40px] shadow-sm"
                    >
                      <p className="text-lg sm:text-2xl font-medium text-slate-900 leading-relaxed mb-10 italic">
                        "{testimonials[currentTestimonial].content}"
                      </p>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-primary-500/10">
                            <img 
                              src={testimonials[currentTestimonial].avatar} 
                              alt={testimonials[currentTestimonial].name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                              {testimonials[currentTestimonial].name}
                            </h4>
                            <p className="text-primary-600 text-[10px] font-bold uppercase tracking-widest">
                              {testimonials[currentTestimonial].role}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button 
                            onClick={prevTestimonial}
                            className="w-12 h-12 bg-white hover:bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center transition-all border border-slate-200"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button 
                            onClick={nextTestimonial}
                            className="w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-primary-500/20"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex justify-center gap-2 mt-10">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentTestimonial(i)}
                      className={`h-1 rounded-full transition-all duration-500 ${
                        i === currentTestimonial ? 'w-8 bg-primary-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-slate-50 rounded-[32px] border border-slate-100">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No testimonials yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative max-w-sm mx-auto w-full lg:mx-0">
              <div className="aspect-[4/5] rounded-[48px] overflow-hidden border border-slate-200 bg-white shadow-xl">
                <img 
                  src="https://picsum.photos/seed/founder/800/1000" 
                  alt="Sunil Gour" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white border border-slate-100 px-8 py-4 rounded-2xl shadow-xl min-w-[240px] text-center">
                <p className="text-slate-900 font-bold uppercase tracking-widest text-xs mb-0.5">Sunil Gour</p>
                <div className="h-0.5 w-8 bg-primary-600 mx-auto mb-1"></div>
                <p className="text-primary-600 text-[9px] font-bold uppercase tracking-[0.2em]">Founder & CEO</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 uppercase mb-6">
                  Behind <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">DigiTaank</span>
                </h2>
                <p className="text-slate-600 text-base leading-relaxed">
                  Founded by Sunil Gour, DigiTaank is a creative-led digital agency that believes in the power of smart marketing. We don't just run ads; we build ecosystems for growth.
                </p>
              </div>

              <div className="bg-white border border-slate-100 p-8 rounded-[40px] shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Rocket size={80} className="text-primary-600" />
                </div>
                <h4 className="text-slate-900 font-bold uppercase tracking-tight mb-4 flex items-center gap-2 text-base">
                  <Rocket size={20} className="text-primary-600" /> Our Mission
                </h4>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed relative z-10">
                  We are primarily focused on supporting new startups that often lack specialized marketing and development teams. We don't just provide services; we stand with you as your dedicated growth partners, ensuring your vision has the technical and strategic backbone it needs to succeed.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <p className="text-slate-700 font-bold mb-6 italic text-sm">"Innovation is not just about technology, it's about how we solve human problems with it."</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                      <img src="https://picsum.photos/seed/sunil/100/100" alt="Sunil Gour" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold uppercase tracking-widest text-[10px]">Sunil Gour</p>
                      <p className="text-slate-400 text-[8px] font-bold uppercase tracking-widest">Founder & CEO</p>
                    </div>
                  </div>
                  <button 
                    onClick={onViewAllAbout}
                    className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 rounded-xl font-bold uppercase tracking-widest text-[9px] transition-all border border-slate-200 flex items-center gap-2 group"
                  >
                    Know More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-slate-50 border border-slate-100 p-8 sm:p-12 rounded-[48px] shadow-sm">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 uppercase mb-6">
                Let's <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">Connect</span>
              </h2>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={contactForm.name}
                      onChange={e => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-slate-900 text-sm focus:border-primary-500 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
                    <input 
                      type="text" 
                      required
                      value={contactForm.businessName}
                      onChange={e => setContactForm({...contactForm, businessName: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-slate-900 text-sm focus:border-primary-500 outline-none transition-all"
                      placeholder="Acme Corp"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                    <input 
                      type="tel" 
                      required
                      value={contactForm.whatsapp}
                      onChange={e => setContactForm({...contactForm, whatsapp: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-slate-900 text-sm focus:border-primary-500 outline-none transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Selected Plan</label>
                    <input 
                      type="text" 
                      readOnly
                      value={contactForm.selectedPlan}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-5 py-3 text-primary-600 font-bold text-xs outline-none cursor-default"
                      placeholder="Select a package above"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Your Budget</label>
                    <select 
                      value={contactForm.budget}
                      onChange={e => setContactForm({...contactForm, budget: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-slate-900 text-sm focus:border-primary-500 outline-none transition-all appearance-none"
                    >
                      <option value="">Select Budget Range</option>
                      <option value="10k-50k">₹10,000 - ₹50,000</option>
                      <option value="50k-1L">₹50,000 - ₹1,00,000</option>
                      <option value="1L+">₹1,00,000+</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Services Required</label>
                  <div className="flex flex-wrap gap-2">
                    {services.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleServiceSelection(s.name)}
                        className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest border transition-all ${
                          contactForm.services.includes(s.name)
                            ? 'bg-primary-600 border-primary-600 text-white'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-primary-500/50'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    rows={4}
                    value={contactForm.message}
                    onChange={e => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-slate-900 text-sm focus:border-primary-500 outline-none transition-all resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 group text-xs"
                >
                  Send Message <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col justify-center space-y-10">
              <div>
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-4">Contact <span className="text-primary-600">Details</span></h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-primary-600 shrink-0 shadow-sm">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Call Us</p>
                      <p className="text-base font-bold text-slate-900">{settings.contactPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-primary-600 shrink-0 shadow-sm">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Us</p>
                      <p className="text-base font-bold text-slate-900">{settings.contactEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-primary-600 shrink-0 shadow-sm">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Our Location</p>
                      <p className="text-base font-bold text-slate-900">{settings.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Follow Our Journey</p>
                <div className="flex gap-3">
                  {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
                    <a key={i} href="#" className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:text-primary-600 hover:border-primary-500/50 transition-all shadow-sm">
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>

              <a 
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-4 bg-primary-500/5 border border-primary-500/10 text-primary-600 rounded-2xl font-bold uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all w-fit text-[10px]"
              >
                <MessageSquare size={20} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                  <span className="text-lg font-bold tracking-tight text-slate-900">{settings.agencyName}</span>
                </div>
              )}
            </div>
            <div className="flex gap-6 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-primary-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Terms</a>
              <button onClick={onGetStarted} className="hover:text-primary-600 transition-colors uppercase">Admin</button>
            </div>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">
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
                          window.location.href = '#contact';
                          setContactForm(prev => ({
                            ...prev, 
                            services: [selectedService.name],
                            selectedPlan: `${selectedService.name} - ${pkg.name} (₹${pkg.price.toLocaleString()})`
                          }));
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

      {/* Portfolio Detail Modal */}
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
    </div>
  );
};

function getServiceIcon(iconName: string, index: number = 0) {
  const colors = ['text-primary-600', 'text-accent-500', 'text-indigo-600', 'text-blue-600', 'text-red-500'];
  const colorClass = colors[index % colors.length];
  
  switch (iconName) {
    case 'MessageSquare': return <MessageSquare size={32} className={colorClass} />;
    case 'Globe': return <Globe size={32} className={colorClass} />;
    case 'Layout': return <Layout size={32} className={colorClass} />;
    case 'Zap': return <Zap size={32} className={colorClass} />;
    case 'Shield': return <Shield size={32} className={colorClass} />;
    default: return <BrainCircuit size={32} className={colorClass} />;
  }
}

export default LandingPage;
