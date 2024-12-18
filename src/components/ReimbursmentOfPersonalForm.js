import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import useCalculations from "../utils/useCalculations";

const ReimbursmentOfPersonalForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState ('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [tve, setTve] = useState(''); // Total Vehicle Expenses
  const [pbuv, setPbuv] = useState(''); // Percentage Business Use of Vehicle
  const [partnerType, setPartnerType] = useState('Active');
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Net Income for Analysis is required and must be greater than 0.');
      return;
    }

    if (!tve || parseFloat(tve) <= 0) {
      setError('Total Vehicle Expenses (TVE) is required and must be greater than 0.');
      return;
    }

    if (!pbuv || parseFloat(pbuv) <= 0 || parseFloat(pbuv) > 100) {
      setError('Percentage Business Use of Vehicle (PBUV) is required and must be between 0 and 100.');
      return;
    }

    setError(null);

    // Perform calculations based on the formula =+D4*(D6%)
    const reimbursment = parseFloat(tve) * (parseFloat(pbuv) / 100);

    // Pass the calculated reimbursment along with other data
    const results = performCalculations ({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      tve: parseFloat(tve),
      pbuv: parseFloat(pbuv),
      partnerType,
      reimbursment, // Add the calculated value
      calculationType: 'reimbursment',
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
                label="Total Vehicle Expenses (TVE)"
                fullWidth
                type="number"
                value={tve}
                onChange={(e) => setTve(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Percentage Business Use of Vehicle (PBUV)"
                fullWidth
                type="number"
                value={pbuv}
                onChange={(e) => setPbuv(e.target.value)}
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

export default ReimbursmentOfPersonalForm;