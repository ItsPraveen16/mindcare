import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GlobalDataProvider } from './context/GlobalDataContext';
import ProtectedRoute from './routes/ProtectedRoute';

import Login from './pages/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import AmbassadorDashboard from './pages/ambassador/AmbassadorDashboard';
import CounsellorDashboard from './pages/counsellor/CounsellorDashboard';

function App() {
  return (
    <AuthProvider>
      <GlobalDataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/student"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ambassador"
              element={
                <ProtectedRoute requiredRole="ambassador">
                  <AmbassadorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/counsellor"
              element={
                <ProtectedRoute requiredRole="counsellor">
                  <CounsellorDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </GlobalDataProvider>
    </AuthProvider>
  );
}

export default App;
