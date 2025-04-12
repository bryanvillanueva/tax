import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box, 
  Typography,
  IconButton,
  Collapse
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import QualifiedBusinessIncomeDeduction from './QualifiedBusinessIncomeDeduction';
import QbidStandardMethod from './QbidStandardMethod';
import QBIDResultsDisplay from './QBIDResultsDisplay';
import QbidResults from './QbidResults';

const QbidModal = ({ open, onClose, onSelect }) => {
  const [activeForm, setActiveForm] = useState(null);
  const [calculationResults, setCalculationResults] = useState(null);
  
  const handleSelectQbidSimplified = () => {
    setActiveForm('simplified');
    setCalculationResults(null);
  };

  const handleSelectQbidStandard = () => {
    setActiveForm('standard');
    setCalculationResults(null);
  };
  
  const handleBackToOptions = () => {
    setActiveForm(null);
    setCalculationResults(null);
  };

  const handleFormCalculation = (results) => {
    console.log("Results received from QBID form:", results);
    
    // Guardar los resultados localmente, pero NO cerrar el modal
    setCalculationResults(results);
    
    // No actualizamos el valor del formulario principal aquí
    // Solo lo haremos cuando el usuario haga clic en "Apply Results"
  };
  
  // Función para aplicar el resultado y cerrar el modal
  const handleApplyResults = () => {
    // Enviar los resultados al componente padre con indicación de cerrar
    if (calculationResults) {
      // Preparar el resultado a enviar basado en el formulario activo
      let qbidValue;
      
      if (activeForm === 'simplified') {
        // Para QBID Simplified, usar "smallerOfQbidAndLimit"
        qbidValue = calculationResults.smallerOfQbidAndLimit;
        console.log("Using smallerOfQbidAndLimit value:", qbidValue);
      } else if (activeForm === 'standard' && calculationResults.totalQbid !== undefined) {
        // Para QBID Standard, usar "Total QBID"
        qbidValue = calculationResults.totalQbid;
        console.log("Using totalQbid value:", qbidValue);
      } else if (calculationResults.qbidAmount !== undefined) {
        // Respaldo para mantener compatibilidad
        qbidValue = calculationResults.qbidAmount;
        console.log("Using fallback qbidAmount value:", qbidValue);
      } else {
        console.log("No valid QBID value found in results:", calculationResults);
        qbidValue = 0; // Valor por defecto si no se encuentra ningún valor válido
      }
      
      // Crear un objeto de resultados con el campo qbidAmount para compatibilidad con el componente padre
      const resultToSend = {
        ...calculationResults,
        qbidAmount: qbidValue
      };
      
      console.log("Sending result to parent:", resultToSend);
      onSelect(resultToSend, true);
    }
    
    // Cerrar el modal
    handleClose();
  };
  
  // Cerrar el modal reinicia también la selección del formulario y resultados
  const handleClose = () => {
    onClose();
    setActiveForm(null);
    setCalculationResults(null);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth={activeForm ? "md" : "xs"}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }
      }}
      // Corregir problemas de accesibilidad
      aria-labelledby="qbid-dialog-title"
      disableEnforceFocus={false}
      disableAutoFocus={false}
    >
      <DialogTitle 
        id="qbid-dialog-title"
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #e0e0e0',
          position: 'sticky',
          top: 0,
          backgroundColor: '#0858e6',
          backgroundImage: 'linear-gradient(135deg, #0858e6 0%, #4481eb 100%)',
          zIndex: 10
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {activeForm && (
            <Button 
              size="small" 
              sx={{ mr: 1, color: 'white' }}
              onClick={handleBackToOptions}
            >
              Back
            </Button>
          )}
          <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
            {activeForm === 'simplified' ? 'QBID Simplified' : 
             activeForm === 'standard' ? 'QBID Standard' : 
             'Calculate QBID'}
          </Typography>
        </Box>
        <IconButton 
  edge="end" 
  color="inherit" 
  onClick={handleClose} 
  aria-label="close"
  size="small"
>
  <CloseIcon fontSize="small" sx={{ color: 'white' }} />
</IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2, pt: 3 }}>
        {/* Opciones de selección */}
        <Collapse in={activeForm === null}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, marginTop: 1 }}>
            Select a method to calculate QBID
          </Typography>
          
          <Box 
            onClick={handleSelectQbidSimplified}
            sx={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: '4px', 
              p: 2, 
              mb: 2,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(8, 88, 230, 0.04)',
                borderColor: '#0858e6',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: '1px solid #0858e6',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mr: 1,
                  fontSize: '0.75rem',
                  color: '#0858e6',
                }}
              >
                i
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                QBID Simplified
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ ml: 4, color: 'text.secondary', fontSize: '0.85rem' }}>
              Simplified method for small businesses
            </Typography>
          </Box>
          
          <Box 
            onClick={handleSelectQbidStandard}
            sx={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: '4px', 
              p: 2,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(8, 88, 230, 0.04)',
                borderColor: '#0858e6',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: '1px solid #0858e6',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mr: 1,
                  fontSize: '0.75rem',
                  color: '#0858e6',
                }}
              >
                i
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                QBID Standard
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ ml: 4, color: 'text.secondary', fontSize: '0.85rem' }}>
              Method with W-2 and UBIA limitations
            </Typography>
          </Box>
        </Collapse>
        
        {/* Formulario QBID Simplified */}
        <Collapse in={activeForm === 'simplified'}>
          <QualifiedBusinessIncomeDeduction onCalculate={handleFormCalculation} />
          
          {/* Mostrar resultados cuando estén disponibles - QBID Simplified */}
          {activeForm === 'simplified' && calculationResults && (
            <Box mt={4}>
              <QBIDResultsDisplay results={calculationResults} />
            </Box>
          )}
        </Collapse>
        
        {/* Formulario QBID Standard */}
        <Collapse in={activeForm === 'standard'}>
          <QbidStandardMethod onCalculate={handleFormCalculation} />
          
          {/* Mostrar resultados cuando estén disponibles - QBID Standard */}
          {activeForm === 'standard' && calculationResults && (
            <Box mt={4}>
              <QbidResults results={calculationResults} />
            </Box>
          )}
        </Collapse>
      </DialogContent>
      
      {!activeForm && (
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0', justifyContent: 'center' }}>
          <Typography variant="caption" color="text.secondary">
          The calculated value will be displayed below. You must press the APPLY button to insert the result into this field
          </Typography>
        </DialogActions>
      )}
      
      {/* Botón para aplicar resultados cuando hay cálculos disponibles - posición fija */}
      {calculationResults && (
        <DialogActions 
          sx={{ 
            p: 2, 
            borderTop: '1px solid #e0e0e0', 
            justifyContent: 'flex-end',
            position: 'sticky',
            bottom: 0,
            backgroundColor: 'white',
            zIndex: 10
          }}
        >
          <Button 
            onClick={handleApplyResults}
            variant="contained"
            color="primary"
          >
            Apply Results
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default QbidModal;