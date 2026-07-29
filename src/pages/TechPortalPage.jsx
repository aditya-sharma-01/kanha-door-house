import { useState, useEffect } from 'react';
import { Wrench, Phone, MapPin, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DataStore } from '../lib/store';
import { BUSINESS_INFO } from '../lib/types';

export default function TechPortalPage() {
  const [tasks, setTasks] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedTech, setSelectedTech] = useState('');
  const [noteInput, setNoteInput] = useState({});

  useEffect(() => {
    // Load cache immediately, then fetch fresh from Firestore
    setTasks(DataStore.getTasks());
    setStaff(DataStore.getStaff());

    Promise.all([
      DataStore.fetchTasks(),
      DataStore.fetchStaff()
    ]).then(([fetchedTasks, fetchedStaff]) => {
      setTasks(fetchedTasks);
      setStaff(fetchedStaff);
      if (fetchedStaff.length > 0 && !selectedTech) {
        setSelectedTech(fetchedStaff[0].name);
      }
    });
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    const note = noteInput[taskId] || null;
    const samplePhoto = newStatus === 'Installed' 
      ? 'https://images.unsplash.com/photo-1534349735944-2b3a6f7a268f?w=600&auto=format&fit=crop&q=60' 
      : null;
    const updated = await DataStore.updateTaskStatus(taskId, newStatus, samplePhoto, note);
    setTasks(updated);
  };

  const myTasks = selectedTech
    ? tasks.filter(t => t.assignedTechnician && t.assignedTechnician.toLowerCase().includes(selectedTech.toLowerCase()))
    : tasks;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      
      {/* Field Tech Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-3">
        <div className="flex justify-between items-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
            <Wrench className="w-3.5 h-3.5" /> Technician Mobile Portal
          </div>
          <Link to="/" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>
        </div>

        <h1 className="text-2xl font-extrabold">Field Installation Duty</h1>
        <p className="text-xs text-slate-400">
          {BUSINESS_INFO.name} • Marwadi Mohalla, Jamalpur, Bihar
        </p>

        {/* Dynamic Technician Selector */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-300 mb-1">Select Active Staff Account</label>
          <select
            value={selectedTech}
            onChange={e => setSelectedTech(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold text-xs"
          >
            {staff.length === 0 ? (
              <option value="">No Active Staff Registered</option>
            ) : (
              staff.map(member => (
                <option key={member.id} value={member.name}>
                  {member.name} ({member.role} - {member.phone})
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* TASK LIST */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="font-extrabold text-slate-900 text-base">Assigned Installation Tasks ({myTasks.length})</h2>
          <span className="text-xs text-slate-500 font-medium">Real-time Firestore Sync</span>
        </div>

        {myTasks.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
            No active installation jobs assigned to {selectedTech || 'selected technician'}.
          </div>
        ) : (
          myTasks.map((task) => (
            <div key={task.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              
              {/* Task Header */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {task.id}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base mt-1">{task.customerName}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  task.status === 'Installed' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : task.status === 'In Progress' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {task.status}
                </span>
              </div>

              {/* Location & Specs */}
              <div className="text-xs text-slate-600 space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-800">{task.installationAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <a href={`tel:${task.customerPhone}`} className="text-emerald-700 font-bold hover:underline">
                    {task.customerPhone} (Call Client)
                  </a>
                </div>
                <div className="pt-1 text-slate-500 border-t border-slate-200/60">
                  <strong>Work Scope:</strong> {task.workDescription}
                </div>
                {task.specs && (
                  <div className="text-slate-500">
                    <strong>Specs:</strong> {task.specs}
                  </div>
                )}
              </div>

              {/* Notes Input */}
              {task.status !== 'Installed' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Add Site Inspection Note (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Frame fitted, silicone sealing remaining..."
                    value={noteInput[task.id] || ''}
                    onChange={e => setNoteInput({ ...noteInput, [task.id]: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-1 flex flex-col gap-2">
                {task.status === 'Pending Installation' && (
                  <button
                    onClick={() => handleStatusChange(task.id, 'In Progress')}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow transition-colors"
                  >
                    Start Fitting (Mark In Progress)
                  </button>
                )}

                {task.status === 'In Progress' && (
                  <button
                    onClick={() => handleStatusChange(task.id, 'Installed')}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
                  >
                    ✓ Complete Installation & Upload Proof
                  </button>
                )}

                {task.status === 'Installed' && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Work Verified & Installed
                    </span>
                    {task.installedDate && (
                      <span className="text-slate-500 text-[11px] font-mono">{task.installedDate}</span>
                    )}
                  </div>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
