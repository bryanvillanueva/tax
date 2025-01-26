import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, CssBaseline, IconButton } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import DepreciationForm from './DepreciationForm';
import AugustaRuleForm from './AugustaRuleForm';
import PrepaidExpensesForm from './PrepaidExpensesForm';
import HireYourKidsForm from './HireYourKids';
import ReimbursmentOfPersonalForm from './ReimbursmentOfPersonalForm';
import CharitableRemainderForm from './CharitableRemainderForm';
import HireYourFamilyForm from './HireYourFamily';
import HealthSavingsAccountForm from './HealthSavingsAccountForm';
import QualifiedOpportunityFundsForm from './QualifiedOpportunityFunds';
import LifetimeLearningCredit from './LifetimeLearningCredit';
import AmendedPriorYearForm from './AmendedPriorYearForm';
import ExemptionQualifiedSmallBusinessStockForm from './ExemptionQualifiedSmallBusinessStockForm';
import CostSegregationForm from './CostSegregationForm';
import SavingsPlanForm from './SavingsPlanForm';
import EducationAssistanceForm from './EducationAssistanceForm';
import EducationTaxCreditForm from './EducationTaxCreditForm';
import ResultsDisplay from './ResultsDisplay';
import AccountablePlanForm from './AccountableplanForm';
import AdoptionIncentiveForm from './AdoptionIncentiveForm';
import DeferredCapitalGainForm from './DeferredCapitalGainForm';
import IncomeShiftingForm from './IncomeShiftingForm';
import LifeInsuranceForm from './LifeInsuranceForm';
import MealsDeductionForm from './MealsDeductionForm';
import Solo401kForm from './Solo401kForm';
import SimpleIRAForm from './SimpleIRAForm';
import StartupCostOptimizationForm from './StartupCostOptimizationForm';
import StateTaxSavingsForm from './StateTaxSavingsForm';
import ResearchAndDevelopmentCreditForm from './ResearchAndDevelopmentCreditForm';
import RothIRAForm from './RothIRAForm';
import TraditionalIRAContributionsForm from './TraditionalIRAContributionsForm';
import UnreimbursedPartnershipExpensesForm from './UnreimbursedPartnershipExpensesForm';
import CharitableDonationOfAppreciatedAssetsForm from './CharitableDonationOfAppreciatedAssetsForm';
import InfluencerOptimizationForm from './InfluencerOptimizationForm';
import SEPContributionsForm from './SEPContributionsForm';
import MaximizeMiscellaneousExpensesForm from './MaximizeMiscellaneousExpensesForm';
import HealthReimbursementArrangementForm from './HealthReimbursementArragementForm';
import HealthInsuranceDeductionForm2 from './HealthInsuranceDeductionForm2';
import NetOperatingLossesForm from './NetOperatingLossesForm';
import ActiveRealEstateForm from './ActiveRealEstateForm';
import BackdoorRothForm from './BackdoorRothForm';
import CancellationByInsolvencyForm from './CancellationByInsolvencyForm';
import FormSelector from './FormSelector';
import CustomSpeedDial from './CustomSpeedDial';
import CustomDrawer from './CustomDrawer';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';



const Dashboard = () => {
  const { formId } = useParams(); // Obtiene el formId de la URL
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  //const [open, setOpen] = useState(false);
   const [userData, setUserData] = useState(null); 
   const [drawerOpen, setDrawerOpen] = useState(false);

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

  useEffect(() => {
    setResults(null); // Reinicia los resultados cuando cambia el formulario
  }, [formId]);

  const handleSelectForm = (form) => {
    navigate(`/form-selector/${form}`); // Navega a la ruta con el ID del formulario
    setResults(null);
  };


  const renderForm = () => {
    switch (formId) {
      case 'depreciation':
        return <DepreciationForm onCalculate={setResults} />;
      case 'augusta':
        return <AugustaRuleForm onCalculate={setResults} />;
      case 'prepaid':
        return <PrepaidExpensesForm onCalculate={setResults} />;
      case 'hireKids':
        return <HireYourKidsForm onCalculate={setResults} />;
      case 'charitableRemainderTrust':
        return <CharitableRemainderForm onCalculate={setResults} />;
      case 'reimbursment':
        return <ReimbursmentOfPersonalForm onCalculate={setResults} />;
      case 'hireFamily':
        return <HireYourFamilyForm onCalculate={setResults} />;
      case 'qualifiedOpportunityFunds':
        return <QualifiedOpportunityFundsForm onCalculate={setResults} />;
      case 'healthSavings':
        return <HealthSavingsAccountForm onCalculate={setResults} />;
      case 'lifetimeLearningCredit':
        return <LifetimeLearningCredit onCalculate={setResults} />;
      case 'amendedPriorYears':
        return <AmendedPriorYearForm onCalculate={setResults} />;
      case 'exemptionQualifiedSmall':
        return <ExemptionQualifiedSmallBusinessStockForm onCalculate={setResults} />;
      case 'costSegregation':
        return <CostSegregationForm onCalculate={setResults} />;
      case 'savingsPlan':
        return <SavingsPlanForm onCalculate={setResults} />;
      case 'educationAssistance':
        return <EducationAssistanceForm onCalculate={setResults} />;
      case 'educationTaxCredit':
        return <EducationTaxCreditForm onCalculate={setResults} />;
      case 'accountableplanform':
          return <AccountablePlanForm onCalculate={setResults} />;
      case 'adoptionincentiveform':
          return <AdoptionIncentiveForm onCalculate={setResults} />;
      case 'deferredCapitalGain':
          return <DeferredCapitalGainForm onCalculate={setResults} />;
      case 'healthReimbursement':
          return <HealthReimbursementArrangementForm onCalculate={setResults} />;
      case 'incomeShifting':
          return <IncomeShiftingForm onCalculate={setResults} />;
      case 'lifeInsurance':
          return <LifeInsuranceForm onCalculate={setResults} />;
        case 'maximizeMiscellaneousExpenses':
          return <MaximizeMiscellaneousExpensesForm onCalculate={setResults} />;
      case 'mealsDeduction':
          return <MealsDeductionForm onCalculate={setResults} />;
      case 'lossesDeduction':
          return <NetOperatingLossesForm onCalculate={setResults} />;
      case 'solo401k':
          return <Solo401kForm onCalculate={setResults} />;
      case 'researchAndDevelopmentCredit':
          return <ResearchAndDevelopmentCreditForm onCalculate={setResults} />;
      case 'sepContributions':
          return <SEPContributionsForm onCalculate={setResults} />;
      case 'healthInsuranceDeduction2':
          return <HealthInsuranceDeductionForm2 onCalculate={setResults} />;
      case 'rothIRA':
          return <RothIRAForm onCalculate={setResults} />;
      case 'ActiveRealEstateForm':
          return <ActiveRealEstateForm onCalculate={setResults} />;
      case 'BackdoorRothForm':
          return <BackdoorRothForm onCalculate={setResults} />;
      case 'CancellationByInsolvencyForm':
          return <CancellationByInsolvencyForm onCalculate={setResults} />;
      case 'simpleIRA':
          return <SimpleIRAForm onCalculate={setResults} />;
      case 'startupCostOptimization':
            return <StartupCostOptimizationForm onCalculate={setResults} />;
      case 'stateTaxSavings':
            return <StateTaxSavingsForm onCalculate={setResults} />;
      case 'traditionalIRA':
            return <TraditionalIRAContributionsForm onCalculate={setResults} />;
      case 'unreimbursedExpenses':
            return <UnreimbursedPartnershipExpensesForm onCalculate={setResults} />;
      case 'charitableDonationSavings':
            return <CharitableDonationOfAppreciatedAssetsForm onCalculate={setResults} />;
      case 'influencerOptimization':
            return <InfluencerOptimizationForm onCalculate={setResults} />;
      default:
        return <FormSelector onSelectForm={handleSelectForm} />;
    }
  };

  const getFormTitle = () => {
    switch (formId) {
      case 'depreciation':
        return 'Accelerated Depreciation (Section 179) Form';
      case 'augusta':
        return 'Augusta Rule Form';
      case 'prepaid':
        return 'Prepaid Expenses Form';
      case 'hireKids':
        return 'Hire Your Kids Form';
      case 'charitableRemainderTrust':
        return 'Charitable Remainder Trus Form';
      case 'reimbursment':
        return 'Reimbursment Of Personal Vehicle Form';
      case 'hireFamily':
        return 'Hire Your Family Form';
      case 'qualifiedOpportunityFunds':
        return 'Qualified Opportunity Funds Form';
      case 'healthSavings':
        return 'Health Savings Account Form';
      case 'lifetimeLearningCredit':
        return 'Lifetime Learning Credit';
      case 'amendedPriorYears':
        return 'Amended Prior Year Form';
      case 'exemptionQualifiedSmall':
        return 'Exemption Qualified Small Business Stock Form';
      case 'costSegregation':
        return 'Cost Segregation Form';
      case 'savingsPlan':
        return 'Savings Plan Form';
      case 'educationAssistance':
        return 'Education Assistance Form';
      case 'educationTaxCredit':
        return 'Education Tax Credit Form';
      case 'accountableplanform':
        return 'Accountable Plan Form';
      case 'adoptionincentiveform':
        return 'Adoption Incentive Form';
      case 'deferredCapitalGain':
          return 'Deferred Capital Gain Form';
      case 'healthReimbursement':
          return 'Health Reimbursement Arrangement Form';
      case 'incomeShifting':
          return 'Income Shifting Form';
      case 'lifeInsurance':
          return 'Life Insurance Form';
      case 'maximizeMiscellaneousExpenses':
          return 'Maximize Miscellaneous Expenses Form';
      case 'mealsDeduction':
          return 'Meals Deduction Form';
      case 'lossesDeduction':
          return 'Net Operating Losses (NOL) Form';
      case 'solo401k':
          return 'Solo 401(k) Form';
      case 'researchAndDevelopmentCredit':
          return 'Research & Development Credit Form';
      case 'sepContributions':
          return 'SEP Contributions Form';
      case 'healthInsuranceDeduction2':
          return 'Health Insurance Deduction Form';
      case 'rothIRA':
          return 'Roth IRA Form';
      case 'ActiveRealEstateForm':
          return 'Active Real Estate Form';
      case 'BackdoorRothForm':
          return 'Back Door Roth Form';
      case 'CancellationByInsolvencyForm':
          return 'Cancellation Of Debt Income By Insolvency Form';
      case 'simpleIRA':
            return 'Simple IRA Form';
      case 'startupCostOptimization':
            return 'Startup Cost Optimization Form';
      case 'stateTaxSavings':
            return 'State Tax Savings Form';
      case 'traditionalIRA':
            return 'Traditional IRA Contributions Form';
      case 'unreimbursedExpenses':
            return 'Unreimbursed Expenses Form';
      case 'charitableDonationSavings':
            return 'Charitable Donation Savings Form'
      case 'influencerOptimization':
            return 'Influencer Optimization Form'
      default:
        return '';
    }
  };

  return (
    <Container>
      <CssBaseline />
     {/* Botón para abrir el Drawer */} 
     <IconButton
  size="large"
  onClick={() => setDrawerOpen(true)}
  sx={{
    position: 'absolute',
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

      {/* Logo */}
      <Box sx={{ textAlign: 'center', my: 4, marginTop: 8, }}>
        <img
          src="https://tax.bryanglen.com/logo.png"
          alt="Logo"
          style={{ maxWidth: '350px' }}
        />
      </Box>

      {/* Contenedor principal */}
      <Box sx={{ my: 4, textAlign: 'center' }}>
        {formId && (
          <Typography variant="h4" gutterBottom sx={{ mt:4 , margin: '0px 0px 0.35em', fontFamily: 'Montserrat, sans-serif',  }}>
            {getFormTitle()}
          </Typography>
        )}

        {renderForm()}

        {formId && (

          <CustomSpeedDial />
        )}

{results && formId !== 'CancellationByInsolvencyForm' && formId !== 'BackdoorRothForm' && formId !== 'deferredCapitalGain' && formId !== 'ActiveRealEstateForm' && (
  <ResultsDisplay results={results} formTitle={getFormTitle()} />
)}


      </Box>
    </Container>
  );
};

export default Dashboard;