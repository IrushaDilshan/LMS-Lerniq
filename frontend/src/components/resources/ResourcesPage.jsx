

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ResourceDetailView from "./ResourceDetailView";
import AddEditResourceModal from "./AddEditResourceModal";
import "./ResourcesPage.css";


const API_BASE = "http://localhost:8089/api";

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

const CAPACITY_OPTIONS = [
  { value: "", label: "All Capacities" },
  { value: "10", label: "10+ Persons" },
  { value: "30", label: "30+ Persons" },
  { value: "50", label: "50+ Persons" },
  { value: "100", label: "100+ Persons" },
];

export default function ResourcesPage() {
  const { currentUser } = useAuth();
  const [resources, setResources] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [locationFilter, setLocationFilter] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("");
  const [locationOptions, setLocationOptions] = useState([]);
  
  const [selectedResource, setSelectedResource] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const isAdmin = currentUser?.role === 'ADMIN';

  const types = ["ALL", "LECTURE_HALL", "LAB", "MEETING_ROOM", "EQUIPMENT"];

  useEffect(() => {
    fetchResources();
  }, []);

  // Generate location options from resources
  useEffect(() => {
    const uniqueLocations = [...new Set(resources.map(r => r.location).filter(Boolean))].sort();
    const options = [
      { value: "", label: "All Locations" },
      ...uniqueLocations.map(loc => ({ value: loc, label: loc }))
    ];
    setLocationOptions(options);
  }, [resources]);

  useEffect(() => {
    let result = resources;

    // Filtering Logic
    if (typeFilter !== "ALL") {
      result = result.filter((r) => r.type === typeFilter);
    }
    if (statusFilter !== "ALL") {
      result = result.filter((r) => r.status === statusFilter);
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name?.toLowerCase().includes(s) ||
          r.location?.toLowerCase().includes(s)
      );
    }
    if (locationFilter) {
      result = result.filter((r) => r.location === locationFilter);
    }
    if (capacityFilter) {
      result = result.filter((r) => r.capacity >= parseInt(capacityFilter));
    }

    setFiltered(result);
  }, [resources, search, typeFilter, statusFilter, locationFilter, capacityFilter]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/resources`);
      if (!res.ok) throw new Error("Failed to fetch resources");
      const data = await res.json();
      setResources(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resources-page" style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
      {/* User Info Badge */}
      <div style={{ marginBottom: '20px', padding: '12px 16px', backgroundColor: isAdmin ? '#e3f2fd' : '#f3e5f5', borderRadius: '8px', border: `2px solid ${isAdmin ? '#2196f3' : '#9c27b0'}` }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold', color: isAdmin ? '#1976d2' : '#7b1fa2' }}>
          {isAdmin ? '👨‍💼 Admin Dashboard' : '👤 User Dashboard'} - {currentUser?.name || 'Guest'}
        </span>
      </div>

      {/* Header Section */}
      <div className="resources-header" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '30px', background: '#e9ecef', padding: '10px', borderRadius: '10px' }}>🏢</div>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Resource Management</h1>
              <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>
                {isAdmin 
                  ? 'Manage all campus resources and facilities' 
                  : 'Browse and book available resources'}
              </p>
            </div>
          </div>
          {isAdmin && (
            <button 
              onClick={() => { setEditingResource(null); setShowModal(true); }}
              style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              + Add Resource
            </button>
          )}
        </div>

        {/* Admin Stats Section */}
        {isAdmin && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '2px solid #e3f2fd' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '8px' }}>TOTAL RESOURCES</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2196f3' }}>{resources.length}</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '2px solid #c8e6c9' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '8px' }}>ACTIVE</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4caf50' }}>
                {resources.filter(r => r.status === 'ACTIVE').length}
              </div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '2px solid #ffccbc' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '8px' }}>OUT OF SERVICE</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff7043' }}>
                {resources.filter(r => r.status === 'OUT_OF_SERVICE').length}
              </div>
            </div>
          </div>
        )}

        {/* Search Bar Below Add Resource Button */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '12px', fontSize: '18px', color: '#007bff' }}>🔍</span>
            <input
              type="text"
              placeholder="Search resources..."
              style={{ 
                width: '100%', 
                padding: '12px 12px 12px 45px', 
                borderRadius: '8px', 
                border: '2px solid #e0e0e0', 
                outline: 'none',
                fontSize: '14px',
                transition: 'border-color 0.3s ease'
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>
        </div>

        {/* Filter Section - Admin Only */}
        {isAdmin && (
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#888' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button style={{ padding: '0 15px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9', cursor: 'pointer' }}>📊 Filters</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#666', marginBottom: '5px', textTransform: 'uppercase' }}>Type</label>
                <select style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd', background: 'white' }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  {types.map(t => <option key={t} value={t}>{t === "ALL" ? "All Types" : TYPE_LABELS[t]}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#666', marginBottom: '5px', textTransform: 'uppercase' }}>Status</label>
                <select style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd', background: 'white' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="OUT_OF_SERVICE">Out of Service</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#666', marginBottom: '5px', textTransform: 'uppercase' }}>Location</label>
                <select style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                  {locationOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#666', marginBottom: '5px', textTransform: 'uppercase' }}>Capacity</label>
                <select style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} value={capacityFilter} onChange={(e) => setCapacityFilter(e.target.value)}>
                  {CAPACITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '15px', color: '#007bff', fontSize: '14px', fontWeight: '500' }}>
          🏢 {filtered.length} Resources Available
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div className="spinner" style={{ margin: '0 auto 10px auto' }}></div>
          <p>Loading resources...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '30px', backgroundColor: '#fff5f5', borderRadius: '10px', color: '#c53030' }}>
          <p>⚠️ {error}</p>
          <button onClick={fetchResources} style={{ padding: '8px 16px', backgroundColor: '#c53030', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '12px' }}>
          <p style={{ color: '#666', fontSize: '18px' }}>🔍 No resources found</p>
          <span style={{ color: '#999' }}>Try adjusting your search or filters</span>
        </div>
      ) : (
        <div className="resources-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filtered.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onClick={() => setSelectedResource(resource)}
            />
          ))}
        </div>
      )}

      {selectedResource && (
        <ResourceDetailView
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}

      {showModal && (
        <AddEditResourceModal
          resource={editingResource}
          onSave={() => {
            setShowModal(false);
            setEditingResource(null);
            fetchResources();
          }}
          onClose={() => {
            setShowModal(false);
            setEditingResource(null);
          }}
        />
      )}
    </div>
  );
}

function ResourceCard({ resource, onClick }) {
  return (
    <div className="resource-card" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer', border: '1px solid #eee' }} onClick={onClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <span style={{ fontSize: '24px' }}>{TYPE_ICONS[resource.type] || "📦"}</span>
        <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '12px', backgroundColor: resource.status === "ACTIVE" ? '#e6fffa' : '#fff5f5', color: resource.status === "ACTIVE" ? '#2c7a7b' : '#c53030' }}>
          {resource.status === "ACTIVE" ? "● Active" : "● Out of Service"}
        </span>
      </div>
      <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{resource.name}</h3>
      <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px' }}>{TYPE_LABELS[resource.type] || resource.type}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999', paddingTop: '10px', borderTop: '1px solid #f8f9fa' }}>
        <span>👥 {resource.capacity} Capacity</span>
        <span>📍 {resource.location}</span>
      </div>
    </div>
  );
}