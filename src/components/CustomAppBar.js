import React from 'react';
import { Typography, Avatar, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

const UserProfile = ({ userData }) => {
  const navigate = useNavigate(); // Obtener la función de navegación

  const handleClick = () => {
    navigate('/profile'); // Redirigir a la página de perfil
  };

  return (
    <Box
      onClick={handleClick} // Manejar el clic
      sx={{
        position: 'fixed',
        top: 16,
        right: 20,
        display: 'flex',
        alignItems: 'center',
        padding: '8px 10px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #0858e6 0%, #0055A4 100%)',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        color: 'white',
        zIndex: 3, // Asegura que esté por encima de todo
        cursor: 'pointer', // Cambiar el cursor a pointer para indicar que es clickable
        '@media (max-width: 600px)': {
          padding: '0px', // Reducir el padding en móviles
          borderRadius: '50%', // Hacerlo circular
          background: 'none', // Quitar el fondo en móviles
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      {userData && (
        <>
          <Typography
            variant="body1"
            sx={{
              mr: 2,
              fontWeight: 'bold',
              '@media (max-width: 600px)': {
                display: 'none', // Ocultar el nombre en móviles
              },
            }}
          >
            {`${userData.first_name} ${userData.last_name}`}
          </Typography>
          <Avatar
            alt={userData.first_name}
            src={userData.profilePicture || 'https://tax.bryanglen.com/user.png'}
            sx={{
              '@media (max-width: 600px)': {
                width: 48, // Ajustar el tamaño del avatar en móviles
                height: 48,
              },
            }}
          />
        </>
      )}
    </Box>
  );
};

export default UserProfile;