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
  { code: '1', id: 'depreciation', title: 'Accelerated Depreciation - Sec 179', description: 'Calculate accelerated depreciation (Section 179).', fixedIndex: 1 },
  { code: '1', id: 'hireKids', title: 'Hire Your Kids', description: 'Hire Your Kids', fixedIndex: 2 },
  { code: '1', id: 'prepaid', title: 'Pre-pay Expenses', description: 'Manage and calculate prepaid expenses deductions.', fixedIndex: 3 },
  { code: '1', id: 'augusta', title: 'Augusta Rule', description: 'Calculate deductions under the Augusta Rule.', fixedIndex: 4 },
  { code: '1', id: 'reimbursment', title: 'Reimbursment Of Personal Vehicle', description: 'Calculate reimbursment for personal vehicle.', fixedIndex: 5 },
  { code: '1', id: 'charitableRemainderTrust', title: 'Charitable Remainder Unitrust', description: 'Calculate charitable remainder deductions.', fixedIndex: 6 },
  { code: '1', id: 'hireFamily', title: 'Hire Your Family', description: 'Calculate deductions for hiring your family members.', fixedIndex: 7 },
  { code: '1', id: 'qualifiedOpportunityFunds', title: 'Qualified Opportunity Fund', description: 'Calculate deductions for investing in Qualified Opportunity Funds.', fixedIndex: 8 },
  { code: '1', id: 'healthSavings', title: "Health Savings Accounts (HSA)", description: "Calculate deductions for contributions to Health Savings Accounts (HSA) based on employee's benefits.", fixedIndex: 9 },
  { code: '1', id: 'lifetimeLearningCredit', title: 'Lifetime Learning Credit', description: 'calaculate Lifetime Learning Credit.', fixedIndex: 10 },
  { code: '2', id: 'savingsPlan', title: '529 Savings Plan', description: 'Calculate projected savings for future goals, accounting for annual contributions, interest rates, and time periods.', fixedIndex: 11 },
  { code: '2', id: 'accountableplanform', title: 'Accountable Plan', description: 'Manage Accountable Plan reimbursement values.', fixedIndex: 12 },
  { code: '2', id: 'adoptionincentiveform', title: 'Adoption Incentive', description: 'Calculate Adoption Incentive values.', fixedIndex: 13 },
  { code: '2', id: 'amendedPriorYears', title: 'Amended Prior Year Return', description: 'Calculate adjustments for amended tax returns from prior years.', fixedIndex: 14 },
  { code: '2', id: 'exemptionQualifiedSmall', title: 'Exemption For Qualified Small Business Stock', description: 'Calculate the exemption for capital gains on the sale of Qualified Small Business Stock (QSBS) as per IRS guidelines.', fixedIndex: 15 },
  { code: '2', id: 'costSegregation', title: 'Cost Segregation', description: 'Calculate the new annual depreciation and other values for cost segregation as per IRS guidelines for real estate properties.', fixedIndex: 16 },
  { code: '2', id: 'deferredCapitalGain', title: 'Deferred Capital Gain', description: 'Calculate Deferred Capital Gain values.', fixedIndex: 17 },
  { code: '2', id: 'educationAssistance', title: 'Education Assistance Program - Sec 127 Plan', description: 'Evaluate the impact of providing educational assistance to employees, including per-employee assistance amounts, limits, and total employees benefited.', fixedIndex: 18 },
  { code: '2', id: 'educationTaxCredit', title: 'Education Tax Credits', description: 'Calculate the tax credit for education expenses, considering factors such as filing status, income, qualified expenses, and the number of students benefited.', fixedIndex: 19 },
  { code: '2', id: 'healthReimbursement', title: 'Helath Reimbursment Arrangment (HRA/MERP)', description: 'Calculate the total benefits of the Health Reimbursement Arrangement based on employee benefits.', fixedIndex: 20 },
  { code: '3', id: 'incomeShifting', title: 'Income Shifting', description: 'Calculate the tax benefits of shifting income between family members or entities to optimize overall tax liability.', fixedIndex: 21 },
  { code: '3', id: 'lifeInsurance', title: 'Life Insurance Retirement Plan (LIRP)', description: 'Evaluate the benefits and tax implications of incorporating life insurance into your financial strategy.', fixedIndex: 22 },
  { code: '3', id: 'maximizeMiscellaneousExpenses', title: 'Maximize Miscelaneous Deductions', description: 'Analyze and optimize the reclassification of income and expenses to maximize tax deductions and improve financial strategies.', fixedIndex: 23 },
  { code: '3', id: 'mealsDeduction', title: 'Meals & entertainmnet Deductions (M&E)', description: 'Analyze and optimize meal-related expenses for tax deduction purposes, maximizing allowable deductions and improving financial strategies.', fixedIndex: 24 },
  { code: '3', id: 'lossesDeduction', title: 'Net Operating Losses (NOL)', description: 'Calculate and manage Net Operating Losses (NOL) with ease. Input filing details, taxable income, and NOL carryforward to generate accurate deductions and limitations automatically.', fixedIndex: 25 },
  { code: '3', id: 'solo401k', title: 'Solo 401K (One-Participant 401(k) Plan)', description: 'Easily calculate and manage Solo 401(k) contributions. Input filing details, gross income, and deferral amounts to ensure accurate results and compliance with contribution limits.', fixedIndex: 26 },
  { code: '3', id: 'researchAndDevelopmentCredit', title: 'Research & Development Credit (R&D credit) ', description: 'Calculate the tax credit for research and development expenses, considering factors such as company size, eligible R&D costs, and the amount of qualified research activities.', fixedIndex: 27 },
  { code: '3', id: 'rothIRA', title: 'Roth IRA Contrubutions', description: 'Manage Roth IRA contributions, including Annual Contribution and AGI Before Applying the Strategy.', fixedIndex: 28 },
  { code: '3', id: 'healthInsuranceDeduction2', title: 'Self-emplyed Health Insurance ', description: 'Manage Health Insurance Premiums and Self-Employment Income, including deductions and adjustments before applying the strategy.', fixedIndex: 29 },
  { code: '3', id: 'sepContributions', title: 'Simplified Employee Pension Contribution (SEP)', description: 'Manage SEP contributions, including self-employed income and deductions, to optimize retirement savings and tax benefits.', fixedIndex: 30 },
  { code: '4', id: 'simpleIRA', title: 'Simple IRA', description: 'Manage Simple IRA contributions, including Employer and Employee Contributions.', fixedIndex: 31 },
  { code: '4', id: 'startupCostOptimization', title: 'Startup Cost Optimization', description: 'Optimize and manage startup costs. Input expenses, forecasted revenue, and financing options to ensure efficient allocation of resources and maximum profitability.', fixedIndex: 32 },
  { code: '4', id: 'stateTaxSavings', title: 'State Tax & C Corporation', description: 'Calculate and manage state tax savings. Input taxable income, deductions, and applicable state tax rates to optimize tax planning and minimize state tax liabilities.', fixedIndex: 33 },
  { code: '4', id: 'traditionalIRA', title: 'Traditional IRA Contributions', description: 'Calculate and manage contributions to a Traditional IRA. Input income, contribution limits, and tax deductions to optimize retirement savings and minimize current tax liabilities.', fixedIndex: 34 },
  { code: '4', id: 'unreimbursedExpenses', title: 'Unreimbursed Partnership Expenses', description: 'Track and manage unreimbursed business expenses. Input expenses such as travel, supplies, and meals to optimize deductions and reduce taxable income.', fixedIndex: 35 },
  { code: '4', id: 'ActiveRealEstateForm', title: 'Active Participation in Real Estate ', description: 'Manage Active Real Estate Income and Losses, including Gross Income, Net Rental Loss, and Adjusted Gross Income.', fixedIndex: 36 },
  { code: '4', id: 'BackdoorRothForm', title: 'Backdoor Roth IRA', description: 'Strategy that allows high-income earners to fund a Roth IRA by first making a non-deductible contribution to a Traditional IRA and then immediately converting it to a Roth IRA, effectively bypassing income limits for direct Roth contributions.', fixedIndex: 37 },
  { code: '4', id: 'CancellationByInsolvencyForm', title: 'Cancellation Of Debt Income By Insolvency (COD)', description: 'Cancellation of debt income by insolvency.', fixedIndex: 38 },
  { code: '4', id: 'charitableDonationSavings', title: 'Charitable Donation Of Appreciated Assets', description: 'Track and manage charitable donations for tax savings. Input donations, applicable tax deductions, and optimize contributions to reduce taxable income and maximize charitable giving benefits.', fixedIndex: 39 },
  { code: '4', id: 'influencerOptimization', title: 'Profitable Strategies For Content Creators & Influencers', description: 'Optimize influencer marketing strategies. Input campaign details, audience metrics, and ROI to maximize reach, engagement, and conversion rates for better brand partnerships and marketing efficiency.', fixedIndex: 40 },
  { code: '4', id: 'Covul', title: 'Corporate-Owned Variable Universal Life (COVUL)', description: 'Calculate future value, contributions, and tax benefits of Corporate-Owned Variable Universal Life (COVUL) policies. Input premium payments, growth rate, and tax rates for strategic planning and financial optimization.', fixedIndex: 41 },
  { code: '4', id: 'DepletionDeduction', title: 'Depletion Deduction For Royalties', description: 'Calculate the depletion deduction for royalty income. Input royalty income and applicable depletion rates to determine the allowable deduction for tax purposes.', fixedIndex: 42 },
  { code: '4', id: 'QualifiedDividends', title: 'Dividends', description: 'Calculate qualified dividends and applicable tax rates. Input dividend income and relevant tax rates to determine the tax liability on dividends.', fixedIndex: 43 },
  { code: '4', id: 'DonorAdvisedFund', title: 'Donor Advised Fund (DAF)', description: 'Track and manage donations to donor-advised funds. Input contributions, fund growth, and grant distributions to plan charitable giving and tax benefits.', fixedIndex: 44 },
  { code: '4', id: 'ElectricVehicleCredits', title: 'Electric Vehicle Credits (Revised for IRA Inflation Reduction Act)', description: 'Calculate available electric vehicle credits for tax purposes. Input the purchase details of an electric vehicle to determine eligible credits for federal and state tax filings.', fixedIndex: 45 },
  { code: '4', id: 'ESOP', title: 'Employee Stock Ownership Plan (ESOP)', description: 'Calculate deductions for contributions to an Employee Stock Ownership Plan (ESOP). Input company valuation and percentage of shares to determine deductible amounts.', fixedIndex: 46 },
  { code: '4', id: 'FederalSolarInvestmentTaxCredit', title: 'Residential Clean Energy Credit', description: 'Calculate federal tax credits for solar energy investments. Input qualified investment and applicable rates to determine eligible tax credits.', fixedIndex: 47 },
  { code: '4', id: 'FinancedInsurance', title: 'Financed Business Insurance', description: 'Calculate deductions for financed insurance premiums related to business risks. Input loan details and insurance premiums to determine deductible expenses for tax purposes.', fixedIndex: 48 },
  { code: '4', id: 'FinancedSoftwareLeaseback', title: 'Financed Software Leaseback', description: 'Calculate deductions for software leaseback arrangements. Input software investment, leasing terms, and residual value to determine deductible lease expenses.', fixedIndex: 49 },
  { code: '4', id: 'ForeignEarnedIncomeExclusion', title: 'Foreign Earned Income Exclusion', description: 'Calculate exclusions for foreign earned income. Input qualified foreign income and determine the exclusion limit for tax purposes.', fixedIndex: 50 },
  { code: '4', id: 'GroupHealthInsurance', title: 'Group Health Insurance for S-Corporation', description: 'Calculate deductions and benefits for group health insurance plans. Input premiums and coverage details to determine eligibility and tax implications.', fixedIndex: 51 },
  { code: '4', id: 'GroupingRelatedActivities', title: 'Grouping Of Activities (Sec. 469)', description: 'Evaluate the grouping of related activities for passive income tax treatment under Section 469. Input activity details to determine eligibility and impact on tax calculations.', fixedIndex: 52 },
  { code: '4', id: 'HistoricalPreservationEasement', title: 'Historical Preservation Easement', description: 'Determine tax deductions for historical preservation easements. Input property details and conservation restrictions to calculate allowable deductions.', fixedIndex: 53 },
  { code: '4', id: 'HomeOfficeDeduction', title: 'Home Office Deduction', description: 'Calculate deductions for home office expenses. Input workspace details, expenses, and business usage percentage to determine the deductible amount.', fixedIndex: 54 },
  { code: '4', id: 'InstallmentSale', title: 'Installment Sale', description: 'Assess tax implications of installment sales. Input sale details, payment schedules, and interest rates to determine taxable income and installment gain.', fixedIndex: 55 },
  { code: '4', id: 'MaximizeItemization', title: 'Maximize Itemization Strategies', description: 'Optimize itemized deductions by evaluating eligible expenses to maximize tax benefits.', fixedIndex: 56 },  
  { code: '4', id: 'NoncashCharitableContributions', title: 'Noncash Charitable Contributions', description: 'Determine the deductible value of donated noncash charitable contributions for tax reporting.', fixedIndex: 57 },  
  { code: '4', id: 'OilAndGasDrillingCost', title: 'Oil And Gas - Drilling Cost', description: 'Calculate the deductible drilling costs for oil and gas investments, including intangible drilling expenses.', fixedIndex: 58 },  
  { code: '4', id: 'OilAndGasMLP', title: 'Oil And Gas - Master Limited Partnership (MLP)', description: 'Evaluate tax implications and deductions for investments in oil and gas Master Limited Partnerships (MLPs).', fixedIndex: 59 },  
  { code: '4', id: 'OrdinaryLossOnWorthlessStock', title: 'Ordinary Loss on Worthless Stock', description: 'Assess and claim deductions for losses on worthless stocks, including qualification criteria for ordinary loss treatment.', fixedIndex: 60 },  
  { code: '4', id: 'passThroughEntity', title: 'Pass-Through Entity - State and Local Taxes Deduction (SALT) ', description: 'Calculate tax implications and deductions for pass-through entity income, including state tax credits and federal return deductions.', fixedIndex: 61 },
  { code: '4', id: 'passiveLossAndPigs', title: 'Passive loss & Passive Income Generators', description: 'Calculate and track passive losses and income, including previous year losses, current year activity, and carried forward amounts.', fixedIndex: 62 },
  { code: '4', id: 'primarySaleExclusion', title: 'Primary Home Sale Exclusion (Section 121)', description: 'Calculate the tax implications of selling assets at a primary sale, including capital gain, estimated capital gain tax, and qualified business income deduction.', fixedIndex: 63 },
  { code: '4', id: 'privateFamilyFoundation', title: 'Private Family Foundation', description: 'Calculate and track foundation contributions, including cash and non-cash limitations, total deductible amounts, and qualified business income deductions.', fixedIndex: 64 },
  { code: '4', id: 'qualifiedCharitableDistributions', title: 'Qualified Charitable Distributions (QCDs)', description: 'Calculate charitable distributions from IRAs, including age-based requirements, distribution limits, and taxable income implications.', fixedIndex: 65 },
  { code: '4', id: 'RealEstateDevelopmentCharitable', title: 'Real Estate Development with a charitable option donation ', description: 'Calculate tax benefits and deductions for charitable contributions related to real estate development projects.', fixedIndex: 66 },
  { code: '4', id: 'RestrictedStockUnits', title: 'Restricted Stock Units', description: 'Evaluate tax implications and timing strategies for restricted stock units (RSUs) compensation.', fixedIndex: 67 },
  { code: '4', id: 'RetireePlanning', title: 'Retiree Planning (Social Security, RMDs, Spousal IRAs Etc)', description: 'Analyze retirement planning strategies including income sources, tax implications and distribution planning.', fixedIndex: 68 },
  { code: '4', id: 'SCorpRevocation', title: 'S Corporation Revocation', description: 'Assess tax implications and strategies for revoking S corporation status and converting to C corporation.', fixedIndex: 69 },
  { code: '4', id: 'SecureAct20Strategies', title: 'Secure Act 2.0 Strategies', description: 'Evaluate retirement planning strategies under the SECURE Act including RMD changes and inherited IRA rules.', fixedIndex: 70 },
  { code: '4', id: 'selfDirectedIRA401K', title: 'Self - Directed IRA/401k Investments', description: 'Evaluate self-directed IRA and 401K plans, including investment options, tax benefits, and compliance considerations.', fixedIndex: 71 },      
  { code: '4', id: 'seriesIBond', title: 'Series I Bond', description: 'Calculate interest and tax treatment for Series I Bonds, including inflation adjustments and redemption rules.', fixedIndex: 72 },
  { code: '4', id: 'shortTermRental', title: 'Short - Term Rental Real Estate Archive Edit', description: 'Assess income and deductions for short-term rental properties, covering depreciation, expenses, and tax strategies.', fixedIndex: 73 },
  { code: '4', id: 'solarPassiveInvestment', title: 'Solar passive Investment Strategy (ITCS)', description: 'Evaluate tax credits and deductions for solar energy investments, including passive income strategies and ROI projections.', fixedIndex: 74 },
  { code: '4', id: 'bonusDepreciation', title: 'Bonus Depreciation', description: 'Compute bonus depreciation benefits for qualifying business assets, factoring in IRS regulations and phase-out schedules.', fixedIndex: 75 },
  { code: '4', id: 'structuredInvestmentProgram', title: ' Sophisticated investment partnership ', description: 'Analyze structured investment programs, including risk-adjusted returns, tax implications, and suitability for various investor profiles.', fixedIndex: 76 },
  //76 organizadas 

  { code: '4', id: 'taxFreeIncome', title: 'Tax-Free Income', description: 'Analyze sources of tax-free income, including municipal bonds, Roth distributions, and life insurance strategies.', fixedIndex: 77 },
  { code: '4', id: 'workOpportunityTaxCredit', title: 'Work Opportunity Tax Credit', description: 'Determine eligibility and potential tax savings for hiring employees under the Work Opportunity Tax Credit (WOTC) program.', fixedIndex: 78 },
  { code: '4', id: '1031Exchange', title: '1031 Exchange', description: 'Calculate deferred tax benefits for like-kind real estate exchanges under Section 1031, including reinvestment timelines and qualifications.', fixedIndex: 79 },
  { code: '4', id: 'definedBenefitPlan', title: 'Defined Benefit Plan', description: 'Project retirement benefits under a defined benefit plan, considering employer contributions, actuarial calculations, and tax deferrals.', fixedIndex: 80 },
  { code: '4', id: 'dayTraderTaxStatus', title: 'Day Trader Tax Status', description: 'Analyze tax implications for day traders, including qualification criteria, deductions, and mark-to-market election strategies.', fixedIndex: 81 },
  { code: '4', id: 'collegeStudentStrategies', title: 'College Student Strategies', description: 'Explore tax planning strategies for college students, including education credits, tax-free savings, and financial aid impacts.', fixedIndex: 82 },
  { code: '4', id: 'sellHomeToSCorp', title: 'Sell Home to S-Corp', description: 'Assess the tax and financial implications of selling a personal residence to an S-Corporation, including capital gains treatment and business use considerations.', fixedIndex: 83 },
  { code: '4', id: 'giftingStockStrategy', title: 'Gifting Stock Strategy', description: 'Review tax-efficient strategies for gifting stocks, including cost basis considerations, donor benefits, and charitable giving options.', fixedIndex: 84 },
  { code: '4', id: 'realEstateOptions', title: 'Real Estate Options', description: 'Examine real estate investment options, including lease options, seller financing, and tax-deferred exchanges.', fixedIndex: 85 },
  { code: '4', id: 'marriedFilingSeparate', title: 'Married Filing Separate', description: 'Compare the tax implications of filing separately versus jointly for married couples, including deductions, credits, and financial planning strategies.', fixedIndex: 86 },
  { code: '4', id: 'individualPlanningIdeas', title: 'Individual Planning Ideas', description: 'Discover personalized tax and financial planning strategies tailored to individual needs, risk tolerance, and long-term goals.', fixedIndex: 87 },
  { code: '4', id: 'netInvestmentIncomeTax', title: 'Net Investment Income Tax', description: 'Analyze the Net Investment Income Tax (NIIT), including thresholds, affected income types, and mitigation strategies.', fixedIndex: 88 },
  { code: '4', id: 'miscTaxCredits', title: 'Miscellaneous Tax Credits', description: 'Review various tax credits available to individuals and businesses, including eligibility requirements and optimization techniques.', fixedIndex: 89 },
  { code: '4', id: 'rentalStrategies754Election', title: 'Rental Strategies & 754 Election', description: 'Explore rental property tax strategies and the Section 754 election for partnerships, including depreciation adjustments and basis step-ups.', fixedIndex: 90 },
  { code: '4', id: 'ReasonableCompAnalysis', title: 'Reasonable Comp Analysis for Owners of Corporations', description: 'Analyze reasonable compensation for business owners to ensure compliance with tax regulations and avoid IRS scrutiny.', fixedIndex: 91 },
  { code: '4', id: 'RealEstateProfessional', title: 'Real Estate Professional', description: 'Understand the tax benefits and qualifications for real estate professionals, including passive loss limitations and material participation rules.', fixedIndex: 92 },
  { code: '4', id: 'CaptiveInsurance', title: 'Captive Insurance', description: 'Explore the advantages and compliance considerations of captive insurance for businesses, including risk management and tax benefits.', fixedIndex: 93 },
  { code: '4', id: 'CharitableLLC', title: 'Charitable LLC', description: 'Discover how a Charitable LLC can be structured to align with philanthropic goals while maintaining flexibility and tax benefits.', fixedIndex: 94 },
  { code: '4', id: 'SoleProprietor', title: 'Choice of Entity - Sole Proprietor Sch C', description: 'Examine the tax implications and strategic considerations of operating as a sole proprietor, including self-employment taxes and deductions.', fixedIndex: 95 },
  { code: '4', id: 'ChoiceOfEntity', title: 'Choice of Entity - Overview & Analysis', description: 'Compare business entity structures to determine the most tax-efficient and legally protective option for your business.', fixedIndex: 96 },
  { code: '4', id: 'ChoiceOfEntityCCorp', title: 'Choice of Entity - C Corporation', description: 'Assess the benefits and drawbacks of operating as a C Corporation, including double taxation and tax planning opportunities.', fixedIndex: 97 },
  { code: '4', id: 'ChoiceOfEntityPartnership', title: 'Choice of Entity - Partnership', description: 'Understand the tax and operational considerations of forming a partnership, including pass-through taxation and liability concerns.', fixedIndex: 98 },
  { code: '4', id: 'ChoiceOfEntitySCorp', title: 'Choice of Entity - S Corporation', description: 'Explore the tax advantages and eligibility requirements of an S Corporation, including pass-through taxation and self-employment tax savings.', fixedIndex: 99 },


];


 

const FormSelector = ({ onSelectForm, searchTerm, setSearchTerm }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userData, setUserData] = useState(null); // Para almacenar los datos del usuario
  const [filteredForms, setFilteredForms] = useState([]); // Formularios filtrados según user_level
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('formFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : {};
  });

  const [loading, setLoading] = useState(true);
  // Eliminado el estado isFixed que ya no se necesita
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

// Ya no necesitamos fijar la barra de búsqueda, ya que existe una en CustomAppBar

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
        <Box sx={{ mt: 5 }}>
          {/* Contenedor del buscador */}
          <Container
    sx={{
      backgroundImage: 'url(https://wac-cdn.atlassian.com/misc-assets/webp-images/bg_atl_cloud_hero_small.svg)',
      backgroundColor: 'transparent',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderRadius: '12px',
      padding: { xs: '16px', sm: '32px' },
      mb: 4,
      textAlign: 'center',
      maxWidth: { xs: '90%', sm: '1250px' },
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
    }}
>
  {/* Título (oculto cuando está fijo) */}
  <Typography
    variant="h5"
    gutterBottom
    sx={{
      color: '#fff',
      fontWeight: 'bold',
      fontFamily: 'Montserrat, sans-serif',
      fontSize: { xs: '1.5rem', sm: '2.125rem' },
      mb: 3
    }}
  >
    Search or Select a Form to Continue
  </Typography>

  {/* Barra de búsqueda (siempre visible) */}
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
      '& fieldset': {
        border: 'none',
      },
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        '&:hover fieldset': { borderColor: '#0055A4' },
        '&.Mui-focused fieldset': { borderColor: '#0055A4', fontFamily: 'Montserrat, sans-serif' },
      },
      transition: 'all 0.3s ease',
      fontSize: { xs: '14px', sm: '16px' },
    }}
  />
</Container>

          {/* Ya no necesitamos espacio adicional porque la barra no se fija */}

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
   {/* Número fijo dentro de la tarjeta */}
    <Typography
          variant="h6"
          sx={{
            position: 'absolute', // Posición absoluta para colocarlo en la esquina
            top: 12, // Distancia desde la parte superior
            left: 12, // Distancia desde la izquierda
           
            color: 'gray',
            zIndex: 2, // Asegura que esté por encima del contenido
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          {form.fixedIndex} {/* Número consecutivo */}
        </Typography>

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
