import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, MenuItem, Alert } from '@mui/material';

const DepreciationForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [investType, setInvestType] = useState('Section 179');
  const [cost, setCost] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Net Income for Analysis is required and must be greater than 0.');
      return;
    }

    setError(null);

    onCalculate({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      cost: parseFloat(cost) || 0,
      investType,
      partnerType,
    });
  };

  return (
    <Container className="container">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Depreciación Acelerada (179 - Bonus Depreciation)
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="depreciation-form">
          <div className="form-column">
            <TextField
              select
              label="Individual Taxpayer's Status"
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
              label="Net Income for Analysis"
              fullWidth
              value={grossIncome}
              onChange={(e) => setGrossIncome(e.target.value)}
              margin="normal"
              type="number"
              error={Boolean(error)}
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
          </div>

          <div className="form-column">
            <TextField
              label="Costs / Investment"
              fullWidth
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              margin="normal"
              type="number"
            />

            <TextField
              select
              label="Investment Type"
              fullWidth
              value={investType}
              onChange={(e) => setInvestType(e.target.value)}
              margin="normal"
            >
              <MenuItem value="Section 179">Section 179</MenuItem>
              <MenuItem value="Bonus">Bonus</MenuItem>
            </TextField>
          </div>

          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 3 }}>
            <Button type="submit" variant="contained" color="primary">
              Calculate
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default DepreciationForm;
