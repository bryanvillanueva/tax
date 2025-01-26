import React from 'react';
import { Box, Drawer, Avatar, Typography, Divider, List, ListItem, ListItemText, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const CustomDrawer = ({ drawerOpen, setDrawerOpen, userData }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Elimina el token
    navigate('/'); // Redirige al login
  };

  return (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      <Box sx={{ width: 250, p: 2 }}>
        {userData && (
          <>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Avatar
                sx={{ width: 64, height: 64, mx: 'auto', mb: 1 }}
                src={userData.profilePicture || 'https://tax.bryanglen.com/user.png'}
                alt={userData.firstName}
              />
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif' }}>
                {`${userData.first_name} ${userData.last_name}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userData.email}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
          </>
        )}
        <List>
          <ListItem button onClick={() => navigate('/profile')} sx={{ cursor: 'pointer' }}>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button onClick={() => navigate('/form-selector')} sx={{ cursor: 'pointer' }}>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => navigate('/favorites')} sx={{ cursor: 'pointer' }}>
            <ListItemText primary="Favorites" />
          </ListItem>
          <ListItem button onClick={() => window.open('https://tax.bryanglen.com/shop-2/', '_blank')} sx={{ cursor: 'pointer' }}>
            <ListItemText primary="Shop" />
          </ListItem>
          <ListItem button onClick={() => navigate('/support')} sx={{ cursor: 'pointer' }}>
            <ListItemText primary="Support" />
          </ListItem>
        </List>
        <Divider sx={{ my: 2 }} />
        <Button
          variant="contained"
          color="primary"
          startIcon={<LogoutIcon />}
          fullWidth
          onClick={handleLogout}
          
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
};

export default CustomDrawer;
