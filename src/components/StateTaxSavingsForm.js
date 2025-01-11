import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useCalculations from '../utils/useCalculations';

const StateTaxSavingsForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  
  const [federalTaxableIncome, setFederalTaxableIncome] = useState('');
  const [currentStateRate, setCurrentStateRate] = useState('');
  const [newStateRate, setNewStateRate] = useState('');
  const [currentStateTax, setCurrentStateTax] = useState('');
  const [newStateTax, setNewStateTax] = useState('');
  
  const [taxSavings, setTaxSavings] = useState('');
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!federalTaxableIncome || parseFloat(federalTaxableIncome) <= 0) {
      setError('Federal Taxable Income is required and must be greater than 0.');
      return;
    }

    if (!currentStateRate || parseFloat(currentStateRate) <= 0) {
      setError('Current State Rate is required and must be greater than 0.');
      return;
    }

    if (!newStateRate || parseFloat(newStateRate) <= 0) {
      setError('New State Rate is required and must be greater than 0.');
      return;
    }

    
    const currentTax = (parseFloat(federalTaxableIncome) * parseFloat(currentStateRate)) / 100;
    const newTax = (parseFloat(federalTaxableIncome) * parseFloat(newStateRate)) / 100;
    const savings = currentTax - newTax;

    
    const currentTaxRounded = currentTax.toFixed(2);
    const newTaxRounded = newTax.toFixed(2);
    const savingsRounded = savings.toFixed(2);

    
    setCurrentStateTax(currentTaxRounded);
    setNewStateTax(newTaxRounded);
    setTaxSavings(savingsRounded);

    setError(null);

    
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      federalTaxableIncome: parseFloat(federalTaxableIncome),
      currentStateRate: parseFloat(currentStateRate),
      newStateRate: parseFloat(newStateRate),
      currentStateTax: parseFloat(currentTaxRounded),
      newStateTax: parseFloat(newTaxRounded),
      taxSavings: parseFloat(savingsRounded),
      calculationType: 'stateTaxSavings',
    });
    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        {/* Link in the top right corner */}
        <Box sx={{ position: 'absolute', top: -10, right: 0 }}>
          <Button
            href="https://tax.bryanglen.com/data/State-Tax-Savings-Strategy.pdf"
            target="_blank"
            sx={{ textTransform: 'none', backgroundColor: '#ffffff', color: '#0858e6', fontSize: '0.875rem', marginBottom: '150px' }}
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
            {/* Left Side */}
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
                label="Partner Type"
                fullWidth
                value={partnerType}
                onChange={(e) => setPartnerType(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Passive">Passive</MenuItem>
              </TextField>

              <TextField
                label="Federal Taxable Income"
                fullWidth
                type="number"
                value={federalTaxableIncome}
                onChange={(e) => setFederalTaxableIncome(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Current State Rate (%)"
                fullWidth
                type="number"
                value={currentStateRate}
                onChange={(e) => setCurrentStateRate(e.target.value)}
                margin="normal"
              />
               
            </Grid>

            {/* Right Side */}
            <Grid item xs={12} md={6}>
              <TextField
                label="New State Rate (%)"
                fullWidth
                type="number"
                value={newStateRate}
                onChange={(e) => setNewStateRate(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Current State Tax"
                fullWidth
                type="number"
                value={currentStateTax}
                margin="normal"
                InputProps={{ readOnly: true }}
                disabled
              />

              <TextField
                label="New State Tax"
                fullWidth
                type="number"
                value={newStateTax}
                margin="normal"
                InputProps={{ readOnly: true }}
                disabled
              />

               <TextField
                label="Tax Savings"
                fullWidth
                type="number"
                value={taxSavings}
                margin="normal"

                disabled
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
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#0858e6', color: '#fff' }}>
              Calculate
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default StateTaxSavingsForm;
