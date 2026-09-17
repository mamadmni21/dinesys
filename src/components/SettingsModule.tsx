/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  ShieldAlert, 
  CheckSquare, 
  RefreshCw, 
  Lock, 
  FileText,
  BadgeAlert,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SettingsModule() {
  const { user, role, switchRole } = useAuth();
  const [successMsg, setSuccessMsg] = useState(false);

  // Configuration states
  const [enableAi, setEnableAi] = useState(true);
  const [autoApprovePR, setAutoApprovePR] = useState(false);
  const [strictBackground, setStrictBackground] = useState(true);

  const availableRoles = [
    { title: 'Super Admin', desc: 'Complete read, write, audit, and administrative blacklist privileges across all 4 pillars.' },
    { title: 'PMO Manager', desc: 'Can approve purchase requests, schedule consultations, and manage Kanban pipelines.' },
    { title: 'Executive', desc: 'View dashboards, compile executive reports, and download Excel/PDF rosters.' },
    { title: 'Vendor', desc: 'View marketplace quotation RFPs and update corporate service listings.' },
    { title: 'Student', desc: 'Access LMS training programs, take chapter quiz exams, and download completion certificates.' }
  ];

  const handleSaveConfigs = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 text-left" id="settings-module-wrapper">
      
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-2" id="settings-success-alert">
          <CheckCircle2 size={16} className="text-emerald-600 animate-pulse" />
          <p className="text-xs font-bold text-slate-800">DINESYS system parameters saved successfully!</p>
        </div>
      )}

      {/* Role Play / RBAC Testbed switcher */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="rbac-roleplay-card">
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3 text-left">
          <ShieldAlert size={16} className="text-blue-600" />
          <h3 className="font-bold text-slate-800 text-sm">Demo RBAC Simulator (Role Switcher)</h3>
        </div>

        <p className="text-xs text-slate-500 leading-normal">
          Toggle roles dynamically to simulate exactly how different user personas see and interact with the DINESYS system pillars, menus, and approval gates.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2" id="rbac-roles-grid">
          {availableRoles.map((r, idx) => {
            const isActive = role === r.title;
            return (
              <button
                key={idx}
                onClick={() => switchRole(r.title as any)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-36 transition-all cursor-pointer ${
                  isActive
                    ? 'border-blue-600 bg-blue-50/10 shadow-sm ring-1 ring-blue-500'
                    : 'border-slate-200 hover:bg-slate-50/60'
                }`}
                id={`rbac-role-btn-${r.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1">
                    <span>{r.title}</span>
                    {isActive && <CheckCircle2 size={12} className="text-blue-600" />}
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-normal">{r.desc}</p>
                </div>

                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                  {isActive ? 'Current Identity' : 'Simulate Role'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile & Security panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="settings-details-grid">
        
        {/* Profile Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4 flex flex-col justify-between h-64" id="settings-profile-card">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <User size={15} className="text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm">Active Account Session</h3>
            </div>

            <div className="space-y-1.5 text-left text-xs" id="profile-meta-details">
              <p className="text-slate-500 font-semibold">User E-Mail ID:</p>
              <p className="font-bold text-slate-800 truncate">{user?.email || 'mamad.ismanto@gmail.com'}</p>

              <p className="text-slate-500 font-semibold pt-1">Active RBAC Identity:</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-800 border border-blue-100 uppercase tracking-widest mt-1">
                {role}
              </span>
            </div>
          </div>

          <div className="text-[9px] text-slate-400 font-semibold flex items-center gap-1">
            <Lock size={11} />
            <span>Encrypted via Firestore Firebase Auth token</span>
          </div>
        </div>

        {/* Global Configurations Form */}
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="settings-configs-card">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <Sliders size={15} className="text-blue-500" />
            <h3 className="font-bold text-slate-800 text-sm">System Parameter Switches</h3>
          </div>

          <form onSubmit={handleSaveConfigs} className="space-y-4" id="configs-switch-form">
            <div className="space-y-3" id="config-checkboxes">
              
              <label className="flex items-start gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 border border-slate-100/40 text-left">
                <input
                  type="checkbox"
                  checked={enableAi}
                  onChange={(e) => setEnableAi(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mt-0.5"
                />
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-slate-800">Enable Server-Side AI Recommendations</p>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Let Gemini flash model analyze PMO risk coefficients and budget overruns on each dashboard launch.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 border border-slate-100/40 text-left">
                <input
                  type="checkbox"
                  checked={autoApprovePR}
                  onChange={(e) => setAutoApprovePR(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mt-0.5"
                />
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-slate-800">Auto-Approve PR Submissions Under IDR 5M</p>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Allows department heads to purchase minor IT or catering items without triggering manual PMO approval pipelines.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 border border-slate-100/40 text-left">
                <input
                  type="checkbox"
                  checked={strictBackground}
                  onChange={(e) => setStrictBackground(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mt-0.5"
                />
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-slate-800">Enforce Strict Vendor Verification Controls</p>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Requires SIUP, Tax registration, and performance scoring audit checks prior to listing any vendor service on the Marketplace.
                  </p>
                </div>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                id="save-configs-btn"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
              >
                Save System Parameters
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
