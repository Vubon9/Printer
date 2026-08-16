import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PrintEstimator from './components/PrintEstimator';
import JobOrders from './components/JobOrders';
import ClientLedger from './components/ClientLedger';
import Invoices from './components/Invoices';
import Inventory from './components/Inventory';
import GeneralLedger from './components/GeneralLedger';
import Settings from './components/Settings';
import PrintModal from './components/PrintModal';

import {
  loadAllAppData,
  saveStoredData,
  clearAllAppData,
  STORAGE_KEYS
} from './utils/storage';
import './App.css';

function App() {
  const [appData, setAppData] = useState(() => {
    // Force clear old mock data so user has clean slate
    clearAllAppData();
    return loadAllAppData();
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');

  // Modals
  const [newJobModalOpen, setNewJobModalOpen] = useState(false);
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);
  const [printModalState, setPrintModalState] = useState({ open: false, type: null, data: null });

  // New Job Form State
  const [jobTitle, setJobTitle] = useState('');
  const [jobClientId, setJobClientId] = useState('');
  const [jobType, setJobType] = useState('Flyer');
  const [jobPaper, setJobPaper] = useState('150gsm Art Paper (23" x 36")');
  const [jobFinishedSize, setJobFinishedSize] = useState('A4 (8.27" x 11.69")');
  const [jobPages, setJobPages] = useState(2);
  const [jobQuantity, setJobQuantity] = useState(1000);
  const [jobCost, setJobCost] = useState(500);
  const [jobOperator, setJobOperator] = useState('Standard Offset Machine Line');
  const [jobDeliveryDate, setJobDeliveryDate] = useState('2026-08-25');
  const [jobNotes, setJobNotes] = useState('');

  // New Client Form State
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Storage Sync Wrappers
  const updateSettings = (newSettings) => {
    const updated = { ...appData.settings, ...newSettings };
    setAppData((prev) => ({ ...prev, settings: updated }));
    saveStoredData(STORAGE_KEYS.SETTINGS, updated);
  };

  const updateJobs = (newJobs) => {
    setAppData((prev) => ({ ...prev, jobs: newJobs }));
    saveStoredData(STORAGE_KEYS.JOBS, newJobs);
  };

  const updateClients = (newClients) => {
    setAppData((prev) => ({ ...prev, clients: newClients }));
    saveStoredData(STORAGE_KEYS.CLIENTS, newClients);
  };

  const updateInvoices = (newInvoices) => {
    setAppData((prev) => ({ ...prev, invoices: newInvoices }));
    saveStoredData(STORAGE_KEYS.INVOICES, newInvoices);
  };

  const updateInventory = (newInv) => {
    setAppData((prev) => ({ ...prev, inventory: newInv }));
    saveStoredData(STORAGE_KEYS.INVENTORY, newInv);
  };

  const updateLedger = (newLedger) => {
    setAppData((prev) => ({ ...prev, ledger: newLedger }));
    saveStoredData(STORAGE_KEYS.LEDGER, newLedger);
  };

  // Action Handlers
  const handleUpdateJobStage = (jobId, newStage) => {
    const updated = appData.jobs.map((j) => (j.id === jobId ? { ...j, stage: newStage } : j));
    updateJobs(updated);
  };

  const handleDeleteJob = (jobId) => {
    const updated = appData.jobs.filter((j) => j.id !== jobId);
    updateJobs(updated);
  };

  const handleCreateJob = (jobData) => {
    const newJobObj = {
      id: `PL-${Date.now().toString().slice(-3)}`,
      jobNo: `JOB-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdDate: new Date().toISOString().split('T')[0],
      stage: 'Pre-Press',
      ...jobData,
    };

    const newJobs = [newJobObj, ...appData.jobs];
    updateJobs(newJobs);

    // Create corresponding Invoice
    const selectedClient = appData.clients.find((c) => c.id === newJobObj.clientId);
    const taxAmt = Math.round(newJobObj.totalCost * ((appData.settings.defaultTaxPercent || 5) / 100));
    const totalAmt = newJobObj.totalCost + taxAmt;

    const newInvoiceObj = {
      id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      jobId: newJobObj.id,
      jobNo: newJobObj.jobNo,
      clientId: newJobObj.clientId,
      clientName: newJobObj.clientName,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: newJobObj.deliveryDate,
      subtotal: newJobObj.totalCost,
      tax: taxAmt,
      total: totalAmt,
      paidAmount: 0,
      balance: totalAmt,
      status: 'Unpaid',
      items: [
        {
          description: `${newJobObj.title} (${newJobObj.quantity.toLocaleString()} pcs)`,
          quantity: newJobObj.quantity,
          unitPrice: Math.round((newJobObj.totalCost / newJobObj.quantity) * 1000) / 1000,
          total: newJobObj.totalCost,
        },
      ],
    };

    updateInvoices([newInvoiceObj, ...appData.invoices]);

    // Update Client Billed Balance
    if (selectedClient) {
      const updatedClients = appData.clients.map((c) =>
        c.id === selectedClient.id
          ? {
              ...c,
              totalBilled: c.totalBilled + totalAmt,
              balance: c.balance + totalAmt,
            }
          : c
      );
      updateClients(updatedClients);
    }
  };

  const handleCreateJobSubmit = (e) => {
    e.preventDefault();
    const client = appData.clients.find((c) => c.id === jobClientId) || appData.clients[0];
    handleCreateJob({
      title: jobTitle || 'Custom Print Order',
      clientId: client.id,
      clientName: client.name,
      jobType,
      paper: jobPaper,
      finishedSize: jobFinishedSize,
      pages: Number(jobPages),
      quantity: Number(jobQuantity),
      totalCost: Number(jobCost),
      operator: jobOperator,
      deliveryDate: jobDeliveryDate,
      notes: jobNotes,
    });
    setNewJobModalOpen(false);
  };

  const handleCreateClientSubmit = (e) => {
    e.preventDefault();
    if (!clientName) return;

    const newClientObj = {
      id: `C-${Date.now().toString().slice(-3)}`,
      name: clientName,
      contactPerson: clientContact,
      phone: clientPhone,
      email: clientEmail,
      address: clientAddress,
      totalBilled: 0,
      totalPaid: 0,
      balance: 0,
    };

    updateClients([...appData.clients, newClientObj]);
    setNewClientModalOpen(false);
    setClientName('');
    setClientContact('');
    setClientPhone('');
    setClientEmail('');
    setClientAddress('');
  };

  const handleRecordPayment = ({ clientId, amount, method, reference, notes, date }) => {
    // 1. Update Client Record
    const updatedClients = appData.clients.map((c) =>
      c.id === clientId
        ? {
            ...c,
            totalPaid: c.totalPaid + amount,
            balance: Math.max(0, c.balance - amount),
          }
        : c
    );
    updateClients(updatedClients);

    // 2. Update Unpaid / Partial Invoices for this Client
    let remainingPayment = amount;
    const updatedInvoices = appData.invoices.map((inv) => {
      if (inv.clientId === clientId && inv.balance > 0 && remainingPayment > 0) {
        const payToInv = Math.min(inv.balance, remainingPayment);
        remainingPayment -= payToInv;

        const newPaid = inv.paidAmount + payToInv;
        const newBal = inv.total - newPaid;
        return {
          ...inv,
          paidAmount: newPaid,
          balance: newBal,
          status: newBal === 0 ? 'Paid' : 'Partial',
        };
      }
      return inv;
    });
    updateInvoices(updatedInvoices);

    // 3. Log Entry in General Ledger
    const targetClient = appData.clients.find((c) => c.id === clientId);
    const newLedgerEntry = {
      id: `LED-${Date.now().toString().slice(-4)}`,
      date: date || new Date().toISOString().split('T')[0],
      type: 'Income',
      category: 'Job Payment',
      description: `Payment from ${targetClient?.name || 'Client'} (${method})`,
      amount,
      reference,
    };
    updateLedger([newLedgerEntry, ...appData.ledger]);
  };

  const handleUpdateStock = (itemId, addQty) => {
    const updated = appData.inventory.map((item) =>
      item.id === itemId ? { ...item, stock: item.stock + addQty } : item
    );
    updateInventory(updated);
  };

  const handleAddInventoryItem = (newItem) => {
    updateInventory([...appData.inventory, newItem]);
  };

  const handleAddLedgerEntry = (newEntry) => {
    updateLedger([newEntry, ...appData.ledger]);
  };

  return (
    <div className="app-container">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        companyName={appData.settings.companyName}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          theme={theme}
          setTheme={setTheme}
          onOpenNewJob={() => setNewJobModalOpen(true)}
          onOpenNewClient={() => setNewClientModalOpen(true)}
        />

        <main className="content-body">
          {activeTab === 'dashboard' && (
            <Dashboard
              jobs={appData.jobs}
              clients={appData.clients}
              invoices={appData.invoices}
              inventory={appData.inventory}
              ledger={appData.ledger}
              currency={appData.settings.currency}
              setActiveTab={setActiveTab}
              onSelectJob={(job) => setPrintModalState({ open: true, type: 'ticket', data: job })}
            />
          )}

          {activeTab === 'estimator' && (
            <PrintEstimator
              clients={appData.clients}
              settings={appData.settings}
              currency={appData.settings.currency}
              onCreateJobFromQuote={(jobObj) => {
                handleCreateJob(jobObj);
                setActiveTab('jobs');
              }}
            />
          )}

          {activeTab === 'jobs' && (
            <JobOrders
              jobs={appData.jobs}
              clients={appData.clients}
              currency={appData.settings.currency}
              onUpdateJobStage={handleUpdateJobStage}
              onDeleteJob={handleDeleteJob}
              onOpenPrintTicket={(job) => setPrintModalState({ open: true, type: 'ticket', data: job })}
              onOpenChallanTicket={(job) => setPrintModalState({ open: true, type: 'challan', data: job })}
              onOpenNewJob={() => setNewJobModalOpen(true)}
            />
          )}

          {activeTab === 'clients' && (
            <ClientLedger
              clients={appData.clients}
              invoices={appData.invoices}
              ledger={appData.ledger}
              currency={appData.settings.currency}
              onOpenNewClient={() => setNewClientModalOpen(true)}
              onRecordPayment={handleRecordPayment}
              onOpenClientStatement={(client) => setPrintModalState({ open: true, type: 'statement', data: client })}
            />
          )}

          {activeTab === 'invoices' && (
            <Invoices
              invoices={appData.invoices}
              clients={appData.clients}
              jobs={appData.jobs}
              currency={appData.settings.currency}
              onOpenInvoiceModal={(inv) => setPrintModalState({ open: true, type: 'invoice', data: inv })}
            />
          )}

          {activeTab === 'inventory' && (
            <Inventory
              inventory={appData.inventory}
              currency={appData.settings.currency}
              onUpdateStock={handleUpdateStock}
              onAddInventoryItem={handleAddInventoryItem}
            />
          )}

          {activeTab === 'ledger' && (
            <GeneralLedger
              ledger={appData.ledger}
              currency={appData.settings.currency}
              onAddLedgerEntry={handleAddLedgerEntry}
            />
          )}

          {activeTab === 'settings' && (
            <Settings
              settings={appData.settings}
              onSaveSettings={updateSettings}
              onClearAllData={() => {
                clearAllAppData();
                setAppData(loadAllAppData());
              }}
            />
          )}
        </main>
      </div>

      {/* New Job Modal */}
      {newJobModalOpen && (
        <div className="modal-overlay" onClick={() => setNewJobModalOpen(false)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Job Order</h3>
              <button className="modal-close-btn" onClick={() => setNewJobModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleCreateJobSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Job Title / Description</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 5,000 Copies Brochure"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Select Client</label>
                  <select
                    className="form-select"
                    value={jobClientId}
                    onChange={(e) => setJobClientId(e.target.value)}
                  >
                    {appData.clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Job Type</label>
                  <select className="form-select" value={jobType} onChange={(e) => setJobType(e.target.value)}>
                    <option value="Flyer">Flyer / Leaflet</option>
                    <option value="Booklet / Catalog">Booklet / Catalog</option>
                    <option value="Hardcover Book">Hardcover Book</option>
                    <option value="Packaging Box">Packaging Box</option>
                    <option value="Business Cards">Business Cards</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Paper Stock</label>
                  <input
                    type="text"
                    className="form-control"
                    value={jobPaper}
                    onChange={(e) => setJobPaper(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Finished Cut Size</label>
                  <input
                    type="text"
                    className="form-control"
                    value={jobFinishedSize}
                    onChange={(e) => setJobFinishedSize(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Quantity (pcs)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={jobQuantity}
                    onChange={(e) => setJobQuantity(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Total Job Cost ({appData.settings.currency})</label>
                  <input
                    type="number"
                    className="form-control"
                    value={jobCost}
                    onChange={(e) => setJobCost(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Target Delivery Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={jobDeliveryDate}
                    onChange={(e) => setJobDeliveryDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Press Operator Line & Special Instructions</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={jobNotes}
                  onChange={(e) => setJobNotes(e.target.value)}
                  placeholder="e.g. Gloss lamination on cover. 4/4 CMYK printing."
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setNewJobModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Job Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Client Modal */}
      {newClientModalOpen && (
        <div className="modal-overlay" onClick={() => setNewClientModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Client Account</h3>
              <button className="modal-close-btn" onClick={() => setNewClientModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleCreateClientSubmit}>
              <div className="form-group">
                <label>Company / Client Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Acme Corporation"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Contact Person</label>
                  <input
                    type="text"
                    className="form-control"
                    value={clientContact}
                    onChange={(e) => setClientContact(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Billing Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setNewClientModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Client Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Document Modal (Ticket, Invoice, Statement) */}
      {printModalState.open && (
        <PrintModal
          type={printModalState.type}
          data={printModalState.data}
          settings={appData.settings}
          onClose={() => setPrintModalState({ open: false, type: null, data: null })}
        />
      )}
    </div>
  );
}

export default App;
