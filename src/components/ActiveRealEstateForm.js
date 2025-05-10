import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalculateIcon from '@mui/icons-material/Calculate';
import QbidModal from './QbidModal';
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
  const [filingStatus, setFilingStatus] = useState('MFS');
  const [grossIncome, setGrossIncome] = useState('');
  const [netRentalLoss, setNetRentalLoss] = useState('');
  const [adjustedGrossIncome, setAdjustedGrossIncome] = useState('');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [partnerType, setPartnerType] = useState('Active');
  const [QBID, setQbid] = useState('');
  const [dagi2, setDagi2] = useState('');
  const [taxpayerStatus, setTaxpayerStatus] = useState('Living Apart');
  const [partnershipShare, setPartnershipShare] = useState('');
  const [error, setError] = useState(null);
  const [calculatedValues, setCalculatedValues] = useState(null);
  const [qbidModalOpen, setQbidModalOpen] = useState(false);

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

    if (!netRentalLoss || parseFloat(netRentalLoss) <= 0) {
      setError('Net Rental Loss is required and must be greater than 0.');
      return;
    }

    if (!adjustedGrossIncome || parseFloat(adjustedGrossIncome) <= 0) {
      setError('Adjusted Gross Income is required and must be greater than 0.');
      return;
    }

    setError(null);

    const incomeLimit =
      filingStatus === 'MFS'
        ? taxpayerStatus === 'Living Apart'
          ? 50000
          : taxpayerStatus === 'Living Together'
          ? 0
          : 100000
        : 150000;

    const phaseOut =
      filingStatus === 'MFS'
        ? taxpayerStatus === 'Living Apart'
          ? 25000
          : taxpayerStatus === 'Living Together'
          ? 0
          : 50000
        : 50000;

    const benefitLimit =
      adjustedGrossIncome >= incomeLimit
        ? (adjustedGrossIncome - incomeLimit) >= phaseOut
          ? 0
          : phaseOut * 0.5 - (adjustedGrossIncome - incomeLimit) * 0.5
        : phaseOut * 0.5;

    const deductibleAmount =
      taxpayerStatus === 'Living Apart'
        ? Math.min(netRentalLoss, benefitLimit)
        : taxpayerStatus === 'Living Together'
        ? 0
        : Math.min(netRentalLoss, benefitLimit);

    setCalculatedValues({
      incomeLimit,
      phaseOut,
      benefitLimit,
      deductibleAmount,
    });

    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      netRentalLoss: parseFloat(netRentalLoss),
      adjustedGrossIncome: parseFloat(adjustedGrossIncome),
      incomeLimit,
      phaseOut,
      benefitLimit,
      deductibleAmount,
      formType,
      partnerType,
      calculationType: 'ActiveRealEstate',
      QBID: parseFloat(QBID),
      dagi2: parseFloat(dagi2),
      partnershipShare: partnershipShare ? parseFloat(partnershipShare) : 0,
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        <Box sx={{ position: 'absolute', top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S36.pdf"
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
                label="Deduction To AGI"
                fullWidth
                type="number"
                value={dagi2}
                onChange={(e) => setDagi2(e.target.value)}
                margin="normal"
              />

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
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Taxpayer Status (ITM)"
                fullWidth
                value={taxpayerStatus}
                onChange={(e) => setTaxpayerStatus(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Living Apart">Living Apart</MenuItem>
                <MenuItem value="Living Together">Living Together</MenuItem>
                <MenuItem value="Other Status">Other Status</MenuItem>
              </TextField>

              <TextField
                label="Income Limit (ARE)"
                fullWidth
                value={calculatedValues ? formatCurrency(calculatedValues.incomeLimit) : formatCurrency(0)}
                disabled
                margin="normal"
              />

              <TextField
                label="Phase Out"
                fullWidth
                value={calculatedValues ? formatCurrency(calculatedValues.phaseOut) : formatCurrency(0)}
                disabled
                margin="normal"
              />

              <TextField
                label="Benefit Limit (BL)"
                fullWidth
                value={calculatedValues ? formatCurrency(calculatedValues.benefitLimit) : formatCurrency(0)}
                disabled
                margin="normal"
              />

              <TextField
                label="Deductible Amount (DA)"
                fullWidth
                value={calculatedValues ? formatCurrency(calculatedValues.deductibleAmount) : formatCurrency(0)}
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

export default ActiveRealEstateForm;
