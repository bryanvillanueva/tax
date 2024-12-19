import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, MenuItem, Alert, Grid } from '@mui/material';
import useCalculations from '../utils/useCalculations';

const QualifiedOpportunityFundsForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [investType, setInvestType] = useState('Section 179');
  const [cost, setCost] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [capitalGain, setCapitalGain] = useState('');
  const [investmentYears, setInvestmentYears] = useState('');
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones de los campos
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!capitalGain || parseFloat(capitalGain) <= 0) {
      setError('Capital Gain to be invested in QOF is required and must be greater than 0.');
      return;
    }

    if (!investmentYears) {
      setError('Number of years the investment will be held is required.');
      return;
    }

    setError(null);

    // Calcular Capital Gain Tax Deferred (20% rate)
    const capitalGainValue = parseFloat(capitalGain);
    const capitalGainTaxDeferred = capitalGainValue * 0.2;

    // Reduction in Net Income
    const reductionInNetIncome = capitalGainValue;

    // Llamada al hook con calculationType 'qualifiedOpportunityFunds'
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      cost: parseFloat(cost),
      investType,
      partnerType,
      capitalGainTaxDeferred,
      reductionInNetIncome,
      calculationType: 'qualifiedOpportunityFunds',
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ mt: 5 }}>

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
                label="Type of Partner"
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
              <TextField
                label="Capital Gain to be Invested in QOF"
                fullWidth
                type="number"
                value={capitalGain}
                onChange={(e) => setCapitalGain(e.target.value)}
                margin="normal"
              />

              <TextField
                select
                label="Number of Years the Investment Will be Held"
                fullWidth
                value={investmentYears}
                onChange={(e) => setInvestmentYears(e.target.value)}
                margin="normal"
              >
                <MenuItem value="1-9">Between 1 and 9 years</MenuItem>
                <MenuItem value=">10">Ten or more</MenuItem>
              </TextField>
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

export default QualifiedOpportunityFundsForm;
