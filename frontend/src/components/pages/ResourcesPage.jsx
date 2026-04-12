import React, { useState, useMemo } from 'react';
import {
  BookOpen, Search, Download, ExternalLink, FileText, Video,
  Headphones, Link2, Star, Clock, Filter, ChevronRight, Sparkles,
  GraduationCap, FlaskConical, Code2, Globe, BarChart3, Cpu
} from 'lucide-react';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'all',        label: 'All Resources', icon: BookOpen },
  { id: 'lecture',    label: 'Lecture Notes',  icon: FileText },
  { id: 'video',      label: 'Video Lessons',  icon: Video },
  { id: 'audio',      label: 'Podcasts',        icon: Headphones },
  { id: 'link',       label: 'External Links',  icon: Link2 },
  { id: 'research',   label: 'Research Papers', icon: GraduationCap },
];

const SUBJECT_COLORS = {
  'Software Engineering': { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500',   icon: Code2 },
  'Data Science':         { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500', icon: BarChart3 },
  'Networking':           { bg: 'bg-cyan-50',   text: 'text-cyan-700',   dot: 'bg-cyan-500',   icon: Globe },
  'AI & Machine Learning':{ bg: 'bg-rose-50',   text: 'text-rose-700',   dot: 'bg-rose-500',   icon: Cpu },
  'Biology':              { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500',  icon: FlaskConical },
  'Mathematics':          { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500',  icon: BarChart3 },
};

const RESOURCES = [
  {
    id: 1, type: 'lecture', subject: 'Software Engineering',
    title: 'Software Design Patterns — SOLID Principles',
    description: 'Comprehensive lecture notes covering all SOLID principles with real-world Java examples and diagrams.',
    author: 'Dr. R. Shannon', date: 'Apr 2, 2026', size: '3.4 MB', pages: 48,
    featured: true, rating: 4.9, downloads: 312,
    tag: 'Week 7',
  },
  {
    id: 2, type: 'video', subject: 'AI & Machine Learning',
    title: 'Introduction to Neural Networks',
    description: 'Full 90-minute recorded lecture on feedforward networks, backpropagation and gradient descent.',
    author: 'Prof. A. Singh', date: 'Mar 28, 2026', duration: '1h 32m',
    featured: true, rating: 4.8, downloads: 254,
    tag: 'Core Module',
  },
  {
    id: 3, type: 'research', subject: 'Data Science',
    title: 'Exploratory Data Analysis with Python — A Practical Guide',
    description: 'Step-by-step walkthrough of EDA techniques using Pandas, Seaborn and Matplotlib on real datasets.',
    author: 'Irusha Dilshan', date: 'Apr 5, 2026', size: '1.8 MB', pages: 22,
    featured: false, rating: 4.7, downloads: 189,
    tag: 'Assignment 2',
  },
  {
    id: 4, type: 'lecture', subject: 'Networking',
    title: 'OSI Model & TCP/IP Stack Deep Dive',
    description: 'Layered breakdown of network protocols with packet tracing examples and Wireshark screenshots.',
    author: 'Mr. K. Perera', date: 'Mar 22, 2026', size: '5.1 MB', pages: 64,
    featured: false, rating: 4.6, downloads: 203,
    tag: 'Week 5',
  },
  {
    id: 5, type: 'audio', subject: 'Mathematics',
    title: 'Linear Algebra Revision — Eigenvectors & Eigenvalues',
    description: 'Audio lecture series for exam revision covering eigenvectors, diagonalisation and applications.',
    author: 'Dr. M. Fonseka', date: 'Apr 1, 2026', duration: '42 min',
    featured: false, rating: 4.5, downloads: 97,
    tag: 'Exam Prep',
  },
  {
    id: 6, type: 'link', subject: 'AI & Machine Learning',
    title: 'Hugging Face — Transformers Documentation',
    description: 'Official documentation and tutorials for the leading NLP transformer library.',
    author: 'External', date: 'Apr 6, 2026',
    featured: false, rating: 4.9, downloads: 441,
    tag: 'Reference',
  },
  {
    id: 7, type: 'video', subject: 'Software Engineering',
    title: 'Clean Code Workshop — Refactoring Techniques',
    description: 'Recorded workshop session demonstrating live refactoring of legacy code with test coverage.',
    author: 'Dr. R. Shannon', date: 'Apr 3, 2026', duration: '58 min',
    featured: false, rating: 4.8, downloads: 177,
    tag: 'Workshop',
  },
  {
    id: 8, type: 'research', subject: 'Biology',
    title: 'CRISPR-Cas9 Gene Editing — 2024 Review',
    description: 'A curated review paper summarising recent advances in CRISPR gene therapy and ethical considerations.',
    author: 'Dr. L. Wijesinghe', date: 'Mar 15, 2026', size: '2.9 MB', pages: 31,
    featured: false, rating: 4.6, downloads: 138,
    tag: 'Research',
  },
  {
    id: 9, type: 'lecture', subject: 'Data Science',
    title: 'SQL for Data Analysts — Window Functions',
    description: 'Lecture notes and exercises on advanced SQL window functions including RANK, LEAD, LAG and partitioning.',
    author: 'Ms. T. Fernando', date: 'Apr 4, 2026', size: '2.2 MB', pages: 29,
    featured: false, rating: 4.7, downloads: 261,
    tag: 'Week 9',
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

const TypeIcon = ({ type, className = 'w-5 h-5' }) => {
  const map = {
    lecture:  { icon: FileText,   cls: 'text-blue-600 bg-blue-100' },
    video:    { icon: Video,      cls: 'text-rose-600 bg-rose-100' },
    audio:    { icon: Headphones, cls: 'text-amber-600 bg-amber-100' },
    link:     { icon: ExternalLink, cls: 'text-teal-600 bg-teal-100' },
    research: { icon: GraduationCap, cls: 'text-purple-600 bg-purple-100' },
  };
  const cfg = map[type] || map.lecture;
  const Icon = cfg.icon;
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.cls}`}>
      <Icon className={className} />
    </div>
  );
};

const StarRating = ({ rating }) => (
  <span className="inline-flex items-center gap-1 text-amber-500 font-semibold text-xs">
    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
    {rating.toFixed(1)}
  </span>
);

const ResourceCard = ({ resource }) => {
  const subjectCfg = SUBJECT_COLORS[resource.subject] || {
    bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-400', icon: BookOpen,
  };

  const actionLabel = resource.type === 'link' ? 'Open Link' : resource.type === 'video' || resource.type === 'audio' ? 'Play' : 'Download';
  const ActionIcon = resource.type === 'link' ? ExternalLink : Download;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Top colour strip */}
      <div className={`h-1 w-full ${subjectCfg.dot}`} />

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <TypeIcon type={resource.type} className="w-4 h-4" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${subjectCfg.bg} ${subjectCfg.text}`}>
                {resource.subject}
              </span>
              {resource.tag && (
                <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{resource.tag}</span>
              )}
            </div>
            <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
              {resource.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{resource.description}</p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-auto flex-wrap">
          <span className="font-medium text-gray-600">{resource.author}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{resource.date}</span>
          {resource.size   && <span>· {resource.size}</span>}
          {resource.duration && <span>· {resource.duration}</span>}
          {resource.pages  && <span>· {resource.pages}p</span>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-1">
          <div className="flex items-center gap-3">
            <StarRating rating={resource.rating} />
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <Download className="w-3 h-3" />{resource.downloads}
            </span>
          </div>
          <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#061224] bg-gray-100 hover:bg-[#061224] hover:text-white px-3 py-1.5 rounded-lg transition-all">
            <ActionIcon className="w-3.5 h-3.5" /> {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const FeaturedCard = ({ resource }) => {
  const subjectCfg = SUBJECT_COLORS[resource.subject] || { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-400', icon: BookOpen };
  const SubIcon = subjectCfg.icon;
  return (
    <div className="relative bg-gradient-to-br from-[#061224] via-[#0d2147] to-[#1a3a6b] rounded-2xl p-6 text-white overflow-hidden flex flex-col justify-between min-h-[200px] shadow-lg group hover:shadow-2xl transition-shadow">
      {/* BG glow */}
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-20 bg-blue-400" />
      <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full blur-2xl opacity-10 bg-indigo-500" />
      <SubIcon className="absolute right-6 bottom-6 w-24 h-24 text-white opacity-5" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-amber-400/90 text-amber-900 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Featured
          </span>
          <TypeIcon type={resource.type} className="w-4 h-4" />
        </div>
        <h3 className="font-bold text-lg leading-snug mb-2 group-hover:text-blue-200 transition-colors">{resource.title}</h3>
        <p className="text-blue-200/70 text-xs leading-relaxed line-clamp-2">{resource.description}</p>
      </div>

      <div className="relative z-10 flex items-center justify-between mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center gap-3 text-xs text-blue-300/80">
          <span>{resource.author}</span>
          <StarRating rating={resource.rating} />
        </div>
        <button className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-lg transition-all border border-white/10">
          View <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const ResourcesPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const featured = RESOURCES.filter(r => r.featured);

  const filtered = useMemo(() => {
    return RESOURCES.filter(r => {
      const matchCat = activeCategory === 'all' || r.type === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in-up">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-[#061224] flex items-center justify-center shadow">
              <BookOpen className="w-5 h-5 text-blue-300" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#061224] tracking-tight">Resources</h1>
          </div>
          <p className="text-gray-500 ml-[52px] text-sm">Browse lecture notes, videos, research papers and more.</p>
        </div>

        {/* Total count badge */}
        <div className="flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-2 text-sm font-semibold text-gray-700">
          <BookOpen className="w-4 h-4 text-blue-500" />
          {RESOURCES.length} Resources Available
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by title, subject, or author…"
          className="w-full pl-12 pr-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-semibold">
            Clear
          </button>
        )}
      </div>

      {/* ── Featured Resources ── */}
      {!searchQuery && activeCategory === 'all' && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-bold text-gray-800">Featured This Week</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featured.map(r => <FeaturedCard key={r.id} resource={r} />)}
          </div>
        </section>
      )}

      {/* ── Category Filter Tabs ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-gray-400" />
          <h2 className="text-base font-bold text-gray-800">Browse by Type</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const count = cat.id === 'all' ? RESOURCES.length : RESOURCES.filter(r => r.type === cat.id).length;
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all
                  ${activeCategory === cat.id
                    ? 'bg-[#061224] text-white border-[#061224] shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                <Icon className="w-4 h-4" />
                {cat.label}
                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full
                  ${activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Resource Grid ── */}
      <section>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-base font-bold text-gray-800">
            {searchQuery
              ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${searchQuery}"`
              : activeCategory === 'all' ? 'All Resources' : CATEGORIES.find(c => c.id === activeCategory)?.label}
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-lg font-bold text-gray-600">No resources found</p>
            <p className="text-sm text-gray-400 mt-1">Try a different keyword or category.</p>
            <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-4 text-sm font-semibold text-blue-600 hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(r => <ResourceCard key={r.id} resource={r} />)}
          </div>
        )}
      </section>

      {/* ── Subject Modules Quick-Access ── */}
      {!searchQuery && activeCategory === 'all' && (
        <section className="pb-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-4 h-4 text-gray-400" />
            <h2 className="text-base font-bold text-gray-800">Browse by Subject</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(SUBJECT_COLORS).map(([subject, cfg]) => {
              const SubIcon = cfg.icon;
              const count = RESOURCES.filter(r => r.subject === subject).length;
              return (
                <button key={subject}
                  onClick={() => { setSearchQuery(subject); setActiveCategory('all'); }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 ${cfg.bg} hover:shadow-md hover:-translate-y-0.5 transition-all group`}>
                  <SubIcon className={`w-6 h-6 ${cfg.text}`} />
                  <span className={`text-[11px] font-bold text-center leading-tight ${cfg.text}`}>{subject}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{count} resource{count !== 1 ? 's' : ''}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default ResourcesPage;
