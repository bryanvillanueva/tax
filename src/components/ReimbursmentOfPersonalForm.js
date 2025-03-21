import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import useCalculations from "../utils/useCalculations";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';



const ReimbursmentOfPersonalForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState ('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [tve, setTve] = useState(''); // Total Vehicle Expenses
  const [pbuv, setPbuv] = useState(''); // Percentage Business Use of Vehicle
  const [partnerType, setPartnerType] = useState('Active');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [QBID, setQbid] = useState('');
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Net Income for Analysis is required and must be greater than 0.');
      return;
    }

    if (!tve || parseFloat(tve) <= 0) {
      setError('Total Vehicle Expenses (TVE) is required and must be greater than 0.');
      return;
    }

    if (!pbuv || parseFloat(pbuv) <= 0 || parseFloat(pbuv) > 100) {
      setError('Percentage Business Use of Vehicle (PBUV) is required and must be between 0 and 100.');
      return;
    }

    setError(null);


    const reimbursment = parseFloat(tve) * (parseFloat(pbuv) / 100);


    const results = performCalculations ({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      tve: parseFloat(tve),
      pbuv: parseFloat(pbuv),
      partnerType,
      reimbursment, 
      formType,
      calculationType: 'reimbursment',
      QBID: parseFloat(QBID),
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        {/* Enlace en la esquina superior derecha */}
        <Box sx={{ position: 'absolute', top: -10, right: 0, }}>
          <Button
            href="https://tax.bryanglen.com/data/Strategies-Structure.pdf"
            target="_blank"
            sx={{ textTransform: 'none', backgroundColor: '#ffffff', color: '#0858e6', fontSize: '0.875remc', marginBottom: '150px', }}
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
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Total Vehicle Expenses (TVE)"
                fullWidth
                type="number"
                value={tve}
                onChange={(e) => setTve(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Percentage Business Use of Vehicle (PBUV)"
                fullWidth
                type="number"
                value={pbuv}
                onChange={(e) => setPbuv(e.target.value)}
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

export default ReimbursmentOfPersonalForm;