import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalculateIcon from '@mui/icons-material/Calculate';
import QbidModal from './QbidModal';
import useCalculations from '../utils/useCalculations';

const TraditionalIRAContributionsForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [annualContribution, setAnnualContribution] = useState('');
  const [agiBeforeStrategy, setAgiBeforeStrategy] = useState('');
  const [incomeLimit, setIncomeLimit] = useState('');
  const [phaseOut, setPhaseOut] = useState('');
  const [taxpayerAge, setTaxpayerAge] = useState('');
  const [standardContributionLimit, setStandardContributionLimit] = useState('');
  const [applicable, setApplicable] = useState('');
  const [limitContribution, setLimitContribution] = useState('');
  const [QBID, setQbid] = useState('');
  const [dagi2, setDagi2] = useState('');
  const [qbidModalOpen, setQbidModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

  useEffect(() => {
    const calculateValues = () => {
      let calculatedIncomeLimit = 77000;
      let calculatedPhaseOut = 10000;

      switch (filingStatus) {
        case 'MFJ':
        case 'QSS':
          calculatedIncomeLimit = 123000;
          calculatedPhaseOut = 20000;
          break;
        default:
          calculatedIncomeLimit = 77000;
          calculatedPhaseOut = 10000;
          break;
      }

      return { calculatedIncomeLimit, calculatedPhaseOut };
    };

    const { calculatedIncomeLimit, calculatedPhaseOut } = calculateValues();
    setIncomeLimit(calculatedIncomeLimit);
    setPhaseOut(calculatedPhaseOut);
  }, [filingStatus]);

  const handleQbidCalculateClick = () => {
    setQbidModalOpen(true);
  };

  const handleCloseQbidModal = () => {
    setQbidModalOpen(false);
  };

  const handleQbidSelection = (results, shouldClose = false) => {
    if (results && results.qbidAmount !== undefined) {
      const qbidValue = parseFloat(results.qbidAmount);
      if (!isNaN(qbidValue)) {
        setQbid(qbidValue.toString());
      }
    }
    if (shouldClose) {
      setQbidModalOpen(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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

    if (!taxpayerAge || parseInt(taxpayerAge) <= 0) {
      setError('Taxpayer Age is required and must be greater than 0.');
      return;
    }

    const standardContributionLimit = taxpayerAge >= 50 ? 8000 : 7000;
    const applicable =
      parseFloat(agiBeforeStrategy) >=
      parseFloat(incomeLimit) + parseFloat(phaseOut)
        ? 'No'
        : 'Yes';
    const calculatedContribution =
      agiBeforeStrategy >= incomeLimit
        ? applicable === 'No'
          ? 7000
          : standardContributionLimit -
            standardContributionLimit *
              ((agiBeforeStrategy - incomeLimit) / phaseOut)
        : annualContribution;

    const totalDeductionTraditionalIRA = 0;

    setStandardContributionLimit(standardContributionLimit);
    setApplicable(applicable);
    setLimitContribution(calculatedContribution);

    setError(null);

    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      annualContribution: parseFloat(annualContribution),
      agiBeforeStrategy: parseFloat(agiBeforeStrategy),
      incomeLimit: parseFloat(incomeLimit),
      phaseOut: parseFloat(phaseOut),
      taxpayerAge: parseInt(taxpayerAge),
      standardContributionLimit: parseFloat(standardContributionLimit),
      applicable,
      limitContribution: parseFloat(limitContribution),
      totalDeductionTraditionalIRA,
      calculationType: 'traditionalIRA',
      QBID: parseFloat(QBID),
      dagi2: parseFloat(dagi2),
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        <Box sx={{ position: 'absolute', top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S34.pdf"
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
                label="Deduction To AGI"
                fullWidth
                type="number"
                value={dagi2}
                onChange={(e) => setDagi2(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
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

              <Box sx={{ position: 'relative' }}>
                <TextField
                  label="QBID (Qualified Business Income Deduction)"
                  fullWidth
                  type="number"
                  value={QBID}
                  onChange={(e) => setQbid(e.target.value)}
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <Button
                        onClick={handleQbidCalculateClick}
                        size="small"
                        aria-label="calculate QBID"
                        sx={{
                          color: '#0858e6',
                          textTransform: 'none',
                          fontSize: '0.8rem',
                          fontWeight: 'normal',
                          minWidth: 'auto',
                          ml: 1,
                          p: '4px 8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: 'transparent',
                          '&:hover': {
                            backgroundColor: 'rgba(8, 88, 230, 0.08)',
                          }
                        }}
                      >
                        <CalculateIcon fontSize="small" />
                        Calculate
                      </Button>
                    ),
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#0858e6', color: '#fff' }}>
              Calculate
            </Button>
          </Box>
        </form>
      </Box>

      <QbidModal 
        open={qbidModalOpen} 
        onClose={handleCloseQbidModal} 
        onSelect={handleQbidSelection}
      />
    </Container>
  );
};

export default TraditionalIRAContributionsForm;
