/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  MapPin, 
  Coffee, 
  Calendar, 
  CheckSquare, 
  Clock, 
  CheckCircle2,
  Users
} from 'lucide-react';
import { Booking } from '../types';

interface HospitalityModuleProps {
  bookings: Booking[];
  onAddBooking: (booking: Partial<Booking>) => void;
}

export default function HospitalityModule({ bookings, onAddBooking }: HospitalityModuleProps) {
  const [showBookForm, setShowBookForm] = useState(false);
  const [venueName, setVenueName] = useState('Smart Conference Room - Block B');
  const [bookDate, setBookDate] = useState('2026-06-30');
  const [bookSlot, setBookSlot] = useState('09:00 - 13:00');
  const [cateringPack, setCateringPack] = useState('None');

  const venuesList = [
    { name: 'Smart Conference Room - Block B', cap: '20 Pax', price: 2500000, features: 'Interactive screen, video conferencing, premium seating.' },
    { name: 'Grand Auditorium - Universitas Terbuka', cap: '500 Pax', price: 15000000, features: 'State-of-the-art acoustics, stage lighting, dual projectors.' },
    { name: 'Exhibition Hall A', cap: '1000 Pax', price: 35000000, features: 'Foyer access, divisible booths, high ceiling.' }
  ];

  const mockCateringPacks = [
    { name: 'Standard Coffee Break', price: 'IDR 75k / Pax', desc: 'Hot premium coffee, hot tea, and three varieties of traditional sweet snacks.' },
    { name: 'Premium Organic Buffet', price: 'IDR 150k / Pax', desc: 'Complete buffet main courses with organic chicken, fish, fruits, and juice.' }
  ];

  const mockEventAttendees = [
    { name: 'Dr. Budi Santoso', email: 'budi@ut.ac.id', org: 'Universitas Terbuka', status: 'Registered' },
    { name: 'Ahmad Sepuh', email: 'ahmad@sepuh.co.id', org: 'PT. Sepuh Trismatek Nusa', status: 'Speaker' },
    { name: 'Sonia Wijaya', email: 'sonia@uxlabs.id', org: 'UX Labs', status: 'Attendee' }
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenVenue = venuesList.find(v => v.name === venueName);
    const cost = chosenVenue ? chosenVenue.price : 2500000;

    onAddBooking({
      customerName: 'Enterprise Booking Client',
      venueName,
      date: bookDate,
      timeSlot: bookSlot,
      pillar: 'MICE Hospitality',
      price: cost,
      status: 'Confirmed'
    });

    setShowBookForm(false);
  };

  return (
    <div className="space-y-6 text-left" id="hospitality-module-wrapper">
      
      {/* Top Section: Available venues vs catering */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="hospitality-top-grid">
        {/* Left columns: venues catalog list */}
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="venues-catalog-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5">
              <Building2 size={16} className="text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm">Ecosystem Venues & Meeting Halls</h3>
            </div>

            <button
              onClick={() => setShowBookForm(true)}
              id="book-venue-btn"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} />
              <span>Book Venue Slot</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="venues-grid">
            {venuesList.map((ven, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200/50 p-4 rounded-2xl text-left flex flex-col justify-between h-40" id={`venue-item-${idx}`}>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-900 line-clamp-1">{ven.name}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{ven.features}</p>
                </div>
                <div className="pt-2 border-t border-slate-200/30 flex items-center justify-between text-[10px]">
                  <span className="text-blue-600 font-bold">Capacity: {ven.cap}</span>
                  <span className="font-extrabold text-slate-800">IDR {ven.price.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Columns: Catering Options */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="catering-packs-card">
          <div className="flex items-center gap-1 border-b border-slate-100 pb-2">
            <Coffee size={15} className="text-amber-500" />
            <h3 className="font-bold text-slate-800 text-sm">Event Catering Supplements</h3>
          </div>

          <div className="space-y-3" id="catering-list">
            {mockCateringPacks.map((pack, idx) => (
              <div key={idx} className="bg-amber-50/20 border border-amber-100/30 p-3 rounded-2xl text-left space-y-1" id={`catering-item-${idx}`}>
                <div className="flex justify-between items-center text-[9px] font-bold text-amber-800">
                  <span>{pack.name}</span>
                  <span>{pack.price}</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal">{pack.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings log track */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="bookings-tracking">
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
          <Calendar size={15} className="text-amber-500" />
          <h3 className="font-bold text-slate-800 text-sm">Active Venue Bookings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="bookings-grid">
          {bookings.map((bk) => (
            <div key={bk.id} className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex items-center justify-between" id={`booking-item-${bk.id}`}>
              <div className="text-left space-y-1.5 flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase">
                    MICE Venue
                  </span>
                  <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <CheckCircle2 size={10} />
                    <span>{bk.status}</span>
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-800 leading-tight truncate">{bk.venueName}</h4>
                <p className="text-[10px] text-slate-400 font-bold">
                  Reserved: {bk.date} • {bk.timeSlot}
                </p>
                <p className="text-[10px] font-bold text-slate-800">Total Charged: IDR {bk.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delegate & Attendee Registries */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="attendees-registry">
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3 text-left">
          <Users size={15} className="text-slate-500" />
          <h3 className="font-bold text-slate-800 text-sm">Conference Delegate Attendee List</h3>
        </div>

        <div className="overflow-x-auto" id="attendees-table-container">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold bg-slate-50">
                <th className="py-2 px-3">Attendee Name</th>
                <th className="py-2 px-3">E-Mail</th>
                <th className="py-2 px-3">Institution</th>
                <th className="py-2 px-3">Participation Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockEventAttendees.map((att, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50" id={`attendee-row-${idx}`}>
                  <td className="py-2.5 px-3 font-semibold text-slate-700">{att.name}</td>
                  <td className="py-2.5 px-3 text-slate-500">{att.email}</td>
                  <td className="py-2.5 px-3 text-slate-600 font-medium">{att.org}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      att.status === 'Speaker' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {att.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking venue form popup */}
      {showBookForm && (
        <div
          id="hosp-modal-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-200" id="hosp-modal">
            <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Building2 size={14} className="text-blue-600" />
              <span>Book Venue Space</span>
            </h4>
            <p className="text-xs text-slate-500 mb-4">Book halls, audit rooms or smart suites for corporate meetings.</p>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-left" id="venue-booking-form">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Select Venue Space</label>
                <select
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {venuesList.map((ven, idx) => (
                    <option key={idx} value={ven.name}>
                      {ven.name} ({ven.cap})
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
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Time Slot</label>
                  <select
                    value={bookSlot}
                    onChange={(e) => setBookSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="09:00 - 13:00">Morning Session (09:00 - 13:00)</option>
                    <option value="14:00 - 18:00">Afternoon Session (14:00 - 18:00)</option>
                    <option value="08:00 - 17:00">Full Day (08:00 - 17:00)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Add Catering Supplement</label>
                <select
                  value={cateringPack}
                  onChange={(e) => setCateringPack(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="None">No catering supplement needed</option>
                  <option value="Standard Coffee Break">Standard Coffee Break (IDR 75k / Pax)</option>
                  <option value="Premium Organic Buffet">Premium Organic Buffet (IDR 150k / Pax)</option>
                </select>
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
                  Confirm Booking Space
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
