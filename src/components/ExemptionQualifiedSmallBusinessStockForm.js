import React, { useState } from 'react';
import { TextField, Button, Container, Box, Grid, MenuItem, Alert } from '@mui/material';
import useCalculations from '../utils/useCalculations';

const ExemptionQualifiedSmallBusinessStockForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [stockSellPrice, setStockSellPrice] = useState('');
  const [stockCost, setStockCost] = useState('');
  const [capitalGainQSBS, setCapitalGainQSBS] = useState('');
  const [yearsHolding, setYearsHolding] = useState('');
  const [theStocksWere, setTheStocksWere] = useState('No');
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!filingStatus || !grossIncome || !partnerType) {
      setError('All fields are required.');
      return;
    }

    if (!stockSellPrice || parseFloat(stockSellPrice) <= 0) {
      setError('Stock\'s sell price is required and must be greater than 0.');
      return;
    }

    if (!stockCost || parseFloat(stockCost) <= 0) {
      setError('Stock\'s cost is required and must be greater than 0.');
      return;
    }

    if (!capitalGainQSBS || parseFloat(capitalGainQSBS) <= 0) {
      setError('Capital gain in the sale of QSBS is required and must be greater than 0.');
      return;
    }

    if (parseInt(yearsHolding, 10) < 5) {
      setError('The stock must be held for at least 5 years.');
      return;
    }

    setError(null);

    const stockProfit = parseFloat(stockSellPrice) - parseFloat(stockCost);

    const limitOfExemption = (parseFloat(stockCost) * 10) < 10000000 ? parseFloat(stockCost) * 10 : 10000000;
    console.log('Limit of Exemption:', limitOfExemption);

    let finalCapitalGain = parseFloat(capitalGainQSBS);
    if (parseInt(yearsHolding, 10) < 5 || theStocksWere === 'No') {
      finalCapitalGain = 0;
    }

    finalCapitalGain = finalCapitalGain <= limitOfExemption ? finalCapitalGain : limitOfExemption;

    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      stockSellPrice: parseFloat(stockSellPrice),
      stockCost: limitOfExemption,
      capitalGainQSBS: finalCapitalGain,
      yearsHolding,
      stockProfit,
      theStocksWere,
      calculationType: 'exemptionQualifiedSmall',
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
                label="Stock's Sell Price"
                fullWidth
                type="number"
                value={stockSellPrice}
                onChange={(e) => setStockSellPrice(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Stock's Cost"
                fullWidth
                type="number"
                value={stockCost}
                onChange={(e) => setStockCost(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Capital Gain in the Sale of QSBS"
                fullWidth
                type="number"
                value={capitalGainQSBS}
                onChange={(e) => setCapitalGainQSBS(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Years Holding the Stock (Min 5 Yrs)"
                fullWidth
                type="number"
                value={yearsHolding}
                onChange={(e) => setYearsHolding(e.target.value)}
                margin="normal"
              />

              <TextField
                select
                label="Were the Stocks Sold?"
                fullWidth
                value={theStocksWere}
                onChange={(e) => setTheStocksWere(e.target.value)}
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

export default ExemptionQualifiedSmallBusinessStockForm;
