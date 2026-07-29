import { useState, useEffect } from 'react';
import { 
  Wrench, Phone, MapPin, CheckCircle2, Clock, ArrowLeft, 
  Upload, FileText, Calendar, AlertCircle, Play, Check, Navigation,
  UserCheck, Shield, ChevronRight, Camera, RefreshCw, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DataStore } from '../lib/store';
import { BUSINESS_INFO } from '../lib/types';

export default function TechPortalPage() {
  const [tasks, setTasks] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedTech, setSelectedTech] = useState('');
  const [statusTab, setStatusTab] = useState('ALL'); // 'ALL', 'Pending Installation', 'In Progress', 'Installed'
  
  // Interactive state per task
  const [noteInputs, setNoteInputs] = useState({});
  const [photoInputs, setPhotoInputs] = useState({});
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [activeTabTask, setActiveTabTask] = useState({}); // 'details', 'notes', 'proof'

  useEffect(() => {
    // Load cache immediately for fast render
    setTasks(DataStore.getTasks());
    setStaff(DataStore.getStaff());

    // Sync live from Firestore
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

  const currentFitter = staff.find(s => s.name === selectedTech) || null;

  // Filter tasks by technician and status tab
  const techTasks = selectedTech
    ? tasks.filter(t => t.assignedTechnician && t.assignedTechnician.toLowerCase().includes(selectedTech.toLowerCase()))
    : tasks;

  const filteredTasks = statusTab === 'ALL'
    ? techTasks
    : techTasks.filter(t => t.status === statusTab);

  // Status counters
  const pendingCount = techTasks.filter(t => t.status === 'Pending Installation').length;
  const inProgressCount = techTasks.filter(t => t.status === 'In Progress').length;
  const installedCount = techTasks.filter(t => t.status === 'Installed').length;

  const handleStatusTransition = async (taskId, newStatus) => {
    setUpdatingTaskId(taskId);
    const note = noteInputs[taskId] || null;
    const photoUrl = photoInputs[taskId] || (newStatus === 'Installed' 
      ? 'https://images.unsplash.com/photo-1534349735944-2b3a6f7a268f?w=600&auto=format&fit=crop&q=60' 
      : null);

    try {
      const updated = await DataStore.updateTaskStatus(taskId, newStatus, photoUrl, note);
      setTasks(updated);
      // Clear inputs for this task
      setNoteInputs(prev => ({ ...prev, [taskId]: '' }));
    } catch (err) {
      console.error('Task update failed:', err);
      alert('Failed to sync task status to Firestore.');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const openGoogleMaps = (address) => {
    const encoded = encodeURIComponent(address + ', Bihar');
    window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      
      {/* APP BAR / HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-white leading-tight">Field Technician Portal</h1>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <span>{BUSINESS_INFO.name}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">Live Firestore Sync</span>
              </div>
            </div>
          </div>
          <Link to="/" className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-4 space-y-5">

        {/* TECHNICIAN ACCOUNT SELECTOR CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" /> Logged Fitter Profile
            </span>
            <span className="text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2.5 py-0.5 rounded-full font-semibold">
              Active Shift
            </span>
          </div>

          <div className="relative">
            <select
              value={selectedTech}
              onChange={e => setSelectedTech(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
            >
              {staff.length === 0 ? (
                <option value="">No Active Staff Found in Firestore</option>
              ) : (
                staff.map(member => (
                  <option key={member.id} value={member.name}>
                    {member.name} ({member.role} — {member.phone})
                  </option>
                ))
              )}
            </select>
            <div className="pointer-events-none absolute right-3.5 top-3 text-slate-400 text-xs">▼</div>
          </div>

          {currentFitter && (
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs border-t border-slate-800/80">
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                <span className="text-slate-500 block text-[10px]">Contact Phone</span>
                <span className="font-mono text-slate-200 font-bold">{currentFitter.phone}</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                <span className="text-slate-500 block text-[10px]">Designated Role</span>
                <span className="text-emerald-400 font-bold truncate block">{currentFitter.role}</span>
              </div>
            </div>
          )}
        </div>

        {/* WORKFLOW METRICS BAR */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setStatusTab('Pending Installation')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              statusTab === 'Pending Installation'
                ? 'bg-slate-900 border-slate-400 text-white shadow-lg'
                : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:bg-slate-900/80'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Assigned</div>
            <div className="text-2xl font-black text-white mt-0.5">{pendingCount}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Pending Action</div>
          </button>

          <button
            onClick={() => setStatusTab('In Progress')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              statusTab === 'In Progress'
                ? 'bg-amber-950/40 border-amber-500/80 text-amber-200 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:bg-slate-900/80'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">On-Site</div>
            <div className="text-2xl font-black text-amber-400 mt-0.5">{inProgressCount}</div>
            <div className="text-[10px] text-amber-500/80 mt-0.5">In Progress</div>
          </button>

          <button
            onClick={() => setStatusTab('Installed')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              statusTab === 'Installed'
                ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:bg-slate-900/80'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Verified</div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">{installedCount}</div>
            <div className="text-[10px] text-emerald-500/80 mt-0.5">Completed</div>
          </button>
        </div>

        {/* STATUS FILTER TABS */}
        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          {['ALL', 'Pending Installation', 'In Progress', 'Installed'].map(tab => (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className={`flex-1 py-2 text-center rounded-lg transition-all ${
                statusTab === tab
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'ALL' ? `All (${techTasks.length})` : tab === 'Pending Installation' ? 'Pending' : tab}
            </button>
          ))}
        </div>

        {/* TASK LIST */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-500 space-y-2">
              <Wrench className="w-8 h-8 text-slate-700 mx-auto" />
              <div className="text-sm font-bold text-slate-400">No tasks in this category</div>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                {selectedTech
                  ? `No ${statusTab !== 'ALL' ? statusTab.toLowerCase() : ''} jobs assigned to ${selectedTech}.`
                  : 'Select your technician account above to see your assigned field duty jobs.'}
              </p>
            </div>
          ) : (
            filteredTasks.map(task => {
              const isUpdating = updatingTaskId === task.id;
              const isInstalled = task.status === 'Installed';
              const isInProgress = task.status === 'In Progress';
              const isPending = task.status === 'Pending Installation';

              return (
                <div
                  key={task.id}
                  className={`bg-slate-900 border rounded-2xl overflow-hidden shadow-xl transition-all ${
                    isInProgress
                      ? 'border-amber-500/50 ring-1 ring-amber-500/20'
                      : isInstalled
                      ? 'border-emerald-500/30'
                      : 'border-slate-800'
                  }`}
                >
                  
                  {/* Task Card Header */}
                  <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex justify-between items-start gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">
                          {task.id}
                        </span>
                        {task.invoiceId && (
                          <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            {task.invoiceId}
                          </span>
                        )}
                        {task.priority === 'High' || task.priority === 'Urgent' ? (
                          <span className="bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            {task.priority}
                          </span>
                        ) : null}
                      </div>
                      <h3 className="font-black text-lg text-white mt-1.5 leading-tight">{task.customerName}</h3>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold border shrink-0 ${
                      isInstalled
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : isInProgress
                        ? 'bg-amber-950 text-amber-300 border-amber-800 animate-pulse'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {task.status}
                    </span>
                  </div>

                  {/* Task Card Body */}
                  <div className="p-4 space-y-4">
                    
                    {/* Work Scope Box */}
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                      <div className="text-[11px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Scope & Specifications
                      </div>
                      <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                        {task.workDescription}
                      </p>
                      {task.specs && (
                        <div className="text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/60">
                          <strong className="text-slate-300">Materials:</strong> {task.specs}
                        </div>
                      )}
                    </div>

                    {/* Site Location & Phone Quick Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      
                      {/* Call Client Action Button */}
                      <a
                        href={`tel:${task.customerPhone.replace(/\s/g,'')}`}
                        className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div className="truncate">
                            <div className="text-[10px] text-slate-400">Client Phone</div>
                            <div className="font-bold font-mono truncate">{task.customerPhone}</div>
                          </div>
                        </div>
                        <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-1 rounded-lg shrink-0">
                          CALL NOW
                        </span>
                      </a>

                      {/* Google Maps Directions Button */}
                      <button
                        onClick={() => openGoogleMaps(task.installationAddress)}
                        className="flex items-center justify-between p-3 rounded-xl bg-blue-950/40 hover:bg-blue-950/80 border border-blue-800/60 text-blue-300 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Navigation className="w-4 h-4 text-blue-400 shrink-0" />
                          <div className="truncate">
                            <div className="text-[10px] text-slate-400">Installation Address</div>
                            <div className="font-bold truncate">{task.installationAddress}</div>
                          </div>
                        </div>
                        <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-1 rounded-lg shrink-0">
                          MAPS ➔
                        </span>
                      </button>

                    </div>

                    {/* Instructions & Notes */}
                    {task.notes && (
                      <div className="bg-amber-950/20 border border-amber-900/40 p-3 rounded-xl text-xs space-y-1">
                        <div className="font-bold text-amber-400 flex items-center gap-1.5 text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5" /> Technician Instructions:
                        </div>
                        <p className="text-amber-200/90 whitespace-pre-line leading-relaxed">
                          {task.notes}
                        </p>
                      </div>
                    )}

                    {/* Completion Photo Proof if installed */}
                    {isInstalled && task.completionPhotoUrl && (
                      <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5" /> Verified Completion Photo Proof
                        </div>
                        <div className="aspect-video rounded-lg overflow-hidden border border-slate-800 bg-slate-900 max-h-48">
                          <img
                            src={task.completionPhotoUrl}
                            alt="Installation proof"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {task.installedDate && (
                          <div className="text-[10px] text-slate-500 font-mono text-right">
                            Installed: {task.installedDate}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Site Note Input before completion */}
                    {!isInstalled && (
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold text-slate-400">
                          Field Inspection Note for Firestore:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Frame anchored properly, silicone seal completed..."
                          value={noteInputs[task.id] || ''}
                          onChange={e => setNoteInputs({ ...noteInputs, [task.id]: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    )}

                    {/* WORKFLOW ACTION BUTTONS */}
                    <div className="pt-2 border-t border-slate-800">
                      
                      {isPending && (
                        <button
                          disabled={isUpdating}
                          onClick={() => handleStatusTransition(task.id, 'In Progress')}
                          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Play className="w-4 h-4 fill-slate-950" />
                          )}
                          START FITTING (MARK ON-SITE / IN PROGRESS)
                        </button>
                      )}

                      {isInProgress && (
                        <button
                          disabled={isUpdating}
                          onClick={() => handleStatusTransition(task.id, 'Installed')}
                          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5" />
                          )}
                          ✓ COMPLETE & VERIFY INSTALLATION IN FIRESTORE
                        </button>
                      )}

                      {isInstalled && (
                        <div className="bg-emerald-950/60 border border-emerald-800/80 p-3 rounded-xl text-center text-xs font-bold text-emerald-300 flex items-center justify-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400" />
                          Installation Completed & Real-Time Synced
                        </div>
                      )}

                    </div>

                  </div>

                </div>
              );
            })
          )}
        </div>

      </main>

    </div>
  );
}
