import { useState } from 'react';
import { searchDonors } from '../../api/donorApi';
import { BLOOD_GROUPS } from '../../constants/bloodGroups';
import BloodGroupBadge from '../../components/common/BloodGroupBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function SearchDonorsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [form, setForm] = useState({ bloodGroup:'', city:'', lat:'', lon:'' });

  const onSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await searchDonors({
        bloodGroup: form.bloodGroup,
        city: form.city || undefined,
        lat:  form.lat  || undefined,
        lon:  form.lon  || undefined,
      });
      setResults(r.data.data || []);
      setSearched(true);
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Search Donors</h1>
        <p>Find compatible donors ranked by eligibility and proximity</p>
      </div>

      <div className="card" style={{ marginBottom:'1.5rem' }}>
        <form onSubmit={onSearch} style={{ display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'flex-end' }}>
          <div className="form-group" style={{ margin:0, flex:'1 1 160px' }}>
            <label className="form-label">Blood Group Needed</label>
            <select className="form-input"
              value={form.bloodGroup}
              onChange={e => setForm(p => ({ ...p, bloodGroup: e.target.value }))}
              required>
              <option value="">Select…</option>
              {BLOOD_GROUPS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ margin:0, flex:'1 1 140px' }}>
            <label className="form-label">City (optional)</label>
            <input className="form-input" value={form.city}
              onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
          </div>
          <div className="form-group" style={{ margin:0, flex:'1 1 120px' }}>
            <label className="form-label">Latitude</label>
            <input className="form-input" type="number" step="any" value={form.lat}
              onChange={e => setForm(p => ({ ...p, lat: e.target.value }))} />
          </div>
          <div className="form-group" style={{ margin:0, flex:'1 1 120px' }}>
            <label className="form-label">Longitude</label>
            <input className="form-input" type="number" step="any" value={form.lon}
              onChange={e => setForm(p => ({ ...p, lon: e.target.value }))} />
          </div>
          <button className="btn btn-primary" type="submit"
            style={{ marginBottom:'1rem', whiteSpace:'nowrap' }}>
            Search Donors
          </button>
        </form>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && searched && (
        <div className="card">
          <h3 style={{ fontSize:'1rem', fontWeight:600, marginBottom:'1rem' }}>
            {results.length} donor(s) found
          </h3>
          {results.length === 0 ? (
            <p style={{ color:'#a0aec0', textAlign:'center', padding:'1.5rem' }}>
              No eligible donors found for this criteria.
            </p>
          ) : (
            <table className="table">
              <thead><tr>
                <th>Name</th><th>Blood Group</th><th>City</th>
                <th>Distance</th><th>Last Donated</th><th>Score</th>
              </tr></thead>
              <tbody>
                {results.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontWeight:500 }}>{d.fullName}</td>
                    <td><BloodGroupBadge group={d.bloodGroup} /></td>
                    <td>{d.city}</td>
                    <td>{d.distanceKm != null ? `${d.distanceKm} km` : '—'}</td>
                    <td>{d.lastDonationDate || 'Never'}</td>
                    <td>
                      <span style={{ background:'#f0fff4', color:'#276749',
                        padding:'2px 8px', borderRadius:999, fontSize:'.78rem', fontWeight:600 }}>
                        {(d.rankingScore * 100).toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}