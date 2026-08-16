import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Clock,
  PackageX,
  Printer,
  FileCheck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function Dashboard({
  jobs,
  clients,
  invoices,
  inventory,
  ledger,
  currency,
  setActiveTab,
  onSelectJob,
}) {
  // Calculations
  const totalBilled = invoices.reduce((acc, inv) => acc + (inv.total || 0), 0);
  const totalReceived = invoices.reduce((acc, inv) => acc + (inv.paidAmount || 0), 0);
  const pendingReceivables = clients.reduce((acc, c) => acc + (c.balance || 0), 0);

  const activeJobs = jobs.filter((j) => j.stage !== 'Delivered');

  const totalIncome = ledger
    .filter((l) => l.type === 'Income')
    .reduce((acc, l) => acc + Number(l.amount || 0), 0);

  const totalExpenses = ledger
    .filter((l) => l.type === 'Expense')
    .reduce((acc, l) => acc + Number(l.amount || 0), 0);

  const netProfit = totalIncome - totalExpenses;

  const lowStockItems = inventory.filter((item) => item.stock <= item.minStock);

  return (
    <div className="dashboard-view">
      {/* KPI Cards */}
      <div className="dashboard-grid">
        <div className="glass-card kpi-card">
          <div className="kpi-icon-wrapper" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div className="kpi-title">Total Revenue Billed</div>
            <div className="kpi-value">{currency}{totalBilled.toLocaleString()}</div>
            <div className="kpi-sub" style={{ color: 'var(--success)' }}>
              <ArrowUpRight size={14} style={{ verticalAlign: 'middle' }} /> Paid: {currency}{totalReceived.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-icon-wrapper" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="kpi-title">Pending Receivables</div>
            <div className="kpi-value">{currency}{pendingReceivables.toLocaleString()}</div>
            <div className="kpi-sub">Across {clients.filter(c => c.balance > 0).length} client accounts</div>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-icon-wrapper" style={{ background: 'linear-gradient(135deg, #0ea5e9, #2563eb)' }}>
            <Printer size={24} />
          </div>
          <div>
            <div className="kpi-title">Active Job Orders</div>
            <div className="kpi-value">{activeJobs.length} Jobs</div>
            <div className="kpi-sub">{jobs.length} total orders recorded</div>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-icon-wrapper" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="kpi-title">Net Ledger Profit</div>
            <div className="kpi-value">{currency}{netProfit.toLocaleString()}</div>
            <div className="kpi-sub">
              {netProfit >= 0 ? (
                <span style={{ color: 'var(--success)' }}>
                  <ArrowUpRight size={14} style={{ verticalAlign: 'middle' }} /> Net Positive
                </span>
              ) : (
                <span style={{ color: 'var(--danger)' }}>
                  <ArrowDownRight size={14} style={{ verticalAlign: 'middle' }} /> Loss
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Active Pipeline & Financial Overview */}
      <div className="charts-row">
        {/* Active Production Jobs */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div className="chart-card-title">
            <span><Printer size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Jobs In Production</span>
            <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('jobs')}>
              View All Pipeline
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job No</th>
                  <th>Title & Client</th>
                  <th>Quantity & Paper</th>
                  <th>Stage</th>
                  <th>Delivery</th>
                </tr>
              </thead>
              <tbody>
                {activeJobs.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      No active jobs in production.
                    </td>
                  </tr>
                ) : (
                  activeJobs.map((job) => (
                    <tr key={job.id} onClick={() => onSelectJob(job)} style={{ cursor: 'pointer' }}>
                      <td className="mono" style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                        {job.jobNo}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{job.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{job.clientName}</div>
                      </td>
                      <td>
                        <div>{job.quantity.toLocaleString()} pcs</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{job.paper}</div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            job.stage === 'Printing'
                              ? 'badge-info'
                              : job.stage === 'Finishing'
                              ? 'badge-warning'
                              : job.stage === 'Pre-Press' || job.stage === 'Plate Making'
                              ? 'badge-neutral'
                              : 'badge-success'
                          }`}
                        >
                          {job.stage}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{job.deliveryDate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock & Inventory Alerts */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div className="chart-card-title">
            <span>
              <AlertTriangle size={18} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--warning)' }} />
              Stock Re-order Alerts
            </span>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('inventory')}>
              Manage Stock
            </button>
          </div>

          {lowStockItems.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <FileCheck size={36} style={{ color: 'var(--success)', marginBottom: '0.5rem' }} />
              <p>All paper and ink inventory levels are healthy!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--danger-bg)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyConstraint: 'space-between'
                  }}
                >
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>
                      Current Stock: <strong>{item.stock} {item.unit}</strong> (Min Threshold: {item.minStock})
                    </div>
                  </div>
                  <span className="badge badge-danger">Low</span>
                </div>
              ))}
            </div>
          )}

          {/* Quick Stats Summary */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              <span>Total Financial Ledger Income</span>
              <strong style={{ color: 'var(--success)' }}>{currency}{totalIncome.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span>Total Factory Expenses</span>
              <strong style={{ color: 'var(--danger)' }}>{currency}{totalExpenses.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
