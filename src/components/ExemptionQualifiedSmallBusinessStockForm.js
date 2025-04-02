import React, { useState } from 'react';
import { TextField, Button, Container, Box, Grid, MenuItem, Alert } from '@mui/material';
import useCalculations from '../utils/useCalculations';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const ExemptionQualifiedSmallBusinessStockForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [stockSellPrice, setStockSellPrice] = useState('');
  const [stockCost, setStockCost] = useState('');
  const [capitalGainQSBS, setCapitalGainQSBS] = useState('');
  const [yearsHolding, setYearsHolding] = useState('');
  const [theStocksWere, setTheStocksWere] = useState('No');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [stockAdquisitionDate, setStockAdquisitionDate] = useState('2009');
  const [QBID, setQbid] = useState('');
 
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!filingStatus || !grossIncome || !partnerType) {
      setError('All fields are required.');
      return;
    }

    if (!stockSellPrice || parseFloat(stockSellPrice) <= 0) {
      setError('Stock\'s sell price is required and must be greater than 0.');
      return;
    }

    if (!stockCost || parseFloat(stockCost) <= 0) {
      setError('Stock\'s cost is required and must be greater than 0.');
      return;
    }

    if (!capitalGainQSBS || parseFloat(capitalGainQSBS) <= 0) {
      setError('Capital gain in the sale of QSBS is required and must be greater than 0.');
      return;
    }

    if (parseInt(yearsHolding, 10) < 5) {
      setError('The stock must be held for at least 5 years.');
      return;
    }

    setError(null);

    const stockProfit = parseFloat(stockSellPrice) - parseFloat(stockCost);

    const limitOfExemption = stockAdquisitionDate === "2009"
  ? 0.5 // 50%
  : stockAdquisitionDate === "2010-1"
  ? 0.75 // 75%
  : 1; // 100%

    console.log('Limit of Exemption:', limitOfExemption);

    let finalCapitalGain = parseFloat(capitalGainQSBS);
    if (parseInt(yearsHolding, 10) < 5 || theStocksWere === 'No') {
      finalCapitalGain = 0;
    }

    finalCapitalGain = Math.min(finalCapitalGain * limitOfExemption, parseFloat(stockCost));
    console.log('Final Capital Gain:', finalCapitalGain);

 // Función para calcular Total Savings of Capital Gain
 const calculateTotalSavingsOfCapitalGain = (capitalGainQSBS, limitOfExemption, limitOfExemptionAmount) => {
  // Calcular el ahorro fiscal potencial
  const potentialSavings = capitalGainQSBS * limitOfExemption * 0.2;

  // Evaluar las condiciones
  if (potentialSavings >= limitOfExemptionAmount) {
    return limitOfExemptionAmount; // Si el ahorro supera el límite, usar el límite
  } else {
    return potentialSavings; // De lo contrario, usar el ahorro calculado
  }
};

// Llama a la función para calcular Total Savings of Capital Gain (TSCG)
const totalSavings = calculateTotalSavingsOfCapitalGain(
  parseFloat(capitalGainQSBS), // CGSQ
  limitOfExemption, // E%
  parseFloat(stockCost) // LE
);

console.log('Total Savings of Capital Gain (TSCG):', totalSavings);



    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      stockSellPrice: parseFloat(stockSellPrice),
      stockCost: limitOfExemption,
      capitalGainQSBS: finalCapitalGain,
      yearsHolding,
      stockProfit,
      theStocksWere,
      formType,
      stockAdquisitionDate,
      QBID: parseFloat(QBID),
      calculateTotalSavingsOfCapitalGain,
      totalSavings,
      calculationType: 'exemptionQualifiedSmall',
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        {/* Enlace en la esquina superior derecha */}
        <Box sx={{ position: 'absolute', top: -10, right: 0, }}>
          <Button
            href="https://cmltaxplanning.com/docs/S15.pdf"
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

              <TextField
                label="Stock's Sell Price"
                fullWidth
                type="number"
                value={stockSellPrice}
                onChange={(e) => setStockSellPrice(e.target.value)}
                margin="normal"
              />
                <TextField
                label="Stock's Cost"
                fullWidth
                type="number"
                value={stockCost}
                onChange={(e) => setStockCost(e.target.value)}
                margin="normal"
              />

           
            </Grid>

            <Grid item xs={12} md={6}>
            <TextField
                label="Capital Gain in the Sale of QSBS"
                fullWidth
                type="number"
                value={capitalGainQSBS}
                onChange={(e) => setCapitalGainQSBS(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Years Holding the Stock (Min 5 Yrs)"
                fullWidth
                type="number"
                value={yearsHolding}
                onChange={(e) => setYearsHolding(e.target.value)}
                margin="normal"
              />
              <TextField
              select
              label="Stock Adquisition Date"
              fullWidth
              value={stockAdquisitionDate}
              onChange={(e) => setStockAdquisitionDate(e.target.value)}
              margin="normal"
             >
              <MenuItem value="2009">Before Feb 17, 2009</MenuItem>
              <MenuItem value="2010-1">Before Sept 28, 2010</MenuItem>
              <MenuItem value="2010-2">After Sept 27, 2010</MenuItem>

              </TextField>

              <TextField
                select
                label="The stocks were adquired directly from the QSB"
                fullWidth
                value={theStocksWere}
                onChange={(e) => setTheStocksWere(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>

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

export default ExemptionQualifiedSmallBusinessStockForm;

