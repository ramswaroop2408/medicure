import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Analytics from './pages/Analytics/Analytics';
import Patients from './pages/Patients/Patients';
import PatientDetail from './pages/PatientDetail/PatientDetail';
import { registerServiceWorker, requestNotificationPermission, showLocalNotification } from './utils/notifications';
import './App.css';

function App() {
  useEffect(() => {
    registerServiceWorker();
    requestNotificationPermission().then((permission) => {
      if (permission === 'granted') {
        // Show a welcome notification after a short delay
        setTimeout(() => {
          showLocalNotification('MedCare Pro', {
            body: 'Welcome! You have 5 pending appointments today.',
            tag: 'welcome',
          });
        }, 3000);
      }
    });
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="patients" element={<Patients />} />
            <Route path="patients/:id" element={<PatientDetail />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
