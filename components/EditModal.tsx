import React, { useState } from 'react';
import { WheelItem } from '../types';
import { X, Plus, Sparkles, Trash2, Clock, Check, Edit2 } from 'lucide-react';
import { generateCreativeChoices } from '../services/geminiService';
import { WHEEL_COLORS } from '../constants';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: WheelItem[];
  setItems: (items: WheelItem[]) => void;
  spinDuration: number;
  setSpinDuration: (n: number) => void;
}

const EditModal: React.FC<EditModalProps> = ({ 
  isOpen, onClose, items, setItems, spinDuration, setSpinDuration 
}) => {
  const [newItemText, setNewItemText] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddOrUpdate = () => {
    if (!newItemText.trim()) return;

    if (editingId) {
        // Update existing
        setItems(items.map(item => 
            item.id === editingId ? { ...item, label: newItemText } : item
        ));
        setEditingId(null);
    } else {
        // Add new
        const newItem: WheelItem = {
            id: Date.now().toString() + Math.random(),
            label: newItemText,
            color: WHEEL_COLORS[items.length % WHEEL_COLORS.length],
            icon: '✨', 
            isImage: false
        };
        setItems([...items, newItem]);
    }
    setNewItemText('');
  };

  const startEdit = (item: WheelItem) => {
      setEditingId(item.id);
      setNewItemText(item.label);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    if (editingId === id) {
        setEditingId(null);
        setNewItemText('');
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    const choices = await generateCreativeChoices(aiPrompt);
    
    const newItems: WheelItem[] = choices.map((choice, idx) => ({
      id: `ai-${Date.now()}-${idx}`,
      label: choice,
      color: WHEEL_COLORS[idx % WHEEL_COLORS.length],
      icon: '✨', // Default icon for AI generated
      isImage: false
    }));
    
    setItems(newItems);
    setIsGenerating(false);
    setAiPrompt('');
  };

  const durationOptions = [3, 5, 8, 10];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] scale-100">
        
        {/* Header */}
        <div className="p-5 bg-white flex justify-between items-center border-b border-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Settings & Choices</h2>
            <p className="text-xs text-slate-400">Customize your game</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          
          {/* Spin Duration */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
               <Clock className="w-3 h-3" /> Spin Duration
             </label>
             <div className="flex gap-2">
                {durationOptions.map(sec => (
                    <button
                        key={sec}
                        onClick={() => setSpinDuration(sec)}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                            spinDuration === sec 
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-200 scale-105' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300'
                        }`}
                    >
                        {sec}s
                    </button>
                ))}
             </div>
          </div>

          {/* AI Generator */}
          <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4 rounded-2xl border border-violet-100/50">
            <label className="text-xs font-bold text-violet-500 uppercase tracking-wider mb-2 block flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Magic Generator
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. Cheap dinner ideas..."
                className="flex-1 bg-white border-0 shadow-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/50"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
              />
              <button 
                onClick={handleAiGenerate}
                disabled={isGenerating}
                className="bg-violet-500 text-white px-4 rounded-xl hover:bg-violet-600 disabled:opacity-50 transition-all shadow-lg shadow-violet-200"
              >
                {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Sparkles className="w-5 h-5"/>}
              </button>
            </div>
          </div>

          {/* Manual Add/Edit */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              {editingId ? 'Edit Option' : 'Add Custom Option'}
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Type name (e.g. Pasta)"
                className="flex-1 bg-slate-50 border-0 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-300 transition-all"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddOrUpdate()}
              />
              <button 
                onClick={handleAddOrUpdate}
                className="bg-rose-500 text-white px-4 py-2 rounded-xl hover:bg-rose-600 active:scale-95 transition-all shadow-lg shadow-rose-200"
              >
                {editingId ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
              </button>
            </div>
            {editingId && (
                <button onClick={() => { setEditingId(null); setNewItemText(''); }} className="text-xs text-rose-500 mt-2 hover:underline ml-1">
                    Cancel Edit
                </button>
            )}
          </div>

          {/* List */}
          <div className="space-y-2">
             <div className="flex justify-between items-end mb-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Current Options
                </label>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{items.length} items</span>
             </div>
            
            {items.length === 0 && (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm">Wheel is empty.</p>
                <p className="text-slate-300 text-xs mt-1">Add something or pick a preset!</p>
              </div>
            )}
            
            <div className="grid gap-2">
              {items.map((item) => (
                <div key={item.id} className={`group flex items-center justify-between bg-white border p-2.5 rounded-xl shadow-sm hover:shadow-md transition-all ${editingId === item.id ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-100'}`}>
                  <div className="flex items-center gap-3 overflow-hidden cursor-pointer flex-1" onClick={() => startEdit(item)}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-inner shrink-0" style={{ backgroundColor: item.color + '20' }}>
                        {item.isImage && item.icon ? (
                            <img src={item.icon} className="w-full h-full object-cover rounded-full" alt="" />
                        ) : (
                            <span>{item.icon || '🔸'}</span>
                        )}
                    </div>
                    <span className="font-semibold text-slate-700 truncate">{item.label}</span>
                  </div>
                  <div className="flex gap-1">
                      <button 
                        onClick={() => startEdit(item)}
                        className="text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg p-2 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg p-2 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
        
        <div className="p-4 border-t border-slate-50 bg-slate-50/50 text-center">
            <button onClick={onClose} className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 active:scale-[0.98] transition-all">
                Save & Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;