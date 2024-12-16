import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, MenuItem, Alert, Grid } from '@mui/material';
import useCalculations from '../utils/useCalculations';

const AugustaRuleForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [averageMonthlyRent, setAverageMonthlyRent] = useState('');
  const [daysOfRent, setDaysOfRent] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!averageMonthlyRent || parseFloat(averageMonthlyRent) <= 0) {
      setError('Average Monthly Rent is required and must be greater than 0.');
      return;
    }

    if (!daysOfRent || parseFloat(daysOfRent) <= 0) {
      setError('Days of Rent is required and must be greater than 0.');
      return;
    }

    setError(null);

    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      averageMonthlyRent: parseFloat(averageMonthlyRent),
      daysOfRent: parseFloat(daysOfRent),
      partnerType,
      isAugustaRule: true,
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

            <Grid item xs={12} md={6}>
              <TextField
                label="Average Monthly Rent"
                fullWidth
                type="number"
                value={averageMonthlyRent}
                onChange={(e) => setAverageMonthlyRent(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Days of Rent"
                fullWidth
                type="number"
                value={daysOfRent}
                onChange={(e) => setDaysOfRent(e.target.value)}
                margin="normal"
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button type="submit" variant="contained" color="primary">
              Calculate
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default AugustaRuleForm;
