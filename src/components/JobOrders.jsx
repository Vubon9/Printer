import React, { useState } from 'react';
import {
  Kanban,
  List,
  Search,
  Plus,
  ArrowRight,
  FileText,
  Trash2,
  Calendar,
  Download,
  Truck
} from 'lucide-react';
import { exportToCSV } from '../utils/csvExport';

const STAGES = [
  'Pre-Press',
  'Plate Making',
  'Printing',
  'Finishing',
  'QC',
  'Ready',
  'Delivered'
];

export default function JobOrders({
  jobs,
  currency,
  onUpdateJobStage,
  onOpenPrintTicket,
  onOpenChallanTicket,
  onOpenNewJob,
  onDeleteJob
}) {
  const [viewMode, setViewMode] = useState('kanban'); // kanban | list
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.jobNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || job.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="job-orders-view">
      {/* Top Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Search bar */}
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
              placeholder="Search jobs, clients, job #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            style={{ width: '180px' }}
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
          >
            <option value="all">All Stages</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() =>
              exportToCSV('press_job_orders', filteredJobs, {
                jobNo: 'Job No',
                title: 'Title',
                clientName: 'Client',
                paper: 'Paper Stock',
                finishedSize: 'Finished Size',
                quantity: 'Quantity',
                totalCost: 'Amount',
                stage: 'Stage',
                deliveryDate: 'Delivery Date'
              })
            }
          >
            <Download size={16} /> Export CSV
          </button>

          {/* View Toggle */}
          <div className="glass-panel" style={{ padding: '0.25rem', display: 'flex', gap: '0.25rem' }}>
            <button
              className={`btn btn-sm ${viewMode === 'kanban' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('kanban')}
            >
              <Kanban size={16} />
              <span>Kanban</span>
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
              <span>Table View</span>
            </button>
          </div>

          <button className="btn btn-primary" onClick={onOpenNewJob}>
            <Plus size={18} />
            <span>New Job Order</span>
          </button>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="kanban-board">
          {STAGES.map((stage) => {
            const stageJobs = filteredJobs.filter((j) => j.stage === stage);
            return (
              <div key={stage} className="kanban-column">
                <div className="kanban-col-header">
                  <span>{stage}</span>
                  <span className="kanban-col-count">{stageJobs.length}</span>
                </div>

                <div style={{ flexGrow: 1, overflowY: 'auto' }}>
                  {stageJobs.length === 0 ? (
                    <div
                      style={{
                        padding: '1.5rem 0.5rem',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem'
                      }}
                    >
                      No jobs in {stage}
                    </div>
                  ) : (
                    stageJobs.map((job) => (
                      <div key={job.id} className="job-card">
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '0.35rem'
                          }}
                        >
                          <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                            {job.jobNo}
                          </span>
                          <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>
                            {currency}{job.totalCost?.toLocaleString()}
                          </span>
                        </div>

                        <div className="job-card-title">{job.title}</div>
                        <div className="job-card-client">{job.clientName}</div>

                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)',
                            background: 'var(--bg-secondary)',
                            padding: '0.4rem',
                            borderRadius: 'var(--radius-sm)',
                            marginBottom: '0.75rem'
                          }}
                        >
                          <div><strong>Qty:</strong> {job.quantity?.toLocaleString()} pcs</div>
                          <div><strong>Paper:</strong> {job.paper}</div>
                        </div>

                        <div className="job-card-footer">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Calendar size={12} />
                            <span>Due: {job.deliveryDate}</span>
                          </div>

                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button
                              className="btn btn-outline btn-sm"
                              style={{ padding: '0.15rem 0.4rem' }}
                              onClick={() => onOpenPrintTicket(job)}
                              title="Print Job Ticket"
                            >
                              <FileText size={14} />
                            </button>

                            <button
                              className="btn btn-outline btn-sm"
                              style={{ padding: '0.15rem 0.4rem' }}
                              onClick={() => onOpenChallanTicket && onOpenChallanTicket(job)}
                              title="Print Delivery Challan"
                            >
                              <Truck size={14} />
                            </button>

                            {/* Stage Move Forward */}
                            {stage !== 'Delivered' && (
                              <button
                                className="btn btn-primary btn-sm"
                                style={{ padding: '0.15rem 0.4rem' }}
                                onClick={() => {
                                  const idx = STAGES.indexOf(stage);
                                  if (idx < STAGES.length - 1) {
                                    onUpdateJobStage(job.id, STAGES[idx + 1]);
                                  }
                                }}
                                title="Move to Next Stage"
                              >
                                <ArrowRight size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table List View */}
      {viewMode === 'list' && (
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job No</th>
                  <th>Job Title</th>
                  <th>Client</th>
                  <th>Paper & Size</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Stage</th>
                  <th>Delivery</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      No job orders found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr key={job.id}>
                      <td className="mono" style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                        {job.jobNo}
                      </td>
                      <td style={{ fontWeight: 600 }}>{job.title}</td>
                      <td>{job.clientName}</td>
                      <td style={{ fontSize: '0.8rem' }}>{job.paper} ({job.finishedSize})</td>
                      <td>{job.quantity?.toLocaleString()} pcs</td>
                      <td style={{ fontWeight: 700 }}>{currency}{job.totalCost?.toLocaleString()}</td>
                      <td>
                        <select
                          className="form-select"
                          style={{ padding: '0.2rem 0.4rem', fontSize: '0.8rem' }}
                          value={job.stage}
                          onChange={(e) => onUpdateJobStage(job.id, e.target.value)}
                        >
                          {STAGES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{job.deliveryDate}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => onOpenPrintTicket(job)}
                            title="Job Ticket"
                          >
                            <FileText size={14} /> Ticket
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => onDeleteJob(job.id)}
                            title="Delete"
                          >
                            <Trash2 size={14} />
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
      )}
    </div>
  );
}
