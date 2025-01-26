import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useCalculations from '../utils/useCalculations';


const RothIRAForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [annualContribution, setAnnualContribution] = useState('');
  const [agiBeforeStrategy, setAgiBeforeStrategy] = useState('');
  const [average, setAverage] = useState('');
  const [taxPayerAge, setTaxPayerAge] = useState('');
  const [incomeLimit, setIncomeLimit] = useState(146000);
  const [phaseOut, setPhaseOut] = useState(15000);
  const [standardContributionLimit, setStandardContributionLimit] = useState('');
  const [limitContribution, setLimitContribution] = useState(0);
  const [totalExemptIncome, setTotalExemptIncome] = useState(0);
  const [isApplicable, setIsApplicable] = useState("Yes");
  const [QBID, setQbid] = useState('');
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

    // Ajustar income limit y phaseOut según filingStatus
    useEffect(() => {
      const calculateThreshold = (filingStatus) => {
        let incomeLimit, phaseOut;
        if (filingStatus === 'MFJ' || filingStatus === 'QSS') {
          incomeLimit = 230000;
          phaseOut = 10000;
        } else {
          incomeLimit = 146000;
          phaseOut = 15000;
        }
        setIncomeLimit(incomeLimit);
        setPhaseOut(phaseOut);
      };
      calculateThreshold(filingStatus);
    }, [filingStatus]);
  
    // Calcular el límite de contribución
useEffect(() => {
  let calculatedLimit = standardContributionLimit;

  if (agiBeforeStrategy >= incomeLimit) {
    calculatedLimit = Math.max(
      0,
      standardContributionLimit - 
      (standardContributionLimit * ((agiBeforeStrategy - incomeLimit) / phaseOut))
    );
  }

  setLimitContribution(calculatedLimit); // Asegura que el valor sea >= 0
}, [agiBeforeStrategy, incomeLimit, phaseOut, standardContributionLimit]);

// Calcular Total Exempt Income
useEffect(() => {
  if (limitContribution > 0 && annualContribution && average) {
    const exemptIncome = Math.max(
      0,
      Math.min(parseFloat(annualContribution), parseFloat(limitContribution)) * 
      (parseFloat(average) / 100)
    );
    setTotalExemptIncome(Math.floor(exemptIncome));
  } else {
    setTotalExemptIncome(0); // Si limitContribution es negativo, el total es 0
  }
}, [annualContribution, limitContribution, average]);

  
    // Determinar si es "Applicable"
    useEffect(() => {
      if (parseFloat(agiBeforeStrategy) >= parseFloat(incomeLimit) + parseFloat(phaseOut)) {
        setIsApplicable("No");
      } else {
        setIsApplicable("Yes");
      }
    }, [agiBeforeStrategy, incomeLimit, phaseOut]);
  
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
        setError('AGI Before Applying the Strategy is required and must be greater than 0.');
        return;
      }
  
      if (!taxPayerAge || parseFloat(taxPayerAge) <= 0) {
        setError('Tax Payer Age is required and must be greater than 0.');
        return;
      }
  
      const standardLimit = parseFloat(taxPayerAge) >= 50 ? 8000 : 7000;
      setStandardContributionLimit(standardLimit);
      setError(null);
  
      const averagePercentage = parseFloat(average) / 100;

    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      formType,
      partnerType,
      taxPayerAge,
      incomeLimit,
      phaseOut,
      average: averagePercentage,
      standardContributionLimit,
      limitContribution,
      annualContribution: parseFloat(annualContribution),
      agiBeforeStrategy: parseFloat(agiBeforeStrategy),
      totalExemptIncome,
      calculationType: 'rothIRA',
      QBID: parseFloat(QBID),
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
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
                label="Tax Payer Age"
                fullWidth
                type="number"
                value={taxPayerAge}
                onChange={(e) => setTaxPayerAge(e.target.value)}
                margin="normal"
              />
               <TextField
                label="Average % interest paid by the account"
                fullWidth
                type="number"
                value={average}
                onChange={(e) => setAverage(e.target.value)}
                margin="normal"
              />
            </Grid>

            {/* Right Side */}
            <Grid item xs={12} md={6}>
             
              <TextField
                label="Income Limit"
                fullWidth
                type="number"
                value={incomeLimit}
                margin="normal"
                disabled
              />

              <TextField
                label="Phase out"
                fullWidth
                type="number"
                value={phaseOut}
                margin="normal"
                disabled
              />
              <TextField
                label="Standard Contribution Limit"
                fullWidth
                type="number"
                value={standardContributionLimit}
                margin="normal"
                disabled
              />
                <TextField
                label="Applicable "
                fullWidth
                type="text"
                value={isApplicable}

                margin="normal"
                disabled
              />
              <TextField
                label="Limit contribution"
                fullWidth
                type="number"
                value={limitContribution}
                margin="normal"
                disabled
              />
              <TextField
                label="Total Exempt Income per contribution"
                fullWidth
                type="number"
                value={totalExemptIncome}
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

export default RothIRAForm;
