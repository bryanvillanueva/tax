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
import { standardDeductions } from './utils/taxData';
import { Container, CssBaseline, Box, ThemeProvider, createTheme } from '@mui/material';
import './App.css';


const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, sans-serif',
  },
  palette: {
    primary: {
      main: '#9ce7ff',
    },
    secondary: {
      main: '#30C2F3',
    },
  },
});

function App() {
  const [results, setResults] = useState(null);

  const handleCalculate = ({ filingStatus, grossIncome, cost, investType, partnerType }) => {
    const netIncome = calculateNetIncome(grossIncome, cost, investType);
    const selfEmploymentTax = partnerType === 'Active' ? calculateSelfEmploymentTax(netIncome) : 0;
    const seMedicare = partnerType === 'Active' ? calculateSEMedicare(netIncome) : 0;

    const agi = calculateAGI(netIncome, selfEmploymentTax);
    const standardDeduction = standardDeductions[filingStatus];
    const taxableIncome = calculateTaxableIncome(agi, filingStatus);
    const { marginalRate, level } = getMarginalTaxRateAndLevel(filingStatus, taxableIncome);
    const taxDue = calculateTaxDue(filingStatus, taxableIncome);
    const additionalMedicare = calculateAdditionalMedicare(filingStatus, netIncome);
    const seDeduction = selfEmploymentTax / 2;
    const selfEmploymentRate = partnerType === 'Active' ? getSelfEmploymentRate() : 0;
    const totalTaxDue = taxDue + selfEmploymentTax + additionalMedicare;
    const effectiveTaxRate = taxableIncome > 0 ? ((taxDue / taxableIncome) * 100).toFixed(2) : '0.00';

    setResults({
      netIncome,
      selfEmploymentRate,
      agi,
      standardDeduction,
      taxableIncome,
      marginalRate: (marginalRate * 100).toFixed(2),
      incomeLevel: level,
      taxDue,
      seSocialSecurity: partnerType === 'Active' ? selfEmploymentTax * (12.4 / 15.3) : 0,
      seMedicare,
      totalSE: selfEmploymentTax,
      seDeduction,
      additionalMedicare,
      totalTaxDue,
      effectiveTaxRate,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <CssBaseline />
        <Box sx={{ my: 4 }}>
        <Box sx={{ textAlign: 'center', mt: 6, mb: 8 }}>
           <img src={'https://cmlaccountant.com/templates/yootheme/cache/logoNegro600px_CarlosMLopez_V2-1959ed57.webp'} alt="IRS Logo" style={{ maxWidth: '350px', marginTop: '50px', marginBottom: '15px' }} />
        </Box>
          <DepreciationForm onCalculate={handleCalculate} />
          {results && <ResultsDisplay results={results} />}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
