import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft, Building2, FlaskConical, Monitor, Users,
  MapPin, Clock, Calendar, Tag, Loader2, AlertCircle
} from 'lucide-react';
import { getResourceById } from '../services/resourceService';

const TYPE_ICONS = {
  LECTURE_HALL: Building2,
  LAB: FlaskConical,
  MEETING_ROOM: Users,
  EQUIPMENT: Monitor,
  AUDITORIUM: Building2,
  STUDY_ROOM: Users,
};

const STATUS_STYLES = {
  ACTIVE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  OUT_OF_SERVICE: 'bg-red-100 text-red-800 border-red-200',
  UNDER_MAINTENANCE: 'bg-amber-100 text-amber-800 border-amber-200',
  DECOMMISSIONED: 'bg-gray-100 text-gray-600 border-gray-200',
};

/**
 * Detailed view of a single campus resource.
 * Route: /resources/:id
 */
export default function ResourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: resource, isLoading, isError } = useQuery({
    queryKey: ['resource', id],
    queryFn: () => getResourceById(id),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={36} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError || !resource) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-500">
        <AlertCircle size={40} className="mb-3 text-red-400" />
        <p className="font-medium">Resource not found</p>
        <button
          onClick={() => navigate('/resources')}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          Back to catalogue
        </button>
      </div>
    );
  }

  const Icon = TYPE_ICONS[resource.type] || Building2;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">

        {/* Back Button */}
        <button
          onClick={() => navigate('/resources')}
          className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Catalogue
        </button>

        {/* Header Card */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm mb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon size={28} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{resource.name}</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {resource.type.replace(/_/g, ' ')}
                </p>
              </div>
            </div>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[resource.status]}`}>
              {resource.status.replace(/_/g, ' ')}
            </span>
          </div>

          {resource.description && (
            <p className="mt-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
              {resource.description}
            </p>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Location Info */}
          <div className="rounded-xl bg-white border border-gray-200 p-5 shadow-sm">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Location</h3>
            <div className="space-y-2.5">
              <DetailRow icon={MapPin} label="Location" value={resource.location} />
              {resource.building && <DetailRow icon={Building2} label="Building" value={resource.building} />}
              {resource.floor && <DetailRow icon={Tag} label="Floor" value={resource.floor} />}
              {resource.roomNumber && <DetailRow icon={Tag} label="Room No." value={resource.roomNumber} />}
            </div>
          </div>

          {/* Capacity & Availability */}
          <div className="rounded-xl bg-white border border-gray-200 p-5 shadow-sm">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Details</h3>
            <div className="space-y-2.5">
              {resource.capacity && (
                <DetailRow icon={Users} label="Capacity" value={`${resource.capacity} persons`} />
              )}
              {resource.availabilityWindows?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={14} className="text-gray-400" />
                    <span className="font-medium text-gray-500">Availability</span>
                  </div>
                  <ul className="mt-2 space-y-1 pl-6">
                    {resource.availabilityWindows.map((w, i) => (
                      <li key={i} className="text-xs text-gray-600 font-mono">{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Audit Info */}
          <div className="sm:col-span-2 rounded-xl bg-white border border-gray-200 p-5 shadow-sm">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Audit Trail</h3>
            <div className="grid grid-cols-2 gap-3">
              {resource.createdAt && (
                <DetailRow
                  icon={Calendar}
                  label="Created"
                  value={new Date(resource.createdAt).toLocaleString()}
                />
              )}
              {resource.updatedAt && (
                <DetailRow
                  icon={Calendar}
                  label="Last Updated"
                  value={new Date(resource.updatedAt).toLocaleString()}
                />
              )}
              {resource.createdBy && (
                <DetailRow icon={Tag} label="Created By" value={resource.createdBy} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon size={14} className="text-gray-400 flex-shrink-0" />
      <span className="text-gray-500 min-w-[90px]">{label}:</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  );
}
