import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid, Paper, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import performQBIDCalculationsSimple from '../utils/QbidSimpleCalculations';
import { QbiThresholdFirstLimit } from '../utils/taxData';
import QBIDResultsDisplay from './QBIDResultsDisplay';
const QualifiedBusinessIncomeDeduction = ({ onCalculate }) => {
  // Estados del formulario
  const [qbi, setQbi] = useState('');
  const [filingStatus, setFilingStatus] = useState('Single');
  const [thresholdStatus, setThresholdStatus] = useState('');
  const [component, setComponent] = useState(20);
  const [qbid, setQbid] = useState('');
  const [taxableIncomeBeforeQbid, setTaxableIncomeBeforeQbid] = useState('');
  const [capitalGain, setCapitalGain] = useState('');
  const [totalIncomeLessCapitalGain, setTotalIncomeLessCapitalGain] = useState('');
  const [componentIncomeLimitation, setComponentIncomeLimitation] = useState(20);
  const [qbidLimit, setQbidLimit] = useState('');
  const [smallerOfQbidAndLimit, setSmallerOfQbidAndLimit] = useState('');
  const [error, setError] = useState(null);
  const [calculationResults, setCalculationResults] = useState(null);

  // Calcula el threshold basado en el estado civil
  useEffect(() => {
    if (filingStatus) {
      const limit = filingStatus === "MFJ" 
        ? QbiThresholdFirstLimit.MFJ 
        : QbiThresholdFirstLimit.Single;
      setThresholdStatus(limit.toLocaleString('en-US', { maximumFractionDigits: 0 }));
    }
  }, [filingStatus]);

  // Calcula QBID cuando cambia QBI o el componente
  useEffect(() => {
    if (qbi && !isNaN(parseFloat(qbi))) {
      const calculatedQbid = (parseFloat(qbi) * (component / 100)).toFixed(2);
      setQbid(calculatedQbid);
    } else {
      setQbid('');
    }
  }, [qbi, component]);

  // Calcula (Taxable Income - Capital Gain)
  useEffect(() => {
    if (taxableIncomeBeforeQbid && !isNaN(parseFloat(taxableIncomeBeforeQbid))) {
      const capGain = capitalGain && !isNaN(parseFloat(capitalGain)) ? parseFloat(capitalGain) : 0;
      const calculatedTotal = Math.max(0, parseFloat(taxableIncomeBeforeQbid) - capGain);
      setTotalIncomeLessCapitalGain(calculatedTotal.toFixed(2));
    } else {
      setTotalIncomeLessCapitalGain('');
    }
  }, [taxableIncomeBeforeQbid, capitalGain]);

  // Calcula el límite de QBID
  useEffect(() => {
    if (totalIncomeLessCapitalGain && !isNaN(parseFloat(totalIncomeLessCapitalGain))) {
      const calculatedLimit = (parseFloat(totalIncomeLessCapitalGain) * (componentIncomeLimitation / 100)).toFixed(2);
      setQbidLimit(calculatedLimit);
    } else {
      setQbidLimit('');
    }
  }, [totalIncomeLessCapitalGain, componentIncomeLimitation]);

  // Determina el menor entre QBID y QBID Limit
  useEffect(() => {
    if (qbid && qbidLimit && !isNaN(parseFloat(qbid)) && !isNaN(parseFloat(qbidLimit))) {
      const smallerValue = Math.min(parseFloat(qbid), parseFloat(qbidLimit));
      setSmallerOfQbidAndLimit(smallerValue.toFixed(2));
    } else {
      setSmallerOfQbidAndLimit('');
    }
  }, [qbid, qbidLimit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!qbi || parseFloat(qbi) <= 0) {
      setError('Qualified Business Income es requerido y debe ser mayor que 0.');
      return;
    }

    if (!taxableIncomeBeforeQbid || parseFloat(taxableIncomeBeforeQbid) <= 0) {
      setError('Taxable Income Before QBID es requerido y debe ser mayor que 0.');
      return;
    }


    
    setError(null);

    // Preparar resultados
    const results = performQBIDCalculationsSimple ({
      calculationType: 'qbidCalculation',
      filingStatus,
      qualifiedBusinessIncome: parseFloat(qbi),
      threshold: filingStatus === "MFJ" ? QbiThresholdFirstLimit.MFJ : QbiThresholdFirstLimit.Single,
      component,
      qbid: parseFloat(qbid),
      taxableIncomeBeforeQbid: parseFloat(taxableIncomeBeforeQbid),
      capitalGain: capitalGain && !isNaN(parseFloat(capitalGain)) ? parseFloat(capitalGain) : 0,
      totalIncomeLessCapitalGain: parseFloat(totalIncomeLessCapitalGain),
      componentIncomeLimitation,
      qbidLimit: parseFloat(qbidLimit),
      smallerOfQbidAndLimit: parseFloat(smallerOfQbidAndLimit),
      finalTaxableIncome: parseFloat(taxableIncomeBeforeQbid) - parseFloat(smallerOfQbidAndLimit),
    });

    setCalculationResults(results);
    if (onCalculate) {
      onCalculate(results);
    }
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5, mb: 3 }}>
        <Box sx={{ position: 'absolute', top: -10, right: 0 }}>
          <Button
            href="#"
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

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Qualified Business Income (QBI)"
                  fullWidth
                  type="number"
                  value={qbi}
                  onChange={(e) => setQbi(e.target.value)}
                  margin="normal"
                  required
                />

                <TextField
                  select
                  label="Filing Status"
                  fullWidth
                  value={filingStatus}
                  onChange={(e) => setFilingStatus(e.target.value)}
                  margin="normal"
                  required
                >
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="MFJ">Married Filing Jointly (MFJ)</MenuItem>
                  <MenuItem value="MFS">Married Filing Separately (MFS)</MenuItem>
                  <MenuItem value="HH">Head of Household (HH)</MenuItem>
                  <MenuItem value="QSS">Qualified Surviving Spouse (QSS)</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Taxable Income Before QBID"
                  fullWidth
                  type="number"
                  value={taxableIncomeBeforeQbid}
                  onChange={(e) => setTaxableIncomeBeforeQbid(e.target.value)}
                  margin="normal"
                  required
                />

                <TextField
                  label="Capital Gain (Optional)"
                  fullWidth
                  type="number"
                  value={capitalGain}
                  onChange={(e) => setCapitalGain(e.target.value)}
                  margin="normal"
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button 
                type="submit" 
                variant="contained" 
                sx={{ backgroundColor: '#0858e6', color: '#fff', px: 4, py: 1 }}
              >
                Calcular
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default QualifiedBusinessIncomeDeduction;