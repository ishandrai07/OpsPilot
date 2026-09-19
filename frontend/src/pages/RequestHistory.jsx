import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import RequestTable from '../components/RequestTable';
import API from '../api/axios';
import { Search, Filter } from 'lucide-react';

const STATUS_FILTERS = [
  { id: 'all', label: 'All Status' },
  { id: 'pending', label: 'Pending' },
  { id: 'processing', label: 'Processing' },
  { id: 'resolved', label: 'Auto Resolved' },
  { id: 'escalated', label: 'Human Review' },
];

const DEPT_FILTERS = [
  { id: 'all', label: 'All Departments' },
  { id: 'HR', label: 'HR' },
  { id: 'IT', label: 'IT' },
  { id: 'Finance', label: 'Finance' },
  { id: 'General', label: 'General' },
];

const RequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await API.get('/requests');
        setRequests(data);
        setFiltered(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  useEffect(() => {
    let result = [...requests];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter((r) => r.status === statusFilter);
    }
    if (deptFilter !== 'all') {
      result = result.filter((r) => r.aiAnalysis?.department === deptFilter);
    }
    setFiltered(result);
  }, [search, statusFilter, deptFilter, requests]);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Operations Requests" />
        <main className="page-body">
          {/* Header */}
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              All Operations Requests
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
              Complete ledger of submitted requests, policy evaluations, and automated agent decisions.
            </p>
          </div>

          {/* Controls Bar */}
          <div className="enterprise-card" style={{ padding: '16px 20px', marginBottom: 20 }}>
            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                placeholder="Search requests by title, keyword, or context..."
                style={{ paddingLeft: 34 }}
              />
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: 2 }}>
                  Status:
                </span>
                {STATUS_FILTERS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStatusFilter(s.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: statusFilter === s.id ? '1px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: statusFilter === s.id ? 'rgba(45, 212, 191, 0.08)' : 'var(--bg-sidebar)',
                      color: statusFilter === s.id ? 'var(--primary)' : 'var(--text-secondary)',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div style={{ height: 16, width: 1, backgroundColor: 'var(--border)' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: 2 }}>
                  Dept:
                </span>
                {DEPT_FILTERS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDeptFilter(d.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: deptFilter === d.id ? '1px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: deptFilter === d.id ? 'rgba(45, 212, 191, 0.08)' : 'var(--bg-sidebar)',
                      color: deptFilter === d.id ? 'var(--primary)' : 'var(--text-secondary)',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results count & Table */}
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
            Showing {filtered.length} of {requests.length} records
          </div>

          <RequestTable requests={filtered} loading={loading} />
        </main>
      </div>
    </div>
  );
};

export default RequestHistory;
