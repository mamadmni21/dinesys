/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  AlertTriangle, 
  CheckCircle, 
  Ban, 
  FileCheck, 
  Award, 
  Star,
  Search,
  BookOpen
} from 'lucide-react';
import { VendorProfile } from '../types';
import { useAuth } from '../context/AuthContext';

interface VendorModuleProps {
  vendors: VendorProfile[];
  onAddVendor: (vendor: Partial<VendorProfile>) => void;
  onUpdateVendorStatus: (vendorId: string, fields: Partial<VendorProfile>) => void;
}

export default function VendorModule({
  vendors,
  onAddVendor,
  onUpdateVendorStatus
}: VendorModuleProps) {
  const { role } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showRegForm, setShowRegForm] = useState(false);

  // Registration states
  const [companyName, setCompanyName] = useState('');
  const [vendorCategory, setVendorCategory] = useState('IT Solution & Consulting');
  const [licenseDoc, setLicenseDoc] = useState('');

  const filteredVendors = vendors.filter(v => 
    v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAuthorizedAdmin = role === 'Super Admin' || role === 'PMO Manager';

  const handleRegisterVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName) return;

    onAddVendor({
      companyName,
      category: vendorCategory,
      rating: 5.0,
      performanceScore: 100,
      verificationStatus: 'Pending',
      isBlacklisted: false,
      contractStatus: 'Under Review',
      documents: licenseDoc ? [{ name: licenseDoc, url: '#', uploadedAt: new Date().toISOString().split('T')[0] }] : []
    });

    setCompanyName('');
    setLicenseDoc('');
    setShowRegForm(false);
  };

  const toggleBlacklist = (v: VendorProfile) => {
    onUpdateVendorStatus(v.id, { isBlacklisted: !v.isBlacklisted });
  };

  const handleVerifyVendor = (vendorId: string, status: VendorProfile['verificationStatus']) => {
    onUpdateVendorStatus(vendorId, { 
      verificationStatus: status,
      contractStatus: status === 'Verified' ? 'Active' : 'Under Review'
    });
  };

  return (
    <div className="space-y-6 text-left" id="vendor-module-wrapper">
      
      {/* Search and Registration Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm" id="vendor-controls-header">
        <div className="relative max-w-xs w-full" id="vendor-search">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search vendor registry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <button
          onClick={() => setShowRegForm(true)}
          id="vendor-register-trigger"
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <UserPlus size={14} />
          <span>Register New Vendor Partner</span>
        </button>
      </div>

      {/* Vendors Catalog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="vendors-directory-grid">
        {filteredVendors.map((v) => (
          <div
            key={v.id}
            className={`bg-white rounded-3xl p-5 border shadow-sm space-y-4 flex flex-col justify-between transition-all ${
              v.isBlacklisted 
                ? 'border-rose-300 bg-rose-50/10' 
                : 'border-slate-200/50 hover:border-slate-300'
            }`}
            id={`vendor-card-${v.id}`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900">{v.companyName}</h4>
                    {v.verificationStatus === 'Verified' && (
                      <ShieldCheck size={16} className="text-blue-500 shrink-0" title="Verified Business Partner" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{v.category}</p>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                    v.isBlacklisted
                      ? 'bg-rose-100 text-rose-800'
                      : v.verificationStatus === 'Verified'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  {v.isBlacklisted ? 'Blacklisted' : v.verificationStatus}
                </span>
              </div>

              {/* Stats Scorecard Grid */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl" id={`vendor-scores-${v.id}`}>
                <div className="text-left">
                  <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider">Perf. Score</span>
                  <div className="flex items-center gap-0.5 text-xs font-black text-slate-800 mt-0.5">
                    <Award size={12} className="text-blue-500" />
                    <span>{v.performanceScore}%</span>
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider">Quality Rating</span>
                  <div className="flex items-center gap-0.5 text-xs font-black text-slate-800 mt-0.5">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span>{v.rating.toFixed(1)} / 5</span>
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider">Contract Life</span>
                  <p className="text-[10px] font-bold text-slate-700 mt-1 truncate">{v.contractStatus}</p>
                </div>
              </div>

              {/* Uploaded Verification Documents */}
              <div className="space-y-1.5" id={`vendor-docs-${v.id}`}>
                <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Verification Dossier</p>
                {v.documents.length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic">No business license docs uploaded.</p>
                ) : (
                  <div className="space-y-1">
                    {v.documents.map((doc, dIdx) => (
                      <div key={dIdx} className="flex items-center justify-between bg-white border border-slate-200/60 p-1.5 rounded-lg text-[10px]">
                        <span className="text-slate-600 font-medium truncate max-w-[180px]">{doc.name}</span>
                        <span className="text-[8px] text-slate-400 font-bold">{doc.uploadedAt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Admin Controls */}
            {isAuthorizedAdmin && (
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center" id={`vendor-controls-${v.id}`}>
                <div className="flex gap-1.5">
                  {v.verificationStatus === 'Pending' && (
                    <button
                      onClick={() => handleVerifyVendor(v.id, 'Verified')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle size={10} />
                      <span>Approve Partner</span>
                    </button>
                  )}
                  {v.verificationStatus === 'Verified' && (
                    <button
                      onClick={() => handleVerifyVendor(v.id, 'Unverified')}
                      className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] cursor-pointer"
                    >
                      Suspend Verification
                    </button>
                  )}
                </div>

                <button
                  onClick={() => toggleBlacklist(v)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                    v.isBlacklisted
                      ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/50'
                  }`}
                  id={`blacklist-btn-${v.id}`}
                >
                  <Ban size={10} />
                  <span>{v.isBlacklisted ? 'Delist Blacklist' : 'Flag Blacklist'}</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Register Vendor partners modal */}
      {showRegForm && (
        <div
          id="vendor-modal-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-200" id="vendor-modal">
            <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <UserPlus size={14} className="text-blue-600" />
              <span>Partner Onboarding Form</span>
            </h4>
            <p className="text-xs text-slate-500 mb-4">Onboard a corporate partner with pre-approval credentials.</p>

            <form onSubmit={handleRegisterVendor} className="space-y-4 text-left" id="vendor-reg-form">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Corporate Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. PT. Global Integrasi"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Business Pillar Category</label>
                <select
                  value={vendorCategory}
                  onChange={(e) => setVendorCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="IT Solution & Consulting">IT Solution & Consulting</option>
                  <option value="Training Academy">Training Academy</option>
                  <option value="Clinic Care Operations">Clinic Care Operations</option>
                  <option value="MICE Hospitality & Venues">MICE Hospitality & Venues</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Business License Dossier (File Name)</label>
                <input
                  type="text"
                  value={licenseDoc}
                  onChange={(e) => setLicenseDoc(e.target.value)}
                  placeholder="e.g. SIUP_Partner_2026.pdf"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowRegForm(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Register Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
