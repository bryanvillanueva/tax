import React, { useState } from 'react';
import DepreciationForm from './components/DepreciationForm';
import AugustaRuleForm from './components/AugustaRuleForm';
import PrepaidExpensesForm from './components/PrepaidExpensesForm';
import HireYourKidsForm from './components/HireYourKids';
import ResultsDisplay from './components/ResultsDisplay';
import FormSelector from './components/FormSelector';
import ReimbursmentOfPersonalForm from './components/ReimbursmentOfPersonalForm';
import CharitableRemainderForm from './components/CharitableRemainderForm';
import HireYourFamilyForm from './components/HireYourFamily';
import QualifiedOpportunityFundsForm from './components/QualifiedOpportunityFunds';
import { Container, CssBaseline, Box, ThemeProvider, createTheme, Button, Typography, Fab } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home'; // Importa el icono de Home

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
  const [currentForm, setCurrentForm] = useState(null);

  // Función para seleccionar el formulario y limpiar los resultados
  const handleSelectForm = (form) => {
    setCurrentForm(form);
    setResults(null); // Limpiar los resultados al cambiar de formulario
  };

  // Función para regresar al selector de formularios
  const handleBackToSelector = () => {
    setCurrentForm(null);
    setResults(null); // Limpiar los resultados al regresar al selector
  };

  const renderForm = () => {
    switch (currentForm) {
      case 'depreciation':
        return <DepreciationForm onCalculate={setResults} />;
      case 'augusta':
        return <AugustaRuleForm onCalculate={setResults} />;
      case 'prepaid':
        return <PrepaidExpensesForm onCalculate={setResults} />;
      case 'hireKids':
        return <HireYourKidsForm onCalculate={setResults} />;
      case 'charitableRemainderTrust':
        return <CharitableRemainderForm onCalculate={setResults} />;
      case 'reimbursment':
        return <ReimbursmentOfPersonalForm onCalculate={setResults} />;
      case 'hireFamily':
        return <HireYourFamilyForm onCalculate={setResults} />;
      case 'qualifiedOpportunityFunds':
        return <QualifiedOpportunityFundsForm onCalculate={setResults} />;
      default:
        return <FormSelector onSelectForm={handleSelectForm} />;
    }
  };
  
  const getFormTitle = () => {
    switch (currentForm) {
      case 'depreciation':
        return 'Depreciation Form';
      case 'augusta':
        return 'Augusta Rule Form';
      case 'prepaid':
        return 'Prepaid Expenses Form';
      case 'hireKids':
        return 'Hire Your Kids Form';
      case 'charitableRemainderTrust':
        return 'Charitable Remainder Form';
      case 'reimbursment':
        return 'Reimbursment of personal Vehicle Form';
      case 'hireFamily':
        return 'Hire your family form';
      case 'qualifiedOpportunityFunds':
        return 'Qualified Opportunity Funds (QOF) Form';
        
      default:
        return '';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <CssBaseline />

        {/* Logo */}
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <img
            src="https://tax.bryanglen.com/logo.png"
            alt="Logo"
            style={{ maxWidth: '350px', marginBottom: '20px' }}
          />
        </Box>

        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            {getFormTitle()}
          </Typography>

          {renderForm()}

          {currentForm && (
           <Fab
             color="primary"
             aria-label="back"
             onClick={handleBackToSelector}
             sx={{
             position: 'fixed',
             bottom: 32,
             right: 32,
             width: 80,
             height: 80,
             backgroundColor: '#0858e6',
             '&:hover': {
              backgroundColor: '#064bb5',
          },
    }}
  >
    <HomeIcon sx={{ color: '#fff' }} />
  </Fab>
)}

          {results && <ResultsDisplay results={results} />}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
