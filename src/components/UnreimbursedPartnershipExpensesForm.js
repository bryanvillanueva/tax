import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalculateIcon from '@mui/icons-material/Calculate';
import QbidModal from './QbidModal';
import useCalculations from '../utils/useCalculations';

const UnreimbursedPartnershipExpensesForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [formType, setFormType] = useState('1065');
  const [unreimbursedExpenses, setUnreimbursedExpenses] = useState('');
  const [nonDeductibleAmount, setNonDeductibleAmount] = useState('');
  const [totalReimbursement, setTotalReimbursement] = useState('');
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

    // Validations
    if (!unreimbursedExpenses || parseFloat(unreimbursedExpenses) <= 0) {
      setError('Unreimbursed Expenses are required and must be greater than 0.');
      return;
    }

    if (!nonDeductibleAmount || parseFloat(nonDeductibleAmount) < 0) {
      setError('Non-Deductible Amount must be 0 or greater.');
      return;
    }

    const totalReimbursement = (
      parseFloat(unreimbursedExpenses) - parseFloat(nonDeductibleAmount)
    ).toFixed(2);

    // Calculate Income Reduction
    const reductionUnreimbursed = totalReimbursement;

    setTotalReimbursement(totalReimbursement);
    setError(null);

    // Perform Calculations
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      unreimbursedExpenses: parseFloat(unreimbursedExpenses),
      nonDeductibleAmount: parseFloat(nonDeductibleAmount),
      totalReimbursement,
      reductionUnreimbursed,
      calculationType: 'unreimbursedExpenses',
      QBID: parseFloat(QBID),
    });
    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        {/* Link in the top right corner */}
        <Box sx={{ position: 'absolute', top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S35.pdf"
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
                label="Unreimbursed Expenses Incurred"
                fullWidth
                type="number"
                value={unreimbursedExpenses}
                onChange={(e) => setUnreimbursedExpenses(e.target.value)}
                margin="normal"
              />
            </Grid>

            {/* Right Side */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Non-Deductible Amount"
                fullWidth
                type="number"
                value={nonDeductibleAmount}
                onChange={(e) => setNonDeductibleAmount(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Total Reimbursement"
                fullWidth
                type="number"
                value={totalReimbursement}
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
                <MenuItem value="1065">1065</MenuItem>
              </TextField>

              {(formType === '1065' || formType === '1120S') && (
                <TextField
                  label="% Share if partnership"
                  fullWidth
                  type="number"
                  value={partnershipShare}
                  onChange={(e) => {
                    // Limitar el valor entre 0 y 100
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

export default UnreimbursedPartnershipExpensesForm;
