import { useState, useEffect } from 'react';
import { Wrench, Phone, MapPin, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DataStore } from '../lib/store';
import { BUSINESS_INFO } from '../lib/types';

export default function TechPortalPage() {
  const [tasks, setTasks] = useState([]);
  const [selectedTech, setSelectedTech] = useState('Amit Kumar');
  const [noteInput, setNoteInput] = useState({});

  useEffect(() => {
    // Load cache immediately, then refresh from Firestore
    setTasks(DataStore.getTasks());
    DataStore.fetchTasks().then(setTasks);
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    const note = noteInput[taskId] || null;
    const samplePhoto = newStatus === 'Installed' 
      ? 'https://images.unsplash.com/photo-1534349735944-2b3a6f7a268f?w=600&auto=format&fit=crop&q=60' 
      : null;
    const updated = await DataStore.updateTaskStatus(taskId, newStatus, samplePhoto, note);
    setTasks(updated);
  };

  const myTasks = tasks.filter(t => t.assignedTechnician.toLowerCase().includes(selectedTech.toLowerCase()));

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

        {/* Technician Selector */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-300 mb-1">Select Active Fitter Account</label>
          <select
            value={selectedTech}
            onChange={e => setSelectedTech(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold text-xs"
          >
            <option value="Amit Kumar">Amit Kumar (Senior Lead - 9835122441)</option>
            <option value="Pankaj Sharma">Pankaj Sharma (UPVC Fitter - 9709144321)</option>
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
            No active installation jobs assigned to {selectedTech}.
          </div>
        ) : (
          myTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md space-y-4">
              
              {/* Task Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {task.id}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-1">{task.customerName}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${task.status === 'Installed' ? 'bg-emerald-100 text-emerald-800' : task.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                  {task.status}
                </span>
              </div>

              {/* Work Scope */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="font-bold text-slate-800">Scope of Work:</div>
                <p className="text-slate-700 leading-relaxed font-medium">{task.workDescription}</p>
                <div className="text-slate-500 pt-1">Specs: {task.specs}</div>
              </div>

              {/* Quick Actions Grid (Call & Directions) */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${task.customerPhone}`}
                  className="py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-600" /> Call Customer
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(task.installationAddress)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-emerald-600" /> Open Map GPS
                </a>
              </div>

              {/* Address */}
              <div className="text-xs text-slate-600 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{task.installationAddress}</span>
              </div>

              {/* Technician Notes input */}
              {task.status !== 'Installed' && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-500">Installation Notes / Observations</label>
                  <input
                    type="text"
                    placeholder="e.g. Frame fitted with 4 anchor bolts. Silicone sealed."
                    value={noteInput[task.id] || ''}
                    onChange={e => setNoteInput({ ...noteInput, [task.id]: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-lg text-xs"
                  />
                </div>
              )}

              {/* Status Update Buttons */}
              <div className="pt-2 border-t border-slate-100">
                {task.status === 'Pending Installation' && (
                  <button
                    onClick={() => handleStatusChange(task.id, 'In Progress')}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                  >
                    <Clock className="w-4 h-4" /> Start Installation (On Site Now)
                  </button>
                )}
                {task.status === 'In Progress' && (
                  <button
                    onClick={() => handleStatusChange(task.id, 'Installed')}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Installation Completed & Attach Photo
                  </button>
                )}
                {task.status === 'Installed' && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800 font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Completed on {task.installedDate || 'Today'}
                    </span>
                    <span className="text-[11px] font-normal text-emerald-700">Photo Proof Verified</span>
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
