import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import useCalculations from '../utils/useCalculations';

const AccountablePlanForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [totalReimbursableExpenses, setTotalReimbursableExpenses] = useState('');
  const [error, setError] = useState(null);

  

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validaciones de los campos
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!totalReimbursableExpenses || parseFloat(totalReimbursableExpenses) <= 0) {
      setError('Total Reimbursable Expenses is required and must be greater than 0.');
      return;
    }

   

    setError(null);
    // Llamada al hook con calculationType 'accountablePlan'
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      totalReimbursableExpenses: parseFloat(totalReimbursableExpenses),
      partnerType,
      calculationType: 'accountablePlan', // Línea actualizada para especificar el tipo de cálculo
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
            </Grid>

            {/* Lado Derecho */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Total Reimbursable Expenses"
                fullWidth
                type="number"
                value={totalReimbursableExpenses}
                onChange={(e) => setTotalReimbursableExpenses(e.target.value)}
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

export default AccountablePlanForm;
