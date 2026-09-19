import { Check, AlertCircle, Clock } from 'lucide-react';

const AgentTimeline = ({ aiAnalysis, status }) => {
  const isResolved = aiAnalysis?.decision === 'Auto Resolve';
  const hasAnalysis = Boolean(aiAnalysis && aiAnalysis.department);

  const steps = [
    {
      id: 'received',
      title: 'REQUEST RECEIVED',
      desc: 'Employee submitted the operations request',
      state: 'completed', // always completed once submitted
    },
    {
      id: 'classification',
      title: 'AI CLASSIFICATION',
      desc: hasAnalysis
        ? `Categorized as ${aiAnalysis.department} • ${aiAnalysis.category || 'General'}`
        : 'Analyzing request intent and department',
      state: hasAnalysis ? 'completed' : (status === 'processing' ? 'active' : 'pending'),
    },
    {
      id: 'policy_check',
      title: 'POLICY CHECK',
      desc: hasAnalysis
        ? `Evaluated against ${aiAnalysis.relevantPolicy || 'Standard Policy'}`
        : 'Querying internal operations policy rules',
      state: hasAnalysis ? 'completed' : 'pending',
    },
    {
      id: 'decision',
      title: 'AI DECISION',
      desc: hasAnalysis
        ? (aiAnalysis.decisionReason || 'Decision evaluated against rule thresholds')
        : 'Evaluating resolution logic and escalation criteria',
      state: hasAnalysis ? 'completed' : 'pending',
    },
    {
      id: 'action',
      title: hasAnalysis
        ? (isResolved ? 'AUTO RESOLVED' : 'HUMAN REVIEW')
        : 'AGENT ACTION',
      desc: hasAnalysis
        ? (isResolved
            ? 'Request fulfilled automatically per company policy'
            : (aiAnalysis.recommendedAction || 'Escalated to department manager for manual approval'))
        : 'Final action execution',
      state: hasAnalysis ? (isResolved ? 'completed' : 'warning') : 'pending',
    },
  ];

  return (
    <div style={{ padding: '8px 0' }}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        // Node styling
        let nodeColor = 'var(--text-muted)';
        let nodeBorder = 'var(--border)';
        let nodeBg = 'var(--bg-sidebar)';
        let Icon = Clock;

        if (step.state === 'completed') {
          nodeColor = 'var(--primary)';
          nodeBorder = 'var(--primary)';
          nodeBg = 'rgba(45, 212, 191, 0.08)';
          Icon = Check;
        } else if (step.state === 'warning') {
          nodeColor = 'var(--warning)';
          nodeBorder = 'var(--warning)';
          nodeBg = 'rgba(251, 191, 36, 0.08)';
          Icon = AlertCircle;
        }

        return (
          <div key={step.id} style={{ display: 'flex', gap: 16, position: 'relative' }}>
            {/* Vertical Line */}
            {!isLast && (
              <div style={{
                position: 'absolute',
                left: 11,
                top: 24,
                bottom: -8,
                width: 2,
                backgroundColor: step.state === 'completed' ? '#2A2A33' : 'var(--border)',
                zIndex: 1,
              }} />
            )}

            {/* Icon Node */}
            <div style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: nodeBg,
              border: `1px solid ${nodeBorder}`,
              color: nodeColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              flexShrink: 0,
              marginTop: 2,
            }}>
              <Icon size={12} strokeWidth={2.5} />
            </div>

            {/* Content */}
            <div style={{ paddingBottom: isLast ? 0 : 22, flex: 1 }}>
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.6px',
                color: step.state === 'warning' ? 'var(--warning)' : (step.state === 'completed' ? 'var(--text-primary)' : 'var(--text-muted)'),
              }}>
                {step.title}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>
                {step.desc}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AgentTimeline;
