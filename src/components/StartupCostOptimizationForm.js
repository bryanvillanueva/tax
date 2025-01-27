import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useCalculations from '../utils/useCalculations';

const StartupCostOptimizationForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [totalStartupCosts, setTotalStartupCosts] = useState('');
  const [optimizationAmount, setOptimizationAmount] = useState('');
  const [QBID, setQbid] = useState('');
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validaciones de los campos
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }
  
    if (!totalStartupCosts || parseFloat(totalStartupCosts) <= 0) {
      setError('Total Startup Costs is required and must be greater than 0.');
      return;
    }
  
    const parsedOptimizationAmount = optimizationAmount ? parseFloat(optimizationAmount) : 0;
      
  
    const limit1 = 5000;
    const phaseOut = 50000;
  
    // Función para calcular la reducción según la fórmula
    const calculateReduction = (limit1, totalStartupCosts, phaseOut) => {
      if (parseFloat(limit1) > parseFloat(totalStartupCosts)) {
        return 0;
      }
      const remaining = parseFloat(totalStartupCosts) - parseFloat(phaseOut);
      if (remaining >= 0) {
        return remaining >= 5000 ? 5000 : remaining;
      }
      return 0;
    };
  
    const reduction = calculateReduction(limit1, totalStartupCosts, phaseOut);
  
    // Cálculo de la primera deducción
    const calculateFirstDeduction = (totalStartupCosts, limit1, reduction) => {
       return totalStartupCosts >= limit1 ? limit1 - reduction : totalStartupCosts;
    };
   
    const firstDeduction = calculateFirstDeduction(totalStartupCosts, limit1, reduction);

    // Cálculo del monto diferido y mensual
    const deferredAmount = totalStartupCosts - firstDeduction;
    const monthlyAmount = (deferredAmount / 180).toFixed(2); 
  
    // Cálculo del reconocimiento del primer año
    const firstYearRecognition = (parseFloat(monthlyAmount) * 12) + parsedOptimizationAmount;
  
    // Cálculo de la deducción de inicio
    const deductionStartup = parseFloat(firstYearRecognition) + parseFloat(firstDeduction);
  
    
  
    setError(null);
  
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      totalStartupCosts: parseFloat(totalStartupCosts),
      formType,
      partnerType,
      limit1,
      reduction,
      firstDeduction,
      deferredAmount,
      monthlyAmount: parseFloat(monthlyAmount), 
      firstYearRecognition: parseFloat(firstYearRecognition), 
      deductionStartup: parseFloat(deductionStartup), 
      optimizationAmount: parsedOptimizationAmount,
      calculationType: 'startupCostOptimization',
      QBID: parseFloat(QBID),
    });
  
    onCalculate(results);
  };
  

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        {/* Enlace en la esquina superior derecha */}
        <Box sx={{ position: 'absolute', top: -10, right: 0 }}>
          <Button
            href="https://tax.bryanglen.com/data/Startup-Cost-Optimization-Strategy.pdf"
            target="_blank"
            sx={{ textTransform: 'none', backgroundColor: '#ffffff', color: '#0858e6', fontSize: '0.875rem', marginBottom: '150px' }}
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
            {/* Lado Izquierdo */}
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
                label="Partner Type"
                fullWidth
                value={partnerType}
                onChange={(e) => setPartnerType(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Passive">Passive</MenuItem>
              </TextField>
            </Grid>

            {/* Lado Derecho */}
            <Grid item xs={12} md={6}>
              {/* Nuevos campos */}
              <TextField
                label="Total Startup Costs"
                fullWidth
                type="number"
                value={totalStartupCosts}
                onChange={(e) => setTotalStartupCosts(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Optimization Amount"
                fullWidth
                type="number"
                value={optimizationAmount}
                onChange={(e) => setOptimizationAmount(e.target.value)}
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

              <TextField
                label="QBID (Qualified Business Income Deduction)"
                fullWidth
                type="number"
                value={QBID}
                onChange={(e) => setQbid(e.target.value)}
                margin="normal"
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#0858e6', color: '#fff' }}>
              Calculate
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default StartupCostOptimizationForm;
