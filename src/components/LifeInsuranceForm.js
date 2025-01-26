import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useCalculations from '../utils/useCalculations';



const LifeInsuranceForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [annualContribution, setAnnualContribution] = useState('');
  const [plansElectedAverageInterestRate , setPlansElectedAverageInterestRate ] = useState('');
  const [totalOfYears, setTotalOfYears] = useState('');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [totalInterestOverTheYears, setTotalInterestOverTheYears] = useState('');
  const [totalContributed, setTotalContributed] = useState('');
  const [totalInterest, setTotalInterest] = useState('');
  const [QBID, setQbid] = useState('');
  const [error, setError] = useState(null);

 

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validaciones de los campos
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!annualContribution || parseFloat(annualContribution) <= 0) {
      setError('Total Reimbursable Expenses is required and must be greater than 0.');
      return;
    }

    if (!plansElectedAverageInterestRate || parseFloat(plansElectedAverageInterestRate) <= 0) {
        setError('Total Reimbursable Expenses is required and must be greater than 0.');
        return;
      }
    if (!totalOfYears || parseFloat(totalOfYears) <= 0) {
        setError('Total Reimbursable Expenses is required and must be greater than 0.');
        return;
      }


      // Calcular el total de intereses a lo largo de los años
      const interestRate = parseFloat(plansElectedAverageInterestRate) / 100; // Convertir porcentaje a decimal
      const years = parseFloat(totalOfYears); // Total de años
      const contribution = parseFloat(annualContribution); // Contribución anual

      let totalInterestOverTheYears = 0;
      
      if (interestRate > 0) {
        totalInterestOverTheYears = contribution * ((1 + interestRate) ** years - 1) / interestRate;
        
      } else {
        totalInterestOverTheYears = 0;
      }
       
      // Calcular el total contribuido
      const totalContributed = contribution * years;

      
      // Calcular el total de intereses
      const totalInterest = totalInterestOverTheYears - totalContributed;
    
    setTotalInterestOverTheYears(totalInterestOverTheYears.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    setTotalContributed(totalContributed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    setTotalInterest(totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));



    setError(null);


    // Llamada al hook con calculationType 'accountablePlan'
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      annualContribution: contribution,
      plansElectedAverageInterestRate: interestRate,
      totalOfYears: years,
      formType,
      calculationType: 'lifeInsurance',
      totalInterestOverTheYears: totalInterestOverTheYears, 
      totalContributed: totalContributed,
      totalInterest: totalInterest,
      QBID: parseFloat(QBID)
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

                <TextField
                label="Annual Contribution"
                fullWidth
                type="number"
                value={annualContribution}
                onChange={(e) => setAnnualContribution(e.target.value)}
                margin="normal"
              />
              
                <TextField
    label="Plan's Elected Average Interest Rate (%)"
    fullWidth
    type="number"
    value={plansElectedAverageInterestRate}
    onChange={(e) => {
      const inputValue = e.target.value;
      
      // Permitir borrar el campo (si el input está vacío o es un número positivo)
      if (inputValue === '' || parseFloat(inputValue) >= 0) {
        setPlansElectedAverageInterestRate(inputValue);
      }
    }}
    InputProps={{
      endAdornment: <span style={{ marginLeft: 5, color: '#555' }}>%</span>, // Mostrar el símbolo de porcentaje
    }}
    margin="normal"
  />
              </Grid>



              {/* Lado Derecho */}
              <Grid item xs={12} md={6}>
              
                
                <TextField
                  label="Total of Years"
                  fullWidth
                  type="number"
                  value={totalOfYears}
                  onChange={(e) => setTotalOfYears(e.target.value)}
                  margin="normal"
                />
                
                <TextField
                label="Total Interest Over The Years"
                fullWidth
                type="text"
                value={totalInterestOverTheYears}
                margin="normal"
                disabled 
                />

                <TextField
                label="Total Contributed"
                fullWidth
                type="text"
                value={totalContributed}
                margin="normal"
                disabled 
                />

                <TextField
                label="Total Interest"
                fullWidth
                type="text"
                value={totalInterest}
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
            <Button type="submit" variant="contained" sx={{backgroundColor:'#0858e6', color: '#fff'}}>
              Calculate
            </Button>
          </Box>  
        </form>
      </Box>
    </Container>
  );
};

export default LifeInsuranceForm;
