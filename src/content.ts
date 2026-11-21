// All wording on the page lives here. Every fact comes from the five Canares websites
// as researched in November 2026. Do not add figures that Canares has not confirmed.

export type BusinessId = 'quickair' | 'aluminium' | 'aquaculture' | 'foundation';

export interface Business {
  id: BusinessId;
  n: string;
  pillar: string;
  name: string;
  short: string;
  url: string;
  domain: string;
  contactUrl: string;
  email: string;
  phone: string;
  color: string;
}

export const businesses: Business[] = [
  {
    id: 'quickair', n: '01', pillar: 'Industrial systems', name: 'Quickair',
    short: 'Modular piping for compressed air, vacuum and inert gases.',
    url: 'https://www.quickair.in/', domain: 'quickair.in',
    contactUrl: 'https://www.quickair.in/contact',
    email: 'sales@canares.com', phone: '+91 94498 40507', color: 'var(--qa)',
  },
  {
    id: 'aluminium', n: '02', pillar: 'Materials', name: 'Canares Aluminium',
    short: 'Aluminium extrusion profiles, tubes, bars and rods.',
    url: 'https://www.canaresaluminium.com/', domain: 'canaresaluminium.com',
    contactUrl: 'https://www.canaresaluminium.com/#contact',
    email: 'sales@canares.com', phone: '+91 94498 40504', color: 'var(--al)',
  },
  {
    id: 'aquaculture', n: '03', pillar: 'Food', name: 'Canares Aquaculture',
    short: 'Asian Sea Bass hatchery and sea cage farming.',
    url: 'https://canaresaquaculture.com/', domain: 'canaresaquaculture.com',
    contactUrl: 'https://canaresaquaculture.com/contact/',
    email: 'canaresaquaculture@gmail.com', phone: '+91 72594 53337', color: 'var(--aq)',
  },
  {
    id: 'foundation', n: '04', pillar: 'Community', name: 'Canares Foundation',
    short: 'Healthcare, education and girl-child initiatives.',
    url: 'https://canaresfoundation.com/', domain: 'canaresfoundation.com',
    contactUrl: 'https://canaresfoundation.com/donation-contact/',
    email: 'support@canaresfoundation.com', phone: '+91 94480 66046', color: 'var(--fn)',
  },
];

export const group = {
  headline: ['Engineering', 'that', 'lasts.'],
  label: 'Canares Group · Est. 1998 · Bengaluru',
  intro:
    'A group of manufacturing and aquaculture businesses from Karnataka, India. We make modular piping systems and aluminium extrusions, raise marine fish, and invest in the communities around us.',
  statement:
    'Canares began in 1998 as an engineering company in Bengaluru with a practical aim: to give factories a compressed air line that does not leak, corrode or need welding. That system became Quickair. Today the group also extrudes aluminium, farms Asian Sea Bass on the Karnataka coast and supports healthcare and schools in the villages around its coastal operations.',
  facts: [
    { value: '1998', label: 'Founded in Bengaluru' },
    { value: '2018', label: 'Exporting since' },
    { value: '4', label: 'Businesses in one group', count: 4 },
    { value: 'ISO 9001:2015', label: 'Canares Automation Pvt. Ltd.' },
  ],
  // Contact details as published on the current canares.com group homepage.
  phone: '+91 94480 66046',
  email: 'gajanan@canares.com',
  company: 'Canares Automation Pvt. Ltd.',
  address: ['Plot No. 85/0, Industrial Suburb, Industrial Layout', 'Yeshwanthpur, Bengaluru, Karnataka 560022, India'],
  coast: 'Operations at Kumta and Holanagadde, Uttara Kannada, Karnataka',
};

export const identity = {
  philosophy: ['Make it ourselves.', 'Make it well.', 'Stand behind it.'],
  vision:
    'To build businesses that customers, partners and communities can rely on for decades: products that work, commitments that are kept, and growth that benefits the places where we operate.',
  approach: [
    {
      title: 'Start with a real problem',
      text: 'Quickair began with leaking, corroding air lines on factory floors. Every Canares business starts from a need we can name.',
    },
    {
      title: 'Make what we sell',
      text: 'Fittings are machined in Bengaluru, aluminium is extruded in Kumta and fish seed is bred in our own hatchery.',
    },
    {
      title: 'Stay with it',
      text: 'One team follows a project from enquiry to handover, and the group invests where it operates.',
    },
  ],
  values: [
    { name: 'Quality', practice: 'Every Quickair system is pressure-tested before handover. Every batch of fish seed is graded before dispatch.' },
    { name: 'Innovation', practice: 'We redesign the part when the standard part is the problem. Push-fit joints replaced threads and welds.' },
    { name: 'Integrity', practice: 'We state what we can show, and say so when something is not yet certified.' },
    { name: 'Customer commitment', practice: 'Engineers survey, design, supply and test, so one team answers for the result.' },
    { name: 'Responsibility', practice: 'We reuse hatchery water, farm a native species and support health and schooling near our sites.' },
  ],
};

export interface Capability {
  title: string;
  text: string;
  image: { name: string; widths: number[]; alt: string; w: number; h: number } | null;
  used: BusinessId[];
}

export const capabilities: Capability[] = [
  {
    title: 'Design and engineering',
    text: 'Layouts, pipe sizing and pressure-drop calculation from a floor plan, and custom aluminium sections from a customer drawing.',
    image: { name: 'cap-design', widths: [520, 900], alt: 'Blue Quickair piping and a filter manifold mounted on a plant wall', w: 900, h: 675 },
    used: ['quickair', 'aluminium'],
  },
  {
    title: 'Precision manufacturing',
    text: 'CNC machining, turning and an in-house tool room produce the fittings and components behind every Quickair joint.',
    image: { name: 'cap-manufacturing', widths: [520, 900], alt: 'CNC machine cutting a component at the Canares factory in Bengaluru', w: 900, h: 675 },
    used: ['quickair'],
  },
  {
    title: 'Aluminium extrusion and finishing',
    text: 'Standard and custom profiles in 6063 and 6061 alloys, supplied in mill, anodised, powder-coated or wood finish.',
    image: null,
    used: ['aluminium', 'quickair'],
  },
  {
    title: 'Automation and control',
    text: 'Ball and butterfly valves with pneumatic or electric actuators, controlled by PLC with SCADA monitoring.',
    image: { name: 'cap-automation', widths: [520, 825], alt: 'Large-bore modular pipe with butterfly valves and flanged take-offs', w: 825, h: 619 },
    used: ['quickair'],
  },
  {
    title: 'Controlled biological production',
    text: 'Recirculating water treatment, live feed culture, regular grading and water quality monitoring in the hatchery.',
    image: { name: 'cap-biology', widths: [362], alt: 'Asian Sea Bass in a hatchery tank at Holanagadde', w: 362, h: 275 },
    used: ['aquaculture'],
  },
  {
    title: 'Delivery and support',
    text: 'Installation teams, a dealer network across India, export supply since 2018, and product and installation training.',
    image: { name: 'cap-delivery', widths: [520, 900], alt: 'Canares team at the 2024 dealers’ meet', w: 900, h: 675 },
    used: ['quickair', 'aluminium'],
  },
];

export const milestones = [
  { year: '1998', title: 'Canares Automation founded', text: 'The company starts in Bengaluru and launches Quickair modular piping.' },
  { year: '2018', title: 'First exports', text: 'Modular piping is supplied to customers outside India for the first time.' },
  { year: '2021', title: 'QuickFrame launched', text: 'Modular aluminium structures for workstations, conveyors and enclosures join the range.' },
  { year: '2023', title: 'In-house extrusion', text: 'An aluminium extrusion plant is commissioned to control quality and lead times.' },
  { year: '2024', title: 'ISO 9001:2015', text: 'Canares Automation Pvt. Ltd. is registered to the quality management standard.' },
];

// Operating facts as stated on each business website. `count` marks the figures that animate.
export const proof = [
  { value: '20–63', unit: 'mm', label: 'Quickair push-fit pipe range' },
  { value: '40', unit: 'bar', label: 'Working pressure, crimped systems', count: 40 },
  { value: '10', unit: 'years', label: 'Guarantee on Quickair fittings against manufacturing defects', count: 10 },
  { value: '52', unit: 'sections', label: 'Standard aluminium profiles published', count: 52 },
  { value: '9', unit: 'stages', label: 'From broodstock to market in one chain', count: 9 },
  { value: '6 · 9 · 12', unit: 'm', label: 'HDPE sea cage diameters' },
];

export const enquiryTypes = [
  { id: 'general', label: 'General enquiry' },
  { id: 'partnership', label: 'Business partnership' },
  { id: 'business', label: 'A specific business' },
  { id: 'media', label: 'Media' },
  { id: 'supplier', label: 'Supplier or vendor' },
] as const;

// Accounts linked from the current canares.com pages.
export const social = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/canares-automation-pvt-ltd/' },
  { name: 'YouTube', url: 'https://www.youtube.com/@Canares-Automation-Pvt-Ltd' },
  { name: 'Instagram', url: 'https://www.instagram.com/canaresofficial/' },
  { name: 'X', url: 'https://x.com/CanaresOfficial' },
];

export const nav = [
  { id: 'businesses', label: 'Businesses' },
  { id: 'group', label: 'The group' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'contact', label: 'Contact' },
];
