import { Service, ServiceCategory, PortfolioProject } from './types';

export const LANDING_SERVICES: ServiceCategory[] = [
  {
    id: 'meta-ads',
    name: 'Meta Ads',
    icon: 'MessageSquare',
    description: 'Targeted advertising on Facebook and Instagram to drive leads and sales.',
    packages: [
      { id: 'meta-basic', name: 'Basic', price: 1200, duration: '15 Days', features: ['Ad Setup', 'Basic Targeting', '1 Ad Set'] },
      { id: 'meta-standard', name: 'Standard', price: 9000, duration: '1 Month', features: ['Ad Management', 'A/B Testing', 'Weekly Reports'] },
      { id: 'meta-premium', name: 'Premium', price: 30000, duration: '3 Months', features: ['Scaling Strategy', 'Custom Funnels', 'Daily Optimization'] }
    ]
  },
  {
    id: 'gmb',
    name: 'Google My Business',
    icon: 'Globe',
    description: 'Optimize your local presence and rank higher on Google Maps.',
    packages: [
      { id: 'gmb-basic', name: 'Setup', price: 5000, duration: '7 Days', features: ['Profile Setup', 'Verification', 'Keyword Optimization'] },
      { id: 'gmb-pro', name: 'Ranking', price: 15000, duration: '1 Month', features: ['Local SEO', 'Review Management', 'Monthly Posts'] }
    ]
  },
  {
    id: 'web-dev',
    name: 'Website Development',
    icon: 'Layout',
    description: 'Custom websites built for performance and conversion.',
    packages: [
      { id: 'web-basic', name: 'Basic', price: 10000, duration: '7 Days', features: ['Single Page', 'Responsive', 'Contact Form'] },
      { id: 'web-business', name: 'Business', price: 20000, duration: '15 Days', features: ['5-7 Pages', 'SEO Ready', 'Speed Optimized'] },
      { id: 'web-app', name: 'Web App', price: 50000, duration: '30+ Days', features: ['Custom Logic', 'Database Integration', 'Admin Panel'] }
    ]
  },
  {
    id: 'smm',
    name: 'Social Media Marketing',
    icon: 'Zap',
    description: 'Engage your audience and build brand loyalty across social platforms.',
    packages: [
      { id: 'smm-starter', name: 'Starter', price: 8000, duration: '1 Month', features: ['12 Posts', 'Basic Engagement', 'Monthly Report'] },
      { id: 'smm-growth', name: 'Growth', price: 18000, duration: '1 Month', features: ['20 Posts', 'Reels Creation', 'Community Management'] }
    ]
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    icon: 'Shield',
    description: 'Keep your digital assets secure, updated, and running smoothly.',
    packages: [
      { id: 'maint-monthly', name: 'Monthly', price: 299, duration: '1 Month', features: ['Security Updates', 'Backups', 'Minor Changes'] }
    ]
  }
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: '1',
    clientName: 'EcoStay Resorts',
    businessType: 'Hospitality',
    thumbnail: 'https://picsum.photos/seed/resort/800/600',
    servicesUsed: ['Website Development', 'Meta Ads'],
    results: '40% increase in direct bookings within 3 months.',
    websiteUrl: 'https://example.com/ecostay'
  },
  {
    id: '2',
    clientName: 'FitFlow Gym',
    businessType: 'Fitness',
    thumbnail: 'https://picsum.photos/seed/gym/800/600',
    servicesUsed: ['GMB Optimization', 'SMM'],
    results: 'Ranked #1 in local search for "Gym near me".',
    websiteUrl: 'https://example.com/fitflow'
  },
  {
    id: '3',
    clientName: 'TechNova Solutions',
    businessType: 'IT Services',
    thumbnail: 'https://picsum.photos/seed/tech/800/600',
    servicesUsed: ['Web App Development'],
    results: 'Automated internal workflow saving 20 hours/week.',
    appUrl: 'https://app.technova.com'
  }
];

export const TEAM_MEMBERS = [
  {
    id: '1',
    name: 'Sunil Gour',
    position: 'Founder & CEO',
    experience: '10+ Years',
    photo: 'https://picsum.photos/seed/founder/400/400'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    position: 'Creative Director',
    experience: '7 Years',
    photo: 'https://picsum.photos/seed/priya/400/400'
  },
  {
    id: '3',
    name: 'Rahul Verma',
    position: 'Head of Performance',
    experience: '8 Years',
    photo: 'https://picsum.photos/seed/rahul/400/400'
  },
  {
    id: '4',
    name: 'Anjali Gupta',
    position: 'Senior Web Developer',
    experience: '6 Years',
    photo: 'https://picsum.photos/seed/anjali/400/400'
  }
];

export const AGENCY_PRODUCTS = [
  {
    name: 'Interntak',
    url: 'https://interntak.com',
    logo: 'https://picsum.photos/seed/interntak/200/200',
    description: 'Connecting talent with opportunities.'
  },
  {
    name: 'CarbonCart',
    url: 'https://carboncart.com',
    logo: 'https://picsum.photos/seed/carboncart/200/200',
    description: 'Next-gen e-commerce solutions.'
  },
  {
    name: 'Tevent App',
    url: 'https://tevent.app',
    logo: 'https://picsum.photos/seed/tevent/200/200',
    description: 'Revolutionizing event management.'
  }
];

export const PARTNER_LOGOS = [
  'https://picsum.photos/seed/p1/200/100',
  'https://picsum.photos/seed/p2/200/100',
  'https://picsum.photos/seed/p3/200/100',
  'https://picsum.photos/seed/p4/200/100',
  'https://picsum.photos/seed/p5/200/100',
  'https://picsum.photos/seed/p6/200/100'
];

export const TESTIMONIALS = [
  {
    id: '1',
    name: 'Amit Singh',
    role: 'Owner, EcoStay Resorts',
    content: 'DigiTaank transformed our online presence. Our direct bookings increased by 40% in just 3 months. Highly professional team!',
    avatar: 'https://picsum.photos/seed/amit/100/100'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    role: 'Marketing Head, TechNova',
    content: 'The web app they built for us is flawless. It has significantly improved our internal efficiency. Great communication throughout.',
    avatar: 'https://picsum.photos/seed/sarah/100/100'
  },
  {
    id: '3',
    name: 'Vikram Rathore',
    role: 'Founder, FitFlow Gym',
    content: 'Best local SEO services in Indore. We are now ranking #1 for all our target keywords. Highly recommended!',
    avatar: 'https://picsum.photos/seed/vikram/100/100'
  },
  {
    id: '4',
    name: 'Neha Kapoor',
    role: 'Director, FashionHub',
    content: 'Their social media strategies are top-notch. Our engagement rates have doubled since we started working with them.',
    avatar: 'https://picsum.photos/seed/neha/100/100'
  }
];

export const PREDEFINED_SERVICES: Service[] = [
  {
    id: 'meta-ads-basic',
    category: 'Meta Ads',
    name: 'Meta Ads Setup & Management (Basic)',
    price: 15000,
    cost: 7500,
    profit: 7500,
    duration: '1 Month',
    description: 'Setup and management of Facebook & Instagram ads for lead generation or brand awareness.'
  },
  {
    id: 'meta-ads-pro',
    category: 'Meta Ads',
    name: 'Meta Ads Setup & Management (Pro)',
    price: 25000,
    cost: 12500,
    profit: 12500,
    duration: '1 Month',
    description: 'Advanced targeting, A/B testing, and weekly optimization for high-performance campaigns.'
  },
  {
    id: 'gmb-optimization',
    category: 'Google My Business',
    name: 'GMB Optimization & Ranking',
    price: 8000,
    cost: 4000,
    profit: 4000,
    duration: '1 Month',
    description: 'Optimize Google Business Profile to rank higher in local search results.'
  },
  {
    id: 'web-dev-landing',
    category: 'Website Development',
    name: 'Landing Page Development',
    price: 12000,
    cost: 6000,
    profit: 6000,
    duration: '7 Days',
    description: 'High-converting single-page website with mobile responsiveness.'
  },
  {
    id: 'web-dev-business',
    category: 'Website Development',
    name: 'Business Website (5-7 Pages)',
    price: 35000,
    cost: 17500,
    profit: 17500,
    duration: '15 Days',
    description: 'Professional business website with SEO optimization and contact forms.'
  },
  {
    id: 'smm-basic',
    category: 'Social Media Marketing',
    name: 'SMM Starter Pack',
    price: 10000,
    cost: 5000,
    profit: 5000,
    duration: '1 Month',
    description: '12 social media posts per month with basic engagement management.'
  },
  {
    id: 'smm-growth',
    category: 'Social Media Marketing',
    name: 'SMM Growth Pack',
    price: 20000,
    cost: 10000,
    profit: 10000,
    duration: '1 Month',
    description: '20 social media posts, reels, and active community engagement.'
  },
  {
    id: 'maintenance-monthly',
    category: 'Maintenance',
    name: 'Monthly Website Maintenance',
    price: 299,
    cost: 150,
    profit: 149,
    duration: '1 Month',
    description: 'Regular backups, security updates, and minor content changes.'
  }
];

export const MAINTENANCE_POLICY = "Website development services include 1 month of free maintenance. After the first month, maintenance cost is ₹299 per month.";
export const PAYMENT_TERMS = "50% Advance, 50% after completion. All payments are non-refundable.";
