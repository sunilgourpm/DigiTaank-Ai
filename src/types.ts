export interface Service {
  id: string;
  category: string;
  name: string;
  price: number;
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
  status: 'quotation' | 'proposal' | 'invoice';
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
}
