import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado para el loader
  const navigate = useNavigate();

  const isFormValid = email.trim() !== '' && password.trim() !== '' && /\S+@\S+\.\S+/.test(email);

  // Verificar si hay un token activo al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/form-selector'); // Redirige al Dashboard si ya hay un token
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setError('Por favor, verifica los campos.');
      return;
    }

    setLoading(true); // Activar el loader

    try {
      // Limpiar cualquier token previo antes de iniciar sesión
      localStorage.removeItem('authToken');
      //backend
      const response = await axios.post('https://taxbackend-production.up.railway.app/login', {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        navigate('/form-selector'); // Redirige al FormSelector después de iniciar sesión
      } else if (response.data.isFirstLogin) {
        // Manejo especial para primer inicio de sesión
        navigate('/change-password', { state: { email } });
      } else {
        setError(response.data.message || 'Error al iniciar sesión.');
      }
    } catch (err) {
      setError('Error del servidor. Por favor intenta más tarde.');
    } finally {
      setLoading(false); // Desactivar el loader
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundImage: 'url(https://id-frontend.prod-east.frontend.public.atl-paas.net/assets/wac.92a80da2.svg)',
        backgroundSize: 'cover',
      }}
    >
      <Box
        sx={{
          width: '385px',
          padding: '30px',
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img
          src="https://tax.bryanglen.com/logo.png"
          alt="Logo"
          style={{ maxWidth: '255px', marginBottom: '20px' }}
        />

        <Typography
          variant="h6"
          align="center"
          sx={{
            fontWeight: 450,
            fontSize: '1.1rem',
            marginBottom: '20px',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          Inicia sesión para continuar
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <CircularProgress />
        ) : (
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled={!isFormValid || loading} // Deshabilitar el botón mientras carga
            >
              Iniciar Sesión
            </Button>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default Login;
