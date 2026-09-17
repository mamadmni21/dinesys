/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Clock, 
  Award,
  UsersRound,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { PurchaseRequest } from '../types';
import { useAuth } from '../context/AuthContext';

interface ProcurementModuleProps {
  purchases: PurchaseRequest[];
  onAddPurchase: (pr: Partial<PurchaseRequest>) => void;
  onUpdatePurchaseStatus: (prId: string, status: PurchaseRequest['status']) => void;
}

export default function ProcurementModule({
  purchases,
  onAddPurchase,
  onUpdatePurchaseStatus
}: ProcurementModuleProps) {
  const { role } = useState(useAuth());
  const [showPrForm, setShowPrForm] = useState(false);
  const [itemName, setItemName] = useState('');
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(5000000);
  const [dept, setDept] = useState('PMO - IT Pillar');

  const mockTendersList = [
    { id: 't-801', title: 'Clinic Telemedicine EHR Server Security Cryptography', proposals: 3, budget: 'IDR 50,000,000', deadline: '2026-07-10', selected: 'Pending' },
    { id: 't-802', title: 'Grand Auditorium Video Projection Upgrades UT', proposals: 2, budget: 'IDR 15,000,000', deadline: '2026-06-29', selected: 'Nusantara Cloud Services' }
  ];

  const handlePrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName) return;

    onAddPurchase({
      requesterName: 'Enterprise Department Head',
      department: dept,
      totalAmount: qty * price,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
      items: [{ description: itemName, quantity: qty, estimatedPrice: price }]
    });

    setItemName('');
    setQty(1);
    setShowPrForm(false);
  };

  return (
    <div className="space-y-6 text-left" id="procurement-module-wrapper">
      
      {/* Header and PR trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm" id="procurement-header-controls">
        <div className="text-left space-y-0.5">
          <h3 className="text-sm font-black text-slate-800">Ecosystem Procurement & Supply Lines</h3>
          <p className="text-[10px] text-slate-400 font-medium">Approve purchase requests or launch vendor selection tenders</p>
        </div>

        <button
          onClick={() => setShowPrForm(true)}
          id="create-pr-btn"
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={14} />
          <span>New Purchase Request (PR)</span>
        </button>
      </div>

      {/* Grid: Active PR logs */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="procurement-prs">
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
          <ShoppingCart size={15} className="text-blue-600" />
          <h3 className="font-bold text-slate-800 text-sm">Purchase Request Registers (PR)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="prs-grid">
          {purchases.map((pr) => (
            <div key={pr.id} className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-4 flex flex-col justify-between space-y-3" id={`pr-item-${pr.id}`}>
              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-black text-slate-500">PR REF: {pr.id}</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                    pr.status === 'Approved'
                      ? 'bg-emerald-50 text-emerald-800'
                      : pr.status === 'Rejected'
                      ? 'bg-rose-50 text-rose-800'
                      : 'bg-amber-50 text-amber-800'
                  }`}>
                    {pr.status}
                  </span>
                </div>

                <div className="space-y-1">
                  {pr.items && pr.items.map((item, iIdx) => (
                    <h4 key={iIdx} className="text-xs font-black text-slate-800">
                      {item.description} (Qty: {item.quantity} • IDR {item.estimatedPrice.toLocaleString()})
                    </h4>
                  ))}
                  <p className="text-[10px] text-slate-400">Department: {pr.department} • Requester: {pr.requesterName}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/30 flex items-center justify-between" id={`pr-footer-${pr.id}`}>
                <div className="text-left">
                  <span className="text-[8px] uppercase font-bold text-slate-400 tracking-wider">Estimated Outlay</span>
                  <p className="text-xs font-black text-slate-800">IDR {pr.totalAmount.toLocaleString()}</p>
                </div>

                {pr.status === 'Pending' && (
                  <div className="flex gap-1.5" id={`pr-approval-actions-${pr.id}`}>
                    <button
                      onClick={() => onUpdatePurchaseStatus(pr.id, 'Approved')}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
                      id={`pr-approve-btn-${pr.id}`}
                    >
                      <CheckCircle size={10} />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => onUpdatePurchaseStatus(pr.id, 'Rejected')}
                      className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/40 rounded-lg text-[10px] cursor-pointer"
                      id={`pr-reject-btn-${pr.id}`}
                    >
                      <XCircle size={10} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tender Selection Registry */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="procurement-tenders">
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3 text-left">
          <Award size={15} className="text-amber-500" />
          <h3 className="font-bold text-slate-800 text-sm">Competitive Tenders & Vendor Selection</h3>
        </div>

        <div className="overflow-x-auto" id="tenders-table-container">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold bg-slate-50">
                <th className="py-2 px-3">Tender RFP ID</th>
                <th className="py-2 px-3">RFP Description Topic</th>
                <th className="py-2 px-3">Competitive Bids</th>
                <th className="py-2 px-3">RFP Target Cap</th>
                <th className="py-2 px-3">Selection Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockTendersList.map((ten) => (
                <tr key={ten.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-500">{ten.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-700">{ten.title}</td>
                  <td className="py-2.5 px-3 font-semibold text-indigo-600">{ten.proposals} submittals</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{ten.budget}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      ten.selected === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-800'
                    }`}>
                      {ten.selected}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchase Request Creation Modal */}
      {showPrForm && (
        <div
          id="pr-modal-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-200" id="pr-modal">
            <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <ShoppingCart size={14} className="text-blue-600" />
              <span>Draft Purchase Request (PR)</span>
            </h4>
            <p className="text-xs text-slate-500 mb-4">Draft operational requirements and trigger PMO review workflow.</p>

            <form onSubmit={handlePrSubmit} className="space-y-4 text-left" id="pr-creation-form">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Purchase Item / Service Details</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. 5 Private CDN Server clusters hosting for LMS"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Quantity</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Estimated Unit Cost</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Requesting Department</label>
                <select
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="PMO - IT Pillar">PMO - IT Pillar</option>
                  <option value="PMO - Academy Pillar">PMO - Academy Pillar</option>
                  <option value="PMO - Clinic Pillar">PMO - Clinic Pillar</option>
                  <option value="PMO - Hospitality Pillar">PMO - Hospitality Pillar</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowPrForm(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Dispatch Request (PR)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
