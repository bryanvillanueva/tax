import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useCalculations from '../utils/useCalculations';

const PassiveLossAndPigs = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [error, setError] = useState(null);
  
  // New state variables for right side
  const [plpy, setPlpy] = useState('');
  const [plcy, setPlcy] = useState('');
  const [picy, setPicy] = useState('');
  const [nicy, setNicy] = useState('');
  const [plcf, setPlcf] = useState('');
  const [QBID, setQbid] = useState('');
  const [formType, setFormType] = useState('1040 - Schedule C/F');

  const { performCalculations } = useCalculations();

  // Calculate dependent fields when inputs change
  React.useEffect(() => {
    if (picy && plcy) {
      const calculatedNicy = parseFloat(picy) - parseFloat(plcy);
      setNicy(calculatedNicy.toFixed(2));

      if (plpy) {
        const calculatedPlcf = parseFloat(plpy) - calculatedNicy;
        setPlcf(calculatedPlcf.toFixed(2));
      }
    }
  }, [picy, plcy, plpy]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Net Income for Analysis is required and must be greater than 0.');
      return;
    }

    if (!plpy || parseFloat(plpy) <= 0) {
      setError('Passive Losses from previous years is required and must be greater than 0.');
      return;
    }

    if (!plcy || parseFloat(plcy) <= 0) {
      setError('Passive Losses from Current year is required and must be greater than 0.');
      return;
    }

    if (!picy || parseFloat(picy) <= 0) {
      setError('Passive Income from Current year is required and must be greater than 0.');
      return;
    }

    setError(null);

    const results = performCalculations({
      calculationType: 'passiveLossAndPigs',
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      plpy: parseFloat(plpy),
      plcy: parseFloat(plcy),
      picy: parseFloat(picy),
      nicy: parseFloat(nicy),
      plcf: parseFloat(plcf),
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
                label="Passive Losses from previous years (PLPY)"
                fullWidth
                type="number"
                value={plpy}
                onChange={(e) => setPlpy(e.target.value)}
                margin="normal"
                required
                error={plpy !== '' && parseFloat(plpy) <= 0}
                helperText={plpy !== '' && parseFloat(plpy) <= 0 ? 'Must be greater than 0' : ''}
              />

              <TextField
                label="Passive Losses from Current year (PLCY)"
                fullWidth
                type="number"
                value={plcy}
                onChange={(e) => setPlcy(e.target.value)}
                margin="normal"
                required
                error={plcy !== '' && parseFloat(plcy) <= 0}
                helperText={plcy !== '' && parseFloat(plcy) <= 0 ? 'Must be greater than 0' : ''}
              />

            </Grid>

            <Grid item xs={12} md={6}>

              <TextField
                label="Passive Income from Current year (PICY)"
                fullWidth
                type="number"
                value={picy}
                onChange={(e) => setPicy(e.target.value)}
                margin="normal"
                required
                error={picy !== '' && parseFloat(picy) <= 0}
                helperText={picy !== '' && parseFloat(picy) <= 0 ? 'Must be greater than 0' : ''}
              />

              <TextField
                label="Net income or loss current year (NICY)"
                fullWidth
                type="number"
                value={nicy}
                margin="normal"
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                label="Passive losses carried forward (PLCF)"
                fullWidth
                type="number"
                value={plcf}
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

export default PassiveLossAndPigs; 