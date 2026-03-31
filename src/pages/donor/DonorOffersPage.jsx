import { useEffect, useState } from 'react';
import { getMyOffers, withdrawOffer, getOpenOffers } from '../../api/donorApi';
import { createDonorOffer } from '../../api/donorApi';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

export default function DonorOffersPage() {
  const [offers,  setOffers]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const load = () => {
    getMyOffers()
      .then(r => setOffers(r.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const onWithdraw = async (id) => {
    try {
      await withdrawOffer(id);
      toast.success('Offer withdrawn');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const onSubmit = async (data) => {
    try {
      await createDonorOffer({
        ...data,
        unitsOffered: Number(data.unitsOffered),
        receiverRequestId: data.receiverRequestId || null,
      });
      toast.success('Offer submitted!');
      reset(); setShowForm(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div><h1>My Donation Offers</h1><p>Track all your active and past offers</p></div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Offer'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ maxWidth:480, marginBottom:'1.5rem' }}>
          <h3 style={{ marginBottom:'1rem', fontSize:'1rem', fontWeight:600 }}>Make a Donation Offer</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label">Receiver Request ID (optional)</label>
              <input className="form-input" type="number"
                placeholder="Leave blank for open offer" {...register('receiverRequestId')} />
            </div>
            <div className="form-group">
              <label className="form-label">Units to Offer</label>
              <input className="form-input" type="number" min={1}
                required {...register('unitsOffered')} />
            </div>
            <div className="form-group">
              <label className="form-label">Preferred Date</label>
              <input className="form-input" type="date" required {...register('preferredDate')} />
            </div>
            <div className="form-group">
              <label className="form-label">Message (optional)</label>
              <textarea className="form-input" rows={2} {...register('message')} />
            </div>
            <button className="btn btn-primary" type="submit">Submit Offer</button>
          </form>
        </div>
      )}

      <div className="card">
        {offers.length === 0 ? (
          <p style={{ color:'#a0aec0', textAlign:'center', padding:'2rem' }}>
            No offers yet. Make your first offer!
          </p>
        ) : (
          <table className="table">
            <thead><tr>
              <th>ID</th><th>Request ID</th><th>Units</th>
              <th>Preferred Date</th><th>Status</th><th>Action</th>
            </tr></thead>
            <tbody>
              {offers.map(o => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.receiverRequestId || <span style={{color:'#a0aec0'}}>Open offer</span>}</td>
                  <td>{o.unitsOffered}</td>
                  <td>{o.preferredDate}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td>
                    {o.status === 'PENDING' && (
                      <button className="btn btn-danger"
                        style={{ padding:'.25rem .6rem', fontSize:'.78rem' }}
                        onClick={() => onWithdraw(o.id)}>
                        Withdraw
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}