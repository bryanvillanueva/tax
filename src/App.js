import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ChangePassword from './components/ChangePassword';
import Profile from './components/profile';
import Favorites from './components/Favorites';
import UsersModule from './components/UsersModule';
import Chat from './components/Chat';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} /> {/* Formulario de inicio de sesion */}
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/form-selector" element={<Dashboard />} /> {/* Ruta principal del dashboard */}
      <Route path="/form-selector/:formId" element={<Dashboard />} /> {/* Nueva ruta para formularios específicos */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/usersModule" element={<UsersModule />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
};

export default App;