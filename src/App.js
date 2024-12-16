import React, { useState } from 'react';
import DepreciationForm from './components/DepreciationForm';
import AugustaRuleForm from './components/AugustaRuleForm';
import ResultsDisplay from './components/ResultsDisplay';
import FormSelector from './components/FormSelector';
import { Container, CssBaseline, Box, ThemeProvider, createTheme, Button, Typography } from '@mui/material';

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
      default:
        return 'Select a Form to Continue';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <CssBaseline />

        {/* Logo */}
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <img
            src="https://cmlaccountant.com/templates/yootheme/cache/logoNegro600px_CarlosMLopez_V2-1959ed57.webp"
            alt="Logo"
            style={{ maxWidth: '200px', marginBottom: '20px' }}
          />
        </Box>

        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            {getFormTitle()}
          </Typography>

          {renderForm()}

          {currentForm && (
            <Button onClick={handleBackToSelector} variant="outlined" sx={{ mt: 2 }}>
              Back to Form Selection
            </Button>
          )}

          {results && <ResultsDisplay results={results} />}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
