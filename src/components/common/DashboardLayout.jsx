import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fc' }}>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '2rem', overflowX: 'hidden' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}