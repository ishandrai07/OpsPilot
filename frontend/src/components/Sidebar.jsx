import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  BookOpen,
  Settings,
  LogOut,
  Shield,
  User,
} from 'lucide-react';
import PoliciesModal from './PoliciesModal';
import SettingsModal from './SettingsModal';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [policiesOpen, setPoliciesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <aside className="sidebar-wrapper">
        {/* OpsPilot Logo Header */}
        <div style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          padding: '0 18px',
          borderBottom: '1px solid var(--border)',
          gap: 10,
        }}>
          {/* Crisp Teal Logo Mark */}
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            backgroundColor: 'rgba(45, 212, 191, 0.1)',
            border: '1px solid rgba(45, 212, 191, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: '-0.5px',
          }}>
            OP
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
              OpsPilot
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.3px', marginTop: -1 }}>
              Operations Agent
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav style={{ padding: '14px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            color: 'var(--text-muted)',
            letterSpacing: '0.8px',
            padding: '0 18px',
            marginBottom: 6,
            textTransform: 'uppercase',
          }}>
            Operations
          </div>

          <NavLink
            to="/dashboard"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <FileText size={16} />
            <span>Requests</span>
          </NavLink>

          <NavLink
            to="/new-request"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <PlusCircle size={16} />
            <span>New Request</span>
          </NavLink>

          {/* Admin link if role is admin */}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            >
              <Shield size={16} />
              <span>Admin Console</span>
            </NavLink>
          )}

          <div style={{
            fontSize: 10,
            fontWeight: 700,
            color: 'var(--text-muted)',
            letterSpacing: '0.8px',
            padding: '16px 18px 6px',
            textTransform: 'uppercase',
          }}>
            System
          </div>

          <button
            onClick={() => setPoliciesOpen(true)}
            className="sidebar-item"
            style={{ width: 'calc(100% - 20px)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <BookOpen size={16} />
            <span>Policies</span>
          </button>

          <button
            onClick={() => setSettingsOpen(true)}
            className="sidebar-item"
            style={{ width: 'calc(100% - 20px)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </nav>

        {/* User Profile at Bottom */}
        <div style={{
          padding: '12px 14px',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--bg-main)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '4px 4px' }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              flexShrink: 0,
            }}>
              <User size={14} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {user?.name || 'Operator'}
              </div>
              <div style={{
                fontSize: 10,
                color: 'var(--text-muted)',
                textTransform: 'capitalize',
              }}>
                {user?.role || 'Employee'}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn-ghost"
            style={{
              width: '100%',
              justifyContent: 'flex-start',
              padding: '6px 8px',
              fontSize: 12,
              color: 'var(--text-muted)',
            }}
          >
            <LogOut size={14} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Modals */}
      <PoliciesModal isOpen={policiesOpen} onClose={() => setPoliciesOpen(false)} />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
};

export default Sidebar;
