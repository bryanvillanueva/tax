import React, { useState } from 'react';
import { TextField, Button, Container, Alert, Box, MenuItem, Grid } from '@mui/material';
import useCalculations from '../utils/useCalculations';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const HealthSavingsAccountForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [hsacf, setHsacf] = useState(''); 
  const [hsac, setHsac] = useState(''); 
  const [ewhdf, setEwhdf] = useState(''); 
  const [ewhd, setEwhd] = useState(''); 
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [QBID, setQbid] = useState('');
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

  const MAX_HSAC = 4150;
  const MAX_HSACF = 8300;

  const handleHsacChange = (value) => {
    if (parseFloat(value) > MAX_HSAC) {
      setError(`Health Savings Accounts Contribution (HSAC) cannot exceed $${MAX_HSAC}.`);
      setHsac('');
    } else {
      setError(null);
      setHsac(value);
    }
  };

  const handleHsacfChange = (value) => {
    if (parseFloat(value) > MAX_HSACF) {
      setError(`Health Savings Accounts Contribution (HSACF) cannot exceed $${MAX_HSACF}.`);
      setHsacf('');
    } else {
      setError(null);
      setHsacf(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!hsac || parseFloat(hsac) <= 0) {
      setError('Health Savings Accounts Contribution (HSAC) is required and must be greater than 0.');
      return;
    }

    if (!hsacf || parseFloat(hsacf) <= 0) {
      setError('Health Savings Accounts Contribution (HSACF) is required and must be greater than 0.');
      return;
    }

    if (!ewhd || parseFloat(ewhd) <= 0) {
      setError('Employees with High Deductible Health Plan (EWHD) is required and must be greater than 0.');
      return;
    }

    if (!ewhdf || parseFloat(ewhdf) <= 0) {
      setError('Employees with High Deductible Health Plan (EWHD) is required and must be greater than 0.');
      return;
    }
    
    const calculateHsaContribution = (hsacfValue, hsacValue, ewhdfValue, ewhdValue) => {
      const hsacf = parseFloat(hsacfValue) || 0;
      const hsac = parseFloat(hsacValue) || 0;
      const ewhdf = parseFloat(ewhdfValue) || 0;
      const ewhd = parseFloat(ewhdValue) || 0;
    
      const familyContribution = hsacf * ewhdf; // Contribución para familias
      const individualContribution = hsac * ewhd; // Contribución individual
    
      return familyContribution + individualContribution;
    };
    
    const hsaContribution = calculateHsaContribution(hsacf, hsac, ewhdf, ewhd);
     
    setError(null);

    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      hsac: parseFloat(hsac),
      ewhd: parseFloat(ewhd),
      hsacf: parseFloat(hsacf),
      ewhdf: parseFloat(ewhdf),
      hsaContribution,
      calculationType: 'healthSavings',
      QBID: parseFloat(QBID),
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        <Box sx={{ position: 'absolute', top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S9.pdf"
            target="_blank"
            sx={{ textTransform: 'none', backgroundColor: '#ffffff', color: '#0858e6', fontSize: '0.875remc', marginBottom: '150px' }}
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
                label="Health Savings Accounts (HSA) Contribution Families"
                fullWidth
                type="number"
                value={hsacf}
                onChange={(e) => handleHsacfChange(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Health Savings Accounts (HSA) Contribution Individual"
                fullWidth
                type="number"
                value={hsac}
                onChange={(e) => handleHsacChange(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Employees with High Deductible Health Plan (HDHP) Families"
                fullWidth
                type="number"
                value={ewhdf}    
                onChange={(e) => setEwhdf(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Employees with High Deductible Health Plan (HDHP) Individual"
                fullWidth
                type="number"
                value={ewhd}    
                onChange={(e) => setEwhd(e.target.value)}
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

export default HealthSavingsAccountForm;

