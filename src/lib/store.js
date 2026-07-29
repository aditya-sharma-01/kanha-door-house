// store.js - Firestore is the ONLY source of truth.
// localStorage is ONLY a render-speed cache.
// An empty Firestore = empty UI. No hardcoded seed data.

import {
  collection, doc, getDocs, setDoc, deleteDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { BOOTSTRAP_SUPER_ADMIN } from './types';

// Cache helpers
const cacheKey = (col) => 'kdh_v2_' + col;

const readCache = (col) => {
  try {
    const raw = localStorage.getItem(cacheKey(col));
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
};

const writeCache = (col, data) => {
  try { localStorage.setItem(cacheKey(col), JSON.stringify(data)); }
  catch (e) { console.warn('Cache write failed:', e); }
};

const clearCache = (col) => {
  try { localStorage.removeItem(cacheKey(col)); }
  catch (e) {}
};

// Collection names
const COL = {
  invoices:      'invoices',
  purchases:     'purchases',
  tasks:         'tasks',
  inventory:     'inventory',
  staff:         'staff',
  activity_logs: 'activity_logs',
};

// Fetch all docs from a Firestore collection
async function firestoreFetchAll(colName) {
  const snap = await getDocs(collection(db, colName));
  return snap.docs.map(function(d) {
    var data = Object.assign({}, d.data());
    delete data._updatedAt;
    delete data._seeded;
    data.id = d.id;
    return data;
  });
}

// Upsert a document (doc ID = item.id)
async function firestoreUpsert(colName, item) {
  var clean = Object.assign({}, item);
  delete clean._updatedAt;
  Object.keys(clean).forEach(function(key) {
    if (clean[key] === undefined) {
      clean[key] = null;
    }
  });
  var ref = doc(db, colName, String(clean.id));
  await setDoc(ref, Object.assign({}, clean, { _updatedAt: serverTimestamp() }), { merge: true });
}

// Hard-delete a document
async function firestoreDelete(colName, id) {
  await deleteDoc(doc(db, colName, String(id)));
}

// Bootstrap Super Admin only if staff collection is completely empty
var _bootstrapped = false;
async function bootstrapSuperAdmin() {
  if (_bootstrapped) return;
  _bootstrapped = true;
  try {
    var snap = await getDocs(collection(db, COL.staff));
    if (snap.empty) {
      await firestoreUpsert(COL.staff, BOOTSTRAP_SUPER_ADMIN);
      console.log('[KDH] Bootstrapped Super Admin account in Firestore.');
    }
  } catch (e) {
    console.error('[KDH] Bootstrap failed:', e);
  }
}

bootstrapSuperAdmin();

export class DataStore {

  // INVOICES
  static getInvoices() { return readCache(COL.invoices); }

  static async fetchInvoices() {
    var data = await firestoreFetchAll(COL.invoices);
    data.sort(function(a, b) { return (b.date || '').localeCompare(a.date || ''); });
    writeCache(COL.invoices, data);
    return data;
  }

  static async saveInvoice(invoice) {
    await firestoreUpsert(COL.invoices, invoice);
    var list = readCache(COL.invoices);
    var idx = list.findIndex(function(i) { return i.id === invoice.id; });
    var updated = idx >= 0
      ? list.map(function(i) { return i.id === invoice.id ? invoice : i; })
      : [invoice].concat(list);
    writeCache(COL.invoices, updated);
    DataStore.logActivity('Staff', idx >= 0 ? 'Updated Invoice' : 'Created Invoice',
      invoice.id + ' -- ' + invoice.customerName + ' (Rs.' + (invoice.total || 0).toLocaleString('en-IN') + ')');
    return updated;
  }

  static async deleteInvoice(id) {
    await firestoreDelete(COL.invoices, id);
    var updated = readCache(COL.invoices).filter(function(i) { return i.id !== id; });
    writeCache(COL.invoices, updated);
    DataStore.logActivity('Staff', 'Deleted Invoice', 'Invoice ' + id + ' removed');
    return updated;
  }

  // PURCHASES (ITC)
  static getPurchases() { return readCache(COL.purchases); }

  static async fetchPurchases() {
    var data = await firestoreFetchAll(COL.purchases);
    data.sort(function(a, b) { return (b.date || '').localeCompare(a.date || ''); });
    writeCache(COL.purchases, data);
    return data;
  }

  static async savePurchase(purchase) {
    await firestoreUpsert(COL.purchases, purchase);
    var list = readCache(COL.purchases);
    var idx = list.findIndex(function(p) { return p.id === purchase.id; });
    var updated = idx >= 0
      ? list.map(function(p) { return p.id === purchase.id ? purchase : p; })
      : [purchase].concat(list);
    writeCache(COL.purchases, updated);
    DataStore.logActivity('Super Admin', 'Recorded Purchase Bill',
      purchase.billNumber + ' from ' + purchase.supplierName);
    return updated;
  }

  static async deletePurchase(id) {
    await firestoreDelete(COL.purchases, id);
    var updated = readCache(COL.purchases).filter(function(p) { return p.id !== id; });
    writeCache(COL.purchases, updated);
    return updated;
  }

  // TASKS
  static getTasks() { return readCache(COL.tasks); }

  static async fetchTasks() {
    var data = await firestoreFetchAll(COL.tasks);
    data.sort(function(a, b) { return (b.deadline || '').localeCompare(a.deadline || ''); });
    writeCache(COL.tasks, data);
    return data;
  }

  static async saveTask(task) {
    await firestoreUpsert(COL.tasks, task);
    var list = readCache(COL.tasks);
    var idx = list.findIndex(function(t) { return t.id === task.id; });
    var updated = idx >= 0
      ? list.map(function(t) { return t.id === task.id ? task : t; })
      : [task].concat(list);
    writeCache(COL.tasks, updated);
    DataStore.logActivity('Staff', idx >= 0 ? 'Updated Task' : 'Allocated Task',
      task.id + ' -> ' + task.assignedTechnician + ' for ' + task.customerName);
    return updated;
  }

  static async deleteTask(id) {
    await firestoreDelete(COL.tasks, id);
    var updated = readCache(COL.tasks).filter(function(t) { return t.id !== id; });
    writeCache(COL.tasks, updated);
    DataStore.logActivity('Staff', 'Deleted Task', 'Task ' + id + ' removed');
    return updated;
  }

  static async updateTaskStatus(taskId, status, photoUrl, notes) {
    var tasks = await DataStore.fetchTasks();
    var targetTech = 'Technician';
    var changedTask = null;
    var updated = tasks.map(function(t) {
      if (t.id !== taskId) return t;
      targetTech = t.assignedTechnician || 'Technician';
      changedTask = Object.assign({}, t, {
        status: status,
        completionPhotoUrl: photoUrl || t.completionPhotoUrl || null,
        notes: notes ? ((t.notes || '') + '\n[Tech Note]: ' + notes) : (t.notes || ''),
        installedDate: status === 'Installed'
          ? new Date().toISOString().slice(0, 16).replace('T', ' ')
          : (t.installedDate || null),
      });
      return changedTask;
    });
    if (changedTask) await firestoreUpsert(COL.tasks, changedTask);
    writeCache(COL.tasks, updated);
    DataStore.logActivity(targetTech, 'Changed Task Status', 'Task ' + taskId + ' -> "' + status + '"');
    return updated;
  }

  // INVENTORY
  static getInventory() { return readCache(COL.inventory); }

  static async fetchInventory() {
    var data = await firestoreFetchAll(COL.inventory);
    data.sort(function(a, b) { return (a.name || '').localeCompare(b.name || ''); });
    writeCache(COL.inventory, data);
    return data;
  }

  static async saveInventoryItem(item) {
    await firestoreUpsert(COL.inventory, item);
    var list = readCache(COL.inventory);
    var idx = list.findIndex(function(i) { return i.id === item.id; });
    var updated = idx >= 0
      ? list.map(function(i) { return i.id === item.id ? item : i; })
      : list.concat([item]);
    writeCache(COL.inventory, updated);
    DataStore.logActivity('Staff', 'Updated Inventory', item.name + ': ' + item.stock + ' ' + item.unit);
    return updated;
  }

  static async deleteInventoryItem(id) {
    await firestoreDelete(COL.inventory, id);
    var updated = readCache(COL.inventory).filter(function(i) { return i.id !== id; });
    writeCache(COL.inventory, updated);
    DataStore.logActivity('Staff', 'Deleted Inventory Item', 'Item ' + id + ' removed');
    return updated;
  }

  static async updateStock(itemId, quantityDelta) {
    var items = readCache(COL.inventory);
    var itemName = '';
    var changedItem = null;
    var updated = items.map(function(item) {
      if (item.id !== itemId) return item;
      itemName = item.name;
      changedItem = Object.assign({}, item, { stock: Math.max(0, (item.stock || 0) + quantityDelta) });
      return changedItem;
    });
    if (changedItem) await firestoreUpsert(COL.inventory, changedItem);
    writeCache(COL.inventory, updated);
    DataStore.logActivity('Staff', 'Stock Adjustment',
      itemName + ' adjusted by ' + (quantityDelta > 0 ? '+' : '') + quantityDelta);
    return updated;
  }

  // STAFF
  static getStaff() { return readCache(COL.staff); }

  static async fetchStaff() {
    var data = await firestoreFetchAll(COL.staff);
    data.sort(function(a, b) { return (a.createdDate || '').localeCompare(b.createdDate || ''); });
    writeCache(COL.staff, data);
    return data;
  }

  static async saveStaff(member) {
    await firestoreUpsert(COL.staff, member);
    var list = readCache(COL.staff);
    var idx = list.findIndex(function(s) { return s.id === member.id; });
    var updated = idx >= 0
      ? list.map(function(s) { return s.id === member.id ? member : s; })
      : list.concat([member]);
    writeCache(COL.staff, updated);
    DataStore.logActivity('Super Admin', idx >= 0 ? 'Updated Staff Credential' : 'Added Staff Account',
      member.name + ' (' + member.phone + ') -- ' + member.role);
    return updated;
  }

  static async deleteStaff(staffId) {
    var list = readCache(COL.staff);
    var target = list.find(function(s) { return s.id === staffId; });
    await firestoreDelete(COL.staff, staffId);
    var updated = list.filter(function(s) { return s.id !== staffId; });
    writeCache(COL.staff, updated);
    if (target) {
      DataStore.logActivity('Super Admin', 'Removed Staff Account',
        target.name + ' (' + target.phone + ')');
    }
    return updated;
  }

  // ACTIVITY LOGS
  static getActivityLogs() { return readCache(COL.activity_logs); }

  static async fetchActivityLogs() {
    var data = await firestoreFetchAll(COL.activity_logs);
    data.sort(function(a, b) { return (b.timestamp || '').localeCompare(a.timestamp || ''); });
    var trimmed = data.slice(0, 300);
    writeCache(COL.activity_logs, trimmed);
    return trimmed;
  }

  // Fire-and-forget log entry - does NOT need to be awaited by callers
  static logActivity(staffName, action, details) {
    var newLog = {
      id: 'LOG-' + Date.now(),
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      staffName: staffName,
      action: action,
      details: details,
    };
    firestoreUpsert(COL.activity_logs, newLog).catch(function() {});
    var logs = readCache(COL.activity_logs);
    var updated = [newLog].concat(logs).slice(0, 300);
    writeCache(COL.activity_logs, updated);
    return updated;
  }

  // Utility: clear all caches on logout
  static clearAllCaches() {
    Object.values(COL).forEach(clearCache);
  }
}
