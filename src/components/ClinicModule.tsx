/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  HeartPulse, 
  Calendar, 
  Video, 
  FileText, 
  Activity, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { Appointment } from '../types';

interface ClinicModuleProps {
  appointments: Appointment[];
  onAddAppointment: (app: Partial<Appointment>) => void;
}

export default function ClinicModule({ appointments, onAddAppointment }: ClinicModuleProps) {
  const [showBookForm, setShowBookForm] = useState(false);
  const [doctorName, setDoctorName] = useState('Dr. Hendra Gunawan, Sp.PD');
  const [appDate, setAppDate] = useState('2026-06-28');
  const [appTime, setAppTime] = useState('11:00');
  const [appType, setAppType] = useState<'Telemedicine' | 'In-Clinic'>('Telemedicine');
  const [appNotes, setAppNotes] = useState('');

  const doctorList = [
    { name: 'Dr. Hendra Gunawan, Sp.PD', spec: 'Internal Medicine Expert', avails: 'Mon - Fri (10:00 - 15:00)' },
    { name: 'Dr. Anita Wijaya, Sp.OK', spec: 'Occupational Health Consultant', avails: 'Tue - Thu (09:00 - 12:00)' },
    { name: 'Dr. Ferry Salim, Sp.JP', spec: 'Cardiologist Expert', avails: 'Wed & Fri (13:00 - 17:00)' }
  ];

  const mockEhrRecords = [
    { date: '2026-05-10', diagnosis: 'Mild Physical Exhaustion & Sleep Loss', treatment: 'Stress-management cycles, 1-week magnesium, optimized work shifts.', doctor: 'Dr. Anita Wijaya' },
    { date: '2026-02-12', diagnosis: 'Seasonal Respiratory Flu', treatment: 'Decongestants, multi-vitamin B, complete bed rest for 3 days.', doctor: 'Dr. Hendra Gunawan' }
  ];

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAppointment({
      patientName: 'Enterprise Client Patient',
      doctorName,
      date: appDate,
      time: appTime,
      type: appType,
      status: 'Scheduled',
      notes: appNotes
    });

    setAppNotes('');
    setShowBookForm(false);
  };

  return (
    <div className="space-y-6 text-left" id="clinic-module-wrapper">
      
      {/* Upper Layout: Doctor registries vs Vitals Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="clinic-vitals-split">
        {/* Left Side: Doctor profiles list */}
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="doctors-registry-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5">
              <Stethoscope size={16} className="text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm">Consultant Specialists</h3>
            </div>

            <button
              onClick={() => setShowBookForm(true)}
              id="book-consult-btn"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} />
              <span>Book Appointment</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="doctors-grid">
            {doctorList.map((doc, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200/50 p-4 rounded-2xl text-left space-y-2" id={`doctor-item-${idx}`}>
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-slate-900">{doc.name}</h4>
                    <p className="text-[10px] text-blue-600 font-bold">{doc.spec}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-blue-100/60 flex items-center justify-center text-blue-800 font-extrabold text-xs">
                    Dr
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-slate-400 font-semibold pt-1 border-t border-slate-200/20">
                  <Clock size={11} />
                  <span>Schedules: {doc.avails}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Vitals Metrics tracker */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="patient-vitals-card">
          <div className="flex items-center gap-1 border-b border-slate-100 pb-2">
            <Activity size={15} className="text-emerald-500 animate-pulse" />
            <h3 className="font-bold text-slate-800 text-sm">Vitals Dashboard</h3>
          </div>

          <div className="space-y-3" id="patient-vitals-indicators">
            <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-2xl text-left flex items-center justify-between">
              <div>
                <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider">Heart Pulse</span>
                <p className="text-base font-black text-slate-800">72 BPM</p>
              </div>
              <HeartPulse size={20} className="text-emerald-500 animate-pulse" />
            </div>

            <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-2xl text-left flex items-center justify-between">
              <div>
                <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider">Blood Pressure</span>
                <p className="text-base font-black text-slate-800">120 / 80 mmHg</p>
              </div>
              <Activity size={18} className="text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Appointment schedules tracking */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="appointments-tracking">
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
          <Calendar size={15} className="text-amber-500" />
          <h3 className="font-bold text-slate-800 text-sm">Active Consultations Pipeline</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="appointments-grid">
          {appointments.map((app) => (
            <div key={app.id} className="bg-white border border-slate-200/55 rounded-2xl p-4 shadow-sm flex justify-between items-center" id={`app-item-${app.id}`}>
              <div className="text-left space-y-1.5 flex-1 min-w-0 pr-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${
                    app.type === 'Telemedicine' ? 'bg-blue-50 text-blue-800' : 'bg-amber-50 text-amber-800'
                  }`}>
                    {app.type}
                  </span>
                  <span className="text-[9px] text-emerald-600 font-extrabold flex items-center gap-0.5">
                    <CheckCircle2 size={10} />
                    <span>{app.status}</span>
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-800 leading-tight">{app.doctorName}</h4>
                <p className="text-[10px] text-slate-400 font-bold">
                  Schedule: {app.date} • {app.time}
                </p>
                {app.notes && (
                  <p className="text-[10px] text-slate-500 italic truncate">Notes: {app.notes}</p>
                )}
              </div>

              {app.type === 'Telemedicine' && (
                <button className="h-9 w-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center cursor-pointer transition-colors shadow-sm">
                  <Video size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Electronic Health Records Dossier */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="patient-ehr-dossier">
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3 text-left">
          <FileText size={15} className="text-slate-500" />
          <h3 className="font-bold text-slate-800 text-sm">Electronic Health History (EHR)</h3>
        </div>

        <div className="space-y-3" id="ehr-list">
          {mockEhrRecords.map((ehr, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/40 text-left space-y-1.5" id={`ehr-item-${idx}`}>
              <div className="flex justify-between text-[9px] font-bold text-slate-400">
                <span>Diagnostic Date: {ehr.date}</span>
                <span>Clinician: {ehr.doctor}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">Diagnosis: {ehr.diagnosis}</h4>
              <p className="text-[10px] text-slate-600 leading-relaxed">Prescribed Treatment: {ehr.treatment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduling Consultation modal popup */}
      {showBookForm && (
        <div
          id="book-modal-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-200" id="book-modal">
            <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Calendar size={14} className="text-blue-600" />
              <span>Schedule Consultation</span>
            </h4>
            <p className="text-xs text-slate-500 mb-4">Book a slot with an verified UT clinic physician.</p>

            <form onSubmit={handleBookAppointment} className="space-y-4 text-left" id="book-consultation-form">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Select Doctor Specialist</label>
                <select
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {doctorList.map((d, idx) => (
                    <option key={idx} value={d.name}>
                      {d.name} ({d.spec})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Date</label>
                  <input
                    type="date"
                    required
                    value={appDate}
                    onChange={(e) => setAppDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Time</label>
                  <input
                    type="time"
                    required
                    value={appTime}
                    onChange={(e) => setAppTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Consultation Channel</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="appType"
                      checked={appType === 'Telemedicine'}
                      onChange={() => setAppType('Telemedicine')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Telemedicine (Video)</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="appType"
                      checked={appType === 'In-Clinic'}
                      onChange={() => setAppType('In-Clinic')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>In-Clinic (Physical)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Brief Symptoms / Notes</label>
                <input
                  type="text"
                  value={appNotes}
                  onChange={(e) => setAppNotes(e.target.value)}
                  placeholder="e.g. Mild headache, cold and coughing..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowBookForm(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Submit Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
