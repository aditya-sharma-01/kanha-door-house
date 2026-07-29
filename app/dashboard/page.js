'use client';
import { useState, useEffect } from 'react';
import { 
  FileText, Wrench, Layers, Users, Plus, Search, Filter, Printer, Share2, 
  CheckCircle2, Clock, AlertTriangle, IndianRupee, Phone, MapPin, ArrowUpRight, ShieldCheck, Download, Edit3, Trash2
} from 'lucide-react';
import { DataStore } from '@/lib/store';
import { BUSINESS_INFO } from '@/lib/types';
import { printGSTInvoice } from '@/lib/pdfGenerator';
import GSTInvoiceModal from '@/components/GSTInvoiceModal';
import TaskModal from '@/components/TaskModal';
import InventoryModal from '@/components/InventoryModal';

export default function ManagerialDashboard() {
  const [activeTab, setActiveTab] = useState('invoices'); // 'invoices', 'tasks', 'inventory', 'crm', 'staff'
  
  // Data state
  const [invoices, setInvoices] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [staff, setStaff] = useState([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [editingInventoryItem, setEditingInventoryItem] = useState(null);

  // Load initial data
  useEffect(() => {
    setInvoices(DataStore.getInvoices());
    setTasks(DataStore.getTasks());
    setInventory(DataStore.getInventory());
    setStaff(DataStore.getStaff());
  }, []);

  // Handlers for Invoices
  const handleSaveInvoice = (invoiceData) => {
    const updated = DataStore.saveInvoice(invoiceData);
    setInvoices(updated);
    setInvoiceModalOpen(false);
    setEditingInvoice(null);
  };

  // Handlers for Tasks
  const handleSaveTask = (taskData) => {
    const updated = DataStore.saveTask(taskData);
    setTasks(updated);
    setTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleUpdateTaskStatus = (taskId, newStatus) => {
    const updated = DataStore.updateTaskStatus(taskId, newStatus);
    setTasks(updated);
  };

  // Handlers for Inventory
  const handleSaveInventory = (itemData) => {
    const updated = DataStore.saveInventoryItem(itemData);
    setInventory(updated);
    setInventoryModalOpen(false);
    setEditingInventoryItem(null);
  };

  const handleQuickStockAdjust = (itemId, delta) => {
    const updated = DataStore.updateStock(itemId, delta);
    setInventory(updated);
  };

  // Analytics Metrics
  const totalRevenue = invoices.reduce((sum, i) => sum + (i.total || 0), 0);
  const totalReceived = invoices.reduce((sum, i) => sum + (i.advancePaid || 0), 0);
  const totalBalanceDue = invoices.reduce((sum, i) => sum + (i.balanceDue !== undefined ? i.balanceDue : (i.total - i.advancePaid)), 0);
  const totalCGST = invoices.reduce((sum, i) => sum + (i.cgstAmount || 0), 0);
  const totalSGST = invoices.reduce((sum, i) => sum + (i.sgstAmount || 0), 0);
  const pendingTasksCount = tasks.filter(t => t.status !== 'Installed').length;
  const lowStockItems = inventory.filter(i => i.stock <= i.minAlert);

  // Search Filtered Lists
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.customerPhone.includes(searchQuery);
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTasks = tasks.filter(task => {
    return task.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           task.assignedTechnician.toLowerCase().includes(searchQuery.toLowerCase()) ||
           task.id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredInventory = inventory.filter(item => {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      
      {/* Top Header Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Real-time Managerial Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Kanha Door House ERP</h1>
          <p className="text-xs text-slate-400 mt-1">
            GSTIN: <span className="font-mono text-emerald-400 font-bold">{BUSINESS_INFO.gstin}</span> • Owner: {BUSINESS_INFO.owner} • Jamalpur, Bihar
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => { setEditingInvoice(null); setInvoiceModalOpen(true); }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Plus className="w-4 h-4" /> New GST Invoice
          </button>
          <button
            onClick={() => { setEditingTask(null); setTaskModalOpen(true); }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all"
          >
            <Wrench className="w-4 h-4 text-emerald-400" /> Allocate Task
          </button>
          <button
            onClick={() => { setEditingInventoryItem(null); setInventoryModalOpen(true); }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all"
          >
            <Layers className="w-4 h-4 text-amber-400" /> Add Stock Item
          </button>
        </div>
      </div>


      {/* STATS ANALYTICS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Billed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
            <span>Total Sales Billed</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between pt-1 border-t border-slate-100">
            <span>Received: <strong className="text-emerald-600">₹{totalReceived.toLocaleString('en-IN')}</strong></span>
            <span>Due: <strong className="text-red-600">₹{totalBalanceDue.toLocaleString('en-IN')}</strong></span>
          </div>
        </div>

        {/* GST Tax Metrics */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
            <span>GST Tax (CGST + SGST)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            ₹{(totalCGST + totalSGST).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between pt-1 border-t border-slate-100">
            <span>CGST (9%): ₹{totalCGST.toLocaleString('en-IN')}</span>
            <span>SGST (9%): ₹{totalSGST.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Pending Installations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
            <span>Pending Field Installations</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 flex items-center gap-2">
            {pendingTasksCount} <span className="text-xs font-semibold text-slate-400">Jobs Active</span>
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            Technicians: <strong>Amit Kumar & Pankaj Sharma</strong>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
            <span>Raw Profile Stock Warnings</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-extrabold text-red-600 flex items-center gap-2">
            {lowStockItems.length} <span className="text-xs font-semibold text-slate-400">Items Low</span>
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            {lowStockItems.length > 0 ? (
              <span className="text-red-600 font-bold">{lowStockItems[0].name.substring(0, 24)}...</span>
            ) : (
              <span className="text-emerald-600 font-medium">All stocks healthy</span>
            )}
          </div>
        </div>

      </div>


      {/* MAIN NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 overflow-x-auto pb-1 gap-2">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${activeTab === 'invoices' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          <FileText className="w-4 h-4 text-emerald-400" /> Invoices & GST Billing ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${activeTab === 'tasks' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          <Wrench className="w-4 h-4 text-emerald-400" /> Installation Tasks ({tasks.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${activeTab === 'inventory' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          <Layers className="w-4 h-4 text-amber-400" /> Stock & Inventory ({inventory.length})
        </button>
        <button
          onClick={() => setActiveTab('crm')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${activeTab === 'crm' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          <Users className="w-4 h-4 text-emerald-400" /> Customer Records
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${activeTab === 'staff' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          <Users className="w-4 h-4 text-slate-400" /> Staff & Technicians
        </button>
      </div>


      {/* SEARCH BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by customer, phone, item name, or ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {activeTab === 'invoices' && (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 w-full sm:w-auto overflow-x-auto">
            <span>Filter Payment Status:</span>
            {['ALL', 'Paid', 'Partial Paid', 'Unpaid'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg border transition-all ${statusFilter === st ? 'bg-emerald-600 text-white border-emerald-600 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
              >
                {st}
              </button>
            ))}
          </div>
        )}
      </div>


      {/* TAB CONTENT 1: INVOICES & BILLING */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-900 text-white uppercase font-bold tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Invoice ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Line Items</th>
                  <th className="py-3.5 px-4 text-right">Tax (CGST+SGST)</th>
                  <th className="py-3.5 px-4 text-right">Grand Total</th>
                  <th className="py-3.5 px-4 text-right">Balance Payable</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-8 text-center text-slate-400">
                      No invoices matching current search or filter.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{inv.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{inv.customerName}</div>
                        <div className="text-[11px] text-slate-500">{inv.customerPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{inv.date}</td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-600" title={inv.items.map(i => i.description).join(', ')}>
                        {inv.items.map(i => `${i.qty}x ${i.description}`).join('; ')}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-600">
                        ₹{((inv.cgstAmount || 0) + (inv.sgstAmount || 0)).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                        ₹{inv.total.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-red-600">
                        ₹{(inv.balanceDue !== undefined ? inv.balanceDue : (inv.total - inv.advancePaid)).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : inv.status === 'Partial Paid' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => printGSTInvoice(inv)}
                            title="Print GST Invoice PDF"
                            className="p-1.5 text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setEditingInvoice(inv); setInvoiceModalOpen(true); }}
                            title="Edit Invoice"
                            className="p-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* TAB CONTENT 2: INSTALLATION TASKS & WORK ALLOCATION */}
      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {['Pending Installation', 'In Progress', 'Installed'].map((columnStatus) => {
            const columnTasks = filteredTasks.filter(t => t.status === columnStatus);
            return (
              <div key={columnStatus} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${columnStatus === 'Installed' ? 'bg-emerald-500' : columnStatus === 'In Progress' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                    {columnStatus}
                  </h3>
                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs font-bold">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {columnTasks.length === 0 ? (
                    <div className="bg-white p-6 rounded-xl border border-dashed border-slate-300 text-center text-slate-400 text-xs">
                      No tasks in this column.
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <div key={task.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-mono font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {task.id}
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm mt-1">{task.customerName}</h4>
                          </div>
                          <button
                            onClick={() => { setEditingTask(task); setTaskModalOpen(true); }}
                            className="text-slate-400 hover:text-slate-700 p-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          {task.workDescription}
                        </p>

                        <div className="text-[11px] text-slate-500 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{task.installationAddress}</span>
                          </div>
                          <div className="flex justify-between items-center pt-1">
                            <span>Lead Tech: <strong>{task.assignedTechnician}</strong></span>
                            <a href={`tel:${task.technicianPhone}`} className="text-emerald-700 font-bold hover:underline flex items-center gap-1">
                              <Phone className="w-3 h-3" /> Call
                            </a>
                          </div>
                          <div className="text-slate-400">Deadline: {task.deadline}</div>
                        </div>

                        {/* Status Transition Button */}
                        <div className="pt-1 flex justify-between items-center">
                          {columnStatus === 'Pending Installation' && (
                            <button
                              onClick={() => handleUpdateTaskStatus(task.id, 'In Progress')}
                              className="w-full py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-lg border border-amber-300 transition-colors"
                            >
                              Start Fitting (In Progress) →
                            </button>
                          )}
                          {columnStatus === 'In Progress' && (
                            <button
                              onClick={() => handleUpdateTaskStatus(task.id, 'Installed')}
                              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow transition-colors"
                            >
                              ✓ Mark Completed & Installed
                            </button>
                          )}
                          {columnStatus === 'Installed' && (
                            <div className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Installed on {task.installedDate || task.deadline}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}


      {/* TAB CONTENT 3: DUAL INVENTORY & RAW MATERIAL STOCK */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-900 text-white uppercase font-bold tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Item ID</th>
                  <th className="py-3.5 px-4">Material / Product Description</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 text-center">Unit</th>
                  <th className="py-3.5 px-4 text-right">Current Stock</th>
                  <th className="py-3.5 px-4 text-right">Min Alert Level</th>
                  <th className="py-3.5 px-4 text-center">Stock Level Status</th>
                  <th className="py-3.5 px-4 text-center">Quick Adjust</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredInventory.map((item) => {
                  const isLow = item.stock <= item.minAlert;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{item.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{item.name}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-600">{item.unit}</td>
                      <td className={`py-3.5 px-4 text-right font-extrabold text-sm ${isLow ? 'text-red-600' : 'text-emerald-700'}`}>
                        {item.stock} {item.unit}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-500 font-semibold">{item.minAlert} {item.unit}</td>
                      <td className="py-3.5 px-4 text-center">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-2.5 py-1 rounded-full text-[11px] font-bold">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3" /> Healthy
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleQuickStockAdjust(item.id, -1)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-bold"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => handleQuickStockAdjust(item.id, 5)}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded text-xs font-bold border border-emerald-200"
                          >
                            +5
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => { setEditingInventoryItem(item); setInventoryModalOpen(true); }}
                          className="p-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* TAB CONTENT 4: CRM CUSTOMER DIRECTORY */}
      {activeTab === 'crm' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invoices.map((inv) => (
            <div key={inv.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{inv.customerName}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" /> {inv.customerPhone}
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                  {inv.id}
                </span>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl space-y-1.5 border border-slate-100">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{inv.customerAddress}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-semibold">
                  <span>Total Billed: <strong className="text-slate-900">₹{inv.total.toLocaleString('en-IN')}</strong></span>
                  <span>Advance: <strong className="text-emerald-600">₹{inv.advancePaid.toLocaleString('en-IN')}</strong></span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {inv.status}
                </span>
                <button
                  onClick={() => printGSTInvoice(inv)}
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Tax Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* TAB CONTENT 5: STAFF & ADMIN DIRECTORY */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {staff.map((member) => (
            <div key={member.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-lg">
                {member.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{member.name}</h3>
                <div className="text-xs text-emerald-700 font-bold">{member.role}</div>
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-1.5 pt-2 border-t border-slate-100">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> {member.phone}
              </div>
              <div className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                ● {member.status}
              </div>
            </div>
          ))}
        </div>
      )}


      {/* MODALS */}
      {invoiceModalOpen && (
        <GSTInvoiceModal
          invoice={editingInvoice}
          onClose={() => { setInvoiceModalOpen(false); setEditingInvoice(null); }}
          onSave={handleSaveInvoice}
        />
      )}

      {taskModalOpen && (
        <TaskModal
          task={editingTask}
          invoices={invoices}
          onClose={() => { setTaskModalOpen(false); setEditingTask(null); }}
          onSave={handleSaveTask}
        />
      )}

      {inventoryModalOpen && (
        <InventoryModal
          item={editingInventoryItem}
          onClose={() => { setInventoryModalOpen(false); setEditingInventoryItem(null); }}
          onSave={handleSaveInventory}
        />
      )}

    </div>
  );
}
