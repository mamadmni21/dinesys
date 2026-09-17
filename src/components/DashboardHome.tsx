/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Award, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Loader2,
  Calendar,
  Building2,
  HeartPulse,
  Code
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell
} from 'recharts';
import { Project, VendorProfile, TalentProfile, Invoice, PurchaseRequest } from '../types';

interface DashboardHomeProps {
  projects: Project[];
  vendors: VendorProfile[];
  talents: TalentProfile[];
  invoices: Invoice[];
  purchases: PurchaseRequest[];
}

export default function DashboardHome({
  projects,
  vendors,
  talents,
  invoices,
  purchases
}: DashboardHomeProps) {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  // Business Metrics Calculations
  const totalBudget = projects.reduce((acc, curr) => acc + curr.budget, 0);
  const totalSpent = projects.reduce((acc, curr) => acc + curr.spent, 0);
  const activeProjectsCount = projects.filter(p => p.status === 'In Progress').length;
  const verifiedVendorsCount = vendors.filter(v => v.verificationStatus === 'Verified').length;
  
  const totalRevenue = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Pillar Aggregates
  const pillarStats = {
    'IT Solution': { count: 0, budget: 0 },
    'Training & Certification': { count: 0, budget: 0 },
    'Clinic': { count: 0, budget: 0 },
    'MICE Hospitality': { count: 0, budget: 0 }
  };

  projects.forEach(p => {
    if (pillarStats[p.pillar]) {
      pillarStats[p.pillar].count += 1;
      pillarStats[p.pillar].budget += p.budget;
    }
  });

  // Recharts Static Data Pairs
  const monthlyRevenueData = [
    { name: 'Jan', Revenue: 45000000, BudgetSpent: 30000000 },
    { name: 'Feb', Revenue: 62000000, BudgetSpent: 40000000 },
    { name: 'Mar', Revenue: 55000000, BudgetSpent: 52000000 },
    { name: 'Apr', Revenue: 89000000, BudgetSpent: 65000000 },
    { name: 'May', Revenue: 110000000, BudgetSpent: 78000000 },
    { name: 'Jun', Revenue: totalRevenue, BudgetSpent: totalSpent } // live matching current logs
  ];

  const pillarPerformanceData = [
    { name: 'IT Solutions', Budget: pillarStats['IT Solution'].budget / 1000000 },
    { name: 'Training LMS', Budget: pillarStats['Training & Certification'].budget / 1000000 },
    { name: 'Clinic Telemed', Budget: pillarStats['Clinic'].budget / 1000000 },
    { name: 'MICE Hospitality', Budget: pillarStats['MICE Hospitality'].budget / 1000000 }
  ];

  const barColors = ['#1E3A8A', '#059669', '#F59E0B', '#6366F1'];

  const triggerAiAdvisor = async () => {
    setAiLoading(true);
    setAiAdvice(null);
    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataContext: {
            projectsCount: projects.length,
            activeProjects: activeProjectsCount,
            totalBudget,
            totalSpent,
            totalRevenue,
            unverifiedVendors: vendors.filter(v => v.verificationStatus !== 'Verified').length,
            pendingPurchases: purchases.filter(pr => pr.status === 'Pending').length,
            talentStats: talents.map(t => ({ name: t.fullName, type: t.type, skills: t.skills }))
          }
        })
      });
      const data = await response.json();
      setAiAdvice(data.recommendations);
    } catch (err) {
      console.error(err);
      setAiAdvice("❌ Offline Fallback: Server did not respond. Verify API Key and server routing.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left" id="dashboard-home-wrapper">
      
      {/* Top Banner with Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="dashboard-stats-grid">
        {/* Metric Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex items-center justify-between" id="metric-card-revenue">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Revenue</p>
            <p className="text-xl font-black text-slate-900">IDR {(totalRevenue / 1000000).toFixed(1)}M</p>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
              <TrendingUp size={11} />
              <span>+18.4% MoM Growth</span>
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <DollarSign size={20} />
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex items-center justify-between" id="metric-card-pmo">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active PMO Projects</p>
            <p className="text-xl font-black text-slate-900">{activeProjectsCount} / {projects.length}</p>
            <p className="text-[10px] text-indigo-600 font-bold">
              In IT, LMS, Clinic, and MICE
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <ShoppingBag size={20} />
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex items-center justify-between" id="metric-card-vendors">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Verified Vendors</p>
            <p className="text-xl font-black text-slate-900">{verifiedVendorsCount} / {vendors.length}</p>
            <p className="text-[10px] text-emerald-600 font-bold">
              95% Performance Avg
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Award size={20} />
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex items-center justify-between" id="metric-card-talents">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Ecosystem Talents</p>
            <p className="text-xl font-black text-slate-900">{talents.length} specialists</p>
            <p className="text-[10px] text-blue-600 font-bold">
              Students & Certified Alumni
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Users size={20} />
          </div>
        </div>
      </div>

      {/* Dynamic Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-graphs-container">
        {/* Main Growth Area Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm flex flex-col justify-between" id="growth-chart-card">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-800">Financial Performance & Budget Spent</h3>
              <p className="text-[10px] text-slate-400 font-medium">Ecosystem gross revenues vs operational project allocations (IDR)</p>
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Realtime Sync</span>
          </div>
          <div className="h-64" id="revenue-area-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip formatter={(value: any) => `IDR ${value.toLocaleString()}`} />
                <Area type="monotone" dataKey="Revenue" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="BudgetSpent" stroke="#EF4444" strokeWidth={1.5} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorSpent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pillar Portfolio Bar Chart */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm flex flex-col justify-between" id="pillar-chart-card">
          <div className="space-y-0.5 mb-4">
            <h3 className="text-sm font-bold text-slate-800">Pillar Budget Allocations</h3>
            <p className="text-[10px] text-slate-400 font-medium">Value splits across IT, LMS, Health and MICE (Millions IDR)</p>
          </div>
          <div className="h-64" id="pillar-bar-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pillarPerformanceData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={8} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip formatter={(value: any) => `IDR ${value}M`} />
                <Bar dataKey="Budget" radius={[8, 8, 0, 0]}>
                  {pillarPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive AI advisor widget */}
      <div 
        id="dashboard-ai-advisor"
        className="bg-gradient-to-r from-blue-900 via-[#0B1E36] to-slate-900 rounded-3xl p-6 text-white border border-[#D4AF37]/35 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-400 text-slate-950">
              <Sparkles size={16} className="animate-spin" />
            </div>
            <h3 className="font-bold text-sm tracking-wide text-amber-400 uppercase">DINESYS AI Strategic Advisor</h3>
          </div>
          <h4 className="text-base font-bold tracking-tight">Need immediate PMO operational advice?</h4>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
            Our embedded AI analysis agent computes portfolio risk levels, scans vendor performance scoring lists, identifies budget spent overages, and offers immediate strategic recommendation.
          </p>
          
          {aiAdvice && (
            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 mt-4 text-xs space-y-3 font-medium text-slate-200">
              {aiAdvice.split('\n\n').map((para, pIdx) => (
                <p key={pIdx} className="leading-relaxed text-left">
                  {para}
                </p>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={triggerAiAdvisor}
          id="dashboard-ai-advisor-btn"
          disabled={aiLoading}
          className="shrink-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-2xl font-black text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-amber-500/20 disabled:bg-slate-800 disabled:text-slate-500 cursor-pointer"
        >
          {aiLoading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Analyzing ecosystem...</span>
            </>
          ) : (
            <>
              <span>Compile Advice</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>

      {/* 4 Business Pillars Quick Cards */}
      <div className="space-y-3" id="dashboard-pillars-section">
        <h3 className="font-bold text-slate-800 text-sm">Strategic Business Pillars</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="dashboard-pillars-grid">
          {/* Pillar 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm space-y-3" id="pillar-card-it">
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Code size={18} />
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 font-bold rounded-full">IT Solutions</span>
            </div>
            <div className="text-left space-y-1">
              <h4 className="text-xs font-bold text-slate-800">ERP & GovTech Portals</h4>
              <p className="text-[10px] text-slate-500 leading-normal">Web and App developer models with private cloud architectures.</p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm space-y-3" id="pillar-card-training">
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award size={18} />
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 font-bold rounded-full">Academy</span>
            </div>
            <div className="text-left space-y-1">
              <h4 className="text-xs font-bold text-slate-800">Bootcamps & LMS</h4>
              <p className="text-[10px] text-slate-500 leading-normal">Online course registries and auto-verified digital certification keys.</p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm space-y-3" id="pillar-card-clinic">
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <HeartPulse size={18} />
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 font-bold rounded-full">Health</span>
            </div>
            <div className="text-left space-y-1">
              <h4 className="text-xs font-bold text-slate-800">Telemedicine Care</h4>
              <p className="text-[10px] text-slate-500 leading-normal">Patient consultations scheduler, records lists, and clinician guides.</p>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm space-y-3" id="pillar-card-hospitality">
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Building2 size={18} />
              </div>
              <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 font-bold rounded-full">Hospitality</span>
            </div>
            <div className="text-left space-y-1">
              <h4 className="text-xs font-bold text-slate-800">MICE Venue Booking</h4>
              <p className="text-[10px] text-slate-500 leading-normal">Smart auditorium bookings, catering suppliers, and registration lists.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
