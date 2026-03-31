import { Link } from 'react-router-dom';
export default function UnauthorizedPage() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', gap:'1rem' }}>
      <div style={{ fontSize:'4rem' }}>🚫</div>
      <h1 style={{ fontSize:'1.5rem', fontWeight:700 }}>Access Denied</h1>
      <p style={{ color:'#718096' }}>You don't have permission to view this page.</p>
      <Link to="/login" className="btn btn-primary">Back to Login</Link>
    </div>
  );
}