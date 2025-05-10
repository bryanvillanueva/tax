import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Grid, MenuItem, Alert } from '@mui/material';
import useCalculations from '../utils/useCalculations';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalculateIcon from '@mui/icons-material/Calculate';
import QbidModal from './QbidModal';


const CostSegregationForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [realEstateValue, setRealEstateValue] = useState('');
  const [depreciation, setDepreciation] = useState('');
  const [assetsReclassifiedValue, setAssetsReclassifiedValue] = useState('');
  const [assetsUsefulLife, setAssetsUsefulLife] = useState('');
  const [error, setError] = useState(null);
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [newDepreciation, setNewDepreciation] = useState(null); 
  const [QBID, setQbid] = useState('');
  const [partnershipShare, setPartnershipShare] = useState('');
  const [qbidModalOpen, setQbidModalOpen] = useState(false);

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

  const calculateNewDepreciation = (realEstateValue, assetsReclassifiedValue, assetsUsefulLife) => {
    if (realEstateValue && assetsReclassifiedValue && assetsUsefulLife) {
      const depreciation = ((realEstateValue - assetsReclassifiedValue) / (39 * 12)) + ((assetsReclassifiedValue / (assetsUsefulLife * 12)));
      return depreciation;
    } else {
      return 0; 
    }
  };
 const AAD = (newDepreciation - depreciation ) *12;
 console.log("AAD: ", AAD); 
  


  useEffect(() => {
    const calculatedDepreciation = realEstateValue ? realEstateValue / (39 * 12) : 0; 
    setDepreciation(calculatedDepreciation); 
  }, [realEstateValue]); 

  useEffect(() => {
    if (realEstateValue && assetsReclassifiedValue && assetsUsefulLife) {
      const calculatedNewDepreciation = calculateNewDepreciation(
        parseFloat(realEstateValue),
        parseFloat(assetsReclassifiedValue),
        parseInt(assetsUsefulLife)
      );
      setNewDepreciation(calculatedNewDepreciation); 
    }
  }, [realEstateValue, assetsReclassifiedValue, assetsUsefulLife]); 

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!filingStatus || !grossIncome || !partnerType || !realEstateValue || !depreciation || !assetsReclassifiedValue || !assetsUsefulLife) {
      setError('All fields are required.');
      return;
    }

    setError(null);

    const newDepreciation = calculateNewDepreciation(
      parseFloat(realEstateValue),
      parseFloat(assetsReclassifiedValue),
      parseInt(assetsUsefulLife)
    );

    const calculatedDeduction = newDepreciation * 12; 
    
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      realEstateValue: parseFloat(realEstateValue),
      depreciation: parseFloat(depreciation),
      assetsReclassifiedValue: parseFloat(assetsReclassifiedValue),
      assetsUsefulLife: parseInt(assetsUsefulLife),
      deduction: calculatedDeduction,  
      formType,
      AAD: parseFloat(AAD),
      calculationType: 'costSegregation',
      QBID: QBID ? parseFloat(QBID) : 0,
      partnershipShare: partnershipShare ? parseFloat(partnershipShare) : 0,
    });

    onCalculate(results);
  };

  // Formato para mostrar como moneda en USD
  const formatCurrency = (value) => {
    return value ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$0.00';
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        {/* Enlace en la esquina superior derecha */}
        <Box sx={{ position: 'absolute', top: -10, right: 0, }}>
          <Button
            href="https://cmltaxplanning.com/docs/S16.pdf"
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
            {/* Left side with 4 fields */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Filing Status"
                fullWidth
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="MFJ">Married Filing Jointly</MenuItem>
                <MenuItem value="MFS">Married Filing Separately</MenuItem>
                <MenuItem value="HH">Head of Household</MenuItem>
                <MenuItem value="QSS">Qualified Surviving Spouse</MenuItem>
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
                label="Type of Partner"
                fullWidth
                value={partnerType}
                onChange={(e) => setPartnerType(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Passive">Passive</MenuItem>
              </TextField>

              <TextField
                label="Value of Real Estate Property"
                fullWidth
                type="number"
                value={realEstateValue}
                onChange={(e) => setRealEstateValue(e.target.value)}
                margin="normal"
              />
                <TextField
                label="Current monthly depreciation (39 years)"
                fullWidth
                type="text"
                value={formatCurrency(depreciation)} 
                margin="normal"
                disabled
              />
            </Grid>

            {/* Right side with 4 fields */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Value of Assets Reclassified"
                fullWidth
                type="number"
                value={assetsReclassifiedValue}
                onChange={(e) => setAssetsReclassifiedValue(e.target.value)}
                margin="normal"
              />

              <TextField
                select
                label="Assets' Useful Life Reclassified (in years)"
                fullWidth
                value={assetsUsefulLife}
                onChange={(e) => setAssetsUsefulLife(e.target.value)}
                margin="normal"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={15}>15</MenuItem>
              </TextField>

              {/* Display the result of New Annual Depreciation */}
              <TextField
                label="New Annual Depreciation"
                fullWidth
                type="text"
                value={newDepreciation !== null ? formatCurrency(newDepreciation) : 'Calculating...'}
                disabled
                margin="normal"
              />
              <TextField
                label="Additional annual depreciation"
                fullWidth
                type="text"
                value={AAD !== null ? formatCurrency(AAD) : 'Calculating...'}
                disabled
                margin="normal"
              />

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

export default CostSegregationForm;

