import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Patient/Login';
import Profile from './pages/Patient/Profile';
import Appointments from './pages/Patient/Appointments';
import Header from './components/Header';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  const ProtectedRoute = ({ children }) => {
    return token ? (
      <>
        <Header />
        {children}
      </>
    ) : (
      <Navigate to="/login" />
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
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
        <Route path="/" element={<Navigate to={token ? "/profile" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
