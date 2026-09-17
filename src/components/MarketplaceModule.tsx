/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Star, 
  CheckCircle2, 
  Send, 
  FileText, 
  Clock, 
  PenTool, 
  DollarSign, 
  CheckSquare,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { ServiceProduct, Order, VendorProfile } from '../types';

interface MarketplaceModuleProps {
  services: ServiceProduct[];
  orders: Order[];
  vendors: VendorProfile[];
  onAddOrder: (order: Partial<Order>) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export default function MarketplaceModule({
  services,
  orders,
  vendors,
  onAddOrder,
  onUpdateOrderStatus
}: MarketplaceModuleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'IT Solution' | 'Training & Certification' | 'Clinic' | 'MICE Hospitality'>('All');
  const [selectedService, setSelectedService] = useState<ServiceProduct | null>(null);
  
  // Quotation form states
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [customerOrg, setCustomerOrg] = useState('');
  const [projectBrief, setProjectBrief] = useState('');
  const [hasSignedContract, setHasSignedContract] = useState<Record<string, boolean>>({});

  const filteredServices = services.filter((srv) => {
    const matchesSearch = srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          srv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          srv.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || srv.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRequestQuotation = (srv: ServiceProduct) => {
    setSelectedService(srv);
    setShowRequestForm(true);
  };

  const submitQuotationRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    onAddOrder({
      customerName: customerOrg || 'Enterprise Client',
      serviceId: selectedService.id,
      serviceTitle: selectedService.title,
      vendorId: selectedService.vendorId,
      price: selectedService.price,
      status: 'Pending',
      createdAt: new Date().toISOString()
    });

    // Reset Form
    setCustomerOrg('');
    setProjectBrief('');
    setShowRequestForm(false);
    setSelectedService(null);
  };

  const handleSignContract = (orderId: string) => {
    setHasSignedContract((prev) => ({ ...prev, [orderId]: true }));
    onUpdateOrderStatus(orderId, 'In Progress');
  };

  return (
    <div className="space-y-6 text-left" id="marketplace-module-wrapper">
      
      {/* Category Tabs & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm" id="marketplace-filters">
        <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none" id="category-selector-tabs">
          {(['All', 'IT Solution', 'Training & Certification', 'Clinic', 'MICE Hospitality'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/40'
              }`}
            >
              {cat === 'All' ? 'All Pillars' : cat}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full" id="marketplace-search">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search core services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Grid Services list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="marketplace-grid">
        {filteredServices.map((srv) => {
          const srvVendor = vendors.find(v => v.id === srv.vendorId);
          return (
            <div
              key={srv.id}
              className="bg-white rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
              id={`service-card-${srv.id}`}
            >
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-100">
                    {srv.subcategory}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-bold text-slate-700">{srv.rating.toFixed(1)}</span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">{srv.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{srv.description}</p>
                
                {/* Vendor profile badge inside card */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-[10px]">
                    {srv.vendorName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-[10px] font-bold text-slate-700 truncate">{srv.vendorName}</p>
                      {srvVendor?.verificationStatus === 'Verified' && (
                        <ShieldCheck size={11} className="text-blue-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[9px] text-slate-400">Vendor Score: {srvVendor?.performanceScore || 90}%</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between" id={`service-footer-${srv.id}`}>
                <div className="text-left">
                  <span className="text-[9px] uppercase font-semibold text-slate-400 tracking-wider">Est. Cost</span>
                  <p className="text-xs font-extrabold text-slate-900">IDR {srv.price.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => handleRequestQuotation(srv)}
                  id={`request-quote-btn-${srv.id}`}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  <span>Request Quote</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Orders Tracking Dashboard */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="marketplace-orders">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-left">
          <ShoppingBag size={16} className="text-amber-500" />
          <h3 className="font-bold text-slate-800 text-sm">Active Procurement & Quotation Tracks</h3>
        </div>

        <div className="overflow-x-auto" id="orders-table-container">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold bg-slate-50/50">
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Client Org</th>
                <th className="py-2.5 px-3">Core Service Requested</th>
                <th className="py-2.5 px-3">Est. Value</th>
                <th className="py-2.5 px-3">Status Pipeline</th>
                <th className="py-2.5 px-3">Actions / Digital Contract</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((ord) => {
                const signed = hasSignedContract[ord.id] || ord.status === 'In Progress' || ord.status === 'Completed';
                return (
                  <tr key={ord.id} className="hover:bg-slate-50/50" id={`order-row-${ord.id}`}>
                    <td className="py-3 px-3 font-mono font-bold text-slate-600">{ord.id}</td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{ord.customerName}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{ord.serviceTitle}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">IDR {ord.price.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                          ord.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800'
                            : ord.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {ord.status === 'Completed' ? (
                          <CheckCircle2 size={10} />
                        ) : ord.status === 'In Progress' ? (
                          <Clock size={10} className="animate-pulse" />
                        ) : (
                          <FileText size={10} />
                        )}
                        <span>{ord.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {ord.status === 'Pending' && (
                        <div className="flex gap-1.5" id={`order-actions-pending-${ord.id}`}>
                          <button
                            onClick={() => onUpdateOrderStatus(ord.id, 'Approved')}
                            className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[9px] transition-colors cursor-pointer shadow-sm"
                          >
                            Send Proposal
                          </button>
                        </div>
                      )}
                      {ord.status === 'Approved' && (
                        <button
                          onClick={() => handleSignContract(ord.id)}
                          className="px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-[10px] flex items-center gap-1 cursor-pointer shadow-sm transition-all hover:scale-[1.02]"
                          id={`sign-contract-${ord.id}`}
                        >
                          <PenTool size={11} />
                          <span>Sign Digital Contract</span>
                        </button>
                      )}
                      {signed && ord.status === 'In Progress' && (
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'Completed')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] cursor-pointer"
                        >
                          Mark Project Completed
                        </button>
                      )}
                      {ord.status === 'Completed' && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                          <CheckSquare size={12} />
                          <span>Delivered & Billed</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quotation Request PopUp Modal */}
      {showRequestForm && selectedService && (
        <div
          id="quotation-modal-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-200" id="quotation-modal">
            <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Star size={14} className="text-amber-500" />
              <span>Submit Project Request / Quotation RFP</span>
            </h4>
            <p className="text-xs text-slate-500 mb-4">Requesting: {selectedService.title}</p>
            
            <form onSubmit={submitQuotationRequest} className="space-y-4 text-left" id="quotation-request-form">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Your Organization Name</label>
                <input
                  type="text"
                  required
                  value={customerOrg}
                  onChange={(e) => setCustomerOrg(e.target.value)}
                  placeholder="e.g. Universitas Terbuka, MIK"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Project Brief & Requirements</label>
                <textarea
                  required
                  rows={3}
                  value={projectBrief}
                  onChange={(e) => setProjectBrief(e.target.value)}
                  placeholder="Detail scope of work, timeline constraints, expected deliverables..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/40 text-[10px] text-slate-500 leading-normal flex gap-1.5">
                <FileText size={14} className="shrink-0 text-slate-400" />
                <span>By submitting, DINESYS routing will automatically dispatch this request directly to {selectedService.vendorName} for official pricing and digital contract terms drafting.</span>
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  id="quote-cancel-btn"
                  onClick={() => setShowRequestForm(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="quote-submit-btn"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
