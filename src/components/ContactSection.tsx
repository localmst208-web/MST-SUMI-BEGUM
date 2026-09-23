import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  CheckCircle2,
  Send,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { data } = useCms();
  const { brand } = data;

  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    floorPreference: '2nd Floor - Women’s Salon',
    date: '',
    notes: '',
  });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone) {
      alert('Please provide your name and phone number.');
      return;
    }
    setBookingSubmitted(true);
  };

  const handleWhatsAppChat = () => {
    const cleanPhone = brand.whatsappNumber.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Hello Brand Shop Concierge! I would like to schedule a private viewing appointment at your Banani showroom.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <section
      id="contact-section"
      className="relative min-h-screen w-full py-28 px-6 md:px-12 lg:px-16 flex flex-col justify-center select-none"
    >
      <div className="max-w-6xl mx-auto w-full space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-neutral-200 text-amber-800 text-xs tracking-[0.25em] uppercase font-semibold shadow-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>Banani Flagship</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-display font-light text-neutral-900 tracking-tight">
            Visit & Contact
          </h2>

          <p className="text-sm md:text-base text-neutral-600 font-light leading-relaxed">
            We welcome you to experience our fabrics and personal styling consultations
            at our physical atelier or connect with our digital concierge.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Details Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Location Card */}
            <div className="p-6 rounded-2xl bg-white/80 border border-neutral-200/80 shadow-sm space-y-3">
              <div className="flex items-center gap-3 text-amber-800">
                <MapPin className="w-5 h-5" />
                <h4 className="text-sm font-semibold tracking-wider uppercase text-neutral-900">
                  Showroom Address
                </h4>
              </div>
              <p className="text-xs md:text-sm text-neutral-700 leading-relaxed">
                {brand.address}
              </p>
              <p className="text-xs text-neutral-500">{brand.city}</p>
            </div>

            {/* Hours Card */}
            <div className="p-6 rounded-2xl bg-white/80 border border-neutral-200/80 shadow-sm space-y-3">
              <div className="flex items-center gap-3 text-amber-800">
                <Clock className="w-5 h-5" />
                <h4 className="text-sm font-semibold tracking-wider uppercase text-neutral-900">
                  Opening Hours
                </h4>
              </div>
              <p className="text-xs md:text-sm text-neutral-700">
                {brand.openingHours}
              </p>
              <p className="text-xs text-neutral-500">
                Private appointments available before and after regular hours.
              </p>
            </div>

            {/* Contact Actions */}
            <div className="p-6 rounded-2xl bg-white/80 border border-neutral-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-amber-800">
                <Phone className="w-5 h-5" />
                <h4 className="text-sm font-semibold tracking-wider uppercase text-neutral-900">
                  Direct Concierge
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-neutral-600">
                  <span>Hotline:</span>
                  <a href={`tel:${brand.phone}`} className="font-mono text-neutral-900 hover:text-amber-800 font-medium">
                    {brand.phone}
                  </a>
                </div>
                <div className="flex justify-between items-center text-neutral-600">
                  <span>Email:</span>
                  <a href={`mailto:${brand.email}`} className="font-mono text-neutral-900 hover:text-amber-800 font-medium">
                    {brand.email}
                  </a>
                </div>
              </div>

              <button
                onClick={handleWhatsAppChat}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Chat on WhatsApp ({brand.whatsappNumber})</span>
              </button>
            </div>
          </div>

          {/* Right: VIP Private Atelier Appointment Booking */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-white/80 border border-neutral-200/80 shadow-sm backdrop-blur-md">
            {bookingSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif text-neutral-900">
                  Appointment Request Received
                </h3>
                <p className="text-xs md:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-neutral-900">{bookingForm.name}</strong>. Our head
                  curator will reach out via WhatsApp at {bookingForm.phone} to confirm your private
                  viewing time.
                </p>
                <button
                  onClick={() => setBookingSubmitted(false)}
                  className="px-5 py-2 rounded-full bg-neutral-900 text-xs uppercase tracking-wider text-white hover:bg-neutral-800 transition-all font-semibold"
                >
                  Book Another Appointment
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-light text-neutral-900 tracking-wide">
                    Request VIP Private Appointment
                  </h3>
                  <p className="text-neutral-500">
                    Reserve an exclusive appointment with a personal stylist on Floor 1 or Floor 2.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-neutral-700 font-medium">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={bookingForm.name}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, name: e.target.value })
                      }
                      placeholder="e.g. Farhana Ahmed"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-700 font-medium">Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={bookingForm.phone}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, phone: e.target.value })
                      }
                      placeholder="+880 1XXXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-neutral-700 font-medium">Floor & Collection Preference</label>
                    <select
                      value={bookingForm.floorPreference}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, floorPreference: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-400"
                    >
                      <option value="2nd Floor – Women’s Collection">
                        2nd Floor · Women’s Collection
                      </option>
                      <option value="1st Floor – Baby & Kids">
                        1st Floor · Baby & Kids
                      </option>
                      <option value="Both Floors - Full Atelier Experience">
                        Both Floors · Full Atelier Experience
                      </option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-700 font-medium">Preferred Date</label>
                    <input
                      type="date"
                      value={bookingForm.date}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, date: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-700 font-medium">
                    Special Inquiries / Size or Occasion Details
                  </label>
                  <textarea
                    rows={3}
                    value={bookingForm.notes}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, notes: e.target.value })
                    }
                    placeholder="e.g. Looking for a bridal Jamdani or bespoke Western gown fittings..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-neutral-900 text-white font-semibold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Private Viewing</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
