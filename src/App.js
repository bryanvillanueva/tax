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
import { standardDeductions, socialSecurityWageBase } from './utils/taxData';
import { Container, CssBaseline, Box, ThemeProvider, createTheme } from '@mui/material';
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

  const handleCalculate = ({ filingStatus, grossIncome, cost, investType, partnerType }) => {
    // Cálculo del Net Income
    const netIncome = calculateNetIncome(grossIncome, cost, investType);

    // Determinar Self-Employment Tax y Medicare según el partnerType
    const seSocialSecurity = partnerType === 'Active'
      ? Math.min((netIncome * 0.9235) * 0.124, socialSecurityWageBase * 0.124)
      : 0;

    const seMedicare = partnerType === 'Active' ? calculateSEMedicare(netIncome) : 0;

    const selfEmploymentTax = seSocialSecurity + seMedicare;
    const agi = calculateAGI(netIncome, selfEmploymentTax);

    // Calcular deducciones y Taxable Income
    const standardDeduction = standardDeductions[filingStatus];
    const taxableIncome = calculateTaxableIncome(agi, filingStatus);

    // Obtener Marginal Tax Rate y nivel
    const { marginalRate, level } = getMarginalTaxRateAndLevel(filingStatus, taxableIncome);

    // Calcular impuestos
    const taxDue = calculateTaxDue(filingStatus, taxableIncome);
    const additionalMedicare = calculateAdditionalMedicare(filingStatus, netIncome);
    const selfEmploymentRate = partnerType === 'Active' ? getSelfEmploymentRate() : 0;
    const totalTaxDue = taxDue + selfEmploymentTax + additionalMedicare;
    const effectiveTaxRate = taxableIncome !== 0 ? ((taxDue / taxableIncome) * 100).toFixed(2) : '0.00';
    const seDeduction = selfEmploymentTax / 2;

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
      effectiveTaxRate,
      seDeduction,
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
