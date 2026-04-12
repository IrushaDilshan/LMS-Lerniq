import React, { useState, useEffect } from 'react';
import { Wrench, Plus, List, AlertTriangle, Clock, CheckCircle, TrendingUp, X } from 'lucide-react';
import TicketSubmissionForm from '../tickets/TicketSubmissionForm';
import TicketList from '../tickets/TicketList';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className={`flex items-center gap-5 px-8 py-7 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] group cursor-pointer`}>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${color} transition-transform group-hover:scale-110`}>
      <Icon className="w-7 h-7" />
    </div>
    <div>
      <p className="text-3xl font-black text-[#061224] leading-none tracking-tight">{value}</p>
      <p className="text-[10px] text-gray-400 mt-1.5 font-black uppercase tracking-widest">{label}</p>
    </div>
  </div>
);

const TicketDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'new'
  const [stats, setStats] = useState({ open: 0, inProgress: 0, resolved: 0, total: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [ticketListKey, setTicketListKey] = useState(0); // force refresh after submit

  useEffect(() => {
    fetchStats();
  }, [ticketListKey]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await api.get('/tickets');
      const tickets = res.data;
      setStats({
        total:      tickets.length,
        open:       tickets.filter(t => t.status === 'OPEN').length,
        inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
        resolved:   tickets.filter(t => t.status === 'RESOLVED').length,
        closed:     tickets.filter(t => t.status === 'CLOSED').length,
        rejected:   tickets.filter(t => t.status === 'REJECTED').length,
      });
    } catch (e) {
      // non-critical
    } finally {
      setStatsLoading(false);
    }
  };

  const handleTicketSubmitted = () => {
    setActiveTab('list');
    setTicketListKey(k => k + 1); // re-render TicketList & re-fetch stats
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto animate-fade-in pb-20">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-[1.5rem] bg-[#061224] flex items-center justify-center shadow-2xl shadow-blue-900/40">
            <Wrench className="w-8 h-8 text-blue-300" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-[#061224] tracking-tight">Support Hub</h1>
            <p className="text-gray-500 font-medium text-sm mt-0.5 tracking-tight">System operations and facility management portal.</p>
          </div>
        </div>

        {/* New Ticket CTA - Only for USER role */}
        {currentUser.role === 'USER' && (
          <button
            onClick={() => setActiveTab(activeTab === 'new' ? 'list' : 'new')}
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl
              ${activeTab === 'new'
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-gray-200/20'
                : 'bg-[#061224] text-white hover:bg-[#1a365d] shadow-blue-900/30 active:scale-95'
              }`}
          >
            {activeTab === 'new' ? <><X className="w-5 h-5" /> Cancel Request</> : <><Plus className="w-5 h-5" /> New Ticket</>}
          </button>
        )}
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={TrendingUp}   label="Total Tickets"  value={statsLoading ? '—' : stats.total}      color="bg-blue-50 text-blue-600" />
        <StatCard icon={AlertTriangle} label="Open Status"    value={statsLoading ? '—' : stats.open}       color="bg-amber-50 text-amber-600" />
        <StatCard icon={Clock}         label="In Progress"   value={statsLoading ? '—' : stats.inProgress} color="bg-indigo-50 text-indigo-600" />
        <StatCard icon={CheckCircle}   label="Resolved"      value={statsLoading ? '—' : stats.resolved}   color="bg-emerald-50 text-emerald-600" />
      </div>

      {/* ── Tab Switcher ── */}
      <div className="flex items-center gap-2 bg-gray-100/50 p-1.5 rounded-2xl w-fit border border-gray-100 backdrop-blur-sm">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
            ${activeTab === 'list' ? 'bg-[#061224] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <List className="w-4 h-4" /> Management Queue
        </button>
        {currentUser.role === 'USER' && (
          <button
            onClick={() => setActiveTab('new')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
              ${activeTab === 'new' ? 'bg-[#061224] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Plus className="w-4 h-4" /> Report Incident
          </button>
        )}
      </div>

      {/* ── Tab Content ── */}
      <div className="animate-fade-in">
        {activeTab === 'list' ? (
          <div className="rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl shadow-blue-900/5 bg-white">
             <TicketList key={ticketListKey} />
          </div>
        ) : (
          <TicketSubmissionFormWrapper onSuccess={handleTicketSubmitted} />
        )}
      </div>
    </div>
  );
};

/* Thin wrapper so we can inject onSuccess into TicketSubmissionForm via prop drilling */
const TicketSubmissionFormWrapper = ({ onSuccess }) => {
  return <TicketSubmissionFormEnhanced onSuccess={onSuccess} />;
};

/* Enhanced version of TicketSubmissionForm that accepts onSuccess callback */
import { UploadCloud, X as XIcon, Send, AlertCircle, CheckCircle2, Ticket } from 'lucide-react';
import api2 from '../../api/axios';

const TicketSubmissionFormEnhanced = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    resourceLocation: '',
    category: '',
    description: '',
    priority: 'LOW',
    preferredContactDetails: '',
  });
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (files.length + selected.length > 3) {
      setErrorMessage('You can only upload a maximum of 3 images.');
      return;
    }
    setErrorMessage('');
    setFiles(prev => [...prev, ...selected].slice(0, 3));
  };

  const removeFile = (i) => setFiles(files.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      const payload = new FormData();
      const blob = new Blob([JSON.stringify({
        resourceLocation: formData.resourceLocation || 'Unknown',
        category: formData.category,
        description: formData.description,
        priority: formData.priority,
        preferredContactDetails: formData.preferredContactDetails || 'N/A',
        createdByUserId: 1,
      })], { type: 'application/json' });
      payload.append('ticket', blob);
      files.forEach(f => payload.append('files', f));

      const res = await api2.post('/tickets', payload, { headers: { 'Content-Type': 'multipart/form-data' } });

      if (res.status === 201 || res.status === 200) {
        setSubmitStatus('success');
        setTimeout(() => { if (onSuccess) onSuccess(); }, 1500);
        setFormData({ resourceLocation: '', category: '', description: '', priority: 'LOW', preferredContactDetails: '' });
        setFiles([]);
      }
    } catch (err) {
      setSubmitStatus('error');
      setErrorMessage(err.response?.data?.message || err.response?.data || 'Failed to submit ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityConfig = {
    LOW:      { label: 'Low — Not urgent',          dot: 'bg-green-400' },
    MEDIUM:   { label: 'Medium — Needs attention',  dot: 'bg-yellow-400' },
    HIGH:     { label: 'High — Affecting work',      dot: 'bg-orange-400' },
    CRITICAL: { label: 'Critical — Complete halt',   dot: 'bg-rose-500' },
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(8,112,184,0.08)] border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#061224] via-[#0d2147] to-[#1a365d] p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full opacity-5 -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-10 w-40 h-40 bg-indigo-400 rounded-full opacity-10 blur-2xl" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm">
            <Ticket className="w-8 h-8 text-blue-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Report an Incident</h2>
            <p className="text-blue-200/80 text-sm mt-1">Submit a maintenance request for campus facilities or equipment.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Status banners */}
        {submitStatus === 'success' && (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-start gap-3 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-emerald-800">Ticket Submitted!</p>
              <p className="text-sm mt-0.5">The maintenance team has been notified. Redirecting to your tickets…</p>
            </div>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="bg-rose-50 text-rose-700 p-4 rounded-xl flex items-start gap-3 border border-rose-100">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-rose-800">Submission Failed</p>
              <p className="text-sm mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}
        {errorMessage && submitStatus !== 'error' && (
          <div className="bg-amber-50 text-amber-700 p-3 rounded-xl text-sm border border-amber-100">{errorMessage}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Category <span className="text-rose-400">*</span></label>
            <select name="category" value={formData.category} onChange={handleInputChange} required
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all">
              <option value="" disabled>Select an issue category</option>
              <option value="Hardware">🖥️ Hardware / Equipment</option>
              <option value="Software">💻 Software / Network</option>
              <option value="Facility">🏛️ Facility / Room Maintenance</option>
              <option value="Other">📋 Other</option>
            </select>
          </div>

          {/* Priority with colored dot */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Priority Level <span className="text-rose-400">*</span></label>
            <div className="relative">
              <select name="priority" value={formData.priority} onChange={handleInputChange} required
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none">
                {Object.entries(priorityConfig).map(([val, cfg]) => (
                  <option key={val} value={val}>{cfg.label}</option>
                ))}
              </select>
              <span className={`absolute right-10 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ${priorityConfig[formData.priority].dot}`} />
            </div>
          </div>

          {/* Resource Location */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Resource or Location <span className="text-rose-400">*</span></label>
            <input type="text" name="resourceLocation" value={formData.resourceLocation} onChange={handleInputChange}
              placeholder="e.g. Hall A, Projector in Lab B" required
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
          </div>

          {/* Contact Details */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Preferred Contact <span className="text-rose-400">*</span></label>
            <input type="text" name="preferredContactDetails" value={formData.preferredContactDetails} onChange={handleInputChange}
              placeholder="e.g. your_email@student.sliit.lk or phone number" required
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
          </div>

          {/* Description */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Detailed Description <span className="text-rose-400">*</span></label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4"
              placeholder="Describe the issue in detail — what happened, when, and how it's affecting you..."
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all" />
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            Evidence Images <span className="text-gray-400 font-normal normal-case">(optional, max 3)</span>
          </label>
          <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-colors group
            ${files.length >= 3 ? 'border-gray-200 bg-gray-50/50 cursor-not-allowed' : 'border-gray-300 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer'}`}>
            <input type="file" multiple accept="image/*" onChange={handleFileChange}
              disabled={files.length >= 3}
              className="absolute inset-0 w-full h-full opacity-0 disabled:cursor-not-allowed cursor-pointer" />
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105
                ${files.length >= 3 ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600'}`}>
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-sm">
                  {files.length >= 3 ? 'Maximum images attached' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 10 MB each · {3 - files.length} slot{3 - files.length !== 1 ? 's' : ''} remaining</p>
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {files.map((file, i) => (
                <div key={i} className="relative group aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
                  <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => removeFile(i)}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-rose-500 shadow">
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/50 text-white text-xs truncate">{file.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button type="submit" disabled={isSubmitting}
          className="w-full bg-[#061224] text-white hover:bg-[#1a365d] active:scale-[0.99] transition-all rounded-xl py-4 font-bold text-base flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20">
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting…
            </>
          ) : (
            <><Send className="w-5 h-5" /> Submit Ticket</>
          )}
        </button>
      </form>
    </div>
  );
};

export default TicketDashboard;
