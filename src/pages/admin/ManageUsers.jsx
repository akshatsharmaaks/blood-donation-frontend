import { useEffect, useState } from 'react';
import { getAllUsers, deactivateUser } from '../../api/adminApi';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ManageUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getAllUsers()
      .then(r => setUsers(r.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const onDeactivate = async (id) => {
    try { await deactivateUser(id); toast.success('User deactivated'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <h1>Manage Users</h1>
        <p>{users.length} total users</p>
      </div>

      <div className="card">
        <table className="table">
          <thead><tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Active</th><th>Action</th>
          </tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>#{u.id}</td>
                <td style={{ fontWeight:500 }}>{u.fullName}</td>
                <td style={{ color:'#718096' }}>{u.email}</td>
                <td><span style={{ fontSize:'.78rem', fontWeight:600,
                  background:'#ebf8ff', color:'#2b6cb0', padding:'2px 8px', borderRadius:999 }}>
                  {u.role}
                </span></td>
                <td>{u.phone}</td>
                <td>
                  <span style={{ color: u.isActive ? '#38a169' : '#e53e3e', fontWeight:600, fontSize:'.82rem' }}>
                    {u.isActive ? '✓ Active' : '✗ Inactive'}
                  </span>
                </td>
                <td>
                  {u.isActive && u.role !== 'ADMIN' && (
                    <button className="btn btn-danger"
                      style={{ padding:'.25rem .6rem', fontSize:'.75rem' }}
                      onClick={() => onDeactivate(u.id)}>
                      Deactivate
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