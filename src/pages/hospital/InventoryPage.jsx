import { useEffect, useState } from 'react';
import { getMyInventory, updateInventory } from '../../api/hospitalApi';
import { BLOOD_GROUPS } from '../../constants/bloodGroups';
import BloodGroupBadge from '../../components/common/BloodGroupBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function InventoryPage() {
  const [inv,     setInv]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState({});

  const load = () => {
    getMyInventory()
      .then(r => setInv(r.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const onUpdate = async (bloodGroup, units, threshold) => {
    try {
      await updateInventory({
        bloodGroup,
        unitsAvailable: Number(units),
        minimumThreshold: Number(threshold),
      });
      toast.success('Inventory updated');
      setEditing(p => ({ ...p, [bloodGroup]: false }));
      load();
    } catch (err) { toast.error('Update failed'); }
  };

  if (loading) return <LoadingSpinner />;

  const inventoryMap = Object.fromEntries(inv.map(i => [i.bloodGroup, i]));

  return (
    <div>
      <div className="page-header">
        <h1>Blood Inventory</h1>
        <p>Manage units available per blood group</p>
      </div>

      <div className="card">
        <table className="table">
          <thead><tr>
            <th>Blood Group</th><th>Units Available</th>
            <th>Min Threshold</th><th>Status</th><th>Action</th>
          </tr></thead>
          <tbody>
            {BLOOD_GROUPS.map(g => {
              const item = inventoryMap[g.value];
              const isEditing = editing[g.value];
              const isLow = item && item.unitsAvailable < item.minimumThreshold;

              return (
                <tr key={g.value}>
                  <td><BloodGroupBadge group={g.value} /></td>
                  <td>
                    {isEditing ? (
                      <input id={`units-${g.value}`} type="number" min={0}
                        defaultValue={item?.unitsAvailable ?? 0}
                        className="form-input" style={{ width:80, padding:'.3rem .5rem' }} />
                    ) : (item?.unitsAvailable ?? '—')}
                  </td>
                  <td>
                    {isEditing ? (
                      <input id={`threshold-${g.value}`} type="number" min={0}
                        defaultValue={item?.minimumThreshold ?? 5}
                        className="form-input" style={{ width:80, padding:'.3rem .5rem' }} />
                    ) : (item?.minimumThreshold ?? '—')}
                  </td>
                  <td>
                    {item ? (
                      <span style={{ fontSize:'.78rem', fontWeight:600,
                        color: isLow ? '#e53e3e' : '#38a169' }}>
                        {isLow ? '⚠ Low' : '✓ OK'}
                      </span>
                    ) : <span style={{ color:'#a0aec0', fontSize:'.78rem' }}>Not set</span>}
                  </td>
                  <td>
                    {isEditing ? (
                      <div style={{ display:'flex', gap:'.4rem' }}>
                        <button className="btn btn-success"
                          style={{ padding:'.25rem .6rem', fontSize:'.78rem' }}
                          onClick={() => {
                            const u = document.getElementById(`units-${g.value}`).value;
                            const t = document.getElementById(`threshold-${g.value}`).value;
                            onUpdate(g.value, u, t);
                          }}>Save</button>
                        <button className="btn btn-secondary"
                          style={{ padding:'.25rem .6rem', fontSize:'.78rem' }}
                          onClick={() => setEditing(p => ({ ...p, [g.value]: false }))}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button className="btn btn-outline"
                        style={{ padding:'.25rem .6rem', fontSize:'.78rem' }}
                        onClick={() => setEditing(p => ({ ...p, [g.value]: true }))}>
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}