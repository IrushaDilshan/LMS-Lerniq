import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { X, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { createResource, updateResource } from '../../services/resourceService';

// ── Constants ─────────────────────────────────────────────────────────────────

const RESOURCE_TYPES = [
  { value: 'LECTURE_HALL', label: 'Lecture Hall' },
  { value: 'LAB', label: 'Laboratory' },
  { value: 'MEETING_ROOM', label: 'Meeting Room' },
  { value: 'EQUIPMENT', label: 'Equipment' },
  { value: 'AUDITORIUM', label: 'Auditorium' },
  { value: 'STUDY_ROOM', label: 'Study Room' },
];

const RESOURCE_STATUSES = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'OUT_OF_SERVICE', label: 'Out of Service' },
  { value: 'UNDER_MAINTENANCE', label: 'Under Maintenance' },
  { value: 'DECOMMISSIONED', label: 'Decommissioned' },
];

// ── ResourceFormModal Component ───────────────────────────────────────────────

/**
 * Modal form for creating and editing campus resources.
 * Uses react-hook-form for client-side validation.
 *
 * Props:
 *   resource  - existing resource object (null = create mode)
 *   onClose   - called when modal is dismissed
 *   onSuccess - called after successful save
 */
export default function ResourceFormModal({ resource, onClose, onSuccess }) {
  const isEditMode = Boolean(resource);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: '',
      type: '',
      location: '',
      capacity: '',
      description: '',
      status: 'ACTIVE',
      building: '',
      floor: '',
      roomNumber: '',
      availabilityWindows: '',
    },
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (resource) {
      reset({
        name: resource.name || '',
        type: resource.type || '',
        location: resource.location || '',
        capacity: resource.capacity || '',
        description: resource.description || '',
        status: resource.status || 'ACTIVE',
        building: resource.building || '',
        floor: resource.floor || '',
        roomNumber: resource.roomNumber || '',
        availabilityWindows: resource.availabilityWindows?.join('\n') || '',
      });
    }
  }, [resource, reset]);

  // ── Mutations ────────────────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: createResource,
    onSuccess: () => {
      toast.success('Resource created successfully!');
      onSuccess();
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to create resource';
      const errs = err.response?.data?.errors;
      toast.error(errs ? errs.join(', ') : msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateResource(id, data),
    onSuccess: () => {
      toast.success('Resource updated successfully!');
      onSuccess();
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to update resource';
      toast.error(msg);
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  // ── Submit ───────────────────────────────────────────────────────────────

  const onSubmit = (formData) => {
    // Parse availability windows from textarea (one per line)
    const availabilityWindows = formData.availabilityWindows
      ? formData.availabilityWindows
          .split('\n')
          .map((w) => w.trim())
          .filter(Boolean)
      : [];

    const payload = {
      name: formData.name.trim(),
      type: formData.type,
      location: formData.location.trim(),
      capacity: formData.capacity ? parseInt(formData.capacity, 10) : null,
      description: formData.description?.trim() || null,
      status: formData.status,
      building: formData.building?.trim() || null,
      floor: formData.floor?.trim() || null,
      roomNumber: formData.roomNumber?.trim() || null,
      availabilityWindows,
    };

    if (isEditMode) {
      updateMutation.mutate({ id: resource.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditMode ? 'Edit Resource' : 'Add New Resource'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* Name */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Resource Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Computer Lab A101"
                {...register('name', {
                  required: 'Resource name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  maxLength: { value: 100, message: 'Name cannot exceed 100 characters' },
                })}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register('type', { required: 'Resource type is required' })}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.type ? 'border-red-400 bg-red-50' : 'border-gray-200'
                }`}
              >
                <option value="">Select type...</option>
                {RESOURCE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
              <select
                {...register('status')}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {RESOURCE_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Block A, Floor 2"
                {...register('location', {
                  required: 'Location is required',
                  maxLength: { value: 200, message: 'Location cannot exceed 200 characters' },
                })}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.location ? 'border-red-400 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.location && (
                <p className="mt-1 text-xs text-red-500">{errors.location.message}</p>
              )}
            </div>

            {/* Building / Floor / Room */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Building</label>
              <input
                type="text"
                placeholder="e.g. Engineering Block"
                {...register('building')}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Floor</label>
              <input
                type="text"
                placeholder="e.g. 2nd Floor"
                {...register('floor')}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Room Number</label>
              <input
                type="text"
                placeholder="e.g. A101"
                {...register('roomNumber')}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Capacity */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Capacity</label>
              <input
                type="number"
                placeholder="e.g. 30"
                min={1}
                {...register('capacity', {
                  min: { value: 1, message: 'Capacity must be at least 1' },
                })}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.capacity ? 'border-red-400 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.capacity && (
                <p className="mt-1 text-xs text-red-500">{errors.capacity.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={3}
                placeholder="Brief description of the resource..."
                {...register('description', {
                  maxLength: { value: 500, message: 'Description cannot exceed 500 characters' },
                })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Availability Windows */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Availability Windows
                <span className="ml-2 text-xs font-normal text-gray-400">(one per line, e.g. MON 08:00-18:00)</span>
              </label>
              <textarea
                rows={3}
                placeholder={"MON 08:00-18:00\nTUE 08:00-18:00\nWED 08:00-17:00"}
                {...register('availabilityWindows')}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || (!isDirty && isEditMode)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {isLoading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
