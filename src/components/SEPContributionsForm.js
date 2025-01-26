import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useCalculations from '../utils/useCalculations';

const SEPContributionsForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [averageQualifiedEmployeesCompensation, setAverageQualifiedEmployeesCompensation] = useState('');
  const [numberOfQualifiedEmployees, setNumberOfQualifiedEmployees] = useState('');
  const [averageContributionPerEmployee, setAverageContributionPerEmployee] = useState('');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [QBID, setQbid] = useState('');
  const [partOfInvestmentIncome, setPartOfInvestmentIncome] = useState('');
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

  // Updated constants for the limits
  const LIMIT_ONE = 69000; 
  const LIMIT_TWO = averageQualifiedEmployeesCompensation ? averageQualifiedEmployeesCompensation * 0.25 : 0;

  const totalContribution = (() => {
    const avgContribution = averageContributionPerEmployee || 0;
    const numEmployees = numberOfQualifiedEmployees || 0;

    if (avgContribution > LIMIT_TWO || avgContribution > LIMIT_ONE) {
      const minLimit = Math.min(LIMIT_ONE, LIMIT_TWO);
      return minLimit * numEmployees;
    } else {
      return avgContribution * numEmployees;
    }
  })();
  
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    setError(null);

    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      formType,
      partnerType,
      averageQualifiedEmployeesCompensation,
      numberOfQualifiedEmployees,
      averageContributionPerEmployee,
      totalContribution,
      calculationType: 'sepContributions', 
      QBID: parseFloat(QBID),
      partOfInvestmentIncome: parseFloat(partOfInvestmentIncome),

    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        {/* Link in the top right corner */}
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
                label="Part Of Investment Income (if any)"
                fullWidth
                type="number"
                value={partOfInvestmentIncome}
                onChange={(e) => setPartOfInvestmentIncome(e.target.value)}
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
                label="Average Qualified Employees Compensation"
                fullWidth
                type="number"
                value={averageQualifiedEmployeesCompensation}
                onChange={(e) => setAverageQualifiedEmployeesCompensation(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Number of Qualified Employees"
                fullWidth
                type="number"
                value={numberOfQualifiedEmployees}
                onChange={(e) => setNumberOfQualifiedEmployees(e.target.value)}
                margin="normal"
              />

            </Grid>

            {/* Right Side */}
            <Grid item xs={12} md={6}>
             
              <TextField
                label="Average Contribution Per Employee"
                fullWidth
                type="number"
                value={averageContributionPerEmployee}
                onChange={(e) => setAverageContributionPerEmployee(e.target.value)}
                margin="normal"
              />
                <TextField
                label="Limit 1 - Per Employee"
                fullWidth
                value={LIMIT_ONE}
                disabled
                margin="normal"
              />
              <TextField
                label="Limit 2 - Per Employee - 25% Wages"
                fullWidth
                value={LIMIT_TWO}
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
                <MenuItem value="1120s">1120s</MenuItem>
                <MenuItem value="1120">1120</MenuItem>
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

export default SEPContributionsForm;
