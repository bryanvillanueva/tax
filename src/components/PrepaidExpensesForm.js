import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, MenuItem, Alert, Grid } from '@mui/material';
import useCalculations from '../utils/useCalculations';

const PrepaidExpensesForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [investType, setInvestType] = useState('Section 179');
  const [cost, setCost] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [totalExpenses, setTotalExpenses] = useState('');
  const [totalNonPrepaidExpenses, setTotalNonPrepaidExpenses] = useState('');
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!totalExpenses || parseFloat(totalExpenses) <= 0) {
      setError('Total Expenses is required and must be greater than 0.');
      return;
    }

    if (!totalNonPrepaidExpenses || parseFloat(totalNonPrepaidExpenses) <= 0) {
      setError('Total Non-Prepaid Expenses is required and must be greater than 0.');
      return;
    }

    setError(null);

    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      cost: parseFloat(cost),
      investType,
      partnerType,
      totalExpenses: parseFloat(totalExpenses),
      totalNonPrepaidExpenses: parseFloat(totalNonPrepaidExpenses),
      calculationType: 'prepaid',
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
                label="Total Expenses"
                fullWidth
                type="number"
                value={totalExpenses}
                onChange={(e) => setTotalExpenses(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Total Non-Prepaid Expenses"
                fullWidth
                type="number"
                value={totalNonPrepaidExpenses}
                onChange={(e) => setTotalNonPrepaidExpenses(e.target.value)}
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

export default PrepaidExpensesForm;
