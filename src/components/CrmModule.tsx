/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Trash2, 
  TrendingUp, 
  User, 
  Phone, 
  DollarSign, 
  Briefcase, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { Lead } from '../types';

interface CrmModuleProps {
  leads: Lead[];
  onAddLead: (lead: Partial<Lead>) => void;
  onUpdateLeadStage: (leadId: string, stage: Lead['stage']) => void;
}

export default function CrmModule({
  leads,
  onAddLead,
  onUpdateLeadStage
}: CrmModuleProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [comp, setComp] = useState('');
  const [email, setEmail] = useState('');
  const [val, setVal] = useState(150000000);
  const [leadSource, setLeadSource] = useState('Website');

  const [interactions, setInteractions] = useState<{ date: string; summary: string; staff: string }[]>([
    { date: '2026-06-22', summary: 'Sent technical RFP scope draft to Budi Hartono (Djarum).', staff: 'Ahmad Sepuh' },
    { date: '2026-06-25', summary: 'Negotiated final subscription terms with Sinar Mas Group.', staff: 'Ismanto PMO' }
  ]);

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comp) return;

    onAddLead({
      name,
      company: comp,
      email,
      value: val,
      stage: 'Lead',
      source: leadSource,
      lastContact: new Date().toISOString().split('T')[0]
    });

    setName('');
    setComp('');
    setEmail('');
    setShowForm(false);
  };

  const activeDealsValue = leads
    .filter(l => l.stage !== 'Lost' && l.stage !== 'Won')
    .reduce((acc, curr) => acc + curr.value, 0);

  const wonDealsValue = leads
    .filter(l => l.stage === 'Won')
    .reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6 text-left" id="crm-module-wrapper">
      
      {/* Upper Pipeline metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="crm-metrics">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex items-center justify-between" id="crm-metric-deals">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold uppercase text-slate-400">Deals in Pipeline</p>
            <p className="text-lg font-black text-slate-800">IDR {(activeDealsValue / 1000000).toFixed(1)}M</p>
            <p className="text-[10px] text-slate-500 font-medium">IT, Training, and MICE opportunities</p>
          </div>
          <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Target size={18} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex items-center justify-between" id="crm-metric-won">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold uppercase text-slate-400">Total Won Revenue</p>
            <p className="text-lg font-black text-slate-800">IDR {(wonDealsValue / 1000000).toFixed(1)}M</p>
            <p className="text-[10px] text-emerald-600 font-bold">Closed Deals Successful</p>
          </div>
          <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp size={18} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-center text-center" id="crm-lead-btn-box">
          <button
            onClick={() => setShowForm(true)}
            id="create-lead-btn"
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Sales Opportunity</span>
          </button>
        </div>
      </div>

      {/* Interactive Sales Funnel columns */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="crm-funnel">
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
          <Target size={15} className="text-blue-600" />
          <h3 className="font-bold text-slate-800 text-sm">Interactive Sales Funnel Pipeline</h3>
        </div>

        {/* Pipelines column grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="crm-funnel-columns">
          {(['Lead', 'Proposal', 'Negotiation', 'Won'] as const).map((stage) => {
            const stageLeads = leads.filter(l => l.stage === stage);
            return (
              <div key={stage} className="bg-slate-50 p-3 rounded-2xl flex flex-col space-y-3 min-h-[200px]" id={`crm-stage-col-${stage.toLowerCase()}`}>
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-black uppercase text-slate-500">{stage}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto">
                  {stageLeads.map((ld) => (
                    <div key={ld.id} className="bg-white p-3 rounded-xl border border-slate-200/50 shadow-sm space-y-2 text-left" id={`lead-card-${ld.id}`}>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{ld.company}</h4>
                        <p className="text-[9px] text-slate-400">Contact: {ld.name} ({ld.email})</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-black text-slate-800">IDR {(ld.value / 1000000).toFixed(1)}M</span>
                        
                        {stage !== 'Won' && (
                          <button
                            onClick={() => {
                              const nextMap: Record<Lead['stage'], Lead['stage']> = {
                                'Lead': 'Proposal',
                                'Contacted': 'Proposal',
                                'Proposal': 'Negotiation',
                                'Negotiation': 'Won',
                                'Won': 'Won',
                                'Lost': 'Lead'
                              };
                              onUpdateLeadStage(ld.id, nextMap[ld.stage]);
                            }}
                            className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer"
                            title="Advance Pipeline Deal"
                          >
                            <ArrowRight size={11} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leads follow up interactions list */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="crm-interactions">
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
          <Clock size={15} className="text-slate-500" />
          <h3 className="font-bold text-slate-800 text-sm">Client Interaction & Follow-Up Diaries</h3>
        </div>

        <div className="space-y-3" id="crm-interactions-list">
          {interactions.map((int, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/40 p-3.5 rounded-2xl text-left space-y-1" id={`interaction-item-${idx}`}>
              <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                <span>Contact Date: {int.date}</span>
                <span>Owner: {int.staff}</span>
              </div>
              <p className="text-xs font-medium text-slate-700 leading-normal">{int.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Creation Modal form */}
      {showForm && (
        <div
          id="crm-modal-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-200" id="crm-modal">
            <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Target size={14} className="text-blue-600" />
              <span>Add Sales Pipeline Opportunity</span>
            </h4>
            <p className="text-xs text-slate-500 mb-4">Log a prospect customer account and pipeline target values.</p>

            <form onSubmit={handleCreateLead} className="space-y-4 text-left" id="crm-opportunity-form">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Corporate Account Name</label>
                <input
                  type="text"
                  required
                  value={comp}
                  onChange={(e) => setComp(e.target.value)}
                  placeholder="e.g. Sinar Mas Group IT division"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Contact Person Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Linda Kusuma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">E-Mail Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="linda@sinarmas.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Deal Target Outlay (IDR)</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={val}
                    onChange={(e) => setVal(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Acquisition Source</label>
                  <select
                    value={leadSource}
                    onChange={(e) => setLeadSource(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Conference">Annual Conference MICE</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Create Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
