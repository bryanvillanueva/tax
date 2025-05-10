import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, MenuItem, Alert, Grid } from '@mui/material';
import useCalculations from '../utils/useCalculations';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalculateIcon from '@mui/icons-material/Calculate';
import QbidModal from './QbidModal';

const AmendedPriorYearsForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [missedDeductions, setMissedDeductions] = useState('');
  const [marginalRate, setMarginalRate] = useState('');
  const [originalTaxableIncome, setOriginalTaxableIncome] = useState('');
  const [askForRefund, setAskForRefund] = useState('No');
  const [QBID, setQbid] = useState('');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
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

  const calculateTaxableDifference = (originalIncome, missedDeductions) => {
    const difference = originalIncome - missedDeductions;
    return difference <= 0 ? 0 : difference;
  };

  const calculateAdjustedTax = (originalIncome, marginalRate, taxableDifference) => {
    return (originalIncome * marginalRate / 100) - (taxableDifference * marginalRate / 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations for required fields
    if (!missedDeductions || parseFloat(missedDeductions) <= 0) {
      setError('Expenses and deductions missed in previous years is required and must be greater than 0.');
      return;
    }

    if (!marginalRate || parseFloat(marginalRate) <= 0 || parseFloat(marginalRate) > 100) {
      setError('Taxpayer Marginal Rate is required and must be a percentage between 0 and 100.');
      return;
    }

    if (!originalTaxableIncome || parseFloat(originalTaxableIncome) <= 0) {
      setError('Original Taxable Income is required and must be greater than 0.');
      return;
    }

    setError(null);

    const taxableDifference = calculateTaxableDifference(parseFloat(originalTaxableIncome), parseFloat(missedDeductions));
    const adjustedTax = calculateAdjustedTax(parseFloat(originalTaxableIncome), parseFloat(marginalRate), taxableDifference);
    const taxCreditsResults = askForRefund === 'Yes' ? 0 : adjustedTax;


    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      missedDeductions: parseFloat(missedDeductions),
      marginalRate: parseFloat(marginalRate),
      originalTaxableIncome: parseFloat(originalTaxableIncome),
      askForRefund: askForRefund === 'Yes',
      taxableDifference,
      adjustedTax: taxCreditsResults,
      taxCreditsResults,
      formType,
      QBID: QBID ? parseFloat(QBID) : 0,
      partnershipShare: partnershipShare ? parseFloat(partnershipShare) : 0,
      calculationType: 'amendedPriorYears',
    });
    

    onCalculate(results);
  };
  
  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        {/* Enlace en la esquina superior derecha */}
        <Box sx={{ position: 'absolute', top: -10, right: 0, }}>
          <Button
            href="https://cmltaxplanning.com/docs/S14.pdf"
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
                label="Expenses and Deductions Missed in Previous Years"
                fullWidth
                type="number"
                value={missedDeductions}
                onChange={(e) => setMissedDeductions(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Taxpayer Marginal Rate (%)"
                fullWidth
                value={marginalRate}
                onChange={(e) => setMarginalRate(e.target.value)}
                margin="normal"
              >
                <MenuItem value={10}>10%</MenuItem>
                <MenuItem value={12}>12%</MenuItem>
                <MenuItem value={21}>21%</MenuItem>
                <MenuItem value={22}>22%</MenuItem>
                <MenuItem value={24}>24%</MenuItem>
                <MenuItem value={32}>32%</MenuItem>
                <MenuItem value={35}>35%</MenuItem>
                <MenuItem value={37}>37%</MenuItem>
              </TextField>

              <TextField
                label="Original Taxable Income"
                fullWidth
                type="number"
                value={originalTaxableIncome}
                onChange={(e) => setOriginalTaxableIncome(e.target.value)}
                margin="normal"
              />

              <TextField
                select
                label="Ask for a Refund?"
                fullWidth
                value={askForRefund}
                onChange={(e) => setAskForRefund(e.target.value)}
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

export default AmendedPriorYearsForm;

