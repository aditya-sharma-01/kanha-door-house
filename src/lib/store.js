import { INITIAL_INVOICES, INITIAL_TASKS, INITIAL_INVENTORY, INITIAL_STAFF, INITIAL_PURCHASES, INITIAL_ACTIVITY_LOGS } from './types';

const getInitialData = (key, defaultValue) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(`kdh_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const saveData = (key, value) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`kdh_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }
};

export class DataStore {
  // --- INVOICES ---
  static getInvoices() {
    return getInitialData('invoices', INITIAL_INVOICES);
  }

  static saveInvoice(invoice) {
    const list = this.getInvoices();
    const existingIndex = list.findIndex(i => i.id === invoice.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = invoice;
    } else {
      updated = [invoice, ...list];
    }
    saveData('invoices', updated);
    this.logActivity('Admin/Staff', existingIndex >= 0 ? 'Updated Invoice' : 'Generated GST Invoice', `Invoice ID: ${invoice.id} for ${invoice.customerName} (Total ₹${invoice.total.toLocaleString('en-IN')})`);
    return updated;
  }

  // --- PURCHASES (INPUT TAX CREDIT - ITC) ---
  static getPurchases() {
    return getInitialData('purchases', INITIAL_PURCHASES);
  }

  static savePurchase(purchase) {
    const list = this.getPurchases();
    const existingIndex = list.findIndex(p => p.id === purchase.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = purchase;
    } else {
      updated = [purchase, ...list];
    }
    saveData('purchases', updated);
    this.logActivity('Super Admin', 'Recorded Purchase Bill (ITC)', `Bill No: ${purchase.billNumber} from ${purchase.supplierName} (Total ₹${purchase.totalAmount.toLocaleString('en-IN')})`);
    return updated;
  }

  // --- TASKS & WORK ALLOCATION ---
  static getTasks() {
    return getInitialData('tasks', INITIAL_TASKS);
  }

  static saveTask(task) {
    const list = this.getTasks();
    const existingIndex = list.findIndex(t => t.id === task.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = task;
    } else {
      updated = [task, ...list];
    }
    saveData('tasks', updated);
    this.logActivity('Admin/Staff', existingIndex >= 0 ? 'Updated Task' : 'Allocated Installation Task', `Task ID: ${task.id} assigned to ${task.assignedTechnician} for ${task.customerName}`);
    return updated;
  }

  static updateTaskStatus(taskId, status, photoUrl = null, notes = null) {
    const tasks = this.getTasks();
    let targetTech = 'Technician';
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        targetTech = t.assignedTechnician;
        return {
          ...t,
          status,
          ...(photoUrl ? { completionPhotoUrl: photoUrl } : {}),
          ...(notes ? { notes: `${t.notes || ''}\n[Tech Note]: ${notes}` } : {}),
          ...(status === 'Installed' ? { installedDate: new Date().toISOString().replace('T', ' ').substring(0, 16) } : {})
        };
      }
      return t;
    });
    saveData('tasks', updated);
    this.logActivity(targetTech, 'Changed Installation Status', `Task ${taskId} status changed to "${status}"`);
    return updated;
  }

  // --- INVENTORY ---
  static getInventory() {
    return getInitialData('inventory', INITIAL_INVENTORY);
  }

  static saveInventoryItem(item) {
    const list = this.getInventory();
    const existingIndex = list.findIndex(i => i.id === item.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = item;
    } else {
      updated = [item, ...list];
    }
    saveData('inventory', updated);
    this.logActivity('Admin/Staff', 'Updated Stock Inventory', `Item: ${item.name} (${item.stock} ${item.unit})`);
    return updated;
  }

  static updateStock(itemId, quantityDelta) {
    const items = this.getInventory();
    let itemName = '';
    const updated = items.map(item => {
      if (item.id === itemId) {
        itemName = item.name;
        const newStock = Math.max(0, item.stock + quantityDelta);
        return { ...item, stock: newStock };
      }
      return item;
    });
    saveData('inventory', updated);
    this.logActivity('Admin/Staff', 'Stock Adjustment', `Adjusted ${itemName} by ${quantityDelta > 0 ? '+' : ''}${quantityDelta}`);
    return updated;
  }

  // --- STAFF MANAGEMENT (SUPER ADMIN CONTROL) ---
  static getStaff() {
    return getInitialData('staff', INITIAL_STAFF);
  }

  static saveStaff(staffMember) {
    const list = this.getStaff();
    const existingIndex = list.findIndex(s => s.id === staffMember.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = staffMember;
    } else {
      updated = [staffMember, ...list];
    }
    saveData('staff', updated);
    this.logActivity('Super Admin (Sonu Sharma)', existingIndex >= 0 ? 'Updated Staff Credentials' : 'Added New Staff Credential', `Staff: ${staffMember.name} (${staffMember.phone}) - Role: ${staffMember.role}`);
    return updated;
  }

  static deleteStaff(staffId) {
    const list = this.getStaff();
    const targetStaff = list.find(s => s.id === staffId);
    const updated = list.filter(s => s.id !== staffId);
    saveData('staff', updated);
    if (targetStaff) {
      this.logActivity('Super Admin (Sonu Sharma)', 'Removed Staff Account', `Removed ${targetStaff.name} (${targetStaff.phone})`);
    }
    return updated;
  }

  // --- ACTIVITY AUDIT LOGS ---
  static getActivityLogs() {
    return getInitialData('activity_logs', INITIAL_ACTIVITY_LOGS);
  }

  static logActivity(staffName, action, details) {
    const logs = this.getActivityLogs();
    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      staffName,
      action,
      details
    };
    const updated = [newLog, ...logs].slice(0, 200); // Keep last 200 activity entries
    saveData('activity_logs', updated);
    return updated;
  }
}
