import {
  CheckCircle,
  AlertCircle,
  FileCheck,
  Zap,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Cpu,
} from 'lucide-react';
import DepartmentBadge from './DepartmentBadge';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import AgentTimeline from './AgentTimeline';

const AIAnalysisPanel = ({ aiAnalysis, status }) => {
  if (!aiAnalysis || !aiAnalysis.department) {
    return (
      <div className="enterprise-card" style={{ padding: '36px 20px', textAlign: 'center' }}>
        <Cpu size={32} style={{ margin: '0 auto 12px', color: 'var(--text-muted)', opacity: 0.5 }} />
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
          AI Analysis in Progress or Unavailable
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
          The operations agent evaluates requests upon submission.
        </div>
      </div>
    );
  }

  const isResolved = aiAnalysis.decision === 'Auto Resolve';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── 1. Top Agent Decision Banner ─────────────────────────────────── */}
      <div className="enterprise-card" style={{
        padding: '18px 22px',
        backgroundColor: 'var(--bg-card)',
        borderLeft: `4px solid ${isResolved ? 'var(--success)' : 'var(--warning)'}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              backgroundColor: isResolved ? 'rgba(52, 211, 153, 0.1)' : 'rgba(251, 191, 36, 0.1)',
              border: `1px solid ${isResolved ? 'rgba(52, 211, 153, 0.25)' : 'rgba(251, 191, 36, 0.25)'}`,
              color: isResolved ? 'var(--success)' : 'var(--warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 2,
            }}>
              {isResolved ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {isResolved ? 'AI Agent Decision: Auto-Resolved' : 'AI Agent Decision: Human Review Required'}
                </span>
                <span className={`badge-enterprise ${isResolved ? 'badge-action-auto' : 'badge-action-human'}`}>
                  {isResolved ? 'Automation Complete' : 'Escalation Triggered'}
                </span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                {aiAnalysis.decisionReason}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* ── 2. AI Analysis & Information Extraction ────────────────────── */}
        <div className="enterprise-card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Zap size={16} color="var(--primary)" />
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
              AI Analysis & Classification
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                Executive Summary
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {aiAnalysis.summary}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                  Assigned Department
                </div>
                <DepartmentBadge department={aiAnalysis.department} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                  Detected Priority
                </div>
                <PriorityBadge priority={aiAnalysis.priority} />
              </div>
            </div>

            <div style={{ paddingTop: 10, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                Category Tag
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                {aiAnalysis.category || 'General Operational Inquiry'}
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Policy Check Section ───────────────────────────────────── */}
        <div className="enterprise-card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <ShieldCheck size={16} color="var(--primary)" />
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
              Policy Evaluation
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                Governing Policy
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
                {aiAnalysis.relevantPolicy || 'Standard Operating Procedure'}
              </div>
            </div>

            <div style={{ paddingTop: 10, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                Policy Match Result
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {isResolved
                  ? 'Request meets all auto-approval parameters and limit constraints.'
                  : 'Threshold limits or conditional escalation clauses triggered manual review.'}
              </div>
            </div>

            <div style={{ paddingTop: 10, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                Automation Feasibility
              </div>
              <span className={`badge-enterprise ${isResolved ? 'badge-status-resolved' : 'badge-status-escalated'}`}>
                {isResolved ? 'Automated Resolution Permitted' : 'Human Oversight Required'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Agent Decision & Response Output ──────────────────────────── */}
      <div className="enterprise-card" style={{ padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <MessageSquare size={16} color="var(--primary)" />
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
            Agent Action & Employee Communication
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
              Recommended Next Action
            </div>
            <div style={{
              padding: '12px 14px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              fontSize: 13,
              color: 'var(--text-primary)',
              lineHeight: 1.5,
            }}>
              {aiAnalysis.recommendedAction || 'No further action required.'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
              Automated Response to Employee
            </div>
            <div style={{
              padding: '12px 14px',
              backgroundColor: 'rgba(45, 212, 191, 0.03)',
              border: '1px solid rgba(45, 212, 191, 0.15)',
              borderRadius: 6,
              fontSize: 13,
              color: 'var(--text-primary)',
              lineHeight: 1.5,
            }}>
              {aiAnalysis.aiResponse || 'Your request has been logged and queued.'}
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Agent Workflow Timeline ──────────────────────────────────── */}
      <div className="enterprise-card" style={{ padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <FileCheck size={16} color="var(--primary)" />
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
            Agent Execution Timeline
          </h3>
        </div>
        <AgentTimeline aiAnalysis={aiAnalysis} status={status} />
      </div>
    </div>
  );
};

export default AIAnalysisPanel;
