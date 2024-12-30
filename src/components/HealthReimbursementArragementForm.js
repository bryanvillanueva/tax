import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import useCalculations from '../utils/useCalculations'; 

const HealthReimbursementArrangementForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [averageBenefitPerEmployee, setAverageBenefitPerEmployee] = useState('');
  const [numberOfEmployeesBenefited, setNumberOfEmployeesBenefited] = useState('');
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations(); 

  // Función para calcular el total de beneficios
  const calculateTotalBenefits = (averageBenefitPerEmployee, numberOfEmployeesBenefited) => {
    return averageBenefitPerEmployee * numberOfEmployeesBenefited;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones para los campos requeridos
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!averageBenefitPerEmployee || parseFloat(averageBenefitPerEmployee) <= 0) {
      setError('Average Benefit Per Employee is required and must be greater than 0.');
      return;
    }

    if (!numberOfEmployeesBenefited || parseInt(numberOfEmployeesBenefited) <= 0) {
      setError('Number of Employees Benefited is required and must be greater than 0.');
      return;
    }

    setError(null);

    // Calcular el total de beneficios
    const totalBenefits = calculateTotalBenefits(
      parseFloat(averageBenefitPerEmployee),
      parseInt(numberOfEmployeesBenefited)
    );
    
    // Llamar a la función onCalculate con los resultados
    const results = performCalculations ({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      totalBenefits,
      calculationType: 'healthReimbursement',
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

            <Grid item xs={12} md={6}>
              <TextField
                label="Average Benefit Per Employee"
                fullWidth
                type="number"
                value={averageBenefitPerEmployee}
                onChange={(e) => setAverageBenefitPerEmployee(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Number of Employees Benefited"
                fullWidth
                type="number"
                value={numberOfEmployeesBenefited}
                onChange={(e) => setNumberOfEmployeesBenefited(e.target.value)}
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

export default HealthReimbursementArrangementForm;
