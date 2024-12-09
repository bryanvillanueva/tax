import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, MenuItem, Grid } from '@mui/material';

const DepreciationForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [investType, setInvestType] = useState('Section 179');
  const [cost, setCost] = useState('');
  const [partnerType, setPartnerType] = useState('Active');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate({
      filingStatus,
      grossIncome: parseFloat(grossIncome) || 0,
      cost: parseFloat(cost) || 0,
      investType,
      partnerType,
    });
  };

  return (
    <Container>
      <Box sx={{ mt: 5 }}>
        <Typography sx={{ textAlign: 'center', fontWeight: '600', marginBottom:'45px' }} variant="h4" gutterBottom>
          Depreciación Acelerada (179 - Bonus Depreciation)
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Primera Columna */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Individual Taxpayer's Status"
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
                label="Net Income for Analysis"
                fullWidth
                value={grossIncome}
                onChange={(e) => setGrossIncome(e.target.value)}
                margin="normal"
                type="number"
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

            {/* Segunda Columna */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Costs / Investment"
                fullWidth
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                margin="normal"
                type="number"
              />

              <TextField
                select
                label="Investment Type"
                fullWidth
                value={investType}
                onChange={(e) => setInvestType(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Section 179">Section 179</MenuItem>
                <MenuItem value="Bonus">Bonus</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {/* Botón de Calcular */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button type="submit" variant="contained" color="primary">
              Calculate
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default DepreciationForm;
