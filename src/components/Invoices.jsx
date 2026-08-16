import React, { useState } from 'react';
import {
  Search,
  Printer,
  Download,
  CreditCard,
  CheckCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { exportToCSV } from '../utils/csvExport';

export default function Invoices({
  invoices,
  currency,
  onOpenInvoiceModal,
  onPayDue
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all | due | paid

  const totalBilled = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const totalDue = invoices.reduce((sum, inv) => sum + (inv.balance || 0), 0);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.jobNo?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === 'due') {
      matchesStatus = inv.balance > 0;
    } else if (statusFilter === 'paid') {
      matchesStatus = inv.status === 'Paid';
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="invoices-view">
      {/* Top Financial Summary Cards */}
      <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card">
          <div className="kpi-title">Total Billed Invoices</div>
          <div className="kpi-value">{currency}{totalBilled.toLocaleString()}</div>
          <div className="kpi-sub">{invoices.length} Invoices Issued</div>
        </div>

        <div className="glass-card">
          <div className="kpi-title">Total Paid Amount</div>
          <div className="kpi-value" style={{ color: 'var(--success)' }}>
            {currency}{totalPaid.toLocaleString()}
          </div>
          <div className="kpi-sub" style={{ color: 'var(--success)' }}>
            <CheckCircle size={14} style={{ verticalAlign: 'middle' }} /> Settled Receipts
          </div>
        </div>

        <div className="glass-card" style={{ border: totalDue > 0 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-color)' }}>
          <div className="kpi-title">Total Outstanding Due</div>
          <div className="kpi-value" style={{ color: totalDue > 0 ? 'var(--danger)' : 'var(--success)' }}>
            {currency}{totalDue.toLocaleString()}
          </div>
          <div className="kpi-sub" style={{ color: totalDue > 0 ? 'var(--danger)' : 'var(--success)' }}>
            <AlertCircle size={14} style={{ verticalAlign: 'middle' }} /> {invoices.filter(i => i.balance > 0).length} Invoices Pending Payment
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search
              size={16}
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
              style={{ paddingLeft: '2.2rem' }}
              placeholder="Search invoice #, client, job #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Quick Pay / Due Filter Buttons */}
          <div className="glass-panel" style={{ padding: '0.25rem', display: 'flex', gap: '0.25rem' }}>
            <button
              className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('all')}
            >
              All Invoices
            </button>
            <button
              className={`btn btn-sm ${statusFilter === 'due' ? 'btn-danger' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('due')}
            >
              <AlertCircle size={14} /> Due Only ({invoices.filter(i => i.balance > 0).length})
            </button>
            <button
              className={`btn btn-sm ${statusFilter === 'paid' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('paid')}
            >
              <CheckCircle size={14} /> Paid Only
            </button>
          </div>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() =>
            exportToCSV('press_invoices', filteredInvoices, {
              id: 'Invoice No',
              jobNo: 'Job Ref',
              clientName: 'Client',
              invoiceDate: 'Date',
              dueDate: 'Due Date',
              total: 'Total Amount',
              paidAmount: 'Paid Amount',
              balance: 'Balance Due',
              status: 'Status'
            })
          }
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1rem' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Job Order #</th>
                <th>Client Name</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th>Total Amount</th>
                <th>Amount Paid</th>
                <th>Balance Due</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No invoices found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                      {inv.id}
                    </td>
                    <td className="mono">{inv.jobNo || '-'}</td>
                    <td style={{ fontWeight: 600 }}>{inv.clientName}</td>
                    <td>{inv.invoiceDate}</td>
                    <td>{inv.dueDate}</td>
                    <td style={{ fontWeight: 700 }}>{currency}{inv.total?.toLocaleString()}</td>
                    <td style={{ color: 'var(--success)' }}>{currency}{inv.paidAmount?.toLocaleString()}</td>
                    <td style={{ fontWeight: 700, color: inv.balance > 0 ? 'var(--danger)' : 'var(--success)' }}>
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
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {inv.balance > 0 && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => onPayDue && onPayDue(inv)}
                          >
                            <CreditCard size={14} /> Pay Due
                          </button>
                        )}
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => onOpenInvoiceModal(inv)}
                        >
                          <Printer size={14} /> Print
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
    </div>
  );
}
