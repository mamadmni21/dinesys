/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  GraduationCap, 
  FileText, 
  Award, 
  Briefcase, 
  Sparkles, 
  CheckCircle,
  ExternalLink,
  Cpu
} from 'lucide-react';
import { TalentProfile, Project } from '../types';

interface TalentModuleProps {
  talents: TalentProfile[];
  projects: Project[];
}

export default function TalentModule({ talents, projects }: TalentModuleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | 'Student' | 'Alumni' | 'Freelancer'>('All');
  const [matchedResults, setMatchedResults] = useState<Record<string, { project: string; score: number }>>({});
  const [matchingLoader, setMatchingLoader] = useState<string | null>(null);

  const filteredTalents = talents.filter((t) => {
    const matchesSearch = t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'All' || t.type === selectedType;
    return matchesSearch && matchesType;
  });

  const runMatchmaker = (talentId: string, skills: string[]) => {
    setMatchingLoader(talentId);
    setMatchedResults((prev) => {
      const copy = { ...prev };
      delete copy[talentId];
      return copy;
    });

    setTimeout(() => {
      // Find optimal project matching talent skills
      let bestProject = projects[0]?.name || 'GovTech Portal Redesign';
      let bestScore = 65;

      if (skills.includes('React') || skills.includes('TypeScript')) {
        bestProject = 'GovTech Portal Redesign';
        bestScore = 94;
      } else if (skills.includes('UI/UX Design') || skills.includes('Figma')) {
        bestProject = 'Advanced LMS Platform';
        bestScore = 88;
      } else if (skills.includes('Cyber Security') || skills.includes('Linux')) {
        bestProject = 'Telemedicine App Integration';
        bestScore = 90;
      }

      setMatchedResults((prev) => ({
        ...prev,
        [talentId]: { project: bestProject, score: bestScore }
      }));
      setMatchingLoader(null);
    }, 1000);
  };

  return (
    <div className="space-y-6 text-left" id="talent-module-wrapper">
      
      {/* Filters and Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm" id="talent-filters-header">
        <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0" id="talent-type-tabs">
          {(['All', 'Student', 'Alumni', 'Freelancer'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedType === type
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/40'
              }`}
            >
              {type === 'All' ? 'All Roles' : `${type}s`}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full" id="talent-search">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search talents or skilltags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Grid Specialists Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="talents-grid">
        {filteredTalents.map((t) => {
          const matchResult = matchedResults[t.id];
          const isMatching = matchingLoader === t.id;

          return (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              id={`talent-card-${t.id}`}
            >
              <div className="space-y-4 text-left">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-slate-900">{t.fullName}</h4>
                    <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/30 uppercase tracking-widest inline-block mt-0.5">
                      {t.type}
                    </span>
                  </div>

                  <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-500 font-bold text-xs shrink-0">
                    {t.fullName.charAt(0)}
                  </div>
                </div>

                {/* Skills tags list */}
                <div className="space-y-1" id={`talent-skills-${t.id}`}>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Primary Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {t.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-slate-200/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Portfolio Showcase items */}
                <div className="space-y-1.5" id={`talent-portfolios-${t.id}`}>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Featured Portfolio</p>
                  <div className="space-y-1">
                    {t.portfolio.map((port, pIdx) => (
                      <div key={pIdx} className="bg-slate-50 border border-slate-200/40 p-2 rounded-xl text-[10px] flex items-center justify-between">
                        <div className="text-left flex-1 min-w-0 pr-1.5">
                          <p className="font-bold text-slate-800 truncate">{port.title}</p>
                          <p className="text-slate-500 leading-normal truncate">{port.description}</p>
                        </div>
                        <ExternalLink size={10} className="text-slate-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications verification */}
                <div className="space-y-1" id={`talent-certs-${t.id}`}>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Verified Certifications</p>
                  <div className="space-y-1 bg-blue-50/20 border border-blue-100/30 p-2 rounded-xl">
                    {t.certifications.map((cert, cIdx) => (
                      <div key={cIdx} className="flex items-center gap-1.5 text-[10px] text-left leading-normal text-slate-600">
                        <Award size={11} className="text-blue-500 shrink-0" />
                        <span className="font-bold text-slate-800 truncate max-w-[150px]">{cert.title}</span>
                        <span className="text-slate-400 shrink-0 font-medium">({cert.issuer})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Matchmaker Interactive widget */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col gap-2" id={`talent-matchmaker-${t.id}`}>
                {matchResult ? (
                  <div className="bg-emerald-50 border border-emerald-200/60 p-2.5 rounded-xl text-left space-y-1">
                    <div className="flex justify-between items-center text-[9px] text-emerald-800 font-bold uppercase tracking-wider">
                      <span>Matched PMO Target</span>
                      <span>Score: {matchResult.score}%</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">{matchResult.project}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => runMatchmaker(t.id, t.skills)}
                    disabled={isMatching}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                    id={`matchmaker-btn-${t.id}`}
                  >
                    {isMatching ? (
                      <>
                        <Cpu size={12} className="animate-spin text-blue-600" />
                        <span>Running Matchmaker score...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} className="text-amber-400" />
                        <span>Run Project Matchmaker</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
