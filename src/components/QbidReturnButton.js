import React from 'react';
import { Box, Button } from '@mui/material';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { useStrategy } from '../context/StrategyContext';

// Componente para el botón de aplicar QBID y volver
const QbidReturnButton = ({ qbidValue }) => {
  const { returnToPreviousStrategy, previousStrategy } = useStrategy();

  // Solo mostrar el botón si vinimos de otra estrategia
  if (!previousStrategy) {
    return null;
  }

  const handleReturn = () => {
    if (qbidValue) {
      returnToPreviousStrategy(qbidValue);
    }
  };

  return (
    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
      <Button
        variant="contained"
        onClick={handleReturn}
        startIcon={<KeyboardReturnIcon />}
        sx={{
          backgroundColor: '#10b981',
          color: 'white',
          '&:hover': {
            backgroundColor: '#059669',
          },
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          px: 3,
          py: 1,
          borderRadius: '8px',
        }}
      >
        Aplicar QBID y volver
      </Button>
    </Box>
  );
};

export default QbidReturnButton;