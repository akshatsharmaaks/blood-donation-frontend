import { useEffect, useState } from 'react';
import { getAllRequests } from '../../api/adminApi';
import StatusBadge from '../../components/common/StatusBadge';
import BloodGroupBadge from '../../components/common/BloodGroupBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const STATUSES = ['', 'PENDING', 'MATCHED', 'FULFILLED', 'CANCELLED'];

export default function ManageRequests() {
  const [requests, setRequests] = useState([]);
  const [filter,   setFilter]   = useState('');
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllRequests(filter || undefined)
      .then(r => setRequests(r.data.data || []))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div>
      <div className="page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div><h1>All Blood Requests</h1><p>{requests.length} requests</p></div>
        <select className="form-input" style={{ width:'auto' }}
          value={filter} onChange={e => setFilter(e.target.value)}>
          {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card">
          <table className="table">
            <thead><tr>
              <th>ID</th><th>Patient</th><th>Blood Group</th>
              <th>Units</th><th>City</th><th>Urgency</th><th>Status</th><th>Created</th>
            </tr></thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td>#{r.id}</td>
                  <td>{r.patientName}</td>
                  <td><BloodGroupBadge group={r.bloodGroup} /></td>
                  <td>{r.unitsRequired}</td>
                  <td>{r.city}</td>
                  <td style={{ fontWeight:600, fontSize:'.8rem',
                    color: r.urgencyLevel === 'CRITICAL' ? '#e53e3e' : '#d69e2e' }}>
                    {r.urgencyLevel}
                  </td>
                  <td><StatusBadge status={r.status} /></td>
                  <td style={{ color:'#718096', fontSize:'.82rem' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}