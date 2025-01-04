import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid, Typography } from '@mui/material';
import useCalculations from '../utils/useCalculations';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


const EducationTaxCreditForm = ({ onCalculate }) => {
  const [grossIncome, setGrossIncome] = useState('');
  const [taxpayerMAGI, setTaxpayerMAGI] = useState('');
  const [qualifiedEducationExpenses, setQualifiedEducationExpenses] = useState('');
  const [MFJ, setMFJ] = useState('No');
  const [partnerType, setPartnerType] = useState('Active'); 
  const [filingStatus, setFilingStatus] = useState('MFJ'); 
  const [limit, setLimit] = useState(''); 
  const [phaseOut, setPhaseOut] = useState(''); 
  const [maximumRefundable, setMaximumRefundable] = useState(null); 
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

  // Función para calcular el límite
  const calculateLimit = (MFJ, taxpayerMAGI) => {
    if (!taxpayerMAGI) return 0;
    if (MFJ === 'Yes') {
      return Math.max(180000 - taxpayerMAGI, 0); // Si es MFJ, 180000 menos MAGI
    } else {
      return Math.max(90000 - taxpayerMAGI, 0); // Si no es MFJ, 90000 menos MAGI
    }
  };

  // Función para calcular el Phase-out
  const calculatePhaseOut = (MFJ) => {
    if (MFJ === 'Yes') {
      return 20000; // Si MFJ es "Yes", el Phase-out es 20000
    } else {
      return 10000; // Si MFJ es "No", el Phase-out es 10000
    }
  };

  // Recalcular el límite y Phase-out cuando MFJ o MAGI cambian
  useEffect(() => {
    const calculatedLimit = calculateLimit(MFJ, taxpayerMAGI);
    setLimit(calculatedLimit);
    
    const calculatedPhaseOut = calculatePhaseOut(MFJ);
    setPhaseOut(calculatedPhaseOut); 
  }, [MFJ, taxpayerMAGI]);

  const calculateTaxCredits = (limit, phaseOut, qualifiedEducationExpenses) => {
    return limit >= phaseOut
      ? qualifiedEducationExpenses * 0.2
      : (limit / phaseOut) * qualifiedEducationExpenses;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones para los campos requeridos
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!taxpayerMAGI || parseFloat(taxpayerMAGI) <= 0) {
      setError('Taxpayer Modified Adjusted Gross Income (MAGI) is required and must be greater than 0.');
      return;
    }

    if (!qualifiedEducationExpenses || parseFloat(qualifiedEducationExpenses) < 0) {
      setError('Qualified Education Expenses is required and cannot be negative.');
      return;
    }

    setError(null);

    // Calcular los Tax Credits
    const taxCreditsResults = calculateTaxCredits(limit, phaseOut, parseFloat(qualifiedEducationExpenses));
    
    // Calcular el Maximum Refundable
    const maxRefundable = taxCreditsResults * 0.4;
    setMaximumRefundable(maxRefundable);

    const results = performCalculations({
      grossIncome: parseFloat(grossIncome),
      taxpayerMAGI: parseFloat(taxpayerMAGI),
      qualifiedEducationExpenses: parseFloat(qualifiedEducationExpenses),
      MFJ: MFJ === 'Yes',
      partnerType,
      filingStatus,
      taxCreditsResults,
      formType,
      calculationType: 'educationTaxCredit',
    });
    
    onCalculate(results);
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
                select
                label="Married Filing Jointly (MFJ)"
                fullWidth
                value={MFJ}
                onChange={(e) => setMFJ(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
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
                label="Partner Type"
                fullWidth
                value={partnerType}
                onChange={(e) => setPartnerType(e.target.value)} // Nuevo campo para Partner Type
                margin="normal"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Passive">Passive</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Taxpayer Modified Adjusted Gross Income (MAGI)"
                fullWidth
                type="number"
                value={taxpayerMAGI}
                onChange={(e) => setTaxpayerMAGI(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Qualified Education Expenses"
                fullWidth
                type="number"
                value={qualifiedEducationExpenses}
                onChange={(e) => setQualifiedEducationExpenses(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Limit (if zero, no credit available)"
                fullWidth
                value={limit === 0 ? 'Not Credit Available' : limit} // Muestra "Not Credit Available" si el límite es 0
                InputProps={{
                  readOnly: true, // Solo lectura para el resultado
                }}
                margin="normal"
              />

              <TextField
                label="Phase-out"
                fullWidth
                value={phaseOut} 
                InputProps={{
                  readOnly: true, // Solo lectura para el resultado
                }}
                margin="normal"
              />
              
              {maximumRefundable !== null && ( // Mostrar Maximum Refundable si ya está calculado
                <TextField
                  label="Maximum Amount Refundable"
                  fullWidth
                  value={maximumRefundable}
                  InputProps={{
                    readOnly: true, // Solo lectura para el resultado
                  }}
                  margin="normal"
                />
              )}

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

export default EducationTaxCreditForm;
