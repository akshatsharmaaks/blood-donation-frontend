import { useForm } from 'react-hook-form';
import { createBloodRequest } from '../../api/receiverApi';
import { BLOOD_GROUPS, URGENCY_LEVELS } from '../../constants/bloodGroups';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function CreateRequestPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await createBloodRequest({ ...data, unitsRequired: Number(data.unitsRequired) });
      toast.success('Blood request created!');
      navigate('/receiver/requests');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create request');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>New Blood Request</h1>
        <p>Fill in patient and blood requirement details</p>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1rem' }}>
            <div className="form-group">
              <label className="form-label">Patient Name</label>
              <input className="form-input" {...register('patientName', { required: true })} />
              {errors.patientName && <span className="form-error">Required</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Blood Group Required</label>
              <select className="form-input" {...register('bloodGroup', { required: true })}>
                <option value="">Select…</option>
                {BLOOD_GROUPS.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
              {errors.bloodGroup && <span className="form-error">Required</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Units Required</label>
              <input className="form-input" type="number" min={1}
                {...register('unitsRequired', { required: true, min: 1 })} />
              {errors.unitsRequired && <span className="form-error">Min 1 unit</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Urgency Level</label>
              <select className="form-input" {...register('urgencyLevel', { required: true })}>
                <option value="">Select…</option>
                {URGENCY_LEVELS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              {errors.urgencyLevel && <span className="form-error">Required</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Hospital Name</label>
              <input className="form-input" {...register('hospital')} />
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <input className="form-input" {...register('city', { required: true })} />
              {errors.city && <span className="form-error">Required</span>}
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <input className="form-input" {...register('state')} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Additional Notes</label>
            <textarea className="form-input" rows={3}
              placeholder="Any additional information…"
              {...register('notes')} style={{ resize:'vertical' }} />
          </div>

          <div style={{ display:'flex', gap:'1rem' }}>
            <button className="btn btn-primary" type="submit" disabled={loading}
              style={{ padding:'.65rem 2rem' }}>
              {loading ? 'Submitting…' : 'Submit Request'}
            </button>
            <button className="btn btn-secondary" type="button"
              onClick={() => navigate('/receiver/dashboard')}
              style={{ padding:'.65rem 1.5rem' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}