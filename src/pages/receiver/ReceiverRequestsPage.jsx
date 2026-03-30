import { useEffect, useState } from 'react';
import { getMyRequests, cancelRequest, getOffersForRequest, acceptOffer, rejectOffer } from '../../api/receiverApi';
import StatusBadge from '../../components/common/StatusBadge';
import BloodGroupBadge from '../../components/common/BloodGroupBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ReceiverRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [offers,   setOffers]   = useState({});
  const [expanded, setExpanded] = useState(null);
  const [loading,  setLoading]  = useState(true);

  const load = () => {
    getMyRequests()
      .then(r => setRequests(r.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleOffers = async (reqId) => {
    if (expanded === reqId) { setExpanded(null); return; }
    setExpanded(reqId);
    if (!offers[reqId]) {
      const r = await getOffersForRequest(reqId);
      setOffers(prev => ({ ...prev, [reqId]: r.data.data || [] }));
    }
  };

  const onCancel = async (id) => {
    try { await cancelRequest(id); toast.success('Request cancelled'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const onAccept = async (offerId, reqId) => {
    try {
      await acceptOffer(offerId);
      toast.success('Offer accepted!');
      const r = await getOffersForRequest(reqId);
      setOffers(prev => ({ ...prev, [reqId]: r.data.data }));
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const onReject = async (offerId, reqId) => {
    try {
      await rejectOffer(offerId);
      toast.success('Offer rejected');
      const r = await getOffersForRequest(reqId);
      setOffers(prev => ({ ...prev, [reqId]: r.data.data }));
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <h1>My Blood Requests</h1>
        <p>View and manage all your requests</p>
      </div>

      {requests.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:'3rem' }}>
          <p style={{ color:'#a0aec0' }}>No requests yet.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {requests.map(req => (
            <div key={req.id} className="card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'.5rem' }}>
                <div style={{ display:'flex', gap:'1rem', alignItems:'center', flexWrap:'wrap' }}>
                  <span style={{ fontWeight:600 }}>Request #{req.id}</span>
                  <BloodGroupBadge group={req.bloodGroup} />
                  <StatusBadge status={req.status} />
                  <span style={{ fontSize:'.82rem', color:'#718096' }}>
                    {req.unitsRequired} unit(s) · {req.city} · {req.urgencyLevel}
                  </span>
                </div>
                <div style={{ display:'flex', gap:'.5rem' }}>
                  <button className="btn btn-secondary"
                    style={{ padding:'.3rem .7rem', fontSize:'.78rem' }}
                    onClick={() => toggleOffers(req.id)}>
                    {expanded === req.id ? 'Hide Offers' : 'View Offers'}
                  </button>
                  {req.status === 'PENDING' && (
                    <button className="btn btn-danger"
                      style={{ padding:'.3rem .7rem', fontSize:'.78rem' }}
                      onClick={() => onCancel(req.id)}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {expanded === req.id && (
                <div style={{ marginTop:'1rem', borderTop:'1px solid #f0f4f8', paddingTop:'1rem' }}>
                  <h4 style={{ fontSize:'.88rem', fontWeight:600, marginBottom:'.75rem', color:'#4a5568' }}>
                    Donor Offers
                  </h4>
                  {(offers[req.id] || []).length === 0 ? (
                    <p style={{ color:'#a0aec0', fontSize:'.85rem' }}>No offers yet.</p>
                  ) : (
                    <table className="table">
                      <thead><tr>
                        <th>Donor</th><th>Units</th><th>Date</th><th>Message</th><th>Status</th><th>Actions</th>
                      </tr></thead>
                      <tbody>
                        {offers[req.id].map(o => (
                          <tr key={o.id}>
                            <td>{o.donorName}</td>
                            <td>{o.unitsOffered}</td>
                            <td>{o.preferredDate}</td>
                            <td style={{ color:'#718096' }}>{o.message || '—'}</td>
                            <td><StatusBadge status={o.status} /></td>
                            <td>
                              {o.status === 'PENDING' && (
                                <div style={{ display:'flex', gap:'.4rem' }}>
                                  <button className="btn btn-success"
                                    style={{ padding:'.22rem .55rem', fontSize:'.75rem' }}
                                    onClick={() => onAccept(o.id, req.id)}>Accept</button>
                                  <button className="btn btn-danger"
                                    style={{ padding:'.22rem .55rem', fontSize:'.75rem' }}
                                    onClick={() => onReject(o.id, req.id)}>Reject</button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}