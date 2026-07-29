import { useState } from 'react';
import { X, Wrench, Save, Plus, Trash2, Layers } from 'lucide-react';

export default function TaskModal({ task: initialTask, invoices = [], staff = [], inventory = [], onClose, onSave }) {
  // Filter all active staff or technicians
  const fitters = staff.length > 0
    ? staff.filter(s => s.status !== 'Inactive')
    : [];

  const [task, setTask] = useState(initialTask || {
    id: `TASK-${Math.floor(100 + Math.random() * 900)}`,
    invoiceId: invoices[0]?.id || '',
    customerName: invoices[0]?.customerName || '',
    customerPhone: invoices[0]?.customerPhone || '',
    installationAddress: invoices[0]?.customerAddress || '',
    workDescription: invoices[0] ? `Install items from invoice ${invoices[0].id}` : '',
    assignedTechnician: fitters[0]?.name || 'Unassigned',
    technicianPhone: fitters[0]?.phone || '',
    deadline: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    priority: 'Normal',
    status: 'Pending Installation',
    specs: 'UPVC / WPVC Machine Cut Fittings',
    notes: '',
    completionPhotoUrl: null,
    allocatedMaterials: []
  });

  const [selectedItemId, setSelectedItemId] = useState(inventory[0]?.id || '');
  const [selectedQty, setSelectedQty] = useState(1);

  const handleInvoiceSelect = (invId) => {
    const selectedInv = invoices.find(i => i.id === invId);
    if (selectedInv) {
      setTask(prev => ({
        ...prev,
        invoiceId: selectedInv.id,
        customerName: selectedInv.customerName,
        customerPhone: selectedInv.customerPhone,
        installationAddress: selectedInv.customerAddress,
        workDescription: `Install: ${selectedInv.items.map(i => i.description).join(', ')}`
      }));
    } else {
      setTask(prev => ({ ...prev, invoiceId: invId }));
    }
  };

  const handleTechSelect = (techName) => {
    const foundTech = fitters.find(s => s.name === techName);
    setTask(prev => ({
      ...prev,
      assignedTechnician: techName,
      technicianPhone: foundTech ? foundTech.phone : ''
    }));
  };

  const handleAddMaterial = () => {
    if (!selectedItemId) return;
    const invItem = inventory.find(i => i.id === selectedItemId);
    if (!invItem) return;

    const qty = Number(selectedQty) || 1;
    const existing = (task.allocatedMaterials || []).findIndex(m => m.itemId === invItem.id);

    let updatedMats = [...(task.allocatedMaterials || [])];
    if (existing >= 0) {
      updatedMats[existing] = {
        ...updatedMats[existing],
        plannedQty: updatedMats[existing].plannedQty + qty,
        actualQty: (updatedMats[existing].actualQty || updatedMats[existing].plannedQty) + qty,
      };
    } else {
      updatedMats.push({
        itemId: invItem.id,
        name: invItem.name,
        unit: invItem.unit,
        plannedQty: qty,
        actualQty: qty,
      });
    }

    setTask(prev => ({ ...prev, allocatedMaterials: updatedMats }));
  };

  const handleRemoveMaterial = (index) => {
    setTask(prev => ({
      ...prev,
      allocatedMaterials: (prev.allocatedMaterials || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.customerName || !task.workDescription) {
      alert('Please fill customer name and work description.');
      return;
    }
    onSave(task);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Wrench className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base">{initialTask ? 'Edit Installation Task' : 'Allocate New Installation Task'}</h3>
              <p className="text-xs text-slate-400">Kanha Door House Field Operations</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm max-h-[80vh] overflow-y-auto">
          
          {/* Linked Invoice */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Link to Customer Invoice</label>
            <select
              value={task.invoiceId}
              onChange={e => handleInvoiceSelect(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-slate-50 font-mono text-xs"
            >
              <option value="">-- Manual Task (No Linked Invoice) --</option>
              {invoices.map(inv => (
                <option key={inv.id} value={inv.id}>
                  {inv.id} - {inv.customerName} ({inv.customerPhone})
                </option>
              ))}
            </select>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Name *</label>
              <input
                type="text"
                required
                value={task.customerName}
                onChange={e => setTask({ ...task, customerName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Contact Phone *</label>
              <input
                type="text"
                required
                value={task.customerPhone}
                onChange={e => setTask({ ...task, customerPhone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Installation Site Location Address</label>
            <input
              type="text"
              value={task.installationAddress}
              onChange={e => setTask({ ...task, installationAddress: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g. Marwadi Mohalla, Jamalpur, Bihar"
            />
          </div>

          {/* Work Description & Specs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Work Description & Scope *</label>
            <textarea
              rows="2"
              required
              value={task.workDescription}
              onChange={e => setTask({ ...task, workDescription: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g. Fit 2 UPVC 3-Track Windows & 1 WPVC Door"
            ></textarea>
          </div>

          {/* MATERIAL ALLOCATION SECTION */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" /> Allocate Stock Materials & Hardware for Task
              </label>
              <span className="text-[10px] text-slate-500 font-medium">Auto-deducts from Firestore upon completion</span>
            </div>

            {/* Material Selector Row */}
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedItemId}
                onChange={e => setSelectedItemId(e.target.value)}
                className="flex-grow px-3 py-2 border rounded-lg bg-white text-xs"
              >
                {inventory.length === 0 ? (
                  <option value="">No Stock Items Available in Inventory</option>
                ) : (
                  inventory.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} (Stock: {item.stock} {item.unit})
                    </option>
                  ))
                )}
              </select>
              <input
                type="number"
                min="1"
                value={selectedQty}
                onChange={e => setSelectedQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-3 py-2 border rounded-lg text-xs"
                placeholder="Qty"
              />
              <button
                type="button"
                onClick={handleAddMaterial}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Material
              </button>
            </div>

            {/* List of Allocated Materials */}
            {(!task.allocatedMaterials || task.allocatedMaterials.length === 0) ? (
              <div className="text-[11px] text-slate-400 italic text-center py-1">
                No stock materials allocated to this task yet.
              </div>
            ) : (
              <div className="space-y-1.5 pt-1">
                {task.allocatedMaterials.map((mat, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{mat.name}</span>
                      <span className="text-slate-500 font-mono text-[11px] ml-2">[{mat.itemId}]</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {mat.plannedQty} {mat.unit}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMaterial(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove material"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Staff / Technician</label>
              <select
                value={task.assignedTechnician}
                onChange={e => handleTechSelect(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                {fitters.length === 0 ? (
                  <option value="">No Active Staff Found in Firestore</option>
                ) : (
                  fitters.map(member => (
                    <option key={member.id} value={member.name}>
                      {member.name} ({member.role} - {member.phone})
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Completion Deadline</label>
              <input
                type="date"
                value={task.deadline}
                onChange={e => setTask({ ...task, deadline: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={task.priority}
                onChange={e => setTask({ ...task, priority: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="Normal">Normal</option>
                <option value="High">High Priority</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Task Status</label>
              <select
                value={task.status}
                onChange={e => setTask({ ...task, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg font-semibold"
              >
                <option value="Pending Installation">Pending Installation</option>
                <option value="In Progress">In Progress</option>
                <option value="Installed">Installed & Verified</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Material & Profile Specs Note</label>
            <input
              type="text"
              value={task.specs}
              onChange={e => setTask({ ...task, specs: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g. UPVC White Frame, 5mm Toughened Glass"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Technician Instructions & Site Notes</label>
            <textarea
              rows="2"
              value={task.notes}
              onChange={e => setTask({ ...task, notes: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-slate-600"
              placeholder="e.g. Carry 100mm SDS drill bits and anchor bolts."
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              <Save className="w-4 h-4" /> Save Task to Firestore
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
