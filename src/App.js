import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ChangePassword from './components/ChangePassword';
import Profile from './components/profile';
import Favorites from './components/Favorites';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} /> {/* Formulario de inicio de sesion */}
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/form-selector" element={<Dashboard />} /> {/* Ruta principal del dashboard */}
      <Route path="/form-selector/:formId" element={<Dashboard />} /> {/* Nueva ruta para formularios específicos */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/favorites" element={<Favorites />} />
    </Routes>
  );
};

export default App;
