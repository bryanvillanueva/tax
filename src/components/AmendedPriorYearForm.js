import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, MenuItem, Alert, Grid } from '@mui/material';
import useCalculations from '../utils/useCalculations';

const AmendedPriorYearsForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [missedDeductions, setMissedDeductions] = useState('');
  const [marginalRate, setMarginalRate] = useState('');
  const [originalTaxableIncome, setOriginalTaxableIncome] = useState('');
  const [askForRefund, setAskForRefund] = useState('No');
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

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
      calculationType: 'amendedPriorYears',
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

export default AmendedPriorYearsForm;
