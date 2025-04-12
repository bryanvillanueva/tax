import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalculateIcon from '@mui/icons-material/Calculate';
import QbidModal from './QbidModal';
import useCalculations from '../utils/useCalculations';

const LifeInsuranceForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [annualContribution, setAnnualContribution] = useState('');
  const [plansElectedAverageInterestRate, setPlansElectedAverageInterestRate] = useState('');
  const [totalOfYears, setTotalOfYears] = useState('');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [totalInterestOverTheYears, setTotalInterestOverTheYears] = useState('');
  const [totalContributed, setTotalContributed] = useState('');
  const [totalInterest, setTotalInterest] = useState('');
  const [QBID, setQbid] = useState('');
  const [qbidModalOpen, setQbidModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

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
      setError('Total Reimbursable Expenses is required and must be greater than 0.');
      return;
    }

    if (!plansElectedAverageInterestRate || parseFloat(plansElectedAverageInterestRate) <= 0) {
      setError('Total Reimbursable Expenses is required and must be greater than 0.');
      return;
    }

    if (!totalOfYears || parseFloat(totalOfYears) <= 0) {
      setError('Total Reimbursable Expenses is required and must be greater than 0.');
      return;
    }

    const interestRate = parseFloat(plansElectedAverageInterestRate) / 100;
    const years = parseFloat(totalOfYears);
    const contribution = parseFloat(annualContribution);

    let totalInterestOverTheYears = 0;

    if (interestRate > 0) {
      totalInterestOverTheYears = contribution * ((1 + interestRate) ** years - 1) / interestRate;
    } else {
      totalInterestOverTheYears = 0;
    }

    const totalContributed = contribution * years;
    const totalInterest = totalInterestOverTheYears - totalContributed;

    setTotalInterestOverTheYears(
      totalInterestOverTheYears.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    );
    setTotalContributed(
      totalContributed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    );
    setTotalInterest(
      totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    );

    setError(null);

    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      annualContribution: contribution,
      plansElectedAverageInterestRate: interestRate,
      totalOfYears: years,
      formType,
      calculationType: 'lifeInsurance',
      totalInterestOverTheYears,
      totalContributed,
      totalInterest,
      QBID: parseFloat(QBID),
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        <Box sx={{ position: 'absolute', top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S22.pdf"
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
                label="Plan's Elected Average Interest Rate (%)"
                fullWidth
                type="number"
                value={plansElectedAverageInterestRate}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (inputValue === '' || parseFloat(inputValue) >= 0) {
                    setPlansElectedAverageInterestRate(inputValue);
                  }
                }}
                InputProps={{
                  endAdornment: <span style={{ marginLeft: 5, color: '#555' }}>%</span>,
                }}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Total of Years"
                fullWidth
                type="number"
                value={totalOfYears}
                onChange={(e) => setTotalOfYears(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Total Interest Over The Years"
                fullWidth
                type="text"
                value={totalInterestOverTheYears}
                margin="normal"
                disabled
              />

              <TextField
                label="Total Contributed"
                fullWidth
                type="text"
                value={totalContributed}
                margin="normal"
                disabled
              />

              <TextField
                label="Total Interest"
                fullWidth
                type="text"
                value={totalInterest}
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

export default LifeInsuranceForm;

