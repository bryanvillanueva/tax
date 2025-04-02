import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useCalculations from '../utils/useCalculations';



const IncomeShiftingForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [ordinaryIncomeShifted, setOrdinaryIncomeShifted] = useState('');
  const [capitalGainShifted, setcapitalGainShifted] = useState('');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [QBID, setQbid] = useState('');
  const [error, setError] = useState(null);

  

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validaciones de los campos
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!ordinaryIncomeShifted || parseFloat(ordinaryIncomeShifted) <= 0) {
      setError('Total Reimbursable Expenses is required and must be greater than 0.');
      return;
    }

    if (!capitalGainShifted || parseFloat(capitalGainShifted) <= 0) {
        setError('Total Reimbursable Expenses is required and must be greater than 0.');
        return;
      }
   
    const totalIncomeShifted = parseFloat(ordinaryIncomeShifted) + parseFloat(capitalGainShifted);
   

    setError(null);


    // Llamada al hook con calculationType 'accountablePlan'
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      ordinaryIncomeShifted: parseFloat(ordinaryIncomeShifted),
      capitalGainShifted: parseFloat(capitalGainShifted),
      totalIncomeShifted,
      formType,
      calculationType: 'incomeShifting', 
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
            href="https://cmltaxplanning.com/docs/S21.pdf"
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
            {/* Lado Izquierdo */}
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

            {/* Lado Derecho */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Ordinary Income Shifted"
                fullWidth
                type="number"
                value={ordinaryIncomeShifted}
                onChange={(e) => setOrdinaryIncomeShifted(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Capital Gain Shifted"
                fullWidth
                type="number"
                value={capitalGainShifted}
                onChange={(e) => setcapitalGainShifted(e.target.value)}
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
            <Button type="submit" variant="contained" sx={{backgroundColor:'#0858e6', color: '#fff'}}>
              Calculate
            </Button>
          </Box>  
        </form>
      </Box>
    </Container>
  );
};

export default IncomeShiftingForm;

