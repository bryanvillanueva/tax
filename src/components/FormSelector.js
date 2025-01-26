import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent, TextField, Container, Drawer, IconButton, List, ListItem, ListItemText, Divider, Button, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CustomDrawer from './CustomDrawer'; // Importa el Drawer reutilizable
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

// Lista de formularios disponibles
const forms = [
  
    { code: '1', id: 'depreciation', title: 'Accelerated Depreciation (Section 179) Form', description: 'Calculate accelerated depreciation (Section 179).' },
    { code: '1', id: 'augusta', title: 'Augusta Rule Form', description: 'Calculate deductions under the Augusta Rule.' },
    { code: '1', id: 'prepaid', title: 'Prepaid Expenses Form', description: 'Manage and calculate prepaid expenses deductions.' },
    { code: '1', id: 'hireKids', title: 'Hire Your Kids Form', description: 'Hire Your Kids Form' },
    { code: '1', id: 'charitableRemainderTrust', title: 'Charitable Remainder Trus Form', description: 'Calculate charitable remainder deductions.' },
    { code: '1', id: 'reimbursment', title: 'Reimbursment Of Personal Vehicle Form', description: 'Calculate reimbursment for personal vehicle.' },
    { code: '1', id: 'hireFamily', title: 'Hire Your Family Form', description: 'Calculate deductions for hiring your family members.' },
    { code: '1', id: 'qualifiedOpportunityFunds', title: 'Qualified Opportunity Funds (QOF) Form', description: 'Calculate deductions for investing in Qualified Opportunity Funds.' },
    { code: '1', id: 'healthSavings', title: "Health Savings Account (HSA) - Employee's Benefits Form", description: "Calculate deductions for contributions to Health Savings Accounts (HSA) based on employee's benefits." },
    { code: '1', id: 'lifetimeLearningCredit', title: 'Lifetime Learning Credit Form', description: 'calaculate Lifetime Learning Credit.' },
    { code: '2', id: 'amendedPriorYears', title: 'Amended Prior Year Form', description: 'Calculate adjustments for amended tax returns from prior years.' },
    { code: '2', id: 'exemptionQualifiedSmall', title: 'Exemption For Qualified Small Business Stock Form', description: 'Calculate the exemption for capital gains on the sale of Qualified Small Business Stock (QSBS) as per IRS guidelines.' },
    { code: '2', id: 'costSegregation', title: 'Cost Segregation Form', description: 'Calculate the new annual depreciation and other values for cost segregation as per IRS guidelines for real estate properties.' },
    { code: '2', id: 'savingsPlan', title: 'Savings Plan Form', description: 'Calculate projected savings for future goals, accounting for annual contributions, interest rates, and time periods.' },
    { code: '2', id: 'educationAssistance', title: 'Education Assistance Form', description: 'Evaluate the impact of providing educational assistance to employees, including per-employee assistance amounts, limits, and total employees benefited.' },
    { code: '2', id: 'educationTaxCredit', title: 'Education Tax Credit Form', description: 'Calculate the tax credit for education expenses, considering factors such as filing status, income, qualified expenses, and the number of students benefited.' },
    { code: '2', id: 'accountableplanform', title: 'Accountable Plan Form', description: 'Manage Accountable Plan reimbursement values.' },
    { code: '2', id: 'adoptionincentiveform', title: 'Adoption Incentive Form', description: 'Calculate Adoption Incentive values.' },
    { code: '2', id: 'deferredCapitalGain', title: 'Deferred Capital Gain Form', description: 'Calculate Deferred Capital Gain values.' },
    { code: '2', id: 'healthReimbursement', title: 'Health Reimbursement Arrangement Form', description: 'Calculate the total benefits of the Health Reimbursement Arrangement based on employee benefits.' },
    { code: '3', id: 'incomeShifting', title: 'Income Shifting Form', description: 'Calculate the tax benefits of shifting income between family members or entities to optimize overall tax liability.' },
    { code: '3', id: 'lifeInsurance', title: 'Life Insurance Form', description: 'Evaluate the benefits and tax implications of incorporating life insurance into your financial strategy.' },
    { code: '3', id: 'maximizeMiscellaneousExpenses', title: 'Maximize Miscellaneous Expenses Form', description: 'Analyze and optimize the reclassification of income and expenses to maximize tax deductions and improve financial strategies.' },
    { code: '3', id: 'mealsDeduction', title: 'Meals Deduction Form', description: 'Analyze and optimize meal-related expenses for tax deduction purposes, maximizing allowable deductions and improving financial strategies.' },
    { code: '3', id: 'lossesDeduction', title: 'Net Operating Losses (NOL) Form', description: 'Calculate and manage Net Operating Losses (NOL) with ease. Input filing details, taxable income, and NOL carryforward to generate accurate deductions and limitations automatically.' },
    { code: '3', id: 'solo401k', title: 'Solo 401(k) Form', description: 'Easily calculate and manage Solo 401(k) contributions. Input filing details, gross income, and deferral amounts to ensure accurate results and compliance with contribution limits.' },
    { code: '3', id: 'researchAndDevelopmentCredit', title: 'Research & Development Credit Form', description: 'Calculate the tax credit for research and development expenses, considering factors such as company size, eligible R&D costs, and the amount of qualified research activities.' },
    { code: '3', id: 'rothIRA', title: 'Roth IRA Form', description: 'Manage Roth IRA contributions, including Annual Contribution and AGI Before Applying the Strategy.' },
    { code: '3', id: 'healthInsuranceDeduction2', title: 'Health Insurance Deduction Form', description: 'Manage Health Insurance Premiums and Self-Employment Income, including deductions and adjustments before applying the strategy.' },
    { code: '3', id: 'sepContributions', title: 'SEP Contributions Form', description: 'Manage SEP contributions, including self-employed income and deductions, to optimize retirement savings and tax benefits.' },
    { code: '4', id: 'ActiveRealEstateForm', title: 'Active Real Estate Form', description: 'Manage Active Real Estate Income and Losses, including Gross Income, Net Rental Loss, and Adjusted Gross Income.' },
    { code: '4', id: 'BackdoorRothForm', title: 'Back Door Roth Form', description: 'Strategy that allows high-income earners to fund a Roth IRA by first making a non-deductible contribution to a Traditional IRA and then immediately converting it to a Roth IRA, effectively bypassing income limits for direct Roth contributions.' },
    { code: '4', id: 'CancellationByInsolvencyForm', title: 'Cancellation Of Debt Income By Insolvency Form', description: 'Cancellation of debt income by insolvency.' },
    { code: '4', id: 'simpleIRA', title: 'Simple IRA Form', description: 'Manage Simple IRA contributions, including Employer and Employee Contributions.' },
    { code: '4', id: 'startupCostOptimization', title: 'Startup Cost Optimization Form', description: 'Optimize and manage startup costs. Input expenses, forecasted revenue, and financing options to ensure efficient allocation of resources and maximum profitability.' },
    { code: '4', id: 'stateTaxSavings', title: 'State Tax Savings Form', description: 'Calculate and manage state tax savings. Input taxable income, deductions, and applicable state tax rates to optimize tax planning and minimize state tax liabilities.' },
    { code: '4', id: 'traditionalIRA', title: 'Traditional IRA Contributions Form', description: 'Calculate and manage contributions to a Traditional IRA. Input income, contribution limits, and tax deductions to optimize retirement savings and minimize current tax liabilities.' },
    { code: '4', id: 'unreimbursedExpenses', title: 'Unreimbursed Expenses Form', description: 'Track and manage unreimbursed business expenses. Input expenses such as travel, supplies, and meals to optimize deductions and reduce taxable income.' },
    { code: '4', id: 'charitableDonationSavings', title: 'Charitable Donation Savings Form', description: 'Track and manage charitable donations for tax savings. Input donations, applicable tax deductions, and optimize contributions to reduce taxable income and maximize charitable giving benefits.' },
    { code: '4', id: 'influencerOptimization', title: 'Influencer Optimization Form', description: 'Optimize influencer marketing strategies. Input campaign details, audience metrics, and ROI to maximize reach, engagement, and conversion rates for better brand partnerships and marketing efficiency.' }
  
  
  

];

const FormSelector = ({ onSelectForm }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userData, setUserData] = useState(null); // Para almacenar los datos del usuario
  const [filteredForms, setFilteredForms] = useState([]); // Formularios filtrados según user_level
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('formFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : {};
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

    // Función para ordenar los formularios con favoritos primero
    const getSortedForms = (formsList, favoritesObj, searchTerm) => {
      const filteredForms = formsList.filter((form) =>
        form.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      return filteredForms.sort((a, b) => {
        const aIsFavorite = favoritesObj[a.id] || false;
        const bIsFavorite = favoritesObj[b.id] || false;
  
        if (aIsFavorite && !bIsFavorite) return -1;
        if (!aIsFavorite && bIsFavorite) return 1;
        
        // Si ambos son favoritos o ninguno es favorito, mantener el orden original
        return forms.indexOf(a) - forms.indexOf(b);
      });
    };

  // Verificar si hay un token activo al cargar el componente
  useEffect(() => {
    const validateToken = async () => {
      try {
        setLoading(true); // Activa el loader al iniciar la carga
        const token = localStorage.getItem('authToken');
  
        if (!token) {
          navigate('/'); // Redirige al login si no hay token
          return;
        }
  
        const response = await axios.get('https://taxbackend-production.up.railway.app/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = response.data;
        setUserData(userData);
  
        // Obtener formularios filtrados
        const formsResponse = await axios.get(
          `https://taxbackend-production.up.railway.app/forms/${userData.user_level}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFilteredForms(formsResponse.data);
      } catch (error) {
        console.error('Error al validar el token:', error.message);
        localStorage.removeItem('authToken');
        navigate('/');
      } finally {
        setLoading(false); // Desactiva el loader al terminar
      }
    };
  
    validateToken();
  }, [navigate]);

 

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Elimina el token
    navigate('/'); // Redirige al login
  };

  const toggleFavorite = (formId) => {
    setFavorites((prevFavorites) => {
      const newFavorites = {
        ...prevFavorites,
        [formId]: !prevFavorites[formId]
      };
      // Guardar en localStorage
      localStorage.setItem('formFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };
  
  // Obtener la lista ordenada de formularios
  const sortedAndFilteredForms = getSortedForms(filteredForms, favorites, searchTerm);
  


  return (
    <Box sx={{ display: 'flex' }}>
      
     

      {/* Reutiliza el Drawer */}
      <CustomDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        userData={userData}
      />

      {/* Contenido principal */}
      <Box sx={{ flex: 1 }}>
       
        <Box sx={{ mt: 5}}>
        {/* Contenedor del logo */}
        <Box sx={{ textAlign: 'center', mb: 4, marginTop:-1}}>
        
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

      {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
      <Grid
  container
  spacing={2}
  sx={{
    maxWidth: '1250px', // Asegúrate de que coincida con el ancho del contenedor del buscador
    padding: '5px', // Añade un pequeño relleno si es necesario
  }}
>
  {sortedAndFilteredForms.map((form) => (
 <Grid item xs={12} sm={6} md={3} key={form.id}>
 <Card
   variant="outlined"
   sx={{ height: '100%', borderRadius: '12px', position: 'relative' }}
 >
   <IconButton
     onClick={() => toggleFavorite(form.id)}
     sx={{
       position: 'absolute',
       top: 8,
       right: 8,
       color: favorites[form.id] ? 'red' : 'gray',
       zIndex: 2,
     }}
   >
     {favorites[form.id] ? <FavoriteIcon /> : <FavoriteBorderIcon />}
   </IconButton>
   <CardActionArea onClick={() => onSelectForm(form.id)}>
     <CardContent sx={{ textAlign: 'center' }}>
       <img
         src="https://wac-cdn.atlassian.com/misc-assets/webp-images/confluence/templates/taxonomy/strategic-plan.svg"
         alt="Form Icon"
         style={{
           width: '230px',
           marginBottom: '18px',
         }}
       />
       <Typography
         variant="h6"
         component="div"
         sx={{ fontWeight: 'bold', color: '#0858e6', mb: 1, fontFamily: 'Montserrat, sans-serif' }}
       >
         {form.title}
       </Typography>
       <Typography
         variant="body2"
         color="text.secondary"
         sx={{ fontFamily: 'Montserrat, sans-serif' }}
       >
         {form.description}
       </Typography>
     </CardContent>
   </CardActionArea>
 </Card>
</Grid>

))}
</Grid>
 )}
    </Box>
  </Box>
</Box>
  );
};

export default FormSelector;
