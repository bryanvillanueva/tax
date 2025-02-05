import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent, IconButton} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CustomDrawer from './CustomDrawer';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CustomAppBar from './CustomAppBar';
import { useNavigate } from 'react-router-dom';
import CustomSpeedDial from './CustomSpeedDial';
import axios from 'axios';


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
  { code: '4', id: 'influencerOptimization', title: 'Influencer Optimization Form', description: 'Optimize influencer marketing strategies. Input campaign details, audience metrics, and ROI to maximize reach, engagement, and conversion rates for better brand partnerships and marketing efficiency.' },
  { code: '4', id: 'Covul', title: 'Corporate-Owned Variable Universal Life (COVUL) Form', description: 'Calculate future value, contributions, and tax benefits of Corporate-Owned Variable Universal Life (COVUL) policies. Input premium payments, growth rate, and tax rates for strategic planning and financial optimization.' },
  { code: '4', id: 'DepletionDeduction', title: 'Depletion Deduction For Royalties Form', description: 'Calculate the depletion deduction for royalty income. Input royalty income and applicable depletion rates to determine the allowable deduction for tax purposes.' },
  { code: '4', id: 'QualifiedDividends', title: 'Dividends Form', description: 'Calculate qualified dividends and applicable tax rates. Input dividend income and relevant tax rates to determine the tax liability on dividends.'},
  { code: '4', id: 'DonorAdvisedFund', title: 'Donor Advised Fund Form', description: 'Track and manage donations to donor-advised funds. Input contributions, fund growth, and grant distributions to plan charitable giving and tax benefits.'},
  { code: '4', id: 'ElectricVehicleCredits', title: 'Electric Vehicle Credits Form', description: 'Calculate available electric vehicle credits for tax purposes. Input the purchase details of an electric vehicle to determine eligible credits for federal and state tax filings.'},
  { code: '4', id: 'FinancedInsurance', title: 'Financed Insurance For Business Risks Form', description: 'Calculate deductions for financed insurance premiums related to business risks. Input loan details and insurance premiums to determine deductible expenses for tax purposes.'},
  { code: '4', id: 'FinancedSoftwareLeaseback', title: 'Financed Software Leaseback Form', description: 'Calculate deductions for software leaseback arrangements. Input software investment, leasing terms, and residual value to determine deductible lease expenses.'},
  { code: '4', id: 'FederalSolarInvestmentTaxCredit', title: 'Federal Solar Investment Tax Credit Form', description: 'Calculate federal tax credits for solar energy investments. Input qualified investment and applicable rates to determine eligible tax credits.'},
  { code: '4', id: 'ESOP', title: 'Employee Stock Ownership Plan (ESOP) Form', description: 'Calculate deductions for contributions to an Employee Stock Ownership Plan (ESOP). Input company valuation and percentage of shares to determine deductible amounts.'},
  { code: '4', id: 'ForeignEarnedIncomeExclusion', title: 'Foreign Earned Income Exclusion Form', description: 'Calculate exclusions for foreign earned income. Input qualified foreign income and determine the exclusion limit for tax purposes.'},

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
      <CustomAppBar userData={userData} onMenuClick={() => setDrawerOpen(true)} />
            {/* Logo */}
            <Box sx={{ textAlign: 'center', my: 4, marginTop: 8, }}>
              <img
                src="https://tax.bryanglen.com/logo.png"
                alt="Logo"
                style={{ maxWidth: '350px' }}
              />
            </Box>

      {/* Drawer */}
      
       {/* Botón para abrir el Drawer */}
       <IconButton
  size="large"
  onClick={() => setDrawerOpen(true)}
  sx={{
    position: 'fixed',
    top: 16,
    left: 16,
    color: '#fff',
    backgroundColor: '#0858e6',
    transition: 'transform 0.2s, background-color 0.2s', // Transición suave para hover y pulse
    '&:hover': {
      backgroundColor: '#0746b0', // Azul oscuro al hacer hover
      transform: 'scale(1.1)', // Efecto de pulse al hover
    },
    '&:active': {
      transform: 'scale(0.95)', // Pequeño efecto de clic
    },
  }}
>
  <MenuIcon />
</IconButton>

      {/* Reutiliza el Drawer */}
      <CustomDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        userData={userData}
      />
      
      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold' }}>
        Favorites
      </Typography>

      <CustomSpeedDial /> {/* Incluye el SpeedDial */}

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
