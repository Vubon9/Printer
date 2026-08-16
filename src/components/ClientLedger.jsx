import React, { useState } from 'react';
import {
  Search,
  Plus,
  CreditCard,
  Phone,
  Mail,
  Printer,
  User
} from 'lucide-react';

export default function ClientLedger({
  clients,
  invoices,
  ledger,
  currency,
  onOpenNewClient,
  onRecordPayment,
  onOpenClientStatement,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(clients[0] || null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer'); // Cash, Bank Transfer, Cheque, Mobile Banking
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('Account ledger settlement');

  const [dueOnlyFilter, setDueOnlyFilter] = useState(false);

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDue = !dueOnlyFilter || c.balance > 0;
    return matchesSearch && matchesDue;
  });

  const activeClientInvoices = invoices.filter(
    (inv) => selectedClient && inv.clientId === selectedClient.id
  );

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!selectedClient || !paymentAmount || Number(paymentAmount) <= 0) return;

    onRecordPayment({
      clientId: selectedClient.id,
      amount: Number(paymentAmount),
      method: paymentMethod,
      reference: paymentRef || `PAY-${Date.now().toString().slice(-6)}`,
      notes: paymentNotes,
      date: new Date().toISOString().split('T')[0],
    });

    setPaymentAmount('');
    setPaymentRef('');
    setPaymentModalOpen(false);
  };

  return (
    <div className="client-ledger-view">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        {/* Left Column: Client List */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem' }}>Clients & Accounts</h2>
            <button className="btn btn-primary btn-sm" onClick={onOpenNewClient}>
              <Plus size={16} /> New Client
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <button
              className={`btn btn-sm ${!dueOnlyFilter ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDueOnlyFilter(false)}
              style={{ flexGrow: 1 }}
            >
              All Clients
            </button>
            <button
              className={`btn btn-sm ${dueOnlyFilter ? 'btn-danger' : 'btn-secondary'}`}
              onClick={() => setDueOnlyFilter(true)}
              style={{ flexGrow: 1 }}
            >
              Due Only ({clients.filter((c) => c.balance > 0).length})
            </button>
          </div>

          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2rem', fontSize: '0.85rem' }}
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '600px', overflowY: 'auto' }}>
            {filteredClients.map((client) => {
              const isSelected = selectedClient?.id === client.id;
              return (
                <div
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'var(--accent-gradient)' : 'var(--bg-secondary)',
                    color: isSelected ? '#ffffff' : 'var(--text-primary)',
                    cursor: 'pointer',
                    border: '1px solid var(--border-color)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{client.name}</div>
                  <div style={{ fontSize: '0.75rem', opacity: isSelected ? 0.9 : 0.7, marginTop: '0.2rem' }}>
                    {client.contactPerson} • {client.phone}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.8rem' }}>
                    <span>Balance Due:</span>
                    <strong style={{ color: isSelected ? '#fff' : client.balance > 0 ? 'var(--danger)' : 'var(--success)' }}>
                      {currency}{client.balance?.toLocaleString()}
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Client Ledger Detail */}
        {selectedClient ? (
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--accent-primary)' }}>{selectedClient.name}</h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '1.5rem', marginTop: '0.35rem' }}>
                  <span><User size={14} style={{ verticalAlign: 'middle' }} /> {selectedClient.contactPerson}</span>
                  <span><Phone size={14} style={{ verticalAlign: 'middle' }} /> {selectedClient.phone}</span>
                  <span><Mail size={14} style={{ verticalAlign: 'middle' }} /> {selectedClient.email}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => onOpenClientStatement(selectedClient)}
                >
                  <Printer size={16} /> Statement
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setPaymentModalOpen(true)}
                >
                  <CreditCard size={16} /> Record Payment
                </button>
              </div>
            </div>

            {/* Financial Summary Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="glass-card">
                <div className="kpi-title">Total Billed</div>
                <div className="kpi-value">{currency}{selectedClient.totalBilled?.toLocaleString()}</div>
              </div>
              <div className="glass-card">
                <div className="kpi-title">Total Received</div>
                <div className="kpi-value" style={{ color: 'var(--success)' }}>{currency}{selectedClient.totalPaid?.toLocaleString()}</div>
              </div>
              <div className="glass-card">
                <div className="kpi-title">Outstanding Credit</div>
                <div className="kpi-value" style={{ color: selectedClient.balance > 0 ? 'var(--warning)' : 'var(--success)' }}>
                  {currency}{selectedClient.balance?.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Invoices & Receipts Ledger Table */}
            <h3 style={{ fontSize: '1rem', marginBottom: '0.85rem' }}>Account Invoices & Payment Ledger</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice No</th>
                    <th>Date</th>
                    <th>Job Order #</th>
                    <th>Total Amount</th>
                    <th>Paid Amount</th>
                    <th>Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeClientInvoices.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No billing transactions found for this client.
                      </td>
                    </tr>
                  ) : (
                    activeClientInvoices.map((inv) => (
                      <tr key={inv.id}>
                        <td className="mono" style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{inv.id}</td>
                        <td>{inv.invoiceDate}</td>
                        <td className="mono">{inv.jobNo}</td>
                        <td>{currency}{inv.total?.toLocaleString()}</td>
                        <td style={{ color: 'var(--success)' }}>{currency}{inv.paidAmount?.toLocaleString()}</td>
                        <td style={{ fontWeight: 700, color: inv.balance > 0 ? 'var(--warning)' : 'var(--success)' }}>
                          {currency}{inv.balance?.toLocaleString()}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              inv.status === 'Paid'
                                ? 'badge-success'
                                : inv.status === 'Partial'
                                ? 'badge-warning'
                                : 'badge-danger'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Select a client from the left menu to view account ledger details.
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {paymentModalOpen && (
        <div className="modal-overlay" onClick={() => setPaymentModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Record Client Payment - {selectedClient?.name}</h3>
              <button className="modal-close-btn" onClick={() => setPaymentModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handlePaymentSubmit}>
              <div className="form-group">
                <label>Current Outstanding Balance</label>
                <input
                  type="text"
                  className="form-control mono"
                  value={`${currency}${selectedClient?.balance?.toLocaleString()}`}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Payment Amount Received ({currency})</label>
                <input
                  type="number"
                  className="form-control"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="e.g. 500"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="Cash">Cash Payment</option>
                    <option value="Bank Transfer">Bank Wire / EFT</option>
                    <option value="Cheque">Bank Cheque</option>
                    <option value="Mobile Banking">Mobile Money / Card</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Reference / Cheque #</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. CHQ-9921"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes / Ledger Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setPaymentModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Record & Update Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
