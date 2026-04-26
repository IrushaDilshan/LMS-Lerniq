import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, AlertCircle, Loader } from 'lucide-react';
import AddEditResourceModal from '../resources/AddEditResourceModal';
import './AdminResourcesPage.css';

const AdminResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/resources');
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      const data = await response.json();
      setResources(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddResource = () => {
    setEditingResource(null);
    setShowModal(true);
  };

  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setShowModal(true);
  };

  const handleDeleteResource = async (id) => {
    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete resource');
      }
      setResources(resources.filter(r => r.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert('Error deleting resource: ' + err.message);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE';
      const response = await fetch(`/api/resources/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error('Failed to update resource status');
      }
      const updatedResource = await response.json();
      setResources(resources.map(r => r.id === id ? updatedResource : r));
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleSaveResource = () => {
    fetchResources();
    setShowModal(false);
    setEditingResource(null);
  };

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
    <div className="admin-resources-page">
      <div className="admin-header">
        <h1>Resource Management</h1>
        <p>Manage all campus resources and facilities</p>
      </div>

      <div className="admin-actions">
        <button className="btn btn-primary" onClick={handleAddResource}>
          <Plus size={18} />
          Add Resource
        </button>
      </div>

      {error && (
        <div className="error-alert">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={fetchResources}>Retry</button>
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <Loader size={32} className="spinner" />
          <p>Loading resources...</p>
        </div>
      )}

      {!loading && resources.length === 0 && (
        <div className="empty-container">
          <p>No resources found. Create your first resource.</p>
        </div>
      )}

      {!loading && resources.length > 0 && (
        <div className="resources-table-wrapper">
          <table className="resources-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource.id} className={`status-${resource.status.toLowerCase()}`}>
                  <td className="name-cell">
                    <strong>{resource.name}</strong>
                  </td>
                  <td>
                    <span className="type-badge">
                      {getTypeIcon(resource.type)} {getTypeLabel(resource.type)}
                    </span>
                  </td>
                  <td>{resource.location}</td>
                  <td>{resource.capacity}</td>
                  <td>
                    <span className={`status-badge ${resource.status.toLowerCase()}`}>
                      {resource.status === 'ACTIVE' ? '✓ Active' : '⚠ Out of Service'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditResource(resource)}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="action-btn toggle-btn"
                      onClick={() => handleToggleStatus(resource.id, resource.status)}
                      title="Toggle Status"
                    >
                      {resource.status === 'ACTIVE' ? (
                        <ToggleRight size={16} />
                      ) : (
                        <ToggleLeft size={16} />
                      )}
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => setDeleteConfirm(resource.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <AddEditResourceModal
          resource={editingResource}
          onClose={() => {
            setShowModal(false);
            setEditingResource(null);
          }}
          onSave={handleSaveResource}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this resource? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteResource(deleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResourcesPage;
