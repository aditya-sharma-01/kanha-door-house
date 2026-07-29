import { useState } from 'react';
import { X, UserCheck, Key, Phone, Save, Shield } from 'lucide-react';

export default function StaffModal({ staffMember: initialStaff, onClose, onSave }) {
  const [staff, setStaff] = useState(initialStaff || {
    id: `STF-${Math.floor(10 + Math.random() * 90)}`,
    name: '',
    role: 'Office Staff', // "Super Admin", "Office Staff", "Field Technician"
    phone: '',
    password: 'staff' + Math.floor(100 + Math.random() * 900),
    status: 'Active',
    createdDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!staff.name || !staff.phone || !staff.password) {
      alert('Please fill staff name, 10-digit mobile number, and password.');
      return;
    }
    onSave(staff);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base">{initialStaff ? 'Edit Staff Credentials' : 'Add New Staff Account'}</h3>
              <p className="text-xs text-slate-400">Super Admin Security Panel</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Staff Member Full Name *</label>
            <input
              type="text"
              required
              value={staff.name}
              onChange={e => setStaff({ ...staff, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="e.g. Ramesh Kumar"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Staff Login Mobile Number *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={staff.phone}
                onChange={e => setStaff({ ...staff, phone: e.target.value })}
                className="w-full pl-9 pr-3 py-2 border rounded-lg font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="e.g. 9504083165"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Staff Login Password *</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={staff.password}
                onChange={e => setStaff({ ...staff, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2 border rounded-lg font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-emerald-800 font-bold"
                placeholder="Set password"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Role</label>
              <select
                value={staff.role}
                onChange={e => setStaff({ ...staff, role: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="Super Admin">Super Admin (Owner)</option>
                <option value="Office Staff">Office Staff (Billing)</option>
                <option value="Field Technician">Field Technician (Fitter)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Account Status</label>
              <select
                value={staff.status}
                onChange={e => setStaff({ ...staff, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-white font-bold text-slate-800"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive (Blocked)</option>
              </select>
            </div>
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
              <Save className="w-4 h-4 text-emerald-400" /> Save Staff Credential
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
