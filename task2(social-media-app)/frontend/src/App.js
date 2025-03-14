import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      {/* Render Navbar only if user is logged in */}
      {token && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={ token ? <Home /> : <Navigate to="/login" replace /> }
        />
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/explore" 
          element={ token ? <Explore /> : <Navigate to="/login" replace /> }
        />
        <Route 
          path="/chat" 
          element={ token ? <Chat /> : <Navigate to="/login" replace /> }
        />
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <Notifications />
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
      </Routes>
    </BrowserRouter>
  );
};

export default App;













