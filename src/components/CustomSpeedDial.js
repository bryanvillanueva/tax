import React from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import WhatsappIcon from '@mui/icons-material/WhatsApp';
import { useNavigate } from 'react-router-dom';

const CustomSpeedDial = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: <HomeIcon sx={{ color: '#0954de' }} />, // Ícono Home con azul del botón principal
      name: 'Home',
      action: () => navigate('/form-selector'),
    },
    {
      icon: <FavoriteIcon sx={{ color: '#ff0000' }} />, // Ícono Favorites en rojo
      name: 'Favorites',
      action: () => navigate('/favorites'),
    },
    {
      icon: <ProfileIcon sx={{ color: '#0954de' }} />, // Ícono Profile
      name: 'Profile',
      action: () => navigate('/profile'),
    },
    {
      icon: <WhatsappIcon sx={{ color: '#93f5b0' }} />, // Wp icon Green
      name: 'Support',
      action: () => window.open('https://w.app/nVaYD9', '_blank'),
    },
  ];

  return (
    <SpeedDial
      ariaLabel="Navigation Actions"
      sx={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        '& .MuiFab-primary': {
          backgroundColor: '#0954de', // Color de fondo del SpeedDial principal
          '&:hover': {
            backgroundColor: '#0746b0', // Color de hover
          },
        },
      }}
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon} // Colores definidos en cada acción
          tooltipTitle={action.name}
          tooltipOpen
          onClick={action.action}
        />
      ))}
    </SpeedDial>
  );
};

export default CustomSpeedDial;
