import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid, IconButton } from '@mui/material';
import useCalculations from '../utils/useCalculations';
import { getMarginalTaxRateAndLevel, calculateTaxableIncome, calculateAGI, calculateSEMedicare } from '../utils/calculations';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalculateIcon from '@mui/icons-material/Calculate';
import QbidModal from './QbidModal';




const SavingsPlanForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [annualContribution, setAnnualContribution] = useState('');
  const [numberOfChildren, setNumberOfChildren] = useState('');
  const [averageInterestRate, setAverageInterestRate] = useState('');
  const [taxPayerMarginaltRate, setTaxPayerMarginaltRate] = useState('');
  const [totalYears, setTotalYears] = useState('');
  const [totalAnnualContribution, setTotalAnnualContribution] = useState(null);
  const [futureValue, setFutureValue] = useState(null);
  const [totalTaxSavings, setTotalTaxSavings] = useState(null);
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

  // Calcular el selfEmploymentTax
  const calculateSelfEmploymentTax = (grossIncome, partnerType) => {
    if (partnerType === 'Active') {
      const seSocialSecurity = Math.min(grossIncome * 0.9235, 168600) * 0.124;
      const seMedicare = calculateSEMedicare(grossIncome);
      return seSocialSecurity + seMedicare;
    }
    return 0;
  };

  
  

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations for required fields
    if (!annualContribution || parseFloat(annualContribution) <= 0) {
      setError('Annual Contribution per Child is required and must be greater than 0.');
      return;
    }

    if (!numberOfChildren || parseInt(numberOfChildren) <= 0) {
      setError('Number of Children is required and must be greater than 0.');
      return;
    }

    if (!averageInterestRate || parseFloat(averageInterestRate) <= 0 || parseFloat(averageInterestRate) > 100) {
      setError("Plan's Average Interest Rate is required and must be a percentage between 0 and 100.");
      return;
    }

    if (!totalYears || parseInt(totalYears) <= 0) {
      setError('Total Years is required and must be greater than 0.');
      return;
    }

    setError(null);
    
    //calcular marginal rate
    const totalAnnualContribution = parseFloat(annualContribution) * parseInt(numberOfChildren);
    const selfEmploymentTax = calculateSelfEmploymentTax(parseFloat(grossIncome), partnerType);
    const agi = calculateAGI(parseFloat(grossIncome), selfEmploymentTax); 
    const taxableIncome = calculateTaxableIncome(agi, filingStatus);
    const { marginalRate } = getMarginalTaxRateAndLevel(filingStatus, taxableIncome);
    const futureValue = (totalAnnualContribution * Math.pow(1 + parseFloat(averageInterestRate) / 100 / 12, 12 * parseInt(totalYears))) - totalAnnualContribution;
    const totalTaxSavings = (futureValue * taxPayerMarginaltRate) * 100;
    

    setTotalAnnualContribution(totalAnnualContribution);
    setFutureValue(futureValue);
    setTotalTaxSavings(totalTaxSavings);
  
    

    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      annualContribution: parseFloat(annualContribution),
      numberOfChildren: parseInt(numberOfChildren),
      totalAnnualContribution,
      futureValue,
      totalTaxSavings,
      averageInterestRate: parseFloat(averageInterestRate),
      totalYears: parseInt(totalYears),
      formType,
      QBID: QBID ? parseFloat(QBID) : 0,
      partnershipShare: partnershipShare ? parseFloat(partnershipShare) : 0,
      calculationType: 'savingsPlan',
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        {/* Enlace en la esquina superior derecha */}
        <Box sx={{ position: 'absolute', top: -10, right: 0, }}>
          <Button
            href="https://cmltaxplanning.com/docs/S11.pdf"
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
                label="Annual Contribution Per Children"
                fullWidth
                type="number"
                value={annualContribution }
                onChange={(e) => setAnnualContribution(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Total Annual Contribution"
                fullWidth
                type="text"
                value={totalAnnualContribution !== null ? totalAnnualContribution.toFixed(2) : ''}
                margin="normal"
                disabled
                InputProps={{
                  sx: { fontWeight: 'bold', color: '#333' },
                }}
              />
                <TextField
                label="Number of Children"
                fullWidth
                type="number"
                value={numberOfChildren}
                onChange={(e) => setNumberOfChildren(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Plan's Average Interest Rate (%)"
                fullWidth
                type="number"
                value={averageInterestRate}
                onChange={(e) => setAverageInterestRate(e.target.value)}
                margin="normal"
                InputProps={{
                  endAdornment: <span>%</span>,
                }}
              />

              <TextField
                label="Total Years"
                fullWidth
                type="number"
                value={totalYears}
                onChange={(e) => setTotalYears(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Total interes over the first years"
                fullWidth
                type="text"
                value={futureValue !== null ? futureValue.toFixed(2) : ''}
                margin="normal"
                disabled
                InputProps={{
                  sx: { fontWeight: 'bold', color: '#333' }, // Negrita y color más oscuro
                }}
              />
              
              <TextField
                label="Taxpayer's marginal rate"
                fullWidth
                type="number"
                value={taxPayerMarginaltRate}
                onChange={(e) => setTaxPayerMarginaltRate(e.target.value)}
                margin="normal"
                InputProps={{
                  endAdornment: <span style={{ marginLeft: '8px' }}>%</span>,
                }}
              />
              <TextField
                label="Total Estimate Tax Savings"
                fullWidth
                type="text"
                value={
                  totalTaxSavings !== null
                    ? new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(totalTaxSavings)
                    : ''
                }
                margin="normal"
                disabled
                InputProps={{
                  sx: { fontWeight: 'bold', color: '#333' },
                }}
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

              {formType === '1065' && (
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

export default SavingsPlanForm;

