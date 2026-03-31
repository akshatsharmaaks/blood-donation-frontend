import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginApi } from '../../api/authApi';
import { setCredentials } from '../../store/authSlice';
import toast from 'react-hot-toast';
import { GiHeartBeats } from 'react-icons/gi';
import { useState } from 'react';

const schema = yup.object({
  email: yup.string().email().required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const DASH = {
    DONOR: '/donor/dashboard', RECEIVER: '/receiver/dashboard',
    HOSPITAL: '/hospital/dashboard', ADMIN: '/admin/dashboard',
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await loginApi(data);
      const payload = res.data.data;
      dispatch(setCredentials(payload));
      toast.success('Welcome back!');
      navigate(DASH[payload.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg,#fff5f5,#fff)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <GiHeartBeats size={42} color="#e53e3e" />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '.5rem' }}>BloodConnect</h1>
          <p style={{ color: '#718096', fontSize: '.9rem' }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email"
              placeholder="you@example.com" {...register('email')} />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password"
              placeholder="••••••••" {...register('password')} />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <button className="btn btn-primary" type="submit"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: '.5rem', padding: '.75rem' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '.88rem', color: '#718096' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#e53e3e', fontWeight: 500 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}