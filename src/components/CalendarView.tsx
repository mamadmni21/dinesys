/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, Clock, Tag } from 'lucide-react';
import { Project, Appointment, Booking, Task } from '../types';

interface CalendarViewProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  appointments: Appointment[];
  bookings: Booking[];
  tasks: Task[];
}

export default function CalendarView({
  isOpen,
  onClose,
  projects,
  appointments,
  bookings,
  tasks
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!isOpen) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to construct grid
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDaysInMonth = new Date(year, month, 0).getDate();

  const daysGrid = [];
  // Previous month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    daysGrid.push({
      day: prevDaysInMonth - i,
      isCurrentMonth: false,
      dateString: `${year}-${String(month).padStart(2, '0')}-${String(prevDaysInMonth - i).padStart(2, '0')}`
    });
  }
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    daysGrid.push({
      day: i,
      isCurrentMonth: true,
      dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    });
  }
  // Next month padding
  const totalCells = 42;
  const nextMonthPadding = totalCells - daysGrid.length;
  for (let i = 1; i <= nextMonthPadding; i++) {
    daysGrid.push({
      day: i,
      isCurrentMonth: false,
      dateString: `${year}-${String(month + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    });
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Helper to find activities on a date
  const getActivitiesForDate = (dateStr: string) => {
    const list: { title: string; type: 'project' | 'appointment' | 'booking' | 'task'; color: string; time?: string }[] = [];

    projects.forEach(p => {
      if (p.endDate === dateStr) {
        list.push({ title: `🏁 Project End: ${p.name}`, type: 'project', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' });
      }
      if (p.startDate === dateStr) {
        list.push({ title: `🚀 Project Start: ${p.name}`, type: 'project', color: 'bg-blue-100 text-blue-800 border-blue-200' });
      }
    });

    appointments.forEach(a => {
      if (a.date === dateStr) {
        list.push({ title: `🩺 Dr. ${a.doctorName.split(',')[0]} (${a.type})`, type: 'appointment', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', time: a.time });
      }
    });

    bookings.forEach(b => {
      if (b.date === dateStr) {
        list.push({ title: `🏨 MICE: ${b.venueName}`, type: 'booking', color: 'bg-amber-100 text-amber-800 border-amber-200', time: b.timeSlot.split(' ')[0] });
      }
    });

    tasks.forEach(t => {
      if (t.dueDate === dateStr) {
        list.push({ title: `📌 Task: ${t.title}`, type: 'task', color: 'bg-rose-100 text-rose-800 border-rose-200' });
      }
    });

    return list;
  };

  return (
    <div
      id="calendar-modal-backdrop"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="calendar-modal-body"
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full flex flex-col md:flex-row overflow-hidden border border-slate-200/50"
      >
        {/* Left Side: Calendar Grid */}
        <div className="flex-1 p-6 flex flex-col justify-between" id="calendar-left-grid-container">
          {/* Calendar Header Controls */}
          <div className="flex items-center justify-between mb-4" id="calendar-controls">
            <div className="flex items-center gap-2">
              <CalendarIcon size={18} className="text-amber-500" />
              <h3 className="font-bold text-slate-800 text-base" id="calendar-title">
                {monthNames[month]} {year}
              </h3>
            </div>
            <div className="flex gap-1" id="calendar-prev-next-controls">
              <button
                onClick={handlePrevMonth}
                id="calendar-prev-btn"
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                <ChevronLeft size={16} className="text-slate-600" />
              </button>
              <button
                onClick={handleNextMonth}
                id="calendar-next-btn"
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                <ChevronRight size={16} className="text-slate-600" />
              </button>
            </div>
          </div>

          {/* Grid Headers */}
          <div className="grid grid-cols-7 text-center font-bold text-slate-500 text-xs mb-2 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Day Grid Cells */}
          <div className="grid grid-cols-7 gap-1 flex-1 min-h-[280px]" id="calendar-day-cells">
            {daysGrid.map((cell, idx) => {
              const activities = getActivitiesForDate(cell.dateString);
              return (
                <div
                  key={idx}
                  className={`min-h-[48px] p-1.5 rounded-lg border text-left flex flex-col justify-between transition-colors ${
                    cell.isCurrentMonth
                      ? 'bg-slate-50/50 border-slate-100 hover:bg-slate-100/60'
                      : 'bg-slate-100/30 border-transparent text-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-600">{cell.day}</span>
                  <div className="flex flex-col gap-0.5 mt-1">
                    {activities.slice(0, 2).map((act, actIdx) => (
                      <span
                        key={actIdx}
                        className="text-[7px] font-bold px-1 py-0.5 rounded border leading-none block truncate"
                        title={act.title}
                        style={{
                          backgroundColor: act.color.split(' ')[0] === 'bg-indigo-100' ? '#E0E7FF' : act.color.split(' ')[0] === 'bg-blue-100' ? '#DBEAFE' : act.color.split(' ')[0] === 'bg-emerald-100' ? '#D1FAE5' : act.color.split(' ')[0] === 'bg-rose-100' ? '#FFE4E6' : '#FEF3C7',
                          color: act.color.split(' ')[1] === 'text-indigo-800' ? '#3730A3' : act.color.split(' ')[1] === 'text-blue-800' ? '#1E40AF' : act.color.split(' ')[1] === 'text-emerald-800' ? '#065F46' : act.color.split(' ')[1] === 'text-rose-800' ? '#9F1239' : '#92400E'
                        }}
                      >
                        {act.title}
                      </span>
                    ))}
                    {activities.length > 2 && (
                      <span className="text-[6px] text-slate-400 font-extrabold block text-center">
                        +{activities.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Agenda Sidebar */}
        <div className="w-full md:w-80 bg-slate-50 p-6 border-t md:border-t-0 md:border-l border-slate-200/60 flex flex-col justify-between" id="calendar-agenda-container">
          <div className="flex items-center justify-between mb-4 border-b border-slate-200/50 pb-3">
            <div className="flex flex-col text-left">
              <h4 className="font-bold text-slate-800 text-sm">Scheduler Agenda</h4>
              <p className="text-[10px] text-slate-500 font-medium">Ecosystem deadlines</p>
            </div>
            <button
              onClick={onClose}
              id="calendar-close-btn"
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-left" id="calendar-agenda-list">
            <h5 className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">Upcoming events</h5>
            {/* Find all activities in current month */}
            {daysGrid
              .filter(cell => cell.isCurrentMonth)
              .flatMap(cell => getActivitiesForDate(cell.dateString).map(act => ({ ...act, date: cell.dateString })))
              .slice(0, 6)
              .map((act, i) => (
                <div
                  key={i}
                  className="bg-white p-3 rounded-xl border border-slate-200/50 shadow-sm space-y-1.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">{act.type}</span>
                    <span className="text-[9px] text-slate-400 font-semibold">{act.date}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 leading-tight">{act.title}</p>
                  {act.time && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Clock size={11} />
                      <span>{act.time}</span>
                    </div>
                  )}
                </div>
              ))}
          </div>

          <div className="pt-4 border-t border-slate-200/50 flex gap-2 justify-end">
            <button
              onClick={onClose}
              id="calendar-agenda-close-btn"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-sm cursor-pointer"
            >
              Close Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
