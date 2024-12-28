import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Obtiene el token del almacenamiento local

  // Si hay un token, renderiza los componentes hijos; de lo contrario, redirige a "/"
  return token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
