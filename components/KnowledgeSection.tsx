
import React, { useState } from 'react';
import { KnowledgeItem } from '../types.ts';
import { Plus, Trash2, FileText, Globe, Shield } from 'lucide-react';

interface KnowledgeSectionProps {
  items: KnowledgeItem[];
  onAdd: (item: Omit<KnowledgeItem, 'id' | 'updatedAt'>) => void;
  onDelete: (id: string) => void;
}

const KnowledgeSection: React.FC<KnowledgeSectionProps> = ({ items, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<KnowledgeItem['category']>('general');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle && newContent) {
      onAdd({ title: newTitle, content: newContent, category: newCategory });
      setNewTitle('');
      setNewContent('');
      setIsAdding(false);
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'policy': return <Shield className="w-4 h-4" />;
      case 'product': return <Globe className="w-4 h-4" />;
      case 'support': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Company Knowledge Base</h2>
          <p className="text-slate-500">Manage the data used by the AI to retrieve facts and draft replies.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Entry
        </button>
      </div>

      {isAdding && (
        <div className="bg-white border border-blue-200 rounded-xl p-6 mb-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Return Policy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="general">General</option>
                  <option value="policy">Policy</option>
                  <option value="support">Support</option>
                  <option value="product">Product</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 h-32 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Full details the AI should know..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-md"
              >
                Save Knowledge
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-all group">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-slate-100 rounded text-slate-600">{getIcon(item.category)}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.category}</span>
              </div>
              <button
                onClick={() => onDelete(item.id)}
                className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{item.content}</p>
            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
              <span className="text-[10px] text-slate-400">Updated {new Date(item.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeSection;
