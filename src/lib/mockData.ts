/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Project, 
  Task, 
  ServiceProduct, 
  Order, 
  Course, 
  Appointment, 
  Booking, 
  Invoice, 
  Lead, 
  PurchaseRequest, 
  AuditLog,
  SystemNotification,
  VendorProfile,
  TalentProfile
} from '../types';

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'n-1',
    title: 'New Tender Proposal',
    message: 'Mitra Trismatek submitted a proposal for the GovTech Portal Project.',
    type: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    read: false
  },
  {
    id: 'n-2',
    title: 'Budget Threshold Warning',
    message: 'Mobile Medical App project has exceeded 85% of its allocated budget.',
    type: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hrs ago
    read: false
  },
  {
    id: 'n-3',
    title: 'New Appointment Booked',
    message: 'Patient John Doe booked telemedicine consultation for today 14:00.',
    type: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hrs ago
    read: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'demo-admin-uid',
    userName: 'Ahmad Sepuh',
    action: 'Approved Procurement Request #PR-801',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    ipAddress: '192.168.1.102'
  },
  {
    id: 'log-2',
    userId: 'demo-pmo-uid',
    userName: 'Ismanto PMO',
    action: 'Updated Gantt Chart Milestones for "GovTech Portal"',
    timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    ipAddress: '192.168.1.115'
  },
  {
    id: 'log-3',
    userId: 'demo-vendor-uid',
    userName: 'Mitra Trismatek',
    action: 'Uploaded Document "Business_License_2026.pdf"',
    timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    ipAddress: '103.22.41.90'
  }
];

export const INITIAL_VENDORS: VendorProfile[] = [
  {
    id: 'v-1',
    userId: 'demo-vendor-uid',
    companyName: 'PT. Sepuh Trismatek Nusa',
    category: 'IT Solution & Consulting',
    rating: 4.9,
    performanceScore: 97,
    verificationStatus: 'Verified',
    documents: [
      { name: 'Business_License_2026.pdf', url: '#', uploadedAt: '2026-01-15' },
      { name: 'Company_Tax_ID.pdf', url: '#', uploadedAt: '2026-01-15' }
    ],
    isBlacklisted: false,
    contractStatus: 'Active'
  },
  {
    id: 'v-2',
    userId: 'vendor-2-uid',
    companyName: 'Nusantara Cloud Services',
    category: 'Cloud Services & Cyber Security',
    rating: 4.7,
    performanceScore: 92,
    verificationStatus: 'Verified',
    documents: [{ name: 'ISO_27001_Certificate.pdf', url: '#', uploadedAt: '2026-02-10' }],
    isBlacklisted: false,
    contractStatus: 'Active'
  },
  {
    id: 'v-3',
    userId: 'vendor-3-uid',
    companyName: 'Catering Premium Utama',
    category: 'MICE Hospitality - Catering',
    rating: 4.5,
    performanceScore: 88,
    verificationStatus: 'Verified',
    documents: [{ name: 'Food_Safety_License.pdf', url: '#', uploadedAt: '2026-03-01' }],
    isBlacklisted: false,
    contractStatus: 'Active'
  },
  {
    id: 'v-4',
    userId: 'vendor-4-uid',
    companyName: 'Clinic Solutions Indonesia',
    category: 'Clinic Operations',
    rating: 4.2,
    performanceScore: 78,
    verificationStatus: 'Pending',
    documents: [{ name: 'Medical_Equip_Lic.pdf', url: '#', uploadedAt: '2026-05-12' }],
    isBlacklisted: false,
    contractStatus: 'Under Review'
  }
];

export const INITIAL_TALENTS: TalentProfile[] = [
  {
    id: 't-1',
    userId: 'demo-talent-uid',
    fullName: 'Rizky Pratama',
    type: 'Alumni',
    skills: ['React', 'TypeScript', 'Node.js', 'Firebase', 'TailwindCSS'],
    portfolio: [
      { title: 'E-Commerce Engine', link: '#', description: 'Complete high-performance marketplace site' },
      { title: 'PMO Tracker Widget', link: '#', description: 'Dashboard reporting system component' }
    ],
    certifications: [
      { title: 'Google Certified Professional Cloud Architect', issuer: 'Google Cloud', date: '2025-08' },
      { title: 'React Advanced Expert Certificate', issuer: 'Meta', date: '2026-02' }
    ]
  },
  {
    id: 't-2',
    userId: 'talent-2-uid',
    fullName: 'Sonia Wijaya',
    type: 'Student',
    skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping'],
    portfolio: [
      { title: 'Clinic Telemedicine Redesign', link: '#', description: 'Redesigning mobile healthcare flows' }
    ],
    certifications: [
      { title: 'Certified UX Specialist', issuer: 'Interaction Design Foundation', date: '2026-04' }
    ]
  },
  {
    id: 't-3',
    userId: 'talent-3-uid',
    fullName: 'Yudi Hermawan',
    type: 'Freelancer',
    skills: ['Cyber Security', 'Penetration Testing', 'Docker', 'Linux'],
    portfolio: [
      { title: 'Security Audit - GovTech', link: '#', description: 'Full-stack cyber risk assessments' }
    ],
    certifications: [
      { title: 'Certified Ethical Hacker (CEH)', issuer: 'EC-Council', date: '2025-11' }
    ]
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p-101',
    name: 'GovTech Portal Redesign',
    description: 'National government administrative dashboard portal with advanced citizens security verification and multi-agency routing integrations.',
    pillar: 'IT Solution',
    status: 'In Progress',
    startDate: '2026-05-01',
    endDate: '2026-11-30',
    budget: 150000000, // IDR
    spent: 62000000,
    progress: 42,
    managerId: 'demo-pmo-uid',
    vendorId: 'v-1',
    customerId: 'cust-10',
    riskLevel: 'Medium',
    issuesCount: 2
  },
  {
    id: 'p-102',
    name: 'Advanced LMS Platform',
    description: 'Corporate and open certification learning system with course tracking, interactive video players, and auto-generated digital certificates.',
    pillar: 'Training & Certification',
    status: 'In Progress',
    startDate: '2026-06-01',
    endDate: '2026-09-30',
    budget: 75000000,
    spent: 45000000,
    progress: 60,
    managerId: 'demo-pmo-uid',
    vendorId: 'v-2',
    customerId: 'cust-12',
    riskLevel: 'Low',
    issuesCount: 0
  },
  {
    id: 'p-103',
    name: 'Telemedicine App Integration',
    description: 'Mobile healthcare solution delivering live video consultations, medical records integration, and prescription delivery dashboards.',
    pillar: 'Clinic',
    status: 'Planning',
    startDate: '2026-07-15',
    endDate: '2026-12-15',
    budget: 120000000,
    spent: 0,
    progress: 5,
    managerId: 'demo-pmo-uid',
    vendorId: 'v-4',
    customerId: 'cust-14',
    riskLevel: 'High',
    issuesCount: 1
  },
  {
    id: 'p-104',
    name: 'Ecosystem Annual Conference MICE',
    description: 'Planning, venue coordination, catering, and automated digital invitation pipeline for the DINESYS 2026 Annual Tech Summit.',
    pillar: 'MICE Hospitality',
    status: 'Completed',
    startDate: '2026-04-01',
    endDate: '2026-06-20',
    budget: 90000000,
    spent: 89000000,
    progress: 100,
    managerId: 'demo-pmo-uid',
    vendorId: 'v-3',
    customerId: 'cust-16',
    riskLevel: 'Low',
    issuesCount: 0
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't-101',
    projectId: 'p-101',
    title: 'Draft System Architecture & Security Guidelines',
    description: 'Develop detailed infrastructure layout illustrating multi-node load balancers, secure token services, and database clusters.',
    assignedTo: 'demo-talent-uid',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2026-07-10'
  },
  {
    id: 't-102',
    projectId: 'p-101',
    title: 'Configure Firebase Auth & Firestore DB',
    description: 'Bootstrap auth policies, database schemas, and deploy final secure Firestore rulesets.',
    assignedTo: 'demo-admin-uid',
    status: 'Done',
    priority: 'High',
    dueDate: '2026-06-20'
  },
  {
    id: 't-103',
    projectId: 'p-102',
    title: 'Develop Video Streaming CDN Player',
    description: 'Integrate dynamic streaming capabilities with video buffer tracking to resume lectures gracefully.',
    assignedTo: 'talent-2-uid',
    status: 'Todo',
    priority: 'Medium',
    dueDate: '2026-07-25'
  },
  {
    id: 't-104',
    projectId: 'p-103',
    title: 'Setup Encryption for Doctor EHR Files',
    description: 'Encrypt patient charts with AES-256 standard and establish specific role accesses for medical staffs.',
    assignedTo: 'talent-3-uid',
    status: 'Todo',
    priority: 'High',
    dueDate: '2026-08-05'
  }
];

export const INITIAL_SERVICES: ServiceProduct[] = [
  {
    id: 'srv-1',
    vendorId: 'v-1',
    vendorName: 'PT. Sepuh Trismatek Nusa',
    title: 'Enterprise Custom ERP Integration',
    description: 'Bespoke corporate planning engine that streamlines finance, warehouse management, HR modules, and real-time CRM pipelines.',
    category: 'IT Solution',
    subcategory: 'ERP',
    price: 85000000,
    rating: 4.9,
    reviewsCount: 14
  },
  {
    id: 'srv-2',
    vendorId: 'v-2',
    vendorName: 'Nusantara Cloud Services',
    title: 'GovTech Secure Cloud Deployment',
    description: 'Secure regional server clustering hosting private Docker nodes and encrypted Firestore architectures with zero-downtime backups.',
    category: 'IT Solution',
    subcategory: 'Cloud Services',
    price: 110000000,
    rating: 4.8,
    reviewsCount: 9
  },
  {
    id: 'srv-3',
    vendorId: 'v-1',
    vendorName: 'PT. Sepuh Trismatek Nusa',
    title: 'Corporate AI Chatbot & LLM Assistant',
    description: 'Full-stack custom chatbot using Gemini API models fine-tuned with company documentation. Integrates inside slack, websites, and teams.',
    category: 'IT Solution',
    subcategory: 'Artificial Intelligence',
    price: 55000000,
    rating: 5.0,
    reviewsCount: 22
  },
  {
    id: 'srv-4',
    vendorId: 'v-2',
    vendorName: 'Nusantara Cloud Services',
    title: 'Full Stack Web Dev Bootcamp',
    description: '12-week intensive masterclass on React, Express, Firebase, and Enterprise Architecture with live mentoring and real-world client briefs.',
    category: 'Training & Certification',
    subcategory: 'Bootcamp',
    price: 12500000,
    rating: 4.7,
    reviewsCount: 37
  },
  {
    id: 'srv-5',
    vendorId: 'v-4',
    vendorName: 'Clinic Solutions Indonesia',
    title: 'Telemedicine Virtual Care Suite',
    description: 'Virtual platform connecting clinics to outpatients featuring built-in WebRTC video chat, billing systems, and medical records sharing.',
    category: 'Clinic',
    subcategory: 'Clinic Management',
    price: 45000000,
    rating: 4.4,
    reviewsCount: 6
  },
  {
    id: 'srv-6',
    vendorId: 'v-3',
    vendorName: 'Catering Premium Utama',
    title: 'Grand Ballroom Tech Conference Catering',
    description: 'Premium organic buffet options, snacks, and automated beverage service for events with 200 - 1000 delegates. High safety certification.',
    category: 'MICE Hospitality',
    subcategory: 'Catering',
    price: 32000000,
    rating: 4.6,
    reviewsCount: 18
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-301',
    customerId: 'cust-10',
    customerName: 'Kementerian Komunikasi Indonesia',
    serviceId: 'srv-2',
    serviceTitle: 'GovTech Secure Cloud Deployment',
    vendorId: 'v-2',
    price: 110000000,
    status: 'In Progress',
    createdAt: '2026-05-15',
    quotationUrl: '#',
    purchaseOrderUrl: '#'
  },
  {
    id: 'ord-302',
    customerId: 'cust-12',
    customerName: 'PT. Edukasi Bangsa',
    serviceId: 'srv-4',
    serviceTitle: 'Full Stack Web Dev Bootcamp',
    vendorId: 'v-2',
    price: 12500000,
    status: 'Completed',
    createdAt: '2026-04-10',
    quotationUrl: '#',
    purchaseOrderUrl: '#'
  },
  {
    id: 'ord-303',
    customerId: 'cust-16',
    customerName: 'Universitas Terbuka',
    serviceId: 'srv-3',
    serviceTitle: 'Corporate AI Chatbot & LLM Assistant',
    vendorId: 'v-1',
    price: 55000000,
    status: 'Pending',
    createdAt: '2026-06-25',
    quotationUrl: '#',
    purchaseOrderUrl: '#'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c-1',
    title: 'Full-Stack JavaScript Specialist',
    description: 'Master modern frontend & backend architectures using React 19, TypeScript, and Firebase Firestore schemas.',
    instructor: 'Ahmad Sepuh',
    duration: '12 Weeks',
    lessonsCount: 36,
    progress: 75,
    price: 5500000
  },
  {
    id: 'c-2',
    title: 'Enterprise Cyber Security Controls',
    description: 'Understand cloud perimeter defenses, penetration testing, standard audits, and AES database encryption keys.',
    instructor: 'Yudi Hermawan',
    duration: '6 Weeks',
    lessonsCount: 18,
    progress: 20,
    price: 8500000
  },
  {
    id: 'c-3',
    title: 'UI/UX Design Masterclass with Figma',
    description: 'Design complex corporate platforms, multi-pillar portals, and interactive component state charts.',
    instructor: 'Sonia Wijaya',
    duration: '8 Weeks',
    lessonsCount: 24,
    progress: 0,
    price: 4200000
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-501',
    patientId: 'demo-talent-uid',
    patientName: 'Rizky Pratama',
    doctorName: 'Dr. Hendra Gunawan, Sp.PD',
    date: '2026-06-26',
    time: '14:00',
    type: 'Telemedicine',
    status: 'Scheduled',
    notes: 'Routine health checkup and stress level evaluation.'
  },
  {
    id: 'app-502',
    patientId: 'pat-102',
    patientName: 'Siti Rahma',
    doctorName: 'Dr. Anita Wijaya, Sp.OK',
    date: '2026-06-27',
    time: '10:30',
    type: 'In-Clinic',
    status: 'Scheduled',
    notes: 'Post-recovery wellness check and occupational health clearance.'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-601',
    customerId: 'cust-10',
    customerName: 'Ahmad Sepuh',
    venueName: 'Smart Conference Room - Block B',
    date: '2026-06-29',
    timeSlot: '09:00 - 13:00',
    pillar: 'MICE Hospitality',
    price: 2500000,
    status: 'Confirmed'
  },
  {
    id: 'bk-602',
    customerId: 'cust-12',
    customerName: 'Mitra Trismatek',
    venueName: 'Grand Auditorium - Universitas Terbuka',
    date: '2026-07-05',
    timeSlot: '08:00 - 17:00',
    pillar: 'MICE Hospitality',
    price: 15000000,
    status: 'Pending'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-701',
    orderId: 'ord-301',
    recipientName: 'Kementerian Komunikasi Indonesia',
    recipientEmail: 'finance@kominfo.go.id',
    amount: 110000000,
    status: 'Paid',
    dueDate: '2026-06-15',
    issuedDate: '2026-05-15'
  },
  {
    id: 'inv-702',
    orderId: 'ord-302',
    recipientName: 'PT. Edukasi Bangsa',
    recipientEmail: 'contact@edubangsa.co.id',
    amount: 12500000,
    status: 'Paid',
    dueDate: '2026-05-10',
    issuedDate: '2026-04-10'
  },
  {
    id: 'inv-703',
    orderId: 'ord-303',
    recipientName: 'Universitas Terbuka',
    recipientEmail: 'info@ut.ac.id',
    amount: 55000000,
    status: 'Unpaid',
    dueDate: '2026-07-10',
    issuedDate: '2026-06-25'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-901',
    name: 'Budi Hartono',
    company: 'Djarum Tech Ventures',
    email: 'budi@djarum.com',
    value: 250000000,
    stage: 'Proposal',
    source: 'Website',
    lastContact: '2026-06-24'
  },
  {
    id: 'lead-902',
    name: 'Linda Kusuma',
    company: 'Sinar Mas Group IT',
    email: 'linda.k@sinarmas.com',
    value: 500000000,
    stage: 'Negotiation',
    source: 'Referral',
    lastContact: '2026-06-25'
  },
  {
    id: 'lead-903',
    name: 'Prabowo Subi',
    company: 'Garuda Aviation Solutions',
    email: 'prabowo@garuda.co.id',
    value: 120000000,
    stage: 'Lead',
    source: 'Conference',
    lastContact: '2026-06-20'
  }
];

export const INITIAL_PURCHASES: PurchaseRequest[] = [
  {
    id: 'PR-801',
    requesterName: 'Ahmad Sepuh',
    department: 'PMO - IT Pillar',
    items: [
      { description: 'Premium Developer Server Instances (AWS/GCP)', quantity: 3, estimatedPrice: 15000000 }
    ],
    totalAmount: 45000000,
    status: 'Approved',
    createdAt: '2026-06-12'
  },
  {
    id: 'PR-802',
    requesterName: 'Ismanto PMO',
    department: 'PMO - Administrative',
    items: [
      { description: 'Video Conference Licenses & Smart Cameras', quantity: 5, estimatedPrice: 4000000 }
    ],
    totalAmount: 20000000,
    status: 'Pending',
    createdAt: '2026-06-25'
  }
];
