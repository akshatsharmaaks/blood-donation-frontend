import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getMyHospital, registerHospital } from '../../api/hospitalApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function HospitalProfilePage() {
  const [hospital, setHospital] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    getMyHospital()
      .then(r => { setHospital(r.data.data); reset(r.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const r = await registerHospital(data);
      setHospital(r.data.data);
      toast.success('Hospital profile saved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <h1>Hospital Profile</h1>
        <p>{hospital ? (hospital.isVerified ? '✓ Verified' : '⏳ Pending verification') : 'Register your hospital'}</p>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1rem' }}>
            {[
              { name:'hospitalName',  label:'Hospital Name',   full: true },
              { name:'licenseNumber', label:'License Number' },
              { name:'address',       label:'Address',         full: true },
              { name:'city',          label:'City' },
              { name:'state',         label:'State' },
              { name:'contactPerson', label:'Contact Person' },
              { name:'emergencyPhone',label:'Emergency Phone' },
              { name:'latitude',      label:'Latitude',  type:'number' },
              { name:'longitude',     label:'Longitude', type:'number' },
            ].map(f => (
              <div key={f.name} className="form-group"
                style={{ gridColumn: f.full ? '1 / -1' : undefined }}>
                <label className="form-label">{f.label}</label>
                <input className="form-input" type={f.type || 'text'}
                  step={f.type === 'number' ? 'any' : undefined}
                  {...register(f.name)} />
              </div>
            ))}
          </div>

          <button className="btn btn-primary" type="submit" disabled={saving || !!hospital}
            style={{ padding:'.65rem 2rem' }}>
            {saving ? 'Saving…' : hospital ? 'Profile Registered' : 'Register Hospital'}
          </button>
          {hospital && <p style={{ marginTop:'.75rem', fontSize:'.82rem', color:'#718096' }}>
            Contact admin to update hospital details.
          </p>}
        </form>
      </div>
    </div>
  );
}