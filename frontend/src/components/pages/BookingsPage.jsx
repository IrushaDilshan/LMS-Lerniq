import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Clock3, Filter, PlusCircle, XCircle } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const STATUS_COLORS = {
  PENDING: 'bg-amber-100 text-amber-800',
  APPROVED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-rose-100 text-rose-800',
  CANCELLED: 'bg-slate-200 text-slate-700',
};

const RESOURCE_OPTIONS = [
  'Lecture Hall A1',
  'Conference Room B2',
  'Computer Lab C3',
  'Seminar Room D4',
  'Innovation Hub E5',
];

function BookingsPage() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    resourceName: RESOURCE_OPTIONS[0],
    bookingDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: 1,
  });

  const [filters, setFilters] = useState({
    status: '',
    resourceName: '',
    bookingDate: '',
  });

  const [reviewState, setReviewState] = useState({
    bookingId: '',
    decision: 'APPROVED',
    reason: '',
  });

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      const da = new Date(`${a.bookingDate}T${a.startTime}`);
      const db = new Date(`${b.bookingDate}T${b.startTime}`);
      return db - da;
    });
  }, [bookings]);

  const loadBookings = async () => {
    if (!currentUser) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      const params = {
        requestingUserId: currentUser.id,
        requestingRole: currentUser.role,
      };

      if (filters.status) {
        params.status = filters.status;
      }
      if (isAdmin && filters.resourceName.trim()) {
        params.resourceName = filters.resourceName.trim();
      }
      if (filters.bookingDate) {
        params.bookingDate = filters.bookingDate;
      }

      const response = await api.get('/bookings', { params });
      setBookings(response.data || []);
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to load bookings.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, filters.status, filters.bookingDate]);

  const handleSubmitBooking = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await api.post('/bookings', {
        ...form,
        expectedAttendees: Number(form.expectedAttendees),
        requestedByUserId: currentUser.id,
        requestedByUserName: currentUser.name,
      });

      setForm({
        resourceName: RESOURCE_OPTIONS[0],
        bookingDate: '',
        startTime: '',
        endTime: '',
        purpose: '',
        expectedAttendees: 1,
      });

      await loadBookings();
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to create booking.';
      setError(message);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    setError('');
    try {
      await api.put(`/bookings/${bookingId}/cancel`, null, {
        params: {
          requestingUserId: currentUser.id,
          requestingRole: currentUser.role,
          reason: 'Cancelled by user',
        },
      });
      await loadBookings();
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to cancel booking.';
      setError(message);
    }
  };

  const handleReviewBooking = async (event) => {
    event.preventDefault();
    if (!reviewState.bookingId) {
      setError('Select a booking to review.');
      return;
    }

    setError('');
    try {
      await api.put(
        `/bookings/${reviewState.bookingId}/review`,
        {
          decision: reviewState.decision,
          reason: reviewState.reason,
          adminUserId: currentUser.id,
          adminName: currentUser.name,
        },
        {
          params: {
            requestingRole: currentUser.role,
          },
        }
      );

      setReviewState({
        bookingId: '',
        decision: 'APPROVED',
        reason: '',
      });

      await loadBookings();
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to review booking.';
      setError(message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <section className="rounded-3xl p-8 bg-gradient-to-r from-[#061224] via-[#0d2147] to-[#164982] text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <Calendar className="w-8 h-8 text-blue-300" />
          <h1 className="text-3xl font-black tracking-tight">Booking Management</h1>
        </div>
        <p className="text-blue-100/80 max-w-3xl">
          Submit resource booking requests, prevent schedule overlaps, and manage the approval workflow.
        </p>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm font-semibold">
          {error}
        </div>
      )}

      <section className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <PlusCircle className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-black text-gray-900">Request a Booking</h2>
        </div>

        <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-1 text-sm font-semibold text-gray-700">
            Resource
            <select
              value={form.resourceName}
              onChange={(e) => setForm((prev) => ({ ...prev, resourceName: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 bg-white"
              required
            >
              {RESOURCE_OPTIONS.map((resource) => (
                <option key={resource} value={resource}>
                  {resource}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm font-semibold text-gray-700">
            Date
            <input
              type="date"
              value={form.bookingDate}
              onChange={(e) => setForm((prev) => ({ ...prev, bookingDate: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
              required
            />
          </label>

          <label className="space-y-1 text-sm font-semibold text-gray-700">
            Start Time
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
              required
            />
          </label>

          <label className="space-y-1 text-sm font-semibold text-gray-700">
            End Time
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
              required
            />
          </label>

          <label className="space-y-1 text-sm font-semibold text-gray-700 md:col-span-2">
            Purpose
            <input
              type="text"
              value={form.purpose}
              onChange={(e) => setForm((prev) => ({ ...prev, purpose: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
              placeholder="Project meeting, workshop, demo session..."
              required
            />
          </label>

          <label className="space-y-1 text-sm font-semibold text-gray-700">
            Expected Attendees
            <input
              type="number"
              min="1"
              value={form.expectedAttendees}
              onChange={(e) => setForm((prev) => ({ ...prev, expectedAttendees: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
              required
            />
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#061224] text-white rounded-xl font-bold hover:bg-[#0d2147] transition-colors"
            >
              <Clock3 className="w-4 h-4" />
              Submit Request
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-black text-gray-900">{isAdmin ? 'All Bookings' : 'My Bookings'}</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            <input
              type="date"
              value={filters.bookingDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, bookingDate: e.target.value }))}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />

            {isAdmin && (
              <>
                <input
                  type="text"
                  value={filters.resourceName}
                  onChange={(e) => setFilters((prev) => ({ ...prev, resourceName: e.target.value }))}
                  placeholder="Filter by resource"
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={loadBookings}
                  className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-bold"
                >
                  Apply
                </button>
              </>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading bookings...</p>
        ) : sortedBookings.length === 0 ? (
          <p className="text-gray-500">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="py-2 pr-3">Resource</th>
                  <th className="py-2 pr-3">Date</th>
                  <th className="py-2 pr-3">Time</th>
                  <th className="py-2 pr-3">Requested By</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Reason</th>
                  <th className="py-2 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedBookings.map((booking) => {
                  const canCancel = booking.status === 'APPROVED' && (isAdmin || booking.requestedByUserId === currentUser.id);

                  return (
                    <tr key={booking.id} className="border-b border-gray-50 align-top">
                      <td className="py-3 pr-3 font-semibold text-gray-900">{booking.resourceName}</td>
                      <td className="py-3 pr-3">{booking.bookingDate}</td>
                      <td className="py-3 pr-3">{booking.startTime} - {booking.endTime}</td>
                      <td className="py-3 pr-3">{booking.requestedByUserName}</td>
                      <td className="py-3 pr-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[booking.status] || 'bg-gray-100 text-gray-700'}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-gray-600 max-w-[280px]">{booking.adminDecisionReason || '-'}</td>
                      <td className="py-3 pr-3">
                        {canCancel ? (
                          <button
                            type="button"
                            onClick={() => handleCancelBooking(booking.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Cancel
                          </button>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isAdmin && (
        <section className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-black text-gray-900">Admin Review Panel</h2>
          </div>

          <form onSubmit={handleReviewBooking} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <label className="space-y-1 text-sm font-semibold text-gray-700 md:col-span-2">
              Pending Booking
              <select
                value={reviewState.bookingId}
                onChange={(e) => setReviewState((prev) => ({ ...prev, bookingId: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
                required
              >
                <option value="">Select pending booking</option>
                {sortedBookings
                  .filter((b) => b.status === 'PENDING')
                  .map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.resourceName} | {b.bookingDate} | {b.startTime}-{b.endTime} | {b.requestedByUserName}
                    </option>
                  ))}
              </select>
            </label>

            <label className="space-y-1 text-sm font-semibold text-gray-700">
              Decision
              <select
                value={reviewState.decision}
                onChange={(e) => setReviewState((prev) => ({ ...prev, decision: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
              >
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </label>

            <label className="space-y-1 text-sm font-semibold text-gray-700">
              Reason
              <input
                type="text"
                value={reviewState.reason}
                onChange={(e) => setReviewState((prev) => ({ ...prev, reason: e.target.value }))}
                placeholder="Required for rejection"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
              />
            </label>

            <div className="md:col-span-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Submit Review
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}

export default BookingsPage;
