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
  calculateAssets,
  calculateLiabilities,
  calculateAssetLiabilityRatio,
} from './utils/calculations';
import { Container, CssBaseline, Box, ThemeProvider, createTheme } from '@mui/material';
import './App.css'; // Asegúrate de importar el archivo CSS
import { standardDeductions } from './utils/taxData';

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

    // Cálculo para 1040/1040NR
    const seSocialSecurity = (netIncome * 0.9235) * 0.124;
    const seMedicare = calculateSEMedicare(netIncome);
    const selfEmploymentTax = seSocialSecurity + seMedicare;
    const agi = calculateAGI(netIncome, selfEmploymentTax);
    const standardDeduction = standardDeductions[filingStatus];
    const taxableIncome = calculateTaxableIncome(agi, filingStatus);
    const { marginalRate, level } = getMarginalTaxRateAndLevel(filingStatus, taxableIncome);
    const taxDue = calculateTaxDue(filingStatus, taxableIncome);
    const additionalMedicare = calculateAdditionalMedicare(filingStatus, netIncome);
    const selfEmploymentRate = getSelfEmploymentRate();
    const totalTaxDue = taxDue + selfEmploymentTax + additionalMedicare;
    const effectiveTaxRate = taxableIncome !== 0 ? ((taxDue / taxableIncome) * 100).toFixed(2) : '0.00';
    const seDeduction = selfEmploymentTax / 2;

    // Cálculo para 1120 (Corporations)
    const corpTaxableIncome = netIncome;
    const corpTaxDue = corpTaxableIncome * 0.21;
    const corpEffectiveTaxRate = corpTaxableIncome !== 0 ? ((corpTaxDue / corpTaxableIncome) * 100).toFixed(2) : '0.00';
    
    // Actualizar los resultados
    setResults({
      netIncome,
      selfEmploymentRate,
      agi,
      standardDeduction,
      taxableIncome,
      marginalRate: (marginalRate * 100).toFixed(2),
      incomeLevel: level,
      taxDue,
      seSocialSecurity,
      seMedicare,
      totalSE: selfEmploymentTax,
      additionalMedicare,
      totalTaxDue,
      corpTaxableIncome,
      corpTaxDue,
      effectiveTaxRate,
      corpEffectiveTaxRate,
      seDeduction
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <CssBaseline />
        <Box sx={{ my: 4 }}>
          <Box sx={{ textAlign: 'center', mt: 6, mb: 8 }}>
            <img
              src="https://cmlaccountant.com/templates/yootheme/cache/logoNegro600px_CarlosMLopez_V2-1959ed57.webp"
              alt="Logo"
              style={{ maxWidth: '400px', marginTop: '50px', marginBottom: '15px' }}
            />
          </Box>
          <DepreciationForm onCalculate={handleCalculate} />
          {results && <ResultsDisplay results={results} />}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
