import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import QRCodes from './pages/QRCodes';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const { user, loading } = useContext(AuthContext);
  const [isSidebarFolded, setIsSidebarFolded] = useState(false);

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className={`app-container ${isSidebarFolded ? 'sidebar-folded' : ''}`}>
      {user && <Navbar isSidebarFolded={isSidebarFolded} setIsSidebarFolded={setIsSidebarFolded} />}
      
      {user ? (
        <div className="app-layout">
          <Sidebar isSidebarFolded={isSidebarFolded} setIsSidebarFolded={setIsSidebarFolded} />
          <div className="content-wrapper">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/qrcodes" element={<QRCodes />} />
              <Route path="/admin" element={user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

export default App;
