import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Alert, Grid, MenuItem } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useCalculations from '../utils/useCalculations';

const LifetimeLearningCredit = ({ onCalculate }) => {
  const [grossIncome, setGrossIncome] = useState(''); // Gross Income
  const [magi, setMagi] = useState(''); // Modified Adjusted Gross Income (MAGI)
  const [mfj, setMfj] = useState('No'); // Married Filing Jointly (Yes/No)
  const [qee, setQee] = useState(''); // Qualified Education Expenses (QEE)
  const [phaseOut, setPhaseOut] = useState(10000); // Phase Out amount
  const [limitZero, setLimitZero] = useState(0); // Limit Zero amount
  const [taxCredit, setTaxCredit] = useState(0); // Tax Credit value
  const [displayTaxCredit, setDisplayTaxCredit] = useState(false); // Controla cuándo mostrar el Tax Credit
  const [partnerType, setPartnerType] = useState('Active');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [filingStatus, setFilingStatus] = useState('MFJ');
  const [QBID, setQbid] = useState('');
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

  useEffect(() => {
    if (mfj === 'Yes') {
      setPhaseOut(20000); // Si mfj es "Yes", set phaseOut a 20000
      if (magi) {
        const limit = 180000 - parseFloat(magi);
        setLimitZero(limit >= 0 ? limit : 0); // Evita valores negativos
      }
    } else if (mfj === 'No') {
      setPhaseOut(10000); // Si mfj es "No", set phaseOut a 10000
      if (magi) {
        const limit = 90000 - parseFloat(magi);
        setLimitZero(limit >= 0 ? limit : 0); // Evita valores negativos
      }
    }
  }, [mfj, magi]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones para los campos
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!magi || parseFloat(magi) <= 0) {
      setError('Taxpayer Modified Adjusted Gross Income (MAGI) is required and must be greater than 0.');
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

    const results = performCalculations({
      grossIncome: parseFloat(grossIncome),
      magi: parseFloat(magi),
      qee: parseFloat(qee),
      mfj: mfj === 'Yes',
      partnerType,
      formType,
      filingStatus,
      taxCreditsResults: taxCreditValue,
      calculationType: 'lifetimeLearningCredit',
      QBID: parseFloat(QBID),
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        {/* Enlace en la esquina superior derecha */}
        <Box sx={{ position: 'absolute', top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S10.pdf"
            target="_blank"
            sx={{ textTransform: 'none', backgroundColor: '#ffffff', color: '#0858e6', fontSize: '0.875remc', marginBottom: '150px' }}
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
                label="Filing Status"
                fullWidth
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value)}
                margin="normal"
              >
                <MenuItem value="MFJ">Married Filing Jointly</MenuItem>
              </TextField>

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

              <TextField
                label="Gross Income"
                fullWidth
                type="number"
                value={grossIncome}
                onChange={(e) => setGrossIncome(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Taxpayer MAGI"
                fullWidth
                type="number"
                value={magi}
                onChange={(e) => setMagi(e.target.value)}
                margin="normal"
              />

              <TextField
                select
                label="Partner Type"
                fullWidth
                value={partnerType}
                onChange={(e) => setPartnerType(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Passive">Passive</MenuItem>
              </TextField>

              
            </Grid>

            {/* Columna derecha */}
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
              <TextField
                label="Limit Zero"
                fullWidth
                type="number"
                value={limitZero}
                InputProps={{
                  readOnly: true,
                }}
                margin="normal"
                disabled
              />

              <TextField
                label="Phase Out"
                fullWidth
                type="number"
                value={phaseOut}
                InputProps={{
                  readOnly: true,
                }}
                margin="normal"
                disabled
              />

              <TextField
                label="Tax Credit"
                fullWidth
                type="number"
                value={displayTaxCredit ? taxCredit.toFixed(2) : ''}
                InputProps={{
                  readOnly: true,
                }}
                margin="normal"
                disabled
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
              </TextField>

              <TextField
                label="QBID (Qualified Business Income Deduction)"
                fullWidth
                type="number"
                value={QBID}
                onChange={(e) => setQbid(e.target.value)}
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

