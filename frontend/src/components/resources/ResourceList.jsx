import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search, Plus, Filter, Building2, FlaskConical,
  Monitor, Users, MapPin, ChevronLeft, ChevronRight,
  Pencil, Trash2, ToggleLeft, AlertCircle, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getResources, deleteResource, updateResourceStatus
} from '../../services/resourceService';
import ResourceFormModal from './ResourceFormModal';

// ── Constants ─────────────────────────────────────────────────────────────────

const RESOURCE_TYPES = ['LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT', 'AUDITORIUM', 'STUDY_ROOM'];
const RESOURCE_STATUSES = ['ACTIVE', 'OUT_OF_SERVICE', 'UNDER_MAINTENANCE', 'DECOMMISSIONED'];

const TYPE_ICONS = {
  LECTURE_HALL: Building2,
  LAB: FlaskConical,
  MEETING_ROOM: Users,
  EQUIPMENT: Monitor,
  AUDITORIUM: Building2,
  STUDY_ROOM: Users,
};

const STATUS_STYLES = {
  ACTIVE: 'bg-emerald-100 text-emerald-800',
  OUT_OF_SERVICE: 'bg-red-100 text-red-800',
  UNDER_MAINTENANCE: 'bg-amber-100 text-amber-800',
  DECOMMISSIONED: 'bg-gray-100 text-gray-600',
};

// ── ResourceList Component ─────────────────────────────────────────────────────

export default function ResourceList({ isAdmin }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Filter state
  const [filters, setFilters] = useState({
    keyword: '',
    type: '',
    status: '',
    location: '',
    minCapacity: '',
  });
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  // ── Data Fetching ──────────────────────────────────────────────────────────

  const { data, isLoading, isError } = useQuery({
    queryKey: ['resources', filters, page],
    queryFn: () => getResources({
      ...filters,
      page,
      size: 9,
      sort: 'name',
    }),
    keepPreviousData: true,
  });

  // ── Mutations ──────────────────────────────────────────────────────────────

  const deleteMutation = useMutation({
    mutationFn: deleteResource,
    onSuccess: () => {
      toast.success('Resource deleted successfully');
      queryClient.invalidateQueries(['resources']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed'),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateResourceStatus(id, status),
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries(['resources']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Status update failed'),
  });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0);
  }, []);

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleStatus = (resource) => {
    const newStatus = resource.status === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE';
    statusMutation.mutate({ id: resource.id, status: newStatus });
  };

  const openCreateModal = () => {
    setEditingResource(null);
    setModalOpen(true);
  };

  const openEditModal = (resource) => {
    setEditingResource(resource);
    setModalOpen(true);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const resources = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;
  const hasFilters = Object.values(filters).some(Boolean);

  const statusCounts = useMemo(() => resources.reduce((acc, resource) => {
    acc[resource.status] = (acc[resource.status] || 0) + 1;
    return acc;
  }, {}), [resources]);

  const activeCount = statusCounts.ACTIVE || 0;
  const maintenanceCount = statusCounts.UNDER_MAINTENANCE || 0;
  const unavailableCount = (statusCounts.OUT_OF_SERVICE || 0) + (statusCounts.DECOMMISSIONED || 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 grid gap-4 lg:grid-cols-[1.4fr_0.6fr] xl:grid-cols-[1.35fr_0.65fr]">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Facilities & Assets</h1>
          <p className="text-sm text-gray-500 mt-2 max-w-2xl">
            Manage lecture halls, labs, meeting rooms and equipment with a clean campus operations dashboard.
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Showing {resources.length} of {totalElements} total resource{totalElements !== 1 ? 's' : ''} on this page.
          </p>
        </div>
        {isAdmin && (
          <div className="flex items-center justify-end">
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200/40 hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              Add Resource
            </button>
          </div>
        )}
      </div>

      {/* Summary Tiles */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Total items</p>
          <p className="mt-3 text-3xl font-semibold text-gray-900">{totalElements}</p>
          <p className="mt-2 text-sm text-gray-500">All resource records currently available.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Active</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-700">{activeCount}</p>
          <p className="mt-2 text-sm text-gray-500">Resources ready for booking or use.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Unavailable</p>
          <p className="mt-3 text-3xl font-semibold text-amber-700">{unavailableCount + maintenanceCount}</p>
          <p className="mt-2 text-sm text-gray-500">Out of service or under maintenance.</p>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or description..."
            value={filters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
            showFilters ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Filter size={16} />
          Filters
        </button>
        {hasFilters && (
          <button
            onClick={() => {
              setFilters({ keyword: '', type: '', status: '', location: '', minCapacity: '' });
              setPage(0);
            }}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {RESOURCE_TYPES.map(t => (
                <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              {RESOURCE_STATUSES.map(s => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Location</label>
            <input
              type="text"
              placeholder="e.g. Block A"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Min Capacity</label>
            <input
              type="number"
              placeholder="e.g. 30"
              min={1}
              value={filters.minCapacity}
              onChange={(e) => handleFilterChange('minCapacity', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-blue-500" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <AlertCircle size={40} className="mb-3 text-red-400" />
          <p>Failed to load resources. Please try again.</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Building2 size={48} className="mb-3 opacity-30" />
          <p className="font-medium">No resources found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              isAdmin={isAdmin}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              onView={() => navigate(`/resources/${resource.id}`)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-gray-600">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <ResourceFormModal
          resource={editingResource}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            setModalOpen(false);
            queryClient.invalidateQueries(['resources']);
          }}
        />
      )}
    </div>
  );
}

// ── ResourceCard ──────────────────────────────────────────────────────────────

function ResourceCard({ resource, isAdmin, onEdit, onDelete, onToggleStatus, onView }) {
  const Icon = TYPE_ICONS[resource.type] || Building2;

  return (
    <div className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Icon size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight">{resource.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{resource.type.replace(/_/g, ' ')}</p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[resource.status]}`}>
          {resource.status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin size={13} className="text-gray-400 flex-shrink-0" />
          <span className="truncate">{resource.location}</span>
        </div>
        {resource.capacity && (
          <div className="flex items-center gap-2">
            <Users size={13} className="text-gray-400 flex-shrink-0" />
            <span>Capacity: {resource.capacity}</span>
          </div>
        )}
        {resource.description && (
          <p className="mt-2 text-xs text-gray-500 line-clamp-2">{resource.description}</p>
        )}
      </div>

      {/* Admin Actions */}
      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
        <button
          onClick={() => onView(resource)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
        >
          View Details
        </button>
        {isAdmin && (
          <>
            <button
              onClick={() => onEdit(resource)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Pencil size={12} />
              Edit
            </button>
            <button
              onClick={() => onToggleStatus(resource)}
              className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors"
            >
              <ToggleLeft size={12} />
              {resource.status === 'ACTIVE' ? 'Disable' : 'Enable'}
            </button>
            <button
              onClick={() => onDelete(resource.id, resource.name)}
              className="ml-auto flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
            >
              <Trash2 size={12} />
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
