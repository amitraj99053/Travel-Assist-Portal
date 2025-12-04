import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MechanicRegisterPage from './pages/MechanicRegisterPage';
import DashboardPage from './pages/DashboardPage';
import MechanicDashboardPage from './pages/MechanicDashboardPage';
import useAuthStore from './context/authStore';

const PrivateRoute = ({ children }) => {
  const { user } = useAuthStore();
  return user ? children : <Navigate to="/login" />;
};

const RoleBasedDashboard = () => {
  const { user } = useAuthStore();
  if (user?.role === 'mechanic') {
    return <MechanicDashboardPage />;
  }
  return <DashboardPage />;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-mechanic" element={<MechanicRegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <RoleBasedDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/mechanic-dashboard"
          element={
            <PrivateRoute>
              <MechanicDashboardPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
