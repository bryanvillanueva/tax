import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, MenuItem, Alert, Grid } from '@mui/material';
import useCalculations from '../utils/useCalculations';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import QbidFieldWithOptions from './QbidFieldWithOptions';
import { useStrategy } from '../context/StrategyContext';



const AugustaRuleForm = ({ onCalculate }) => {
  // Usar el hook de estrategia para acceder a los valores previos
  const { previousStrategy } = useStrategy();
  
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [averageMonthlyRent, setAverageMonthlyRent] = useState('');
  const [daysOfRent, setDaysOfRent] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [QBID, setQbid] = useState('');
  const [error, setError] = useState(null);

  // Efecto para restaurar valores cuando regresamos de QBID
  useEffect(() => {
    // Solo restaurar si hay valores previos y solo una vez
    if (previousStrategy && previousStrategy.formValues) {
      const values = previousStrategy.formValues;
      
      // Usamos una bandera para evitar bucles de actualización
      let needsUpdate = false;
      
      // Solo actualizar si los valores son diferentes
      if (values.filingStatus && values.filingStatus !== filingStatus) {
        setFilingStatus(values.filingStatus);
        needsUpdate = true;
      }
      if (values.grossIncome && values.grossIncome !== grossIncome) {
        setGrossIncome(values.grossIncome);
        needsUpdate = true;
      }
      if (values.averageMonthlyRent && values.averageMonthlyRent !== averageMonthlyRent) {
        setAverageMonthlyRent(values.averageMonthlyRent);
        needsUpdate = true;
      }
      if (values.daysOfRent && values.daysOfRent !== daysOfRent) {
        setDaysOfRent(values.daysOfRent);
        needsUpdate = true;
      }
      if (values.partnerType && values.partnerType !== partnerType) {
        setPartnerType(values.partnerType);
        needsUpdate = true;
      }
      if (values.formType && values.formType !== formType) {
        setFormType(values.formType);
        needsUpdate = true;
      }
    }
  }, [previousStrategy]); // Importante: NO incluir los estados como dependencias para evitar bucles

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!averageMonthlyRent || parseFloat(averageMonthlyRent) <= 0) {
      setError('Average Monthly Rent is required and must be greater than 0.');
      return;
    }

    if (!daysOfRent || parseFloat(daysOfRent) <= 0) {
      setError('Days of Rent is required and must be greater than 0.');
      return;
    }

    setError(null);

    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      averageMonthlyRent: parseFloat(averageMonthlyRent),
      daysOfRent: parseFloat(daysOfRent),
      partnerType,
      isAugustaRule: true,
      formType,
      calculationType: 'augusta',
      QBID: parseFloat(QBID),
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        {/* Enlace en la esquina superior derecha */}
        <Box sx={{ position: 'absolute', top: -10, right: 0, }}>
          <Button
            href="https://cmltaxplanning.com/docs/S4.pdf"
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
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Average Monthly Rent In The Residential Area"
                fullWidth
                type="number"
                value={averageMonthlyRent}
                onChange={(e) => setAverageMonthlyRent(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Days of Rent"
                fullWidth
                type="number"
                value={daysOfRent}
                onChange={(e) => setDaysOfRent(e.target.value)}
                margin="normal"
              />
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
                <MenuItem value="1120">1120</MenuItem>
              </TextField>
              {/* Campo QBID con opciones para navegar a estrategias QBID */}
              <QbidFieldWithOptions 
                value={QBID}
                onChange={setQbid}
                formValues={{
                  filingStatus,
                  grossIncome,
                  averageMonthlyRent,
                  daysOfRent,
                  partnerType,
                  formType,
                  QBID
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button type="submit" variant="contained" sx={{backgroundColor:'#0858e6', color: '#fff'}}>
              Calculate
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default AugustaRuleForm;
