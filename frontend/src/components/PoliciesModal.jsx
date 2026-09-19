import { useState } from 'react';
import { X, Shield, BookOpen, Check } from 'lucide-react';
import DepartmentBadge from './DepartmentBadge';

const POLICIES_DATA = [
  {
    department: 'HR',
    name: 'Paid Time Off & Leave Policy',
    autoApproveLimit: null,
    rules: [
      'Standard annual leave is 21 days per calendar year.',
      'Leaves longer than 5 consecutive days require manager approval.',
      'Sick leave up to 2 consecutive days does not require medical certificate.',
    ],
  },
  {
    department: 'HR',
    name: 'Work From Home Policy',
    autoApproveLimit: null,
    rules: [
      'Employees can work remotely up to 2 days per week automatically.',
      'Requests for more than 2 remote days in a single week require manager approval.',
      'Core working hours (10:00 AM - 4:00 PM) must be observed regardless of location.',
    ],
  },
  {
    department: 'IT',
    name: 'Hardware & Equipment Policy',
    autoApproveLimit: 5000,
    rules: [
      'Standard peripherals (mouse, keyboard, headset) up to ₹5,000 can be auto-approved.',
      'Laptop replacements require at least 3 years since previous issue.',
      'All equipment purchases above ₹5,000 require IT department sign-off.',
    ],
  },
  {
    department: 'IT',
    name: 'Access & VPN Policy',
    autoApproveLimit: null,
    rules: [
      'Standard VPN access requests are auto-approved for verified active employees.',
      'Production environment access requires SecOps lead approval.',
      'Password resets can be processed automatically via self-service verification.',
    ],
  },
  {
    department: 'Finance',
    name: 'Travel & Accommodation Expense Policy',
    autoApproveLimit: 8000,
    rules: [
      'Domestic hotel expenses up to ₹8,000 per night are eligible for auto-approval.',
      'Expenses above ₹8,000 per night require finance manager review.',
      'Valid GST invoice and manager pre-approval travel memo required.',
    ],
  },
  {
    department: 'Finance',
    name: 'Client Entertainment & Food Policy',
    autoApproveLimit: 3000,
    rules: [
      'Client meals under ₹3,000 can be claimed with itemized tax invoice.',
      'Alcohol expenses are strictly non-reimbursable without VP approval.',
      'Expense claims must be submitted within 30 days of the incurrence date.',
    ],
  },
];

const PoliciesModal = ({ isOpen, onClose }) => {
  const [selectedDept, setSelectedDept] = useState('ALL');

  if (!isOpen) return null;

  const filtered = selectedDept === 'ALL'
    ? POLICIES_DATA
    : POLICIES_DATA.filter(p => p.department.toUpperCase() === selectedDept);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 680 }}>
        {/* Header */}
        <div style={{
          padding: '18px 22px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 6,
              backgroundColor: 'rgba(45, 212, 191, 0.08)',
              border: '1px solid rgba(45, 212, 191, 0.2)',
              color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BookOpen size={16} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                Company Operations Policies
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Active governance rules checked by OpsPilot AI Agent
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: 6 }}>
            <X size={16} />
          </button>
        </div>

        {/* Dept filter */}
        <div style={{ padding: '12px 22px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8 }}>
          {['ALL', 'HR', 'IT', 'FINANCE'].map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              style={{
                padding: '4px 12px',
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                border: selectedDept === dept ? '1px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: selectedDept === dept ? 'rgba(45, 212, 191, 0.08)' : 'transparent',
                color: selectedDept === dept ? 'var(--primary)' : 'var(--text-muted)',
              }}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Content list */}
        <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map((policy, idx) => (
            <div key={idx} className="enterprise-card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <DepartmentBadge department={policy.department} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {policy.name}
                  </span>
                </div>
                {policy.autoApproveLimit && (
                  <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>
                    Auto-Limit: ₹{policy.autoApproveLimit.toLocaleString()}
                  </span>
                )}
              </div>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {policy.rules.map((rule, rIdx) => (
                  <li key={rIdx} style={{ marginBottom: 4 }}>{rule}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 22px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 12 }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoliciesModal;
