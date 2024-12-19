import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Alert, Grid, MenuItem } from '@mui/material';

const LifetimeLearningCredit = () => {
  const [magi, setMagi] = useState(''); // Modified Adjusted Gross Income (MAGI)
  const [mfj, setMfj] = useState(''); // Married Filing Jointly (Yes/No)
  const [qee, setQee] = useState(''); // Qualified Education Expenses (QEE)
  const [phaseOut, setPhaseOut] = useState(10000); // Phase Out amount, initialized to 10000 (default for "No")
  const [limitZero, setLimitZero] = useState(0); // Limit Zero amount
  const [taxCredit, setTaxCredit] = useState(0); // Tax Credit value
  const [error, setError] = useState(null);
  const [displayTaxCredit, setDisplayTaxCredit] = useState(false); // Controla cuándo mostrar el Tax Credit

  useEffect(() => {
    if (mfj === 'Yes') {
      setPhaseOut(20000); // Si mfj es "Yes", set phaseOut a 20000
      if (magi) {
        setLimitZero(180000 - parseFloat(magi)); // Permite valores negativos
      }
    } else if (mfj === 'No') {
      setPhaseOut(10000); // Si mfj es "No", set phaseOut a 10000
      if (magi) {
        setLimitZero(90000 - parseFloat(magi)); // Permite valores negativos
      }
    }
  }, [mfj, magi]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones para los campos
    if (!magi || parseFloat(magi) <= 0) {
      setError('Modified Adjusted Gross Income (MAGI) is required and must be greater than 0.');
      return;
    }

    if (!qee || parseFloat(qee) < 0 || parseFloat(qee) > 10000) {
      setError('Qualified Education Expenses (QEE) must be between 0 and 10,000.');
      return;
    }

    setError(null);
    setDisplayTaxCredit(true);

    // Cálculo del Tax Credit
    let taxCreditValue = 0;
    if (limitZero >= phaseOut) {
      taxCreditValue = parseFloat(qee) * 0.2; // Multiplica el QEE por 0.2
    } else {
      const ratio = Math.max(0, limitZero / phaseOut); // Asegura que el ratio no sea negativo
      taxCreditValue = ratio * parseFloat(qee) * 0.2; // Multiplica el resultado por QEE y 0.2
    }

    setTaxCredit(taxCreditValue);
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
                value={mfj}
                onChange={(e) => setMfj(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Limit Zero"
                fullWidth
                type="number"
                value={limitZero}
                InputProps={{
                  readOnly: true,
                }}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Modified Adjusted Gross Income (MAGI)"
                fullWidth
                type="number"
                value={magi}
                onChange={(e) => setMagi(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Qualified Education Expenses (QEE)"
                fullWidth
                type="number"
                value={qee}
                onChange={(e) => setQee(e.target.value)}
                margin="normal"
                inputProps={{
                  min: 0,
                  max: 10000,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Phase Out"
                fullWidth
                type="number"
                value={phaseOut}
                InputProps={{
                  readOnly: true,
                }}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Tax Credit"
                fullWidth
                type="number"
                value={displayTaxCredit ? taxCredit.toFixed(2) : ''}
                InputProps={{
                  readOnly: true,
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

export default LifetimeLearningCredit;
