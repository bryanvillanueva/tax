import React, { useState } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, IconButton, Alert, CircularProgress } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const navigate = useNavigate();

  // Obtener el email desde el estado de navegación
  const { state } = useLocation();
  const email = state?.email;

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyPress = (e) => {
    setCapsLock(e.getModifierState('CapsLock'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      await axios.post('https://taxbackend-production.up.railway.app/change-password', {
        email,
        newPassword,
      });

      setSuccess(true);
      setError('');
      setTimeout(() => {
        navigate('/', { state: { message: 'Contraseña cambiada exitosamente. Por favor inicia sesión.' } });
      }, 2000);
    } catch (err) {
      setError('Error al cambiar la contraseña. Por favor intenta más tarde.');
    } finally {
      setLoading(false);
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
          Cambiar Contraseña
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {capsLock && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            La tecla de mayúsculas está activada.
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Contraseña cambiada exitosamente.
          </Alert>
        )}

        {loading ? (
          <CircularProgress />
        ) : (
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              label="Nueva Contraseña"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyUp={handleKeyPress}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirmar Contraseña"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyUp={handleKeyPress}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              Cambiar Contraseña
            </Button>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default ChangePassword;
