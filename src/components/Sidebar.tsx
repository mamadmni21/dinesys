/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  HeartPulse, 
  Building2, 
  Briefcase, 
  ShoppingCart, 
  Target, 
  CreditCard, 
  FolderGit2, 
  FileText, 
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  UsersRound,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import Logo from './Logo';

export type ModuleType =
  | 'Dashboard'
  | 'Marketplace'
  | 'Vendor Management'
  | 'Customer Management'
  | 'Talent Marketplace'
  | 'Training Center'
  | 'Clinic'
  | 'Hospitality'
  | 'Project Management'
  | 'Procurement'
  | 'CRM'
  | 'Finance'
  | 'Reports'
  | 'Settings';

interface SidebarProps {
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ activeModule, setActiveModule, collapsed, setCollapsed }: SidebarProps) {
  const { role, switchRole, profile } = useAuth();

  const menuItems = [
    { name: 'Dashboard' as ModuleType, icon: LayoutDashboard, roles: ['Super Admin', 'PMO Manager', 'Business Unit Manager', 'Finance', 'HR'] },
    { name: 'Marketplace' as ModuleType, icon: ShoppingBag, roles: ['Super Admin', 'PMO Manager', 'Vendor', 'Customer'] },
    { name: 'Vendor Management' as ModuleType, icon: ShieldCheck, roles: ['Super Admin', 'PMO Manager', 'Vendor'] },
    { name: 'Customer Management' as ModuleType, icon: Users, roles: ['Super Admin', 'PMO Manager', 'HR'] },
    { name: 'Talent Marketplace' as ModuleType, icon: UsersRound, roles: ['Super Admin', 'PMO Manager', 'Talent', 'HR'] },
    { name: 'Training Center' as ModuleType, icon: GraduationCap, roles: ['Super Admin', 'HR', 'Talent'] },
    { name: 'Clinic' as ModuleType, icon: HeartPulse, roles: ['Super Admin', 'Business Unit Manager', 'Customer'] },
    { name: 'Hospitality' as ModuleType, icon: Building2, roles: ['Super Admin', 'Business Unit Manager', 'Customer'] },
    { name: 'Project Management' as ModuleType, icon: FolderGit2, roles: ['Super Admin', 'PMO Manager', 'Business Unit Manager', 'Vendor', 'Talent'] },
    { name: 'Procurement' as ModuleType, icon: ShoppingCart, roles: ['Super Admin', 'PMO Manager'] },
    { name: 'CRM' as ModuleType, icon: Target, roles: ['Super Admin', 'PMO Manager'] },
    { name: 'Finance' as ModuleType, icon: CreditCard, roles: ['Super Admin', 'Finance'] },
    { name: 'Reports' as ModuleType, icon: FileText, roles: ['Super Admin', 'PMO Manager', 'Finance'] },
    { name: 'Settings' as ModuleType, icon: SettingsIcon, roles: ['Super Admin', 'PMO Manager', 'Vendor', 'Customer', 'Talent', 'Finance', 'HR'] }
  ];

  const allowedItems = menuItems.filter(item => {
    if (!role) return false;
    if (role === 'Super Admin') return true; // Super admin has access to everything
    return item.roles.includes(role);
  });

  const rolesList: typeof role[] = [
    'Super Admin',
    'PMO Manager',
    'Business Unit Manager',
    'Vendor',
    'Customer',
    'Talent',
    'Finance',
    'HR'
  ];

  return (
    <aside
      id="sidebar-container"
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-slate-950/40 backdrop-blur-xl border-r border-white/10 text-white flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col flex-grow overflow-y-auto" id="sidebar-top-section">
        {/* Sidebar Header & Brand Logo */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 h-20" id="sidebar-header">
          {!collapsed ? (
            <Logo size="sm" showText={true} />
          ) : (
            <div className="mx-auto">
              <Logo size="sm" showText={false} />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            id="sidebar-collapse-btn"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white cursor-pointer md:block hidden"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Menu Links */}
        <nav className="flex-1 px-3 py-4 space-y-1" id="sidebar-navigation-items">
          {allowedItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.name;
            return (
              <button
                key={item.name}
                id={`sidebar-item-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveModule(item.name)}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold shadow-inner'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <Icon
                  size={18}
                  className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-400'
                  }`}
                />
                {!collapsed && (
                  <span className="ml-3 transition-opacity duration-300 truncate">{item.name}</span>
                )}

                {collapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-950/95 text-xs font-semibold rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 border border-white/10 shadow-lg whitespace-nowrap pointer-events-none z-50 backdrop-blur-md">
                    {item.name}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Role-Switcher panel at the bottom (Ideal for PMO managers testing rules) */}
      <div className="p-3 border-t border-white/10 bg-white/5" id="sidebar-role-panel">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-amber-400">
              <Sparkles size={11} />
              <span>Developer Workspace</span>
            </div>
            <div className="text-[11px] text-slate-350 truncate mb-1">
              Active profile: <strong className="text-white">{role}</strong>
            </div>
            <select
              value={role || 'Customer'}
              onChange={(e) => switchRole(e.target.value as UserRole)}
              id="sidebar-role-switcher-dropdown"
              className="w-full text-xs bg-slate-900/80 border border-white/10 text-white rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 backdrop-blur-md"
            >
              {rolesList.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="group relative flex justify-center py-2" id="sidebar-role-icon">
            <ShieldAlert size={18} className="text-amber-400 animate-pulse cursor-pointer" />
            <div className="absolute bottom-full left-3 mb-2 px-3 py-2 bg-slate-950/95 rounded-xl border border-white/10 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xl pointer-events-none z-50 w-48 text-slate-300 backdrop-blur-md">
              <p className="font-bold text-amber-400 mb-1">Active Role: {role}</p>
              <p className="text-[10px]">Use normal settings to switch or preview roles.</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
