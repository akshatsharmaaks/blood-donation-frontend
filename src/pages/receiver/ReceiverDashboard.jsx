import { useEffect, useState } from 'react';
import { getMyRequests } from '../../api/receiverApi';
import StatusBadge from '../../components/common/StatusBadge';
import BloodGroupBadge from '../../components/common/BloodGroupBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiPlusCircle, FiList, FiSearch } from 'react-icons/fi';

export default function ReceiverDashboard() {
  const { user } = useSelector(s => s.auth);
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getMyRequests()
      .then(r => setRequests(r.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const counts = {
    PENDING:   requests.filter(r => r.status === 'PENDING').length,
    MATCHED:   requests.filter(r => r.status === 'MATCHED').length,
    FULFILLED: requests.filter(r => r.status === 'FULFILLED').length,
  };

  return (
    <div>
      <div className="page-header">
        <h1>Welcome, {user?.fullName}</h1>
        <p>Manage your blood requests</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'2rem' }}>
        {[
          { label:'Pending',   value: counts.PENDING,   bg:'#fffbeb', color:'#d69e2e' },
          { label:'Matched',   value: counts.MATCHED,   bg:'#ebf8ff', color:'#3182ce' },
          { label:'Fulfilled', value: counts.FULFILLED, bg:'#f0fff4', color:'#38a169' },
        ].map(c => (
          <div key={c.label} className="card" style={{ background: c.bg, textAlign:'center' }}>
            <div style={{ fontSize:'2rem', fontWeight:700, color: c.color }}>{c.value}</div>
            <div style={{ fontSize:'.85rem', color:'#718096', marginTop:'.25rem' }}>{c.label} Requests</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'2rem' }}>
        {[
          { to:'/receiver/create-request', icon:<FiPlusCircle size={20}/>, label:'New Blood Request', bg:'#e53e3e' },
          { to:'/receiver/requests',       icon:<FiList size={20}/>,       label:'View My Requests', bg:'#3182ce' },
          { to:'/receiver/search-donors',  icon:<FiSearch size={20}/>,     label:'Search Donors',    bg:'#38a169' },
        ].map(a => (
          <Link key={a.to} to={a.to} className="card" style={{
            display:'flex', alignItems:'center', gap:'1rem',
            background: a.bg, color:'#fff', textDecoration:'none',
            transition:'opacity .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity='.88'}
          onMouseLeave={e => e.currentTarget.style.opacity='1'}>
            {a.icon}
            <span style={{ fontWeight:600, fontSize:'.95rem' }}>{a.label}</span>
          </Link>
        ))}
      </div>

      <div className="card">
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1rem' }}>
          <h2 style={{ fontSize:'1rem', fontWeight:600 }}>Recent Requests</h2>
          <Link to="/receiver/requests" style={{ fontSize:'.82rem', color:'#e53e3e' }}>View all</Link>
        </div>
        {requests.length === 0 ? (
          <p style={{ color:'#a0aec0', textAlign:'center', padding:'1rem' }}>No requests yet.</p>
        ) : (
          <table className="table">
            <thead><tr><th>ID</th><th>Blood Group</th><th>Units</th><th>Urgency</th><th>Status</th></tr></thead>
            <tbody>
              {requests.slice(0,5).map(r => (
                <tr key={r.id}>
                  <td>#{r.id}</td>
                  <td><BloodGroupBadge group={r.bloodGroup} /></td>
                  <td>{r.unitsRequired}</td>
                  <td><span style={{ fontSize:'.78rem', fontWeight:600,
                    color: r.urgencyLevel === 'CRITICAL' ? '#e53e3e' : '#d69e2e' }}>
                    {r.urgencyLevel}</span></td>
                  <td><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}