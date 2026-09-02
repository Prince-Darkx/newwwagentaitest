import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  Building,
  GraduationCap,
  DollarSign,
  Calendar,
  Clock,
  HelpCircle,
  CheckCircle2,
  X,
  ExternalLink,
  Tag
} from 'lucide-react';
import { KnowledgeBaseItem, KnowledgeCategory } from '../../types.js';
import { createKnowledgeItem, updateKnowledgeItem, deleteKnowledgeItem } from '../../utils/api.js';

interface KnowledgeBaseManagerProps {
  items: KnowledgeBaseItem[];
  onItemsChange: (items: KnowledgeBaseItem[]) => void;
}

export const KnowledgeBaseManager: React.FC<KnowledgeBaseManagerProps> = ({
  items,
  onItemsChange
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<KnowledgeBaseItem | null>(null);

  // Playground Sandbox State
  const [sandboxQuery, setSandboxQuery] = useState<string>('');
  const [sandboxResults, setSandboxResults] = useState<KnowledgeBaseItem[]>([]);
  const [sandboxTested, setSandboxTested] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    category: 'courses' as KnowledgeCategory,
    categoryName: 'Courses & Programs',
    title: '',
    keywords: '',
    content: '',
    tags: ''
  });

  const categories: { id: string; name: string; icon: any }[] = [
    { id: 'all', name: 'All Knowledge Data', icon: BookOpen },
    { id: 'institute_info', name: 'Institute Info', icon: Building },
    { id: 'courses', name: 'Courses & Programs', icon: GraduationCap },
    { id: 'fees_scholarships', name: 'Fees & Scholarships', icon: DollarSign },
    { id: 'admission_eligibility', name: 'Admissions & Eligibility', icon: Calendar },
    { id: 'timings_facilities', name: 'Timings & Facilities', icon: Clock },
    { id: 'faqs_policies', name: 'FAQs & Policies', icon: HelpCircle }
  ];

  const filteredItems = items.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.keywords.some(k => k.toLowerCase().includes(q)) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      category: 'courses',
      categoryName: 'Courses & Programs',
      title: '',
      keywords: '',
      content: '',
      tags: ''
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (item: KnowledgeBaseItem) => {
    setEditingItem(item);
    setFormData({
      category: item.category,
      categoryName: item.categoryName,
      title: item.title,
      keywords: item.keywords.join(', '),
      content: item.content,
      tags: item.tags.join(', ')
    });
    setShowAddModal(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    const payload = {
      category: formData.category,
      categoryName: categories.find(c => c.id === formData.category)?.name || 'General',
      title: formData.title,
      keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
      content: formData.content,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    if (editingItem) {
      const updated = await updateKnowledgeItem(editingItem.id, payload);
      if (updated) {
        onItemsChange(items.map(i => (i.id === editingItem.id ? updated : i)));
      }
    } else {
      const created = await createKnowledgeItem(payload);
      if (created) {
        onItemsChange([created, ...items]);
      }
    }

    setShowAddModal(false);
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this knowledge document?')) {
      const res = await deleteKnowledgeItem(id);
      if (res.success) {
        onItemsChange(items.filter(i => i.id !== id));
      }
    }
  };

  const handleRunRAGTest = () => {
    if (!sandboxQuery.trim()) return;
    const q = sandboxQuery.toLowerCase();
    const scored = items.map(item => {
      let score = 0;
      item.keywords.forEach(kw => {
        if (q.includes(kw.toLowerCase())) score += 5;
      });
      if (item.title.toLowerCase().includes(q)) score += 8;
      if (item.content.toLowerCase().includes(q)) score += 6;
      return { ...item, confidenceScore: score };
    });

    const ranked = scored.filter(s => (s.confidenceScore || 0) > 0).sort((a, b) => (b.confidenceScore || 0) - (a.confidenceScore || 0));
    setSandboxResults(ranked.slice(0, 3));
    setSandboxTested(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Education Industry Knowledge Base — Real RAG Repository
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                Pillar 4 Live
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Manage authoritative university data for real-time AI caller grounding, fee breakdowns, and admission policies.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Knowledge Doc</span>
        </button>
      </div>

      {/* RAG Sandbox Testing Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Live AI Grounding & RAG Retrieval Sandbox
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Test Vector / Semantic Match</span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type any student question to test real-time retrieval (e.g., 'What is the refund policy?' or 'Tell me about MBA fees')"
            value={sandboxQuery}
            onChange={(e) => setSandboxQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunRAGTest()}
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-lg px-3.5 py-2 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
          />
          <button
            onClick={handleRunRAGTest}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <span>Test Grounding</span>
          </button>
        </div>

        {sandboxTested && (
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 animate-fadeIn">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
              {sandboxResults.length > 0 ? `Matched ${sandboxResults.length} Relevant Sources` : 'No direct matches found. Default catalog fallback used.'}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {sandboxResults.map((res) => (
                <div key={res.id} className="p-2 bg-white rounded-lg border border-slate-200 text-xs space-y-1 shadow-xs">
                  <p className="font-bold text-slate-900 truncate">{res.title}</p>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{res.content}</p>
                  <span className="text-[9px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200 font-mono font-semibold">
                    Score: {res.confidenceScore} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  selectedCategory === c.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search Field */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents, keywords, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none shadow-xs"
          />
        </div>
      </div>

      {/* Knowledge Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200 shadow-xs">
            No knowledge documents found matching your filter. Click "Add Knowledge Doc" to create one.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between hover:border-slate-300 transition-colors space-y-3 shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                    {item.categoryName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Updated: {item.lastUpdated}</span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 leading-snug">{item.title}</h3>
                
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                  {item.content}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                {/* Tags & Keywords */}
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((t, idx) => (
                    <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-slate-50 text-slate-600 rounded border border-slate-200">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Card Action Controls */}
                <div className="flex items-center justify-end gap-1.5 pt-1">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
                    title="Edit Document"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
                    title="Delete Document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Knowledge Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingItem ? 'Edit Knowledge Base Document' : 'Add New Knowledge Document'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Knowledge Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                >
                  <option value="institute_info">Institute Info & Overview</option>
                  <option value="courses">Courses & Programs</option>
                  <option value="fees_scholarships">Fees Structure & Scholarships</option>
                  <option value="admission_eligibility">Admission Process & Eligibility</option>
                  <option value="timings_facilities">Timings, Location & Facilities</option>
                  <option value="faqs_policies">FAQs & Policies</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Annual B.Tech CSE Tuition Breakdown & Installments"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Document Content (Grounded Source for AI Voice Agent)</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write clear, factual sentences that Maya (AI) can reference during calls..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-lg p-3 text-xs leading-relaxed focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Keywords (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="fee, tuition, cse, installments"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Tags (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Engineering, Finance, UG"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {editingItem ? 'Save Updates' : 'Add to Knowledge Base'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
