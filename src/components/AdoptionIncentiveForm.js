import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import useCalculations from '../utils/useCalculations';
import { calculateAGI, calculateSEMedicare } from '../utils/calculations';

const AdoptionIncentiveForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [adoptionExpenses, setAdoptionExpenses] = useState('');
  const [childrenAdopted, setChildrenAdopted] = useState('');
  const [iraEarlyWithdrawal, setIraEarlyWithdrawal] = useState('');
  const [TotalAdoptionExpenses, setTotalAdoptionExpenses] = useState('');
  const [IRAEarlyWithdrawalLimit, setIraEarlyWithdrawalLimit] = useState('');
  const [EarlyWithdrawalPenaltyAvoided, setEarlyWithdrawalPenaltyAvoided] = useState('');
  const [AdoptionCreditLimit, setAdoptionCreditLimit] = useState('');
  const [reduction, setReduction] = useState('');
  const [totalCredit, setTotalCredit] = useState('');
  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

  // Constantes fijas importadas
  const seSocialSecurity = partnerType === 'Active' ? Math.min(grossIncome * 0.9235, 168600) * 0.124 : 0;
  const seMedicare = partnerType === 'Active' ? calculateSEMedicare(grossIncome) : 0;
  const selfEmploymentTax = partnerType === 'Active' ? seSocialSecurity + seMedicare : 0;
  const agi = calculateAGI(grossIncome, selfEmploymentTax);
  // constantes fijas de la estategia
  const AdoptionIncomeLimited = 252150; 
  const phaseOut = 40000; 
  console.log(agi);
  


  useEffect(() => {
    // Calcular TotalAdoptionExpenses dinámicamente cuando cambian adoptionExpenses o childrenAdopted
    if (adoptionExpenses && childrenAdopted) {
      const calculatedTotalAdoptionExpenses = parseFloat(adoptionExpenses) * parseInt(childrenAdopted, 10);
      setTotalAdoptionExpenses(calculatedTotalAdoptionExpenses);
    }
  }, [adoptionExpenses, childrenAdopted]);

 // Calcular IRAEarlyWithdrawalLimit dinámicamente cuando cambian adoptionExpenses o childrenAdopted
  useEffect(() => {
    const IRAEarlyWithdrawalLimit = filingStatus === 'MFJ' ? 20000 : 10000;
    setIraEarlyWithdrawalLimit(IRAEarlyWithdrawalLimit);
  }, [filingStatus])

 // Calcular IRAEarlyWithdrawal dinámicamente cuando cambian adoptionExpenses o childrenAdopted
  useEffect(() => {
    if (iraEarlyWithdrawal) {
      const penaltyAvoided = parseFloat(iraEarlyWithdrawal) * 0.1;
      setEarlyWithdrawalPenaltyAvoided(penaltyAvoided);
    }
  }, [iraEarlyWithdrawal]);
  // CALCULAR ADPTED CREDIT LIMIT
  useEffect(() => {
    if (childrenAdopted && parseInt(childrenAdopted, 10) > 0) {
      const AdoptionCreditLimit = 16810 * parseInt(childrenAdopted, 10);
      setAdoptionCreditLimit(AdoptionCreditLimit);
    } else {
      setAdoptionCreditLimit(0);
    }
  }, [childrenAdopted]); 

  // Calcular reduction dinamicamente
  useEffect(() => {
    let calculatedReduction = 0;
  
    // Calcular la reducción siguiendo la lógica proporcionada
    if (agi < AdoptionIncomeLimited) {
      calculatedReduction = 0;
    } else {
      const excess = (agi - AdoptionIncomeLimited) / phaseOut;
      calculatedReduction = excess <= 1 ? excess : 0;
    }
  
    // Formatear el resultado como porcentaje
    setReduction((calculatedReduction * 100).toFixed(2) + '%');
  }, [grossIncome, iraEarlyWithdrawal, selfEmploymentTax]);

   // Función para calcular el total credit
    const calculateTotalCredit = (TotalAdoptionExpenses, AdoptionCreditLimit, reduction) => {
       const reductionValue = parseFloat(reduction) / 100;

     // Aplicar la fórmula lógica de forma similar a la original
     if (TotalAdoptionExpenses < AdoptionCreditLimit) {
      return TotalAdoptionExpenses - (TotalAdoptionExpenses * reductionValue);
     } else {
     return AdoptionCreditLimit - (AdoptionCreditLimit * reductionValue);
      }
     };

     useEffect(() => {
     // Calcular el total credit utilizando la función
     const totalCredit = calculateTotalCredit(TotalAdoptionExpenses, AdoptionCreditLimit, reduction);
  
      // Actualizar el estado de totalCredit
      setTotalCredit(totalCredit);
    }, [TotalAdoptionExpenses, AdoptionCreditLimit, reduction]);

  
  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!adoptionExpenses || parseFloat(adoptionExpenses) <= 0) {
      setError('Adoption Expenses per Child are required and must be greater than 0.');
      return;
    }

    if (!childrenAdopted || parseInt(childrenAdopted, 10) <= 0) {
      setError('Number of Children Adopted is required and must be greater than 0.');
      return;
    }

    if (!iraEarlyWithdrawal || parseFloat(iraEarlyWithdrawal) <= 0) {
      setError('IRA Early Withdrawal amount is required and must be greater than 0.');
      return;
    }

    

    setError(null);
    const taxCreditsResults = calculateTotalCredit(TotalAdoptionExpenses, AdoptionCreditLimit, reduction);


    const results = performCalculations({
      grossIncome: parseFloat(grossIncome),
      partnerType,
      adoptionExpenses: parseFloat(adoptionExpenses),
      childrenAdopted: parseInt(childrenAdopted, 10),
      iraEarlyWithdrawal: parseFloat(iraEarlyWithdrawal),
      filingStatus,
      taxCreditsResults,
      calculationType: 'adoptionAndIra',
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
            {/* Left side: Filing Status, Gross Income, and Type of Partner */}
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
                label="Total Adoption Expenses"
                fullWidth
                value={TotalAdoptionExpenses}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />

               <TextField
                label="Early Withdrawal Penalty Avoided"
                fullWidth
                value={EarlyWithdrawalPenaltyAvoided}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                label="Reduction Percentage"
                fullWidth
                value={reduction}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            {/* Right side: Adoption Expenses, Children Adopted, and IRA Early Withdrawal */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Adoption Expenses per Child"
                fullWidth
                type="number"
                value={adoptionExpenses}
                onChange={(e) => setAdoptionExpenses(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Number of Children Adopted"
                fullWidth
                type="number"
                value={childrenAdopted}
                onChange={(e) => setChildrenAdopted(e.target.value)}
                margin="normal"
              />

              <TextField
                label="IRA Early Withdrawal Amount"
                fullWidth
                type="number"
                value={iraEarlyWithdrawal}
                onChange={(e) => setIraEarlyWithdrawal(e.target.value)}
                margin="normal"
              />

               <TextField
                label="IRA Early Withdrawal Limit"
                fullWidth
                value={IRAEarlyWithdrawalLimit}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />

               <TextField
                label="Adoption Credit Limit"
                fullWidth
                value={AdoptionCreditLimit}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
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

export default AdoptionIncentiveForm;
