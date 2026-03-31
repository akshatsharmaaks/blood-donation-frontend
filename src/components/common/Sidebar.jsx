import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiHome, FiUser, FiSearch, FiPlusCircle,
  FiList, FiActivity, FiUsers, FiPackage,
} from 'react-icons/fi';

const MENUS = {
  DONOR: [
    { to: '/donor/dashboard',        icon: <FiHome />,       label: 'Dashboard' },
    { to: '/donor/profile',          icon: <FiUser />,       label: 'My Profile' },
    { to: '/donor/offers',           icon: <FiList />,       label: 'My Offers' },
    { to: '/donor/history',          icon: <FiActivity />,   label: 'Donation History' },
  ],
  RECEIVER: [
    { to: '/receiver/dashboard',     icon: <FiHome />,       label: 'Dashboard' },
    { to: '/receiver/create-request',icon: <FiPlusCircle />, label: 'New Request' },
    { to: '/receiver/requests',      icon: <FiList />,       label: 'My Requests' },
    { to: '/receiver/search-donors', icon: <FiSearch />,     label: 'Search Donors' },
  ],
  HOSPITAL: [
    { to: '/hospital/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/hospital/profile',   icon: <FiUser />, label: 'Profile' },
    { to: '/hospital/requests',  icon: <FiList />, label: 'Receiver Requests' }, // Added
    { to: '/hospital/inventory', icon: <FiPackage />, label: 'Inventory' },
  ],
  ADMIN: [
    { to: '/admin/dashboard',        icon: <FiHome />,       label: 'Dashboard' },
    { to: '/admin/users',            icon: <FiUsers />,      label: 'Users' },
    { to: '/admin/requests',         icon: <FiList />,       label: 'All Requests' },
    { to: '/admin/hospitals',        icon: <FiActivity />,   label: 'Hospitals' },
  ],
};

export default function Sidebar() {
  const { user } = useSelector((s) => s.auth);
  const items    = MENUS[user?.role] || [];

  return (
    <aside style={{
      width: '220px', minHeight: 'calc(100vh - 60px)',
      background: '#fff', borderRight: '1px solid #e2e8f0',
      padding: '1.5rem 0', flexShrink: 0,
    }}>
      {items.map((item) => (
        <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: '.75rem',
          padding: '.65rem 1.5rem', fontSize: '.88rem', fontWeight: 500,
          color: isActive ? '#e53e3e' : '#4a5568',
          background: isActive ? '#fff5f5' : 'transparent',
          borderRight: isActive ? '3px solid #e53e3e' : '3px solid transparent',
          transition: 'all .15s',
        })}>
          {item.icon} {item.label}
        </NavLink>
      ))}
    </aside>
  );
}