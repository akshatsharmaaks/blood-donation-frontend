const COLORS = {
  PENDING:   { bg: '#fffbeb', color: '#d69e2e' },
  MATCHED:   { bg: '#ebf8ff', color: '#3182ce' },
  FULFILLED: { bg: '#f0fff4', color: '#38a169' },
  CANCELLED: { bg: '#fff5f5', color: '#e53e3e' },
  EXPIRED:   { bg: '#f7fafc', color: '#718096' },
  ACCEPTED:  { bg: '#f0fff4', color: '#38a169' },
  REJECTED:  { bg: '#fff5f5', color: '#e53e3e' },
  COMPLETED: { bg: '#f0fff4', color: '#276749' },
  WITHDRAWN: { bg: '#f7fafc', color: '#718096' },
};

export default function StatusBadge({ status }) {
  const s = COLORS[status] || { bg: '#f7fafc', color: '#718096' };
  return (
    <span className="badge" style={{ background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}