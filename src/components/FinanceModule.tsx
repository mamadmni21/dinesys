/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Clock, 
  CheckCircle, 
  RefreshCw, 
  Download, 
  HelpCircle,
  Cpu,
  BadgePercent,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { Invoice, ServiceProduct } from '../types';

interface FinanceModuleProps {
  invoices: Invoice[];
  services: ServiceProduct[];
  onAddInvoice: (invoice: Partial<Invoice>) => void;
  onPayInvoice: (invoiceId: string) => void;
}

export default function FinanceModule({
  invoices,
  services,
  onAddInvoice,
  onPayInvoice
}: FinanceModuleProps) {
  const [showSubForm, setShowSubForm] = useState(false);
  const [saasProduct, setSaasProduct] = useState('DINESYS ERP Enterprise Core Suite');
  const [billCycle, setBillCycle] = useState<'Monthly' | 'Annually'>('Monthly');
  const [billingCompany, setBillingCompany] = useState('');
  
  // Invoice details preview modal
  const [selectedReceipt, setSelectedReceipt] = useState<Invoice | null>(null);

  const saasCatalog = [
    { name: 'DINESYS ERP Enterprise Core Suite', cost: 12500000, desc: 'Complete enterprise resource planning, workflow builders, database connectors.' },
    { name: 'Academic LMS Portal Engine', cost: 7500000, desc: 'LMS systems, video CDN, interactive multiple-choice quiz engines, digital certificates.' },
    { name: 'Telemedicine Core EHR Hub', cost: 9500000, desc: 'Secure electronic health record registers, consult appointment workflows.' }
  ];

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = saasCatalog.find(s => s.name === saasProduct);
    if (!prod) return;

    const baseCost = prod.cost;
    const finalCost = billCycle === 'Annually' ? baseCost * 10 : baseCost; // 2 months discount

    onAddInvoice({
      recipientName: billingCompany || 'Enterprise SaaS Client',
      recipientEmail: 'finance@enterprise-tenant.com',
      amount: finalCost,
      status: 'Unpaid',
      dueDate: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString().split('T')[0],
      issuedDate: new Date().toISOString().split('T')[0]
    });

    setBillingCompany('');
    setShowSubForm(false);
  };

  return (
    <div className="space-y-6 text-left" id="finance-module-wrapper">
      
      {/* SaaS Catalog and triggers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="finance-top-grid">
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="saas-catalog-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-left">
            <div className="flex items-center gap-1.5">
              <Cpu size={16} className="text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm">Enterprise SaaS Solutions Directory</h3>
            </div>

            <button
              onClick={() => setShowSubForm(true)}
              id="saas-subscribe-btn"
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
            >
              Activate SaaS Tenant
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="saas-directory-grid">
            {saasCatalog.map((saas, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200/50 p-4 rounded-2xl text-left flex flex-col justify-between h-40" id={`saas-item-${idx}`}>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-900 leading-tight line-clamp-1">{saas.name}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{saas.desc}</p>
                </div>
                <div className="pt-2 border-t border-slate-200/20 flex items-center justify-between text-[10px] font-bold text-slate-800">
                  <span className="text-blue-600">IDR {saas.cost.toLocaleString()} / mo</span>
                  <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded-lg text-[8px] font-extrabold uppercase">SaaS Module</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Discounts */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="pricing-discounts-card">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 text-left">
            <BadgePercent size={18} className="text-amber-500 animate-pulse" />
            <h3 className="font-bold text-slate-800 text-sm">Corporate Promotions</h3>
          </div>

          <div className="bg-amber-50/25 border border-amber-100/40 p-4 rounded-2xl text-left space-y-2">
            <span className="text-[9px] uppercase font-bold text-amber-800 tracking-wider">ANNUAL PACK OFFER</span>
            <h4 className="text-xs font-black text-slate-800">Get 2 Months Free SaaS</h4>
            <p className="text-[10px] text-slate-500 leading-normal">
              Activate licensing for 12 months today and automatically redeem a discount deduction equal to 2 billing cycles.
            </p>
          </div>
        </div>
      </div>

      {/* Invoice billing logs */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="billing-ledger">
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3 text-left">
          <CreditCard size={15} className="text-emerald-500" />
          <h3 className="font-bold text-slate-800 text-sm">Active Invoicing & Receipts</h3>
        </div>

        <div className="overflow-x-auto" id="billing-table-container">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold bg-slate-50">
                <th className="py-2.5 px-3">Invoice Ref</th>
                <th className="py-2.5 px-3">Client Company</th>
                <th className="py-2.5 px-3">Product Core</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3">Billed Sum</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50" id={`invoice-row-${inv.id}`}>
                  <td className="py-3 px-3 font-mono font-bold text-slate-500">{inv.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-700">{inv.recipientName}</td>
                  <td className="py-3 px-3 text-slate-800 font-medium">{inv.orderId ? `Order #${inv.orderId}` : 'SaaS Active Tenant Licence'}</td>
                  <td className="py-3 px-3 text-slate-400 font-bold">{inv.dueDate}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">IDR {inv.amount.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                      inv.status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-rose-50 text-rose-800'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex gap-2" id={`invoice-actions-${inv.id}`}>
                      {inv.status === 'Unpaid' && (
                        <button
                          onClick={() => onPayInvoice(inv.id)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[9px] font-bold cursor-pointer shadow-sm"
                          id={`pay-btn-${inv.id}`}
                        >
                          Settle Invoice
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedReceipt(inv)}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
                        title="Download Receipt PDF"
                      >
                        <Download size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SaaS Subscribe popup modal */}
      {showSubForm && (
        <div
          id="saas-modal-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-200" id="saas-modal">
            <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Cpu size={14} className="text-blue-600" />
              <span>Draft SaaS License Subscription</span>
            </h4>
            <p className="text-xs text-slate-500 mb-4">Provision a private container tenant for corporate deployment.</p>

            <form onSubmit={handleSubscribeSubmit} className="space-y-4 text-left" id="saas-subscription-form">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Corporate Account Name</label>
                <input
                  type="text"
                  required
                  value={billingCompany}
                  onChange={(e) => setBillingCompany(e.target.value)}
                  placeholder="e.g. PT. Sinar Mas IT Division"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Select SaaS Product</label>
                <select
                  value={saasProduct}
                  onChange={(e) => setSaasProduct(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {saasCatalog.map((s, idx) => (
                    <option key={idx} value={s.name}>
                      {s.name} (IDR {s.cost.toLocaleString()} / mo)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Billing Cycle Frequency</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="billCycle"
                      checked={billCycle === 'Monthly'}
                      onChange={() => setBillCycle('Monthly')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Monthly Cycle</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="billCycle"
                      checked={billCycle === 'Annually'}
                      onChange={() => setBillCycle('Annually')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Annually Cycle (2 Months Free)</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowSubForm(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Provision Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice receipt visualization popup */}
      {selectedReceipt && (
        <div
          id="receipt-modal-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-[#111827] text-white rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-amber-400/40 text-center" id="receipt-modal">
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl text-amber-400">💵</span>
                <h4 className="text-sm font-black text-amber-400 tracking-wider">OFFICIAL DINESYS BILL RECEIPT</h4>
                <p className="text-[8px] text-slate-400 uppercase tracking-widest">UT Digital Business Ecosystem</p>
              </div>

              <div className="border-t border-b border-dashed border-slate-700 py-3 space-y-1.5 text-left text-[11px] leading-relaxed font-mono">
                <p className="flex justify-between">
                  <span className="text-slate-400">Invoice Ref:</span>
                  <span className="font-bold">{selectedReceipt.id}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-400">Billing Date:</span>
                  <span className="font-bold">{selectedReceipt.issuedDate}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-400">SaaS License:</span>
                  <span className="font-bold text-right truncate max-w-[150px]">{selectedReceipt.orderId ? `Order #${selectedReceipt.orderId}` : 'SaaS Active Tenant Licence'}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-400">Client Org:</span>
                  <span className="font-bold text-right truncate max-w-[150px]">{selectedReceipt.recipientName}</span>
                </p>
              </div>

              <div className="text-left py-1">
                <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider">TOTAL SETTLED OUTLAY</span>
                <p className="text-lg font-black text-white">IDR {selectedReceipt.amount.toLocaleString()}</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-[9px] text-slate-400 leading-normal flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Synchronized Ledger signature matched successfully with PT Sepuh Trismatek Nusa bank gateway.</span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md"
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
