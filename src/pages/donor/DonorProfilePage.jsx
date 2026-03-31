import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getMyDonorProfile, createDonorProfile, updateDonorProfile } from '../../api/donorApi';
import { BLOOD_GROUPS } from '../../constants/bloodGroups';
import BloodGroupBadge from '../../components/common/BloodGroupBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function DonorProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    getMyDonorProfile()
      .then((r) => { setProfile(r.data.data); reset(r.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const fn = profile ? updateDonorProfile : createDonorProfile;
      const r  = await fn(data);
      setProfile(r.data.data);
      toast.success('Profile saved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <h1>Donor Profile</h1>
        <p>{profile ? 'Update your details' : 'Complete your profile to become eligible'}</p>
      </div>

      <div className="card" style={{ maxWidth: 620 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1rem' }}>

            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select className="form-input" {...register('bloodGroup', { required: true })}>
                <option value="">Select…</option>
                {BLOOD_GROUPS.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
              {errors.bloodGroup && <span className="form-error">Required</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Age</label>
              <input className="form-input" type="number" min={18} max={65}
                {...register('age', { required: true, min: 18, max: 65 })} />
              {errors.age && <span className="form-error">Age must be 18–65</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input className="form-input" type="number" min={50}
                {...register('weightKg', { required: true, min: 50 })} />
              {errors.weightKg && <span className="form-error">Min 50 kg</span>}
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <input className="form-input" type="text" {...register('city')} />
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <input className="form-input" type="text" {...register('state')} />
            </div>

            <div className="form-group">
              <label className="form-label">Last Donation Date</label>
              <input className="form-input" type="date" {...register('lastDonationDate')} />
            </div>

            <div className="form-group">
              <label className="form-label">Latitude (optional)</label>
              <input className="form-input" type="number" step="any" {...register('latitude')} />
            </div>

            <div className="form-group">
              <label className="form-label">Longitude (optional)</label>
              <input className="form-input" type="number" step="any" {...register('longitude')} />
            </div>
          </div>

          <div className="form-group" style={{ flexDirection:'row', alignItems:'center', gap:'1rem' }}>
            <label style={{ display:'flex', alignItems:'center', gap:'.5rem',
              fontSize:'.88rem', cursor:'pointer' }}>
              <input type="checkbox" {...register('isAvailable')} />
              Available to donate
            </label>
            <label style={{ display:'flex', alignItems:'center', gap:'.5rem',
              fontSize:'.88rem', cursor:'pointer' }}>
              <input type="checkbox" {...register('hasMedicalCondition')} />
              Has medical condition
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Medical Notes</label>
            <textarea className="form-input" rows={2}
              placeholder="Any relevant medical information…"
              {...register('medicalNotes')} style={{ resize:'vertical' }} />
          </div>

          <button className="btn btn-primary" type="submit" disabled={saving}
            style={{ padding:'.65rem 2rem' }}>
            {saving ? 'Saving…' : profile ? 'Update Profile' : 'Create Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}