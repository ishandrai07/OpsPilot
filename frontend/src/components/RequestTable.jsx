import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import DepartmentBadge from './DepartmentBadge';
import { Cpu, ChevronRight, FileText } from 'lucide-react';

const RequestTable = ({ requests = [], loading = false }) => {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="enterprise-table-container">
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading requests...
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="enterprise-table-container">
        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
          <FileText size={32} style={{ margin: '0 auto 12px', color: 'var(--text-muted)', opacity: 0.6 }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>No requests found</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            Requests submitted by employees will appear here.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="enterprise-table-container">
      <table className="enterprise-table">
        <thead>
          <tr>
            <th style={{ minWidth: 260 }}>Request</th>
            <th style={{ width: 120 }}>Department</th>
            <th style={{ width: 110 }}>Priority</th>
            <th style={{ width: 130 }}>Status</th>
            <th style={{ width: 140 }}>AI Action</th>
            <th style={{ width: 130 }}>Created</th>
            <th style={{ width: 40 }}></th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => {
            const decision = req.aiAnalysis?.decision;
            const isResolved = decision === 'Auto Resolve';

            return (
              <tr
                key={req._id}
                className="enterprise-table-row"
                onClick={() => navigate(`/request/${req._id}`)}
              >
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                    {req.title}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 320,
                  }}>
                    {req.description}
                  </div>
                </td>
                <td>
                  <DepartmentBadge department={req.aiAnalysis?.department} />
                </td>
                <td>
                  <PriorityBadge priority={req.aiAnalysis?.priority} />
                </td>
                <td>
                  <StatusBadge status={req.status} />
                </td>
                <td>
                  {decision ? (
                    <span className={`badge-enterprise ${isResolved ? 'badge-action-auto' : 'badge-action-human'}`}>
                      <Cpu size={11} />
                      {decision}
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>
                  )}
                </td>
                <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {formatDate(req.createdAt)}
                </td>
                <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
                  <ChevronRight size={15} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;
