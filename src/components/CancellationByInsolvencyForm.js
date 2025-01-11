import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useCalculations from '../utils/useCalculations';

const formatCurrency = (value) => {
  if (value === undefined || value === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const CancellationByInsolvencyForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [totalAssets, setTotalAssets] = useState('');
  const [totalLiabilities, setTotalLiabilities] = useState('');
  const [debtForgiven, setDebtForgiven] = useState('');
  const [error, setError] = useState(null);
  const [calculatedValues, setCalculatedValues] = useState(null);

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!totalAssets || parseFloat(totalAssets) <= 0) {
      setError('Total Assets is required and must be greater than 0.');
      return;
    }

    if (!totalLiabilities || parseFloat(totalLiabilities) <= 0) {
      setError('Total Liabilities is required and must be greater than 0.');
      return;
    }

    if (!debtForgiven || parseFloat(debtForgiven) <= 0) {
      setError('Debt Forgiven is required and must be greater than 0.');
      return;
    }

    setError(null);

    // Cálculos internos
    const insolvencyAmount =
      totalLiabilities - totalAssets <= 0 ? 0 : totalLiabilities - totalAssets;

    const taxableIncomeInsolvency =
      insolvencyAmount >= debtForgiven
        ? 0
        : debtForgiven - insolvencyAmount;

    setCalculatedValues({
      insolvencyAmount,
      taxableIncomeInsolvency,
    });

    // Resultados procesados con performCalculations
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      totalAssets: parseFloat(totalAssets),
      totalLiabilities: parseFloat(totalLiabilities),
      debtForgiven: parseFloat(debtForgiven),
      insolvencyAmount,
      taxableIncomeInsolvency,
      partnerType,
      calculationType: 'CancellationByInsolvencyForm',
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        {/* Enlace en la esquina superior derecha */}
        <Box sx={{ position: 'absolute', top: -10, right: 0 }}>
          <Button
            href="https://tax.bryanglen.com/data/Strategies-Structure.pdf"
            target="_blank"
            sx={{
              textTransform: 'none',
              backgroundColor: '#ffffff',
              color: '#0858e6',
              fontSize: '0.875rem',
              marginBottom: '150px',
            }}
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
                label="Total Assets"
                fullWidth
                type="number"
                value={totalAssets}
                onChange={(e) => setTotalAssets(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Total Liabilities"
                fullWidth
                type="number"
                value={totalLiabilities}
                onChange={(e) => setTotalLiabilities(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Debt Forgiven"
                fullWidth
                type="number"
                value={debtForgiven}
                onChange={(e) => setDebtForgiven(e.target.value)}
                margin="normal"
              />
            </Grid>

            {calculatedValues && (
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Insolvency Amount"
                    fullWidth
                    value={formatCurrency(calculatedValues.insolvencyAmount)}
                    disabled
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Taxable Income (Insolvency)"
                    fullWidth
                    value={formatCurrency(calculatedValues.taxableIncomeInsolvency)}
                    disabled
                    margin="normal"
                  />
                </Grid>
              </Grid>
            )}
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

export default CancellationByInsolvencyForm;
