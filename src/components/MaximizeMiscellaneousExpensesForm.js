import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalculateIcon from '@mui/icons-material/Calculate';
import QbidModal from './QbidModal';
import useCalculations from '../utils/useCalculations';

const MaximizeMiscellaneousExpensesForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [reclassificationIncome, setReclassificationIncome] = useState('');
  const [reclassificationExpenses, setReclassificationExpenses] = useState('');
  const [reclassificationIncomeOriginYear, setReclassificationIncomeOriginYear] = useState('Current Year');
  const [reclassificationExpensesOriginYear, setReclassificationExpensesOriginYear] = useState('Current Year');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [QBID, setQbid] = useState('');
  const [partnershipShare, setPartnershipShare] = useState('');
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

    if (!reclassificationIncome || parseFloat(reclassificationIncome) <= 0) {
      setError('Reclassification of Income is required and must be greater than 0.');
      return;
    }

    if (!reclassificationExpenses || parseFloat(reclassificationExpenses) <= 0) {
      setError('Reclassification of Expenses is required and must be greater than 0.');
      return;
    }

    const netIncomeIncrease =
      (reclassificationIncomeOriginYear === 'Current Year' ? parseFloat(reclassificationIncome) : 0) +
      (reclassificationExpensesOriginYear === 'Next Year' ? parseFloat(reclassificationExpenses) : 0);

    const netIncomeDecrease =
      (reclassificationIncomeOriginYear === 'Next Year' ? -parseFloat(reclassificationIncome) : 0) +
      (reclassificationExpensesOriginYear === 'Current Year' ? -parseFloat(reclassificationExpenses) : 0);

    const totalNetDeductionMaxi = parseFloat(netIncomeIncrease) + parseFloat(netIncomeDecrease);

    setError(null);

    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      reclassificationIncome: parseFloat(reclassificationIncome),
      reclassificationExpenses: parseFloat(reclassificationExpenses),
      reclassificationIncomeOriginYear,
      reclassificationExpensesOriginYear,
      formType,
      netIncomeIncrease,
      netIncomeDecrease,
      totalNetDeductionMaxi,
      partnerType,
      partnershipShare: partnershipShare ? parseFloat(partnershipShare) : 0,
      QBID: QBID ? parseFloat(QBID) : 0,
      calculationType: 'maximizeMiscellaneousExpenses',
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        <Box sx={{ position: 'absolute', top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S23.pdf"
            target="_blank"
            sx={{ textTransform: 'none', backgroundColor: '#ffffff', color: '#0858e6', fontSize: '0.875rem', marginBottom: '150px' }}
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
                label="Reclassification of Income"
                fullWidth
                type="number"
                value={reclassificationIncome}
                onChange={(e) => setReclassificationIncome(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Reclassification of Expenses"
                fullWidth
                type="number"
                value={reclassificationExpenses}
                onChange={(e) => setReclassificationExpenses(e.target.value)}
                margin="normal"
              />

              <TextField
                select
                label="Reclassified Income Origin Year"
                fullWidth
                value={reclassificationIncomeOriginYear}
                onChange={(e) => setReclassificationIncomeOriginYear(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Current Year">Current Year</MenuItem>
                <MenuItem value="Next Year">Next Year</MenuItem>
              </TextField>

              <TextField
                select
                label="Reclassified Expense Origin Year"
                fullWidth
                value={reclassificationExpensesOriginYear}
                onChange={(e) => setReclassificationExpensesOriginYear(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Current Year">Current Year</MenuItem>
                <MenuItem value="Next Year">Next Year</MenuItem>
              </TextField>

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

              {(formType === '1065' || formType === '1120S') && (
                <TextField
                  label="% Share if partnership"
                  fullWidth
                  type="number"
                  value={partnershipShare}
                  onChange={(e) => {
                    const value = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                    setPartnershipShare(value.toString());
                  }}
                  margin="normal"
                  InputProps={{
                    inputProps: { min: 0, max: 100 },
                    endAdornment: (
                      <span style={{ marginRight: '8px' }}>%</span>
                    ),
                  }}
                  helperText="Enter your partnership share percentage (0-100%)"
                />
              )}

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

export default MaximizeMiscellaneousExpensesForm;

