import React, { useState } from 'react';
import { 
  Layout, 
  Image as ImageIcon, 
  Briefcase, 
  MessageSquare, 
  Users, 
  Globe, 
  Package, 
  Plus, 
  Trash2, 
  Save, 
  PlusCircle,
  Link as LinkIcon,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  ChevronDown,
  X
} from 'lucide-react';
import { LandingContent, ServiceCategory, PortfolioProject, Testimonial, TeamMember, AgencyProduct } from '../types';

interface LandingPageCMSProps {
  content: LandingContent;
  onChange: (newContent: LandingContent) => void;
}

export const LandingPageCMS: React.FC<LandingPageCMSProps> = ({ content, onChange }) => {
  const [activeSection, setActiveSection] = useState<'settings' | 'services' | 'portfolio' | 'testimonials' | 'team' | 'partners' | 'products'>('settings');

  const updateSettings = (updates: Partial<LandingContent['settings']>) => {
    onChange({
      ...content,
      settings: { ...content.settings, ...updates }
    });
  };

  const addItem = (section: keyof Omit<LandingContent, 'settings'>, newItem: any) => {
    onChange({
      ...content,
      [section]: [...(content[section] as any[]), newItem]
    });
  };

  const removeItem = (section: keyof Omit<LandingContent, 'settings'>, id: string | number) => {
    onChange({
      ...content,
      [section]: (content[section] as any[]).filter((item: any, index: number) => 
        item.id ? item.id !== id : index !== id
      )
    });
  };

  const updateItem = (section: keyof Omit<LandingContent, 'settings'>, id: string | number, updates: any) => {
    onChange({
      ...content,
      [section]: (content[section] as any[]).map((item: any, index: number) => 
        (item.id ? item.id === id : index === id) ? { ...item, ...updates } : item
      )
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-12rem)]">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 space-y-2">
        <CMSNavButton 
          active={activeSection === 'settings'} 
          onClick={() => setActiveSection('settings')} 
          icon={<Layout size={18} />} 
          label="General Settings" 
        />
        <CMSNavButton 
          active={activeSection === 'services'} 
          onClick={() => setActiveSection('services')} 
          icon={<Briefcase size={18} />} 
          label="Services" 
        />
        <CMSNavButton 
          active={activeSection === 'portfolio'} 
          onClick={() => setActiveSection('portfolio')} 
          icon={<ImageIcon size={18} />} 
          label="Portfolio" 
        />
        <CMSNavButton 
          active={activeSection === 'testimonials'} 
          onClick={() => setActiveSection('testimonials')} 
          icon={<MessageSquare size={18} />} 
          label="Testimonials" 
        />
        <CMSNavButton 
          active={activeSection === 'team'} 
          onClick={() => setActiveSection('team')} 
          icon={<Users size={18} />} 
          label="Team" 
        />
        <CMSNavButton 
          active={activeSection === 'partners'} 
          onClick={() => setActiveSection('partners')} 
          icon={<Globe size={18} />} 
          label="Partners" 
        />
        <CMSNavButton 
          active={activeSection === 'products'} 
          onClick={() => setActiveSection('products')} 
          icon={<Package size={18} />} 
          label="Products" 
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 overflow-y-auto custom-scrollbar">
        {activeSection === 'settings' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">General Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CMSInput 
                label="Agency Name" 
                value={content.settings.agencyName} 
                onChange={v => updateSettings({ agencyName: v })} 
              />
              <CMSInput 
                label="Logo URL" 
                value={content.settings.logo || ''} 
                onChange={v => updateSettings({ logo: v })} 
                placeholder="https://..."
              />
              <CMSInput 
                label="Contact Email" 
                value={content.settings.contactEmail} 
                onChange={v => updateSettings({ contactEmail: v })} 
              />
              <CMSInput 
                label="Contact Phone" 
                value={content.settings.contactPhone} 
                onChange={v => updateSettings({ contactPhone: v })} 
              />
              <CMSInput 
                label="WhatsApp Number (with country code)" 
                value={content.settings.whatsappNumber} 
                onChange={v => updateSettings({ whatsappNumber: v })} 
                placeholder="+91..."
              />
              <CMSInput 
                label="Location" 
                value={content.settings.location} 
                onChange={v => updateSettings({ location: v })} 
              />
            </div>
          </div>
        )}

        {activeSection === 'services' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Services</h3>
              <button 
                onClick={() => addItem('services', {
                  id: Date.now().toString(),
                  name: 'New Service',
                  icon: 'BrainCircuit',
                  description: 'Description here...',
                  packages: []
                })}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-400 transition-all"
              >
                <Plus size={16} /> Add Service
              </button>
            </div>
            
            <div className="space-y-6">
              {content.services.map(service => (
                <div key={service.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 mr-4">
                      <CMSInput 
                        label="Service Name" 
                        value={service.name} 
                        onChange={v => updateItem('services', service.id, { name: v })} 
                      />
                      <CMSInput 
                        label="Icon Name (Lucide)" 
                        value={service.icon} 
                        onChange={v => updateItem('services', service.id, { icon: v })} 
                      />
                    </div>
                    <button 
                      onClick={() => removeItem('services', service.id)}
                      className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <CMSTextarea 
                    label="Description" 
                    value={service.description} 
                    onChange={v => updateItem('services', service.id, { description: v })} 
                  />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Packages</h4>
                      <button 
                        onClick={() => {
                          const newPackages = [...service.packages, {
                            id: Date.now().toString(),
                            name: 'New Package',
                            price: 0,
                            duration: '1 Month',
                            features: []
                          }];
                          updateItem('services', service.id, { packages: newPackages });
                        }}
                        className="text-emerald-500 hover:text-emerald-400 transition-colors"
                      >
                        <PlusCircle size={18} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.packages.map((pkg, pIdx) => (
                        <div key={pkg.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
                          <div className="flex justify-between">
                            <CMSInput 
                              label="Package Name" 
                              value={pkg.name} 
                              onChange={v => {
                                const newPkgs = [...service.packages];
                                newPkgs[pIdx] = { ...pkg, name: v };
                                updateItem('services', service.id, { packages: newPkgs });
                              }} 
                            />
                            <button 
                              onClick={() => {
                                const newPkgs = service.packages.filter((_, i) => i !== pIdx);
                                updateItem('services', service.id, { packages: newPkgs });
                              }}
                              className="p-2 text-zinc-600 hover:text-red-500"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <CMSInput 
                              label="Price" 
                              type="number"
                              value={pkg.price.toString()} 
                              onChange={v => {
                                const newPkgs = [...service.packages];
                                newPkgs[pIdx] = { ...pkg, price: parseInt(v) || 0 };
                                updateItem('services', service.id, { packages: newPkgs });
                              }} 
                            />
                            <CMSInput 
                              label="Duration" 
                              value={pkg.duration} 
                              onChange={v => {
                                const newPkgs = [...service.packages];
                                newPkgs[pIdx] = { ...pkg, duration: v };
                                updateItem('services', service.id, { packages: newPkgs });
                              }} 
                            />
                          </div>
                          <CMSTextarea 
                            label="Features (one per line)" 
                            value={pkg.features.join('\n')} 
                            onChange={v => {
                              const newPkgs = [...service.packages];
                              newPkgs[pIdx] = { ...pkg, features: v.split('\n').filter(f => f.trim()) };
                              updateItem('services', service.id, { packages: newPkgs });
                            }} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'portfolio' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Portfolio</h3>
              <button 
                onClick={() => addItem('portfolio', {
                  id: Date.now().toString(),
                  clientName: 'New Client',
                  businessType: 'Industry',
                  thumbnail: 'https://picsum.photos/seed/new/800/600',
                  servicesUsed: [],
                  results: 'Excellent results...',
                  websiteUrl: ''
                })}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-400 transition-all"
              >
                <Plus size={16} /> Add Project
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.portfolio.map(project => (
                <div key={project.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
                  <div className="flex justify-between">
                    <CMSInput 
                      label="Client Name" 
                      value={project.clientName} 
                      onChange={v => updateItem('portfolio', project.id, { clientName: v })} 
                    />
                    <button 
                      onClick={() => removeItem('portfolio', project.id)}
                      className="p-2 text-zinc-600 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <CMSInput 
                    label="Business Type" 
                    value={project.businessType} 
                    onChange={v => updateItem('portfolio', project.id, { businessType: v })} 
                  />
                  <CMSInput 
                    label="Thumbnail URL" 
                    value={project.thumbnail} 
                    onChange={v => updateItem('portfolio', project.id, { thumbnail: v })} 
                  />
                  <CMSTextarea 
                    label="Results" 
                    value={project.results} 
                    onChange={v => updateItem('portfolio', project.id, { results: v })} 
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <CMSInput 
                      label="Website URL" 
                      value={project.websiteUrl || ''} 
                      onChange={v => updateItem('portfolio', project.id, { websiteUrl: v })} 
                    />
                    <CMSInput 
                      label="App URL" 
                      value={project.appUrl || ''} 
                      onChange={v => updateItem('portfolio', project.id, { appUrl: v })} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'testimonials' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Testimonials</h3>
              <button 
                onClick={() => addItem('testimonials', {
                  id: Date.now().toString(),
                  name: 'Client Name',
                  role: 'Position, Company',
                  content: 'Review here...',
                  avatar: 'https://picsum.photos/seed/avatar/100/100'
                })}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-400 transition-all"
              >
                <Plus size={16} /> Add Testimonial
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.testimonials.map(t => (
                <div key={t.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
                  <div className="flex justify-between">
                    <CMSInput 
                      label="Name" 
                      value={t.name} 
                      onChange={v => updateItem('testimonials', t.id, { name: v })} 
                    />
                    <button 
                      onClick={() => removeItem('testimonials', t.id)}
                      className="p-2 text-zinc-600 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <CMSInput 
                    label="Role" 
                    value={t.role} 
                    onChange={v => updateItem('testimonials', t.id, { role: v })} 
                  />
                  <CMSInput 
                    label="Avatar URL" 
                    value={t.avatar} 
                    onChange={v => updateItem('testimonials', t.id, { avatar: v })} 
                  />
                  <CMSTextarea 
                    label="Content" 
                    value={t.content} 
                    onChange={v => updateItem('testimonials', t.id, { content: v })} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'team' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Team</h3>
              <button 
                onClick={() => addItem('team', {
                  id: Date.now().toString(),
                  name: 'Member Name',
                  position: 'Role',
                  experience: 'X Years',
                  photo: 'https://picsum.photos/seed/team/400/400'
                })}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-400 transition-all"
              >
                <Plus size={16} /> Add Member
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.team.map(m => (
                <div key={m.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
                  <div className="flex justify-between">
                    <CMSInput 
                      label="Name" 
                      value={m.name} 
                      onChange={v => updateItem('team', m.id, { name: v })} 
                    />
                    <button 
                      onClick={() => removeItem('team', m.id)}
                      className="p-2 text-zinc-600 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <CMSInput 
                    label="Position" 
                    value={m.position} 
                    onChange={v => updateItem('team', m.id, { position: v })} 
                  />
                  <CMSInput 
                    label="Experience" 
                    value={m.experience} 
                    onChange={v => updateItem('team', m.id, { experience: v })} 
                  />
                  <CMSInput 
                    label="Photo URL" 
                    value={m.photo} 
                    onChange={v => updateItem('team', m.id, { photo: v })} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'partners' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Partners</h3>
              <button 
                onClick={() => addItem('partners', 'https://picsum.photos/seed/p/200/100')}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-400 transition-all"
              >
                <Plus size={16} /> Add Partner Logo
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.partners.map((logo, idx) => (
                <div key={idx} className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Logo {idx + 1}</span>
                    <button 
                      onClick={() => removeItem('partners', idx)}
                      className="p-2 text-zinc-600 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <CMSInput 
                    label="Logo URL" 
                    value={logo} 
                    onChange={v => {
                      const newPartners = [...content.partners];
                      newPartners[idx] = v;
                      onChange({ ...content, partners: newPartners });
                    }} 
                  />
                  <div className="h-20 bg-zinc-900 rounded-xl flex items-center justify-center p-4">
                    <img src={logo} alt="Partner" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'products' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Products</h3>
              <button 
                onClick={() => addItem('products', {
                  name: 'New Product',
                  url: 'https://...',
                  logo: 'https://picsum.photos/seed/prod/200/200',
                  description: 'Product description...'
                })}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-400 transition-all"
              >
                <Plus size={16} /> Add Product
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.products.map((product, idx) => (
                <div key={idx} className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
                  <div className="flex justify-between">
                    <CMSInput 
                      label="Product Name" 
                      value={product.name} 
                      onChange={v => updateItem('products', idx, { name: v })} 
                    />
                    <button 
                      onClick={() => removeItem('products', idx)}
                      className="p-2 text-zinc-600 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <CMSInput 
                    label="URL" 
                    value={product.url} 
                    onChange={v => updateItem('products', idx, { url: v })} 
                  />
                  <CMSInput 
                    label="Logo URL" 
                    value={product.logo} 
                    onChange={v => updateItem('products', idx, { logo: v })} 
                  />
                  <CMSTextarea 
                    label="Description" 
                    value={product.description} 
                    onChange={v => updateItem('products', idx, { description: v })} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CMSNavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
      active 
        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
        : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'
    }`}
  >
    {icon}
    {label}
  </button>
);

const CMSInput: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }> = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{label}</label>
    <input 
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-all"
    />
  </div>
);

const CMSTextarea: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{label}</label>
    <textarea 
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-all resize-none"
    />
  </div>
);
