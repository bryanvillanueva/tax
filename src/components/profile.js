import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Tabs,
  Tab,
  IconButton,
  Container,
  TextField,
  Button,
  Snackbar,
  CircularProgress,
  Alert,
  InputAdornment,
  
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CustomDrawer from './CustomDrawer';
import CustomSpeedDial from './CustomSpeedDial'; // Importa el SpeedDial
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';

const Profile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [userData, setUserData] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false); // Estado para el Drawer
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('https://taxbackend-production.up.railway.app/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        'https://taxbackend-production.up.railway.app/user/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Password updated successfully.');
      setError('');
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    setSuccess('');
  };

  const handleKeyPress = (e) => {
    setCapsLock(e.getModifierState('CapsLock'));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  if (isLoading && !userData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
<IconButton
  size="large"
  onClick={() => setDrawerOpen(true)}
  sx={{
    position: 'fixed',
    top: 16,
    left: 16,
    color: '#fff',
    backgroundColor: '#0858e6',
    transition: 'transform 0.2s, background-color 0.2s', // Transición suave para hover y pulse
    '&:hover': {
      backgroundColor: '#0746b0', // Azul oscuro al hacer hover
      transform: 'scale(1.1)', // Efecto de pulse al hover
    },
    '&:active': {
      transform: 'scale(0.95)', // Pequeño efecto de clic
    },
  }}
>
  <MenuIcon />
</IconButton>

      {/* Reutiliza el Drawer */}
      <CustomDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        userData={userData}
      />

      <Container maxWidth="md" sx={{ backgroundColor: '#fff', borderRadius: '20px', padding: '20px' }}>
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <img
            src="https://tax.bryanglen.com/logo.png"
            alt="Logo"
            style={{ maxWidth: '350px' }}
          />
        </Box>
        <Box
          sx={{
            height: '200px',
            backgroundImage: 'url(https://wac-cdn.atlassian.com/misc-assets/webp-images/bg_atl_cloud_hero_small.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            textAlign: 'center',
            color: '#fff',
            padding: '20px',
            marginTop: '50px',
            borderRadius: '20px',
          }}
        >
          <Avatar
            sx={{ width: 100, height: 100, mx: 'auto', mb: 1 }}
            src="https://tax.bryanglen.com/user.png"
            alt="User Avatar"
          />
          <Typography variant="h5" fontWeight="bold">
            {userData?.first_name} {userData?.last_name}
          </Typography>
          <Typography>{userData?.email}</Typography>
        </Box>

        <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ marginTop: 2 }}>
          <Tab label="Public Profile" />
          <Tab label="Change Password" />
        </Tabs>

        {tabValue === 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Personal Information
            </Typography>
            <Box sx={{ backgroundColor: '#f3f3f3', p: 4, borderRadius: '20px' }}>
              <Typography sx={{ marginBottom: '10px' }}><b>First Name:</b> {userData?.first_name}</Typography>
              <Typography sx={{ marginBottom: '10px' }}><b>Last Name:</b> {userData?.last_name}</Typography>
              <Typography sx={{ marginBottom: '10px' }}><b>Email:</b> {userData?.email}</Typography>
              <Typography sx={{ marginBottom: '10px' }}><b>Phone:</b> {userData?.phone}</Typography>
              <Typography sx={{ marginBottom: '10px' }}><b>Company:</b> {userData?.company}</Typography>
              <Typography sx={{ marginBottom: '10px' }}><b>Product:</b> {userData?.product}</Typography>
            </Box>
          </Box>
        )}

        {tabValue === 1 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Change Password
            </Typography>
            <TextField
              label="Current Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              onKeyUp={handleKeyPress}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="New Password"
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
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
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
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {capsLock && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Caps Lock is on.
              </Alert>
            )}
            {error && (
              <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
                {success}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handlePasswordChange}
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </Box>
        )}

       <CustomSpeedDial /> {/* Incluye el SpeedDial */}

        <Snackbar
          open={!!success || !!error}
          autoHideDuration={6000}
          onClose={() => {
            setError('');
            setSuccess('');
          }}
          message={success || error}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        />
      </Container>
    </>
  );
};

export default Profile;
