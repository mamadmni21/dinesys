/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar, { ModuleType } from './components/Sidebar';
import Header from './components/Header';
import DashboardHome from './components/DashboardHome';
import MarketplaceModule from './components/MarketplaceModule';
import VendorModule from './components/VendorModule';
import TalentModule from './components/TalentModule';
import TrainingModule from './components/TrainingModule';
import ClinicModule from './components/ClinicModule';
import HospitalityModule from './components/HospitalityModule';
import ProjectModule from './components/ProjectModule';
import ProcurementModule from './components/ProcurementModule';
import CrmModule from './components/CrmModule';
import FinanceModule from './components/FinanceModule';
import ReportsModule from './components/ReportsModule';
import SettingsModule from './components/SettingsModule';
import AiChatAssistant from './components/AiChatAssistant';
import CalendarView from './components/CalendarView';
import Logo from './components/Logo';

import { 
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_SERVICES,
  INITIAL_ORDERS,
  INITIAL_COURSES,
  INITIAL_APPOINTMENTS,
  INITIAL_BOOKINGS,
  INITIAL_VENDORS,
  INITIAL_TALENTS,
  INITIAL_INVOICES,
  INITIAL_LEADS,
  INITIAL_PURCHASES,
  INITIAL_NOTIFICATIONS
} from './lib/mockData';

import { 
  Project, 
  Task, 
  ServiceProduct, 
  Order, 
  Course, 
  Appointment, 
  Booking, 
  VendorProfile, 
  TalentProfile, 
  Invoice, 
  Lead, 
  PurchaseRequest, 
  SystemNotification 
} from './types';

import {
  subscribeToCollection,
  saveDocument,
  updateDocumentFields,
  testConnection
} from './lib/firestoreService';

function AppContent() {
  const { profile, loading, login, error } = useAuth() as any;
  const [activeModule, setActiveModule] = useState<ModuleType>('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Core synchronized application state
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [services, setServices] = useState<ServiceProduct[]>(INITIAL_SERVICES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [vendors, setVendors] = useState<VendorProfile[]>(INITIAL_VENDORS);
  const [talents, setTalents] = useState<TalentProfile[]>(INITIAL_TALENTS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [purchases, setPurchases] = useState<PurchaseRequest[]>(INITIAL_PURCHASES);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);

  // Hook up real-time bidirectional Firestore persistence
  useEffect(() => {
    testConnection();

    const unsubProjects = subscribeToCollection('projects', INITIAL_PROJECTS, setProjects);
    const unsubTasks = subscribeToCollection('tasks', INITIAL_TASKS, setTasks);
    const unsubServices = subscribeToCollection('services', INITIAL_SERVICES, setServices);
    const unsubOrders = subscribeToCollection('orders', INITIAL_ORDERS, setOrders);
    const unsubCourses = subscribeToCollection('courses', INITIAL_COURSES, setCourses);
    const unsubAppointments = subscribeToCollection('appointments', INITIAL_APPOINTMENTS, setAppointments);
    const unsubBookings = subscribeToCollection('bookings', INITIAL_BOOKINGS, setBookings);
    const unsubVendors = subscribeToCollection('vendors', INITIAL_VENDORS, setVendors);
    const unsubTalents = subscribeToCollection('talents', INITIAL_TALENTS, setTalents);
    const unsubInvoices = subscribeToCollection('invoices', INITIAL_INVOICES, setInvoices);
    const unsubLeads = subscribeToCollection('leads', INITIAL_LEADS, setLeads);
    const unsubPurchases = subscribeToCollection('purchases', INITIAL_PURCHASES, setPurchases);
    const unsubNotifications = subscribeToCollection('notifications', INITIAL_NOTIFICATIONS, setNotifications);

    return () => {
      unsubProjects();
      unsubTasks();
      unsubServices();
      unsubOrders();
      unsubCourses();
      unsubAppointments();
      unsubBookings();
      unsubVendors();
      unsubTalents();
      unsubInvoices();
      unsubLeads();
      unsubPurchases();
      unsubNotifications();
    };
  }, []);

  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [authError, setAuthError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      await login(loginEmail, loginPass || 'password');
    } catch (err: any) {
      setAuthError(err.message || 'Invalid login details in sandbox');
    }
  };

  const selectDemoAccount = async (email: string) => {
    setLoginEmail(email);
    setLoginPass('password');
    try {
      await login(email, 'password');
    } catch (err: any) {
      setAuthError(err.message || 'Demo activation failure');
    }
  };

  // State Mutators with Cloud Firestore Persistence
  const handleAddOrder = async (newOrder: Partial<Order>) => {
    const complete: Order = {
      id: `ord-${Date.now().toString().slice(-4)}`,
      customerId: profile?.uid || 'demo-talent-uid',
      customerName: newOrder.customerName || profile?.displayName || 'Enterprise Client',
      serviceId: newOrder.serviceId || 'srv-1',
      serviceTitle: newOrder.serviceTitle || 'Core Service',
      vendorId: newOrder.vendorId || 'v-1',
      price: newOrder.price || 0,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setOrders((prev) => [complete, ...prev]);
    await saveDocument('orders', complete);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    await updateDocumentFields('orders', orderId, { status });
    
    // Auto sync to project list when contract signed
    if (status === 'In Progress') {
      const orderObj = orders.find(o => o.id === orderId);
      if (orderObj) {
        const newProj: Project = {
          id: `p-${Date.now().toString().slice(-3)}`,
          name: `${orderObj.serviceTitle} Deployment`,
          description: `Active onboarding project for ${orderObj.customerName}`,
          pillar: 'IT Solution',
          status: 'In Progress',
          startDate: new Date().toISOString().split('T')[0],
          endDate: '2026-12-31',
          budget: orderObj.price,
          spent: 0,
          progress: 10,
          managerId: profile?.uid || 'demo-pmo-uid',
          riskLevel: 'Low',
          issuesCount: 0
        };
        setProjects((prev) => [newProj, ...prev]);
        await saveDocument('projects', newProj);
      }
    }
  };

  const handleAddVendor = async (newVendor: Partial<VendorProfile>) => {
    const complete: VendorProfile = {
      id: `v-${Date.now().toString().slice(-3)}`,
      userId: `user-vendor-${Date.now()}`,
      companyName: newVendor.companyName || 'PT. New Mitra',
      category: newVendor.category || 'IT Solution & Consulting',
      rating: 5.0,
      performanceScore: 100,
      verificationStatus: 'Pending',
      documents: newVendor.documents || [],
      isBlacklisted: false,
      contractStatus: 'Under Review'
    };
    setVendors((prev) => [complete, ...prev]);
    await saveDocument('vendors', complete);
  };

  const handleUpdateVendorStatus = async (vendorId: string, fields: Partial<VendorProfile>) => {
    setVendors((prev) => prev.map((v) => v.id === vendorId ? { ...v, ...fields } : v));
    await updateDocumentFields('vendors', vendorId, fields);
  };

  const handleCompleteCourse = async (courseId: string) => {
    setCourses((prev) => prev.map((c) => c.id === courseId ? { ...c, progress: 100 } : c));
    await updateDocumentFields('courses', courseId, { progress: 100 });
  };

  const handleAddAppointment = async (newApp: Partial<Appointment>) => {
    const complete: Appointment = {
      id: `app-${Date.now().toString().slice(-3)}`,
      patientId: profile?.uid || 'demo-talent-uid',
      patientName: newApp.patientName || profile?.displayName || 'Rizky Pratama',
      doctorName: newApp.doctorName || 'Dr. Hendra Gunawan, Sp.PD',
      date: newApp.date || '2026-06-27',
      time: newApp.time || '10:00',
      type: newApp.type || 'Telemedicine',
      status: 'Scheduled',
      notes: newApp.notes
    };
    setAppointments((prev) => [complete, ...prev]);
    await saveDocument('appointments', complete);
  };

  const handleAddBooking = async (newBook: Partial<Booking>) => {
    const complete: Booking = {
      id: `bk-${Date.now().toString().slice(-3)}`,
      customerId: profile?.uid || 'demo-talent-uid',
      customerName: newBook.customerName || profile?.displayName || 'Ahmad Sepuh',
      venueName: newBook.venueName || 'Conference Room',
      date: newBook.date || '2026-06-29',
      timeSlot: newBook.timeSlot || '09:00 - 13:00',
      pillar: 'MICE Hospitality',
      price: newBook.price || 0,
      status: 'Confirmed'
    };
    setBookings((prev) => [complete, ...prev]);
    await saveDocument('bookings', complete);
  };

  const handleAddTask = async (newTask: Partial<Task>) => {
    const complete: Task = {
      id: `t-${Date.now().toString().slice(-3)}`,
      projectId: newTask.projectId || 'p-101',
      title: newTask.title || 'Untitled task card',
      description: newTask.description || '',
      assignedTo: newTask.assignedTo || profile?.uid || 'demo-talent-uid',
      status: 'Todo',
      priority: newTask.priority || 'Medium',
      dueDate: newTask.dueDate || '2026-07-15'
    };
    setTasks((prev) => [...prev, complete]);
    await saveDocument('tasks', complete);
  };

  const handleUpdateTaskStatus = async (taskId: string, status: Task['status']) => {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status } : t));
    await updateDocumentFields('tasks', taskId, { status });
  };

  const handleAddPurchase = async (newPr: Partial<PurchaseRequest>) => {
    const complete: PurchaseRequest = {
      id: `PR-${Date.now().toString().slice(-3)}`,
      requesterName: profile?.displayName || 'Ahmad Sepuh',
      department: newPr.department || 'PMO - IT Pillar',
      items: newPr.items || [],
      totalAmount: newPr.totalAmount || 0,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setPurchases((prev) => [complete, ...prev]);
    await saveDocument('purchases', complete);
  };

  const handleUpdatePurchaseStatus = async (prId: string, status: PurchaseRequest['status']) => {
    setPurchases((prev) => prev.map((p) => p.id === prId ? { ...p, status } : p));
    await updateDocumentFields('purchases', prId, { status });
  };

  const handleAddLead = async (newLead: Partial<Lead>) => {
    const complete: Lead = {
      id: `lead-${Date.now().toString().slice(-3)}`,
      name: newLead.name || 'John Prospect',
      company: newLead.company || 'New Corporate Deal',
      email: newLead.email || 'corp@deal.com',
      value: newLead.value || 0,
      stage: 'Lead',
      source: newLead.source || 'Website',
      lastContact: new Date().toISOString().split('T')[0]
    };
    setLeads((prev) => [complete, ...prev]);
    await saveDocument('leads', complete);
  };

  const handleUpdateLeadStage = async (leadId: string, stage: Lead['stage']) => {
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, stage } : l));
    await updateDocumentFields('leads', leadId, { stage });
  };

  const handleAddInvoice = async (newInv: Partial<Invoice>) => {
    const complete: Invoice = {
      id: `inv-${Date.now().toString().slice(-3)}`,
      recipientName: newInv.recipientName || 'Enterprise Partner',
      recipientEmail: newInv.recipientEmail || 'partner@enterprise.com',
      amount: newInv.amount || 0,
      status: 'Unpaid',
      dueDate: newInv.dueDate || '2026-07-15',
      issuedDate: newInv.issuedDate || '2026-06-26'
    };
    setInvoices((prev) => [complete, ...prev]);
    await saveDocument('invoices', complete);
  };

  const handlePayInvoice = async (invoiceId: string) => {
    setInvoices((prev) => prev.map((i) => i.id === invoiceId ? { ...i, status: 'Paid' } : i));
    await updateDocumentFields('invoices', invoiceId, { status: 'Paid' });
  };

  const handleNotificationRead = async (notifId: string) => {
    setNotifications((prev) => prev.map((n) => n.id === notifId ? { ...n, read: true } : n));
    await updateDocumentFields('notifications', notifId, { read: true });
  };

  const handleSearch = (query: string) => {
    // Dynamic search filtering results inside parent
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#091527] text-[#D4AF37]">
        <p className="font-mono text-xs tracking-widest animate-pulse font-bold">BOOTSTRAPPING DINESYS CORES...</p>
      </div>
    );
  }

  // If no logged in profile, show luxury enterprise entry gate
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#070e1b] flex items-center justify-center p-6 text-white text-left relative overflow-hidden" id="login-screen-wrapper">
        {/* Subtle decorative mesh background */}
        <div className="absolute inset-0 bg-cover bg-center opacity-10 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80')]" />
        
        <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="login-container">
          {/* Brand Presentation Columns */}
          <div className="lg:col-span-7 space-y-6" id="login-presentation">
            <Logo size="lg" showText={true} />
            
            <div className="space-y-4">
              <h2 className="text-3xl font-black tracking-tight text-white leading-tight">
                Digital Integrated <span className="text-[#D4AF37]">Ecosystem</span> Platform
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                Integrated enterprise ecosystem orchestrating Marketplace, Vendor scorecards, Freelance Talent, SaaS licensing, and PMO milestones under the PT. Sepuh Trismatek Nusa blueprint.
              </p>
            </div>

            {/* Quick Access Roster */}
            <div className="space-y-3" id="quick-demo-access">
              <p className="text-[10px] font-bold tracking-wider text-[#D4AF37]/80 uppercase">FAST-TRACK DEMO GATEWAYS</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Super Admin', email: 'admin@dinesys.com', desc: 'All privileges' },
                  { label: 'PMO Manager', email: 'pmo@dinesys.com', desc: 'Approval pipeline' },
                  { label: 'Vendor Partner', email: 'vendor@dinesys.com', desc: 'Listing control' },
                  { label: 'Talent Student', email: 'talent@dinesys.com', desc: 'LMS Academy' }
                ].map((demo, dIdx) => (
                  <button
                    key={dIdx}
                    onClick={() => selectDemoAccount(demo.email)}
                    className="p-3 bg-slate-900/60 hover:bg-[#091527] border border-slate-800 hover:border-[#D4AF37]/50 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                  >
                    <p className="text-xs font-black text-[#D4AF37]">{demo.label}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5 truncate">{demo.email}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Secure Login Panel Card */}
          <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 backdrop-blur-md p-8 rounded-3xl space-y-6 shadow-2xl" id="login-form-card">
            <div className="text-left space-y-1">
              <h3 className="text-lg font-bold text-white">Identity Authentication</h3>
              <p className="text-xs text-slate-500">Access your business pillar registry profiles</p>
            </div>

            {authError && (
              <div className="bg-rose-500/15 border border-rose-500/30 p-3.5 rounded-xl text-xs text-rose-400 leading-relaxed">
                {authError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4" id="credentials-login-form">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Security Email ID</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. admin@dinesys.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Security Password</label>
                <input
                  type="password"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-white"
                />
              </div>

              <button
                type="submit"
                id="login-form-submit-btn"
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-xl text-xs tracking-wider uppercase transition-colors shadow-lg cursor-pointer"
              >
                Launch System Cores
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Define Active Module component map
  const renderActiveModule = () => {
    switch (activeModule) {
      case 'Dashboard':
        return <DashboardHome projects={projects} vendors={vendors} talents={talents} invoices={invoices} purchases={purchases} />;
      case 'Marketplace':
        return (
          <MarketplaceModule 
            services={services} 
            orders={orders} 
            vendors={vendors} 
            onAddOrder={handleAddOrder} 
            onUpdateOrderStatus={handleUpdateOrderStatus} 
          />
        );
      case 'Vendor Management':
        return <VendorModule vendors={vendors} onAddVendor={handleAddVendor} onUpdateVendorStatus={handleUpdateVendorStatus} />;
      case 'Talent Marketplace':
        return <TalentModule talents={talents} projects={projects} />;
      case 'Training Center':
        return <TrainingModule courses={courses} onCompleteCourse={handleCompleteCourse} />;
      case 'Clinic':
        return <ClinicModule appointments={appointments} onAddAppointment={handleAddAppointment} />;
      case 'Hospitality':
        return <HospitalityModule bookings={bookings} onAddBooking={handleAddBooking} />;
      case 'Project Management':
        return <ProjectModule projects={projects} tasks={tasks} onAddTask={handleAddTask} onUpdateTaskStatus={handleUpdateTaskStatus} />;
      case 'Procurement':
        return <ProcurementModule purchases={purchases} onAddPurchase={handleAddPurchase} onUpdatePurchaseStatus={handleUpdatePurchaseStatus} />;
      case 'CRM':
        return <CrmModule leads={leads} onAddLead={handleAddLead} onUpdateLeadStage={handleUpdateLeadStage} />;
      case 'Finance':
        return <FinanceModule invoices={invoices} services={services} onAddInvoice={handleAddInvoice} onPayInvoice={handlePayInvoice} />;
      case 'Reports':
        return <ReportsModule projects={projects} vendors={vendors} orders={orders} invoices={invoices} />;
      case 'Settings':
        return <SettingsModule />;
      default:
        return <DashboardHome projects={projects} vendors={vendors} talents={talents} invoices={invoices} purchases={purchases} />;
    }
  };

  return (
    <div className="min-h-screen mesh-bg text-slate-100 flex" id="main-application-viewport">
      {/* Dynamic Collapsible Sidebar navigation */}
      <Sidebar 
        activeModule={activeModule} 
        setActiveModule={setActiveModule} 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
      />

      {/* Main Right Side Content Panel */}
      <div className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${
        sidebarCollapsed ? 'pl-20' : 'pl-64'
      }`} id="app-body-panel">
        
        {/* Global sticky Header with notifications & utilities */}
        <Header 
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onAiAssistantToggle={() => setShowAiAssistant(!showAiAssistant)}
          onCalendarToggle={() => setShowCalendar(!showCalendar)}
          notifications={notifications}
          onNotificationRead={handleNotificationRead}
          onSearch={handleSearch}
        />

        {/* Dynamic Inner Module Content Frame */}
        <main className="p-6 flex-1 overflow-y-auto max-w-7xl w-full mx-auto" id="inner-module-frame">
          {renderActiveModule()}
        </main>
      </div>

      {/* Interactive AI Chat Assistant Drawer */}
      <AiChatAssistant 
        isOpen={showAiAssistant}
        onClose={() => setShowAiAssistant(false)} 
        projectsCount={projects.length}
        vendorsCount={vendors.length}
      />

      {/* Dynamic Scheduling Calendar Drawer */}
      <CalendarView 
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)} 
        projects={projects}
        appointments={appointments} 
        bookings={bookings} 
        tasks={tasks}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
