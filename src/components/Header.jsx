import React from 'react';
import { Sun, Moon, Plus, Calculator, UserPlus, Printer } from 'lucide-react';

const TAB_TITLES = {
  dashboard: 'Press Executive Dashboard',
  estimator: 'Print Job Cost Estimator & Quote Generator',
  jobs: 'Job Orders & Production Pipeline',
  clients: 'Client Accounts & Debit/Credit Ledger',
  invoices: 'Invoices & Billing Receipts',
  inventory: 'Paper, Ink & Material Inventory',
  ledger: 'General Ledger & Financial Statements',
  settings: 'Press Configuration & Default Rates',
};

export default function Header({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  onOpenNewJob,
  onOpenNewClient,
}) {
  return (
    <header className="top-header no-print">
      <div className="header-left">
        <h1 className="page-heading-title">{TAB_TITLES[activeTab] || 'Dashboard'}</h1>
      </div>

      <div className="header-right">
        {activeTab !== 'estimator' && (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setActiveTab('estimator')}
          >
            <Calculator size={16} />
            <span>Quick Quote</span>
          </button>
        )}

        <button className="btn btn-secondary btn-sm" onClick={onOpenNewClient}>
          <UserPlus size={16} />
          <span>New Client</span>
        </button>

        <button className="btn btn-primary btn-sm" onClick={onOpenNewJob}>
          <Plus size={16} />
          <span>New Job Order</span>
        </button>

        <button
          className="theme-toggle-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
