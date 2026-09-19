import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import DepartmentBadge from '../components/DepartmentBadge';
import API from '../api/axios';
import { toast } from 'react-hot-toast';
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Users,
  Search,
  ChevronRight,
  Clock,
  Cpu,
} from 'lucide-react';

const STATUS_OPTIONS = ['pending', 'processing', 'resolved', 'escalated'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const [statsRes, reqRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/requests', { params }),
      ]);
      setStats(statsRes.data);
      setRequests(reqRes.data.requests);
    } catch (err) {
      toast.error('Failed to load operations management data');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await API.patch(`/admin/requests/${id}/status`, { status });
      toast.success(`Request status set to ${status}`);
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = search.trim()
    ? requests.filter(
        (r) =>
          r.title?.toLowerCase().includes(search.toLowerCase()) ||
          r.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
          r.userId?.email?.toLowerCase().includes(search.toLowerCase())
      )
    : requests;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const adminStatCards = [
    {
      icon: Shield,
      label: 'All Operations Requests',
      value: stats?.total ?? 0,
      subtitle: 'Platform-wide submissions',
      accentColor: 'var(--text-primary)',
    },
    {
      icon: CheckCircle,
      label: 'AI Resolved',
      value: stats?.resolved ?? 0,
      subtitle: 'Direct policy auto-approvals',
      accentColor: 'var(--success)',
    },
    {
      icon: AlertTriangle,
      label: 'Escalations / Human Review',
      value: stats?.escalated ?? 0,
      subtitle: 'Manager review queue',
      accentColor: 'var(--warning)',
    },
    {
      icon: Users,
      label: 'Active Operators',
      value: stats?.users ?? 0,
      subtitle: 'Registered employees',
      accentColor: 'var(--info)',
    },
  ];

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Admin Operations Console" />
        <main className="page-body">
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
              Operations Management & Oversight
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
              Manage policy routing, evaluate escalations, and override agent decisions.
            </p>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginBottom: 28,
          }}>
            {adminStatCards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>

          {/* Filter & Search Bar */}
          <div className="enterprise-card" style={{ padding: '16px 20px', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
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
                  placeholder="Filter by title, operator name, or email..."
                  style={{ paddingLeft: 34 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: 4 }}>
                  Status:
                </span>
                {['', 'pending', 'processing', 'resolved', 'escalated'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: statusFilter === s ? '1px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: statusFilter === s ? 'rgba(45, 212, 191, 0.08)' : 'var(--bg-sidebar)',
                      color: statusFilter === s ? 'var(--primary)' : 'var(--text-secondary)',
                    }}
                  >
                    {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Admin Table */}
          <div className="enterprise-table-container">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th style={{ minWidth: 240 }}>Request</th>
                  <th style={{ width: 140 }}>Operator</th>
                  <th style={{ width: 110 }}>Department</th>
                  <th style={{ width: 100 }}>Priority</th>
                  <th style={{ width: 130 }}>Current Status</th>
                  <th style={{ width: 170 }}>Override Action</th>
                  <th style={{ width: 120 }}>Date</th>
                  <th style={{ width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                      Loading admin queue...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
                      No requests match the current criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((req) => (
                    <tr key={req._id} className="enterprise-table-row">
                      <td onClick={() => navigate(`/request/${req._id}`)}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                          {req.title}
                        </div>
                        <div style={{
                          fontSize: 11,
                          color: 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: 260,
                        }}>
                          {req.description}
                        </div>
                      </td>

                      <td onClick={() => navigate(`/request/${req._id}`)}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>
                          {req.userId?.name || 'Unknown'}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {req.userId?.email || '—'}
                        </div>
                      </td>

                      <td onClick={() => navigate(`/request/${req._id}`)}>
                        <DepartmentBadge department={req.aiAnalysis?.department} />
                      </td>

                      <td onClick={() => navigate(`/request/${req._id}`)}>
                        <PriorityBadge priority={req.aiAnalysis?.priority} />
                      </td>

                      <td onClick={() => navigate(`/request/${req._id}`)}>
                        <StatusBadge status={req.status} />
                      </td>

                      <td>
                        <select
                          value={req.status}
                          disabled={updatingId === req._id}
                          onChange={(e) => updateStatus(req._id, e.target.value)}
                          style={{
                            background: 'var(--bg-sidebar)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)',
                            borderRadius: 4,
                            padding: '4px 8px',
                            fontSize: 12,
                            outline: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>
                              Mark as {st.charAt(0).toUpperCase() + st.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }} onClick={() => navigate(`/request/${req._id}`)}>
                        {formatDate(req.createdAt)}
                      </td>

                      <td style={{ textAlign: 'right', color: 'var(--text-muted)' }} onClick={() => navigate(`/request/${req._id}`)}>
                        <ChevronRight size={15} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
