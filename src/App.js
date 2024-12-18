import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Payments from './components/Payments';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Appointments from './pages/Patient/Appointments';
import AppointmentsChart from './pages/Admin/AppointmentsChart';
import AppointmentsCalendar from './pages/Doctor/AppointmentsCalendar';
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
    if (!token) {
      return <Navigate to="/login" />;
    }
    if (role === 'Admin') {
      return <HeaderAdmin>{children}</HeaderAdmin>;
    }
    if (role === 'Patients') {
      return <><HeaderPatient />{children} </>;
    }
    if (role === 'Doctor') {
      return <><HeaderDoctor />{children} </>;
    }

  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={token ? <Profile /> : <Login setToken={setToken} />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/" element={<Login setToken={setToken} />} />
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
          path="/appointmentschart"
          element={
            <ProtectedRoute>
              <AppointmentsChart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AppointmentsCalendar"
          element={
            <ProtectedRoute>
              <AppointmentsCalendar />
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
        <Route path="/" element={<Navigate to={token ? "/profile" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
