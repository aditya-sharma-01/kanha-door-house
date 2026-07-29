export const BUSINESS_INFO = {
  name: "Kanha Door House",
  owner: "Sonu Sharma",
  established: "2016",
  gstin: "10EOTP5377R1ZR",
  address: "Marwadi Mohalla, Jamalpur, Bihar - 811214",
  phone: "+91 95040 83165",
  email: "kanhadoorhouse.jamalpur@gmail.com",
  stateCode: "10 (Bihar)",
  tagline: "Precision Machine Manufactured WPVC, UPVC, Aluminium & Flush Doors and Windows",
};

export const INITIAL_STAFF = [
  { id: "STF-01", name: "Sonu Sharma", role: "Super Admin", phone: "9504083165", password: "admin123", status: "Active", createdDate: "2016-04-01" },
  { id: "STF-02", name: "Rakesh Verma", role: "Office Staff", phone: "7004512389", password: "staff123", status: "Active", createdDate: "2020-02-15" },
  { id: "STF-03", name: "Amit Kumar", role: "Field Technician", phone: "9835122441", password: "tech123", status: "Active", createdDate: "2021-08-10" },
  { id: "STF-04", name: "Pankaj Sharma", role: "Field Technician", phone: "9709144321", password: "tech123", status: "Active", createdDate: "2022-11-05" },
];

export const INITIAL_INVOICES = [
  {
    id: "INV-2026-001",
    customerName: "Rajesh Kumar",
    customerPhone: "+91 98351 12345",
    customerAddress: "Station Road, Marwadi Mohalla, Jamalpur, Bihar",
    date: "2026-07-25",
    dueDate: "2026-08-01",
    items: [
      { description: "UPVC Sliding Window (White 6x4 ft, 5mm Glass)", hsn: "3925", qty: 2, unitPrice: 11000, amount: 22000 },
      { description: "WPVC Main Entrance Door (30mm Solid Waterproof 7x3 ft)", hsn: "3925", qty: 1, unitPrice: 12500, amount: 12500 }
    ],
    subtotal: 34500,
    cgstRate: 9,
    cgstAmount: 3105,
    sgstRate: 9,
    sgstAmount: 3105,
    igstRate: 0,
    igstAmount: 0,
    total: 40710,
    advancePaid: 20000,
    balanceDue: 20710,
    status: "Partial Paid",
    paymentMode: "UPI / Bank Transfer",
    notes: "Precision machine cut profiles. Free on-site measurement included.",
    createdBy: "Rakesh Verma"
  },
  {
    id: "INV-2026-002",
    customerName: "Vikram Singh",
    customerPhone: "+91 94310 98765",
    customerAddress: "Bari Bazar, Munger, Bihar",
    date: "2026-07-28",
    dueDate: "2026-08-05",
    items: [
      { description: "Aluminium 3-Track Sliding Window (Bronze Anodized 5x4 ft)", hsn: "7610", qty: 4, unitPrice: 8500, amount: 34000 },
      { description: "Flush Door Waterproof Pine Core (7x3.25 ft)", hsn: "4418", qty: 2, unitPrice: 4200, amount: 8400 },
      { description: "Precision On-Site Fitting & Hardware Installation", hsn: "9954", qty: 1, unitPrice: 3600, amount: 3600 }
    ],
    subtotal: 46000,
    cgstRate: 9,
    cgstAmount: 4140,
    sgstRate: 9,
    sgstAmount: 4140,
    igstRate: 0,
    igstAmount: 0,
    total: 54280,
    advancePaid: 54280,
    balanceDue: 0,
    status: "Paid",
    paymentMode: "Cash",
    notes: "Full payment received upon order confirmation.",
    createdBy: "Sonu Sharma"
  }
];

export const INITIAL_PURCHASES = [
  {
    id: "PUR-2026-088",
    supplierName: "Apex Aluminium Extrusions Pvt Ltd",
    supplierGSTIN: "10AAACA5541B1ZS",
    billNumber: "APX/26-27/451",
    date: "2026-07-10",
    description: "Raw Aluminium Profiles & UPVC Profile Bars Batch",
    hsn: "7610",
    taxableValue: 85000,
    inputCGST: 7650,
    inputSGST: 7650,
    totalAmount: 100300,
    paymentStatus: "Paid"
  },
  {
    id: "PUR-2026-089",
    supplierName: "Polymer Doors & Glass Mfg India",
    supplierGSTIN: "10BBBP9912C1ZT",
    billNumber: "PDM/8812",
    date: "2026-07-18",
    description: "WPVC Solid Panels 30mm & 5mm Toughened Glass Sheets",
    hsn: "3925",
    taxableValue: 62000,
    inputCGST: 5580,
    inputSGST: 5580,
    totalAmount: 73160,
    paymentStatus: "Paid"
  }
];

export const INITIAL_TASKS = [
  {
    id: "TASK-101",
    invoiceId: "INV-2026-001",
    customerName: "Rajesh Kumar",
    customerPhone: "+91 98351 12345",
    installationAddress: "Station Road, Marwadi Mohalla, Jamalpur, Bihar - 811214",
    workDescription: "Install 2 UPVC Sliding Windows & 1 WPVC Main Door with multi-lock hardware.",
    assignedTechnician: "Amit Kumar",
    technicianPhone: "9835122441",
    deadline: "2026-07-31",
    priority: "High",
    status: "Pending Installation",
    specs: "UPVC White Frame, 5mm Toughened Glass, Waterproof WPVC Frame",
    notes: "Customer available after 10 AM. Carry 100mm SDS drill bits and anchor bolts.",
    completionPhotoUrl: null,
    installedDate: null,
  },
  {
    id: "TASK-102",
    invoiceId: "INV-2026-002",
    customerName: "Vikram Singh",
    customerPhone: "+91 94310 98765",
    installationAddress: "Bari Bazar, Munger, Bihar",
    workDescription: "Fit 4 Aluminium 3-Track Windows & 2 Flush Doors.",
    assignedTechnician: "Pankaj Sharma",
    technicianPhone: "9709144321",
    deadline: "2026-07-28",
    priority: "Normal",
    status: "Installed",
    specs: "Bronze Anodized Aluminium, Stainless Steel Mesh",
    notes: "Installation verified and client sign-off completed.",
    completionPhotoUrl: "https://images.unsplash.com/photo-1534349735944-2b3a6f7a268f?w=600&auto=format&fit=crop&q=60",
    installedDate: "2026-07-28 16:30",
  }
];

export const INITIAL_INVENTORY = [
  { id: "RAW-001", name: "UPVC Outer Frame Bar (White, 6 Meter)", category: "Raw Profile", unit: "Bars", stock: 140, minAlert: 40, costPrice: 850 },
  { id: "RAW-002", name: "WPVC Solid Door Panel (30mm thickness)", category: "Raw Profile", unit: "Units", stock: 45, minAlert: 15, costPrice: 4200 },
  { id: "RAW-003", name: "Aluminium 3-Track Heavy Extrusion (Bronze)", category: "Raw Profile", unit: "Bars", stock: 85, minAlert: 25, costPrice: 1100 },
  { id: "RAW-004", name: "Toughened Clear Float Glass (5mm thickness)", category: "Glass Sheet", unit: "Sq Ft", stock: 1200, minAlert: 300, costPrice: 48 },
  { id: "RAW-005", name: "SS 304 Friction Stay Hinges (12 Inch)", category: "Hardware", unit: "Pairs", stock: 180, minAlert: 50, costPrice: 220 },
  { id: "RAW-006", name: "Multi-Point Key Lock Set for UPVC/WPVC", category: "Hardware", unit: "Sets", stock: 35, minAlert: 10, costPrice: 850 },
  { id: "FG-101", name: "Pre-Assembled WPVC Waterproof Molded Door (7x3 ft)", category: "Finished Door", unit: "Units", stock: 12, minAlert: 5, costPrice: 6500 },
  { id: "FG-102", name: "UPVC Sliding Window Frame (4x4 ft)", category: "Finished Window", unit: "Units", stock: 8, minAlert: 3, costPrice: 5200 },
];

export const INITIAL_ACTIVITY_LOGS = [
  { id: "LOG-1001", timestamp: "2026-07-28 16:30:15", staffName: "Pankaj Sharma", action: "Installation Completed", details: "Completed fitting for TASK-102 (Vikram Singh)" },
  { id: "LOG-1002", timestamp: "2026-07-28 14:15:00", staffName: "Sonu Sharma", action: "Generated Tax Invoice", details: "Created INV-2026-002 for Vikram Singh (Total ₹54,280)" },
  { id: "LOG-1003", timestamp: "2026-07-25 11:20:45", staffName: "Rakesh Verma", action: "Generated Tax Invoice", details: "Created INV-2026-001 for Rajesh Kumar (Advance ₹20,000)" },
  { id: "LOG-1004", timestamp: "2026-07-25 09:45:10", staffName: "Sonu Sharma", action: "Allocated Task", details: "Assigned TASK-101 to Amit Kumar" },
];
