import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, MenuItem, Alert, Grid } from '@mui/material';
import useCalculations from '../utils/useCalculations';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


const HireYourKidsForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [investType, setInvestType] = useState('Section 179');
  const [cost, setCost] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [childrenBaseSalary, setChildrenBaseSalary] = useState('');
  const [totalIRAContribution, setTotalIRAContribution] = useState('');
  const [partnershipStatus, setPartnershipStatus] = useState('Yes');
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
  
    if (!childrenBaseSalary || parseFloat(childrenBaseSalary) <= 0) {
      setError("Children's Base Salary is required and must be greater than 0.");
      return;
    }
  
    if (!totalIRAContribution || parseFloat(totalIRAContribution) <= 0) {
      setError('Total IRA Contribution is required and must be greater than 0.');
      return;
    }
  
    setError(null);
  
    // Calcular Total Deduction (TD) según la condición de partnership
    const cbs = parseFloat(childrenBaseSalary);
    const ira = parseFloat(totalIRAContribution);
  
    let totalDeduction;
    if (partnershipStatus === 'Yes') {
      totalDeduction = cbs + ira;
    } else {
      totalDeduction = cbs + (cbs * 0.153 / 2) + ira;
    }
  
    // Llamada al hook con calculationType 'hireKids'
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      cost: parseFloat(cost),
      investType,
      partnerType,
      hireKidsDeduction: totalDeduction,
      formType,
      calculationType: 'hireKids', // Línea agregada para especificar el tipo de cálculo
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
            </Grid>

            {/* Lado Derecho */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Children's Base Salary"
                fullWidth
                type="number"
                value={childrenBaseSalary}
                onChange={(e) => setChildrenBaseSalary(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Total IRA Contribution"
                fullWidth
                type="number"
                value={totalIRAContribution}
                onChange={(e) => setTotalIRAContribution(e.target.value)}
                margin="normal"
              />

              <TextField
                select
                label="In case of partnership both parents are the partners?"
                fullWidth
                value={partnershipStatus}
                onChange={(e) => setPartnershipStatus(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
                <MenuItem value="N/A">N/A</MenuItem>
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
            <Button type="submit" variant="contained" sx={{backgroundColor:'#0858e6', color: '#fff'}}>
              Calculate
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default HireYourKidsForm;
