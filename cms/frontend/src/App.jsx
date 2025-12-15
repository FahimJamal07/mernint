import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import CourseForm from './pages/CourseForm';

import { AuthProvider } from './utils/AuthContext'; 
import PrivateRoute from './components/PrivateRoute'; 

function App() {
  return (
    <AuthProvider> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          <Route path="/admin/course-create" element={
            <PrivateRoute requiredRole="admin"> 
              <CourseForm />
            </PrivateRoute>
          } />

          <Route path="/admin/course-edit/:id" element={
            <PrivateRoute requiredRole="admin">
              <CourseForm />
            </PrivateRoute>
          } />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;