const StatCard = ({ icon: Icon, label, value, subtitle, accentColor = 'var(--primary)' }) => {
  return (
    <div className="enterprise-card" style={{ padding: '20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}
        </span>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: accentColor,
        }}>
          <Icon size={16} />
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
        {value ?? '—'}
      </div>
      {subtitle && (
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default StatCard;
