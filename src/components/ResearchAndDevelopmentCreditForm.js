import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid, Typography } from '@mui/material';
import useCalculations from '../utils/useCalculations';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';



const ResearchAndDevelopmentCreditForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single'); 
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [qualifiedResearchExpenses, setQualifiedResearchExpenses] = useState('');
  const [methodUsed, setMethodUsed] = useState('ASC'); 
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [QBID, setQbid] = useState('');
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();



 


  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones para los campos requeridos
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    

    if (!qualifiedResearchExpenses || parseFloat(qualifiedResearchExpenses) < 0) {
      setError('Qualified Research Expenses is required and cannot be negative.');
      return;
    }

    setError(null);

    // Calcular los Tax Credits

    const credit = methodUsed === 'ASC' ? 0.14: 0.20;
    const taxCreditsResults = qualifiedResearchExpenses * credit;
    
 

    const results = performCalculations({
      grossIncome: parseFloat(grossIncome),
      qualifiedResearchExpenses: parseFloat(qualifiedResearchExpenses),
      partnerType,
      filingStatus,
      taxCreditsResults,
      credit,
      formType,
      calculationType: 'researchAndDevelopmentCredit',
      QBID: parseFloat(QBID),
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
              <TextField
                label="Qualified Research Expenses"
                fullWidth
                type="number"
                value={qualifiedResearchExpenses}
                onChange={(e) => setQualifiedResearchExpenses(e.target.value)}
                margin="normal"
              />
              
            </Grid>

            <Grid item xs={12} md={6}>
              
            
              

             <TextField
                select
                label="Method Used"
                fullWidth
                value={methodUsed} 
                onChange={(e) => setMethodUsed(e.target.value)}
                margin="normal"
                >
                <MenuItem value="ASC">ASC</MenuItem>
                <MenuItem value="Traditional">Traditional</MenuItem>
                
                </TextField>

                <TextField 
                label="Credit" 
                fullWidth 
                value={`${Math.round(methodUsed === 'ASC' ? 14 : 20)}%`}
                margin="normal" 
                disabled />
            

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

export default ResearchAndDevelopmentCreditForm;
