const StatusBadge = ({ status }) => {
  const norm = (status || 'pending').toLowerCase();

  const config = {
    resolved: { label: 'Resolved', className: 'badge-status-resolved' },
    escalated: { label: 'Human Review', className: 'badge-status-escalated' },
    processing: { label: 'Processing', className: 'badge-status-processing' },
    pending: { label: 'Pending', className: 'badge-status-pending' },
  }[norm] || { label: status, className: 'badge-status-pending' };

  return (
    <span className={`badge-enterprise ${config.className}`}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor' }} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
