/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole =
  | 'Super Admin'
  | 'PMO Manager'
  | 'Business Unit Manager'
  | 'Vendor'
  | 'Customer'
  | 'Talent'
  | 'Finance'
  | 'HR';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  photoURL?: string;
  businessUnit?: 'IT Solution' | 'Training & Certification' | 'Clinic' | 'MICE Hospitality' | 'All';
  createdAt: string;
  status: 'Active' | 'Pending' | 'Suspended';
}

export interface VendorProfile {
  id: string;
  userId: string;
  companyName: string;
  category: string;
  rating: number;
  performanceScore: number;
  verificationStatus: 'Verified' | 'Pending' | 'Unverified';
  documents: { name: string; url: string; uploadedAt: string }[];
  isBlacklisted: boolean;
  contractStatus: 'Active' | 'Expired' | 'Under Review';
}

export interface TalentProfile {
  id: string;
  userId: string;
  fullName: string;
  type: 'Student' | 'Alumni' | 'Freelancer';
  resumeUrl?: string;
  skills: string[];
  portfolio: { title: string; link: string; description: string }[];
  certifications: { title: string; issuer: string; date: string }[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  pillar: 'IT Solution' | 'Training & Certification' | 'Clinic' | 'MICE Hospitality';
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  progress: number; // 0 to 100
  managerId: string;
  vendorId?: string;
  customerId?: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  issuesCount: number;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo: string; // User ID
  status: 'Todo' | 'In Progress' | 'In Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
}

export interface ServiceProduct {
  id: string;
  vendorId: string;
  vendorName: string;
  title: string;
  description: string;
  category: 'IT Solution' | 'Training & Certification' | 'Clinic' | 'MICE Hospitality';
  subcategory: string;
  price: number;
  rating: number;
  reviewsCount: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceTitle: string;
  vendorId: string;
  price: number;
  status: 'Pending' | 'Approved' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
  quotationUrl?: string;
  purchaseOrderUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  lessonsCount: number;
  progress?: number; // for current user
  price: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: 'Telemedicine' | 'In-Clinic';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  venueName: string;
  date: string;
  timeSlot: string;
  pillar: 'MICE Hospitality';
  price: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export interface Invoice {
  id: string;
  orderId?: string;
  projectId?: string;
  recipientName: string;
  recipientEmail: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  dueDate: string;
  issuedDate: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  value: number;
  stage: 'Lead' | 'Contacted' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  source: string;
  lastContact: string;
}

export interface PurchaseRequest {
  id: string;
  requesterName: string;
  department: string;
  items: { description: string; quantity: number; estimatedPrice: number }[];
  totalAmount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  ipAddress: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}
