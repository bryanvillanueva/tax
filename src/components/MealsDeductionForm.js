import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useCalculations from '../utils/useCalculations';

const MealsDeductionForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [mealExpenses, setMealExpenses] = useState('');
  const [cienDeductible, setCienDeductible] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!mealExpenses || parseFloat(mealExpenses) <= 0) {
      setError('Meal Expenses are required and must be greater than 0.');
      return;
    }
    if (!cienDeductible || parseFloat(cienDeductible) <= 0) {
        setError('Meal Expenses are required and must be greater than 0.');
        return;
    }
   

    const cincuentaDeductible = parseFloat(mealExpenses) - parseFloat(cienDeductible);
    const deductionMeals = (cincuentaDeductible * 0.50) + parseFloat(cienDeductible);
    


    setError(null);

    // Call the calculation hook with calculationType 'mealsDeduction'
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      mealExpenses: parseFloat(mealExpenses),
      cienDeductible: parseFloat(cienDeductible),
      cincuentaDeductible,
      partnerType,
      deductionMeals,
      formType,
      calculationType: 'mealsDeduction', // Updated line for meals deduction calculation
    });
   
    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        {/* Link in the top-right corner */}
        <Box sx={{ position: 'absolute', top: -10, right: 0 }}>
          <Button
            href="https://tax.bryanglen.com/data/Strategies-Structure.pdf"
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
            {/* Left Side */}
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
                label="Meal Expenses"
                fullWidth
                type="number"
                value={mealExpenses}
                onChange={(e) => setMealExpenses(e.target.value)}
                margin="normal"
              />
            </Grid>

            {/* Right Side */}
            <Grid item xs={12} md={6}>
             
            <TextField
                label="100% Deductible"
                fullWidth
                type="number"
                value={cienDeductible}
                onChange={(e) => setCienDeductible(e.target.value)}
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

export default MealsDeductionForm;
