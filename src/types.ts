export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  features: string[];
  duration: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  packages: ServicePackage[];
}

export interface PortfolioProject {
  id: string;
  clientName: string;
  businessType: string;
  thumbnail: string;
  servicesUsed: string[];
  results: string;
  websiteUrl?: string;
  appUrl?: string;
}

export interface Service {
  id: string;
  category: string;
  name: string;
  price: number;
  cost?: number;
  profit?: number;
  quantity?: number;
  duration: string;
  description: string;
}

export interface ClientDetails {
  name: string;
  businessName: string;
  phoneNumber: string;
  businessType: string;
}

export interface Quotation {
  id: string;
  date: string;
  client: ClientDetails;
  services: Service[];
  totalPrice: number;
  discount: number;
  finalPrice: number;
  timeline: string;
  maintenancePolicy: string;
  paymentTerms: string;
  status: 'quotation' | 'proposal' | 'invoice' | 'confirmed';
  totalProfit?: number;
}

export interface NegotiationSuggestion {
  revisedPrice: number;
  reasoning: string;
  suggestedChanges: string;
}

export interface AgencySettings {
  logo: string | null;
  brandColor: string;
  agencyName: string;
  contactEmail: string;
  contactPhone: string;
  location: string;
  whatsappNumber: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  experience: string;
  photo: string;
}

export interface AgencyProduct {
  name: string;
  url: string;
  logo: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface LandingContent {
  services: ServiceCategory[];
  portfolio: PortfolioProject[];
  testimonials: Testimonial[];
  team: TeamMember[];
  partners: string[];
  products: AgencyProduct[];
  settings: AgencySettings;
}
