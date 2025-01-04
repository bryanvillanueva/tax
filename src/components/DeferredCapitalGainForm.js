import React, { useState } from 'react';
import { Box, TextField, Typography, MenuItem, Button, Container } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


const DeferredCapitalGainForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [typeOfPartner, setTypeOfPartner] = useState('Active');
  const [capitalGain, setCapitalGain] = useState('');
  const [installmentPeriod, setInstallmentPeriod] = useState('');
  const [formType, setFormType] = useState('1040 - Schedule C/F');



  const trustInterestRate = 0.07; // Valor fijo (7%)

  const currentYearTax =
    capitalGain && installmentPeriod
      ? ((capitalGain / installmentPeriod) * 0.2).toFixed(2)
      : '';
  const deferredTax =
    capitalGain && installmentPeriod
      ? ((capitalGain - capitalGain / installmentPeriod) * 0.2).toFixed(2)
      : '';
  const potentialInterestIncome =
    capitalGain && installmentPeriod
      ? (
          (capitalGain - (capitalGain / installmentPeriod)) * trustInterestRate
        ).toFixed(2)
      : '';
  const netBenefit =
    grossIncome && potentialInterestIncome
      ? (parseFloat(potentialInterestIncome) - parseFloat(currentYearTax)).toFixed(2)
      : '';

       
      

  const handleCalculate = () => {
    if (capitalGain && installmentPeriod) {
      const resultData = {
        capitalGain,
        trustInterestRate,
        grossIncome: parseFloat(grossIncome),
        installmentPeriod,
        currentYearTax,
        deferredTax,
        potentialInterestIncome,
        netBenefit,
        formType
      };
      onCalculate(resultData);
    }
  };

  return (
    <Container>
    <Box sx={{ position: 'relative', mt: 5 }}>
        {/* Enlace en la esquina superior derecha */}
        <Box sx={{ position: 'absolute', top: -40, right: 0, }}>
          <Button
            href="https://tax.bryanglen.com/data/Strategies-Structure.pdf"
            target="_blank"
            sx={{ textTransform: 'none', backgroundColor: '#ffffff', color: '#0858e6', fontSize: '0.875remc', marginBottom: '150px', }}
            startIcon={<InfoOutlinedIcon />}
          >
            View Strategy Details
          </Button>
        </Box>
      
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Campos del lado izquierdo */}
        <Box sx={{ flex: 1 }}>
          
          <TextField
            select
            label="Filing Status"
            value={filingStatus}
            onChange={(e) => setFilingStatus(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
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
            variant="outlined"
            type="number"
            value={grossIncome}
            onChange={(e) => setGrossIncome(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="Type of Partner"
            value={typeOfPartner}
            onChange={(e) => setTypeOfPartner(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Passive">Passive</MenuItem>
          </TextField>
        </Box>

        {/* Campos del lado derecho */}
        <Box sx={{ flex: 1 }}>
          
          <TextField
            fullWidth
            label="Capital gain over property sold to the trust"
            type="number"
            value={capitalGain}
            onChange={(e) => setCapitalGain(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Trust Interest Rate"
            value={`7%`}
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Installment period (Years)"
            type="number"
            value={installmentPeriod}
            onChange={(e) => setInstallmentPeriod(e.target.value)}
            sx={{ mb: 2 }}
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
        </Box>
      </Box>

      {/* Resultados */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Results</Typography>
        <TextField
          fullWidth
          label="Capital Gain Tax - Current Year (20%)"
          value={`$${currentYearTax}`}
          disabled
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Capital Gain Tax - Deferred (20%)"
          value={`$${deferredTax}`}
          disabled
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Potential Interest Income - First Year"
          value={`$${potentialInterestIncome}`}
          disabled
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Net Benefit"
          value={`$${netBenefit}`}
          disabled
          sx={{ mb: 2 }}
        />
      </Box>

      {/* Botón de calcular */}
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCalculate}
          disabled={!capitalGain || !installmentPeriod}
        >
          Calculate
        </Button>
      </Box>
    </Box>
    </Container>
  );
};

export default DeferredCapitalGainForm;
