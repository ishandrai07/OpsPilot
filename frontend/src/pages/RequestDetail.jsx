import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AIAnalysisPanel from '../components/AIAnalysisPanel';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import DepartmentBadge from '../components/DepartmentBadge';
import API from '../api/axios';
import { ArrowLeft, Clock, User, Hash, AlertCircle } from 'lucide-react';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const { data } = await API.get(`/requests/${id}`);
        setRequest(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load request');
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Topbar title="Request Details" />
          <main className="page-body" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            Loading request records...
          </main>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Topbar title="Error" />
          <main className="page-body" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <AlertCircle size={36} color="var(--danger)" style={{ margin: '0 auto 12px' }} />
            <h2 style={{ fontSize: 16, color: 'var(--text-primary)', marginBottom: 8 }}>{error || 'Request Not Found'}</h2>
            <button onClick={() => navigate('/history')} className="btn-secondary">
              <ArrowLeft size={14} /> Back to Requests
            </button>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Topbar title={`Request #${request._id.slice(-6).toUpperCase()}`} />
        <main className="page-body" style={{ maxWidth: 1100 }}>
          {/* Back Action */}
          <div style={{ marginBottom: 18 }}>
            <button
              onClick={() => navigate(-1)}
              className="btn-ghost"
              style={{ padding: '6px 10px', fontSize: 12 }}
            >
              <ArrowLeft size={14} /> Back
            </button>
          </div>

          {/* ── 1. Request Information Section ───────────────────────────── */}
          <div className="enterprise-card" style={{ padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>
                  Operations Request
                </div>
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                  {request.title}
                </h1>
              </div>
              <StatusBadge status={request.status} />
            </div>

            <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {request.description}
            </p>

            {/* Badges / Metadata row */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 16,
              paddingTop: 16,
              borderTop: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Department:</span>
                <DepartmentBadge department={request.aiAnalysis?.department} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Priority:</span>
                <PriorityBadge priority={request.aiAnalysis?.priority} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                <Clock size={13} />
                <span>{formatDate(request.createdAt)}</span>
              </div>

              {request.userId?.name && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                  <User size={13} />
                  <span>{request.userId.name}</span>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                <Hash size={13} />
                <span>{request._id}</span>
              </div>
            </div>
          </div>

          {/* ── 2. AI Analysis & Policy Workflow Section (Main Visual Focus) ─ */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Agentic Operations Evaluation</span>
            </div>
            <AIAnalysisPanel aiAnalysis={request.aiAnalysis} status={request.status} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RequestDetail;
