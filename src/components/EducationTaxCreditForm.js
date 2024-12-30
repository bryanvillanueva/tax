import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid, Typography } from '@mui/material';
import useCalculations from '../utils/useCalculations';

const EducationTaxCreditForm = ({ onCalculate }) => {
  const [grossIncome, setGrossIncome] = useState('');
  const [taxpayerMAGI, setTaxpayerMAGI] = useState('');
  const [qualifiedEducationExpenses, setQualifiedEducationExpenses] = useState('');
  const [MFJ, setMFJ] = useState('No'); 
  const [limit, setLimit] = useState(''); // Para almacenar el límite calculado
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

  // Recalcular el límite cuando MFJ o MAGI cambian
  useEffect(() => {
    const calculatedLimit = calculateLimit(MFJ, taxpayerMAGI);
    setLimit(calculatedLimit);
  }, [MFJ, taxpayerMAGI]);

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

    const results = performCalculations({
      grossIncome: parseFloat(grossIncome),
      taxpayerMAGI: parseFloat(taxpayerMAGI),
      qualifiedEducationExpenses: parseFloat(qualifiedEducationExpenses),
      MFJ: MFJ === 'Yes', 
      calculationType: 'educationTaxCredit',
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ mt: 5 }}>
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
                label="Married Filing Jointly (MFJ)"
                fullWidth
                value={MFJ}
                onChange={(e) => setMFJ(e.target.value)} // Cambio aquí
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
                label="Taxpayer Modified Adjusted Gross Income (MAGI)"
                fullWidth
                type="number"
                value={taxpayerMAGI}
                onChange={(e) => setTaxpayerMAGI(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
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
