import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalculateIcon from '@mui/icons-material/Calculate';
import QbidModal from './QbidModal';
import useCalculations from '../utils/useCalculations';
import { standardDeductions } from '../utils/taxData';

const CharitableDonationOfAppreciatedAssetsForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [costBasis, setCostBasis] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [amountOfChirableDonation, setAmountOfChirableDonation] = useState('');
  const [savings, setSavings] = useState('');
  const [dagi, setDagi] = useState('');
  const [QBID, setQbid] = useState('');
  const [partnershipShare, setPartnershipShare] = useState('');
  const [qbidModalOpen, setQbidModalOpen] = useState(false);
  const standardDeduction = standardDeductions[filingStatus];
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

// Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!costBasis || parseFloat(costBasis) <= 0) {
      setError('Cost Basis is required and must be greater than 0.');
      return;
    }

    if (!sellPrice || parseFloat(sellPrice) <= 0) {
      setError('Sell Price is required and must be greater than 0.');
      return;
    }



    // Cálculo del monto de la donación caritativa y ahorros
    const amountOfChirableDonationCalculated = parseFloat(sellPrice);
    const savingsCalculated = (amountOfChirableDonationCalculated - parseFloat(costBasis)) * 0.20;

    setAmountOfChirableDonation(amountOfChirableDonationCalculated);
    setSavings(savingsCalculated);

// Calcular DAGI
    if (amountOfChirableDonationCalculated >= standardDeduction ) {
      setDagi(amountOfChirableDonationCalculated); // Updates DAGI state automatically
    } else {
      setDagi(0);
    }

const newDagi2 = amountOfChirableDonationCalculated;
  

    setError(null);

    // Llamar a performCalculations usando el valor calculado directamente
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      costBasis: parseFloat(costBasis),
      sellPrice: parseFloat(sellPrice),
      amountOfChirableDonation: amountOfChirableDonationCalculated,
      savings: savingsCalculated,
      calculationType: 'charitableDonationSavings',
      dagi: parseFloat(newDagi2), // Usar el valor calculado directamente
      QBID: parseFloat(QBID),
      partnershipShare: partnershipShare ? parseFloat(partnershipShare) : 0,
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        <Box sx={{ position: 'absolute', top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S39.pdf"
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
                label="Deduction to AGI"
                fullWidth
                type="number"
                value={dagi}
                margin="normal"
                InputProps={{ readOnly: true }}
                disabled
              />

              <TextField
                label="Standard Deduction"
                fullWidth
                type="number"
                value={standardDeduction}
                margin="normal"
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Cost Basis"
                fullWidth
                type="number"
                value={costBasis}
                onChange={(e) => setCostBasis(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Sell Price"
                fullWidth
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Amount of Charitable Donation"
                fullWidth
                type="number"
                value={amountOfChirableDonation}
                margin="normal"
                InputProps={{ readOnly: true }}
                disabled
              />

              <TextField
                label="Savings in Capital Gain (20%)"
                fullWidth
                type="number"
                value={savings}
                margin="normal"
                InputProps={{ readOnly: true }}
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

export default CharitableDonationOfAppreciatedAssetsForm;
