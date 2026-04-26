import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertCircle, Loader } from 'lucide-react';
import ResourceDetailModal from '../resources/ResourceDetailModal';
import './ResourcesPage.css';

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedResource, setSelectedResource] = useState(null);

  const resourceTypes = [
    { value: 'ALL', label: 'All Resources' },
    { value: 'LECTURE_HALL', label: 'Lecture Halls' },
    { value: 'LAB', label: 'Labs' },
    { value: 'MEETING_ROOM', label: 'Meeting Rooms' },
    { value: 'EQUIPMENT', label: 'Equipment' },
  ];

  // Fetch resources on component mount and when filters change
  useEffect(() => {
    fetchResources();
  }, [selectedType]);

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/resources?activeOnly=true';
      if (selectedType !== 'ALL') {
        url += `&type=${selectedType}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      const data = await response.json();
      setResources(data);
    } catch (err) {
      setError(err.message);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter resources based on search term
  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type) => {
    const icons = {
      LECTURE_HALL: '📚',
      LAB: '🔬',
      MEETING_ROOM: '👥',
      EQUIPMENT: '⚙️',
    };
    return icons[type] || '📌';
  };

  const getTypeLabel = (type) => {
    const labels = {
      LECTURE_HALL: 'Lecture Hall',
      LAB: 'Lab',
      MEETING_ROOM: 'Meeting Room',
      EQUIPMENT: 'Equipment',
    };
    return labels[type] || type;
  };

  return (
    <div className="resources-page">
      <div className="resources-header">
        <h1>Available Resources</h1>
        <p>Browse and book campus facilities and equipment</p>
      </div>

      {/* Search and Filter Section */}
      <div className="resources-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          {resourceTypes.map((type) => (
            <button
              key={type.value}
              className={`filter-btn ${selectedType === type.value ? 'active' : ''}`}
              onClick={() => setSelectedType(type.value)}
            >
              <Filter size={16} />
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="error-state">
          <AlertCircle size={24} />
          <h3>Unable to Load Resources</h3>
          <p>{error}</p>
          <button onClick={fetchResources} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <Loader size={32} className="spinner" />
          <p>Loading resources...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredResources.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No Resources Found</h3>
          <p>
            {searchTerm
              ? 'Try adjusting your search or filters'
              : 'No active resources available at the moment'}
          </p>
        </div>
      )}

      {/* Resources Grid */}
      {!loading && !error && filteredResources.length > 0 && (
        <div className="resources-grid">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="resource-card"
              onClick={() => setSelectedResource(resource)}
            >
              <div className="card-header">
                <div className="resource-type-badge">
                  <span className="type-icon">{getTypeIcon(resource.type)}</span>
                  <span className="type-label">{getTypeLabel(resource.type)}</span>
                </div>
                <div className="status-badge active">
                  ✓ Active
                </div>
              </div>

              <h3 className="resource-name">{resource.name}</h3>

              <div className="card-details">
                <div className="detail-item">
                  <span className="detail-label">📍 Location</span>
                  <span className="detail-value">{resource.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">👥 Capacity</span>
                  <span className="detail-value">{resource.capacity} people</span>
                </div>
              </div>

              <button className="view-details-btn">
                View Details & Book
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Resource Detail Modal */}
      {selectedResource && (
        <ResourceDetailModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onBook={() => {
            // Navigate to booking with resource ID
            window.location.href = `/bookings/new?resourceId=${selectedResource.id}`;
          }}
        />
      )}
    </div>
  );
};

export default ResourcesPage;
