import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Medicine from './pages/Medicine/Medicine';
import Prescription from './pages/Prescription/Prescription';
import Appointments from './pages/Patient/Appointments';
import HeaderPatient from './components/HeaderPatient';
import HeaderDoctor from './components/HeaderDoctor';
import HeaderAdmin from './components/HeaderAdmin';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role')); // Thêm role

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setRole(localStorage.getItem('role'));
  }, []);

  const ProtectedRoute = ({ children }) => {
    return token ? (
      <>
        {role === 'Patients' && <HeaderPatient />}
        {role === 'Doctor' && <HeaderDoctor />}
        {role === 'Admin' && <HeaderAdmin />}
        {children}
      </>
    ) : (
      <Navigate to="/login" />
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />
        <Route path="/register" element={<Register setToken={setToken} setRole={setRole} />} />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medicine"
          element={
            <ProtectedRoute>
              <Medicine />
            </ProtectedRoute>
          }
        />
                <Route
          path="/prescription"
          element={
            <ProtectedRoute>
              <Prescription />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to={token ? "/profile" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
