
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Search, Filter, X } from "lucide-react";
import AddEditResourceModal from "./AddEditResourceModal";
import "./AdminResourcesPage.css";

const API_BASE = "http://localhost:8089/api";

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "LECTURE_HALL", label: "Lecture Hall" },
  { value: "LAB", label: "Lab" },
  { value: "MEETING_ROOM", label: "Meeting Room" },
  { value: "EQUIPMENT", label: "Equipment" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "OUT_OF_SERVICE", label: "Out of Service" },
];

const CAPACITY_OPTIONS = [
  { value: "", label: "All Capacities" },
  { value: "10", label: "10+ Persons" },
  { value: "30", label: "30+ Persons" },
  { value: "50", label: "50+ Persons" },
  { value: "100", label: "100+ Persons" },
];

const TYPE_ICONS = {
  LECTURE_HALL: "🏛️",
  LAB: "🔬",
  MEETING_ROOM: "🤝",
  EQUIPMENT: "🎥",
};

export default function AdminResourcesPage() {
  const [resources, setResources] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [locationOptions, setLocationOptions] = useState([]);

  // Generate location options from resources
  useEffect(() => {
    const uniqueLocations = [...new Set(resources.map(r => r.location).filter(Boolean))].sort();
    const options = [
      { value: "", label: "All Locations" },
      ...uniqueLocations.map(loc => ({ value: loc, label: loc }))
    ];
    setLocationOptions(options);
  }, [resources]);

  useEffect(() => { fetchResources(); }, []);

  useEffect(() => {
    let result = [...resources];
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(r =>
        r.name?.toLowerCase().includes(s) ||
        r.description?.toLowerCase().includes(s) ||
        r.location?.toLowerCase().includes(s)
      );
    }
    if (typeFilter) result = result.filter(r => r.type === typeFilter);
    if (statusFilter) result = result.filter(r => r.status === statusFilter);
    if (locationFilter) result = result.filter(r => r.location === locationFilter);
    if (minCapacity) result = result.filter(r => r.capacity >= Number(minCapacity));
    setFiltered(result);
  }, [resources, search, typeFilter, statusFilter, locationFilter, minCapacity]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/resources`);
      if (!res.ok) throw new Error("Failed to load resources. Please try again.");
      const data = await res.json();
      setResources(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setActionLoading(id);
      const res = await fetch(`${API_BASE}/resources/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setResources(prev => prev.filter(r => r.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (resource) => {
    const newStatus = resource.status === "ACTIVE" ? "OUT_OF_SERVICE" : "ACTIVE";
    try {
      setActionLoading(resource.id);
      const res = await fetch(`${API_BASE}/resources/${resource.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Status update failed");
      const updated = await res.json();
      setResources(prev => prev.map(r => r.id === updated.id ? updated : r));
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSave = (savedResource) => {
    if (editingResource) {
      setResources(prev => prev.map(r => r.id === savedResource.id ? savedResource : r));
    } else {
      setResources(prev => [...prev, savedResource]);
    }
    setShowModal(false);
    setEditingResource(null);
  };

  const clearFilters = () => {
    setSearch(""); setTypeFilter(""); setStatusFilter("");
    setLocationFilter(""); setMinCapacity("");
  };

  const totalResources = resources.length;
  const activeCount = resources.filter(r => r.status === "ACTIVE").length;
  const unavailableCount = resources.filter(r => r.status === "OUT_OF_SERVICE").length;

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-header-left">
          <h1 className="admin-page-title">Facilities & Assets</h1>
          <p className="admin-page-subtitle">Manage lecture halls, labs, meeting rooms and equipment with a clean campus operations dashboard.</p>
          <p className="admin-page-count">Showing {filtered.length} of {totalResources} total resources on this page.</p>
        </div>
        <div className="admin-header-right">
          <span className="admin-badge">ADMIN</span>
          <button className="btn-add-resource" onClick={() => { setEditingResource(null); setShowModal(true); }}>
            <Plus size={15} /> Add Resource
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-box">
          <p className="stat-label">TOTAL ITEMS</p>
          <p className="stat-num">{totalResources}</p>
          <p className="stat-desc">All resource records currently available.</p>
        </div>
        <div className="stat-box">
          <p className="stat-label">ACTIVE</p>
          <p className="stat-num green">{activeCount}</p>
          <p className="stat-desc">Resources ready for booking or use.</p>
        </div>
        <div className="stat-box">
          <p className="stat-label">UNAVAILABLE</p>
          <p className="stat-num red">{unavailableCount}</p>
          <p className="stat-desc">Out of service or under maintenance.</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="filter-bar">
        <div className="search-wrap">
          <Search size={14} className="search-ico" />
          <input
            className="search-inp"
            type="text"
            placeholder="Search by name or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className={`btn-filter-toggle ${showFilters ? "active" : ""}`} onClick={() => setShowFilters(!showFilters)}>
          <Filter size={14} /> Filters
        </button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="expanded-filters">
          <div className="filter-group">
            <label>Type</label>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Location</label>
            <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
              {locationOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Capacity</label>
            <select value={minCapacity} onChange={e => setMinCapacity(e.target.value)}>
              {CAPACITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <button className="btn-clear" onClick={clearFilters}><X size={13} /> Clear</button>
        </div>
      )}

      {/* Table / States */}
      {loading ? (
        <div className="state-box"><div className="spinner"></div><p>Loading resources...</p></div>
      ) : error ? (
        <div className="state-box">
          <div className="err-icon">!</div>
          <p className="err-text">{error}</p>
          <button className="btn-retry" onClick={fetchResources}>Try Again</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="state-box"><p className="empty-msg">No resources found matching your filters.</p></div>
      ) : (
        <div className="table-wrap">
          <table className="res-table">
            <thead>
              <tr>
                <th>Resource</th><th>Type</th><th>Capacity</th><th>Location</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td>
                    <div className="res-cell">
                      <span className="res-ico">{TYPE_ICONS[r.type] || "📦"}</span>
                      <div>
                        <p className="res-name">{r.name}</p>
                        {r.description && <p className="res-desc">{r.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td><span className="type-chip">{r.type?.replace(/_/g, " ")}</span></td>
                  <td>{r.capacity}</td>
                  <td>{r.location}</td>
                  <td>
                    <span className={`status-chip ${r.status === "ACTIVE" ? "s-active" : "s-inactive"}`}>
                      {r.status === "ACTIVE" ? "Active" : "Out of Service"}
                    </span>
                  </td>
                  <td>
                    <div className="row-acts">
                      <button className="act-btn" onClick={() => handleToggleStatus(r)} disabled={actionLoading === r.id} title="Toggle Status">
                        {r.status === "ACTIVE" ? <ToggleRight size={18} color="#16a34a" /> : <ToggleLeft size={18} color="#94a3b8" />}
                      </button>
                      <button className="act-btn edit" onClick={() => { setEditingResource(r); setShowModal(true); }} title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button className="act-btn del" onClick={() => setDeleteConfirm(r)} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="confirm-box" onClick={e => e.stopPropagation()}>
            <h3>Delete Resource?</h3>
            <p>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This cannot be undone.</p>
            <div className="confirm-btns">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-del-confirm" onClick={() => handleDelete(deleteConfirm.id)} disabled={actionLoading === deleteConfirm.id}>
                {actionLoading === deleteConfirm.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <AddEditResourceModal
          resource={editingResource}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingResource(null); }}
        />
      )}
    </div>
  );
}
