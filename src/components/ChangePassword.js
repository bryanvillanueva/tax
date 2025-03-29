import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  InputAdornment, 
  IconButton, 
  Alert, 
  CircularProgress,
  Paper
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import LockResetIcon from '@mui/icons-material/LockReset';
import PasswordIcon from '@mui/icons-material/Password';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

// Colores principales del sistema
const colors = {
  primary: '#0858e6',
  secondary: '#64748b',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  light: '#f8fafc',
  dark: '#334155',
  border: '#e5e7eb',
  background: '#ffffff'
};

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

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

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
      console.error('Error al cambiar la contraseña:', err);
      setError(
        err.response?.data?.message || 
        'Error al cambiar la contraseña. Por favor intenta más tarde.'
      );
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
          Cambio de Contraseña
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
          Configura una nueva contraseña para tu cuenta
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

        {capsLock && (
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 3, 
              width: '100%',
              borderRadius: '8px',
              '& .MuiAlert-icon': {
                color: colors.warning
              }
            }}
          >
            La tecla de mayúsculas está activada.
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3, 
              width: '100%',
              borderRadius: '8px',
              '& .MuiAlert-icon': {
                color: colors.success
              }
            }}
          >
            Contraseña cambiada exitosamente. Redirigiendo...
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
              Actualizando tu contraseña...
            </Typography>
          </Box>
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: colors.secondary }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility} edge="end">
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
            <TextField
              label="Confirmar Contraseña"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyUp={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PasswordIcon sx={{ color: colors.secondary }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility} edge="end">
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
              startIcon={<LockResetIcon />}
              disabled={loading}
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
              Cambiar Contraseña
            </Button>
            
            <Typography 
              variant="body2" 
              align="center" 
              sx={{ 
                mt: 2, 
                color: colors.secondary,
                fontSize: '0.8rem',
                fontFamily: 'Montserrat, sans-serif'
              }}
            >
              Tu contraseña debe tener al menos 8 caracteres
            </Typography>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default ChangePassword;
