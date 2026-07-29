export const BUSINESS_INFO = {
  name: "Kanha Door House",
  owner: "Sonu Sharma",
  established: "2016",
  gstin: "10EOTP5377R1ZR",
  address: "Marwadi Mohalla, Jamalpur, Bihar - 811214",
  phone: "+91 98352 06464",
  email: "kanhadoorhouse.jamalpur@gmail.com",
  stateCode: "10 (Bihar)",
  tagline: "Precision Machine Manufactured WPVC, UPVC, Aluminium & Flush Doors and Windows",
};

// ── All collections start empty. Data lives only in Firestore. ──────────────
export const INITIAL_STAFF         = [];
export const INITIAL_INVOICES      = [];
export const INITIAL_PURCHASES     = [];
export const INITIAL_TASKS         = [];
export const INITIAL_INVENTORY     = [];
export const INITIAL_ACTIVITY_LOGS = [];

// ── Super Admin bootstrap: this ONLY runs the very first time Firestore
//    has NO staff records at all (fresh project). Admin can change everything
//    from the dashboard afterwards.
export const BOOTSTRAP_SUPER_ADMIN = {
  id: "STF-01",
  name: "Sonu Sharma",
  role: "Super Admin",
  phone: "9835206464",
  password: "admin123",
  status: "Active",
  createdDate: new Date().toISOString().slice(0, 10),
};
