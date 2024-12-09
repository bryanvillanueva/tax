import React, { useState } from 'react';
import DepreciationForm from './components/DepreciationForm';
import ResultsDisplay from './components/ResultsDisplay';
import {
  calculateNetIncome,
  calculateSelfEmploymentTax,
  calculateSEMedicare,
  calculateAGI,
  calculateTaxableIncome,
  getMarginalTaxRateAndLevel,
  calculateTaxDue,
  calculateAdditionalMedicare,
  getSelfEmploymentRate,
} from './utils/calculations';
import { Container, CssBaseline, Box, Typography, ThemeProvider, createTheme } from '@mui/material';
import './App.css'; // Asegúrate de importar el archivo CSS

// Crear el tema personalizado con la fuente Montserrat y el color para botones
const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, sans-serif',
  },
  palette: {
    primary: {
      main: '#9ce7ff', // Color personalizado para botones
    },
    secondary: {
      main: '#30C2F3',
    },
  },
});

function App() {
  const [results, setResults] = useState(null);

  const handleCalculate = ({ filingStatus, grossIncome, cost, investType }) => {
    const netIncome = calculateNetIncome(grossIncome, cost, investType);
    const selfEmploymentTax = calculateSelfEmploymentTax(netIncome);
    const seMedicare = calculateSEMedicare(netIncome);
    const agi = calculateAGI(netIncome, selfEmploymentTax);
    const taxableIncome = calculateTaxableIncome(agi, filingStatus);
    const { marginalRate, level } = getMarginalTaxRateAndLevel(filingStatus, taxableIncome);
    const taxDue = calculateTaxDue(filingStatus, taxableIncome);
    const additionalMedicare = calculateAdditionalMedicare(filingStatus, netIncome);
    const totalSE = selfEmploymentTax;
    const seDeduction = selfEmploymentTax / 2;
    const selfEmploymentRate = getSelfEmploymentRate();
    const totalTaxDue = taxDue + totalSE + additionalMedicare;

    setResults({
      netIncome,
      selfEmploymentRate,
      agi,
      taxableIncome,
      marginalRate: (marginalRate * 100).toFixed(2),
      incomeLevel: level,
      taxDue,
      seSocialSecurity: totalSE * (12.4 / 15.3),
      seMedicare,
      totalSE,
      seDeduction,
      additionalMedicare,
      totalTaxDue,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <CssBaseline />
        <Box sx={{ my: 4 }}>
        <Box sx={{ textAlign: 'center', mt: 6, mb: 8 }}>
           <img src={'https://logos-world.net/wp-content/uploads/2021/02/IRS-Logo.png'} alt="IRS Logo" style={{ maxWidth: '200px', marginTop: '50px', marginBottom: '15px' }} />
        </Box>
          <DepreciationForm onCalculate={handleCalculate} />
          {results && <ResultsDisplay results={results} />}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
