import { useState } from 'react';
import { X, Layers, Save } from 'lucide-react';

export default function InventoryModal({ item: initialItem, onClose, onSave }) {
  const [item, setItem] = useState(initialItem || {
    id: `RAW-${Math.floor(100 + Math.random() * 900)}`,
    name: 'UPVC Sliding 3-Track Extrusion (6m Bar)',
    category: 'Raw Profile',
    unit: 'Bars',
    stock: 50,
    minAlert: 15,
    costPrice: 950
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!item.name || item.stock < 0) {
      alert('Please provide valid name and stock quantity.');
      return;
    }
    onSave(item);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">{initialItem ? 'Update Stock Item' : 'Add Inventory Item'}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Item Name / Specification *</label>
            <input
              type="text"
              required
              value={item.name}
              onChange={e => setItem({ ...item, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g. WPVC Solid Panel 30mm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={item.category}
                onChange={e => setItem({ ...item, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="Raw Profile">Raw Profile / Bar</option>
                <option value="Glass Sheet">Glass Sheet</option>
                <option value="Hardware">Hardware / Locks / Hinges</option>
                <option value="Finished Door">Finished WPVC/Flush Door</option>
                <option value="Finished Window">Finished UPVC/Aluminium Window</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Unit of Measure</label>
              <input
                type="text"
                value={item.unit}
                onChange={e => setItem({ ...item, unit: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Bars, Sq Ft, Sets, Units"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Stock *</label>
              <input
                type="number"
                required
                min="0"
                value={item.stock}
                onChange={e => setItem({ ...item, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg text-emerald-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Min Alert Level</label>
              <input
                type="number"
                min="0"
                value={item.minAlert}
                onChange={e => setItem({ ...item, minAlert: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg text-red-600 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Cost (₹)</label>
              <input
                type="number"
                min="0"
                value={item.costPrice || 0}
                onChange={e => setItem({ ...item, costPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg text-xs shadow-md"
            >
              <Save className="w-4 h-4 text-emerald-400" /> Save Stock Item
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
