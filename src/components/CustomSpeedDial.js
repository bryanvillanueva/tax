import React, { useState, useMemo } from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Box, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import WhatsappIcon from '@mui/icons-material/WhatsApp';
import GridViewIcon from '@mui/icons-material/GridView';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useNavigate } from 'react-router-dom';

const CustomSpeedDial = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const toggleSpeedDial = () => {
    setOpen(!open);
  };

  const handleActionClick = (action) => {
    action();
    setOpen(false);
  };

  // Iconos personalizados solo con texto QBID
  const QbidStandardIcon = () => (
    <Box 
      sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 24, 
        height: 24
      }}
    >
      <Typography 
        variant="caption" 
        sx={{ 
          fontSize: '12px', 
          fontWeight: 'bold',
          color: '#9333ea',
          lineHeight: 1
        }}
      >
        QBID
      </Typography>
    </Box>
  );

  const QbidSimplifiedIcon = () => (
    <Box 
      sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 24, 
        height: 24
      }}
    >
      <Typography 
        variant="caption" 
        sx={{ 
          fontSize: '12px', 
          fontWeight: 'bold',
          color: '#0d9488',
          lineHeight: 1
        }}
      >
        QBID
      </Typography>
    </Box>
  );


  // icnonos speedial
  const actions = useMemo(() => [
    {
      icon: <HomeIcon sx={{ color: '#0858e6' }} />,
      name: 'Home',
      action: () => navigate('/form-selector'),
    },
    {
      icon: <FavoriteIcon sx={{ color: '#ef4444' }} />,
      name: 'Favorites',
      action: () => navigate('/favorites'),
    },
    {
      icon: <ProfileIcon sx={{ color: '#0858e6' }} />,
      name: 'Profile',
      action: () => navigate('/profile'),
    },
  
    {
      icon: <WhatsappIcon sx={{ color: '#10b981' }} />,
      name: 'Support',
      action: () => window.open('https://w.app/nVaYD9', '_blank'),
    },
  ], [navigate]);

  return (
    <SpeedDial
      ariaLabel="Navigation Actions"
      sx={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 1250,
        '& .MuiFab-primary': {
          backgroundColor: '#0858e6',
          boxShadow: '0 4px 12px rgba(8, 88, 230, 0.25)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: '#0746b0',
            boxShadow: '0 6px 16px rgba(8, 88, 230, 0.35)',
            '& .MuiSpeedDialIcon-root': {
              transform: 'rotate(45deg)',
            }
          },
        },
        // Animación del icono
        '& .MuiSpeedDialIcon-root': {
          transition: 'transform 0.3s ease-in-out',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
        },
      }}
      icon={<SpeedDialIcon />}
      open={open}
      onClick={toggleSpeedDial}
      onClose={() => {}}
      FabProps={{
        onClick: toggleSpeedDial,
        disableRipple: false,
      }}
      direction="up"
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipOpen={open}
          FabProps={{
            sx: {
              bgcolor: 'white',
              '&:hover': {
                bgcolor: '#f0f9ff',
              },
            }
          }}
          onClick={() => handleActionClick(action.action)}
        />
      ))}
    </SpeedDial>
  );
};

export default CustomSpeedDial;