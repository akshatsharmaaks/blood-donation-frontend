import { useEffect, useState } from 'react';
import { getMyHospital, getMyInventory } from '../../api/hospitalApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiPackage, FiActivity, FiCheckCircle } from 'react-icons/fi';

export default function HospitalDashboard() {
  const [data, setData] = useState({ hospital: null, inventory: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyHospital(), getMyInventory()])
      .then(([h, i]) => setData({ hospital: h.data.data, inventory: i.data.data || [] }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const totalUnits = data.inventory.reduce((acc, curr) => acc + curr.unitsAvailable, 0);
  const lowStock = data.inventory.filter(i => i.unitsAvailable < i.minimumThreshold).length;

  return (
    <div>
      <div className="page-header">
        <h1>{data.hospital?.hospitalName || 'Hospital / Blood Bank'} Dashboard</h1>
        <p>Manage your blood supply and fulfillment requests</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1.5rem' }}>
        <div className="card">
          <FiPackage size={24} color="#e53e3e" />
          <h3>Total Units</h3>
          <p style={{ fontSize:'1.5rem', fontWeight:700 }}>{totalUnits} Units</p>
        </div>
        <div className="card">
          <FiActivity size={24} color="#d69e2e" />
          <h3>Low Stock Alerts</h3>
          <p style={{ fontSize:'1.5rem', fontWeight:700, color:'#e53e3e' }}>{lowStock} Groups</p>
        </div>
        <div className="card">
          <FiCheckCircle size={24} color="#38a169" />
          <h3>Status</h3>
          <p style={{ color: data.hospital?.isVerified ? '#38a169' : '#d69e2e', fontWeight:600 }}>
            {data.hospital?.isVerified ? 'Verified' : 'Pending Verification'}
          </p>
        </div>
      </div>
    </div>
  );
}