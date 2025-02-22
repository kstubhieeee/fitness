import './App.css';
import Login from './Components/Login/login';
import Home from './Components/Home/Home';
import Memberdashboard from './Components/Memberdashboard/memberdashboard';
import Trainerdashboard from './Components/Trainerdashboard/trainerdashboard';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MemberSignup from './Components/Signup/MemberSignup';
import TrainerSignup from './Components/Signup/TrainerSignup';
import Planspage from './Components/Planspage/planspage';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  const isAuthenticated = localStorage.getItem('token');

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route 
          path="/member-signup" 
          element={
            isAuthenticated ? 
            <Navigate to="/memberdashboard" /> : 
            <MemberSignup />
          } 
        />
        
        <Route 
          path="/trainer-signup" 
          element={
            isAuthenticated ? 
            <Navigate to="/trainerdashboard" /> : 
            <TrainerSignup />
          } 
        />
        
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to={`/${localStorage.getItem('userType')}dashboard`} /> : 
            <Login />
          } 
        />
        
        <Route 
          path="/memberdashboard" 
          element={
            <ProtectedRoute allowedUserType="member">
              <Memberdashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/trainerdashboard" 
          element={
            <ProtectedRoute allowedUserType="trainer">
              <Trainerdashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/planspage" 
          element={
            <ProtectedRoute allowedUserType="member">
              <Planspage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;