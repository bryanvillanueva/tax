import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
//import FormSelector from './components/FormSelector';
import Dashboard from './components/Dashboard';
import ChangePassword from './components/ChangePassword';
import Profile from './components/profile';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} /> {/* Formulario de inicio de sesion */}
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/form-selector" element={<Dashboard />} /> {/* Dashboard con las estrategias */}
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default App;
