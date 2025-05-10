import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid, Typography } from '@mui/material';
import useCalculations from '../utils/useCalculations';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalculateIcon from '@mui/icons-material/Calculate';
import QbidModal from './QbidModal';


const EducationTaxCreditForm = ({ onCalculate }) => {
  const [grossIncome, setGrossIncome] = useState('');
  const [taxpayerMAGI, setTaxpayerMAGI] = useState('');
  const [qualifiedEducationExpenses, setQualifiedEducationExpenses] = useState('');
  const [MFJ, setMFJ] = useState('No');
  const [MTAR, setMTAR] = useState('Yes');
  const [partnerType, setPartnerType] = useState('Active'); 
  const [filingStatus, setFilingStatus] = useState('MFJ'); 
  const [limit, setLimit] = useState(''); 
  const [phaseOut, setPhaseOut] = useState(''); 
  const [maximumRefundable, setMaximumRefundable] = useState(null); 
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [QBID, setQbid] = useState('');
  const [partnershipShare, setPartnershipShare] = useState('');
  const [qbidModalOpen, setQbidModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

  // Funciones para manejar el modal QBID
  const handleQbidCalculateClick = () => {
    setQbidModalOpen(true);
  };

  const handleCloseQbidModal = () => {
    setQbidModalOpen(false);
  };

  const handleQbidSelection = (results, shouldClose = false) => {
    console.log("handleQbidSelection received:", results);
    
    // Recibimos los resultados del cálculo de QBID desde el formulario en el modal
    if (results && results.qbidAmount !== undefined) {
      // Asegurar que el valor es un número
      const qbidValue = parseFloat(results.qbidAmount);
      
      // Actualizamos el valor del QBID con el resultado calculado
      if (!isNaN(qbidValue)) {
        console.log("Setting QBID value to:", qbidValue);
        setQbid(qbidValue.toString());
      } else {
        console.warn("Invalid QBID value received:", results.qbidAmount);
      }
    } else {
      console.warn("No qbidAmount found in results:", results);
    }
    
    // Solo cerramos el modal si se indica explícitamente (cuando se presiona "Apply Results")
    if (shouldClose) {
      setQbidModalOpen(false);
    }
  };

  // Efecto para registrar cambios en el valor QBID
  useEffect(() => {
    console.log("QBID state value changed:", QBID);
  }, [QBID]);

// Función para calcular el límite
const calculateLimit = (MFJ, taxpayerMAGI) => {
  if (!taxpayerMAGI) return 0; // Si no hay MAGI, retorna 0
  
  if (MFJ === 'Yes') {
    const result = 180000 - taxpayerMAGI; // Calcula el límite para MFJ
    return result >= 0 ? result : 0; // Si el resultado es negativo, retorna 0
  } else {
    const result = 90000 - taxpayerMAGI; // Calcula el límite para no MFJ
    return result >= 0 ? result : 0; // Si el resultado es negativo, retorna 0
  }
};

  // Función para calcular el Phase-out
  const calculatePhaseOut = (MFJ) => {
    if (MFJ === 'Yes') {
      return 20000; // Si MFJ es "Yes", el Phase-out es 20000
    } else {
      return 10000; // Si MFJ es "No", el Phase-out es 10000
    }
  };

  // Recalcular el límite y Phase-out cuando MFJ o MAGI cambian
  useEffect(() => {
    // Calcula el límite usando la nueva lógica
    const calculatedLimit = calculateLimit(MFJ, taxpayerMAGI);
    setLimit(calculatedLimit); // Actualiza el estado del límite
  
    // Calcula el Phase-out según MFJ
    const calculatedPhaseOut = MFJ === 'Yes' ? 20000 : 10000; // Valores para MFJ y no MFJ
    setPhaseOut(calculatedPhaseOut); // Actualiza el estado del Phase-out
  }, [MFJ, taxpayerMAGI]); // Solo se ejecuta cuando MFJ o MAGI cambian
  

  // Funcion para calcular el Non refundable Tax Credits

  const calculateNRTC = (limit, phaseOut, qualifiedEducationExpenses) => {
    // Validar los valores de entrada
    if (!limit || !phaseOut || !qualifiedEducationExpenses) {
      console.log('Invalid inputs for NRTC calculation.');
      return 0;
    }
  
    let NRTC;
  
    // Verificar si Limit >= Phase-out (PO)
    if (limit >= phaseOut) {
      // Si QEE >= 4000
      if (qualifiedEducationExpenses >= 4000) {
        NRTC = (4000 - 2000) + 500; // 2500
      } else {
        NRTC = (qualifiedEducationExpenses - 2000) + 500;
      }
    } else {
      // Si Limit < Phase-out
      if (qualifiedEducationExpenses >= 4000) {
        NRTC = ((4000 - 2000) + 500) * (limit / phaseOut);
      } else {
        NRTC = ((qualifiedEducationExpenses - 2000) + 500) * (limit / phaseOut);
      }
    }
  
    console.log('NRTC Calculation Result:', NRTC);
    return NRTC;
  };

  // Calcular los Non Refundable Tax Credits
  const NRTC = calculateNRTC(limit, phaseOut, parseFloat(qualifiedEducationExpenses));

  
// calcular los Tax credits
  const calculateTaxCredits = (limit, phaseOut, qualifiedEducationExpenses, MTAR, maximumRefundable, NRTC) => {
    // Validar los valores de entrada
    if (!limit || !phaseOut || !qualifiedEducationExpenses) {
      console.log('Invalid inputs for tax credits calculation.');
      return 0;
    }
  
    // Nueva lógica: Si MTAR es "Yes", retorna MAR; de lo contrario, retorna NRTC
    if (MTAR === 'Yes') {
      console.log('Tax Credits Result (MAR):', maximumRefundable);
      return maximumRefundable;
    } else {
      console.log('Tax Credits Result (NRTC):', NRTC);
      return NRTC;
    }
  };

  // Calcular los Tax Credits (Tax results)
  const taxCreditsResults = calculateTaxCredits(limit, phaseOut, parseFloat(qualifiedEducationExpenses), MTAR, maximumRefundable, NRTC);
    


  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones para los campos requeridos
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!taxpayerMAGI || parseFloat(taxpayerMAGI) <= 0) {
      setError('Taxpayer Modified Adjusted Gross Income (MAGI) is required and must be greater than 0.');
      return;
    }

    if (!qualifiedEducationExpenses || parseFloat(qualifiedEducationExpenses) < 0) {
      setError('Qualified Education Expenses is required and cannot be negative.');
      return;
    }

    setError(null);

    
    

    // Calcular el Maximum Refundable
    const maxRefundable = NRTC * 0.4;
    setMaximumRefundable(maxRefundable);

    const results = performCalculations({
      grossIncome: parseFloat(grossIncome),
      taxpayerMAGI: parseFloat(taxpayerMAGI),
      qualifiedEducationExpenses: parseFloat(qualifiedEducationExpenses),
      MFJ: MFJ === 'Yes',
      partnerType,
      filingStatus,
      taxCreditsResults,
      formType,
      MTAR: MTAR === 'Yes',
      NRTC,
      calculationType: 'educationTaxCredit',
      QBID: QBID ? parseFloat(QBID) : 0,
      partnershipShare: partnershipShare ? parseFloat(partnershipShare) : 0,
    });
    
    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        {/* Enlace en la esquina superior derecha */}
        <Box sx={{ position: 'absolute', top: -10, right: 0, }}>
          <Button
            href="https://cmltaxplanning.com/docs/S19.pdf"
            target="_blank"
            sx={{ textTransform: 'none', backgroundColor: '#ffffff', color: '#0858e6', fontSize: '0.875remc', marginBottom: '150px', }}
            startIcon={<InfoOutlinedIcon />}
          >
            View Strategy Details
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Filing Status"
                fullWidth
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value)}
                margin="normal"
              >
                <MenuItem value="MFJ">Married Filing Jointly</MenuItem>

              </TextField>
              <TextField
                label="Gross Income"
                fullWidth
                type="number"
                value={grossIncome}
                onChange={(e) => setGrossIncome(e.target.value)}
                margin="normal"
              />
              <TextField
                select
                label="Partner Type"
                fullWidth
                value={partnerType}
                onChange={(e) => setPartnerType(e.target.value)} // Nuevo campo para Partner Type
                margin="normal"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Passive">Passive</MenuItem>
              </TextField>
              <TextField
                label="Taxpayer Modified Adjusted Gross Income (MAGI)"
                fullWidth
                type="number"
                value={taxpayerMAGI}
                onChange={(e) => setTaxpayerMAGI(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
            <TextField
                select
                label="Married Filing Jointly (MFJ)"
                fullWidth
                value={MFJ}
                onChange={(e) => setMFJ(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
              <TextField
                label="Qualified Education Expenses"
                fullWidth
                type="number"
                value={qualifiedEducationExpenses}
                onChange={(e) => setQualifiedEducationExpenses(e.target.value)}
                margin="normal"
              />
             <TextField
                select
                label="Make the AOTC refundable?"
                fullWidth
                value={MTAR}
                onChange={(e) => setMTAR(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>

              <TextField
                select
                label="Form Type"
                fullWidth
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                margin="normal"
              >
                <MenuItem value="1040 - Schedule C/F">1040 - Schedule C/F</MenuItem>
                <MenuItem value="1040NR - Schedule E">1040NR - Schedule E</MenuItem>
                <MenuItem value="1065">1065</MenuItem>
                <MenuItem value="1120S">1120S</MenuItem>
                <MenuItem value="1120">1120</MenuItem>
              </TextField>

              {(formType === '1065' || formType === '1120S') && (
                <TextField
                  label="% Share if partnership"
                  fullWidth
                  type="number"
                  value={partnershipShare}
                  onChange={(e) => {
                    // Limitar el valor entre 0 y 100
                    const value = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                    setPartnershipShare(value.toString());
                  }}
                  margin="normal"
                  InputProps={{
                    inputProps: { min: 0, max: 100 },
                    endAdornment: (
                      <span style={{ marginRight: '8px' }}>%</span>
                    ),
                  }}
                  helperText="Enter your partnership share percentage (0-100%)"
                />
              )}
              
              <Box sx={{ position: 'relative' }}>
                <TextField
                  label="QBID (Qualified Business Income Deduction)"
                  fullWidth
                  type="number"
                  value={QBID}
                  onChange={(e) => setQbid(e.target.value)}
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <Button
                        onClick={handleQbidCalculateClick}
                        size="small"
                        aria-label="calculate QBID"
                        sx={{
                          color: '#0858e6',
                          textTransform: 'none',
                          fontSize: '0.8rem',
                          fontWeight: 'normal',
                          minWidth: 'auto',
                          ml: 1,
                          p: '4px 8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: 'transparent',
                          '&:hover': {
                            backgroundColor: 'rgba(8, 88, 230, 0.08)',
                          }
                        }}
                      >
                        <CalculateIcon fontSize="small" />
                        Calculate
                      </Button>
                    ),
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#0858e6', color: '#fff' }}>
              Calculate
            </Button>
          </Box>
        </form>
      </Box>

      {/* Modal para QBID */}
      <QbidModal 
        open={qbidModalOpen} 
        onClose={handleCloseQbidModal} 
        onSelect={handleQbidSelection}
      />
    </Container>
  );
};

export default EducationTaxCreditForm;

