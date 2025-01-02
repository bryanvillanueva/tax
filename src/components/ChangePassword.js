import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, InputAdornment, Alert } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePassword = ({ email }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const isPasswordValid = (password) => {
    const lengthValid = password.length >= 8;
    const uppercaseValid = /[A-Z]/.test(password);
    const lowercaseValid = /[a-z]/.test(password);
    const numberValid = /[0-9]/.test(password);
    const specialCharValid = /[!@#$%^&*]/.test(password);
    const noSpaces = !/\s/.test(password);

    return (
      lengthValid &&
      uppercaseValid &&
      lowercaseValid &&
      numberValid &&
      specialCharValid &&
      noSpaces
    );
  };

  const handleChangePassword = async () => {
    if (!isPasswordValid(password)) {
      setError(
        'La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula, un número, un carácter especial y no contener espacios.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await axios.post('https://taxbackend-production.up.railway.app/change-password', {
        email,
        newPassword: password,
      });
      setSuccess('Contraseña cambiada exitosamente.');
      setError('');
      setTimeout(() => navigate('/form-selector'), 2000);
    } catch (err) {
      setError('Error al cambiar la contraseña. Por favor, inténtalo más tarde.');
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyUp = (e) => {
    if (e.getModifierState('CapsLock')) {
      setError('Mayúsculas activadas.');
    } else {
      setError('');
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
          Cambia tu contraseña
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <TextField
          label="Nueva contraseña"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyUp={handleKeyUp}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Confirmar contraseña"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyUp={handleKeyUp}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          onClick={handleChangePassword}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Cambiar Contraseña
        </Button>
      </Box>
    </Box>
  );
};

export default ChangePassword;
