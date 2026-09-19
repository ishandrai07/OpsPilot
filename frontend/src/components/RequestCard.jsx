import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import DepartmentBadge from './DepartmentBadge';
import { ArrowRight, Clock, Cpu } from 'lucide-react';

const RequestCard = ({ request }) => {
  const navigate = useNavigate();
  const { _id, title, description, status, aiAnalysis, createdAt } = request;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const decision = aiAnalysis?.decision;
  const isResolved = decision === 'Auto Resolve';

  return (
    <div
      className="enterprise-card-interactive"
      onClick={() => navigate(`/request/${_id}`)}
      style={{ padding: 18 }}
    >
      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', flex: 1, lineHeight: 1.4 }}>
          {title}
        </h3>
        <StatusBadge status={status} />
      </div>

      {/* Description */}
      <p style={{
        margin: '0 0 12px',
        fontSize: 12,
        color: 'var(--text-secondary)',
        lineHeight: 1.5,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {description}
      </p>

      {/* Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        {aiAnalysis?.department && (
          <DepartmentBadge department={aiAnalysis.department} />
        )}
        {aiAnalysis?.priority && (
          <PriorityBadge priority={aiAnalysis.priority} />
        )}
        {decision && (
          <span className={`badge-enterprise ${isResolved ? 'badge-action-auto' : 'badge-action-human'}`}>
            <Cpu size={10} />
            {decision}
          </span>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
          <Clock size={12} />
          {formatDate(createdAt)}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>
          View Details <ArrowRight size={13} />
        </span>
      </div>
    </div>
  );
};

export default RequestCard;
