// QbidStandardMethod.js
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Container,
  Box,
  MenuItem,
  Alert,
  Grid,
  Typography
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { QbiThresholdFirstLimit, QbiThresholdPhaseIn } from '../utils/taxData';
import performQBIDCalculations from '../utils/QbidStandarCalculations';
import QbidResults from './QbidResults';

const QbidStandardMethod = ({ onCalculate }) => {
  // Estados para los campos de entrada
  const [filingStatus, setFilingStatus] = useState('Single');
  const [threshold, setThreshold] = useState(QbiThresholdFirstLimit.Single);
  const [qualifiedBusinessIncome, setQualifiedBusinessIncome] = useState('');
  const [w2Wages, setW2Wages] = useState('');
  const [ubia, setUbia] = useState('');
  const [taxableIncomeBeforeQbid, setTaxableIncomeBeforeQbid] = useState('');
  const [patronReduction, setPatronReduction] = useState('');

  // Valores fijos para los componentes
  const componentRate = 0.20;
  const component50 = 0.50;
  const component25 = 0.25;
  const componentUbia = 0.025;

  // Estados para la sección Phased-In
  const [phasedInThreshold, setPhasedInThreshold] = useState(QbiThresholdFirstLimit.Single);
  const [phaseInRange, setPhaseInRange] = useState(QbiThresholdPhaseIn.Single);

  const [error, setError] = useState(null);
  const [calculationResults, setCalculationResults] = useState(null);

  // Actualizar umbrales según el filing status
  useEffect(() => {
    setThreshold(QbiThresholdFirstLimit[filingStatus]);
    setPhasedInThreshold(QbiThresholdFirstLimit[filingStatus]);
    setPhaseInRange(QbiThresholdPhaseIn[filingStatus]);
  }, [filingStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!qualifiedBusinessIncome || parseFloat(qualifiedBusinessIncome) <= 0) {
      setError('Qualified Business Income is required and must be greater than 0.');
      return;
    }
    if (!taxableIncomeBeforeQbid || parseFloat(taxableIncomeBeforeQbid) <= 0) {
      setError('Taxable Income Before QBID is required and must be greater than 0.');
      return;
    }

    // Llamada a la función de cálculos usando el nuevo hook
    const results = performQBIDCalculations({
      filingStatus,
      threshold,
      qualifiedBusinessIncome: parseFloat(qualifiedBusinessIncome) || 0,
      componentRate,
      w2Wages: parseFloat(w2Wages) || 0,
      component50,
      component25,
      ubia: parseFloat(ubia) || 0,
      componentUbia,
      taxableIncomeBeforeQbid: parseFloat(taxableIncomeBeforeQbid) || 0,
      phasedInThreshold,
      phaseInRange,
      patronReduction: parseFloat(patronReduction) || 0,
      calculationType: 'qbidStandardMethod',
    

    });

    setCalculationResults(results);
    if (onCalculate) {
      onCalculate(results);
    }
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        <Box sx={{ position: 'absolute', top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S4.pdf"
            target="_blank"
            sx={{
              textTransform: 'none',
              backgroundColor: '#ffffff',
              color: '#0858e6',
              fontSize: '0.875rem',
              marginBottom: '150px',
            }}
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
            {/* Columna izquierda */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Individual Taxpayer's Status"
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
                label="Qualified Business Income"
                fullWidth
                type="number"
                value={qualifiedBusinessIncome}
                onChange={(e) => setQualifiedBusinessIncome(e.target.value)}
                margin="normal"
                InputProps={{ startAdornment: <Box component="span" mr={0.5}>$</Box> }}
              />
              <TextField
                label="W2 Wages"
                fullWidth
                type="number"
                value={w2Wages}
                onChange={(e) => setW2Wages(e.target.value)}
                margin="normal"
                InputProps={{ startAdornment: <Box component="span" mr={0.5}>$</Box> }}
              />
            </Grid>

            {/* Columna derecha */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Taxable Income Before QBID"
                fullWidth
                type="number"
                value={taxableIncomeBeforeQbid}
                onChange={(e) => setTaxableIncomeBeforeQbid(e.target.value)}
                margin="normal"
                InputProps={{ startAdornment: <Box component="span" mr={0.5}>$</Box> }}
              />
              <TextField
                label="Amount of UBIA"
                fullWidth
                type="number"
                value={ubia}
                onChange={(e) => setUbia(e.target.value)}
                margin="normal"
                InputProps={{ startAdornment: <Box component="span" mr={0.5}>$</Box> }}
              />
              <TextField
                label="Patron Reduction"
                fullWidth
                type="number"
                value={patronReduction}
                onChange={(e) => setPatronReduction(e.target.value)}
                margin="normal"
                InputProps={{ startAdornment: <Box component="span" mr={0.5}>$</Box> }}
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

export default QbidStandardMethod;
