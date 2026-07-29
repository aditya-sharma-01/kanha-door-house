import { useState } from 'react';
import { X, Wrench, Save } from 'lucide-react';
import { INITIAL_STAFF } from '../lib/types';

export default function TaskModal({ task: initialTask, invoices = [], onClose, onSave }) {
  const [task, setTask] = useState(initialTask || {
    id: `TASK-${Math.floor(100 + Math.random() * 900)}`,
    invoiceId: invoices[0]?.id || 'INV-2026-001',
    customerName: invoices[0]?.customerName || '',
    customerPhone: invoices[0]?.customerPhone || '',
    installationAddress: invoices[0]?.customerAddress || '',
    workDescription: 'Install 2 UPVC Windows & 1 WPVC Door',
    assignedTechnician: INITIAL_STAFF[2]?.name || 'Amit Kumar',
    technicianPhone: INITIAL_STAFF[2]?.phone || '+91 98351 22441',
    deadline: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    priority: 'Normal',
    status: 'Pending Installation',
    specs: 'UPVC White Frame, 5mm Toughened Glass',
    notes: 'Verify frame anchoring before sealing silicone.',
    completionPhotoUrl: null
  });

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
    const foundTech = INITIAL_STAFF.find(s => s.name === techName);
    setTask(prev => ({
      ...prev,
      assignedTechnician: techName,
      technicianPhone: foundTech ? foundTech.phone : '+91 98351 22441'
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Technician Lead</label>
              <select
                value={task.assignedTechnician}
                onChange={e => handleTechSelect(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                {INITIAL_STAFF.filter(s => s.role.includes('Fit') || s.role.includes('Lead')).map(tech => (
                  <option key={tech.id} value={tech.name}>{tech.name} ({tech.phone})</option>
                ))}
                <option value="Amit Kumar">Amit Kumar (+91 98351 22441)</option>
                <option value="Pankaj Sharma">Pankaj Sharma (+91 97091 44321)</option>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority Level</label>
              <select
                value={task.priority}
                onChange={e => setTask({ ...task, priority: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="Normal">Normal Priority</option>
                <option value="High">High Priority</option>
                <option value="Urgent">Urgent / Express</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Installation Status</label>
              <select
                value={task.status}
                onChange={e => setTask({ ...task, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg font-semibold bg-emerald-50 text-emerald-900 border-emerald-300"
              >
                <option value="Pending Installation">Pending Installation</option>
                <option value="In Progress">In Progress (Fitter On Site)</option>
                <option value="Installed">Installed & Verified</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Technician Field Instructions & Specs</label>
            <input
              type="text"
              value={task.specs}
              onChange={e => setTask({ ...task, specs: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g. 5mm Toughened Glass, Bronze Anodized Hardware"
            />
          </div>

          {/* Action Footer */}
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
              <Save className="w-4 h-4 text-emerald-400" /> Allocate Task
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
