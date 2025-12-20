import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Causes from './pages/Causes';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import Login from './pages/Login';
import Gallery from './pages/Gallery';
import Events from './pages/Events';
import CauseDetails from './pages/CauseDetails';
import AdminDashboard from './pages/AdminDashboard';
import Volunteer from './pages/Volunteer';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {!isLoginPage && !isAdminPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/causes" element={<Causes />} />
        <Route path="/causes/:id" element={<CauseDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
      </Routes>
      {!isLoginPage && !isAdminPage && <Footer />}
    </>
  );
}

export default App;

