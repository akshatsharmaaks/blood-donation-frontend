import { useEffect, useState } from 'react';
import { getReceiverRequests, fulfillRequest } from '../../api/hospitalApi';
import BloodGroupBadge from '../../components/common/BloodGroupBadge';
import toast from 'react-hot-toast';

export default function HospitalRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getReceiverRequests().then(r => setRequests(r.data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleFulfill = async (id) => {
    try {
      await fulfillRequest(id);
      toast.success('Request fulfilled from inventory!');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Fulfillment failed');
    }
  };

  return (
    <div className="card">
      <h2>Pending Receiver Requests</h2>
      <table className="table">
        <thead>
          <tr><th>Patient</th><th>Blood Group</th><th>Units</th><th>Action</th></tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r.id}>
              <td>{r.patientName}</td>
              <td><BloodGroupBadge group={r.bloodGroup} /></td>
              <td>{r.unitsRequired}</td>
              <td>
                <button className="btn btn-success" onClick={() => handleFulfill(r.id)}>Fulfill</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}