import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent, TextField, Container, Drawer, IconButton, List, ListItem, ListItemText, Divider, Button, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Lista de formularios disponibles
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
  { id: 'lifetimeLearningCredit', title: 'MAGI', description: 'calaculate Lifetime Learning Credit.' },
  { id: 'amendedPriorYears', title: 'Amended Prior Year Form', description: 'Calculate adjustments for amended tax returns from prior years.' },
  { id: 'exemptionQualifiedSmall', title: 'Exemption for Qualified Small Business Stock Form', description: 'Calculate the exemption for capital gains on the sale of Qualified Small Business Stock (QSBS) as per IRS guidelines.' },
  { id: 'costSegregation', title: 'Cost Segregation Form', description: 'Calculate the new annual depreciation and other values for cost segregation as per IRS guidelines for real estate properties.'},
  { id: 'savingsPlan', title: 'Savings Plan Form', description: 'Calculate projected savings for future goals, accounting for annual contributions, interest rates, and time periods.'},
  { id: 'educationAssistance', title: 'Education Assistance Form', description: 'Evaluate the impact of providing educational assistance to employees, including per-employee assistance amounts, limits, and total employees benefited.' },
  { id: 'educationTaxCredit', title: 'Education Tax Credit Form', description: 'Calculate the tax credit for education expenses, considering factors such as filing status, income, qualified expenses, and the number of students benefited.'},
  { id: 'accountableplanform', title: 'Accountable Plan Form', description: 'Manage Accountable Plan reimbursement values.'},
  { id: 'adoptionincentiveform', title: 'Adoption Incentive Form', description: 'Calculate Adoption Incentive values.'},
  { id: 'deferredCapitalGain', title: 'Deferred Capital Gain', description: 'Calculate Deferred Capital Gain values.' },
  { id: 'healthReimbursement', title: 'Health Reimbursement Arrangement Form', description: 'Calculate the total benefits of the Health Reimbursement Arrangement based on employee benefits.'},
  { id: 'incomeShifting', title: 'Income Shifting Form', description: 'Calculate the tax benefits of shifting income between family members or entities to optimize overall tax liability.'},
  { id: 'lifeInsurance', title: 'Life Insurance Form', description: 'Evaluate the benefits and tax implications of incorporating life insurance into your financial strategy.'},
  { id: 'maximizeMiscellaneousExpenses', title: 'Maximize Miscellaneous Expenses Form', description: 'Analyze and optimize the reclassification of income and expenses to maximize tax deductions and improve financial strategies.'},
  { id: 'mealsDeduction', title: 'Meals Deduction Form', description: 'Analyze and optimize meal-related expenses for tax deduction purposes, maximizing allowable deductions and improving financial strategies.'},
  { id: 'lossesDeduction', title: 'Net Operating Losses (NOL) Form', description: 'Calculate and manage Net Operating Losses (NOL) with ease. Input filing details, taxable income, and NOL carryforward to generate accurate deductions and limitations automatically.'},
  { id: 'solo401k', title: 'Solo 401(k) Form', description: 'Easily calculate and manage Solo 401(k) contributions. Input filing details, gross income, and deferral amounts to ensure accurate results and compliance with contribution limits.'},
  { id: 'researchAndDevelopmentCredit', title: 'Research & Development Credit Form', description: 'Calculate the tax credit for research and development expenses, considering factors such as company size, eligible R&D costs, and the amount of qualified research activities.'},
  { id: 'rothIRA', title: 'Roth IRA Form', description: 'Manage Roth IRA contributions, including Annual Contribution and AGI Before Applying the Strategy.' },
  { id: 'healthInsuranceDeduction2', title: 'Health Insurance Deduction Form', description: 'Manage Health Insurance Premiums and Self-Employment Income, including deductions and adjustments before applying the strategy.'},
  { id: 'healthInsuranceDeduction', title: 'Health Insurance Deduction Form', description: 'Manage Health Insurance Premiums and Self-Employment Income'},
  

];

const FormSelector = ({ onSelectForm }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userData, setUserData] = useState(null); // Para almacenar los datos del usuario
  const [favorites, setFavorites] = useState({}); // Estado para almacenar los favoritos
  const navigate = useNavigate();

  // Verificar si hay un token activo al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      navigate('/'); // Redirige al login si no hay token
      return;
    }

    // Validar el token con el backend y obtener los datos del usuario
    const validateToken = async () => {
      try {
        const response = await axios.get('https://taxbackend-production.up.railway.app/user', {
          headers: {
            Authorization: `Bearer ${token}`, // Envía el token al backend
          },
        });
        setUserData(response.data); // Almacena los datos del usuario
      } catch (error) {
        console.error('Error al validar el token:', error.message);
        localStorage.removeItem('authToken'); // Elimina el token si no es válido
        navigate('/'); // Redirige al login
      }
    };

    validateToken();
  }, [navigate]);

  // Filtrar los formularios por el término de búsqueda
  const filteredForms = forms.filter((form) =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Elimina el token
    navigate('/'); // Redirige al login
  };

  const toggleFavorite = (formId) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [formId]: !prevFavorites[formId],
    }));
  };
  

  return (
    <Box sx={{ display: 'flex' }}>
      
      {/* Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}  
      >
        <Box sx={{ width: 250, p: 2 }}>
          {userData && (
            <>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Avatar
                  sx={{ width: 64, height: 64, mx: 'auto', mb: 1 }}
                  src={userData.profilePicture || 'https://tax.bryanglen.com/user.png'} // Reemplaza con un campo de imagen si existe
                  alt={userData.firstName}
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif' }}>
                  {`${userData.first_name} ${userData.last_name}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userData.email}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
            </>
          )}
          <List>
            <ListItem button onClick={() => navigate('/profile')}>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={() => navigate('/favorites')}>
              <ListItemText primary="Favorites" />
            </ListItem>
            <ListItem button onClick={() => navigate('/recent')}>
              <ListItemText primary="Recent" />
            </ListItem>
            <ListItem button onClick={() => navigate('/support')}>
              <ListItemText primary="Support" />
            </ListItem>
          </List>
          <Divider sx={{ my: 2 }} />
          <Button
            variant="contained"
            color="primary"
            startIcon={<LogoutIcon />}
            fullWidth
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Contenido principal */}
      <Box sx={{ flex: 1 }}>
        {/* Botón para abrir el Drawer */}
        <IconButton size='large'
          onClick={() => setDrawerOpen(true)}
          sx={{ position: 'absolute', top: 16, left: 16, color: '#fff', backgroundColor: '#0858e6',}}
        >
          <MenuIcon />
        </IconButton>

        {/* Contenido del FormSelector */}
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
    padding: '5px', // Añade un pequeño relleno si es necesario
  }}
>
  {filteredForms.map((form) => (
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
    </Box>
  </Box>
</Box>
  );
};

export default FormSelector;
