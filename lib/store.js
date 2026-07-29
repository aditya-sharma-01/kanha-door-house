import { INITIAL_INVOICES, INITIAL_TASKS, INITIAL_INVENTORY, INITIAL_STAFF } from './types';

// Helper to initialize local storage if needed
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
    return updated;
  }

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
    return updated;
  }

  static updateTaskStatus(taskId, status, photoUrl = null, notes = null) {
    const tasks = this.getTasks();
    const updated = tasks.map(t => {
      if (t.id === taskId) {
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
    return updated;
  }

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
    return updated;
  }

  static updateStock(itemId, quantityDelta) {
    const items = this.getInventory();
    const updated = items.map(item => {
      if (item.id === itemId) {
        const newStock = Math.max(0, item.stock + quantityDelta);
        return { ...item, stock: newStock };
      }
      return item;
    });
    saveData('inventory', updated);
    return updated;
  }

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
    return updated;
  }
}
