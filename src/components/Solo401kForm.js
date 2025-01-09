import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useCalculations from '../utils/useCalculations';

const Solo401kForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [employeeWages, setEmployeeWages] = useState('');
  const [employerContribution, setEmployerContribution] = useState('');
  const [employeeContribution, setEmployeeContribution] = useState('');
  const [taxPayerAge, setTaxPayerAge] = useState('');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones de los campos
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!employeeWages || parseFloat(employeeWages) <= 0) {
      setError('Deferral Amount is required and must be greater than 0.');
      return;
    }

    if (!employerContribution || parseFloat(employerContribution) <= 0) {
      setError('Employer Contribution is required and must be greater than 0.');
      return;
    }
    
    if (!employeeContribution || parseFloat(employeeContribution) <= 0) {
      setError('Employer Contribution is required and must be greater than 0.');
      return;
    }

    if (!taxPayerAge || parseFloat(taxPayerAge) <= 0) {
      setError('Employer Contribution is required and must be greater than 0.');
      return;
    }

    // Lógica para calcular el total de contribuciones
    const employeeContributionLimit = parseFloat(taxPayerAge) >= 50 ? 30500 : 23000;
    const employerContributionLimit = parseFloat(employeeWages) * 0.25;
    const totalLimit = parseFloat(taxPayerAge) >= 50 ? 76500 : 69000;
    const totalContributions = Math.min(
      employeeContributionLimit,
      parseFloat(employeeContribution)
    ) + Math.min(
      employerContributionLimit,
      parseFloat(employerContribution)
    );
    const totalAnnualContribution = totalContributions >= totalLimit ? totalLimit : totalContributions;

    const deductionSolo401k = totalAnnualContribution - parseFloat(employerContribution);

    setError(null);

    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      employeeWages: parseFloat(employeeWages),
      employerContribution: parseFloat(employerContribution),
      taxPayerAge,
      formType,
      employeeContribution: parseFloat(employeeContribution),
      partnerType,
      employeeContributionLimit,
      employerContributionLimit,
      totalLimit,
      totalContributions,
      totalAnnualContribution,
      deductionSolo401k,
      calculationType: 'solo401k',
    });
    
    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        {/* Enlace en la esquina superior derecha */}
        <Box sx={{ position: 'absolute', top: -10, right: 0 }}>
        <Button
         href="https://tax.bryanglen.com/data/Strategies-Structure.pdf"
         target="_blank"
         sx={{ textTransform: 'none', backgroundColor: '#ffffff', color: '#0858e6', fontSize: '0.875rem', marginBottom: '150px' }}
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
            {/* Lado Izquierdo */}
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
                label="Employee Wages"
                fullWidth
                type="number"
                value={employeeWages}
                onChange={(e) => setEmployeeWages(e.target.value)}
                margin="normal"
              />
            </Grid>

            {/* Lado Derecho */}
            <Grid item xs={12} md={6}>
            <TextField
                label="Employee Contribution"
                fullWidth
                type="number"
                value={employeeContribution}
                onChange={(e) => setEmployeeContribution(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Employer Contribution"
                fullWidth
                type="number"
                value={employerContribution}
                onChange={(e) => setEmployerContribution(e.target.value)}
                margin="normal"
              />

              <TextField
                
                label="Tax Payer Age"
                fullWidth
                type="number"
                value={taxPayerAge}
                onChange={(e) => setTaxPayerAge(e.target.value)}
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

export default Solo401kForm;
