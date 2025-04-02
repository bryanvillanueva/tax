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

const BackdoorRothForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [annualContribution, setAnnualContribution] = useState('');
  const [agiBeforeStrategy, setAgiBeforeStrategy] = useState('');
  const [taxpayerAge, setTaxpayerAge] = useState('');
  const [averageInterest, setAverageInterest] = useState('');
  const [marginalTaxRate, setMarginalTaxRate] = useState('');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [QBID, setQbid] = useState('');
  const [calculatedValues, setCalculatedValues] = useState({
    limitContribution: 0,
    totalExemptIncome: 0,
    potentialTaxSavings: 0,
  });
  const [error, setError] = useState(null);
  

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!annualContribution || parseFloat(annualContribution) <= 0) {
      setError('Annual Contribution is required and must be greater than 0.');
      return;
    }

    if (!agiBeforeStrategy || parseFloat(agiBeforeStrategy) <= 0) {
      setError('AGI Before applying the strategy is required and must be greater than 0.');
      return;
    }

    if (!taxpayerAge || parseFloat(taxpayerAge) <= 0) {
      setError('Taxpayer Age is required and must be greater than 0.');
      return;
    }

    if (!averageInterest || parseFloat(averageInterest) <= 0) {
      setError('Average % Interest Paid by the Account is required and must be greater than 0.');
      return;
    }

    if (!marginalTaxRate || parseFloat(marginalTaxRate) <= 0) {
      setError('Marginal Tax Rate (BF) is required and must be greater than 0.');
      return;
    }

    setError(null);

    // Cálculos internos
    const limitContribution = parseFloat(taxpayerAge) >= 50 ? 8000 : 7000;
    const totalExemptIncome =
      Math.min(parseFloat(annualContribution), limitContribution) *
      (parseFloat(averageInterest) / 100);
    const potentialTaxSavings = totalExemptIncome * (parseFloat(marginalTaxRate) / 100);

    setCalculatedValues({
      limitContribution,
      totalExemptIncome,
      potentialTaxSavings,
    });

    // Resultados procesados con performCalculations
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      annualContribution: parseFloat(annualContribution),
      agiBeforeStrategy: parseFloat(agiBeforeStrategy),
      taxpayerAge: parseFloat(taxpayerAge),
      averageInterest: parseFloat(averageInterest),
      marginalTaxRate: parseFloat(marginalTaxRate),
      limitContribution,
      totalExemptIncome,
      potentialTaxSavings,
      partnerType,
      formType,
      calculationType: 'BackdoorRoth',
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
            href="https://cmltaxplanning.com/docs/S37.pdf"
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
                label="Annual Contribution"
                fullWidth
                type="number"
                value={annualContribution}
                onChange={(e) => setAnnualContribution(e.target.value)}
                margin="normal"
              />

              <TextField
                label="AGI Before Applying the Strategy"
                fullWidth
                type="number"
                value={agiBeforeStrategy}
                onChange={(e) => setAgiBeforeStrategy(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Taxpayer Age"
                fullWidth
                type="number"
                value={taxpayerAge}
                onChange={(e) => setTaxpayerAge(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              

              <TextField
                label="Average % Interest Paid by the Account"
                fullWidth
                type="number"
                value={averageInterest}
                onChange={(e) => setAverageInterest(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Marginal Tax Rate (BF)"
                fullWidth
                type="number"
                value={marginalTaxRate}
                onChange={(e) => setMarginalTaxRate(e.target.value)}
                margin="normal"
              />
              <TextField
                    label="Limit Contribution"
                    fullWidth
                    value={formatCurrency(calculatedValues.limitContribution || 0)}
                    disabled
                    margin="normal"
                  />

                  <TextField
                    label="Total Exempt Income per Contribution"
                    fullWidth
                    value={formatCurrency(calculatedValues.totalExemptIncome || 0)}
                    disabled
                    margin="normal"
                  />
                   <TextField
                    label="Potential Tax Savings"
                    fullWidth
                    value={formatCurrency(calculatedValues.potentialTaxSavings || 0)}
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

export default BackdoorRothForm;

