import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(storedToken);
  }, []);

  return (
    <BrowserRouter>
      {token && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route path="/" element={ token ? <Home /> : <Navigate to="/login" replace /> } />
        <Route path="/explore" element={ token ? <Explore /> : <Navigate to="/login" replace /> } />
        <Route path="/chat" element={ token ? <Chat /> : <Navigate to="/login" replace /> } />
        <Route path="/notifications" element={ token ? <Notifications /> : <Navigate to="/login" replace /> } />
        <Route path="/profile" element={ token ? <Profile /> : <Navigate to="/login" replace /> } />
        <Route path="/projects" element={ token ? <Projects /> : <Navigate to="/login" replace /> } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

