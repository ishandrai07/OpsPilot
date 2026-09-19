const DepartmentBadge = ({ department }) => {
  const norm = (department || 'General').toUpperCase();

  const config = {
    IT: { label: 'IT', className: 'badge-dept-it' },
    FINANCE: { label: 'Finance', className: 'badge-dept-finance' },
    HR: { label: 'HR', className: 'badge-dept-hr' },
    GENERAL: { label: 'General', className: 'badge-dept-general' },
  }[norm] || { label: department || 'General', className: 'badge-dept' };

  return (
    <span className={`badge-enterprise ${config.className}`}>
      {config.label}
    </span>
  );
};

export default DepartmentBadge;
