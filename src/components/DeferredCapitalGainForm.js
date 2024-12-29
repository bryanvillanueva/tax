import React, { useState } from 'react';
import { Box, TextField, Typography, MenuItem, Button } from '@mui/material';

const DeferredCapitalGainForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [typeOfPartner, setTypeOfPartner] = useState('Active');
  const [capitalGain, setCapitalGain] = useState('');
  const [installmentPeriod, setInstallmentPeriod] = useState('');


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
      };
      onCalculate(resultData);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Deferred Capital Gain Form
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Campos del lado izquierdo */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            General Inputs
          </Typography>
          <TextField
            select
            label="Filing Status"
            value={filingStatus}
            onChange={(e) => setFilingStatus(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="Single">Single</MenuItem>
            <MenuItem value="Married">Married</MenuItem>
            <MenuItem value="Head of Household">Head of Household</MenuItem>
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
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Specific Inputs
          </Typography>
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
  );
};

export default DeferredCapitalGainForm;
