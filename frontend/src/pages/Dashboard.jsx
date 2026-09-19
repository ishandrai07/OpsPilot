import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import RequestTable from '../components/RequestTable';
import API from '../api/axios';
import { FileText, CheckCircle, Users, AlertTriangle, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, requestsRes] = await Promise.all([
          API.get('/requests/stats'),
          API.get('/requests'),
        ]);
        setStats(statsRes.data);
        setRecentRequests(requestsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const statCards = [
    {
      icon: FileText,
      label: 'Total Requests',
      value: stats?.total ?? 0,
      subtitle: 'Across all operations',
      accentColor: 'var(--text-primary)',
    },
    {
      icon: CheckCircle,
      label: 'AI Resolved',
      value: stats?.resolved ?? 0,
      subtitle: 'Policy compliant auto-approved',
      accentColor: 'var(--success)',
    },
    {
      icon: Users,
      label: 'Human Review',
      value: stats?.escalated ?? 0,
      subtitle: 'Escalated to management',
      accentColor: 'var(--warning)',
    },
    {
      icon: AlertTriangle,
      label: 'High Priority',
      value: stats?.highPriority ?? 0,
      subtitle: 'Requiring swift turnaround',
      accentColor: 'var(--danger)',
    },
  ];

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <main className="page-body">
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
              {getGreeting()}
            </h1>
            <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: 13 }}>
              Here's what's happening across your operations.
            </p>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginBottom: 32,
          }}>
            {statCards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>

          {/* Request Table - Main Focus */}
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                Recent Operations Requests
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
                Real-time queue of employee submissions and agent actions
              </p>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="btn-ghost"
              style={{ fontSize: 12, padding: '6px 10px' }}
            >
              <span>View all requests</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <RequestTable requests={recentRequests.slice(0, 10)} loading={loading} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
