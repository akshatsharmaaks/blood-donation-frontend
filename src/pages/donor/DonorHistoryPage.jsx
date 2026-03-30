import { useEffect, useState } from 'react';
import { getDonationHistory, recordDonation } from '../../api/donorApi';
import BloodGroupBadge from '../../components/common/BloodGroupBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

export default function DonorHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const load = () => {
    getDonationHistory()
      .then(r => setHistory(r.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (data) => {
    try {
      await recordDonation({ ...data, unitsDonated: Number(data.unitsDonated) });
      toast.success('Donation recorded!');
      reset(); setShowForm(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div><h1>Donation History</h1><p>Your complete donation record</p></div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Record Donation'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ maxWidth:420, marginBottom:'1.5rem' }}>
          <h3 style={{ marginBottom:'1rem', fontSize:'1rem', fontWeight:600 }}>Record Donation</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label">Units Donated</label>
              <input className="form-input" type="number" min={1} required {...register('unitsDonated')} />
            </div>
            <div className="form-group">
              <label className="form-label">Donation Date</label>
              <input className="form-input" type="date" required {...register('donationDate')} />
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea className="form-input" rows={2} {...register('notes')} />
            </div>
            <button className="btn btn-primary" type="submit">Save</button>
          </form>
        </div>
      )}

      <div className="card">
        {history.length === 0 ? (
          <p style={{ color:'#a0aec0', textAlign:'center', padding:'2rem' }}>No history yet.</p>
        ) : (
          <table className="table">
            <thead><tr>
              <th>Date</th><th>Blood Group</th><th>Units</th><th>Notes</th>
            </tr></thead>
            <tbody>
              {history.map(h => (
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