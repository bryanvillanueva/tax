import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import FormSelector from './components/FormSelector';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/form-selector" element={<Dashboard />} /> {/* Cambia esto */}
      
    </Routes>
  );
};

export default App;
