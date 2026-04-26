import React, { useState, useEffect } from 'react';
import { 
  Wrench, Plus, List, AlertTriangle, Clock, CheckCircle, 
  TrendingUp, X, Activity, Shield, Bell, Search, 
  Filter, Calendar, Gauge, Zap, LayoutDashboard
} from 'lucide-react';
import TicketList from '../tickets/TicketList';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon: Icon, label, value, color, bg, trend }) => (
  <div className={`flex flex-col gap-4 p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] transition-all hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.06)] group cursor-pointer relative overflow-hidden`}>
    <div className={`absolute top-0 right-0 w-24 h-24 ${bg} opacity-10 rounded-full blur-3xl -mr-12 -mt-12 transition-all group-hover:scale-150`} />
    
    <div className="flex items-center justify-between relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color} transition-transform group-hover:scale-110 shadow-sm`}>
            <Icon className="w-6 h-6" />
        </div>
        {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-500'}`}>
                {trend > 0 ? <TrendingUp className="w-3 h-3" /> : null}
                {trend}%
            </div>
        )}
    </div>

    <div className="relative z-10">
      <p className="text-4xl font-black text-[#061224] leading-none tracking-tight mb-2">{value}</p>
      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{label}</p>
    </div>

    <div className="mt-4 h-1.5 w-full bg-gray-50 rounded-full overflow-hidden relative z-10">
        <div className={`h-full ${color.replace('text-', 'bg-')} opacity-60 transition-all duration-1000 ease-out`} style={{ width: '70%' }} />
    </div>
  </div>
);

const TicketDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'new'
  const [stats, setStats] = useState({ open: 0, inProgress: 0, resolved: 0, total: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [ticketListKey, setTicketListKey] = useState(0); 
  const [newlySubmittedId, setNewlySubmittedId] = useState(null);

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
      console.error(e);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleTicketSubmitted = (id) => {
    setNewlySubmittedId(id);
    setActiveTab('list');
    setTicketListKey(k => k + 1);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in pb-20">

      {/* ── Page Header ── */}
      <div className="relative group overflow-hidden rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/10">
        <div className="absolute inset-0 bg-gradient-to-r from-[#061224] via-[#0d2147] to-[#1a365d] z-0">
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10 p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-[2rem] bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                    <Wrench className="w-10 h-10 text-blue-300" />
                </div>
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/10 border border-blue-400/20 text-[10px] font-black tracking-[0.2em] uppercase text-blue-300 mb-2">
                        <Shield className="w-3 h-3" /> System Operations
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Support Hub</h1>
                    <p className="text-blue-100/60 font-medium text-sm mt-1 tracking-tight max-w-md">Management console for campus facilities and resource maintenance logs.</p>
                </div>
            </div>

            {currentUser.role === 'USER' && (
                <button
                    onClick={() => setActiveTab(activeTab === 'new' ? 'list' : 'new')}
                    className={`inline-flex items-center gap-3 px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-95
                    ${activeTab === 'new'
                        ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                        : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/30'
                    }`}
                >
                    {activeTab === 'new' ? <><X className="w-5 h-5" /> Cancel Mission</> : <><Plus className="w-5 h-5" /> New Log Report</>}
                </button>
            )}
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Activity}       label="Total Logs"     value={statsLoading ? '—' : stats.total}      color="text-blue-600"    bg="bg-blue-600"    trend={12} />
        <StatCard icon={AlertTriangle} label="Open Issues"     value={statsLoading ? '—' : stats.open}       color="text-amber-600"   bg="bg-amber-600"   trend={-5} />
        <StatCard icon={Clock}         label="In Progress"    value={statsLoading ? '—' : stats.inProgress} color="text-indigo-600"  bg="bg-indigo-600"  trend={3} />
        <StatCard icon={CheckCircle}   label="Resolved"       value={statsLoading ? '—' : stats.resolved}   color="text-emerald-600" bg="bg-emerald-600" trend={8} />
      </div>

      {/* ── View Control ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-[1.5rem] border border-gray-100 shadow-sm w-fit">
            <button
                onClick={() => setActiveTab('list')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                ${activeTab === 'list' ? 'bg-[#061224] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <LayoutDashboard className="w-4 h-4" /> Management Queue
            </button>
            {currentUser.role === 'USER' && (
                <button
                    onClick={() => setActiveTab('new')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                    ${activeTab === 'new' ? 'bg-[#061224] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Plus className="w-4 h-4" /> Report Incident
                </button>
            )}
        </div>

        <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Live Uplink Active
            </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="animate-fade-in">
        {activeTab === 'list' ? (
          <div className="rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl shadow-gray-200/20 bg-white group/list transition-all duration-500 hover:shadow-gray-300/30">
             <TicketList key={ticketListKey} highlightTicketId={newlySubmittedId} />
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
    contactEmail: '',
    contactPhone: '',
  });
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

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
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!emailRegex.test(formData.contactEmail)) {
      errors.contactEmail = 'Please enter a valid email address.';
    }
    if (!phoneRegex.test(formData.contactPhone)) {
      errors.contactPhone = 'Phone number must be exactly 10 digits.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsSubmitting(false);
      return;
    }
    setFieldErrors({});

    try {
      const payload = new FormData();
      const blob = new Blob([JSON.stringify({
        resourceLocation: formData.resourceLocation || 'Unknown',
        category: formData.category,
        description: formData.description,
        priority: formData.priority,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        preferredContactDetails: formData.contactEmail + " / " + formData.contactPhone,
        createdByUserId: 1,
      })], { type: 'application/json' });
      payload.append('ticket', blob);
      files.forEach(f => payload.append('files', f));

      const res = await api2.post('/tickets', payload, { headers: { 'Content-Type': 'multipart/form-data' } });

      if (res.status === 201 || res.status === 200) {
        setSubmitStatus('success');
        const newId = res.data.id;
        setTimeout(() => { if (onSuccess) onSuccess(newId); }, 1500);
        setFormData({ resourceLocation: '', category: '', description: '', priority: 'LOW', contactEmail: '', contactPhone: '' });
        setFieldErrors({});
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
    <div className="max-w-4xl mx-auto bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#061224] via-[#0d2147] to-[#1a365d] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500 opacity-5 rounded-full blur-[100px] -mr-40 -mt-40" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] border border-white/20 backdrop-blur-md flex items-center justify-center">
            <Ticket className="w-8 h-8 text-blue-300" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight leading-none mb-2">Report an Incident</h2>
            <p className="text-blue-100/60 font-medium text-sm">Initiate a formal maintenance request for campus assets.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-10 space-y-8">
        {/* Status banners */}
        {submitStatus === 'success' && (
          <div className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl flex items-start gap-4 border border-emerald-100 animate-fade-in">
            <CheckCircle2 className="w-6 h-6 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-black text-emerald-800 uppercase tracking-widest text-xs mb-1">Success Status</p>
              <p className="text-lg font-bold">Ticket Logged Successfully</p>
              <p className="text-sm opacity-80 mt-1">The maintenance uplink is established. Redirecting...</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Issue Category</label>
            <select name="category" value={formData.category} onChange={handleInputChange} required
              className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none transition-all appearance-none shadow-sm cursor-pointer">
              <option value="" disabled>Select category</option>
              <option value="Hardware">Hardware / Equipment</option>
              <option value="Software">Software / Network</option>
              <option value="Facility">Facility Maintenance</option>
              <option value="Other">Other Issues</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Mission Priority</label>
            <div className="relative">
              <select name="priority" value={formData.priority} onChange={handleInputChange} required
                className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none transition-all appearance-none shadow-sm cursor-pointer">
                {Object.entries(priorityConfig).map(([val, cfg]) => (
                  <option key={val} value={val}>{cfg.label.split(' — ')[0]}</option>
                ))}
              </select>
              <div className={`absolute right-12 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${priorityConfig[formData.priority].dot} shadow-[0_0_8px_rgba(0,0,0,0.1)]`} />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Deployment Location</label>
            <input type="text" name="resourceLocation" value={formData.resourceLocation} onChange={handleInputChange}
              placeholder="e.g. Block C, Level 2, Room 405" required
              className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none transition-all shadow-sm" />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contact Uplink (Email)</label>
            <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange}
              placeholder="id@sliit.lk" required
              className={`w-full bg-gray-50 border ${fieldErrors.contactEmail ? 'border-rose-300' : 'border-gray-100'} text-gray-900 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none transition-all shadow-sm`} />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Secure Phone Line</label>
            <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange}
              placeholder="07XXXXXXXX" required
              className={`w-full bg-gray-50 border ${fieldErrors.contactPhone ? 'border-rose-300' : 'border-gray-100'} text-gray-900 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none transition-all shadow-sm`} />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Mission Briefing (Description)</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="5"
              placeholder="Provide a comprehensive briefing of the incident..."
              className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-[2rem] px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none resize-none transition-all shadow-sm leading-relaxed" />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Evidence Attachments (Optional)</label>
          <div className={`relative border-2 border-dashed rounded-[2rem] p-8 transition-all group
            ${files.length >= 3 ? 'border-gray-100 bg-gray-50/50 opacity-50' : 'border-gray-200 bg-gray-50/30 hover:border-blue-400 hover:bg-blue-50/20 cursor-pointer shadow-inner'}`}>
            <input type="file" multiple accept="image/*" onChange={handleFileChange} disabled={files.length >= 3}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500 transition-transform group-hover:scale-110">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <p className="font-black text-gray-900 text-sm tracking-tight uppercase">Upload Reconnaissance Data</p>
                <p className="text-xs text-gray-400 font-medium mt-1">PNG or JPG up to 10MB · Max 3 files</p>
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {files.map((file, i) => (
                <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-lg">
                  <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-[#061224]/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <button type="button" onClick={() => removeFile(i)}
                      className="p-2 bg-rose-500 text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                      <XIcon className="w-4 h-4" />
                    </button>
                    <span className="text-[9px] text-white font-black uppercase tracking-widest truncate max-w-[80%] px-2">{file.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}
          className="w-full bg-[#061224] text-white hover:bg-blue-600 active:scale-[0.98] transition-all rounded-2xl py-6 font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl shadow-blue-900/20">
          {isSubmitting ? <Activity className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          {isSubmitting ? 'Transmitting Data...' : 'Confirm & Deploy Log'}
        </button>
      </form>
    </div>
  );
};

export default TicketDashboard;

