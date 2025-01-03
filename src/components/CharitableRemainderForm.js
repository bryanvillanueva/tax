import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import useCalculations from '../utils/useCalculations';

const CharitableRemainderForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [capitalGain, setCapitalGain] = useState('');
  const [presentValue, setPresentValue] = useState('');
  const [savingsInTax, setSavingsInTax] = useState(''); // Automatically calculated but still shown
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!capitalGain || parseFloat(capitalGain) <= 0) {
      setError('Capital Gain (CGAS) is required and must be greater than 0.');
      return;
    }

    if (!presentValue || parseFloat(presentValue) <= 0) {
      setError('Present Value of Amount to Donate (PVAD) is required and must be greater than 0.');
      return;
    }

    setError(null);

    // Calcular automáticamente el 20% de CGAS para Savings in Capital Gain Tax
    const savings = parseFloat(capitalGain) * 0.20;
    setSavingsInTax(savings); // Guardamos el cálculo en el estado

  
    const results = performCalculations({
      grossIncome: parseFloat(grossIncome),
      partnerType,
      capitalGain: parseFloat(capitalGain),
      presentValue: parseFloat(presentValue),
      savingsInTax: savings, // Pasamos el valor calculado
      filingStatus,
      calculationType: 'charitableRemainderTrust',
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
            {/* Left side: Filing Status, Gross Income, and Type of Partner */}
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

            {/* Right side: CGAS, PVAD, and Savings in Capital Gain Tax */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Capital Gain on the Assets Sold by the Trust (CGAS)"
                fullWidth
                type="number"
                value={capitalGain}
                onChange={(e) => setCapitalGain(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Present Value of the Amount to be Donate (PVAD)"
                fullWidth
                type="number"
                value={presentValue}
                onChange={(e) => setPresentValue(e.target.value)}
                margin="normal"
              />

              {/* Savings in Capital Gain Tax (auto-calculated, not editable) */}
              <TextField
                label="Savings in Capital Gain Tax"
                fullWidth
                type="number"
                value={savingsInTax} // Este campo se actualiza automáticamente
                InputProps={{
                  readOnly: true, // El campo no es editable
                }}
                margin="normal"
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button type="submit" variant="contained" sx={{backgroundColor:'#0858e6', color: '#fff'}}>
              Calculate
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default CharitableRemainderForm;
