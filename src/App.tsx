import React, { useState, useEffect, useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  LayoutDashboard, 
  FileText, 
  Receipt, 
  History, 
  Plus, 
  Send, 
  Trash2, 
  BrainCircuit, 
  ChevronRight,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  Share2,
  ArrowLeft,
  Settings,
  Save,
  Edit3,
  X,
  Maximize2,
  Minimize2,
  Monitor,
  Users,
  TrendingUp,
  DollarSign,
  Briefcase,
  LogOut,
  Cloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

import { Service, ClientDetails, Quotation, NegotiationSuggestion, AgencySettings } from './types';
import { PREDEFINED_SERVICES, MAINTENANCE_POLICY, PAYMENT_TERMS } from './constants';
import { generateProposal, negotiatePrice } from './services/gemini';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'history' | 'preview' | 'settings' | 'dashboard'>('dashboard');
  const [client, setClient] = useState<ClientDetails>({
    name: '',
    businessName: '',
    phoneNumber: '',
    businessType: ''
  });
  const [customBusinessType, setCustomBusinessType] = useState('');
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed');
  const [history, setHistory] = useState<Quotation[]>([]);
  const [masterServices, setMasterServices] = useState<Service[]>(PREDEFINED_SERVICES);
  const [currentQuotation, setCurrentQuotation] = useState<Quotation | null>(null);
  const [proposalText, setProposalText] = useState<string>('');
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [clientBudget, setClientBudget] = useState<string>('');
  const [negotiation, setNegotiation] = useState<NegotiationSuggestion | null>(null);
  const [isNegotiating, setIsNegotiating] = useState(false);
  const quotationRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [previewMode, setPreviewMode] = useState<'design' | 'pdf'>('design');
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [pdfSettings, setPdfSettings] = useState<{
    orientation: 'p' | 'l';
    format: 'a4' | 'letter' | 'legal';
    scale: number;
  }>({
    orientation: 'p',
    format: 'a4',
    scale: 2
  });
  const [editingMasterServiceId, setEditingMasterServiceId] = useState<string | null>(null);
  const [newMasterService, setNewMasterService] = useState<Partial<Service>>({
    category: '',
    name: '',
    price: 0,
    cost: 0,
    profit: 0,
    duration: '',
    description: ''
  });
  const [agencySettings, setAgencySettings] = useState<AgencySettings>({
    logo: null,
    brandColor: '#10b981', // Default emerald-500
    agencyName: 'DigitAI'
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [envMissing, setEnvMissing] = useState(false);
  const [docType, setDocType] = useState<'quotation' | 'invoice'>('quotation');

  // Auth listener
  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
      setEnvMissing(true);
      setIsAuthReady(true);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load data from Supabase
  useEffect(() => {
    if (session) {
      setIsDataLoaded(false);
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    if (!session?.user?.id) return;
    setIsSyncing(true);
    try {
      // Fetch Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profile) {
        setAgencySettings({
          logo: profile.logo_url,
          brandColor: profile.brand_color,
          agencyName: profile.agency_name
        });
      }

      // Fetch Master Services
      const { data: services } = await supabase
        .from('master_services')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (services && services.length > 0) {
        setMasterServices(services.map(s => ({
          ...s,
          id: String(s.id)
        })));
      }

      // Fetch Quotations
      const { data: quotations } = await supabase
        .from('quotations')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false });
      
      if (quotations) {
        setHistory(quotations.map(q => ({
          id: q.quotation_id,
          date: q.date,
          client: q.client_data,
          services: q.services,
          totalPrice: q.total_price,
          discount: q.discount,
          finalPrice: q.final_price,
          timeline: q.timeline,
          maintenancePolicy: q.maintenance_policy,
          paymentTerms: q.payment_terms,
          status: q.status,
          totalProfit: q.total_profit
        })));
      }
      setIsDataLoaded(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Save agency settings to Supabase
  useEffect(() => {
    if (session?.user?.id && isDataLoaded) {
      const timeoutId = setTimeout(async () => {
        setIsSyncing(true);
        try {
          await supabase.from('profiles').upsert({
            id: session.user.id,
            agency_name: agencySettings.agencyName,
            brand_color: agencySettings.brandColor,
            logo_url: agencySettings.logo,
            updated_at: new Date().toISOString()
          });
        } catch (error) {
          console.error('Error saving settings:', error);
        } finally {
          setIsSyncing(false);
        }
      }, 1000); // 1s debounce
      return () => clearTimeout(timeoutId);
    }
    document.documentElement.style.setProperty('--brand-color', agencySettings.brandColor);
    document.documentElement.style.setProperty('--brand-color-rgb', hexToRgb(agencySettings.brandColor));
  }, [agencySettings, session, isDataLoaded]);

  // Auto-sync master services to Supabase
  useEffect(() => {
    if (session?.user?.id && isDataLoaded) {
      const timeoutId = setTimeout(() => {
        saveMasterServices(masterServices);
      }, 1500); // 1.5s debounce to avoid collision with settings sync
      return () => clearTimeout(timeoutId);
    }
  }, [masterServices, session, isDataLoaded]);

  // Save master services to Supabase
  const saveMasterServices = async (services: Service[]) => {
    if (!session?.user?.id) return;
    setIsSyncing(true);
    try {
      // Delete existing and insert new (simple sync)
      await supabase.from('master_services').delete().eq('user_id', session.user.id);
      
      if (services.length > 0) {
        const { error } = await supabase.from('master_services').insert(
          services.map(s => ({
            user_id: session.user.id,
            name: s.name,
            category: s.category,
            price: s.price,
            cost: s.cost,
            profit: s.profit,
            duration: s.duration,
            description: s.description
          }))
        );
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving services:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Helper to convert hex to rgb for opacity support
  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
      '16, 185, 129';
  }

  const saveToHistory = async (quotation: Quotation) => {
    if (!session?.user?.id) return;
    setIsSyncing(true);
    try {
      const { error } = await supabase.from('quotations').insert({
        user_id: session.user.id,
        quotation_id: quotation.id,
        date: quotation.date,
        client_data: quotation.client,
        services: quotation.services,
        total_price: quotation.totalPrice,
        discount: quotation.discount,
        final_price: quotation.finalPrice,
        total_profit: quotation.totalProfit,
        timeline: quotation.timeline,
        maintenance_policy: quotation.maintenancePolicy,
        payment_terms: quotation.paymentTerms,
        status: quotation.status
      });
      if (error) throw error;
      setHistory(prev => [quotation, ...prev]);
    } catch (error) {
      console.error('Error saving quotation:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(masterServices.map(s => s.category));
    return Array.from(cats).sort();
  }, [masterServices]);

  const totalPrice = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + (s.price * (s.quantity || 1)), 0);
  }, [selectedServices]);

  const dashboardStats = useMemo(() => {
    const confirmedHistory = history.filter(q => q.status === 'confirmed');
    const totalRevenue = confirmedHistory.reduce((sum, q) => sum + q.finalPrice, 0);
    const totalProfit = confirmedHistory.reduce((sum, q) => sum + (q.totalProfit || 0), 0);
    const totalClients = new Set(confirmedHistory.map(q => q.client.businessName)).size;
    const totalQuotes = confirmedHistory.length;
    
    const serviceCounts: Record<string, number> = {};
    confirmedHistory.forEach(q => {
      q.services.forEach(s => {
        serviceCounts[s.name] = (serviceCounts[s.name] || 0) + 1;
      });
    });
    
    const topServices = Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const clientData: Record<string, { name: string, business: string, totalSpent: number, count: number, lastDate: string }> = {};
    confirmedHistory.forEach(q => {
      const key = q.client.businessName || q.client.name;
      if (!clientData[key]) {
        clientData[key] = { 
          name: q.client.name, 
          business: q.client.businessName, 
          totalSpent: 0, 
          count: 0, 
          lastDate: q.date 
        };
      }
      clientData[key].totalSpent += q.finalPrice;
      clientData[key].count += 1;
      if (new Date(q.date) > new Date(clientData[key].lastDate)) {
        clientData[key].lastDate = q.date;
      }
    });

    const clients = Object.values(clientData).sort((a, b) => b.totalSpent - a.totalSpent);

    return { totalRevenue, totalProfit, totalClients, totalQuotes, topServices, clients };
  }, [history]);

  const finalDiscount = useMemo(() => {
    if (discountType === 'percent') {
      return (totalPrice * discount) / 100;
    }
    return discount;
  }, [totalPrice, discount, discountType]);

  const finalPrice = useMemo(() => {
    return Math.max(0, totalPrice - finalDiscount);
  }, [totalPrice, finalDiscount]);

  const handleServiceToggle = (service: Service) => {
    const exists = selectedServices.find(s => s.id.startsWith(service.id));
    if (exists) {
      setSelectedServices(selectedServices.filter(s => !s.id.startsWith(service.id)));
    } else {
      // Add a copy so it can be edited without affecting the predefined list
      const copy = { ...service, id: `${service.id}-${Date.now()}`, quantity: 1 };
      // Ensure cost and profit are set
      if (copy.cost === undefined) copy.cost = Math.floor(copy.price * 0.5);
      if (copy.profit === undefined) copy.profit = copy.price - copy.cost;
      setSelectedServices([...selectedServices, copy]);
    }
  };

  const handleAddCustomService = () => {
    const newService: Service = {
      id: `custom-${Date.now()}`,
      name: 'Custom Service',
      description: 'Description of the service',
      price: 0,
      cost: 0,
      profit: 0,
      category: 'Custom',
      duration: 'TBD',
      quantity: 1
    };
    setSelectedServices([...selectedServices, newService]);
  };

  const handleUpdateService = (id: string, updates: Partial<Service>) => {
    setSelectedServices(selectedServices.map(s => {
      if (s.id === id) {
        const updated = { ...s, ...updates };
        if ('cost' in updates || 'profit' in updates) {
          updated.price = (updated.cost || 0) + (updated.profit || 0);
        }
        return updated;
      }
      return s;
    }));
  };

  const handleConfirmQuotation = async (id: string) => {
    if (!session?.user?.id) return;
    setIsSyncing(true);
    try {
      const { error } = await supabase
        .from('quotations')
        .update({ status: 'confirmed' })
        .eq('user_id', session.user.id)
        .eq('quotation_id', id);
      
      if (error) throw error;
      
      setHistory(prev => prev.map(q => q.id === id ? { ...q, status: 'confirmed' } : q));
      if (currentQuotation?.id === id) {
        setCurrentQuotation({ ...currentQuotation, status: 'confirmed' });
      }
    } catch (error) {
      console.error('Error confirming quotation:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteQuotation = async (id: string) => {
    if (!session?.user?.id) return;
    if (!confirm('Are you sure you want to delete this quotation?')) return;
    
    setIsSyncing(true);
    try {
      const { error } = await supabase
        .from('quotations')
        .delete()
        .eq('user_id', session.user.id)
        .eq('quotation_id', id);
      
      if (error) throw error;
      
      setHistory(prev => prev.filter(q => q.id !== id));
      if (currentQuotation?.id === id) {
        setCurrentQuotation(null);
      }
    } catch (error) {
      console.error('Error deleting quotation:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRemoveService = (id: string) => {
    setSelectedServices(selectedServices.filter(s => s.id !== id));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAgencySettings({ ...agencySettings, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateMasterService = (id: string, updates: Partial<Service>) => {
    setMasterServices(masterServices.map(s => {
      if (s.id === id) {
        const updated = { ...s, ...updates };
        if ('cost' in updates || 'profit' in updates) {
          updated.price = (updated.cost || 0) + (updated.profit || 0);
        }
        return updated;
      }
      return s;
    }));
  };

  const handleAddMasterService = () => {
    if (newMasterService.name && newMasterService.category) {
      const service: Service = {
        id: `master-${Date.now()}`,
        name: newMasterService.name || '',
        category: newMasterService.category || '',
        price: newMasterService.price || 0,
        cost: newMasterService.cost || 0,
        profit: newMasterService.profit || 0,
        duration: newMasterService.duration || '',
        description: newMasterService.description || ''
      };
      const updated = [...masterServices, service];
      setMasterServices(updated);
      saveMasterServices(updated);
      setNewMasterService({ category: '', name: '', price: 0, cost: 0, profit: 0, duration: '', description: '' });
    }
  };

  const handleRemoveMasterService = (id: string) => {
    const updated = masterServices.filter(s => s.id !== id);
    setMasterServices(updated);
    saveMasterServices(updated);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    let url: string | null = null;
    const updatePreview = async () => {
      if (previewMode === 'pdf' && activeTab === 'preview' && currentQuotation) {
        setIsGeneratingPDF(true);
        setPdfPreviewUrl(null);
        // Small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 300));
        const result = await generatePDFBlob();
        if (result) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            setPdfPreviewUrl(dataUrl);
            setIsGeneratingPDF(false);
          };
          reader.readAsDataURL(result.blob);
        } else {
          setIsGeneratingPDF(false);
        }
      } else {
        setPdfPreviewUrl(null);
      }
    };

    updatePreview();

    return () => {
      // Data URLs don't need to be revoked
    };
  }, [previewMode, activeTab, currentQuotation, docType, pdfSettings, agencySettings]);

  if (!isAuthReady) return null;

  if (envMissing) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-900 border border-red-500/20 rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="text-red-500" size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Configuration Required</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Supabase environment variables are missing or invalid. Please ensure <code className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded">VITE_SUPABASE_URL</code> and <code className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> are set in your <code className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded">.env</code> file.
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-4 rounded-2xl font-bold transition-all"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!session) return <Auth onAuthSuccess={() => {}} />;

  const handleResetServices = () => {
    if (confirm("Are you sure you want to reset all services to defaults? This will delete your custom services.")) {
      setMasterServices(PREDEFINED_SERVICES);
    }
  };

  const generateQuotation = () => {
    if (!client.name || !client.phoneNumber || selectedServices.length === 0) {
      alert("Please enter client details and select at least one service.");
      return;
    }

    const hasWebDev = selectedServices.some(s => s.category === 'Website Development');
    
    const finalClient = {
      ...client,
      businessType: client.businessType === 'Other' ? customBusinessType : client.businessType
    };

    const totalCost = selectedServices.reduce((sum, s) => sum + ((s.cost || 0) * (s.quantity || 1)), 0);
    const totalProfit = finalPrice - totalCost;

    const newQuotation: Quotation = {
      id: `QT-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      client: finalClient,
      services: [...selectedServices],
      totalPrice,
      discount: finalDiscount,
      finalPrice,
      totalProfit,
      timeline: "7-15 Working Days",
      maintenancePolicy: hasWebDev ? MAINTENANCE_POLICY : "Standard support included for 30 days.",
      paymentTerms: PAYMENT_TERMS,
      status: 'quotation'
    };

    setCurrentQuotation(newQuotation);
    saveToHistory(newQuotation);
    setActiveTab('preview');
  };

  const handleSendToWhatsApp = (type: 'quotation' | 'proposal' | 'invoice') => {
    if (!currentQuotation) return;

    const message = `*DigiTaank AI - ${type.toUpperCase()}*%0A%0A` +
      `Hello ${currentQuotation.client.name},%0A` +
      `Here is your ${type} for ${currentQuotation.client.businessName}.%0A%0A` +
      `*Services:* ${currentQuotation.services.map(s => `${s.name} (${s.quantity || 1} x ₹${s.price} for ${s.duration})`).join(", ")}%0A` +
      `*Total Amount:* ₹${currentQuotation.finalPrice}%0A%0A` +
      `Please check the details and let us know if you have any questions.`;

    const cleanPhone = currentQuotation.client.phoneNumber.replace(/\D/g, '');
    const phone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const generatePDFBlob = async () => {
    if (!quotationRef.current) {
      console.error('Quotation ref is null');
      alert('Error: Document reference not found.');
      return null;
    }
    try {
      console.log('Starting PDF generation...');
      const canvas = await html2canvas(quotationRef.current, {
        scale: pdfSettings.scale,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          // Aggressively strip modern color functions from all style tags in the clone
          const styleTags = clonedDoc.getElementsByTagName('style');
          for (let i = 0; i < styleTags.length; i++) {
            try {
              styleTags[i].innerHTML = styleTags[i].innerHTML
                .replace(/oklch\([^)]+\)/g, '#1a1a1a')
                .replace(/oklab\([^)]+\)/g, '#1a1a1a');
            } catch (e) {
              console.warn('Failed to patch style tag:', e);
            }
          }

          const clonedElement = clonedDoc.querySelector('.pdf-source-container') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.opacity = '1';
            clonedElement.style.visibility = 'visible';
            clonedElement.style.position = 'relative';
            clonedElement.style.display = 'block';
            clonedElement.style.zIndex = '9999';
            clonedElement.style.transform = 'none';
            clonedElement.style.width = '1000px'; // Fixed width for consistent capture
            clonedElement.style.margin = '0';
            clonedElement.style.padding = '60px'; // Consistent padding
          }
          const elements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            try {
              const style = window.getComputedStyle(el);
              
              // Helper to check if a value contains modern color functions
              const hasModernColor = (val: string) => val && (val.includes('oklch') || val.includes('oklab'));
              
              // Replace modern color functions with safe fallbacks for common properties
              if (hasModernColor(style.color)) el.style.color = '#1a1a1a';
              if (hasModernColor(style.backgroundColor)) el.style.backgroundColor = '#ffffff';
              if (hasModernColor(style.borderColor)) el.style.borderColor = '#e5e7eb';
              if (hasModernColor(style.fill)) el.style.fill = 'currentColor';
              if (hasModernColor(style.stroke)) el.style.stroke = 'currentColor';
              
              // Handle gradients or complex backgrounds
              if (hasModernColor(style.backgroundImage)) {
                el.style.backgroundImage = 'none';
                el.style.backgroundColor = '#f9fafb'; // Light gray fallback
              }
              
              // Handle box shadows
              if (hasModernColor(style.boxShadow)) el.style.boxShadow = 'none';
            } catch (e) {
              // Ignore style errors for individual elements
            }
          }
        }
      });
      
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas generation resulted in empty image');
      }

      console.log('Canvas generated successfully');
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const pdf = new jsPDF(pdfSettings.orientation, 'mm', pdfSettings.format);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }
      return { blob: pdf.output('blob'), pdf };
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    const result = await generatePDFBlob();
    if (result) {
      result.pdf.save(`${currentQuotation?.id || 'document'}.pdf`);
    }
    setIsGeneratingPDF(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSharePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const result = await generatePDFBlob();
      if (!result) return;
      
      const file = new File([result.blob], `${currentQuotation?.id || 'document'}.pdf`, { type: 'application/pdf' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${docType.toUpperCase()} - ${currentQuotation?.client.businessName}`,
          text: `Here is the ${docType} from DigiTaank.`
        });
      } else {
        // Fallback to WhatsApp text + Download
        handleSendToWhatsApp(docType);
        result.pdf.save(`${currentQuotation?.id || 'document'}.pdf`);
        alert("Web Share API not supported. Document downloaded. Please share it manually on WhatsApp.");
      }
    } catch (error) {
      console.error('Sharing failed:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleNegotiate = async () => {
    if (!currentQuotation || !clientBudget) return;
    setIsNegotiating(true);
    const suggestion = await negotiatePrice(currentQuotation, parseInt(clientBudget));
    setNegotiation(suggestion);
    setIsNegotiating(false);
  };

  const handleGenerateProposal = async () => {
    if (!currentQuotation) return;
    setIsGeneratingProposal(true);
    const text = await generateProposal(currentQuotation);
    setProposalText(text);
    setIsGeneratingProposal(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-white/10">
      {/* Sidebar / Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-2xl border-t border-zinc-800 px-2 sm:px-6 py-2 sm:py-3 flex justify-around items-center z-50 md:top-0 md:bottom-auto md:flex-col md:w-20 md:h-screen md:border-t-0 md:border-r border-zinc-800 print:hidden">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={cn("p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all flex flex-col items-center gap-1 md:gap-0")}
          style={{ 
            backgroundColor: activeTab === 'dashboard' ? agencySettings.brandColor : 'transparent',
            color: activeTab === 'dashboard' ? '#ffffff' : '#a1a1aa',
            boxShadow: activeTab === 'dashboard' ? `0 10px 15px -3px rgba(${hexToRgb(agencySettings.brandColor)}, 0.2)` : 'none'
          }}
        >
          <LayoutDashboard size={20} className="sm:w-6 sm:h-6" />
          <span className="text-[8px] sm:text-[10px] font-bold md:hidden">Stats</span>
        </button>
        <button 
          onClick={() => setActiveTab('create')}
          className={cn("p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all flex flex-col items-center gap-1 md:gap-0")}
          style={{ 
            backgroundColor: activeTab === 'create' ? agencySettings.brandColor : 'transparent',
            color: activeTab === 'create' ? '#ffffff' : '#a1a1aa',
            boxShadow: activeTab === 'create' ? `0 10px 15px -3px rgba(${hexToRgb(agencySettings.brandColor)}, 0.2)` : 'none'
          }}
        >
          <Plus size={20} className="sm:w-6 sm:h-6" />
          <span className="text-[8px] sm:text-[10px] font-bold md:hidden">Create</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={cn("p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all flex flex-col items-center gap-1 md:gap-0")}
          style={{ 
            backgroundColor: activeTab === 'history' ? agencySettings.brandColor : 'transparent',
            color: activeTab === 'history' ? '#ffffff' : '#a1a1aa',
            boxShadow: activeTab === 'history' ? `0 10px 15px -3px rgba(${hexToRgb(agencySettings.brandColor)}, 0.2)` : 'none'
          }}
        >
          <History size={20} className="sm:w-6 sm:h-6" />
          <span className="text-[8px] sm:text-[10px] font-bold md:hidden">History</span>
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={cn("p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all flex flex-col items-center gap-1 md:gap-0")}
          style={{ 
            backgroundColor: activeTab === 'settings' ? agencySettings.brandColor : 'transparent',
            color: activeTab === 'settings' ? '#ffffff' : '#a1a1aa',
            boxShadow: activeTab === 'settings' ? `0 10px 15px -3px rgba(${hexToRgb(agencySettings.brandColor)}, 0.2)` : 'none'
          }}
        >
          <Settings size={20} className="sm:w-6 sm:h-6" />
          <span className="text-[8px] sm:text-[10px] font-bold md:hidden">Settings</span>
        </button>
        {currentQuotation && (
          <button 
            onClick={() => setActiveTab('preview')}
            className={cn("p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all flex flex-col items-center gap-1 md:gap-0")}
            style={{ 
              backgroundColor: activeTab === 'preview' ? agencySettings.brandColor : 'transparent',
              color: activeTab === 'preview' ? '#ffffff' : '#a1a1aa',
              boxShadow: activeTab === 'preview' ? `0 10px 15px -3px rgba(${hexToRgb(agencySettings.brandColor)}, 0.2)` : 'none'
            }}
          >
            <FileText size={20} className="sm:w-6 sm:h-6" />
            <span className="text-[8px] sm:text-[10px] font-bold md:hidden">Preview</span>
          </button>
        )}
      </nav>

      {/* Main Content */}
      <main className="pb-24 sm:pb-32 pt-4 sm:pt-6 px-3 sm:px-4 md:pl-28 md:pr-8 max-w-7xl mx-auto print:p-0 print:m-0">
        <header className="mb-8 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-4">
            {agencySettings.logo ? (
              <img src={agencySettings.logo} alt="Logo" className="h-10 w-auto object-contain" />
            ) : (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: agencySettings.brandColor }}>
                <BrainCircuit size={24} />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-black tracking-tighter" style={{ color: agencySettings.brandColor }}>{agencySettings.agencyName}</h1>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Personal Sales Assistant</p>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-[8px] font-black text-emerald-500 uppercase tracking-tighter">
                  <Save size={8} /> Auto-Saved
                </div>
              </div>
            </div>
          </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-2xl border border-zinc-800" title={isSyncing ? 'Syncing...' : 'Supabase Connected'}>
                <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                  {isSyncing ? 'Syncing' : 'Synced'}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-xl transition-all"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                      <DollarSign size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Revenue</p>
                      <p className="text-2xl font-black text-white">₹{dashboardStats.totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full opacity-50"></div>
                  </div>
                </div>

                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Profit</p>
                      <p className="text-2xl font-black text-emerald-500">₹{dashboardStats.totalProfit.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full opacity-50"></div>
                  </div>
                </div>

                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                      <Users size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Clients</p>
                      <p className="text-2xl font-black text-white">{dashboardStats.totalClients}</p>
                    </div>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-full opacity-50"></div>
                  </div>
                </div>

                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Quotations</p>
                      <p className="text-2xl font-black text-white">{dashboardStats.totalQuotes}</p>
                    </div>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-full opacity-50"></div>
                  </div>
                </div>

                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Avg. Ticket</p>
                      <p className="text-2xl font-black text-white">
                        ₹{dashboardStats.totalQuotes > 0 ? Math.round(dashboardStats.totalRevenue / dashboardStats.totalQuotes).toLocaleString() : 0}
                      </p>
                    </div>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 w-full opacity-50"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Top Services */}
                <div className="lg:col-span-1 bg-zinc-900/50 p-8 rounded-4xl border border-zinc-800">
                  <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Briefcase size={18} className="text-white" /> Popular Services
                  </h3>
                  <div className="space-y-4">
                    {dashboardStats.topServices.map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-2xl">
                        <div>
                          <p className="font-bold text-white text-sm">{s.name}</p>
                          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{s.count} Sales</p>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-800 text-xs font-black text-zinc-400">
                          #{i + 1}
                        </div>
                      </div>
                    ))}
                    {dashboardStats.topServices.length === 0 && (
                      <p className="text-center py-8 text-zinc-600 text-sm italic">No sales data yet</p>
                    )}
                  </div>
                </div>

                {/* Client Management */}
                <div className="lg:col-span-2 bg-zinc-900/50 p-8 rounded-4xl border border-zinc-800">
                  <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Users size={18} className="text-white" /> Client Management
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-zinc-800">
                          <th className="pb-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Client / Business</th>
                          <th className="pb-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">Quotes</th>
                          <th className="pb-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Total Revenue</th>
                          <th className="pb-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Last Interaction</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {dashboardStats.clients.map((c, i) => (
                          <tr key={i} className="group hover:bg-white/5 transition-colors">
                            <td className="py-4">
                              <p className="font-bold text-white text-sm">{c.business || c.name}</p>
                              <p className="text-xs text-zinc-500">{c.name}</p>
                            </td>
                            <td className="py-4 text-center">
                              <span className="px-2 py-1 rounded-lg bg-zinc-800 text-[10px] font-black text-zinc-400">{c.count}</span>
                            </td>
                            <td className="py-4 text-right font-black text-sm text-emerald-500">
                              ₹{c.totalSpent.toLocaleString()}
                            </td>
                            <td className="py-4 text-right text-xs text-zinc-500">
                              {format(new Date(c.lastDate), 'MMM dd, yyyy')}
                            </td>
                          </tr>
                        ))}
                        {dashboardStats.clients.length === 0 && (
                          <tr>
                            <td colSpan={4} className="text-center py-12 text-zinc-600 text-sm italic">No clients found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'create' && (
            <motion.div 
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Client Details */}
              <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-4xl shadow-2xl border border-zinc-800">
                <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                  <LayoutDashboard size={18} className="text-white" /> Client Information
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Client Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe"
                      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-white/20 transition-all placeholder:text-zinc-600"
                      value={client.name}
                      onChange={e => setClient({...client, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Business Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Acme Corp"
                      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-white/20 transition-all placeholder:text-zinc-600"
                      value={client.businessName}
                      onChange={e => setClient({...client, businessName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">WhatsApp Number</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. 9876543210"
                      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-white/20 transition-all placeholder:text-zinc-600"
                      value={client.phoneNumber}
                      onChange={e => setClient({...client, phoneNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Business Type</label>
                    <select 
                      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-white/20 transition-all appearance-none cursor-pointer"
                      value={client.businessType}
                      onChange={e => setClient({...client, businessType: e.target.value})}
                    >
                      <option value="" className="bg-zinc-900">Select Type</option>
                      <option value="E-commerce" className="bg-zinc-900">E-commerce</option>
                      <option value="Real Estate" className="bg-zinc-900">Real Estate</option>
                      <option value="Education" className="bg-zinc-900">Education</option>
                      <option value="Healthcare" className="bg-zinc-900">Healthcare</option>
                      <option value="Local Business" className="bg-zinc-900">Local Business</option>
                      <option value="Other" className="bg-zinc-900">Other (Custom)</option>
                    </select>
                    {client.businessType === 'Other' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 space-y-2"
                      >
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Specify Business Type</label>
                        <input 
                          type="text" 
                          placeholder="e.g. SaaS Startup"
                          className="w-full bg-zinc-800/50 border border-zinc-700 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-white/20 transition-all placeholder:text-zinc-600"
                          value={customBusinessType}
                          onChange={e => setCustomBusinessType(e.target.value)}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              </section>

              {/* Service Selection */}
              <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-4xl shadow-2xl border border-zinc-800 flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Receipt size={18} className="text-white" /> Service Selection
                  </h3>
                  <button 
                    onClick={handleAddCustomService}
                    className="text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1"
                    style={{ color: agencySettings.brandColor }}
                  >
                    <Plus size={14} /> Add Custom
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto max-h-[500px] space-y-8 pr-4 scrollbar-hide">
                  {Object.entries(
                    masterServices.reduce((acc, service) => {
                      if (!acc[service.category]) acc[service.category] = [];
                      acc[service.category].push(service);
                      return acc;
                    }, {} as Record<string, Service[]>)
                  ).map(([category, services]) => (
                    <div key={category}>
                      <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4 ml-1">{category}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {services.map(service => (
                          <button 
                            key={service.id}
                            onClick={() => handleServiceToggle(service)}
                            className={cn(
                              "text-left p-4 rounded-2xl border transition-all group relative overflow-hidden",
                              selectedServices.some(s => s.id.startsWith(service.id))
                                ? "bg-white border-white text-zinc-950 shadow-xl" 
                                : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-500 text-zinc-400"
                            )}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-xs leading-tight">{service.name}</span>
                              <CheckCircle2 
                                size={14} 
                                className={cn(
                                  "transition-all",
                                  selectedServices.some(s => s.id.startsWith(service.id)) ? "scale-110" : "text-zinc-700"
                                )} 
                                style={{ color: selectedServices.some(s => s.id.startsWith(service.id)) ? agencySettings.brandColor : undefined }}
                              />
                            </div>
                            <p className={cn("text-[10px] font-bold", selectedServices.some(s => s.id.startsWith(service.id)) ? "text-zinc-600" : "text-zinc-500")}>₹{service.price}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-zinc-800">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Selected & Custom Summary</h4>
                  </div>

                  <div className="space-y-3 mb-8">
                    {selectedServices.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
                        <Receipt size={32} className="text-zinc-800 mb-2" />
                        <p className="text-[10px] text-zinc-500 font-medium italic">No services selected yet</p>
                      </div>
                    ) : (
                      selectedServices.map(service => (
                        <div key={service.id} className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700 group relative shadow-xl">
                          <button 
                            onClick={() => handleRemoveService(service.id)}
                            className="absolute -top-2 -right-2 p-1.5 bg-red-900/50 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-900 shadow-xl"
                          >
                            <Trash2 size={12} />
                          </button>
                          <div className="space-y-2">
                            <input 
                              type="text"
                              value={service.name}
                              onChange={e => handleUpdateService(service.id, { name: e.target.value })}
                              className="w-full bg-transparent font-bold text-xs focus:outline-none text-white"
                              placeholder="Service Name"
                            />
                            <textarea 
                              value={service.description}
                              onChange={e => handleUpdateService(service.id, { description: e.target.value })}
                              className="w-full bg-transparent text-[10px] text-zinc-400 focus:outline-none resize-none leading-relaxed"
                              rows={1}
                              placeholder="Description"
                            />
                            <div className="grid grid-cols-5 gap-4">
                              <div className="space-y-1">
                                <label className="text-[8px] font-bold text-zinc-600 uppercase">Cost (₹)</label>
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] font-bold text-zinc-600">₹</span>
                                  <input 
                                    type="number"
                                    value={service.cost || 0}
                                    onChange={e => handleUpdateService(service.id, { cost: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-transparent font-black text-xs focus:outline-none text-white"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[8px] font-bold text-zinc-600 uppercase">Profit (₹)</label>
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] font-bold text-zinc-600">₹</span>
                                  <input 
                                    type="number"
                                    value={service.profit || 0}
                                    onChange={e => handleUpdateService(service.id, { profit: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-transparent font-black text-xs focus:outline-none text-emerald-500"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[8px] font-bold text-zinc-600 uppercase">Price</label>
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] font-bold text-zinc-600">₹</span>
                                  <div className="w-full bg-transparent font-black text-xs text-white">
                                    {service.price}
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[8px] font-bold text-zinc-600 uppercase">Qty</label>
                                <input 
                                  type="number"
                                  min="1"
                                  value={service.quantity || 1}
                                  onChange={e => handleUpdateService(service.id, { quantity: parseInt(e.target.value) || 1 })}
                                  className="w-full bg-transparent font-black text-xs focus:outline-none text-white"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[8px] font-bold text-zinc-600 uppercase">Duration</label>
                                <input 
                                  type="text"
                                  value={service.duration}
                                  onChange={e => handleUpdateService(service.id, { duration: e.target.value })}
                                  className="w-full bg-transparent font-black text-xs focus:outline-none text-white"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="space-y-6 pt-6 border-t border-zinc-800">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Subtotal</span>
                      <span className="text-xl font-black text-white tracking-tight">₹{totalPrice}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Discount</label>
                          <div className="flex bg-zinc-800 p-0.5 rounded-xl">
                            <button 
                              onClick={() => setDiscountType('fixed')}
                              className={cn("px-3 py-1 text-[10px] font-bold rounded-lg transition-all", discountType === 'fixed' ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-500")}
                            >
                              ₹
                            </button>
                            <button 
                              onClick={() => setDiscountType('percent')}
                              className={cn("px-3 py-1 text-[10px] font-bold rounded-lg transition-all", discountType === 'percent' ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-500")}
                            >
                              %
                            </button>
                          </div>
                        </div>
                        <input 
                          type="number" 
                          className="w-full bg-zinc-800/50 border border-zinc-700 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-white transition-all"
                          value={discount}
                          onChange={e => setDiscount(parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Final Price</label>
                        <div className="w-full bg-white text-zinc-950 rounded-2xl px-4 py-3 text-sm font-black flex items-center justify-center shadow-2xl">₹{finalPrice}</div>
                      </div>
                    </div>

                    <button 
                      onClick={generateQuotation}
                      className="w-full text-white py-5 rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center gap-2 group"
                      style={{ 
                        backgroundColor: agencySettings.brandColor,
                        boxShadow: `0 10px 15px -3px rgba(${hexToRgb(agencySettings.brandColor)}, 0.2)`
                      }}
                    >
                      Generate Quotation 
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-black tracking-tighter mb-2 text-white">History</h2>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Manage your past quotations and invoices</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {history.length === 0 ? (
                  <div className="col-span-full py-32 text-center bg-zinc-900/50 border border-zinc-800 rounded-4xl">
                    <div className="inline-flex p-6 rounded-full bg-zinc-800 mb-6">
                      <History size={40} className="text-zinc-600" />
                    </div>
                    <p className="text-zinc-500 font-medium">No quotations generated yet.</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <motion.div 
                      layout
                      key={item.id}
                      className="group bg-zinc-900/50 backdrop-blur-sm p-8 rounded-4xl border border-zinc-800 hover:border-zinc-600 transition-all cursor-pointer shadow-2xl"
                      onClick={() => {
                        setCurrentQuotation(item);
                        setActiveTab('preview');
                      }}
                    >
                      <div className="flex justify-between items-start mb-8">
                        <div className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest" style={{ 
                          backgroundColor: item.status === 'confirmed' ? 'rgba(16, 185, 129, 0.1)' : `${agencySettings.brandColor}1A`, 
                          color: item.status === 'confirmed' ? '#10b981' : agencySettings.brandColor 
                        }}>
                          {item.status === 'confirmed' ? 'Confirmed' : item.status}
                        </div>
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                          {format(new Date(item.date), 'MMM dd, yyyy')}
                        </span>
                      </div>

                      <div className="space-y-1 mb-8">
                        <h3 className="text-xl font-black text-white tracking-tight leading-none">{item.client.businessName}</h3>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{item.client.name}</p>
                      </div>

                      <div className="flex justify-between items-end pt-8 border-t border-zinc-800">
                        <div>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Amount</p>
                          <p className="text-2xl font-black text-white tracking-tighter">₹{item.finalPrice.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          {item.status !== 'confirmed' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConfirmQuotation(item.id);
                              }}
                              className="p-3 bg-zinc-800 text-emerald-400 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all"
                              title="Confirm Quotation"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuotation(item.id);
                            }}
                            className="p-3 bg-zinc-800 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'preview' && currentQuotation && (
            <motion.div 
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8"
            >
              {/* Document Preview */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <div className="flex items-center gap-4 mb-4 print:hidden">
                  <button 
                    onClick={() => setActiveTab('create')}
                    className="p-3 bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 md:hidden text-white"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="flex bg-zinc-900 p-1.5 rounded-2xl shadow-xl border border-zinc-800 w-fit">
                    <button 
                      onClick={() => setDocType('quotation')}
                      className={cn("px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all")}
                      style={{ 
                        backgroundColor: docType === 'quotation' ? agencySettings.brandColor : 'transparent',
                        color: docType === 'quotation' ? '#ffffff' : '#52525b',
                        boxShadow: docType === 'quotation' ? `0 10px 15px -3px rgba(${hexToRgb(agencySettings.brandColor)}, 0.1)` : 'none'
                      }}
                    >
                      Quotation
                    </button>
                    <button 
                      onClick={() => setDocType('invoice')}
                      className={cn("px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all")}
                      style={{ 
                        backgroundColor: docType === 'invoice' ? agencySettings.brandColor : 'transparent',
                        color: docType === 'invoice' ? '#ffffff' : '#52525b',
                        boxShadow: docType === 'invoice' ? `0 10px 15px -3px rgba(${hexToRgb(agencySettings.brandColor)}, 0.1)` : 'none'
                      }}
                    >
                      Invoice
                    </button>
                  </div>

                  <div className="flex bg-zinc-900 p-1.5 rounded-2xl shadow-xl border border-zinc-800 w-fit">
                    <button 
                      onClick={() => setPreviewMode('design')}
                      className={cn("px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2")}
                      style={{ 
                        backgroundColor: previewMode === 'design' ? agencySettings.brandColor : 'transparent',
                        color: previewMode === 'design' ? '#ffffff' : '#52525b'
                      }}
                    >
                      <LayoutDashboard size={14} /> Design
                    </button>
                    <button 
                      onClick={() => setPreviewMode('pdf')}
                      className={cn("px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2")}
                      style={{ 
                        backgroundColor: previewMode === 'pdf' ? agencySettings.brandColor : 'transparent',
                        color: previewMode === 'pdf' ? '#ffffff' : '#52525b'
                      }}
                    >
                      <FileText size={14} /> PDF Preview
                    </button>
                  </div>
                </div>

                <div className="relative min-h-[600px] sm:min-h-[1000px]">
                  {/* HTML Preview (Hidden but rendered for PDF generation) */}
                  <div 
                    className={cn(
                      "bg-white p-4 sm:p-12 md:p-16 rounded-2xl sm:rounded-5xl shadow-2xl border border-zinc-100 min-h-[600px] sm:min-h-[1000px] relative overflow-hidden print:shadow-none print:border-none print:p-0 transition-all duration-300 pdf-source-container",
                      previewMode === 'pdf' ? "opacity-0 pointer-events-none absolute inset-0 -z-10" : "opacity-100"
                    )} 
                    ref={quotationRef}
                  >
                  {/* Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08] rotate-[-30deg]">
                    <span className="text-[120px] font-black uppercase tracking-[0.5em] whitespace-nowrap">{agencySettings.agencyName}</span>
                  </div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-16">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          {agencySettings.logo ? (
                            <img src={agencySettings.logo} alt="Logo" className="h-12 w-auto object-contain" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: agencySettings.brandColor }}>
                              <BrainCircuit size={24} />
                            </div>
                          )}
                          <span className="text-xl font-black tracking-tighter" style={{ color: agencySettings.brandColor }}>{agencySettings.agencyName}</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter mb-2 text-zinc-900">{docType}</h2>
                        <p className="text-zinc-400 font-mono text-xs sm:text-sm tracking-widest">#{docType === 'quotation' ? currentQuotation.id : currentQuotation.id.replace('QT', 'INV')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2 tracking-[0.2em]">Issued By</p>
                        <h3 className="font-black text-lg sm:text-xl text-zinc-900">{agencySettings.agencyName}</h3>
                        <p className="text-xs sm:text-sm text-zinc-500">Premium Marketing Solutions</p>
                        <p className="text-xs sm:text-sm text-zinc-500">contact@digitaank.ai</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 mb-16 p-5 sm:p-8 bg-zinc-50 rounded-2xl sm:rounded-4xl border border-zinc-100">
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase mb-3 tracking-[0.2em]">{docType === 'quotation' ? 'Prepared For' : 'Bill To'}</p>
                        <p className="font-black text-lg sm:text-xl text-zinc-900 mb-1">{currentQuotation.client.name}</p>
                        <p className="text-sm sm:text-base font-bold text-zinc-600 mb-1">{currentQuotation.client.businessName}</p>
                        <p className="text-xs sm:text-sm text-zinc-400">{currentQuotation.client.phoneNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase mb-3 tracking-[0.2em]">Date & Timeline</p>
                        <p className="font-black text-sm sm:text-base text-zinc-900 mb-1">{format(new Date(currentQuotation.date), 'dd MMMM yyyy')}</p>
                        <p className="text-xs sm:text-sm text-zinc-400">Valid for 15 days</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto mb-16 -mx-4 sm:mx-0 px-4 sm:px-0">
                      <table className="w-full min-w-full sm:min-w-[600px]">
                        <thead>
                          <tr className="border-b-4" style={{ borderColor: agencySettings.brandColor }}>
                            <th className="text-left py-6 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Service Details</th>
                            <th className="text-center py-6 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Duration</th>
                            <th className="text-center py-6 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Qty</th>
                            <th className="text-right py-6 pr-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {currentQuotation.services.map((s, i) => (
                            <tr key={i}>
                              <td className="py-8 pr-8">
                                <p className="font-black text-sm sm:text-base text-zinc-900 mb-2">{s.name}</p>
                                <p className="text-[10px] sm:text-xs text-zinc-500 leading-relaxed max-w-xl">{s.description}</p>
                              </td>
                              <td className="py-8 text-center font-bold text-xs sm:text-sm text-zinc-600 whitespace-nowrap">{s.duration || 'N/A'}</td>
                              <td className="py-8 text-center font-bold text-xs sm:text-sm text-zinc-600 whitespace-nowrap">{s.quantity || 1}</td>
                              <td className="py-8 pr-4 text-right font-black text-sm sm:text-base text-zinc-900 whitespace-nowrap">₹{(s.price * (s.quantity || 1)).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end mb-20 pr-0 sm:pr-4">
                      <div className="w-full sm:w-80 space-y-4 p-5 sm:p-8 rounded-2xl sm:rounded-4xl text-white shadow-2xl" style={{ backgroundColor: agencySettings.brandColor, boxShadow: `0 25px 50px -12px ${agencySettings.brandColor}33` }}>
                        <div className="flex justify-between text-white/60 text-xs font-bold uppercase tracking-widest">
                          <span>Subtotal</span>
                          <span>₹{currentQuotation.totalPrice.toLocaleString()}</span>
                        </div>
                        {currentQuotation.discount > 0 && (
                          <div className="flex justify-between text-white/80 text-xs font-bold uppercase tracking-widest">
                            <span>Discount</span>
                            <span>-₹{currentQuotation.discount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                          <span className="font-black uppercase text-xs sm:text-sm tracking-widest">Total Due</span>
                          <span className="text-xl sm:text-2xl font-black tracking-tighter">₹{currentQuotation.finalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {docType === 'quotation' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-zinc-100">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-zinc-900">Maintenance Policy</h4>
                          <p className="text-xs text-zinc-600 leading-relaxed">{currentQuotation.maintenancePolicy}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-zinc-900">Payment Terms</h4>
                          <p className="text-xs text-zinc-600 leading-relaxed">{currentQuotation.paymentTerms}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-12 border-t border-zinc-100">
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-zinc-900">Payment Instructions</h4>
                        <p className="text-sm text-zinc-600 mb-2">Please transfer the amount to the following bank account:</p>
                        <div className="bg-zinc-50 p-4 rounded-2xl text-sm space-y-1 border border-zinc-100">
                          <p><span className="font-bold text-zinc-900">Bank Name:</span> HDFC Bank</p>
                          <p><span className="font-bold text-zinc-900">Account Holder:</span> {agencySettings.agencyName} Services</p>
                          <p><span className="font-bold text-zinc-900">Account Number:</span> 50100234567890</p>
                          <p><span className="font-bold text-zinc-900">IFSC Code:</span> HDFC0001234</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* PDF Preview Iframe */}
                {previewMode === 'pdf' && (
                  <div className="absolute inset-0 bg-zinc-900 rounded-2xl sm:rounded-5xl overflow-hidden border border-zinc-800 shadow-2xl">
                    {isGeneratingPDF ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
                        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Generating PDF Preview...</p>
                      </div>
                    ) : pdfPreviewUrl ? (
                      <iframe 
                        src={pdfPreviewUrl} 
                        className="w-full h-full border-none"
                        title="PDF Preview"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Failed to load preview</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

                {/* AI Proposal Section */}
                {proposalText && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900/50 backdrop-blur-sm p-6 sm:p-8 md:p-12 rounded-3xl sm:rounded-5xl shadow-2xl border border-zinc-800"
                  >
                    <h2 className="text-2xl font-black mb-8 flex items-center gap-3 tracking-tighter text-white">
                      <BrainCircuit style={{ color: agencySettings.brandColor }} size={28} /> AI Generated Proposal
                    </h2>
                    <div className="prose prose-invert prose-zinc max-w-none">
                      <ReactMarkdown>{proposalText}</ReactMarkdown>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Actions Sidebar */}
              <div className="space-y-6 print:hidden">
                <section className="bg-zinc-900/50 backdrop-blur-sm p-5 sm:p-8 rounded-2xl sm:rounded-4xl shadow-2xl border border-zinc-800">
                  <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-6">PDF Page Setup</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Orientation</span>
                      <div className="flex bg-zinc-800 p-1 rounded-xl">
                        <button 
                          onClick={() => setPdfSettings({...pdfSettings, orientation: 'p'})}
                          className={cn("px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1", pdfSettings.orientation === 'p' ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-500")}
                        >
                          Portrait
                        </button>
                        <button 
                          onClick={() => setPdfSettings({...pdfSettings, orientation: 'l'})}
                          className={cn("px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1", pdfSettings.orientation === 'l' ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-500")}
                        >
                          Landscape
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Format</span>
                      <select 
                        value={pdfSettings.format}
                        onChange={(e) => setPdfSettings({...pdfSettings, format: e.target.value as any})}
                        className="bg-zinc-800 border-none rounded-xl px-3 py-1.5 text-[10px] font-bold text-white focus:ring-1 focus:ring-white outline-none cursor-pointer"
                      >
                        <option value="a4" className="bg-zinc-900">A4</option>
                        <option value="letter" className="bg-zinc-900">Letter</option>
                        <option value="legal" className="bg-zinc-900">Legal</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Quality</span>
                      <div className="flex bg-zinc-800 p-1 rounded-xl">
                        {[1, 2, 3].map(s => (
                          <button 
                            key={s}
                            onClick={() => setPdfSettings({...pdfSettings, scale: s})}
                            className={cn("px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all", pdfSettings.scale === s ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-500")}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-zinc-900/50 backdrop-blur-sm p-5 sm:p-8 rounded-2xl sm:rounded-4xl shadow-2xl border border-zinc-800">
                  <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-6">Quick Actions</h3>
                  <div className="space-y-4">
                    {currentQuotation.status !== 'confirmed' && (
                      <button 
                        onClick={() => handleConfirmQuotation(currentQuotation.id)}
                        className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-bold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-emerald-500/20"
                      >
                        <CheckCircle2 size={18} /> Confirm Quotation
                      </button>
                    )}
                    <button 
                      onClick={handleSharePDF}
                      disabled={isGeneratingPDF}
                      className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-2xl"
                    >
                      <Share2 size={18} /> {isGeneratingPDF ? "Preparing..." : "Send PDF to WhatsApp"}
                    </button>
                    <button 
                      onClick={handleGenerateProposal}
                      disabled={isGeneratingProposal}
                      className="w-full text-white py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-2xl"
                      style={{ 
                        backgroundColor: agencySettings.brandColor,
                        boxShadow: `0 20px 40px -10px rgba(${hexToRgb(agencySettings.brandColor)}, 0.3)`
                      }}
                    >
                      {isGeneratingProposal ? "Generating..." : "Generate AI Proposal"}
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={handleDownloadPDF}
                        disabled={isGeneratingPDF}
                        className="bg-zinc-800 text-zinc-400 py-4 rounded-2xl font-bold hover:bg-zinc-700 hover:text-white transition-all flex items-center justify-center gap-2 text-xs border border-zinc-700"
                      >
                        <Download size={16} /> {isGeneratingPDF ? "..." : "PDF"}
                      </button>
                      <button 
                        onClick={handlePrint}
                        className="bg-zinc-800 text-zinc-400 py-4 rounded-2xl font-bold hover:bg-zinc-700 hover:text-white transition-all flex items-center justify-center gap-2 text-xs border border-zinc-700"
                      >
                        <Printer size={16} /> Print
                      </button>
                    </div>
                  </div>
                </section>

                {/* Profit Calculator (Internal Only) */}
                <section className="bg-zinc-900/50 backdrop-blur-sm p-5 sm:p-8 rounded-2xl sm:rounded-4xl shadow-2xl border border-zinc-800">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Profit Calculator</h3>
                    <div className="px-2 py-0.5 bg-emerald-500/10 rounded-full">
                      <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Internal Only</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {currentQuotation.services.map((s, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[10px]">
                          <span className="text-zinc-500 truncate max-w-[120px]">{s.name}</span>
                          <div className="flex gap-4">
                            <span className="text-zinc-400">Cost: ₹{((s.cost || 0) * (s.quantity || 1)).toLocaleString()}</span>
                            <span className="text-emerald-500 font-bold">Profit: ₹{((s.price - (s.cost || 0)) * (s.quantity || 1)).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t border-zinc-800 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Revenue</span>
                        <span className="text-xs font-bold text-white">₹{currentQuotation.finalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Cost</span>
                        <span className="text-xs font-bold text-red-400">₹{(currentQuotation.finalPrice - (currentQuotation.totalProfit || 0)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Net Profit</span>
                        <span className="text-lg font-black text-emerald-500">₹{(currentQuotation.totalProfit || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Profit Margin</span>
                        <span className="text-xs font-bold text-emerald-500">
                          {currentQuotation.finalPrice > 0 
                            ? ((currentQuotation.totalProfit || 0) / currentQuotation.finalPrice * 100).toFixed(1) 
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Negotiation AI */}
                <section className="bg-zinc-900 text-white p-8 rounded-4xl shadow-2xl shadow-zinc-900/20">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <BrainCircuit size={20} className="text-primary-400" /> Deal Strategy
                  </h3>
                  <p className="text-[10px] text-zinc-400 mb-8 leading-relaxed">Enter client budget to get an AI-optimized deal strategy.</p>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Client Budget (₹)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 10000"
                        className="w-full bg-zinc-800 border-none rounded-2xl px-5 py-4 text-white transition-all placeholder:text-zinc-600 text-sm focus:ring-2"
                        style={{ '--tw-ring-color': agencySettings.brandColor } as any}
                        value={clientBudget}
                        onChange={e => setClientBudget(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={handleNegotiate}
                      disabled={isNegotiating || !clientBudget}
                      className="w-full bg-white text-zinc-900 py-4 rounded-2xl font-bold hover:bg-zinc-100 transition-all disabled:opacity-50 shadow-lg shadow-white/5"
                    >
                      {isNegotiating ? "Analyzing..." : "Get AI Strategy"}
                    </button>
                  </div>

                  {negotiation && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-8 pt-8 border-t border-zinc-800 space-y-6"
                    >
                      <div className="bg-zinc-800 p-5 rounded-3xl border" style={{ borderColor: `${agencySettings.brandColor}4D` }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: agencySettings.brandColor }}>Suggested Price</p>
                        <p className="text-2xl font-black tracking-tighter">₹{negotiation.revisedPrice}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Reasoning</p>
                        <p className="text-xs text-zinc-300 leading-relaxed">{negotiation.reasoning}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Suggested Changes</p>
                        <p className="text-xs text-zinc-300 leading-relaxed italic border-l-2 pl-3" style={{ borderColor: `${agencySettings.brandColor}80` }}>"{negotiation.suggestedChanges}"</p>
                      </div>
                      <button 
                        onClick={() => {
                          setDiscount(totalPrice - negotiation.revisedPrice);
                          setCurrentQuotation({
                            ...currentQuotation,
                            discount: totalPrice - negotiation.revisedPrice,
                            finalPrice: negotiation.revisedPrice
                          });
                          setNegotiation(null);
                        }}
                        className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20"
                      >
                        Apply Suggestion
                      </button>
                    </motion.div>
                  )}
                </section>

                <section className="bg-white p-8 rounded-4xl shadow-sm border border-zinc-100">
                  <div className="flex items-center gap-3 text-emerald-500 mb-3">
                    <CheckCircle2 size={20} />
                    <span className="text-xs font-black uppercase tracking-widest">Deal Closer Tip</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">Clients are 40% more likely to close if you follow up within 2 hours of sending the proposal.</p>
                </section>
              </div>
            </motion.div>
          )}
          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-black tracking-tighter mb-2">Service Manager</h2>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Modify your master service list and charges</p>
                </div>
                <button 
                  onClick={handleResetServices}
                  className="text-[10px] font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-all border-b border-transparent hover:border-red-600 pb-1"
                >
                  Reset to Defaults
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Branding Settings */}
                <section className="lg:col-span-1 space-y-8">
                  <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-4xl shadow-2xl border border-zinc-800">
                    <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-8 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Monitor size={18} className="text-white" /> Agency Branding
                      </div>
                      <span className="text-[10px] font-bold text-emerald-500 normal-case tracking-normal">Saved automatically</span>
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Agency Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. DigiTaank Digital"
                          className="w-full bg-zinc-800/50 border border-zinc-700 rounded-2xl px-5 py-4 text-sm text-white transition-all placeholder:text-zinc-600 focus:ring-2"
                          style={{ '--tw-ring-color': agencySettings.brandColor } as any}
                          value={agencySettings.agencyName}
                          onChange={e => setAgencySettings({...agencySettings, agencyName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Brand Color</label>
                        <div className="flex gap-3">
                          <input 
                            type="color" 
                            className="w-12 h-12 rounded-xl border-none cursor-pointer bg-transparent"
                            value={agencySettings.brandColor}
                            onChange={e => setAgencySettings({...agencySettings, brandColor: e.target.value})}
                          />
                          <input 
                            type="text" 
                            className="flex-1 bg-zinc-800/50 border border-zinc-700 rounded-2xl px-5 py-4 text-sm font-mono text-white focus:ring-2 transition-all"
                            style={{ '--tw-ring-color': agencySettings.brandColor } as any}
                            value={agencySettings.brandColor}
                            onChange={e => setAgencySettings({...agencySettings, brandColor: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Agency Logo</label>
                        <div className="relative group">
                          <div className="w-full h-32 bg-zinc-800/50 rounded-2xl border-2 border-dashed border-zinc-700 flex items-center justify-center overflow-hidden">
                            {agencySettings.logo ? (
                              <img src={agencySettings.logo} alt="Logo" className="max-h-full max-w-full object-contain" />
                            ) : (
                              <div className="text-center">
                                <Plus size={24} className="mx-auto text-zinc-700 mb-2" />
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Upload Logo</p>
                              </div>
                            )}
                          </div>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          {agencySettings.logo && (
                            <button 
                              onClick={() => setAgencySettings({...agencySettings, logo: null})}
                              className="absolute top-2 right-2 p-1.5 bg-zinc-800 shadow-md rounded-lg text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="pt-8 border-t border-zinc-800 space-y-4">
                        <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <Cloud size={14} className="text-white" /> Data Management
                        </h4>
                        <button 
                          onClick={async () => {
                            if (confirm("Are you sure you want to clear all quotation history? This will also remove data from Supabase.")) {
                              await supabase.from('quotations').delete().eq('user_id', session.user.id);
                              setHistory([]);
                            }
                          }}
                          className="w-full py-3 rounded-2xl border border-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all flex items-center justify-center gap-2"
                        >
                          <Trash2 size={14} /> Clear History
                        </button>
                        <button 
                          onClick={async () => {
                            if (confirm("Factory reset will clear all settings, services, and history. Continue?")) {
                              await supabase.from('quotations').delete().eq('user_id', session.user.id);
                              await supabase.from('master_services').delete().eq('user_id', session.user.id);
                              await supabase.from('profiles').delete().eq('id', session.user.id);
                              localStorage.clear();
                              window.location.reload();
                            }
                          }}
                          className="w-full py-3 rounded-2xl border border-zinc-800 text-zinc-500 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                        >
                          <AlertCircle size={14} /> Factory Reset
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-4xl shadow-2xl border border-zinc-800">
                    <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                      <Plus size={18} className="text-white" /> Add New Service
                    </h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Category</label>
                      <div className="space-y-3">
                        <select 
                          className="w-full bg-zinc-800/50 border border-zinc-700 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 transition-all appearance-none cursor-pointer"
                          style={{ '--tw-ring-color': agencySettings.brandColor } as any}
                          value={categories.includes(newMasterService.category || '') ? newMasterService.category : 'custom'}
                          onChange={e => {
                            if (e.target.value === 'custom') {
                              setNewMasterService({...newMasterService, category: ''});
                            } else {
                              setNewMasterService({...newMasterService, category: e.target.value});
                            }
                          }}
                        >
                          <option value="custom" className="bg-zinc-900">Add New Category...</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>
                          ))}
                        </select>
                        
                        {(!categories.includes(newMasterService.category || '') || newMasterService.category === '') && (
                          <input 
                            type="text" 
                            placeholder="Type new category name..."
                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 transition-all placeholder:text-zinc-600 animate-in fade-in slide-in-from-top-2 duration-200"
                            style={{ '--tw-ring-color': agencySettings.brandColor } as any}
                            value={newMasterService.category}
                            onChange={e => setNewMasterService({...newMasterService, category: e.target.value})}
                          />
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Service Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Basic Setup"
                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 transition-all placeholder:text-zinc-600"
                        style={{ '--tw-ring-color': agencySettings.brandColor } as any}
                        value={newMasterService.name}
                        onChange={e => setNewMasterService({...newMasterService, name: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Cost (₹)</label>
                        <input 
                          type="number" 
                          placeholder="0"
                          className="w-full bg-zinc-800/50 border border-zinc-700 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:ring-2 transition-all placeholder:text-zinc-600"
                          style={{ '--tw-ring-color': agencySettings.brandColor } as any}
                          value={newMasterService.cost}
                          onChange={e => {
                            const cost = parseInt(e.target.value) || 0;
                            const profit = newMasterService.profit || 0;
                            setNewMasterService({...newMasterService, cost, price: cost + profit});
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Profit (₹)</label>
                        <input 
                          type="number" 
                          placeholder="0"
                          className="w-full bg-zinc-800/50 border border-zinc-700 rounded-2xl px-5 py-4 text-sm font-bold text-emerald-500 focus:ring-2 transition-all placeholder:text-zinc-600"
                          style={{ '--tw-ring-color': agencySettings.brandColor } as any}
                          value={newMasterService.profit}
                          onChange={e => {
                            const profit = parseInt(e.target.value) || 0;
                            const cost = newMasterService.cost || 0;
                            setNewMasterService({...newMasterService, profit, price: cost + profit});
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Final Price (₹)</label>
                        <div className="w-full bg-zinc-800/20 border border-zinc-800 rounded-2xl px-5 py-4 text-sm font-black text-white flex items-center">
                          ₹{(newMasterService.price || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Duration</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 1 Month"
                          className="w-full bg-zinc-800/50 border border-zinc-700 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 transition-all placeholder:text-zinc-600"
                          style={{ '--tw-ring-color': agencySettings.brandColor } as any}
                          value={newMasterService.duration}
                          onChange={e => setNewMasterService({...newMasterService, duration: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Description</label>
                      <textarea 
                        placeholder="What's included in this service?"
                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 transition-all resize-none placeholder:text-zinc-600"
                        style={{ '--tw-ring-color': agencySettings.brandColor } as any}
                        rows={3}
                        value={newMasterService.description}
                        onChange={e => setNewMasterService({...newMasterService, description: e.target.value})}
                      />
                    </div>
                    <button 
                      onClick={handleAddMasterService}
                      disabled={!newMasterService.name || !newMasterService.category}
                      className="w-full text-white py-5 rounded-2xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-2xl"
                      style={{ backgroundColor: agencySettings.brandColor }}
                    >
                      <Plus size={18} /> Add to Master List
                    </button>
                  </div>
                </div>
              </section>

                {/* Master List */}
                <section className="lg:col-span-2 space-y-8">
                  {Object.entries(
                    masterServices.reduce((acc, service) => {
                      if (!acc[service.category]) acc[service.category] = [];
                      acc[service.category].push(service);
                      return acc;
                    }, {} as Record<string, Service[]>)
                  ).map(([category, services]) => (
                    <div key={category} className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-4xl shadow-2xl border border-zinc-800">
                      <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-8 border-b border-zinc-800 pb-4">{category}</h3>
                      <div className="space-y-6">
                        {services.map(service => (
                          <div key={service.id} className="group relative bg-zinc-800/50 p-6 rounded-3xl border border-zinc-700 hover:border-zinc-500 transition-all">
                            <div className="flex justify-between items-start mb-4">
                              {editingMasterServiceId === service.id ? (
                                <input 
                                  type="text"
                                  value={service.name}
                                  onChange={e => handleUpdateMasterService(service.id, { name: e.target.value })}
                                  className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 font-bold text-sm text-white focus:ring-2 outline-none"
                                  style={{ '--tw-ring-color': agencySettings.brandColor } as any}
                                />
                              ) : (
                                <h4 className="font-bold text-base text-white">{service.name}</h4>
                              )}
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button 
                                  onClick={() => setEditingMasterServiceId(editingMasterServiceId === service.id ? null : service.id)}
                                  className="p-2 bg-zinc-900 text-zinc-500 rounded-xl hover:text-white hover:shadow-md transition-all"
                                >
                                  {editingMasterServiceId === service.id ? <X size={16} /> : <Edit3 size={16} />}
                                </button>
                                <button 
                                  onClick={() => handleRemoveMasterService(service.id)}
                                  className="p-2 bg-zinc-900 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>

                            {editingMasterServiceId === service.id ? (
                              <div className="space-y-4 mt-4">
                                <textarea 
                                  value={service.description}
                                  onChange={e => handleUpdateMasterService(service.id, { description: e.target.value })}
                                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-xs text-zinc-400 focus:ring-2 outline-none resize-none leading-relaxed"
                                  style={{ '--tw-ring-color': agencySettings.brandColor } as any}
                                  rows={2}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block ml-1">Cost (₹)</label>
                                    <input 
                                      type="number"
                                      value={service.cost || 0}
                                      onChange={e => handleUpdateMasterService(service.id, { cost: parseInt(e.target.value) || 0 })}
                                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 font-black text-xs text-white focus:ring-2 outline-none"
                                      style={{ '--tw-ring-color': agencySettings.brandColor } as any}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block ml-1">Profit (₹)</label>
                                    <input 
                                      type="number"
                                      value={service.profit || 0}
                                      onChange={e => handleUpdateMasterService(service.id, { profit: parseInt(e.target.value) || 0 })}
                                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 font-black text-xs text-white focus:ring-2 outline-none"
                                      style={{ '--tw-ring-color': agencySettings.brandColor } as any}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block ml-1">Final Price (₹)</label>
                                    <input 
                                      type="number"
                                      value={service.price}
                                      readOnly
                                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2 font-black text-xs text-zinc-500 outline-none cursor-not-allowed"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block ml-1">Duration</label>
                                    <input 
                                      type="text"
                                      value={service.duration}
                                      onChange={e => handleUpdateMasterService(service.id, { duration: e.target.value })}
                                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 font-bold text-xs text-white focus:ring-2 outline-none"
                                      style={{ '--tw-ring-color': agencySettings.brandColor } as any}
                                    />
                                  </div>
                                </div>
                                <button 
                                  onClick={() => setEditingMasterServiceId(null)}
                                  className="w-full text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-2xl"
                                  style={{ backgroundColor: agencySettings.brandColor }}
                                >
                                  Save Changes
                                </button>
                              </div>
                            ) : (
                              <>
                                <p className="text-xs text-zinc-500 mb-4 line-clamp-2 leading-relaxed">{service.description}</p>
                                <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                                  <div className="flex flex-col">
                                    <span className="font-black text-lg text-white">₹{service.price.toLocaleString()}</span>
                                    <div className="flex gap-3 mt-1">
                                      <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Cost: ₹{service.cost?.toLocaleString() || 0}</span>
                                      <span className="text-[8px] font-bold text-emerald-500/70 uppercase tracking-widest">Profit: ₹{service.profit?.toLocaleString() || 0}</span>
                                    </div>
                                  </div>
                                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{service.duration}</span>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
