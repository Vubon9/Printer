import React, { useState } from 'react';
import {
  Plus,
  AlertTriangle,
  Search,
  CheckCircle,
  PlusCircle,
  Download
} from 'lucide-react';
import { exportToCSV } from '../utils/csvExport';

export default function Inventory({
  inventory,
  currency,
  onUpdateStock,
  onAddInventoryItem,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [restockModalItem, setRestockModalItem] = useState(null);
  const [restockQty, setRestockQty] = useState('');

  const [newItemModalOpen, setNewItemModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Paper');
  const [newItemStock, setNewItemStock] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('Reams');
  const [newItemMinStock, setNewItemMinStock] = useState('10');
  const [newItemUnitPrice, setNewItemUnitPrice] = useState('120');

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleRestockSubmit = (e) => {
    e.preventDefault();
    if (!restockModalItem || !restockQty || Number(restockQty) <= 0) return;
    onUpdateStock(restockModalItem.id, Number(restockQty));
    setRestockModalItem(null);
    setRestockQty('');
  };

  const handleNewItemSubmit = (e) => {
    e.preventDefault();
    if (!newItemName) return;

    onAddInventoryItem({
      id: `INV-${Date.now().toString().slice(-4)}`,
      name: newItemName,
      category: newItemCategory,
      stock: Number(newItemStock) || 0,
      unit: newItemUnit,
      minStock: Number(newItemMinStock) || 5,
      unitPrice: Number(newItemUnitPrice) || 0,
    });

    setNewItemModalOpen(false);
    setNewItemName('');
    setNewItemStock('');
  };

  return (
    <div className="inventory-view">
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
              placeholder="Search paper, ink, plates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            style={{ width: '160px' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Paper">Paper Sheets / Reams</option>
            <option value="Ink">Process Inks</option>
            <option value="Plates">CTP Plates</option>
            <option value="Supplies">Binding & Film</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() =>
              exportToCSV('press_inventory', filteredInventory, {
                id: 'Item ID',
                name: 'Description',
                category: 'Category',
                stock: 'Current Stock',
                unit: 'Unit',
                minStock: 'Min Threshold',
                unitPrice: 'Unit Price'
              })
            }
          >
            <Download size={16} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setNewItemModalOpen(true)}>
            <Plus size={18} /> Add Stock Item
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="glass-panel" style={{ padding: '1rem' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Min Re-order Level</th>
                <th>Est. Unit Price</th>
                <th>Stock Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No inventory stock items found.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const isLow = item.stock <= item.minStock;
                  return (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600 }}>{item.name}</td>
                      <td>
                        <span className="badge badge-neutral">{item.category}</span>
                      </td>
                      <td style={{ fontSize: '1rem', fontWeight: 800 }}>
                        {item.stock} {item.unit}
                      </td>
                      <td>{item.minStock} {item.unit}</td>
                      <td>{currency}{item.unitPrice} / {item.unit}</td>
                      <td>
                        {isLow ? (
                          <span className="badge badge-danger">
                            <AlertTriangle size={12} /> Low Stock
                          </span>
                        ) : (
                          <span className="badge badge-success">
                            <CheckCircle size={12} /> In Stock
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            setRestockModalItem(item);
                            setRestockQty(10);
                          }}
                        >
                          <PlusCircle size={14} /> Restock
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      {restockModalItem && (
        <div className="modal-overlay" onClick={() => setRestockModalItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Restock Item: {restockModalItem.name}</h3>
              <button className="modal-close-btn" onClick={() => setRestockModalItem(null)}>×</button>
            </div>

            <form onSubmit={handleRestockSubmit}>
              <div className="form-group">
                <label>Current Stock</label>
                <input
                  type="text"
                  className="form-control"
                  value={`${restockModalItem.stock} ${restockModalItem.unit}`}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Quantity to Add ({restockModalItem.unit})</label>
                <input
                  type="number"
                  className="form-control"
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  min="1"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setRestockModalItem(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Inventory Item Modal */}
      {newItemModalOpen && (
        <div className="modal-overlay" onClick={() => setNewItemModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Stock Item</h3>
              <button className="modal-close-btn" onClick={() => setNewItemModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleNewItemSubmit}>
              <div className="form-group">
                <label>Stock Item Name & Specifications</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 150gsm Matte Art Paper (25x37)"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-select"
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                  >
                    <option value="Paper">Paper Sheets / Reams</option>
                    <option value="Ink">Process Inks</option>
                    <option value="Plates">CTP Plates</option>
                    <option value="Supplies">Binding & Film</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Unit of Measure</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Reams, Cans, Plates, Rolls"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Initial Stock Qty</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newItemStock}
                    onChange={(e) => setNewItemStock(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Min Stock Level</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newItemMinStock}
                    onChange={(e) => setNewItemMinStock(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Unit Price ({currency})</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newItemUnitPrice}
                    onChange={(e) => setNewItemUnitPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setNewItemModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Stock Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
