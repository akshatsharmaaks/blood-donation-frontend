import { useEffect, useState } from 'react';
import { getMyInventory, updateInventory } from '../../api/hospitalApi';
import { BLOOD_GROUPS } from '../../constants/bloodGroups';
import BloodGroupBadge from '../../components/common/BloodGroupBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function InventoryPage() {
  const [inv, setInv] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState({});
  const [tempValues, setTempValues] = useState({});

  // Helper to sync local input changes to state
  const handleInputChange = (bloodGroup, field, value) => {
    setTempValues(prev => ({
      ...prev,
      [bloodGroup]: { 
        ...(prev[bloodGroup] || {}), 
        [field]: value 
      }
    }));
  };

  const load = () => {
    getMyInventory()
      .then(r => setInv(r.data.data || []))
      .catch(() => toast.error('Failed to load inventory'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const onUpdate = async (bloodGroup) => {
    // Get current item values from inventory list
    const currentItem = inv.find(i => i.bloodGroup === bloodGroup);
    
    // Use temp values if user typed anything, otherwise fall back to existing data
    const units = tempValues[bloodGroup]?.units ?? currentItem?.unitsAvailable ?? 0;
    const threshold = tempValues[bloodGroup]?.threshold ?? currentItem?.minimumThreshold ?? 5;

    try {
      await updateInventory({
        bloodGroup,
        unitsAvailable: Number(units),
        minimumThreshold: Number(threshold),
      });
      toast.success('Inventory updated');
      setEditing(p => ({ ...p, [bloodGroup]: false }));
      // Clear temp values for this group after success
      setTempValues(p => {
        const next = { ...p };
        delete next[bloodGroup];
        return next;
      });
      load();
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Update failed'); 
    }
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
          <thead>
            <tr>
              <th>Blood Group</th>
              <th>Units Available</th>
              <th>Min Threshold</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
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
                      <input 
                        type="number" 
                        min={0}
                        defaultValue={item?.unitsAvailable ?? 0}
                        className="form-input" 
                        style={{ width: 80, padding: '.3rem .5rem' }}
                        onChange={(e) => handleInputChange(g.value, 'units', e.target.value)}
                      />
                    ) : (item?.unitsAvailable ?? '—')}
                  </td>
                  <td>
                    {isEditing ? (
                      <input 
                        type="number" 
                        min={0}
                        defaultValue={item?.minimumThreshold ?? 5}
                        className="form-input" 
                        style={{ width: 80, padding: '.3rem .5rem' }}
                        onChange={(e) => handleInputChange(g.value, 'threshold', e.target.value)}
                      />
                    ) : (item?.minimumThreshold ?? '—')}
                  </td>
                  <td>
                    {item ? (
                      <span style={{ 
                        fontSize: '.78rem', 
                        fontWeight: 600,
                        color: isLow ? '#e53e3e' : '#38a169' 
                      }}>
                        {isLow ? '⚠ Low' : '✓ OK'}
                      </span>
                    ) : (
                      <span style={{ color: '#a0aec0', fontSize: '.78rem' }}>Not set</span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '.4rem' }}>
                        <button 
                          className="btn btn-success"
                          style={{ padding: '.25rem .6rem', fontSize: '.78rem' }}
                          onClick={() => onUpdate(g.value)}
                        >
                          Save
                        </button>
                        <button 
                          className="btn btn-secondary"
                          style={{ padding: '.25rem .6rem', fontSize: '.78rem' }}
                          onClick={() => {
                            setEditing(p => ({ ...p, [g.value]: false }));
                            setTempValues(p => {
                              const next = { ...p };
                              delete next[g.value];
                              return next;
                            });
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn btn-outline"
                        style={{ padding: '.25rem .6rem', fontSize: '.78rem' }}
                        onClick={() => setEditing(p => ({ ...p, [g.value]: true }))}
                      >
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