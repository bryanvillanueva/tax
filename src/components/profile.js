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
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EditIcon from '@mui/icons-material/Edit';
import CustomDrawer from './CustomDrawer';
import CustomSpeedDial from './CustomSpeedDial';
import MenuIcon from '@mui/icons-material/Menu';
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
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    product: '',
  });
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
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
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
        aria-label="open menu"
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          color: '#fff',
          backgroundColor: '#0858e6',
          zIndex: 1200,
          width: 56,
          height: 56,
          borderRadius: '50%',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.25)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
            opacity: 0,
            transition: 'opacity 0.3s ease-in-out',
          },
          '&:hover': {
            backgroundColor: '#0746b0',
            transform: 'scale(1.08)',
            boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.3)',
            '&::before': {
              opacity: 1,
            }
          },
          '&:active': {
            transform: 'scale(0.95)',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <MenuIcon sx={{ fontSize: 28 }} />
      </IconButton>

      <CustomDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} userData={userData} />

      <Box sx={{ 
        backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #eef1f5 100%)',
        minHeight: '100vh', 
        paddingTop: '80px',
        paddingBottom: '80px'
      }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <img
              src="https://tax.bryanglen.com/logo.png"
              alt="Logo"
              style={{ maxWidth: '220px' }}
            />
          </Box>
          
          <Paper
            elevation={0}
            sx={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
              backgroundColor: '#fff',
            }}
          >
            {/* Header with background gradient */}
            <Box
              sx={{
                height: '240px',
                backgroundImage: 'linear-gradient(135deg, #0858e6 0%, #4481eb 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                textAlign: 'center',
                color: '#fff',
                padding: '32px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'url("data:image/svg+xml,%3Csvg width=\'100%\' height=\'100%\' viewBox=\'0 0 800 800\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' stroke=\'%23ffffff\' stroke-opacity=\'0.1\' stroke-width=\'1\'%3E%3Cpath d=\'M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63\'/%3E%3Cpath d=\'M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764\'/%3E%3Cpath d=\'M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880\'/%3E%3C/g%3E%3C/svg%3E")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.2,
                }
              }}
            >
              <Box sx={{ position: 'relative', display: 'inline-block', zIndex: 1 }}>
                <Avatar
                  sx={{
                    width: 120, 
                    height: 120, 
                    mx: 'auto', 
                    mb: 3,
                    bgcolor: '#ffffff',
                    color: '#0858e6',
                    fontSize: '2.8rem',
                    fontWeight: 'bold',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    border: '5px solid rgba(255, 255, 255, 0.9)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 28px rgba(0, 0, 0, 0.2)',
                    }
                  }}
                  alt={userData?.first_name ? `${userData?.first_name} ${userData?.last_name}` : 'User'}
                >
                  {userData?.first_name && userData?.last_name ? 
                    `${userData?.first_name.charAt(0)}${userData?.last_name.charAt(0)}` : 'U'}
                </Avatar>
              </Box>
              
              <Typography variant="h4" fontWeight="bold" sx={{ letterSpacing: '0.5px', mb: 1 }}>
                {userData?.first_name} {userData?.last_name}
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                  backdropFilter: 'blur(5px)',
                  borderRadius: '20px',
                  padding: '6px 16px'
                }}
              >
                <Typography sx={{ fontWeight: 500, letterSpacing: '0.3px' }}>{userData?.email}</Typography>
              </Box>
            </Box>

            {/* Tabs section */}
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              centered 
              variant="fullWidth"
              sx={{ 
                borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                padding: '0 48px',
                '& .MuiTabs-indicator': {
                  backgroundColor: '#0858e6',
                  height: '4px',
                  borderRadius: '4px 4px 0 0'
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  minWidth: 180,
                  color: '#555',
                  paddingTop: '24px',
                  paddingBottom: '24px',
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    color: '#0858e6',
                    fontWeight: 700
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(8, 88, 230, 0.04)'
                  }
                }
              }}
            >
              <Tab label="Public Profile" />
              <Tab label="Change Password" />
            </Tabs>

            {/* Tab content panels */}
            <Box sx={{ p: { xs: 3, md: 5 } }}>
              {/* Profile Tab */}
              {tabValue === 0 && (
                <Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 3, 
                      fontWeight: 700, 
                      color: '#333',
                      position: 'relative',
                      display: 'inline-block',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '40px',
                        height: '4px',
                        backgroundColor: '#0858e6',
                        bottom: '-8px',
                        left: 0,
                        borderRadius: '2px'
                      }
                    }}
                  >
                    Personal Information
                  </Typography>
                  
                  <Box sx={{ 
                    mt: 5,
                    backgroundColor: '#f8f9fa',
                    p: { xs: 3, md: 4 }, 
                    borderRadius: '16px',
                    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.04)'
                  }}>
                    {editMode ? (
                      <>
                        <Box sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                          gap: 3
                        }}>
                          <TextField
                            label="First Name"
                            name="first_name"
                            fullWidth
                            value={editedData.first_name || ''}
                            onChange={handleInputChange}
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: '#fff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                },
                                '&.Mui-focused': {
                                  boxShadow: '0 4px 12px rgba(8, 88, 230, 0.12)'
                                }
                              }
                            }}
                          />
                          <TextField
                            label="Last Name"
                            name="last_name"
                            fullWidth
                            value={editedData.last_name || ''}
                            onChange={handleInputChange}
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: '#fff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                },
                                '&.Mui-focused': {
                                  boxShadow: '0 4px 12px rgba(8, 88, 230, 0.12)'
                                }
                              }
                            }}
                          />
                        </Box>
                        
                        <TextField
                          label="Email"
                          name="email"
                          fullWidth
                          value={editedData.email || ''}
                          onChange={handleInputChange}
                          variant="outlined"
                          sx={{ 
                            mt: 3,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: '#fff',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                              },
                              '&.Mui-focused': {
                                boxShadow: '0 4px 12px rgba(8, 88, 230, 0.12)'
                              }
                            }
                          }}
                        />
                        
                        <Box sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                          gap: 3,
                          mt: 3
                        }}>
                          <TextField
                            label="Phone"
                            name="phone"
                            fullWidth
                            value={editedData.phone || ''}
                            onChange={handleInputChange}
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: '#fff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                },
                                '&.Mui-focused': {
                                  boxShadow: '0 4px 12px rgba(8, 88, 230, 0.12)'
                                }
                              }
                            }}
                          />
                          <TextField
                            label="Company"
                            name="company_name"
                            fullWidth
                            value={editedData.company_name || ''}
                            onChange={handleInputChange}
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: '#fff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                },
                                '&.Mui-focused': {
                                  boxShadow: '0 4px 12px rgba(8, 88, 230, 0.12)'
                                }
                              }
                            }}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
                          <Button
                            variant="outlined"
                            onClick={handleCancelEdit}
                            sx={{
                              borderRadius: '12px',
                              textTransform: 'none',
                              px: 4,
                              py: 1.5,
                              fontSize: '0.95rem',
                              fontWeight: 600,
                              borderColor: '#ddd',
                              color: '#666',
                              '&:hover': {
                                borderColor: '#ccc',
                                backgroundColor: '#f5f5f5'
                              }
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            onClick={handleSaveProfile}
                            disabled={isLoading}
                            sx={{
                              borderRadius: '12px',
                              textTransform: 'none',
                              px: 4,
                              py: 1.5,
                              fontSize: '0.95rem',
                              fontWeight: 600,
                              backgroundColor: '#0858e6',
                              boxShadow: '0 4px 12px rgba(8, 88, 230, 0.2)',
                              '&:hover': {
                                backgroundColor: '#0746b0',
                                boxShadow: '0 6px 16px rgba(8, 88, 230, 0.3)'
                              }
                            }}
                          >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                          gap: 3
                        }}>
                          <Card sx={{ 
                            borderRadius: '16px', 
                            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                            }
                          }}>
                            <CardContent sx={{ p: 3 }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.9rem' }}>
                                First Name
                              </Typography>
                              <Typography variant="body1" fontWeight="600" sx={{ fontSize: '1.1rem', mt: 1 }}>
                                {userData?.first_name || 'N/A'}
                              </Typography>
                            </CardContent>
                          </Card>
                          
                          <Card sx={{ 
                            borderRadius: '16px', 
                            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                            }
                          }}>
                            <CardContent sx={{ p: 3 }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.9rem' }}>
                                Last Name
                              </Typography>
                              <Typography variant="body1" fontWeight="600" sx={{ fontSize: '1.1rem', mt: 1 }}>
                                {userData?.last_name || 'N/A'}
                              </Typography>
                            </CardContent>
                          </Card>
                          
                          <Card sx={{ 
                            borderRadius: '16px', 
                            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                            }
                          }}>
                            <CardContent sx={{ p: 3 }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.9rem' }}>
                                Email
                              </Typography>
                              <Typography variant="body1" fontWeight="600" sx={{ fontSize: '1.1rem', mt: 1 }}>
                                {userData?.email || 'N/A'}
                              </Typography>
                            </CardContent>
                          </Card>
                          
                          <Card sx={{ 
                            borderRadius: '16px', 
                            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                            }
                          }}>
                            <CardContent sx={{ p: 3 }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.9rem' }}>
                                Phone
                              </Typography>
                              <Typography variant="body1" fontWeight="600" sx={{ fontSize: '1.1rem', mt: 1 }}>
                                {userData?.phone || 'N/A'}
                              </Typography>
                            </CardContent>
                          </Card>
                          
                          <Card sx={{ 
                            borderRadius: '16px', 
                            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                            }
                          }}>
                            <CardContent sx={{ p: 3 }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.9rem' }}>
                                Company
                              </Typography>
                              <Typography variant="body1" fontWeight="600" sx={{ fontSize: '1.1rem', mt: 1 }}>
                                {userData?.company_name || 'N/A'}
                              </Typography>
                            </CardContent>
                          </Card>
                          
                          <Card sx={{ 
                            borderRadius: '16px', 
                            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                            }
                          }}>
                            <CardContent sx={{ p: 3 }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.9rem' }}>
                                Product
                              </Typography>
                              <Typography variant="body1" fontWeight="600" sx={{ fontSize: '1.1rem', mt: 1 }}>
                                {userData?.product || 'N/A'}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                          <Button
                            variant="contained"
                            onClick={handleEditProfile}
                            startIcon={<EditIcon />}
                            sx={{
                              borderRadius: '12px',
                              textTransform: 'none',
                              px: 4,
                              py: 1.5,
                              fontSize: '0.95rem',
                              fontWeight: 600,
                              backgroundColor: '#0858e6',
                              boxShadow: '0 4px 12px rgba(8, 88, 230, 0.2)',
                              '&:hover': {
                                backgroundColor: '#0746b0',
                                boxShadow: '0 6px 16px rgba(8, 88, 230, 0.3)',
                                transform: 'translateY(-2px)'
                              }
                            }}
                          >
                            Edit Profile
                          </Button>
                        </Box>
                      </>
                    )}
                  </Box>
                </Box>
              )}

              {/* Password Change Tab */}
              {tabValue === 1 && (
                <Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 3, 
                      fontWeight: 700, 
                      color: '#333',
                      position: 'relative',
                      display: 'inline-block',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '40px',
                        height: '4px',
                        backgroundColor: '#0858e6',
                        bottom: '-8px',
                        left: 0,
                        borderRadius: '2px'
                      }
                    }}
                  >
                    Change Password
                  </Typography>
                  
                  <Box sx={{ 
                    mt: 5,
                    backgroundColor: '#f8f9fa',
                    p: { xs: 3, md: 4 }, 
                    borderRadius: '16px',
                    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.04)',
                    maxWidth: '600px',
                    mx: 'auto'
                  }}>
                    <TextField
                      label="Current Password"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      variant="outlined"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      onKeyUp={handleKeyPress}
                      sx={{ 
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: '#fff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 12px rgba(8, 88, 230, 0.12)'
                          }
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton 
                              onClick={togglePasswordVisibility} 
                              edge="end"
                              sx={{ color: showPassword ? '#0858e6' : 'rgba(0, 0, 0, 0.54)' }}
                            >
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
                      sx={{ 
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: '#fff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 12px rgba(8, 88, 230, 0.12)'
                          }
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton 
                              onClick={togglePasswordVisibility} 
                              edge="end"
                              sx={{ color: showPassword ? '#0858e6' : 'rgba(0, 0, 0, 0.54)' }}
                            >
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
                      sx={{ 
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: '#fff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 12px rgba(8, 88, 230, 0.12)'
                          }
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton 
                              onClick={togglePasswordVisibility} 
                              edge="end"
                              sx={{ color: showPassword ? '#0858e6' : 'rgba(0, 0, 0, 0.54)' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    {capsLock && (
                      <Alert 
                        severity="warning" 
                        sx={{ 
                          mb: 3, 
                          borderRadius: '12px',
                          '& .MuiAlert-icon': {
                            color: '#f59e0b'
                          }
                        }}
                      >
                        Caps Lock is on
                      </Alert>
                    )}
                    
                    {error && (
                      <Alert 
                        severity="error" 
                        sx={{ 
                          mb: 3, 
                          borderRadius: '12px',
                          animation: 'fadeIn 0.3s ease-in-out',
                          '@keyframes fadeIn': {
                            '0%': {
                              opacity: 0,
                              transform: 'translateY(10px)'
                            },
                            '100%': {
                              opacity: 1,
                              transform: 'translateY(0)'
                            }
                          }
                        }}
                      >
                        {error}
                      </Alert>
                    )}
                    
                    {success && (
                      <Alert 
                        severity="success" 
                        sx={{ 
                          mb: 3, 
                          borderRadius: '12px',
                          animation: 'fadeIn 0.3s ease-in-out',
                          '@keyframes fadeIn': {
                            '0%': {
                              opacity: 0,
                              transform: 'translateY(10px)'
                            },
                            '100%': {
                              opacity: 1,
                              transform: 'translateY(0)'
                            }
                          }
                        }}
                      >
                        {success}
                      </Alert>
                    )}
                    
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handlePasswordChange}
                      disabled={isLoading}
                      sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        py: 1.8,
                        fontSize: '1rem',
                        fontWeight: 600,
                        backgroundColor: '#0858e6',
                        boxShadow: '0 4px 12px rgba(8, 88, 230, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#0746b0',
                          boxShadow: '0 6px 16px rgba(8, 88, 230, 0.3)',
                          transform: 'translateY(-2px)'
                        },
                        '&:active': {
                          transform: 'translateY(1px)',
                          boxShadow: '0 2px 8px rgba(8, 88, 230, 0.2)'
                        }
                      }}
                    >
                      {isLoading ? 
                        <CircularProgress size={24} sx={{ color: '#fff' }} /> : 
                        'Update Password'
                      }
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>

      <CustomSpeedDial />

      <Snackbar
        open={!!success || !!error}
        autoHideDuration={6000}
        onClose={() => {
          setError('');
          setSuccess('');
        }}
        sx={{
          '& .MuiSnackbarContent-root': {
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            fontSize: '0.95rem'
          }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity={error ? 'error' : 'success'} 
          sx={{ 
            width: '100%', 
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
        >
          {success || error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Profile;