import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import './AddEditResourceModal.css';

const AddEditResourceModal = ({ resource, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'LECTURE_HALL',
    capacity: '',
    location: '',
    description: '',
    availabilityWindows: [{ type: 'WEEKLY', daysOfWeek: [], date: '', startTime: '08:00', endTime: '18:00' }],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const resourceTypes = [
    { value: 'LECTURE_HALL', label: 'Lecture Hall' },
    { value: 'LAB', label: 'Lab' },
    { value: 'MEETING_ROOM', label: 'Meeting Room' },
    { value: 'EQUIPMENT', label: 'Equipment' },
  ];

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  useEffect(() => {
    if (resource) {
      setFormData({
        name: resource.name || '',
        type: resource.type || 'LECTURE_HALL',
        capacity: resource.capacity || '',
        location: resource.location || '',
        description: resource.description || '',
        availabilityWindows: resource.availabilityWindows?.map(w => ({
          ...w,
          type: w.date ? 'SPECIFIC' : 'WEEKLY'
        })) || [
          { type: 'WEEKLY', daysOfWeek: [], date: '', startTime: '08:00', endTime: '18:00' },
        ],
      });
    }
  }, [resource]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Resource name is required';
    }
    if (!formData.type) {
      newErrors.type = 'Resource type is required';
    }
    if (!formData.capacity || parseInt(formData.capacity) < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvailabilityChange = (index, field, value) => {
    setFormData((prev) => {
      const windows = [...prev.availabilityWindows];
      windows[index] = {
        ...windows[index],
        [field]: value,
      };
      return { ...prev, availabilityWindows: windows };
    });
  };

  const handleScheduleTypeChange = (index, type) => {
    setFormData((prev) => {
      const windows = prev.availabilityWindows.map((window, i) => {
        if (i !== index) return window;
        return { 
          ...window, 
          type, 
          date: type === 'WEEKLY' ? '' : window.date,
          daysOfWeek: type === 'SPECIFIC' ? [] : window.daysOfWeek 
        };
      });
      return { ...prev, availabilityWindows: windows };
    });
  };

  const handleDayToggle = (index, day) => {
    setFormData((prev) => {
      const windows = prev.availabilityWindows.map((window, i) => {
        if (i !== index) return window;
        
        const currentDays = window.daysOfWeek || [];
        const newDays = currentDays.includes(day)
          ? currentDays.filter((d) => d !== day)
          : [...currentDays, day];
          
        return { ...window, daysOfWeek: newDays };
      });
      
      return { ...prev, availabilityWindows: windows };
    });
  };

  const addAvailabilityWindow = () => {
    setFormData((prev) => ({
      ...prev,
      availabilityWindows: [
        ...prev.availabilityWindows,
        { type: 'WEEKLY', daysOfWeek: [], date: '', startTime: '08:00', endTime: '18:00' },
      ],
    }));
  };

  const removeAvailabilityWindow = (index) => {
    if (formData.availabilityWindows.length > 1) {
      setFormData((prev) => ({
        ...prev,
        availabilityWindows: prev.availabilityWindows.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    try {
      const url = resource ? `/api/resources/${resource.id}` : '/api/resources';
      const method = resource ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to ${resource ? 'update' : 'create'} resource`
        );
      }

      setMessage({
        type: 'success',
        text: `Resource ${resource ? 'updated' : 'created'} successfully`,
      });

      setTimeout(() => {
        onSave();
      }, 500);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-edit-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>{resource ? 'Edit Resource' : 'Add New Resource'}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="resource-form">
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Resource Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Main Lecture Hall A"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Type */}
          <div className="form-group">
            <label htmlFor="type">Resource Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className={errors.type ? 'error' : ''}
            >
              {resourceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.type && <span className="error-text">{errors.type}</span>}
          </div>

          {/* Capacity & Location Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="capacity">Capacity (People) *</label>
              <input
                id="capacity"
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                placeholder="e.g., 50"
                min="1"
                className={errors.capacity ? 'error' : ''}
              />
              {errors.capacity && <span className="error-text">{errors.capacity}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Building A, Floor 2"
                className={errors.location ? 'error' : ''}
              />
              {errors.location && <span className="error-text">{errors.location}</span>}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Optional description about this resource..."
              rows="3"
            />
          </div>

          {/* Availability Windows */}
          <div className="form-section">
            <h3>Availability Windows</h3>
            {formData.availabilityWindows.map((window, index) => (
              <div key={index} className="availability-form-block">
                <div className="availability-header">
                  <h4>Schedule {index + 1}</h4>
                  <div className="schedule-type-toggle">
                    <button 
                      type="button" 
                      className={`type-btn ${window.type === 'WEEKLY' ? 'active' : ''}`}
                      onClick={() => handleScheduleTypeChange(index, 'WEEKLY')}
                    >
                      Weekly
                    </button>
                    <button 
                      type="button" 
                      className={`type-btn ${window.type === 'SPECIFIC' ? 'active' : ''}`}
                      onClick={() => handleScheduleTypeChange(index, 'SPECIFIC')}
                    >
                      One-time
                    </button>
                  </div>
                  {formData.availabilityWindows.length > 1 && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeAvailabilityWindow(index)}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* Conditional Fields */}
                {window.type === 'SPECIFIC' ? (
                  <div className="form-group">
                    <label htmlFor={`date-${index}`}>Event Date</label>
                    <input
                      id={`date-${index}`}
                      type="date"
                      value={window.date || ''}
                      onChange={(e) =>
                        handleAvailabilityChange(index, 'date', e.target.value)
                      }
                      className={errors[`date-${index}`] ? 'error' : ''}
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Days of Week</label>
                    <div className="days-grid">
                      {daysOfWeek.map((day) => (
                        <label key={day} className="day-checkbox">
                          <input
                            type="checkbox"
                            checked={window.daysOfWeek?.includes(day) || false}
                            onChange={() => handleDayToggle(index, day)}
                          />
                          <span>{day.slice(0, 3)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Time Range */}
                <div className="time-range-group">
                  <div className="form-group">
                    <label htmlFor={`startTime-${index}`}>Start Time</label>
                    <input
                      id={`startTime-${index}`}
                      type="time"
                      value={window.startTime}
                      onChange={(e) =>
                        handleAvailabilityChange(index, 'startTime', e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`endTime-${index}`}>End Time</label>
                    <input
                      id={`endTime-${index}`}
                      type="time"
                      value={window.endTime}
                      onChange={(e) =>
                        handleAvailabilityChange(index, 'endTime', e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-secondary add-window-btn"
              onClick={addAvailabilityWindow}
            >
              <Plus size={16} />
              Add Another Schedule
            </button>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : resource ? 'Update Resource' : 'Create Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditResourceModal;
