import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  DollarSign,
  PieChart
} from 'lucide-react';

export default function GeneralLedger({
  ledger,
  currency,
  onAddLedgerEntry,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [entryType, setEntryType] = useState('Expense'); // Income | Expense
  const [category, setCategory] = useState('Material Purchase');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredEntries = ledger.filter((item) => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalIncome = ledger
    .filter((l) => l.type === 'Income')
    .reduce((acc, l) => acc + Number(l.amount || 0), 0);

  const totalExpenses = ledger
    .filter((l) => l.type === 'Expense')
    .reduce((acc, l) => acc + Number(l.amount || 0), 0);

  const netProfit = totalIncome - totalExpenses;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || Number(amount) <= 0) return;

    onAddLedgerEntry({
      id: `LED-${Date.now().toString().slice(-4)}`,
      date,
      type: entryType,
      category,
      description,
      amount: Number(amount),
      reference: reference || `REF-${Date.now().toString().slice(-4)}`,
    });

    setModalOpen(false);
    setDescription('');
    setAmount('');
    setReference('');
  };

  return (
    <div className="general-ledger-view">
      {/* Profit & Loss Summary Row */}
      <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card">
          <div className="kpi-title">Total Ledger Income</div>
          <div className="kpi-value" style={{ color: 'var(--success)' }}>
            {currency}{totalIncome.toLocaleString()}
          </div>
          <div className="kpi-sub">
            <ArrowUpRight size={14} style={{ verticalAlign: 'middle' }} /> Recorded Inflows
          </div>
        </div>

        <div className="glass-card">
          <div className="kpi-title">Total Factory Expenses</div>
          <div className="kpi-value" style={{ color: 'var(--danger)' }}>
            {currency}{totalExpenses.toLocaleString()}
          </div>
          <div className="kpi-sub">
            <ArrowDownRight size={14} style={{ verticalAlign: 'middle' }} /> Outflows & Operations
          </div>
        </div>

        <div className="glass-card">
          <div className="kpi-title">Net Operating Profit / (Loss)</div>
          <div className="kpi-value" style={{ color: netProfit >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {currency}{netProfit.toLocaleString()}
          </div>
          <div className="kpi-sub">
            {netProfit >= 0 ? 'Profit Margin Intact' : 'Warning: Negative Cashflow'}
          </div>
        </div>
      </div>

      {/* Toolbar */}
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
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
              placeholder="Search ledger entries, ref #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            style={{ width: '160px' }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Entries</option>
            <option value="Income">Income Only</option>
            <option value="Expense">Expense Only</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={18} /> Record Entry
        </button>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ padding: '1rem' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th>Reference #</th>
                <th>Amount ({currency})</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No ledger transaction entries found.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>
                      <span
                        className={`badge ${
                          item.type === 'Income' ? 'badge-success' : 'badge-danger'
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td><span className="badge badge-neutral">{item.category}</span></td>
                    <td style={{ fontWeight: 600 }}>{item.description}</td>
                    <td className="mono" style={{ fontSize: '0.85rem' }}>{item.reference || '-'}</td>
                    <td
                      style={{
                        fontWeight: 700,
                        color: item.type === 'Income' ? 'var(--success)' : 'var(--danger)'
                      }}
                    >
                      {item.type === 'Income' ? '+' : '-'}{currency}{item.amount?.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Entry Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Record General Ledger Entry</h3>
              <button className="modal-close-btn" onClick={() => setModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Entry Type</label>
                  <select
                    className="form-select"
                    value={entryType}
                    onChange={(e) => {
                      setEntryType(e.target.value);
                      setCategory(e.target.value === 'Income' ? 'Job Payment' : 'Material Purchase');
                    }}
                  >
                    <option value="Expense">Expense (Money Out)</option>
                    <option value="Income">Income (Money In)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Transaction Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {entryType === 'Expense' ? (
                    <>
                      <option value="Material Purchase">Material & Paper Purchase</option>
                      <option value="Utilities">Electricity & Factory Utilities</option>
                      <option value="Maintenance">Machine Maintenance & Tuning</option>
                      <option value="Wages">Operator & Staff Wages</option>
                      <option value="Rent">Factory / Office Rent</option>
                      <option value="Miscellaneous">Miscellaneous Expense</option>
                    </>
                  ) : (
                    <>
                      <option value="Job Payment">Client Job Payment</option>
                      <option value="Advance Deposit">Advance Job Deposit</option>
                      <option value="Scrap Sale">Waste Paper & Plate Scrap Sale</option>
                      <option value="Other Income">Other Income</option>
                    </>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Electricity bill for Press Factory"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Amount ({currency})</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 450"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Reference # / Receipt No</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. BILL-991"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Ledger Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
