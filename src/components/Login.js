import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress, 
  Alert,
  InputAdornment,
  IconButton,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import { ReactComponent as SharkLogo } from '../assets/icon.svg';

// Colores principales del sistema
const colors = {
  primary: '#0858e6',
  secondary: '#64748b',
  success: '#10b981',
  danger: '#ef4444',
  light: '#f8fafc',
  dark: '#334155',
  border: '#e5e7eb',
  background: '#ffffff'
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const isFormValid = email.trim() !== '' && password.trim() !== '' && /\S+@\S+\.\S+/.test(email);

  // Verificar si hay un token activo al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/form-selector'); // Redirige al Dashboard si ya hay un token
    }
  }, [navigate]);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setError('Please verify the fields.');
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
        setError(response.data.message || 'Login error.');
      }
    } catch (err) {
      console.error('Error de inicio de sesión:', err);
      setError(
        err.response?.data?.message || 
        'Server error. Please try again later.'
      );
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
        backgroundPosition: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(2px)',
        }
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: { xs: '90%', sm: '385px' },
          padding: '30px',
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(8, 88, 230, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 1,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '5px',
            background: `linear-gradient(90deg, ${colors.primary} 0%, #3b82f6 100%)`,
          }
        }}
      >
        <img
          src="https://tax.bryanglen.com/logo.png"
          alt="Logo"
          style={{ 
            maxWidth: '220px', 
            marginBottom: '24px',
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
          }}
        />

        <Typography
          variant="h5"
          align="center"
          sx={{
            fontWeight: 600,
            fontSize: '1.2rem',
            marginBottom: '10px',
            fontFamily: 'Montserrat, sans-serif',
            color: colors.dark,
          }}
        >
          Welcome back
        </Typography>

        <Typography
          variant="body2"
          align="center"
          sx={{
            fontWeight: 400,
            fontSize: '0.9rem',
            marginBottom: '24px',
            fontFamily: 'Montserrat, sans-serif',
            color: colors.secondary,
          }}
        >
          Sign in to continue
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              width: '100%',
              borderRadius: '8px',
              '& .MuiAlert-icon': {
                color: colors.danger
              }
            }}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
            <CircularProgress 
              size={40} 
              sx={{ 
                color: colors.primary,
                mb: 2
              }} 
            />
            <Typography variant="body2" color={colors.secondary}>
              Signing in...
            </Typography>
          </Box>
        ) : (
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: colors.secondary }} />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  fontFamily: 'Montserrat, sans-serif',
                  '&:hover fieldset': {
                    borderColor: colors.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primary,
                  }
                },
                '& .MuiInputLabel-root': {
                  fontFamily: 'Montserrat, sans-serif',
                  '&.Mui-focused': {
                    color: colors.primary
                  }
                }
              }}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: colors.secondary }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  fontFamily: 'Montserrat, sans-serif',
                  '&:hover fieldset': {
                    borderColor: colors.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primary,
                  }
                },
                '& .MuiInputLabel-root': {
                  fontFamily: 'Montserrat, sans-serif',
                  '&.Mui-focused': {
                    color: colors.primary
                  }
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<LoginIcon />}
              disabled={!isFormValid || loading}
              sx={{ 
                mt: 2,
                mb: 2,
                backgroundColor: colors.primary,
                color: '#fff',
                borderRadius: '10px',
                padding: '12px 0',
                fontWeight: 600,
                textTransform: 'none',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '1rem',
                boxShadow: '0 4px 10px rgba(8, 88, 230, 0.25)',
                '&:hover': {
                  backgroundColor: '#0347c8',
                  boxShadow: '0 6px 12px rgba(8, 88, 230, 0.35)',
                },
                '&:disabled': {
                  backgroundColor: '#e2e8f0',
                  color: '#94a3b8',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Login
            </Button>
            
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default Login;
