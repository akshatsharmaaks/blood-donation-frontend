import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { GiHeartBeats } from 'react-icons/gi';

export default function Navbar() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { user }   = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const dashPath = {
    DONOR:    '/donor/dashboard',
    RECEIVER: '/receiver/dashboard',
    HOSPITAL: '/hospital/dashboard',
    ADMIN:    '/admin/dashboard',
  }[user?.role] || '/';

  return (
    <nav style={{
      background: '#fff',
      boxShadow: '0 1px 3px rgba(0,0,0,.1)',
      padding: '0 2rem',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link to={dashPath} style={{ display:'flex', alignItems:'center', gap:'.5rem',
        fontWeight:700, fontSize:'1.15rem', color:'#e53e3e' }}>
        <GiHeartBeats size={24} />
        BloodConnect
      </Link>

      <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
        <span style={{ fontSize:'.85rem', color:'#718096' }}>
          <FiUser style={{ verticalAlign:'middle', marginRight:4 }} />
          {user?.fullName}
          <span style={{ marginLeft:6, background:'#fff5f5', color:'#e53e3e',
            padding:'2px 8px', borderRadius:999, fontSize:'.72rem', fontWeight:600 }}>
            {user?.role}
          </span>
        </span>
        <button className="btn btn-outline" onClick={handleLogout}
          style={{ padding:'.4rem .9rem', fontSize:'.82rem' }}>
          <FiLogOut /> Logout
        </button>
      </div>
    </nav>
  );
}