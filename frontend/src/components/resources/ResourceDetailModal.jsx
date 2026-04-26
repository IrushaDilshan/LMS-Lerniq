import React from 'react';
import {
  X,
  Users,
  MapPin,
  Calendar,
  Zap,
  BookOpen,
  Wrench,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import './ResourceDetailModal.css';

const ResourceDetailModal = ({ resource, onClose, onBook }) => {
  if (!resource) return null;

  const typeConfig = {
    LECTURE_HALL: { icon: BookOpen, label: 'Lecture Hall', color: '#1976d2' },
    LAB: { icon: Zap, label: 'Lab', color: '#9c27b0' },
    MEETING_ROOM: { icon: Users, label: 'Meeting Room', color: '#00796b' },
    EQUIPMENT: { icon: Wrench, label: 'Equipment', color: '#f57c00' },
  };

  const typeInfo = typeConfig[resource.type] || typeConfig.LECTURE_HALL;
  const TypeIcon = typeInfo.icon;

  const statusConfig = {
    ACTIVE: { label: 'Active', color: '#2e7d32', icon: CheckCircle },
    OUT_OF_SERVICE: { label: 'Out of Service', color: '#c62828', icon: AlertCircle },
  };

  const statusInfo = statusConfig[resource.status] || statusConfig.ACTIVE;
  const StatusIcon = statusInfo.icon;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="resource-modal-overlay" onClick={onClose}>
      <div className="resource-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="resource-modal-header">
          <h2>{resource.name}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="resource-modal-content">
          {/* Badges */}
          <div className="resource-badges">
            <div className="badge type-badge" style={{ color: typeInfo.color }}>
              <TypeIcon size={16} />
              <span>{typeInfo.label}</span>
            </div>
            <div className="badge status-badge" style={{ color: statusInfo.color }}>
              <StatusIcon size={16} />
              <span>{statusInfo.label}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="resource-details-grid">
            <div className="detail-box">
              <Users size={20} className="detail-icon" />
              <div>
                <div className="detail-label">Capacity</div>
                <div className="detail-content">{resource.capacity} people</div>
              </div>
            </div>

            <div className="detail-box">
              <MapPin size={20} className="detail-icon" />
              <div>
                <div className="detail-label">Location</div>
                <div className="detail-content">{resource.location}</div>
              </div>
            </div>

            <div className="detail-box">
              <div className="detail-icon">#</div>
              <div>
                <div className="detail-label">Resource ID</div>
                <div className="detail-content">{resource.id}</div>
              </div>
            </div>

            <div className="detail-box">
              <Calendar size={20} className="detail-icon" />
              <div>
                <div className="detail-label">Last Updated</div>
                <div className="detail-content">{formatDate(resource.updatedAt)}</div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="availability-section">
            <div className="section-header">
              <Calendar size={20} />
              <h3>Availability</h3>
            </div>
            {resource.availabilityWindows && resource.availabilityWindows.length > 0 ? (
              <div className="availability-list">
                {resource.availabilityWindows.map((window, idx) => (
                  <div key={idx} className="availability-item">
                    <span className="days">
                      {window.daysOfWeek && window.daysOfWeek.length > 0
                        ? window.daysOfWeek.join(', ')
                        : 'N/A'}
                    </span>
                    <span className="time-range">
                      {window.startTime} - {window.endTime}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No availability information provided</p>
            )}
          </div>

          {/* Description */}
          {resource.description && (
            <div className="description-section">
              <h3>Description</h3>
              <p>{resource.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="resource-modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          {resource.status === 'ACTIVE' && (
            <button className="btn btn-primary" onClick={onBook}>
              Book This Resource
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailModal;
