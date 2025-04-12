import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useCalculations from '../utils/useCalculations';

const QualifiedCharitableDistributions = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [error, setError] = useState(null);
  
  // Right side state variables
  const [cyrmd, setCyrmd] = useState('');
  const [tmar, setTmar] = useState('No');
  const [aqcd, setAqcd] = useState('');
  const [limit, setLimit] = useState('');
  const [ti, setTi] = useState('');
  const [totalDeductionQCDS, setTotalDeductionQCDS] = useState('');
  const [QBID, setQbid] = useState('');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  
  const { performCalculations } = useCalculations();

  // Calculate dependent fields when inputs change
  useEffect(() => {
    // Calculate Limit based on filing status
    const calculatedLimit = filingStatus === 'MFJ' ? 200000 : 100000;
    setLimit(calculatedLimit.toFixed(2));

    if (cyrmd && aqcd) {
      // Calculate Taxable Income (TI)
      const calculatedTi = parseFloat(aqcd) >= calculatedLimit 
        ? parseFloat(cyrmd) - calculatedLimit 
        : parseFloat(cyrmd) - parseFloat(aqcd);
      setTi(calculatedTi.toFixed(2));

      // Calculate Total Deduction (TD)
      const calculatedTotalDeductionQCDS = tmar === 'Yes' 
        ? (parseFloat(aqcd) >= calculatedLimit ? calculatedLimit : parseFloat(aqcd))
        : 0;
      setTotalDeductionQCDS(calculatedTotalDeductionQCDS.toFixed(2));
    }
  }, [cyrmd, aqcd, tmar, filingStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Net Income for Analysis is required and must be greater than 0.');
      return;
    }

    if (!cyrmd || parseFloat(cyrmd) <= 0) {
      setError('Current year - IRA Required Minimum Distribution is required and must be greater than 0.');
      return;
    }

    setError(null);

    const results = performCalculations({
      calculationType: 'qualifiedCharitableDistributions',
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      cyrmd: parseFloat(cyrmd),
      tmar,
      aqcd: parseFloat(aqcd),
      limit: parseFloat(limit),
      ti: parseFloat(ti),
      totalDeductionQCDS: parseFloat(totalDeductionQCDS),
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
            href="https://cmltaxplanning.com/docs/S65.pdf"
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
                label="Current year - IRA Required Minimum Distribution (CYRMD)"
                fullWidth
                type="number"
                value={cyrmd}
                onChange={(e) => setCyrmd(e.target.value)}
                margin="normal"
                required
                error={cyrmd !== '' && parseFloat(cyrmd) <= 0}
                helperText={cyrmd !== '' && parseFloat(cyrmd) <= 0 ? 'Must be greater than 0' : ''}
              />

              <TextField
                select
                label="The taxpayer meets the age requirements (TMAR)"
                fullWidth
                value={tmar}
                onChange={(e) => setTmar(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>

            </Grid>

            <Grid item xs={12} md={6}>
              
              <TextField
                label="Amount to QCD (AQCD)"
                fullWidth
                type="number"
                value={aqcd}
                onChange={(e) => setAqcd(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Limit"
                fullWidth
                type="number"
                value={limit}
                margin="normal"
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                label="Taxable Income (TI)"
                fullWidth
                type="number"
                value={ti}
                margin="normal"
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                label="Total Deduction QCDS"
                fullWidth
                type="number"
                value={totalDeductionQCDS}
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

export default QualifiedCharitableDistributions; 
