import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useCalculations from '../utils/useCalculations';
import QbidFieldWithOptions from './QbidFieldWithOptions';
import { useStrategy } from '../context/StrategyContext';

const DepreciationForm = ({ onCalculate }) => {
  // Usar el hook de estrategia para acceder a los valores previos
  const { previousStrategy } = useStrategy();
  
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [investType, setInvestType] = useState('Section 179');
  const [cost, setCost] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [isListedProperty, setIsListedProperty] = useState('No');
  const [listedPropertyType, setListedPropertyType] = useState('');
  const [limitDepreciation, setLimitDepreciation] = useState(0); // Variable interna
  const [QBID, setQbid] = useState('');
  const [error, setError] = useState(null);

  // Efecto para restaurar valores cuando regresamos de QBID
  useEffect(() => {
    // Solo restaurar valores si hay previousStrategy y una sola vez
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
      if (values.investType && values.investType !== investType) {
        setInvestType(values.investType);
        needsUpdate = true;
      }
      if (values.cost && values.cost !== cost) {
        setCost(values.cost);
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
      if (values.isListedProperty && values.isListedProperty !== isListedProperty) {
        setIsListedProperty(values.isListedProperty);
        needsUpdate = true;
      }
      if (values.listedPropertyType && values.listedPropertyType !== listedPropertyType) {
        setListedPropertyType(values.listedPropertyType);
        needsUpdate = true;
      }
      if (values.limitDepreciation !== undefined && values.limitDepreciation !== limitDepreciation) {
        setLimitDepreciation(values.limitDepreciation);
        needsUpdate = true;
      }
    }
  }, [previousStrategy]); // No incluir estados como dependencias para evitar bucles

  const { performCalculations } = useCalculations();

  // Calcular el valor de "Limit Depreciation"
  const calculateLimitDepreciation = () => {
    if (isListedProperty === 'No') return 0;
    if (listedPropertyType === 'Limited Vehicle') return 12400;
    if (listedPropertyType === '6,000 - 14,000 pounds') return 30500;
    if (listedPropertyType === 'Not limited Vehicle') return 0;
    return 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Net Income for Analysis is required and must be greater than 0.');
      return;
    }

    if (!cost || parseFloat(cost) <= 0) {
      setError('Cost / Investment is required and must be greater than 0.');
      return;
    }

    // Calcular la deducción basada en las selecciones
    const calculatedDepreciation = calculateLimitDepreciation();
    setLimitDepreciation(calculatedDepreciation);
    

    const depreciation = cost;

    const deduction179 = calculatedDepreciation > 0 ? calculatedDepreciation : cost;




    setError(null);

    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      cost: parseFloat(cost),
      investType,
      partnerType,
      formType,
      isListedProperty,
      listedPropertyType,
      depreciation,
      deduction179,
      limitDepreciation: calculatedDepreciation, // Pasar la variable interna
      QBID: parseFloat(QBID),
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        <Box sx={{ position: 'absolute', top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S1.pdf"
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
                select
                label="The Vehicle is a Listed Property"
                fullWidth
                value={isListedProperty}
                onChange={(e) => setIsListedProperty(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>

              {isListedProperty === 'Yes' && (
                <TextField
                  select
                  label="Type of Listed Property"
                  fullWidth
                  value={listedPropertyType}
                  onChange={(e) => setListedPropertyType(e.target.value)}
                  margin="normal"
                >
                  <MenuItem value="Limited Vehicle">Limited Vehicle</MenuItem>
                  <MenuItem value="6,000 - 14,000 pounds">6,000 - 14,000 pounds</MenuItem>
                  <MenuItem value="Not limited Vehicle">Not limited Vehicle</MenuItem>
                </TextField>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Cost / Investment"
                fullWidth
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                margin="normal"
              />

              <TextField
                select
                label="Investment Type"
                fullWidth
                value={investType}
                onChange={(e) => setInvestType(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Section 179">Section 179</MenuItem>
                
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
                <MenuItem value="1120">1120</MenuItem>
              </TextField>
              <QbidFieldWithOptions 
  value={QBID}
  onChange={setQbid}
  formValues={{
    filingStatus,
    grossIncome,
    cost,
    investType,
    partnerType,
    formType,
    isListedProperty,
    listedPropertyType,
    limitDepreciation,
    QBID
  }}
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

export default DepreciationForm;
