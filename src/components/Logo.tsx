/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: { icon: 'h-8 w-8', text: 'text-lg', subtext: 'text-[7px]' },
    md: { icon: 'h-12 w-12', text: 'text-2xl', subtext: 'text-[9px]' },
    lg: { icon: 'h-20 w-20', text: 'text-4xl', subtext: 'text-[12px]' },
    xl: { icon: 'h-32 w-32', text: 'text-5xl', subtext: 'text-[15px]' },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`} id="dinesys-logo-container">
      {/* High-Fidelity SVG Icon Reconstruction */}
      <svg
        className={`${currentSize.icon} shrink-0`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        id="dinesys-logo-svg"
      >
        <defs>
          <linearGradient id="blueGrad" x1="20" y1="0" x2="80" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E40AF" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="barBlue" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#0055DD" />
          </linearGradient>
          <linearGradient id="barGreen" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="barOrange" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="barPurple" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
        </defs>

        {/* 4 Colored Horizontal Bars on the Left */}
        <rect x="20" y="20" width="26" height="7" rx="2" fill="url(#barBlue)" />
        <rect x="20" y="31" width="26" height="7" rx="2" fill="url(#barGreen)" />
        <rect x="20" y="42" width="26" height="7" rx="2" fill="url(#barOrange)" />
        <rect x="20" y="53" width="26" height="7" rx="2" fill="url(#barPurple)" />

        {/* Outer Giant "D" Styled Loop */}
        <path
          d="M 28 8 C 50 8, 76 18, 76 50 C 76 82, 50 92, 28 92"
          stroke="url(#blueGrad)"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
        />

        {/* Inner Arc of the "D" Loop */}
        <path
          d="M 38 24 C 54 24, 62 32, 62 50 C 62 68, 54 76, 38 76"
          stroke="url(#blueGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />

        {/* Floating Digital Pixel Blocks on the Right (Ecosystem Elements) */}
        <rect x="74" y="28" width="4" height="4" rx="0.5" fill="#0A2540" />
        <rect x="79" y="34" width="2.5" height="2.5" rx="0.5" fill="#0080FF" />
        <rect x="85" y="34" width="2.5" height="2.5" rx="0.5" fill="#3B82F6" />
        <rect x="81" y="38" width="4" height="4" rx="1" fill="#0284C7" />
        <rect x="86" y="42" width="2" height="2" rx="0.5" fill="#0D9488" />
        <rect x="83" y="44" width="2" height="2" rx="0.5" fill="#14B8A6" />
        <rect x="71" y="40" width="3.5" height="3.5" rx="0.5" fill="#3B82F6" />
        <rect x="74" y="44" width="3" height="3" rx="0.5" fill="#0284C7" />
        <rect x="79" y="46" width="4" height="4" rx="0.5" fill="#1E3A8A" />
        <rect x="85" y="46" width="2" height="2" rx="0.5" fill="#2563EB" />
        <rect x="67" y="41" width="3.5" height="3.5" rx="0.5" fill="#0066FF" />
        <rect x="69" y="47" width="2.5" height="2.5" rx="0.5" fill="#60A5FA" />
      </svg>

      {showText && (
        <div className="flex flex-col select-none" id="dinesys-brand-text">
          <div className="flex items-center tracking-wider font-extrabold" style={{ color: '#0A2540' }}>
            <span className={currentSize.text}>DIN</span>
            <span className={`${currentSize.text} text-blue-600`}>E</span>
            <span className={currentSize.text}>SYS</span>
          </div>
          <div className={`${currentSize.subtext} font-semibold uppercase tracking-widest text-slate-500 flex items-center gap-1`}>
            <span>Digital</span>
            <span className="text-amber-500 text-[10px]">•</span>
            <span>Integrated</span>
            <span className="text-amber-500 text-[10px]">•</span>
            <span>Ecosystem</span>
          </div>
          <div className="text-[7px] md:text-[8px] font-bold text-amber-600 tracking-wider uppercase mt-0.5">
            Universitas Terbuka
          </div>
        </div>
      )}
    </div>
  );
}
