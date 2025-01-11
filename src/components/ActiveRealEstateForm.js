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

const ActiveRealEstateForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [taxpayerActive, setTaxpayerActive] = useState('Yes'); // Nuevo campo: Dropdown para Taxpayer
  const [netRentalLoss, setNetRentalLoss] = useState(''); // Nuevo campo: Net Rental Loss
  const [adjustedGrossIncome, setAdjustedGrossIncome] = useState(''); // Nuevo campo: Adjusted Gross Income
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [partnerType, setPartnerType] = useState('Active');
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

    if (!netRentalLoss || parseFloat(netRentalLoss) <= 0) {
      setError('Net Rental Loss is required and must be greater than 0.');
      return;
    }

    if (!adjustedGrossIncome || parseFloat(adjustedGrossIncome) <= 0) {
      setError('Adjusted Gross Income is required and must be greater than 0.');
      return;
    }

    setError(null);

    // Cálculos internos
    const incomeLimit = filingStatus === 'MFS' ? 75000 : 150000; // Income Limit basado en Filing Status
    const phaseOut = 50000; // Valor fijo para Phase Out
    const benefitReduction =
    adjustedGrossIncome >= incomeLimit
    ? (adjustedGrossIncome - incomeLimit) >= phaseOut
      ? phaseOut * 0.5
      : (adjustedGrossIncome - incomeLimit) * 0.5
    : 0;

    const deductibleAmount =
      parseFloat(netRentalLoss) >= 25000
        ? 25000 - benefitReduction
        : parseFloat(netRentalLoss) - benefitReduction;

        setCalculatedValues({
          incomeLimit,
          phaseOut,
          benefitReduction,
          deductibleAmount,
        });

    // Resultados procesados con performCalculations
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      netRentalLoss: parseFloat(netRentalLoss),
      adjustedGrossIncome: parseFloat(adjustedGrossIncome),
      incomeLimit,
      phaseOut,
      benefitReduction,
      deductibleAmount,
      formType,
      partnerType,
      calculationType: 'ActiveRealEstateForm',
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
                select
                label="Taxpayer is an active participant in real estate"
                fullWidth
                value={taxpayerActive}
                onChange={(e) => setTaxpayerActive(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>


              <TextField
                label="Net Rental Loss"
                fullWidth
                type="number"
                value={netRentalLoss}
                onChange={(e) => setNetRentalLoss(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Adjusted Gross Income (ARE)"
                fullWidth
                type="number"
                value={adjustedGrossIncome}
                onChange={(e) => setAdjustedGrossIncome(e.target.value)}
                margin="normal"
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
            {calculatedValues && (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Income Limit (ARE)"
                  fullWidth
                  value={formatCurrency(calculatedValues.incomeLimit)}
                  disabled
                  margin="normal"
                />
                <TextField
                  label="Phase Out"
                  fullWidth
                  value={formatCurrency(calculatedValues.phaseOut)}
                  disabled
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Benefit Reduction (BR)"
                  fullWidth
                  value={formatCurrency(calculatedValues.benefitReduction)}
                  disabled
                  margin="normal"
                />
                <TextField
                  label="Deductible Amount (DA)"
                  fullWidth
                  value={formatCurrency(calculatedValues.deductibleAmount)}
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

export default ActiveRealEstateForm;
