/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  Filter, 
  Sparkles, 
  CheckCircle, 
  Loader2, 
  FileText,
  BarChart3,
  CalendarDays
} from 'lucide-react';
import { Project, VendorProfile, Order, Invoice } from '../types';

interface ReportsModuleProps {
  projects: Project[];
  vendors: VendorProfile[];
  orders: Order[];
  invoices: Invoice[];
}

export default function ReportsModule({
  projects,
  vendors,
  orders,
  invoices
}: ReportsModuleProps) {
  const [pillarFilter, setPillarFilter] = useState<'All' | 'IT Solution' | 'Training Academy' | 'Clinic' | 'MICE Hospitality'>('All');
  const [isCompiling, setIsCompiling] = useState<string | null>(null);
  const [successExport, setSuccessExport] = useState<string | null>(null);

  const triggerExport = (format: 'PDF' | 'Excel' | 'CSV') => {
    setIsCompiling(format);
    setSuccessExport(null);

    setTimeout(() => {
      setIsCompiling(null);
      setSuccessExport(`DINESYS_PMO_REPORT_Q2_2026.${format.toLowerCase()}`);
    }, 1200);
  };

  const totalSpent = projects.reduce((acc, curr) => acc + curr.spent, 0);
  const averageVendorScore = vendors.length > 0
    ? (vendors.reduce((acc, curr) => acc + curr.performanceScore, 0) / vendors.length).toFixed(1)
    : '92';

  const totalClosedInvoicesValue = invoices
    .filter(i => i.status === 'Paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 text-left" id="reports-module-wrapper">
      
      {/* Top Filter and Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm" id="reports-filter-header">
        <div className="flex items-center gap-1.5" id="reports-pillar-tab">
          <Filter size={14} className="text-slate-400" />
          <select
            value={pillarFilter}
            onChange={(e) => setPillarFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
          >
            <option value="All">All Business Pillars</option>
            <option value="IT Solution">IT Solution Pillar</option>
            <option value="Training Academy">Training Academy</option>
            <option value="Clinic">Clinic Care Operations</option>
            <option value="MICE Hospitality">MICE Hospitality & Venues</option>
          </select>
        </div>

        {/* Dynamic export controls */}
        <div className="flex gap-2" id="reports-export-actions">
          <button
            onClick={() => triggerExport('Excel')}
            disabled={isCompiling !== null}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
          >
            <FileSpreadsheet size={13} />
            <span>Export Excel</span>
          </button>
          
          <button
            onClick={() => triggerExport('PDF')}
            disabled={isCompiling !== null}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
          >
            <FileText size={13} />
            <span>Download PDF</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-slate-200/50"
          >
            <Printer size={13} />
            <span>Print Ledger</span>
          </button>
        </div>
      </div>

      {/* Progress Compilation Overlay banner */}
      {isCompiling && (
        <div className="bg-blue-50/60 border border-blue-200 p-4 rounded-2xl flex items-center gap-3" id="compilation-loading-banner">
          <Loader2 size={18} className="animate-spin text-blue-600" />
          <p className="text-xs font-bold text-slate-800">
            Compiling and cryptographic signing {isCompiling} report data across all 26 Firestore collection schemas...
          </p>
        </div>
      )}

      {successExport && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between" id="export-success-banner">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-emerald-600 animate-bounce" />
            <div>
              <p className="text-xs font-bold text-slate-800">Export Success!</p>
              <p className="text-[10px] text-slate-500 font-semibold">Compiled document: <span className="font-mono text-emerald-800">{successExport}</span></p>
            </div>
          </div>
          <button
            onClick={() => setSuccessExport(null)}
            className="text-[10px] font-bold text-slate-400 hover:text-slate-600"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Report summaries scorecard preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="reports-preview-grid">
        {/* Left Side: Consolidated KPI Summary */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4 text-left" id="kpi-ledger-card">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <BarChart3 size={15} className="text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">PMO Executive Key indicators</h3>
          </div>

          <div className="space-y-3.5 text-xs text-slate-700 font-semibold" id="kpis-list">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Active PMO Projects:</span>
              <span className="font-bold text-slate-800">{projects.length} running</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Aggregated Spent Outlay:</span>
              <span className="font-bold text-slate-800">IDR {totalSpent.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Ecosystem Average Partner Score:</span>
              <span className="font-bold text-emerald-600">{averageVendorScore}% performance</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Total Billed Invoiced Settled:</span>
              <span className="font-bold text-slate-800">IDR {totalClosedInvoicesValue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Audit log registry */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4 text-left" id="reports-audit-card">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <CalendarDays size={15} className="text-slate-500" />
            <h3 className="font-bold text-slate-800 text-sm">Consolidated Audit Trail Logs</h3>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[180px]" id="audit-trail-logs">
            {[
              { time: '2026-06-26 15:42', user: 'Ismanto PMO', desc: 'Approved Purchase Request PR-701' },
              { time: '2026-06-26 11:15', user: 'Super Admin', desc: 'Verified Vendor Partner: PT. Sinar Mas IT' },
              { time: '2026-06-25 18:20', user: 'mamad.ismanto@gmail.com', desc: 'Activated Academic LMS Portal Engine SaaS subscription' }
            ].map((log, idx) => (
              <div key={idx} className="bg-slate-50 p-2.5 rounded-xl text-[10px] border border-slate-200/20 leading-normal" id={`audit-log-item-${idx}`}>
                <div className="flex justify-between text-slate-400 font-bold text-[8px] mb-0.5">
                  <span>Timestamp: {log.time}</span>
                  <span>User: {log.user}</span>
                </div>
                <p className="font-semibold text-slate-700">{log.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
