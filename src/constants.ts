import { Service } from './types';

export const PREDEFINED_SERVICES: Service[] = [
  {
    id: 'meta-ads-basic',
    category: 'Meta Ads',
    name: 'Meta Ads Setup & Management (Basic)',
    price: 15000,
    duration: '1 Month',
    description: 'Setup and management of Facebook & Instagram ads for lead generation or brand awareness.'
  },
  {
    id: 'meta-ads-pro',
    category: 'Meta Ads',
    name: 'Meta Ads Setup & Management (Pro)',
    price: 25000,
    duration: '1 Month',
    description: 'Advanced targeting, A/B testing, and weekly optimization for high-performance campaigns.'
  },
  {
    id: 'gmb-optimization',
    category: 'Google My Business',
    name: 'GMB Optimization & Ranking',
    price: 8000,
    duration: '1 Month',
    description: 'Optimize Google Business Profile to rank higher in local search results.'
  },
  {
    id: 'web-dev-landing',
    category: 'Website Development',
    name: 'Landing Page Development',
    price: 12000,
    duration: '7 Days',
    description: 'High-converting single-page website with mobile responsiveness.'
  },
  {
    id: 'web-dev-business',
    category: 'Website Development',
    name: 'Business Website (5-7 Pages)',
    price: 35000,
    duration: '15 Days',
    description: 'Professional business website with SEO optimization and contact forms.'
  },
  {
    id: 'smm-basic',
    category: 'Social Media Marketing',
    name: 'SMM Starter Pack',
    price: 10000,
    duration: '1 Month',
    description: '12 social media posts per month with basic engagement management.'
  },
  {
    id: 'smm-growth',
    category: 'Social Media Marketing',
    name: 'SMM Growth Pack',
    price: 20000,
    duration: '1 Month',
    description: '20 social media posts, reels, and active community engagement.'
  },
  {
    id: 'maintenance-monthly',
    category: 'Maintenance',
    name: 'Monthly Website Maintenance',
    price: 299,
    duration: '1 Month',
    description: 'Regular backups, security updates, and minor content changes.'
  }
];

export const MAINTENANCE_POLICY = "Website development services include 1 month of free maintenance. After the first month, maintenance cost is ₹299 per month.";
export const PAYMENT_TERMS = "50% Advance, 50% after completion. All payments are non-refundable.";
