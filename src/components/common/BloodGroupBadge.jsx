import { BLOOD_GROUP_COLORS } from '../../constants/bloodGroups';

export default function BloodGroupBadge({ group }) {
  const color = BLOOD_GROUP_COLORS[group] || '#718096';
  const label = group?.replace('_POSITIVE', '+').replace('_NEGATIVE', '-') || group;
  return (
    <span className="badge" style={{
      background: color + '18', color, border: `1px solid ${color}40`
    }}>
      {label}
    </span>
  );
}