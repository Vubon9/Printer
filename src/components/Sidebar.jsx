import React from 'react';
import {
  LayoutDashboard,
  Calculator,
  Printer,
  Users,
  FileText,
  Package,
  BookOpen,
  Settings,
  Layers
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'estimator', label: 'Print Estimator', icon: Calculator },
  { id: 'jobs', label: 'Job Orders', icon: Printer },
  { id: 'clients', label: 'Client Accounts', icon: Users },
  { id: 'invoices', label: 'Invoices & Billing', icon: FileText },
  { id: 'inventory', label: 'Paper & Inventory', icon: Package },
  { id: 'ledger', label: 'General Ledger', icon: BookOpen },
  { id: 'settings', label: 'Press Settings', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, companyName }) {
  return (
    <aside className="sidebar no-print">
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <Layers size={24} />
        </div>
        <div>
          <div className="sidebar-title">Press Ledger</div>
          <div className="sidebar-subtitle">{companyName || 'Print Management'}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <span>Press Ledger v2.4</span>
        <span className="badge badge-success">Online</span>
      </div>
    </aside>
  );
}
