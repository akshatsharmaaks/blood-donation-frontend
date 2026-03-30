import { useEffect, useState } from 'react';
import { getAllUsers } from '../../api/adminApi';
import { verifyHospital } from '../../api/adminApi';
import { getAllHospitals } from '../../api/hospitalApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ManageHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading,   setLoading]   = useState(true);

  const load = () => {
    getAllHospitals()
      .then(r => setHospitals(r.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const onVerify = async (id) => {
    try { await verifyHospital(id); toast.success('Hospital verified!'); load(); }
    catch (err) { toast.error('Verification failed'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <h1>Manage Hospitals</h1>
        <p>{hospitals.length} registered hospitals</p>
      </div>

      <div className="card">
        <table className="table">
          <thead><tr>
            <th>Name</th><th>License</th><th>City</th>
            <th>Contact</th><th>Verified</th><th>Action</th>
          </tr></thead>
          <tbody>
            {hospitals.map(h => (
              <tr key={h.id}>
                <td style={{ fontWeight:500 }}>{h.hospitalName}</td>
                <td style={{ color:'#718096', fontSize:'.82rem' }}>{h.licenseNumber}</td>
                <td>{h.city}</td>
                <td>{h.contactPerson}</td>
                <td>
                  <span style={{ fontWeight:600, fontSize:'.82rem',
                    color: h.isVerified ? '#38a169' : '#d69e2e' }}>
                    {h.isVerified ? '✓ Verified' : '⏳ Pending'}
                  </span>
                </td>
                <td>
                  {!h.isVerified && (
                    <button className="btn btn-success"
                      style={{ padding:'.25rem .6rem', fontSize:'.75rem' }}
                      onClick={() => onVerify(h.id)}>
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}