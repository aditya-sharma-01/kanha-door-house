import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Wrench, Layers, Users, Plus, Search, Printer, 
  CheckCircle2, Clock, AlertTriangle, IndianRupee, Phone, MapPin, ShieldCheck, Edit3, LogOut, User,
  Calculator, Activity, Trash2, Key, ArrowUpRight, TrendingUp, DollarSign, Download, Lock
} from 'lucide-react';
import { DataStore } from '../lib/store';
import { BUSINESS_INFO } from '../lib/types';
import { printGSTInvoice } from '../lib/pdfGenerator';
import GSTInvoiceModal from '../components/GSTInvoiceModal';
import TaskModal from '../components/TaskModal';
import InventoryModal from '../components/InventoryModal';
import StaffModal from '../components/StaffModal';
import PurchaseModal from '../components/PurchaseModal';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('invoices'); // 'invoices', 'gst-accounts', 'tasks', 'inventory', 'crm', 'staff', 'audit-logs'
  const [currentUser, setCurrentUser] = useState(null);
  
  // Data States
  const [invoices, setInvoices] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [staff, setStaff] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

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

  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [editingStaffMember, setEditingStaffMember] = useState(null);

  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);

  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    // Purge OLD cache keys from previous localStorage-only version
    ['invoices','purchases','tasks','inventory','staff','activity_logs'].forEach(k => {
      localStorage.removeItem(`kdh_${k}`);
    });

    let validUser = null;
    try {
      const stored = localStorage.getItem('kdh_auth_user');
      if (stored) validUser = JSON.parse(stored);
    } catch (e) {}

    if (!validUser || !validUser.phone) {
      navigate('/admin');
      return;
    }

    if (validUser.role === 'Field Technician') {
      navigate('/tech-portal');
      return;
    }

    setCurrentUser(validUser);
    setAuthChecking(false);
    refreshAllData();
  }, [navigate]);

  const refreshAllData = async () => {
    // Fetch everything fresh from Firestore (no stale cache pre-load)
    const [inv, purch, tsk, inven, stf, logs] = await Promise.all([
      DataStore.fetchInvoices(),
      DataStore.fetchPurchases(),
      DataStore.fetchTasks(),
      DataStore.fetchInventory(),
      DataStore.fetchStaff(),
      DataStore.fetchActivityLogs(),
    ]);
    setInvoices(inv);
    setPurchases(purch);
    setTasks(tsk);
    setInventory(inven);
    setStaff(stf);
    setActivityLogs(logs);
  };

  const handleLogout = () => {
    DataStore.clearAllCaches();
    localStorage.removeItem('kdh_auth_user');
    navigate('/admin');
  };

  // Handlers
  const handleSaveInvoice = async (invoiceData) => {
    const updated = await DataStore.saveInvoice(invoiceData);
    setInvoices(updated);
    setInvoiceModalOpen(false);
    setEditingInvoice(null);
    setActivityLogs(DataStore.getActivityLogs());
  };

  const handleSavePurchase = async (purchaseData) => {
    const updated = await DataStore.savePurchase(purchaseData);
    setPurchases(updated);
    setPurchaseModalOpen(false);
    setEditingPurchase(null);
    setActivityLogs(DataStore.getActivityLogs());
  };

  const handleSaveTask = async (taskData) => {
    const updated = await DataStore.saveTask(taskData);
    setTasks(updated);
    setTaskModalOpen(false);
    setEditingTask(null);
    setActivityLogs(DataStore.getActivityLogs());
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    const updated = await DataStore.updateTaskStatus(taskId, newStatus);
    setTasks(updated);
    setActivityLogs(DataStore.getActivityLogs());
  };

  const handleSaveInventory = async (itemData) => {
    const updated = await DataStore.saveInventoryItem(itemData);
    setInventory(updated);
    setInventoryModalOpen(false);
    setEditingInventoryItem(null);
    setActivityLogs(DataStore.getActivityLogs());
  };

  const handleQuickStockAdjust = async (itemId, delta) => {
    const updated = await DataStore.updateStock(itemId, delta);
    setInventory(updated);
    setActivityLogs(DataStore.getActivityLogs());
  };

  const handleSaveStaff = async (staffData) => {
    const updated = await DataStore.saveStaff(staffData);
    setStaff(updated);
    setStaffModalOpen(false);
    setEditingStaffMember(null);
    setActivityLogs(DataStore.getActivityLogs());
  };

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Are you sure you want to remove this staff account credential?')) {
      const updated = await DataStore.deleteStaff(staffId);
      setStaff(updated);
      setActivityLogs(DataStore.getActivityLogs());
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task permanently from Firestore?')) {
      const updated = await DataStore.deleteTask(taskId);
      setTasks(updated);
      setActivityLogs(DataStore.getActivityLogs());
    }
  };

  const handleDeleteInventoryItem = async (itemId) => {
    if (window.confirm('Delete this inventory item permanently from Firestore?')) {
      const updated = await DataStore.deleteInventoryItem(itemId);
      setInventory(updated);
      setActivityLogs(DataStore.getActivityLogs());
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (window.confirm('Delete this invoice permanently from Firestore?')) {
      const updated = await DataStore.deleteInvoice(invoiceId);
      setInvoices(updated);
      setActivityLogs(DataStore.getActivityLogs());
    }
  };

  const handleDeletePurchase = async (purchaseId) => {
    if (window.confirm('Delete this purchase bill from Firestore?')) {
      const updated = await DataStore.deletePurchase(purchaseId);
      setPurchases(updated);
      setActivityLogs(DataStore.getActivityLogs());
    }
  };

  // Financial Metrics & ICAI Calculations
  const totalRevenue = invoices.reduce((sum, i) => sum + (i.total || 0), 0);
  const totalTaxableSales = invoices.reduce((sum, i) => sum + (i.subtotal || 0), 0);
  const totalReceived = invoices.reduce((sum, i) => sum + (i.advancePaid || 0), 0);
  const totalBalanceDue = invoices.reduce((sum, i) => sum + (i.balanceDue !== undefined ? i.balanceDue : (i.total - i.advancePaid)), 0);
  
  // Output GST Liability (CGST + SGST)
  const totalOutputCGST = invoices.reduce((sum, i) => sum + (i.cgstAmount || 0), 0);
  const totalOutputSGST = invoices.reduce((sum, i) => sum + (i.sgstAmount || 0), 0);
  const totalOutputGST = totalOutputCGST + totalOutputSGST;

  // Input Tax Credit (ITC) from Supplier Purchase Bills
  const totalPurchasesTaxable = purchases.reduce((sum, p) => sum + (p.taxableValue || 0), 0);
  const totalInputCGST = purchases.reduce((sum, p) => sum + (p.inputCGST || 0), 0);
  const totalInputSGST = purchases.reduce((sum, p) => sum + (p.inputSGST || 0), 0);
  const totalITC = totalInputCGST + totalInputSGST;

  // Net GST Payable = Output GST - Input Tax Credit (ITC)
  const netGSTPayable = Math.max(0, totalOutputGST - totalITC);

  // Profit & Loss Math
  const grossProfit = totalTaxableSales - totalPurchasesTaxable;
  const totalInventoryValuation = inventory.reduce((sum, i) => sum + ((i.stock || 0) * (i.costPrice || 0)), 0);

  // Search Filters
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

  const filteredLogs = activityLogs.filter(log => {
    return log.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
           log.details.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (authChecking || !currentUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-xs font-bold text-slate-500">Verifying Admin Session...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-8 py-5 sm:py-8 space-y-5 sm:space-y-8">
      
      {/* Top Header Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-8 border border-slate-800 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500 shrink-0">
              <img src="/logo.jpeg" alt="Kanha Door House" className="w-full h-full object-cover object-center" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-extrabold leading-tight truncate">Kanha Door House ERP</h1>
              <div className="text-[11px] text-emerald-400 font-mono truncate">GSTIN: {BUSINESS_INFO.gstin}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-1 px-3 py-2 bg-red-950/80 hover:bg-red-900 text-red-300 font-bold text-xs rounded-xl border border-red-800 transition-all shrink-0"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {currentUser && (
          <div className="text-xs bg-emerald-950 border border-emerald-800 text-emerald-300 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 w-fit">
            <User className="w-3 h-3" /> {currentUser.name} • {currentUser.role}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            onClick={() => { setEditingInvoice(null); setInvoiceModalOpen(true); }}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" /> New Invoice
          </button>
          <button
            onClick={() => { setEditingTask(null); setTaskModalOpen(true); }}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all"
          >
            <Wrench className="w-4 h-4 text-emerald-400" /> Allocate Task
          </button>
          <button
            onClick={() => { setEditingInventoryItem(null); setInventoryModalOpen(true); }}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all col-span-2 sm:col-span-1"
          >
            <Layers className="w-4 h-4 text-amber-400" /> Add Stock
          </button>
        </div>
      </div>


      {/* STATS ANALYTICS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Billed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
            <span>Sales Revenue Turnover</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between pt-1 border-t border-slate-100">
            <span>Collected: <strong className="text-emerald-600">₹{totalReceived.toLocaleString('en-IN')}</strong></span>
            <span>Due: <strong className="text-red-600">₹{totalBalanceDue.toLocaleString('en-IN')}</strong></span>
          </div>
        </div>

        {/* ICAI GST Liability & ITC Net Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
            <span>Net GST Liability (After ITC)</span>
            <Calculator className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            ₹{netGSTPayable.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between pt-1 border-t border-slate-100">
            <span>Output: ₹{totalOutputGST.toLocaleString('en-IN')}</span>
            <span>ITC Credit: <strong className="text-emerald-600">-₹{totalITC.toLocaleString('en-IN')}</strong></span>
          </div>
        </div>

        {/* Gross Profit Margin */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
            <span>Gross Profit Margin</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600">
            ₹{grossProfit.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            Stock Valuation: <strong>₹{totalInventoryValuation.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {/* Staff & Active Audit Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
            <span>Staff & Audit Logs</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            {staff.length} <span className="text-xs font-semibold text-slate-400">Staff Credentials</span>
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            Recorded Logs: <strong>{activityLogs.length} Entries</strong>
          </div>
        </div>

      </div>


      {/* MAIN NAVIGATION TABS - horizontal scroll on mobile */}
      <div className="flex overflow-x-auto pb-1 gap-1.5 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap sm:border-b sm:border-slate-200">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-1.5 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-[11px] sm:text-xs transition-all whitespace-nowrap shrink-0 ${activeTab === 'invoices' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> Invoices ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('gst-accounts')}
          className={`flex items-center gap-1.5 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-[11px] sm:text-xs transition-all whitespace-nowrap shrink-0 ${activeTab === 'gst-accounts' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> GST Accounts
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-1.5 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-[11px] sm:text-xs transition-all whitespace-nowrap shrink-0 ${activeTab === 'tasks' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> Tasks ({tasks.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-1.5 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-[11px] sm:text-xs transition-all whitespace-nowrap shrink-0 ${activeTab === 'inventory' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> Stock ({inventory.length})
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-1.5 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-[11px] sm:text-xs transition-all whitespace-nowrap shrink-0 ${activeTab === 'staff' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> Staff ({staff.length})
        </button>
        <button
          onClick={() => setActiveTab('audit-logs')}
          className={`flex items-center gap-1.5 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-[11px] sm:text-xs transition-all whitespace-nowrap shrink-0 ${activeTab === 'audit-logs' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> Audit Log
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
            placeholder="Search customer, staff name, invoice or task ID..."
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


      {/* TAB CONTENT 2: GST ACCOUNTS & ICAI FINANCIAL LEDGER */}
      {activeTab === 'gst-accounts' && (
        <div className="space-y-6">
          
          {/* Top Summary Banner */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Total Taxable Sales</div>
              <div className="text-2xl font-extrabold text-white mt-1">₹{totalTaxableSales.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-emerald-400 mt-0.5">GSTR-1 Outward Supplies</div>
            </div>

            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Total Output GST (Liability)</div>
              <div className="text-2xl font-extrabold text-amber-400 mt-1">₹{totalOutputGST.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">CGST: ₹{totalOutputCGST.toLocaleString('en-IN')} | SGST: ₹{totalOutputSGST.toLocaleString('en-IN')}</div>
            </div>

            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Input Tax Credit (ITC)</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">₹{totalITC.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-emerald-400 mt-0.5">From Raw Extrusion Purchases</div>
            </div>

            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Net Cash GST Payable</div>
              <div className="text-2xl font-extrabold text-emerald-300 mt-1">₹{netGSTPayable.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-slate-300 mt-0.5">GSTR-3B Cash Liability</div>
            </div>
          </div>

          {/* Supplier Purchase Bills (ITC Claims) Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Input Tax Credit (ITC) Purchase Bills</h3>
                <p className="text-xs text-slate-500">Recorded supplier bills for raw profile, glass & hardware purchases complying with ICAI rules.</p>
              </div>
              <button
                onClick={() => { setEditingPurchase(null); setPurchaseModalOpen(true); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-all"
              >
                <Plus className="w-4 h-4" /> Add Purchase Bill (ITC)
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-800 uppercase font-bold tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Purchase ID</th>
                    <th className="py-3 px-4">Supplier Name & GSTIN</th>
                    <th className="py-3 px-4">Bill No & Date</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-right">Taxable Value</th>
                    <th className="py-3 px-4 text-right">Input CGST</th>
                    <th className="py-3 px-4 text-right">Input SGST</th>
                    <th className="py-3 px-4 text-right">Total Bill (₹)</th>
                    <th className="py-3 px-4 text-center">Del</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {purchases.map((pur) => (
                    <tr key={pur.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{pur.id}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{pur.supplierName}</div>
                        <div className="text-[10px] font-mono text-emerald-700">{pur.supplierGSTIN}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-800">{pur.billNumber}</div>
                        <div className="text-[10px] text-slate-500">{pur.date}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{pur.description}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">₹{(pur.taxableValue||0).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-right text-emerald-700 font-bold">₹{(pur.inputCGST||0).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-right text-emerald-700 font-bold">₹{(pur.inputSGST||0).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-right font-extrabold text-slate-900">₹{(pur.totalAmount||0).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDeletePurchase(pur.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg"
                          title="Delete from Firestore"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ICAI Profit & Loss & Balance Sheet Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Profit & Loss Account */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-extrabold text-slate-900 text-base">Profit & Loss Statement (Operating)</h3>
                <p className="text-xs text-slate-500">ICAI double-entry operating profit summary.</p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Gross Sales Turnover (Taxable):</span>
                  <span className="font-bold text-slate-900">₹{totalTaxableSales.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 text-red-600">
                  <span>Less: Raw Material Purchase Cost:</span>
                  <span className="font-bold">- ₹{totalPurchasesTaxable.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2 border-b-2 border-slate-900 text-sm font-extrabold text-emerald-700">
                  <span>Gross Operating Profit:</span>
                  <span>₹{grossProfit.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  * Profit excludes labor fitting charges and hardware overheads.
                </div>
              </div>
            </div>

            {/* Balance Sheet Highlights */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-extrabold text-slate-900 text-base">Balance Sheet Assets & Liabilities</h3>
                <p className="text-xs text-slate-500">Current business valuation metrics.</p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Current Inventory Stock Valuation:</span>
                  <span className="font-bold text-emerald-700">₹{totalInventoryValuation.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Accounts Receivable (Customer Pending Balances):</span>
                  <span className="font-bold text-red-600">₹{totalBalanceDue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Advance Cash Received:</span>
                  <span className="font-bold text-slate-900">₹{totalReceived.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2 border-b-2 border-slate-900 text-sm font-extrabold text-slate-900">
                  <span>Net Working Capital & Assets:</span>
                  <span className="text-emerald-700">₹{(totalInventoryValuation + totalReceived).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}


      {/* TAB CONTENT 3: INSTALLATION TASKS & WORK ALLOCATION */}
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
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => { setEditingTask(task); setTaskModalOpen(true); }}
                              className="text-slate-400 hover:text-slate-700 p-1"
                              title="Edit task"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-red-400 hover:text-red-600 p-1"
                              title="Delete task from Firestore"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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


      {/* TAB CONTENT 4: DUAL INVENTORY & RAW MATERIAL STOCK */}
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
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => { setEditingInventoryItem(item); setInventoryModalOpen(true); }}
                            className="p-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg"
                            title="Edit item"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteInventoryItem(item.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg"
                            title="Delete from Firestore"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* TAB CONTENT 5: STAFF CREDENTIALS & PRODUCTIVITY TRACKING */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Super Admin Staff Credential Control</h3>
              <p className="text-xs text-slate-500 mt-0.5">Sonu Sharma can add, update passwords, change roles, or remove staff members.</p>
            </div>
            <button
              onClick={() => { setEditingStaffMember(null); setStaffModalOpen(true); }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-all"
            >
              <Plus className="w-4 h-4 text-emerald-400" /> Add Staff Credential
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {staff.map((member) => {
              const staffTasks = tasks.filter(t => t.assignedTechnician.toLowerCase() === member.name.toLowerCase());
              const completedTasks = staffTasks.filter(t => t.status === 'Installed').length;

              return (
                <div key={member.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-lg">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setEditingStaffMember(member); setStaffModalOpen(true); }}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                        title="Edit Credentials"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {member.role !== 'Super Admin' && (
                        <button
                          onClick={() => handleDeleteStaff(member.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                          title="Remove Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{member.name}</h3>
                    <div className="text-xs text-emerald-700 font-bold">{member.role}</div>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Mobile:</span>
                      <strong className="text-slate-900">{member.phone}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Password:</span>
                      <strong className="text-emerald-700">{member.password}</strong>
                    </div>
                  </div>

                  {/* Productivity Work Tracker */}
                  <div className="border-t border-slate-100 pt-3 text-xs space-y-1 text-slate-600">
                    <div className="font-bold text-slate-800 font-sans">Work & Activity Metrics:</div>
                    <div className="flex justify-between">
                      <span>Assigned Jobs:</span>
                      <strong className="text-slate-900">{staffTasks.length} Installations</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed Jobs:</span>
                      <strong className="text-emerald-600">{completedTasks} Verified</strong>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* TAB CONTENT 6: STAFF WORK AUDIT LOGS */}
      {activeTab === 'audit-logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Real-time Staff Work & Activity Audit Log</h3>
            <p className="text-xs text-slate-500">Complete timestamped trail of actions taken by every single staff member.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-900 text-white uppercase font-bold tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Action Performed</th>
                  <th className="py-3 px-4">Action Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-slate-400">{log.id}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{log.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">{log.staffName}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{log.action}</td>
                    <td className="py-3 px-4 text-slate-600">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
          staff={staff}
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

      {staffModalOpen && (
        <StaffModal
          staffMember={editingStaffMember}
          onClose={() => { setStaffModalOpen(false); setEditingStaffMember(null); }}
          onSave={handleSaveStaff}
        />
      )}

      {purchaseModalOpen && (
        <PurchaseModal
          purchase={editingPurchase}
          onClose={() => { setPurchaseModalOpen(false); setEditingPurchase(null); }}
          onSave={handleSavePurchase}
        />
      )}

    </div>
  );
}
