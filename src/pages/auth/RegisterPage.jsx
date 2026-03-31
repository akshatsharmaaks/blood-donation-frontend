import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { registerApi } from '../../api/authApi';
import toast from 'react-hot-toast';
import { GiHeartBeats } from 'react-icons/gi';
import { useState } from 'react';

const schema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email:    yup.string().email().required('Email is required'),
  password: yup.string().min(8, 'Min 8 characters').required(),
  phone:    yup.string().required('Phone is required'),
  role:     yup.string().required('Please select a role'),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerApi(data);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#fff5f5,#fff)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div className="card" style={{ width:'100%', maxWidth:440 }}>
        <div style={{ textAlign:'center', marginBottom:'1.75rem' }}>
          <GiHeartBeats size={42} color="#e53e3e" />
          <h1 style={{ fontSize:'1.5rem', fontWeight:700, marginTop:'.5rem' }}>Create Account</h1>
          <p style={{ color:'#718096', fontSize:'.9rem' }}>Join BloodConnect today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {[
            { name:'fullName', label:'Full Name',    type:'text',     placeholder:'John Doe' },
            { name:'email',    label:'Email',         type:'email',    placeholder:'you@example.com' },
            { name:'password', label:'Password',      type:'password', placeholder:'Min 8 characters' },
            { name:'phone',    label:'Phone Number',  type:'tel',      placeholder:'+91 9000000000' },
          ].map((f) => (
            <div className="form-group" key={f.name}>
              <label className="form-label">{f.label}</label>
              <input className="form-input" type={f.type}
                placeholder={f.placeholder} {...register(f.name)} />
              {errors[f.name] && <span className="form-error">{errors[f.name].message}</span>}
            </div>
          ))}

          <div className="form-group">
            <label className="form-label">I am a</label>
            <select className="form-input" {...register('role')}>
              <option value="">Select role…</option>
              <option value="DONOR">Donor</option>
              <option value="RECEIVER">Receiver / Patient</option>
              <option value="HOSPITAL">Hospital / Blood Bank</option>
            </select>
            {errors.role && <span className="form-error">{errors.role.message}</span>}
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width:'100%', justifyContent:'center', padding:'.75rem' }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'1.25rem', fontSize:'.88rem', color:'#718096' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'#e53e3e', fontWeight:500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}