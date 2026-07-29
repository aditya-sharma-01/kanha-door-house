import {
  collection, doc, getDoc, getDocs, setDoc, deleteDoc,
  addDoc, serverTimestamp, query, orderBy, limit, onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { INITIAL_INVOICES, INITIAL_TASKS, INITIAL_INVENTORY, INITIAL_STAFF, INITIAL_PURCHASES, INITIAL_ACTIVITY_LOGS } from './types';

// ─── Local cache helpers (read-through / write-through) ───────────────────────
const getLocalCache = (key, defaultValue) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(`kdh_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch { return defaultValue; }
};

const setLocalCache = (key, value) => {
  if (typeof window !== 'undefined') {
    try { localStorage.setItem(`kdh_${key}`, JSON.stringify(value)); }
    catch (e) { console.warn('localStorage write failed:', e); }
  }
};

// ─── Generic Firestore helpers ─────────────────────────────────────────────────
const COL = {
  invoices: 'invoices',
  purchases: 'purchases',
  tasks: 'tasks',
  inventory: 'inventory',
  staff: 'staff',
  activity_logs: 'activity_logs',
};

/** Fetch all documents from a collection, return as array */
async function fetchAll(colName) {
  try {
    const snap = await getDocs(collection(db, colName));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error(`Firestore fetchAll(${colName}) failed:`, e);
    return null; // caller falls back to local cache
  }
}

/** Upsert a document using its own `id` field as the Firestore doc ID */
async function upsertDoc(colName, item) {
  try {
    const ref = doc(db, colName, String(item.id));
    await setDoc(ref, { ...item, _updatedAt: serverTimestamp() }, { merge: true });
  } catch (e) {
    console.error(`Firestore upsertDoc(${colName}) failed:`, e);
  }
}

/** Delete a document by id */
async function removeDoc(colName, id) {
  try {
    await deleteDoc(doc(db, colName, String(id)));
  } catch (e) {
    console.error(`Firestore removeDoc(${colName}, ${id}) failed:`, e);
  }
}

/** Seed Firestore with initial data if collection is empty */
async function seedIfEmpty(colName, initialData) {
  try {
    const snap = await getDocs(collection(db, colName));
    if (snap.empty) {
      await Promise.all(initialData.map(item =>
        setDoc(doc(db, colName, String(item.id)), { ...item, _seeded: true })
      ));
      console.log(`[Firebase] Seeded ${colName} with ${initialData.length} records.`);
    }
  } catch (e) {
    console.error(`Firestore seed(${colName}) failed:`, e);
  }
}

// Seed all collections on first run
(async () => {
  await Promise.all([
    seedIfEmpty(COL.invoices, INITIAL_INVOICES),
    seedIfEmpty(COL.purchases, INITIAL_PURCHASES),
    seedIfEmpty(COL.tasks, INITIAL_TASKS),
    seedIfEmpty(COL.inventory, INITIAL_INVENTORY),
    seedIfEmpty(COL.staff, INITIAL_STAFF),
    seedIfEmpty(COL.activity_logs, INITIAL_ACTIVITY_LOGS),
  ]);
})();

// ─── DataStore ─────────────────────────────────────────────────────────────────
export class DataStore {

  // ── INVOICES ────────────────────────────────────────────────────────────────
  static getInvoices() {
    return getLocalCache('invoices', INITIAL_INVOICES);
  }

  static async fetchInvoices() {
    const data = await fetchAll(COL.invoices);
    if (data) setLocalCache('invoices', data);
    return data || this.getInvoices();
  }

  static async saveInvoice(invoice) {
    await upsertDoc(COL.invoices, invoice);
    const list = this.getInvoices();
    const idx = list.findIndex(i => i.id === invoice.id);
    const updated = idx >= 0
      ? list.map(i => i.id === invoice.id ? invoice : i)
      : [invoice, ...list];
    setLocalCache('invoices', updated);
    this.logActivity('Staff', idx >= 0 ? 'Updated Invoice' : 'Created Invoice',
      `${invoice.id} for ${invoice.customerName} (₹${invoice.total?.toLocaleString('en-IN')})`);
    return updated;
  }

  // ── PURCHASES (ITC) ─────────────────────────────────────────────────────────
  static getPurchases() {
    return getLocalCache('purchases', INITIAL_PURCHASES);
  }

  static async fetchPurchases() {
    const data = await fetchAll(COL.purchases);
    if (data) setLocalCache('purchases', data);
    return data || this.getPurchases();
  }

  static async savePurchase(purchase) {
    await upsertDoc(COL.purchases, purchase);
    const list = this.getPurchases();
    const idx = list.findIndex(p => p.id === purchase.id);
    const updated = idx >= 0
      ? list.map(p => p.id === purchase.id ? purchase : p)
      : [purchase, ...list];
    setLocalCache('purchases', updated);
    this.logActivity('Super Admin', 'Recorded Purchase Bill (ITC)',
      `Bill No: ${purchase.billNumber} from ${purchase.supplierName}`);
    return updated;
  }

  // ── TASKS ───────────────────────────────────────────────────────────────────
  static getTasks() {
    return getLocalCache('tasks', INITIAL_TASKS);
  }

  static async fetchTasks() {
    const data = await fetchAll(COL.tasks);
    if (data) setLocalCache('tasks', data);
    return data || this.getTasks();
  }

  static async saveTask(task) {
    await upsertDoc(COL.tasks, task);
    const list = this.getTasks();
    const idx = list.findIndex(t => t.id === task.id);
    const updated = idx >= 0
      ? list.map(t => t.id === task.id ? task : t)
      : [task, ...list];
    setLocalCache('tasks', updated);
    this.logActivity('Staff', idx >= 0 ? 'Updated Task' : 'Allocated Task',
      `${task.id} → ${task.assignedTechnician} for ${task.customerName}`);
    return updated;
  }

  static async updateTaskStatus(taskId, status, photoUrl = null, notes = null) {
    const tasks = this.getTasks();
    let targetTech = 'Technician';
    const updated = tasks.map(t => {
      if (t.id !== taskId) return t;
      targetTech = t.assignedTechnician;
      return {
        ...t, status,
        ...(photoUrl ? { completionPhotoUrl: photoUrl } : {}),
        ...(notes ? { notes: `${t.notes || ''}\n[Tech Note]: ${notes}` } : {}),
        ...(status === 'Installed' ? { installedDate: new Date().toISOString().slice(0, 16).replace('T', ' ') } : {}),
      };
    });
    const changedTask = updated.find(t => t.id === taskId);
    if (changedTask) await upsertDoc(COL.tasks, changedTask);
    setLocalCache('tasks', updated);
    this.logActivity(targetTech, 'Changed Task Status', `Task ${taskId} → "${status}"`);
    return updated;
  }

  // ── INVENTORY ───────────────────────────────────────────────────────────────
  static getInventory() {
    return getLocalCache('inventory', INITIAL_INVENTORY);
  }

  static async fetchInventory() {
    const data = await fetchAll(COL.inventory);
    if (data) setLocalCache('inventory', data);
    return data || this.getInventory();
  }

  static async saveInventoryItem(item) {
    await upsertDoc(COL.inventory, item);
    const list = this.getInventory();
    const idx = list.findIndex(i => i.id === item.id);
    const updated = idx >= 0
      ? list.map(i => i.id === item.id ? item : i)
      : [item, ...list];
    setLocalCache('inventory', updated);
    this.logActivity('Staff', 'Updated Inventory', `${item.name}: ${item.stock} ${item.unit}`);
    return updated;
  }

  static async updateStock(itemId, quantityDelta) {
    const items = this.getInventory();
    let itemName = '';
    const updated = items.map(item => {
      if (item.id !== itemId) return item;
      itemName = item.name;
      return { ...item, stock: Math.max(0, item.stock + quantityDelta) };
    });
    const changed = updated.find(i => i.id === itemId);
    if (changed) await upsertDoc(COL.inventory, changed);
    setLocalCache('inventory', updated);
    this.logActivity('Staff', 'Stock Adjustment',
      `${itemName} adjusted by ${quantityDelta > 0 ? '+' : ''}${quantityDelta}`);
    return updated;
  }

  // ── STAFF ───────────────────────────────────────────────────────────────────
  static getStaff() {
    return getLocalCache('staff', INITIAL_STAFF);
  }

  static async fetchStaff() {
    const data = await fetchAll(COL.staff);
    if (data) setLocalCache('staff', data);
    return data || this.getStaff();
  }

  static async saveStaff(member) {
    await upsertDoc(COL.staff, member);
    const list = this.getStaff();
    const idx = list.findIndex(s => s.id === member.id);
    const updated = idx >= 0
      ? list.map(s => s.id === member.id ? member : s)
      : [member, ...list];
    setLocalCache('staff', updated);
    this.logActivity('Super Admin', idx >= 0 ? 'Updated Staff Credential' : 'Added Staff Account',
      `${member.name} (${member.phone}) — ${member.role}`);
    return updated;
  }

  static async deleteStaff(staffId) {
    const list = this.getStaff();
    const target = list.find(s => s.id === staffId);
    await removeDoc(COL.staff, staffId);
    const updated = list.filter(s => s.id !== staffId);
    setLocalCache('staff', updated);
    if (target) this.logActivity('Super Admin', 'Removed Staff Account',
      `${target.name} (${target.phone})`);
    return updated;
  }

  // ── ACTIVITY LOGS ───────────────────────────────────────────────────────────
  static getActivityLogs() {
    return getLocalCache('activity_logs', INITIAL_ACTIVITY_LOGS);
  }

  static async fetchActivityLogs() {
    const data = await fetchAll(COL.activity_logs);
    if (data) {
      const sorted = data.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
      setLocalCache('activity_logs', sorted);
      return sorted;
    }
    return this.getActivityLogs();
  }

  static logActivity(staffName, action, details) {
    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      staffName, action, details,
    };
    // Write to Firestore async (fire-and-forget)
    upsertDoc(COL.activity_logs, newLog);
    // Update local cache immediately
    const logs = this.getActivityLogs();
    const updated = [newLog, ...logs].slice(0, 200);
    setLocalCache('activity_logs', updated);
    return updated;
  }
}
