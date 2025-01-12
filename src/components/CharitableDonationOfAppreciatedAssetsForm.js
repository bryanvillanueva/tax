import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useCalculations from '../utils/useCalculations';

const CharitableDonationOfAppreciatedAssetsForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  
  const [costBasis, setCostBasis] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [amountOfChirableDonation, setAmountOfChirableDonation] = useState(''); // Updated state variable

  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!costBasis || parseFloat(costBasis) <= 0) {
      setError('Cost Basis is required and must be greater than 0.');
      return;
    }

    if (!sellPrice || parseFloat(sellPrice) <= 0) {
      setError('Sell Price is required and must be greater than 0.');
      return;
    }

    // Calculate charitable donation amount
    const amountOfChirableDonationCalculated = parseFloat(sellPrice) - parseFloat(costBasis);
    const savings = (amountOfChirableDonationCalculated * 0.20).toFixed(2); 
    const deductionDonation = sellPrice;

    setAmountOfChirableDonation(savings); 

    setError(null);

    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      costBasis: parseFloat(costBasis),
      sellPrice: parseFloat(sellPrice),
      amountOfChirableDonation: amountOfChirableDonationCalculated, // Updated calculation
      savings,
      deductionDonation,
      calculationType: 'charitableDonationSavings', // Updated calculation type
    });
    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        {/* Link in the top right corner */}
        <Box sx={{ position: 'absolute', top: -10, right: 0 }}>
          <Button
            href="https://tax.bryanglen.com/data/Charitable-Donation-Strategy.pdf"
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
                label="Cost Basis"
                fullWidth
                type="number"
                value={costBasis}
                onChange={(e) => setCostBasis(e.target.value)}
                margin="normal"
              />
            </Grid>

            {/* Right Side */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Sell Price"
                fullWidth
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                margin="normal"
              />
              
              <TextField
                label="Savings in Capital Gain (20%)"
                fullWidth
                type="number"
                value={amountOfChirableDonation} // Use the updated state variable here
                margin="normal"
                InputProps={{ readOnly: true }}
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

export default CharitableDonationOfAppreciatedAssetsForm;
