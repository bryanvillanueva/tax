import React from 'react';
import { Typography, Avatar, Box } from '@mui/material';

const UserProfile = ({ userData }) => {
  return (
    <Box
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
      }}
    >
      {userData && (
        <>
          <Typography variant="body1" sx={{ mr: 2, fontWeight: 'bold' }}>
            {`${userData.first_name} ${userData.last_name}`}
          </Typography>
          <Avatar
            alt={userData.first_name}
            src={userData.profilePicture || 'https://tax.bryanglen.com/user.png'}
            
          />
        </>
      )}
    </Box>
  );
};

export default UserProfile;
