import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import useCalculations from '../utils/useCalculations';

const AdoptionIncentiveForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [adoptionExpenses, setAdoptionExpenses] = useState('');
  const [childrenAdopted, setChildrenAdopted] = useState('');
  const [iraEarlyWithdrawal, setIraEarlyWithdrawal] = useState('');
  const [TotalAdoptionExpenses, setTotalAdoptionExpenses] = useState('');
  const [IRAEarlyWithdrawalLimit, setIraEarlyWithdrawalLimit] = useState('');
  const [EarlyWithdrawalPenaltyAvoided, setEarlyWithdrawalPenaltyAvoided] = useState('');
  const [error, setError] = useState(null);


  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!adoptionExpenses || parseFloat(adoptionExpenses) <= 0) {
      setError('Adoption Expenses per Child are required and must be greater than 0.');
      return;
    }

    if (!childrenAdopted || parseInt(childrenAdopted, 10) <= 0) {
      setError('Number of Children Adopted is required and must be greater than 0.');
      return;
    }

    if (!iraEarlyWithdrawal || parseFloat(iraEarlyWithdrawal) <= 0) {
      setError('IRA Early Withdrawal amount is required and must be greater than 0.');
      return;
    }

    setError(null);
    // calcular TotalAdoptionExpenses
    const TotalAdoptionExpenses = parseFloat(adoptionExpenses) * parseInt(childrenAdopted);
    // calcular IRA LIMIT
    const IRAEarlyWithdrawalLimit = filingStatus === 'MFJ' ? 20000 : 10000;
    // EarlyWithdrawalPenaltyAvoided
    const EarlyWithdrawalPenaltyAvoided = parseFloat(iraEarlyWithdrawal) * 0.1;




    const results = performCalculations({
      grossIncome: parseFloat(grossIncome),
      partnerType,
      adoptionExpenses: parseFloat(adoptionExpenses),
      childrenAdopted: parseInt(childrenAdopted, 10),
      iraEarlyWithdrawal: parseFloat(iraEarlyWithdrawal),
      filingStatus,
      calculationType: 'adoptionAndIra',
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

            {/* Right side: Adoption Expenses, Children Adopted, and IRA Early Withdrawal */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Adoption Expenses per Child"
                fullWidth
                type="number"
                value={adoptionExpenses}
                onChange={(e) => setAdoptionExpenses(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Number of Children Adopted"
                fullWidth
                type="number"
                value={childrenAdopted}
                onChange={(e) => setChildrenAdopted(e.target.value)}
                margin="normal"
              />

              <TextField
                label="IRA Early Withdrawal Amount"
                fullWidth
                type="number"
                value={iraEarlyWithdrawal}
                onChange={(e) => setIraEarlyWithdrawal(e.target.value)}
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

export default AdoptionIncentiveForm;
