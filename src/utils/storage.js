/**
 * Storage Utility with initial Mock Data for Press Ledger
 */

const STORAGE_KEYS = {
  SETTINGS: 'press_ledger_settings',
  JOBS: 'press_ledger_jobs',
  CLIENTS: 'press_ledger_clients',
  INVOICES: 'press_ledger_invoices',
  INVENTORY: 'press_ledger_inventory',
  LEDGER: 'press_ledger_entries',
};

const DEFAULT_SETTINGS = {
  companyName: 'Apex Print & Publishing House',
  address: '45 Industrial Press Way, Suite 100, Tech City',
  phone: '+880 1711-000000',
  email: 'billing@apexpress.com',
  taxId: 'BIN-883921-P',
  currency: '৳',
  ctpPlateRate: 250,
  impressionRatePerThousand: 150,
  defaultTaxPercent: 5,
};

const INITIAL_CLIENTS = [
  {
    id: 'C-101',
    name: 'Acme Corporations',
    contactPerson: 'Sarah Jenkins',
    phone: '+1 (555) 234-5678',
    email: 'sarah@acmecorp.com',
    totalBilled: 4850,
    totalPaid: 3200,
    balance: 1650,
    address: '100 Enterprise Blvd, Suite 400',
  },
  {
    id: 'C-102',
    name: 'Horizon Publishing Ltd',
    contactPerson: 'David Miller',
    phone: '+1 (555) 876-5432',
    email: 'david@horizonbooks.com',
    totalBilled: 12400,
    totalPaid: 12400,
    balance: 0,
    address: '88 Library Square, Building B',
  },
  {
    id: 'C-103',
    name: 'Starlight Events & Expo',
    contactPerson: 'Elena Rostova',
    phone: '+1 (555) 998-1122',
    email: 'elena@starlightevents.org',
    totalBilled: 2150,
    totalPaid: 1000,
    balance: 1150,
    address: '55 Center Stage Plaza',
  },
  {
    id: 'C-104',
    name: 'Global Tech Solutions',
    contactPerson: 'Marcus Vance',
    phone: '+1 (555) 443-2211',
    email: 'marcus@globaltech.io',
    totalBilled: 6500,
    totalPaid: 5000,
    balance: 1500,
    address: '300 Innovation Way',
  },
];

const INITIAL_JOBS = [
  {
    id: 'PL-101',
    jobNo: 'JOB-2026-101',
    title: 'Annual Corporate Product Catalogues (5,000 Copies)',
    clientId: 'C-101',
    clientName: 'Acme Corporations',
    jobType: 'Booklet / Catalog',
    paper: '150gsm Art Paper (23" x 36")',
    finishedSize: 'A4 (8.27" x 11.69")',
    pages: 32,
    quantity: 5000,
    stage: 'Printing', // Pre-Press, Plate Making, Printing, Finishing, QC, Ready, Delivered
    operator: 'John Reynolds (Heidelberg 4-Color)',
    deliveryDate: '2026-08-22',
    createdDate: '2026-08-12',
    totalCost: 2450,
    notes: 'Gloss lamination on cover (300gsm), Saddle stitch binding.',
  },
  {
    id: 'PL-102',
    jobNo: 'JOB-2026-102',
    title: 'Starlight Expo Promotional Flyers (10,000 Pcs)',
    clientId: 'C-103',
    clientName: 'Starlight Events & Expo',
    jobType: 'Flyer',
    paper: '120gsm Offset Paper (20" x 30")',
    finishedSize: 'Flier / Brochure (8.5" x 3.66")',
    pages: 2,
    quantity: 10000,
    stage: 'Finishing',
    operator: 'Michael Scott (Polar Cutter Line)',
    deliveryDate: '2026-08-18',
    createdDate: '2026-08-14',
    totalCost: 1150,
    notes: '2-fold brochure cutting. Double sided 4/4 CMYK.',
  },
  {
    id: 'PL-103',
    jobNo: 'JOB-2026-103',
    title: 'Horizon Literature Hardcover Novel (2,000 Books)',
    clientId: 'C-102',
    clientName: 'Horizon Publishing Ltd',
    jobType: 'Hardcover Book',
    paper: '80gsm Cream Book Paper (25" x 37")',
    finishedSize: '6" x 9" Book',
    pages: 240,
    quantity: 2000,
    stage: 'Delivered',
    operator: 'Robert Vance (Komori Lithrone)',
    deliveryDate: '2026-08-10',
    createdDate: '2026-08-01',
    totalCost: 5800,
    notes: 'Perfect binding with section sewing, Foil embossing on spine.',
  },
  {
    id: 'PL-104',
    jobNo: 'JOB-2026-104',
    title: 'Eco-Friendly Custom Retail Packaging Boxes (15,000 Pcs)',
    clientId: 'C-104',
    clientName: 'Global Tech Solutions',
    jobType: 'Packaging Box',
    paper: '350gsm Duplex Board (25" x 37")',
    finishedSize: 'Custom Die-Cut',
    pages: 1,
    quantity: 15000,
    stage: 'Plate Making',
    operator: 'Alice Cooper (CTP Line)',
    deliveryDate: '2026-08-25',
    createdDate: '2026-08-15',
    totalCost: 4200,
    notes: 'Matte lamination + Gold Foil Stamping + Die-cut creasing.',
  },
  {
    id: 'PL-105',
    jobNo: 'JOB-2026-105',
    title: 'Executive Spot-UV Business Cards (1,000 Cards)',
    clientId: 'C-101',
    clientName: 'Acme Corporations',
    jobType: 'Business Cards',
    paper: '350gsm Art Board (25" x 37")',
    finishedSize: 'Business Card (3.5" x 2")',
    pages: 2,
    quantity: 1000,
    stage: 'Pre-Press',
    operator: 'Pre-press Dept',
    deliveryDate: '2026-08-21',
    createdDate: '2026-08-16',
    totalCost: 350,
    notes: 'Velvet soft touch lamination + Spot UV coating.',
  },
];

const INITIAL_INVOICES = [
  {
    id: 'INV-2026-001',
    jobId: 'PL-101',
    jobNo: 'JOB-2026-101',
    clientId: 'C-101',
    clientName: 'Acme Corporations',
    invoiceDate: '2026-08-12',
    dueDate: '2026-08-26',
    subtotal: 2333.33,
    tax: 116.67,
    total: 2450,
    paidAmount: 800,
    balance: 1650,
    status: 'Partial', // Paid, Partial, Unpaid
    items: [
      { description: 'Annual Corporate Product Catalogues (5,000 Copies)', quantity: 5000, unitPrice: 0.49, total: 2450 }
    ]
  },
  {
    id: 'INV-2026-002',
    jobId: 'PL-103',
    jobNo: 'JOB-2026-103',
    clientId: 'C-102',
    clientName: 'Horizon Publishing Ltd',
    invoiceDate: '2026-08-01',
    dueDate: '2026-08-15',
    subtotal: 5523.81,
    tax: 276.19,
    total: 5800,
    paidAmount: 5800,
    balance: 0,
    status: 'Paid',
    items: [
      { description: 'Horizon Literature Hardcover Novel (2,000 Books)', quantity: 2000, unitPrice: 2.90, total: 5800 }
    ]
  },
  {
    id: 'INV-2026-003',
    jobId: 'PL-102',
    jobNo: 'JOB-2026-102',
    clientId: 'C-103',
    clientName: 'Starlight Events & Expo',
    invoiceDate: '2026-08-14',
    dueDate: '2026-08-28',
    subtotal: 1095.24,
    tax: 54.76,
    total: 1150,
    paidAmount: 0,
    balance: 1150,
    status: 'Unpaid',
    items: [
      { description: 'Starlight Expo Promotional Flyers (10,000 Pcs)', quantity: 10000, unitPrice: 0.115, total: 1150 }
    ]
  }
];

const INITIAL_INVENTORY = [
  { id: 'INV-1', name: '150gsm Gloss Art Paper (23" x 36")', category: 'Paper', stock: 45, unit: 'Reams', minStock: 10, unitPrice: 145 },
  { id: 'INV-2', name: '120gsm Offset White Paper (20" x 30")', category: 'Paper', stock: 8, unit: 'Reams', minStock: 15, unitPrice: 95 },
  { id: 'INV-3', name: '300gsm Premium Art Board (25" x 37")', category: 'Paper', stock: 28, unit: 'Reams', minStock: 8, unitPrice: 190 },
  { id: 'INV-4', name: '350gsm Packaging Duplex Board (25" x 37")', category: 'Paper', stock: 6, unit: 'Reams', minStock: 10, unitPrice: 180 },
  { id: 'INV-5', name: 'Cyan Process Offset Ink (5 KG Can)', category: 'Ink', stock: 12, unit: 'Cans', minStock: 4, unitPrice: 65 },
  { id: 'INV-6', name: 'Magenta Process Offset Ink (5 KG Can)', category: 'Ink', stock: 3, unit: 'Cans', minStock: 5, unitPrice: 65 },
  { id: 'INV-7', name: 'Yellow Process Offset Ink (5 KG Can)', category: 'Ink', stock: 9, unit: 'Cans', minStock: 4, unitPrice: 65 },
  { id: 'INV-8', name: 'Black Process Offset Ink (5 KG Can)', category: 'Ink', stock: 14, unit: 'Cans', minStock: 5, unitPrice: 60 },
  { id: 'INV-9', name: 'CTP Thermal Plates (1030 x 790mm)', category: 'Plates', stock: 140, unit: 'Plates', minStock: 30, unitPrice: 15 },
  { id: 'INV-10', name: 'Thermal Gloss Lamination Film (1200m)', category: 'Supplies', stock: 7, unit: 'Rolls', minStock: 3, unitPrice: 110 },
];

const INITIAL_LEDGER = [
  { id: 'LED-1', date: '2026-08-01', type: 'Income', category: 'Job Payment', description: 'Advance payment for Horizon Books (PL-103)', amount: 3000, reference: 'INV-2026-002' },
  { id: 'LED-2', date: '2026-08-03', type: 'Expense', category: 'Material Purchase', description: '50 Reams Art Paper & Board Purchase (Paper Corp)', amount: 1850, reference: 'PO-9041' },
  { id: 'LED-3', date: '2026-08-05', type: 'Expense', category: 'Utilities', description: 'Monthly Press Factory Electricity & Power Bill', amount: 680, reference: 'ELEC-AUG' },
  { id: 'LED-4', date: '2026-08-08', type: 'Income', category: 'Job Payment', description: 'Final Settlement Horizon Books (PL-103)', amount: 2800, reference: 'INV-2026-002' },
  { id: 'LED-5', date: '2026-08-10', type: 'Expense', category: 'Maintenance', description: 'Heidelberg Press 4-Color Roller Replacement & Tuning', amount: 450, reference: 'MNT-331' },
  { id: 'LED-6', date: '2026-08-12', type: 'Income', category: 'Job Payment', description: 'Deposit Payment Acme Corp Catalogue (PL-101)', amount: 800, reference: 'INV-2026-001' },
  { id: 'LED-7', date: '2026-08-15', type: 'Expense', category: 'Wages', description: 'Bi-weekly Operator & Helper Press Technician Wages', amount: 2400, reference: 'PAYROLL-W2' },
];

/**
 * Storage Helpers
 */
export function getStoredData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

export function saveStoredData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

export function loadAllAppData() {
  return {
    settings: getStoredData(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS),
    jobs: getStoredData(STORAGE_KEYS.JOBS, INITIAL_JOBS),
    clients: getStoredData(STORAGE_KEYS.CLIENTS, INITIAL_CLIENTS),
    invoices: getStoredData(STORAGE_KEYS.INVOICES, INITIAL_INVOICES),
    inventory: getStoredData(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY),
    ledger: getStoredData(STORAGE_KEYS.LEDGER, INITIAL_LEDGER),
  };
}

export { STORAGE_KEYS, DEFAULT_SETTINGS };
