import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import useCalculations from '../utils/useCalculations';



const SavingsPlanForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [annualContribution, setAnnualContribution] = useState('');
  const [numberOfChildren, setNumberOfChildren] = useState('');
  const [averageInterestRate, setAverageInterestRate] = useState('');
  const [totalYears, setTotalYears] = useState('');
  const [totalAnnualContribution, setTotalAnnualContribution] = useState(null);
  const [futureValue, setFutureValue] = useState(null);
  const [totalTaxSavings, setTotalTaxSavings] = useState(null);
  const [error, setError] = useState(null);

  
  const { performCalculations } = useCalculations();

 

  
  

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations for required fields
    if (!annualContribution || parseFloat(annualContribution) <= 0) {
      setError('Annual Contribution per Child is required and must be greater than 0.');
      return;
    }

    if (!numberOfChildren || parseInt(numberOfChildren) <= 0) {
      setError('Number of Children is required and must be greater than 0.');
      return;
    }

    if (!averageInterestRate || parseFloat(averageInterestRate) <= 0 || parseFloat(averageInterestRate) > 100) {
      setError("Plan's Average Interest Rate is required and must be a percentage between 0 and 100.");
      return;
    }

    if (!totalYears || parseInt(totalYears) <= 0) {
      setError('Total Years is required and must be greater than 0.');
      return;
    }

    setError(null);
    
    
    const totalAnnualContribution = parseFloat(annualContribution) * parseInt(numberOfChildren);
    const futureValue = (totalAnnualContribution * Math.pow(1 + parseFloat(averageInterestRate) / 100 / 12, 12 * parseInt(totalYears))) - totalAnnualContribution; 
    //const totalTaxSavings = futureValue * 0.12;

    setTotalAnnualContribution(totalAnnualContribution);
    setFutureValue(futureValue);
    setTotalTaxSavings(totalTaxSavings);
    

    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      annualContribution: parseFloat(annualContribution),
      numberOfChildren: parseInt(numberOfChildren),
      totalAnnualContribution,
      futureValue,
      totalTaxSavings,
      averageInterestRate: parseFloat(averageInterestRate),
      totalYears: parseInt(totalYears),
      calculationType: 'savingsPlan',
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
                label="Annual Contribution per Child"
                fullWidth
                type="number"
                value={annualContribution}
                onChange={(e) => setAnnualContribution(e.target.value)}
                margin="normal"
              />
               <TextField
                label="Total Annual Contribution"
                fullWidth
                type="text"
                value={totalAnnualContribution !== null ? totalAnnualContribution.toFixed(2) : ''}
                InputProps={{ readOnly: true }}
                margin="normal"
              />
              
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Number of Children"
                fullWidth
                type="number"
                value={numberOfChildren}
                onChange={(e) => setNumberOfChildren(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Plan's Average Interest Rate (%)"
                fullWidth
                type="number"
                value={averageInterestRate}
                onChange={(e) => setAverageInterestRate(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Total Years"
                fullWidth
                type="number"
                value={totalYears}
                onChange={(e) => setTotalYears(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Total Interes Over the Years"
                fullWidth
                type="text"
                value={futureValue !== null ? futureValue.toFixed(2) : ''}
                InputProps={{ readOnly: true }}
                margin="normal"
              />

              {/*<TextField
                label="Total Tax Savings"
                fullWidth
                type="text"
                value={totalTaxSavings !== null ? totalTaxSavings.toFixed(2) : ''}
                InputProps={{ readOnly: true }}
                margin="normal"
              />*/}
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

export default SavingsPlanForm;
