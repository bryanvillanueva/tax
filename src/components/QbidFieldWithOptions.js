import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Box,
  Typography,
  Popover,
  Button,
  Paper,
  Stack,
  Divider
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import { useStrategy } from '../context/StrategyContext';

// Componente para el campo QBID con opciones avanzadas
const QbidFieldWithOptions = ({ value, onChange, formValues }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { navigateToQbid, getAndClearQbidValue, updateFormValues } = useStrategy();
  
  // Verificar si hay un valor QBID calculado al montar el componente
  useEffect(() => {
    const calculatedQbid = getAndClearQbidValue();
    if (calculatedQbid) {
      onChange(calculatedQbid);
    }
  }, [getAndClearQbidValue, onChange]);

  // Cada vez que cambian los valores del formulario, actualizarlos en el contexto
  useEffect(() => {
    // Para evitar bucles infinitos, solo actualizar si los valores cambian realmente
    const formValuesString = JSON.stringify(formValues);
    const updateContext = () => {
      if (formValues) {
        const sanitizedValues = {};
        Object.keys(formValues).forEach(key => {
          if (formValues[key] !== undefined && formValues[key] !== null) {
            sanitizedValues[key] = formValues[key];
          }
        });
        updateFormValues(sanitizedValues);
      }
    };
    
    // Usar un ID para evitar actualizaciones rápidas
    const timeoutId = setTimeout(updateContext, 100);
    return () => clearTimeout(timeoutId);
  }, [formValues, updateFormValues]);

  // Abrir popover
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Cerrar popover
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Navegar a QBID Simplified
  const handleNavigateToSimplified = () => {
    navigateToQbid('qbidCalculation');
    handleClose();
  };

  // Navegar a QBID Standard
  const handleNavigateToStandard = () => {
    navigateToQbid('QbidStandardMethod');
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'qbid-popover' : undefined;

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        label="QBID (Qualified Business Income Deduction)"
        fullWidth
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        margin="normal"
        InputProps={{
          endAdornment: (
            <Box 
              onClick={handleClick}
              sx={{ 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center',
                color: '#0858e6',
                '&:hover': {
                  color: '#0645b4',
                }
              }}
            >
              <CalculateOutlinedIcon sx={{ mr: 0.5 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Calcular
              </Typography>
            </Box>
          ),
        }}
      />

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1, 
            borderRadius: '8px',
            width: 300,
            overflow: 'hidden'
          }
        }}
      >
        <Paper sx={{ p: 0 }}>
          <Box sx={{ 
            p: 2, 
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0858e6' }}>
              Calcular QBID
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
              Seleccione un método para calcular QBID
            </Typography>
          </Box>
          
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Button
                variant="outlined"
                onClick={handleNavigateToSimplified}
                fullWidth
                startIcon={<InfoOutlinedIcon />}
                sx={{ 
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  borderColor: '#e5e7eb',
                  color: '#374151',
                  '&:hover': {
                    backgroundColor: '#f9fafb',
                    borderColor: '#d1d5db',
                  }
                }}
              >
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>QBID Simplified</Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#6b7280' }}>
                    Método simplificado para empresas pequeñas
                  </Typography>
                </Box>
              </Button>
              
              <Button
                variant="outlined"
                onClick={handleNavigateToStandard}
                fullWidth
                startIcon={<InfoOutlinedIcon />}
                sx={{ 
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  borderColor: '#e5e7eb',
                  color: '#374151',
                  '&:hover': {
                    backgroundColor: '#f9fafb',
                    borderColor: '#d1d5db',
                  }
                }}
              >
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>QBID Standard</Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#6b7280' }}>
                    Método completo con limitaciones W-2 y UBIA
                  </Typography>
                </Box>
              </Button>
            </Stack>
          </Box>
          
          <Divider />
          
          <Box sx={{ p: 1.5, backgroundColor: '#f9fafb' }}>
            <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', textAlign: 'center' }}>
              El valor calculado se aplicará automáticamente a este campo
            </Typography>
          </Box>
        </Paper>
      </Popover>
    </Box>
  );
};

export default QbidFieldWithOptions;