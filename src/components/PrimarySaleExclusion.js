import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useCalculations from '../utils/useCalculations';
import { standardDeductions } from '../utils/taxData';

const PrimarySaleExclusion = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [error, setError] = useState(null);
  
  // New state variables for right side
  const [opp, setOpp] = useState('');
  const [ric, setRic] = useState('');
  const [sp, setSp] = useState('');
  const [cgl, setCgl] = useState('');
  const [el, setEl] = useState('');
  const [tcg, setTcg] = useState('');
  const [ecgt, setEcgt] = useState('');
  const [QBID, setQbid] = useState('');
  const [formType, setFormType] = useState('1040 - Schedule C/F');

  const { performCalculations } = useCalculations();

  // Calculate dependent fields when inputs change
  useEffect(() => {
    if (sp && opp && ric) {
      // Calculate Capital Gain or Loss (CGL)
      const calculatedCgl = parseFloat(sp) - parseFloat(opp) - parseFloat(ric);
      setCgl(calculatedCgl.toFixed(2));

      // Calculate Exemption Limit (EL)
      const calculatedEl = filingStatus === 'MFJ' ? 500000 : 250000;
      setEl(calculatedEl.toFixed(2));

      // Calculate Taxable Capital Gain (TCG)
      const calculatedTcg = calculatedCgl >= calculatedEl ? calculatedCgl - calculatedEl : 0;
      setTcg(calculatedTcg.toFixed(2));

      // Calculate Estimated Capital Gain Tax (ECGT)
      const calculatedEcgt = calculatedTcg > 0 ? calculatedTcg * 0.20 : 0;
      setEcgt(calculatedEcgt.toFixed(2));
    }
  }, [sp, opp, ric, filingStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Net Income for Analysis is required and must be greater than 0.');
      return;
    }

    if (!opp || parseFloat(opp) <= 0) {
      setError('Original Purchased Price is required and must be greater than 0.');
      return;
    }

    if (!sp || parseFloat(sp) <= 0) {
      setError('Sale Price is required and must be greater than 0.');
      return;
    }

    setError(null);

    const results = performCalculations({
      calculationType: 'primarySaleExclusion',
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      opp: parseFloat(opp),
      ric: parseFloat(ric),
      sp: parseFloat(sp),
      cgl: parseFloat(cgl),
      el: parseFloat(el),
      tcg: parseFloat(tcg),
      ecgt: parseFloat(ecgt),
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
                label="Original Purchased Price (OPP)"
                fullWidth
                type="number"
                value={opp}
                onChange={(e) => setOpp(e.target.value)}
                margin="normal"
                required
                error={opp !== '' && parseFloat(opp) <= 0}
                helperText={opp !== '' && parseFloat(opp) <= 0 ? 'Must be greater than 0' : ''}
              />

              <TextField
                label="Renovations and improvement cost (RIC)"
                fullWidth
                type="number"
                value={ric}
                onChange={(e) => setRic(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Sale price (SP)"
                fullWidth
                type="number"
                value={sp}
                onChange={(e) => setSp(e.target.value)}
                margin="normal"
                required
                error={sp !== '' && parseFloat(sp) <= 0}
                helperText={sp !== '' && parseFloat(sp) <= 0 ? 'Must be greater than 0' : ''}
              />
            </Grid>

            <Grid item xs={12} md={6}>
             

              <TextField
                label="Capital Gain or Loss (CGL)"
                fullWidth
                type="number"
                value={cgl}
                margin="normal"
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                label="Exemption limit (EL)"
                fullWidth
                type="number"
                value={el}
                margin="normal"
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                label="Taxable Capital Gain (TCG)"
                fullWidth
                type="number"
                value={tcg}
                margin="normal"
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                label="Estimated Capital Gain Tax (20%) (ECGT)"
                fullWidth
                type="number"
                value={ecgt}
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

export default PrimarySaleExclusion; 