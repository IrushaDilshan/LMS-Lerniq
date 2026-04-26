
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResourceDetailView.css";

const TYPE_ICONS = {
  LECTURE_HALL: "🏛️",
  LAB: "🔬",
  MEETING_ROOM: "🤝",
  EQUIPMENT: "🎥",
};

const TYPE_LABELS = {
  LECTURE_HALL: "Lecture Hall",
  LAB: "Lab",
  MEETING_ROOM: "Meeting Room",
  EQUIPMENT: "Equipment",
};

export default function ResourceDetailView({ resource, onClose }) {
  const navigate = useNavigate();
  const [bookingDate, setBookingDate] = useState("");
  const [error, setError] = useState("");

  if (!resource) return null;

  const handleBook = () => {
    if (!bookingDate) {
      setError("Please select a date for your booking.");
      return;
    }
    onClose();
    navigate(`/bookings/new?resourceId=${resource.id}&date=${bookingDate}`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>

        {/* Close Button */}
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <span className="modal-type-icon">{TYPE_ICONS[resource.type] || "📦"}</span>
            <div>
              <h2 className="modal-title">{resource.name}</h2>
              <div className="modal-badges">
                <span className="badge badge-type">
                  {TYPE_LABELS[resource.type] || resource.type}
                </span>
                <span className={`badge ${resource.status === "ACTIVE" ? "badge-active" : "badge-inactive"}`}>
                  {resource.status === "ACTIVE" ? "● Active" : "● Out of Service"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="modal-details-grid">
          <div className="detail-item">
            <span className="detail-icon">👥</span>
            <div>
              <p className="detail-label">Capacity</p>
              <p className="detail-value">{resource.capacity} people</p>
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-icon">📍</span>
            <div>
              <p className="detail-label">Location</p>
              <p className="detail-value">{resource.location}</p>
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-icon">🆔</span>
            <div>
              <p className="detail-label">Resource ID</p>
              <p className="detail-value resource-id">{resource.id}</p>
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-icon">📋</span>
            <div>
              <p className="detail-label">Type</p>
              <p className="detail-value">{TYPE_LABELS[resource.type] || resource.type}</p>
            </div>
          </div>
        </div>

        {/* Availability Windows */}
        {resource.availabilityWindows && resource.availabilityWindows.length > 0 && (
          <div className="modal-section">
            <h3 className="section-title">🕐 Availability Windows</h3>
            <div className="availability-list">
              {resource.availabilityWindows.map((window, idx) => (
                <div key={idx} className="availability-item">
                  <span className="avail-day">
                    {window.date 
                      ? `🗓️ ${new Date(window.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                      : (window.daysOfWeek && Array.isArray(window.daysOfWeek) 
                          ? window.daysOfWeek.map(d => d.slice(0, 3)).join(', ') 
                          : (window.day || window.dayOfWeek))}
                  </span>
                  <span className="avail-time">
                    {window.startTime} – {window.endTime}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {resource.description && (
          <div className="modal-section">
            <h3 className="section-title">📝 Description</h3>
            <p className="modal-description">{resource.description}</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="modal-footer-booking">
          {resource.status === "ACTIVE" && (
            <div className="booking-picker-box">
              <label htmlFor="booking-date">Select Booking Date:</label>
              <input 
                id="booking-date"
                type="date" 
                value={bookingDate} 
                onChange={(e) => {
                  setBookingDate(e.target.value);
                  setError("");
                }}
                min={new Date().toISOString().split('T')[0]}
              />
              {error && <p className="booking-error">{error}</p>}
            </div>
          )}
          
          <div className="footer-btns">
            <button className="btn-secondary" onClick={onClose}>
              Close
            </button>
            {resource.status === "ACTIVE" && (
              <button className="btn-primary" onClick={handleBook}>
                📅 Book This Resource
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}