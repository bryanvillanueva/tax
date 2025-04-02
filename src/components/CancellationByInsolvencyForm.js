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
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [QBID, setQbid] = useState('');
  const [error, setError] = useState(null);
  const [insolvencyAmount, setInsolvencyAmount] = useState(0); // Nuevo estado para Insolvency Amount
  const [taxableIncomeInsolvency, setTaxableIncomeInsolvency] = useState(0); // Nuevo estado para Taxable Income (Insolvency)

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
    const insolvencyAmountCalc =
      totalLiabilities - totalAssets <= 0 ? 0 : totalLiabilities - totalAssets;

    const taxableIncomeInsolvencyCalc =
      insolvencyAmountCalc >= debtForgiven
        ? 0
        : debtForgiven - insolvencyAmountCalc;

    // Actualizamos los estados de los campos
    setInsolvencyAmount(insolvencyAmountCalc);
    setTaxableIncomeInsolvency(taxableIncomeInsolvencyCalc);
    console.log(taxableIncomeInsolvencyCalc);

    // Resultados procesados con performCalculations
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      totalAssets: parseFloat(totalAssets),
      totalLiabilities: parseFloat(totalLiabilities),
      debtForgiven: parseFloat(debtForgiven),
      insolvencyAmount: insolvencyAmountCalc,
      taxableIncomeInsolvency: taxableIncomeInsolvencyCalc,
      deductionCancellation: taxableIncomeInsolvencyCalc, 
      partnerType,
      formType,
      calculationType: 'CancellationByInsolvency',
      QBID: parseFloat(QBID),
    });
    
    onCalculate(results);
    
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        {/* Enlace en la esquina superior derecha */}
        <Box sx={{ position: 'absolute', top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S38.pdf"
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
            </Grid>

            <Grid item xs={12} md={6}>
              

              <TextField
                label="Debt Forgiven"
                fullWidth
                type="number"
                value={debtForgiven}
                onChange={(e) => setDebtForgiven(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Insolvency Amount"
                fullWidth
                value={formatCurrency(insolvencyAmount)}
                disabled
                margin="normal"
              />

              <TextField
                label="Taxable Income (Insolvency)"
                fullWidth
                value={formatCurrency(taxableIncomeInsolvency)}
                disabled
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

              <TextField
                label="QBID (Qualified Business Income Deduction)"
                fullWidth
                type="number"
                value={QBID}
                onChange={(e) => setQbid(e.target.value)}
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

export default CancellationByInsolvencyForm;
