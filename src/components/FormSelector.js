import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent, TextField, Container,  } from '@mui/material';

const forms = [
  { id: 'depreciation', title: 'Depreciation Form', description: 'Calculate accelerated depreciation (Section 179 and Bonus).' },
  { id: 'augusta', title: 'Augusta Rule Form', description: 'Calculate deductions under the Augusta Rule.' },
  { id: 'prepaid', title: 'Prepaid Expenses Form', description: 'Manage and calculate prepaid expenses deductions.' },
  { id: 'hireKids', title: 'Hire Your Kids Form', description: 'Hire Your Kids Form' },
  { id: 'charitableRemainderTrust', title: 'Charitable Remainder Form', description: 'Calculate charitable remainder deductions.' },
  { id: 'reimbursment', title: 'Reimbursment of Personal Vehicle Form', description: 'Calculate reimbursment for personal vehicle.' },
  { id: 'hireFamily', title: 'Hire Your Family Form', description: 'Calculate deductions for hiring your family members.' },
  { id: 'qualifiedOpportunityFunds', title: 'Qualified Opportunity Funds (QOF) Form', description: 'Calculate deductions for investing in Qualified Opportunity Funds.' },
  { id: 'healthSavings', title: "Health Savings Account (HSA) - Employee's Benefits", description: "Calculate deductions for contributions to Health Savings Accounts (HSA) based on employee's benefits."}, 
  { id: 'lifetimeLearningCredit', title: 'MAGI', description: 'calaculate Lifetime Learning Credit' },
  { id: 'amendedPriorYears', title: 'Amended Prior Year Form', description: 'Calculate adjustments for amended tax returns from prior years.' },
  { id: 'exemptionQualifiedSmall', title: 'Exemption for Qualified Small Business Stock Form', description: 'Calculate the exemption for capital gains on the sale of Qualified Small Business Stock (QSBS) as per IRS guidelines.' },
  { id: 'costSegregation', title: 'Cost Segregation Form', description: 'Calculate the new annual depreciation and other values for cost segregation as per IRS guidelines for real estate properties.'},
  { id: 'accountableplanform', title: 'accountable plan form', description: ''},
  { id: 'adoptionincentiveform', title: 'adoption incentive form', description: ''}
  { id: 'deferredCapitalGain', title: 'Deferred Capital Gain', description: 'Calculate Deferred Capital Gain values.' },
];

const FormSelector = ({ onSelectForm }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredForms = forms.filter((form) =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  

  return (
    <Box sx={{ mt: 5 }}>
      {/* Contenedor del logo */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        
      </Box>

      {/* Contenedor del buscador */}
      <Container
        sx={{
          backgroundImage: 'url(https://wac-cdn.atlassian.com/misc-assets/webp-images/bg_atl_cloud_hero_small.svg)', // URL de la imagen de fondo
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '12px',
          padding: '32px',
          mb: 4,
          textAlign: 'center',
          maxWidth: '1250px',
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: '#fff', fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', fontSize: '2.125rem' }}>
          Search or Select a Form to Continue
        </Typography>

        <TextField
          fullWidth
          placeholder="Search for a form..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            backgroundColor: '#fff',
            fontFamily: 'Montserrat, sans-serif',
            borderRadius: '8px',
            '& fieldset': { border: 'none' },
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': { borderColor: '#9ce7ff' },
              '&.Mui-focused fieldset': { borderColor: '#30C2F3',  fontFamily: 'Montserrat, sans-serif' },
            },
          }}
        />
      </Container>

      {/* Contenedor de los formularios */}
      <Grid
  container
  spacing={2}
  sx={{
    maxWidth: '1250px', // Asegúrate de que coincida con el ancho del contenedor del buscador
    margin: '0 auto', // Centra el contenedor
    padding: '21px', // Añade un pequeño relleno si es necesario
  }}
>
  {filteredForms.map((form) => (
    <Grid item xs={12} sm={6} md={3} key={form.id}>
      <Card variant="outlined" sx={{ height: '100%', borderRadius: '12px', }}>
        <CardActionArea onClick={() => onSelectForm(form.id)}>
          <CardContent sx={{ textAlign: 'center' }}>
            <img
              src="https://wac-cdn.atlassian.com/misc-assets/webp-images/confluence/templates/taxonomy/strategic-plan.svg"
              alt="Form Icon"
              style={{
                width: '230px', // Ajusta el tamaño de la imagen para que sea consistente
                marginBottom: '18px',
                
              }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 'bold', color: '#0858e6', mb: 1, fontFamily: 'Montserrat, sans-serif'}}
            >
              {form.title}
            </Typography>
            <Typography variant="body2" color="text.secondary"  sx={{ fontFamily: 'Montserrat, sans-serif', }}>
              {form.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  ))}
</Grid>
    </Box>
  );
};

export default FormSelector;
