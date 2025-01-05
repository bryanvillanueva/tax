import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import useCalculations from '../utils/useCalculations';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


const CharitableRemainderForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [capitalGain, setCapitalGain] = useState('');
  const [presentValue, setPresentValue] = useState('');
  const [savingsInTax, setSavingsInTax] = useState(''); // Automatically calculated but still shown
  const [formType, setFormType] = useState('1040 - Schedule C/F');
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
      formType,
      calculationType: 'charitableRemainderTrust',
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        {/* Enlace en la esquina superior derecha */}
        <Box sx={{ position: 'absolute', top: -10, right: 0, }}>
          <Button
            href="https://tax.bryanglen.com/data/Strategies-Structure.pdf"
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
                margin="normal"
                disabled // Campo deshabilitado
                InputProps={{
                  sx: { fontWeight: 'bold', color: '#333' }, // Texto en negrita y color oscuro
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
