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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CustomDrawer from './CustomDrawer';
import CustomSpeedDial from './CustomSpeedDial';
import MenuIcon from '@mui/icons-material/Menu';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import axios from 'axios';

const Profile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    product: '',
    avatar: '',
  });
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    product: '',
  });
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
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
        setEditedData(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
  
    if (!file) return; // Si no se selecciona archivo, salir
  
    // Validar el tipo de archivo (solo imágenes)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, and WEBP are allowed.');
      return;
    }
  
    // Validar el tamaño del archivo (máximo 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5 MB.');
      return;
    }
  
    // Crear previsualización sin sobrecargar memoria
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarFile(file);
  };
  

  const handleSaveAvatar = async () => {
    if (!avatarFile) return;
  
    const formData = new FormData();
    formData.append('avatar', avatarFile); // Agregar archivo
  
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        'https://taxbackend-production.up.railway.app/user/update-avatar',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      // ✅ Cloudinary devuelve la URL del avatar, así que actualizamos el estado
      setUserData((prev) => ({ ...prev, avatar: response.data.avatar }));
      setSuccess('Avatar updated successfully.');
      setAvatarPreview(null);
      setAvatarFile(null);
      setAvatarDialogOpen(false);
    } catch (err) {
      console.error('Error updating avatar:', err);
      setError('Failed to update avatar. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const handleEditProfile = () => {
    setEditedData(userData);
    setEditMode(true);
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        'https://taxbackend-production.up.railway.app/user/update-profile',
        editedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserData(response.data);
      setSuccess('Profile updated successfully.');
      setEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedData(userData);
    setEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

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
          transition: 'transform 0.2s, background-color 0.2s',
          '&:hover': {
            backgroundColor: '#0746b0',
            transform: 'scale(1.1)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      <CustomDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} userData={userData} />

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
            position: 'relative',
          }}
        >
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Avatar
              sx={{ width: 100, height: 100, mx: 'auto', mb: 1 }}
              src={userData?.avatar || 'https://tax.bryanglen.com/user.png'}
              alt="User Avatar"
            />
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: '#0858e6',
                '&:hover': {
                  backgroundColor: '#0746b0',
                },
              }}
              onClick={() => setAvatarDialogOpen(true)}
            >
              <CameraAltIcon sx={{ color: '#fff' }} />
            </IconButton>
          </Box>
          <Typography variant="h5" fontWeight="bold">
            {userData?.first_name} {userData?.last_name}
          </Typography>
          <Typography>{userData?.email}</Typography>
        </Box>

        {/* Diálogo para editar el avatar */}
        <Dialog open={avatarDialogOpen} onClose={() => setAvatarDialogOpen(false)}>
          <DialogTitle>Change Avatar</DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Avatar
             sx={{ width: 100, height: 100, mx: 'auto', mb: 1 }}
             src={userData?.avatar || 'https://tax.bryanglen.com/user.png'}
             alt="User Avatar"
             />
              <label htmlFor="avatar-upload">
              <input
               accept="image/jpeg, image/png, image/webp"
               style={{ display: 'none' }}
               id="avatar-upload"
               type="file"
               onChange={handleAvatarChange}
               />
              <Button variant="contained" component="span" sx={{ mb: 2 }}>
                 Upload Image
              </Button>
              </label>

            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setAvatarDialogOpen(false)}
              sx={{ color: '#666', '&:hover': { backgroundColor: '#f5f5f5' } }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAvatar}
              variant="contained"
              sx={{
                backgroundColor: '#0858e6',
                '&:hover': { backgroundColor: '#0746b0' },
              }}
              disabled={!avatarFile || isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

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
              {editMode ? (
                <>
                  <TextField
                    label="First Name"
                    name="first_name"
                    fullWidth
                    value={editedData.first_name || ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Last Name"
                    name="last_name"
                    fullWidth
                    value={editedData.last_name || ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    value={editedData.email || ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Phone"
                    name="phone"
                    fullWidth
                    value={editedData.phone || ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Company"
                    name="company_name"
                    fullWidth
                    value={editedData.company_name || ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Typography sx={{ marginBottom: '10px' }}>
                    <b>First Name:</b> {userData?.first_name || 'N/A'}
                  </Typography>
                  <Typography sx={{ marginBottom: '10px' }}>
                    <b>Last Name:</b> {userData?.last_name || 'N/A'}
                  </Typography>
                  <Typography sx={{ marginBottom: '10px' }}>
                    <b>Email:</b> {userData?.email || 'N/A'}
                  </Typography>
                  <Typography sx={{ marginBottom: '10px' }}>
                    <b>Phone:</b> {userData?.phone || 'N/A'}
                  </Typography>
                  <Typography sx={{ marginBottom: '10px' }}>
                    <b>Company:</b> {userData?.company_name || 'N/A'}
                  </Typography>
                  <Typography sx={{ marginBottom: '10px' }}>
                    <b>Product:</b> {userData?.product || 'N/A'}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </Button>
                </>
              )}
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

        <CustomSpeedDial />

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