import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent, IconButton ,Fab, Container, Drawer, List, ListItem, ListItemText, Divider, Button, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import axios from 'axios';


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
    { id: 'ActiveRealEstateForm', title: 'Active Real Estate Form', description: 'Manage Active Real Estate Income and Losses, including Gross Income, Net Rental Loss, and Adjusted Gross Income.'},
    { id: 'BackdoorRothForm', title: 'Back door Roth Form', description: 'strategy that allows high-income earners to fund a Roth IRA by first making a non-deductible contribution to a Traditional IRA and then immediately converting it to a Roth IRA, effectively bypassing income limits for direct Roth contributions.'},
    { id: 'CancellationByInsolvencyForm', title: 'Cancellation of debt income by insolvency', description: 'Cancellation of debt income by insolvency.'},
    { id: 'simpleIRA', title: 'Simple IRA Form', description: 'Manage Simple IRA contributions, including Employer and Employee Contributions.'},
    { id: 'startupCostOptimization', title: 'Startup Cost Optimization Form', description: 'Optimize and manage startup costs. Input expenses, forecasted revenue, and financing options to ensure efficient allocation of resources and maximum profitability.'},
    { id: 'stateTaxSavings', title: 'State Tax Savings Form', description: 'Calculate and manage state tax savings. Input taxable income, deductions, and applicable state tax rates to optimize tax planning and minimize state tax liabilities.'},
    { id: 'traditionalIRA', title: 'Traditional IRA Contributions Form', description: 'Calculate and manage contributions to a Traditional IRA. Input income, contribution limits, and tax deductions to optimize retirement savings and minimize current tax liabilities.'},
    { id: 'unreimbursedExpenses', title: 'Unreimbursed Expenses Form', description: 'Track and manage unreimbursed business expenses. Input expenses such as travel, supplies, and meals to optimize deductions and reduce taxable income.'},
    { id: 'charitableDonationSavings', title: 'Charitable Donation Savings Form', description: 'Track and manage charitable donations for tax savings. Input donations, applicable tax deductions, and optimize contributions to reduce taxable income and maximize charitable giving benefits.'},
    { id: 'influencerOptimization', title: 'Influencer Optimization Form', description: 'Optimize influencer marketing strategies. Input campaign details, audience metrics, and ROI to maximize reach, engagement, and conversion rates for better brand partnerships and marketing efficiency.' 
    }
];

const Favorites = ({ onSelectForm }) => {
    const [favorites, setFavorites] = useState(() => {
       const savedFavorites = localStorage.getItem('formFavorites');
       return savedFavorites ? JSON.parse(savedFavorites) : {};
     });
   
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const [userData ,setUserData] = useState(null); // Para almacenar los datos del usuario
  

    const handleRemoveFavorite = (formId, event) => {
      event.stopPropagation(); // Previene que se active el CardActionArea
      const newFavorites = { ...favorites };
      delete newFavorites[formId];
      setFavorites(newFavorites);
      localStorage.setItem('formFavorites', JSON.stringify(newFavorites));
  };


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


  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Elimina el token
    navigate('/'); // Redirige al login
  };

    // Cargar favoritos desde localStorage al montar el componente
    useEffect(() => {
      const savedFavorites = localStorage.getItem('formFavorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }, []);
  
    // Filtrar formularios favoritos
    const favoriteForms = forms.filter((form) => favorites[form.id]);
  
    // Manejar selección de formulario
    const handleFormSelect = (formId) => {
      if (onSelectForm) {
        onSelectForm(`form-selector/${formId}`); // Notificar al Dashboard el formulario seleccionado
      } else {
        navigate(`/form-selector/${formId}`); // Navegar directamente si no hay `onSelectForm`
      }
    };
  


  return (
    <Box sx={{ mt: 5, textAlign: 'center' }}>
            {/* Logo */}
            <Box sx={{ textAlign: 'center', my: 4, marginTop: 8, }}>
              <img
                src="https://tax.bryanglen.com/logo.png"
                alt="Logo"
                style={{ maxWidth: '350px' }}
              />
            </Box>

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
            <ListItem button onClick={() => navigate('/form-selector')}>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => navigate('/favorites')}>
              <ListItemText primary="Favorites" />
            </ListItem>
            <ListItem button onClick={() => window.open('https://tax.bryanglen.com/shop-2/', '_blank')}>
               <ListItemText primary="Shop" />
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
       {/* Botón para abrir el Drawer */}
       <IconButton size='large'
          onClick={() => setDrawerOpen(true)}
          sx={{ position: 'absolute', top: 16, left: 16, color: '#fff', backgroundColor: '#0858e6',}}
        >
          <MenuIcon />
        </IconButton>
      
      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold' }}>
        Favorites
      </Typography>

      <Fab
            color="primary"
            aria-label="back"
            onClick={() => {
                // Redirigir al FormSelector
                navigate('/');
              }}
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              width: 80,
              height: 80,
              backgroundColor: '#0858e6',
              '&:hover': {
                backgroundColor: '#064bb5',
              },
            }}
          >
            <HomeIcon sx={{ color: '#fff' }} />
          </Fab>

      {favoriteForms.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2, fontFamily: 'Montserrat, sans-serif' }}>
          No favorite forms selected.
        </Typography>
      ) : (
        <Grid container spacing={2} sx={{ maxWidth: '1250px', margin: '0 auto', padding: '5px' }}>
          {favoriteForms.map((form) => (
            <Grid item xs={12} sm={6} md={3} key={form.id}>
              <Card variant="outlined" sx={{ height: '100%', borderRadius: '12px', position: 'relative' }}>
                <IconButton
                 onClick={(e) => handleRemoveFavorite(form.id, e)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: 'red',
                    zIndex: 2,
                  }}
                >
                  <FavoriteIcon />
                </IconButton>
                <CardActionArea onClick={() => handleFormSelect(form.id)}>
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
                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Montserrat, sans-serif' }}>
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
  );
};

export default Favorites;
