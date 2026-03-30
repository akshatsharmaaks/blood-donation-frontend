import { useEffect, useState } from 'react';
import { getDashboardStats } from '../../api/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(r => setStats(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const cards = [
    { label:'Total Users',        value: stats?.totalUsers,        color:'#3182ce' },
    { label:'Total Donors',       value: stats?.totalDonors,       color:'#e53e3e' },
    { label:'Hospitals',          value: stats?.totalHospitals,    color:'#805ad5' },
    { label:'Pending Requests',   value: stats?.pendingRequests,   color:'#d69e2e' },
    { label:'Fulfilled Requests', value: stats?.fulfilledRequests, color:'#38a169' },
    { label:'Cancelled Requests', value: stats?.cancelledRequests, color:'#718096' },
  ];

  const chartData = [
    { name:'Pending',   value: stats?.pendingRequests,   fill:'#d69e2e' },
    { name:'Fulfilled', value: stats?.fulfilledRequests, fill:'#38a169' },
    { name:'Cancelled', value: stats?.cancelledRequests, fill:'#718096' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>System overview and statistics</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',
        gap:'1rem', marginBottom:'2rem' }}>
        {cards.map(c => (
          <div key={c.label} className="card" style={{ textAlign:'center' }}>
            <div style={{ fontSize:'2rem', fontWeight:700, color: c.color }}>{c.value ?? 0}</div>
            <div style={{ fontSize:'.8rem', color:'#718096', marginTop:'.25rem' }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ fontSize:'1rem', fontWeight:600, marginBottom:'1.25rem' }}>
          Request Status Overview
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barSize={48}>
            <XAxis dataKey="name" tick={{ fontSize:13 }} />
            <YAxis tick={{ fontSize:12 }} />
            <Tooltip />
            <Bar dataKey="value" radius={[4,4,0,0]}>
              {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}