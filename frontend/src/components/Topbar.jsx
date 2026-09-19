import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Topbar = ({ title, subtitle, showNewBtn = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.startsWith('/request/')) return 'Operations / Request Details';
    if (path === '/history') return 'Operations / All Requests';
    if (path === '/new-request') return 'Operations / New Request';
    if (path === '/admin') return 'Management / Admin Console';
    return 'Operations / Dashboard';
  };

  return (
    <header className="topbar">
      {/* Left: Breadcrumb / Context */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.3px' }}>
          {getBreadcrumb()}
        </div>
        {title && (
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 1 }}>
            {title}
          </div>
        )}
      </div>

      {/* Right: Agent Status & Action */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* System Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          borderRadius: 6,
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border)',
          fontSize: 11,
          color: 'var(--text-secondary)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
          <Cpu size={12} color="var(--primary)" />
          <span>OpsPilot Agent Online</span>
        </div>

        {/* Quick New Request Button */}
        {showNewBtn && location.pathname !== '/new-request' && (
          <button
            onClick={() => navigate('/new-request')}
            className="btn-primary"
            style={{ padding: '6px 12px', fontSize: 12 }}
          >
            <Plus size={14} />
            New Request
          </button>
        )}
      </div>
    </header>
  );
};

export default Topbar;
