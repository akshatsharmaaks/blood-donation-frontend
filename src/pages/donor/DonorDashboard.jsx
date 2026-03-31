import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getMyDonorProfile, getDonorEligibility, getDonationHistory } from '../../api/donorApi';
import { getMyOffers } from '../../api/donorApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import BloodGroupBadge from '../../components/common/BloodGroupBadge';
import { FiDroplet, FiCalendar, FiAward, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function DonorDashboard() {
  const { user }  = useSelector((s) => s.auth);
  const [profile, setProfile]  = useState(null);
  const [days,    setDays]     = useState(null);
  const [history, setHistory]  = useState([]);
  const [offers,  setOffers]   = useState([]);
  const [loading, setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      getMyDonorProfile().catch(() => null),
      getDonorEligibility().catch(() => null),
      getDonationHistory().catch(() => ({ data: { data: [] } })),
      getMyOffers().catch(() => ({ data: { data: [] } })),
    ]).then(([p, e, h, o]) => {
      setProfile(p?.data?.data);
      setDays(e?.data?.data);
      setHistory(h?.data?.data || []);
      setOffers(o?.data?.data || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { icon: <FiDroplet color="#e53e3e" size={22} />, label: 'Blood Group',
      value: profile ? <BloodGroupBadge group={profile.bloodGroup} /> : '—', bg: '#fff5f5' },
    { icon: <FiAward color="#38a169" size={22} />, label: 'Total Donations',
      value: profile?.totalDonations ?? 0, bg: '#f0fff4' },
    { icon: <FiClock color="#3182ce" size={22} />, label: 'Days Until Eligible',
      value: days === 0 ? 'Eligible Now!' : `${days} days`, bg: '#ebf8ff' },
    { icon: <FiCalendar color="#805ad5" size={22} />, label: 'Active Offers',
      value: offers.filter(o => o.status === 'PENDING').length, bg: '#faf5ff' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Welcome, {user?.fullName} 👋</h1>
        <p>Your donor dashboard — track your impact</p>
      </div>

      {!profile && (
        <div style={{ background:'#fffbeb', border:'1px solid #f6e05e',
          borderRadius:8, padding:'1rem 1.25rem', marginBottom:'1.5rem',
          display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ color:'#744210', fontSize:'.9rem' }}>
            Complete your donor profile to start saving lives.
          </span>
          <Link to="/donor/profile" className="btn btn-primary"
            style={{ padding:'.4rem .9rem', fontSize:'.82rem' }}>
            Complete Profile
          </Link>
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',
        gap:'1rem', marginBottom:'2rem' }}>
        {statCards.map((c) => (
          <div key={c.label} className="card" style={{ background: c.bg }}>
            <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'.5rem' }}>
              {c.icon}
              <span style={{ fontSize:'.8rem', color:'#718096', fontWeight:500 }}>{c.label}</span>
            </div>
            <div style={{ fontSize:'1.4rem', fontWeight:700 }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Recent History */}
      <div className="card">
        <div style={{ display:'flex', justifyContent:'space-between',
          alignItems:'center', marginBottom:'1rem' }}>
          <h2 style={{ fontSize:'1rem', fontWeight:600 }}>Recent Donations</h2>
          <Link to="/donor/history" style={{ fontSize:'.82rem', color:'#e53e3e' }}>View all</Link>
        </div>
        {history.length === 0 ? (
          <p style={{ color:'#a0aec0', fontSize:'.9rem', textAlign:'center', padding:'1rem' }}>
            No donations recorded yet.
          </p>
        ) : (
          <table className="table">
            <thead><tr>
              <th>Date</th><th>Blood Group</th><th>Units</th><th>Notes</th>
            </tr></thead>
            <tbody>
              {history.slice(0,5).map((h) => (
                <tr key={h.id}>
                  <td>{h.donationDate}</td>
                  <td><BloodGroupBadge group={h.bloodGroup} /></td>
                  <td>{h.unitsDonated}</td>
                  <td style={{ color:'#718096' }}>{h.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}