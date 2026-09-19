import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import API from '../api/axios';
import { toast } from 'react-hot-toast';
import { Send, Info, Sparkles, ArrowRight } from 'lucide-react';

const DEPARTMENTS = [
  { id: 'auto', label: 'Auto Detect' },
  { id: 'HR', label: 'HR' },
  { id: 'IT', label: 'IT' },
  { id: 'Finance', label: 'Finance' },
  { id: 'General', label: 'General' },
];

const PRESETS = [
  {
    title: 'Hotel Expense Reimbursement',
    desc: 'I need reimbursement for ₹12,000 hotel expenses from my client visit to Mumbai last week.',
    dept: 'Finance',
  },
  {
    title: 'VPN Connection Failure',
    desc: 'My VPN client cannot connect to the corporate internal subnet since this morning.',
    dept: 'IT',
  },
  {
    title: 'Work From Home Allocation',
    desc: 'Requesting remote work authorization for Wednesday through Friday due to residential utility repairs.',
    dept: 'HR',
  },
];

const NewRequest = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('auto');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      return toast.error('Please provide both title and description');
    }
    if (description.trim().length < 15) {
      return toast.error('Please provide more context in the description');
    }

    setLoading(true);
    try {
      toast.loading('OpsPilot agent analyzing policy rules...', { id: 'agent-run' });

      // If user selected explicit department, we include it as context in description if not auto
      const payloadDesc = department !== 'auto'
        ? `[Department: ${department}] ${description.trim()}`
        : description.trim();

      const { data } = await API.post('/requests', {
        title: title.trim(),
        description: payloadDesc,
      });

      toast.dismiss('agent-run');
      toast.success('Request evaluated successfully');
      navigate(`/request/${data._id}`);
    } catch (err) {
      toast.dismiss('agent-run');
      toast.error(err.response?.data?.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset) => {
    setTitle(preset.title);
    setDescription(preset.desc);
    setDepartment(preset.dept);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Topbar title="New Operations Request" showNewBtn={false} />
        <main className="page-body" style={{ maxWidth: 960 }}>
          {/* Page Heading */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              Create Operations Request
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
              Submit internal requests for immediate automated policy validation and processing.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
            {/* Form Box */}
            <div className="enterprise-card" style={{ padding: 24 }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Title */}
                <div>
                  <label className="form-label" htmlFor="req-title">
                    Title <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <input
                    id="req-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-input"
                    placeholder="e.g. Hotel Expense Reimbursement"
                    maxLength={140}
                    disabled={loading}
                  />
                </div>

                {/* Department Selection */}
                <div>
                  <label className="form-label">
                    Department
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {DEPARTMENTS.map((dept) => {
                      const isSelected = department === dept.id;
                      return (
                        <button
                          key={dept.id}
                          type="button"
                          onClick={() => setDepartment(dept.id)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                            backgroundColor: isSelected ? 'rgba(45, 212, 191, 0.08)' : 'var(--bg-sidebar)',
                            color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                            transition: 'all 0.12s ease',
                          }}
                        >
                          {dept.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="form-label" htmlFor="req-desc">
                    Description <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <textarea
                    id="req-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-textarea"
                    placeholder="Provide specific details (amounts, error messages, dates, invoice references)..."
                    rows={5}
                    disabled={loading}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {description.length} characters
                    </span>
                  </div>
                </div>

                {/* Subtle Informational Panel */}
                <div style={{
                  padding: '12px 14px',
                  borderRadius: 6,
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}>
                  <Info size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    OpsPilot will analyze your request, check relevant policies, and recommend the next action.
                  </span>
                </div>

                {/* Submit Action */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 6 }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading || !title.trim() || !description.trim()}
                    style={{ padding: '9px 18px' }}
                  >
                    <Send size={14} />
                    {loading ? 'Evaluating Policy Rules...' : 'Submit Request'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar Guidelines / Quick Fill */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="enterprise-card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <Sparkles size={14} color="var(--primary)" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Quick Templates
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {PRESETS.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => applyPreset(preset)}
                      className="enterprise-card-interactive"
                      style={{ padding: '10px 12px' }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                        {preset.title}
                      </div>
                      <div style={{
                        fontSize: 11,
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {preset.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="enterprise-card" style={{ padding: 18, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Policy Thresholds
                </div>
                IT equipment up to ₹5,000 and hotel expenses up to ₹8,000 can be automatically resolved. Higher amounts or policy exceptions are routed to human review.
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewRequest;
