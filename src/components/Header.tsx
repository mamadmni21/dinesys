/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  User, 
  LogOut, 
  Settings, 
  Sparkles, 
  Calendar, 
  Menu,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SystemNotification } from '../types';
import Logo from './Logo';

interface HeaderProps {
  onMenuToggle: () => void;
  onAiAssistantToggle: () => void;
  onCalendarToggle: () => void;
  notifications: SystemNotification[];
  onNotificationRead: (id: string) => void;
  onSearch: (query: string) => void;
}

export default function Header({
  onMenuToggle,
  onAiAssistantToggle,
  onCalendarToggle,
  notifications,
  onNotificationRead,
  onSearch
}: HeaderProps) {
  const { profile, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-500" />;
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <header
      id="global-header-container"
      className="sticky top-0 right-0 z-30 h-20 bg-slate-950/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 shadow-sm text-white"
    >
      {/* Brand & Left Hand Sidebar Toggle */}
      <div className="flex items-center gap-4" id="header-left">
        <button
          onClick={onMenuToggle}
          id="header-mobile-sidebar-toggle"
          className="p-2 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white cursor-pointer lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="hidden md:flex lg:hidden" id="header-tablet-logo">
          <Logo size="sm" showText={true} />
        </div>
        <div className="flex flex-col text-left" id="header-greeting-container">
          <h1 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-1.5" id="header-main-title">
            <span>DINESYS Operations Hub</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium" id="header-main-subtitle">
            PMO Digital Business Ecosystem
          </p>
        </div>
      </div>

      {/* Global Interactive Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6" id="header-search-container">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            id="header-global-search-input"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search projects, vendors, invoices, or talent database..."
            className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-400 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      {/* Utility Panel */}
      <div className="flex items-center gap-4" id="header-utility-panel">
        {/* Calendar Scheduler Widget */}
        <button
          onClick={onCalendarToggle}
          id="header-calendar-widget-btn"
          className="p-2 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white border border-white/10 cursor-pointer relative"
          title="Ecosystem Schedule Calendar"
        >
          <Calendar size={18} />
        </button>

        {/* AI Assistant Button */}
        <button
          onClick={onAiAssistantToggle}
          id="header-ai-chat-launcher-btn"
          className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <Sparkles size={14} className="animate-pulse text-amber-300" />
          <span>Ask AI Assistant</span>
        </button>

        {/* Notification center bells */}
        <div className="relative" id="header-notifications-wrapper">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            id="header-notifications-bell-btn"
            className="p-2 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white border border-white/10 cursor-pointer relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span id="header-unread-badge" className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-rose-500 text-[10px] text-white font-bold rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              id="header-notifications-dropdown"
              className="absolute right-0 mt-3 w-80 bg-slate-900/95 border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden backdrop-blur-xl"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <h3 className="font-semibold text-slate-100 text-sm">Ecosystem Alerts</h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 font-bold rounded-full border border-amber-500/30">
                  {unreadCount} Unread
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-white/10">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No active notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onNotificationRead(n.id)}
                      className={`p-3.5 hover:bg-white/5 cursor-pointer flex gap-3 text-left transition-colors ${
                        !n.read ? 'bg-white/10' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">{getNotificationIcon(n.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs text-slate-100 ${!n.read ? 'font-semibold' : ''}`}>
                          {n.title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{n.message}</p>
                        <p className="text-[9px] text-slate-400 mt-1">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {!n.read && (
                        <span className="h-2 w-2 rounded-full bg-amber-500 mt-1 shrink-0 animate-pulse" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Action Menu */}
        <div className="relative" id="header-user-profile-menu-wrapper">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            id="header-profile-menu-btn"
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            {profile?.photoURL ? (
              <img
                src={profile.photoURL}
                alt="Avatar"
                className="h-9 w-9 rounded-full border border-amber-500/30 object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
                <User size={16} />
              </div>
            )}
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-200">{profile?.displayName || 'User Profile'}</span>
              <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">
                {profile?.role || 'Guest'}
              </span>
            </div>
          </button>

          {showProfileMenu && (
            <div
              id="header-profile-menu-dropdown"
              className="absolute right-0 mt-3 w-48 bg-slate-900/95 border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-white/10 backdrop-blur-xl"
            >
              <div className="p-3 text-left">
                <p className="text-xs font-bold text-slate-100 truncate">{profile?.displayName}</p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{profile?.email}</p>
              </div>
              <div className="p-1">
                <button
                  id="profile-dropdown-logout-btn"
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/15 rounded-xl font-medium transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Sign Out Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
