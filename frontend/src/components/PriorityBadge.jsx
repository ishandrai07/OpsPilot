const PriorityBadge = ({ priority }) => {
  const norm = (priority || 'Medium').toLowerCase();

  const config = {
    low: { label: 'LOW', className: 'badge-prio-low' },
    medium: { label: 'MEDIUM', className: 'badge-prio-medium' },
    high: { label: 'HIGH', className: 'badge-prio-high' },
    critical: { label: 'CRITICAL', className: 'badge-prio-critical' },
  }[norm] || { label: (priority || 'MED').toUpperCase(), className: 'badge-prio-medium' };

  return (
    <span className={`badge-enterprise ${config.className}`}>
      {config.label}
    </span>
  );
};

export default PriorityBadge;
