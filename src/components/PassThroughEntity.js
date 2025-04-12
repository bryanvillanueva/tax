import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useCalculations from '../utils/useCalculations';

const PassThroughEntity = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [error, setError] = useState(null);
  const [passThroughIncome, setPassThroughIncome] = useState('');
  const [stateTaxRate, setStateTaxRate] = useState('');
  const [stateTaxPaid, setStateTaxPaid] = useState('');
  const [federalReturnDeduction, setFederalReturnDeduction] = useState('');
  const [stateNonRefundableCredit, setStateNonRefundableCredit] = useState('');
  const [QBID, setQbid] = useState('');
  const [formType, setFormType] = useState('1065');

  const { performCalculations } = useCalculations();

  // Calculate dependent fields when inputs change
  React.useEffect(() => {
    if (passThroughIncome && stateTaxRate) {
      const calculatedStateTaxPaid = (parseFloat(passThroughIncome) * parseFloat(stateTaxRate)) / 100;
      setStateTaxPaid(calculatedStateTaxPaid.toFixed(2));
      setFederalReturnDeduction(calculatedStateTaxPaid.toFixed(2));
      setStateNonRefundableCredit(calculatedStateTaxPaid.toFixed(2));
    }
  }, [passThroughIncome, stateTaxRate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Net Income for Analysis is required and must be greater than 0.');
      return;
    }

    if (!passThroughIncome || parseFloat(passThroughIncome) <= 0) {
      setError('Pass-through entity income is required and must be greater than 0.');
      return;
    }

    setError(null);

    const results = performCalculations({
      calculationType: 'passThroughEntity',
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      passThroughIncome: parseFloat(passThroughIncome),
      stateTaxRate: parseFloat(stateTaxRate),
      stateTaxPaid: parseFloat(stateTaxPaid),
      federalReturnDeduction: parseFloat(federalReturnDeduction),
      stateNonRefundableCredit: parseFloat(stateNonRefundableCredit),
      QBID: parseFloat(QBID),
      formType,
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        <Box sx={{ position: 'absolute', top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S61.pdf"
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
                label="Pass-through entity income"
                fullWidth
                type="number"
                value={passThroughIncome}
                onChange={(e) => setPassThroughIncome(e.target.value)}
                margin="normal"
                required
                error={passThroughIncome !== '' && parseFloat(passThroughIncome) <= 0}
                helperText={passThroughIncome !== '' && parseFloat(passThroughIncome) <= 0 ? 'Must be greater than 0' : ''}
              />
                            <TextField
                label="State tax rate applicable (%)"
                fullWidth
                type="number"
                value={stateTaxRate}
                onChange={(e) => setStateTaxRate(e.target.value)}
                margin="normal"
                required
                InputProps={{
                  inputProps: { min: 0, max: 100 }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>


              <TextField
                label="State tax paid"
                fullWidth
                type="number"
                value={stateTaxPaid}
                margin="normal"
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                label="Federal Return Deduction"
                fullWidth
                type="number"
                value={federalReturnDeduction}
                margin="normal"
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                label="State non refundable credit"
                fullWidth
                type="number"
                value={stateNonRefundableCredit}
                margin="normal"
                disabled
                InputProps={{
                  readOnly: true,
                }}
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
                <MenuItem value="1120S">1120S</MenuItem>
                
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

export default PassThroughEntity;

