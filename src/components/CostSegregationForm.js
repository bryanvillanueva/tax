import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Grid, MenuItem, Alert } from '@mui/material';
import useCalculations from '../utils/useCalculations';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


const CostSegregationForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [realEstateValue, setRealEstateValue] = useState('');
  const [depreciation, setDepreciation] = useState('');
  const [assetsReclassifiedValue, setAssetsReclassifiedValue] = useState('');
  const [assetsUsefulLife, setAssetsUsefulLife] = useState('');
  const [error, setError] = useState(null);
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [newDepreciation, setNewDepreciation] = useState(null); 

  const { performCalculations } = useCalculations();

  const calculateNewDepreciation = (realEstateValue, assetsReclassifiedValue, assetsUsefulLife) => {
    if (realEstateValue && assetsReclassifiedValue && assetsUsefulLife) {
      const depreciation = ((realEstateValue - assetsReclassifiedValue) / (39 * 12)) + (assetsReclassifiedValue / assetsUsefulLife);
      return depreciation;
    } else {
      return 0; 
    }
  };

  useEffect(() => {
    const calculatedDepreciation = realEstateValue ? realEstateValue / (39 * 12) : 0; 
    setDepreciation(calculatedDepreciation); 
  }, [realEstateValue]); 

  useEffect(() => {
    if (realEstateValue && assetsReclassifiedValue && assetsUsefulLife) {
      const calculatedNewDepreciation = calculateNewDepreciation(
        parseFloat(realEstateValue),
        parseFloat(assetsReclassifiedValue),
        parseInt(assetsUsefulLife)
      );
      setNewDepreciation(calculatedNewDepreciation); 
    }
  }, [realEstateValue, assetsReclassifiedValue, assetsUsefulLife]); 

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!filingStatus || !grossIncome || !partnerType || !realEstateValue || !depreciation || !assetsReclassifiedValue || !assetsUsefulLife) {
      setError('All fields are required.');
      return;
    }

    setError(null);

    const newDepreciation = calculateNewDepreciation(
      parseFloat(realEstateValue),
      parseFloat(assetsReclassifiedValue),
      parseInt(assetsUsefulLife)
    );

    const calculatedDeduction = newDepreciation - depreciation; 
    
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      realEstateValue: parseFloat(realEstateValue),
      depreciation: parseFloat(depreciation),
      assetsReclassifiedValue: parseFloat(assetsReclassifiedValue),
      assetsUsefulLife: parseInt(assetsUsefulLife),
      deduction: calculatedDeduction,  
      formType,
      calculationType: 'costSegregation',
    });

    onCalculate(results);
  };

  // Formato para mostrar como moneda en USD
  const formatCurrency = (value) => {
    return value ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$0.00';
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        {/* Enlace en la esquina superior derecha */}
        <Box sx={{ position: 'absolute', top: -10, right: 0, }}>
          <Button
            href="https://tax.bryanglen.com/data/Strategies-Structure.pdf"
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
            {/* Left side with 4 fields */}
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
                label="Value of Real Estate Property"
                fullWidth
                type="number"
                value={realEstateValue}
                onChange={(e) => setRealEstateValue(e.target.value)}
                margin="normal"
              />
            </Grid>

            {/* Right side with 4 fields */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Current Annual Depreciation (39 years)"
                fullWidth
                type="text"
                value={formatCurrency(depreciation)} 
                margin="normal"
                disabled
              />

              <TextField
                label="Value of Assets Reclassified"
                fullWidth
                type="number"
                value={assetsReclassifiedValue}
                onChange={(e) => setAssetsReclassifiedValue(e.target.value)}
                margin="normal"
              />

              <TextField
                select
                label="Assets' Useful Life Reclassified (in years)"
                fullWidth
                value={assetsUsefulLife}
                onChange={(e) => setAssetsUsefulLife(e.target.value)}
                margin="normal"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={15}>15</MenuItem>
              </TextField>

              {/* Display the result of New Annual Depreciation */}
              <TextField
                label="New Annual Depreciation"
                fullWidth
                type="text"
                value={newDepreciation !== null ? formatCurrency(newDepreciation) : 'Calculating...'}
                disabled
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

export default CostSegregationForm;
