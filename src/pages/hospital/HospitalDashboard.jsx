import { useEffect, useState } from 'react';
import { getMyInventory } from '../../api/hospitalApi';
import BloodGroupBadge from '../../components/common/BloodGroupBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function HospitalDashboard() {
  const { user }  = useSelector(s => s.auth);
  const [inv, setInv] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyInventory()
      .then(r => setInv(r.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const critical = inv.filter(i => i.unitsAvailable < i.minimumThreshold);

  return (
    <div>
      <div className="page-header">
        <h1>Hospital Dashboard</h1>
        <p>{user?.fullName}</p>
      </div>

      {critical.length > 0 && (
        <div style={{ background:'#fff5f5', border:'1px solid #fc8181',
          borderRadius:8, padding:'1rem 1.25rem', marginBottom:'1.5rem' }}>
          <strong style={{ color:'#c53030' }}>⚠ Low Stock Alert:</strong>
          <span style={{ color:'#742a2a', marginLeft:8, fontSize:'.9rem' }}>
            {critical.map(c => c.bloodGroup.replace('_POSITIVE','+').replace('_NEGATIVE','-')).join(', ')} below minimum threshold
          </span>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
        {inv.map(item => {
          const isLow = item.unitsAvailable < item.minimumThreshold;
          return (
            <div key={item.id} className="card" style={{
              textAlign:'center',
              background: isLow ? '#fff5f5' : '#f0fff4',
              border: `1px solid ${isLow ? '#fc8181' : '#9ae6b4'}`,
            }}>
              <BloodGroupBadge group={item.bloodGroup} />
              <div style={{ fontSize:'1.8rem', fontWeight:700, margin:'.5rem 0',
                color: isLow ? '#e53e3e' : '#276749' }}>
                {item.unitsAvailable}
              </div>
              <div style={{ fontSize:'.72rem', color:'#718096' }}>units · min {item.minimumThreshold}</div>
            </div>
          );
        })}
      </div>

      <Link to="/hospital/inventory" className="btn btn-primary">Manage Inventory</Link>
    </div>
  );
}