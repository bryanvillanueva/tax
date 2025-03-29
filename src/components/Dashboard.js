import React, { useState, useEffect } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  CssBaseline, 
  IconButton, 
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
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
import COVULForm from './COVULForm';
import DepletionDeductionForm from './DepletionDeductionForm';
import QualifiedDividendsForm from './QualifiedDividendsForm';
import DonorAdvisedFundForm from './DonorAdvisedFundForm';
import ElectricVehicleCreditsForm from './ElectricVehicleCreditsForm';
import ESOPForm from './ESOPForm';
import FederalSolarInvestmentTaxCreditForm from './FederalSolarInvestmentTaxCreditForm';
import FinancedInsuranceForm from './FinancedInsuranceForm';
import FinancedSoftwareLeasebackForm from './FinancedSoftwareLeasebackForm';
import ForeignEarnedIncomeExclusionForm from './ForeignEarnedIncomeExclusionForm';
import FormSelector from './FormSelector';
import GroupHealthInsuranceForm from './GroupHealthInsuranceForm';
import GroupingRelatedActivitiesForm from './GroupingRelatedActivitiesForm';
import HistoricalPreservationEasementForm from './HistoricalPreservationEasementForm';
import HomeOfficeDeductionForm from './HomeOfficeDeductionForm';
import InstallmentSaleForm from './InstallmentSaleForm';
import MaximizeItemizationForm from './MaximizeItemizationForm ';
import NoncashCharitableContributionsForm from './NoncashCharitableContributionsForm ';
import OilAndGasDrillingCostForm from './OilAndGasDrillingCostForm';
import OilAndGasMLPForm from './OilAndGasMLPForm';
import OrdinaryLossOnWorthlessStockForm from './OrdinaryLossOnWorthlessStockForm';  
import RealEstateDevelopmentCharitableOptionForm from './RealEstateDevelopmentCharitableOptionForm';
import RestrictedStockUnitsForm from './RestrictedStockUnitsForm';
import RetireePlanningForm from './RetireePlanningForm';
import SCorpRevocationForm from './SCorpRevocationForm';
import SecureAct20StrategiesForm from './SecureAct20StrategiesForm';
import SeriesIBondForm from './SeriesIBondForm';
import ShortTermRentalForm from './ShortTermRentalForm';
import BonusDepreciationForm from './BonusDepreciationForm';
import SolarPassiveInvestmentForm from './SolarPassiveInvestmentForm';
import TaxFreeIncomeForm from './TaxFreeIncomeForm';
import WorkOpportunityTaxCreditForm from './WorkOpportunityTaxCreditForm';
import ExchangeOnRealEstateForm from './ExchangeOnRealEstateForm';
import DefinedBenefitPlanForm from './DefinedBenefitPlanForm';
import StructuredInvestmentProgramForm from './StructuredInvestmentProgramForm';
import CustomSpeedDial from './CustomSpeedDial';
import CustomAppBar from './CustomAppBar';
import CustomDrawer from './CustomDrawer';

import axios from 'axios';
import PassThroughEntity from './PassThroughEntity';
import PassiveLossAndPigs from './PassiveLossAndPigs';
import PrimarySaleExclusion from './PrimarySaleExclusion';
import PrivateFamilyFoundation from './PrivateFamilyFoundation';
import QualifiedCharitableDistributions from './QualifiedCharitableDistributions';
import CollegeStudentStrategiesForm from './CollegeStudentStrategiesForm';
import SellHomeToSCorpForm from './SellHomeToSCorpForm';
import GiftingStockStrategyForm from './GiftingStockStrategyForm';
import RealEstateOptionsForm from './RealEstateOptionsForm';
import MarriedFilingSeparateForm from './MarriedFilingSeparateForm';
import IndividualPlanningIdeasForm from './IndividualPlanningIdeasForm';
import NetInvestmentIncomeTaxForm from './NetInvestmentIncomeTaxForm';
import MiscTaxCreditsForm from './MiscTaxCreditsForm';
import RentalStrategies754ElectionForm from './RentalStrategies754ElectionForm';
import SelfDirectedIRA401KForm from './SelfDirectedIRA401KForm';
import DayTraderTaxStatusForm from './DayTraderTaxStatusForm';
import ChoiceOfEntityForm from './ChoiceOfEntityForm';
import ChoiceOfEntityCCorpForm from './ChoiceOfEntityCCorpForm';
import ChoiceOfEntityPartnershipForm from './ChoiceOfEntityPartnershipForm';
import ChoiceOfEntitySCorpForm from './ChoiceOfEntitySCorpForm';
import ReasonableCompAnalysisForm from './ReasonableCompAnalysisForm';
import RealEstateProfessionalForm from './RealEstateProfessionalForm';
import CaptiveInsuranceForm from './CaptiveInsuranceForm';
import CharitableLLCForm from './CharitableLLCForm';
import SoleProprietorForm from './SoleProprietorForm';

const Dashboard = () => {
  const { formId } = useParams(); // Obtiene el formId de la URL
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [userData, setUserData] = useState(null); 
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
   
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
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error al validar el token:', error.message);
        localStorage.removeItem('authToken');
        navigate('/');
      }
    };

    validateToken();
  }, [navigate]);

  // Reiniciar resultados cuando cambia el formulario
  useEffect(() => {
    setResults(null);
  }, [formId]);

  // Detectar scroll para mostrar la barra de búsqueda en el AppBar en FormSelector
  useEffect(() => {
    // Solo activar este efecto si estamos en la página de FormSelector
    if (!formId) {
      const handleScroll = () => {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        const shouldShowSearch = scrollPosition > 200; // Mostrar después de 200px de scroll
        
        if (shouldShowSearch !== showSearch) {
          setShowSearch(shouldShowSearch);
        }
      };
      
      // Uso de requestAnimationFrame para optimizar el rendimiento
      let ticking = false;
      const scrollListener = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      };
      
      window.addEventListener('scroll', scrollListener, { passive: true });
      return () => {
        window.removeEventListener('scroll', scrollListener);
      };
    } else {
      // Si no estamos en FormSelector, asegurarse de que showSearch es false
      setShowSearch(false);
    }
  }, [formId, showSearch]);

  // Pasar el searchTerm al FormSelector cuando se renderiza
  useEffect(() => {
    if (!formId && document.getElementById('form-selector-search-input')) {
      const inputElement = document.getElementById('form-selector-search-input');
      if (inputElement.value !== searchTerm) {
        inputElement.value = searchTerm;
        // Disparar un evento de cambio para que React actualice el estado interno del FormSelector
        const event = new Event('input', { bubbles: true });
        inputElement.dispatchEvent(event);
      }
    }
  }, [formId, searchTerm]);

  const handleSelectForm = (form) => {
    navigate(`/form-selector/${form}`);
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
      case 'Covul':
          return <COVULForm onCalculate={setResults} />;
      case 'DepletionDeduction':
          return <DepletionDeductionForm onCalculate={setResults} />;
      case 'QualifiedDividends':
          return <QualifiedDividendsForm onCalculate={setResults} />;
      case 'DonorAdvisedFund':
          return <DonorAdvisedFundForm onCalculate={setResults} />;
      case 'ElectricVehicleCredits':
          return <ElectricVehicleCreditsForm onCalculate={setResults} />;
      case 'ESOP':
          return <ESOPForm onCalculate={setResults} />;
      case 'FederalSolarInvestmentTaxCredit':
          return <FederalSolarInvestmentTaxCreditForm onCalculate={setResults} />;
      case 'FinancedInsurance':
          return <FinancedInsuranceForm onCalculate={setResults} />;
      case 'FinancedSoftwareLeaseback':
          return <FinancedSoftwareLeasebackForm onCalculate={setResults} />;
      case 'ForeignEarnedIncomeExclusion':
          return <ForeignEarnedIncomeExclusionForm onCalculate={setResults} />;
      case 'GroupHealthInsurance':
          return <GroupHealthInsuranceForm onCalculate={setResults} />;
      case 'GroupingRelatedActivities':
          return <GroupingRelatedActivitiesForm onCalculate={setResults} />;
      case 'HistoricalPreservationEasement':
          return <HistoricalPreservationEasementForm onCalculate={setResults} />;
      case 'HomeOfficeDeduction':
          return <HomeOfficeDeductionForm onCalculate={setResults} />;
      case 'InstallmentSale':
          return <InstallmentSaleForm onCalculate={setResults} />;
      case 'MaximizeItemization':
          return <MaximizeItemizationForm onCalculate={setResults} />;
      case 'NoncashCharitableContributions':
          return <NoncashCharitableContributionsForm onCalculate={setResults} />;
      case 'OilAndGasDrillingCost':
          return <OilAndGasDrillingCostForm onCalculate={setResults} />;
      case 'OilAndGasMLP':
          return <OilAndGasMLPForm onCalculate={setResults} />;
      case 'OrdinaryLossOnWorthlessStock':
          return <OrdinaryLossOnWorthlessStockForm onCalculate={setResults} />;
      case 'passThroughEntity':
          return <PassThroughEntity onCalculate={setResults} />;
      case 'passiveLossAndPigs':
          return <PassiveLossAndPigs onCalculate={setResults} />;
      case 'primarySaleExclusion':
          return <PrimarySaleExclusion onCalculate={setResults} />;
      case 'privateFamilyFoundation':
          return <PrivateFamilyFoundation onCalculate={setResults} />;
      case 'qualifiedCharitableDistributions':
          return <QualifiedCharitableDistributions onCalculate={setResults} />;
      case 'RealEstateDevelopmentCharitable':
          return <RealEstateDevelopmentCharitableOptionForm onCalculate={setResults} />;
      case 'RestrictedStockUnits':
          return <RestrictedStockUnitsForm onCalculate={setResults} />;
      case 'RetireePlanning':
          return <RetireePlanningForm onCalculate={setResults} />;
      case 'SCorpRevocation':
          return <SCorpRevocationForm onCalculate={setResults} />;
      case 'SecureAct20Strategies':
          return <SecureAct20StrategiesForm onCalculate={setResults} />; 
      case 'seriesIBond':
          return <SeriesIBondForm onCalculate={setResults} />;
      case 'shortTermRental':
          return <ShortTermRentalForm onCalculate={setResults} />;
      case 'bonusDepreciation':
          return <BonusDepreciationForm onCalculate={setResults} />;
      case 'solarPassiveInvestment':
          return <SolarPassiveInvestmentForm onCalculate={setResults} />;
      case 'taxFreeIncome':
          return <TaxFreeIncomeForm onCalculate={setResults} />;
      case 'workOpportunityTaxCredit':
          return <WorkOpportunityTaxCreditForm onCalculate={setResults} />;
      case '1031Exchange':
          return <ExchangeOnRealEstateForm onCalculate={setResults} />;
      case 'definedBenefitPlan':
          return <DefinedBenefitPlanForm onCalculate={setResults} />;
      case 'structuredInvestmentProgram':
          return <StructuredInvestmentProgramForm onCalculate={setResults} />;
      case 'selfDirectedIRA401K':
          return <SelfDirectedIRA401KForm onCalculate={setResults} />;
      case 'dayTraderTaxStatus':
          return <DayTraderTaxStatusForm onCalculate={setResults} />;
      case 'collegeStudentStrategies':
          return <CollegeStudentStrategiesForm onCalculate={setResults} />;
      case 'sellHomeToSCorp':
          return <SellHomeToSCorpForm onCalculate={setResults} />;
      case 'giftingStockStrategy':
          return <GiftingStockStrategyForm onCalculate={setResults} />;
      case 'realEstateOptions':
          return <RealEstateOptionsForm onCalculate={setResults} />;
      case 'marriedFilingSeparate':
          return <MarriedFilingSeparateForm onCalculate={setResults} />;
      case 'individualPlanningIdeas':
          return <IndividualPlanningIdeasForm onCalculate={setResults} />;
      case 'netInvestmentIncomeTax':
          return <NetInvestmentIncomeTaxForm onCalculate={setResults} />;
      case 'miscTaxCredits':
          return <MiscTaxCreditsForm onCalculate={setResults} />;
      case 'rentalStrategies754Election':
         return <RentalStrategies754ElectionForm onCalculate={setResults} />;
      case 'ReasonableCompAnalysis':
          return <ReasonableCompAnalysisForm onCalculate={setResults} />;
      case 'RealEstateProfessional':
          return <RealEstateProfessionalForm onCalculate={setResults} />;
      case 'CaptiveInsurance':
          return <CaptiveInsuranceForm onCalculate={setResults} />;
      case 'CharitableLLC':
          return <CharitableLLCForm onCalculate={setResults} />;
      case 'SoleProprietor':
          return <SoleProprietorForm onCalculate={setResults} />;
      case 'ChoiceOfEntity':
          return <ChoiceOfEntityForm onCalculate={setResults} />;
      case 'ChoiceOfEntityCCorp':
          return <ChoiceOfEntityCCorpForm onCalculate={setResults} />;
      case 'ChoiceOfEntityPartnership':
          return <ChoiceOfEntityPartnershipForm onCalculate={setResults} />;
      case 'ChoiceOfEntitySCorp':
          return <ChoiceOfEntitySCorpForm onCalculate={setResults} />;
      default:
        return <FormSelector onSelectForm={handleSelectForm} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
    }
  };

  const getFormTitle = () => {
    switch (formId) {
      case 'depreciation':
        return 'Accelerated Depreciation (Section 179)';
      case 'augusta':
        return 'Augusta Rule';
      case 'prepaid':
        return 'Prepaid Expenses';
      case 'hireKids':
        return 'Hire Your Kids';
      case 'charitableRemainderTrust':
        return 'Charitable Remainder Trust';
      case 'reimbursment':
        return 'Reimbursment Of Personal Vehicle';
      case 'hireFamily':
        return 'Hire Your Family';
      case 'qualifiedOpportunityFunds':
        return 'Qualified Opportunity Funds';
      case 'healthSavings':
        return 'Health Savings Account';
      case 'lifetimeLearningCredit':
        return 'Lifetime Learning Credit';
      case 'amendedPriorYears':
        return 'Amended Prior Year';
      case 'exemptionQualifiedSmall':
        return 'Exemption Qualified Small Business Stock ';
      case 'costSegregation':
        return 'Cost Segregation';
      case 'savingsPlan':
        return '529 Savings Plan';
      case 'educationAssistance':
        return 'Education Assistance';
      case 'educationTaxCredit':
        return 'Education Tax Credit ';
      case 'accountableplanform':
        return 'Accountable Plan';
      case 'adoptionincentiveform':
        return 'Adoption Incentive';
      case 'deferredCapitalGain':
          return 'Deferred Capital Gain';
      case 'healthReimbursement':
          return 'Health Reimbursement Arrangement';
      case 'incomeShifting':
          return 'Income Shifting';
      case 'lifeInsurance':
          return 'Life Insurance ';
      case 'maximizeMiscellaneousExpenses':
          return 'Maximize Miscellaneous Expenses';
      case 'mealsDeduction':
          return 'Meals Deduction';
      case 'lossesDeduction':
          return 'Net Operating Losses (NOL)';
      case 'solo401k':
          return 'Solo 401(k)';
      case 'researchAndDevelopmentCredit':
          return 'Research & Development Credit';
      case 'sepContributions':
          return 'SEP Contributions ';
      case 'healthInsuranceDeduction2':
          return 'Health Insurance Deduction';
      case 'rothIRA':
          return 'Roth IRA';
      case 'ActiveRealEstateForm':
          return 'Active Real Estate';
      case 'BackdoorRothForm':
          return 'Back Door Roth ';
      case 'CancellationByInsolvencyForm':
          return 'Cancellation Of Debt Income By Insolvency ';
      case 'simpleIRA':
          return 'Simple IRA';
      case 'startupCostOptimization':
          return 'Startup Cost Optimization';
      case 'stateTaxSavings':
          return 'State Tax Savings';
      case 'traditionalIRA':
          return 'Traditional IRA Contributions';
      case 'unreimbursedExpenses':
          return 'Unreimbursed Expenses';
      case 'charitableDonationSavings':
          return 'Charitable Donation Savings'
      case 'influencerOptimization':
          return 'Influencer Optimization';
      case 'Covul':
          return 'Corporate-Owned Variable Universal Life (COVUL)';
      case 'DepletionDeduction':
          return 'Depletion Deduction For Royalties ';
      case 'QualifiedDividends':
          return 'Dividends';
      case 'DonorAdvisedFund':
          return 'Donor Advised Fund';
      case 'ElectricVehicleCredits':
          return 'Electric Vehicle Credits';
      case 'ESOP':
          return 'Employee Stock Ownership Plan (ESOP)';
      case 'FederalSolarInvestmentTaxCredit':
          return 'Federal Solar Investment Tax Credit';
      case 'FinancedInsurance':
          return 'Financed Insurance For Business Risks';
      case 'FinancedSoftwareLeaseback':
          return 'Financed Software Leaseback';
      case 'ForeignEarnedIncomeExclusion':
          return 'Foreign Earned Income Exclusion';
      case 'GroupHealthInsurance':
          return 'Group Health Insurance';
      case 'GroupingRelatedActivities':
          return 'Grouping Related Activities - Section 469';
      case 'HistoricalPreservationEasement':
          return 'Historical Preservation Easement';
      case 'HomeOfficeDeduction':
          return 'Home Office Deduction';
      case 'InstallmentSale':
          return 'Installment Sale';
      case 'MaximizeItemization':
          return 'Maximize Itemization Strategies';
      case 'NoncashCharitableContributions':
          return 'Noncash Charitable Contributions Of Unused Goods';
      case 'OilAndGasDrillingCost':
          return 'Oil And Gas - Drilling Cost';
      case 'OilAndGasMLP':
          return 'Oil And Gas - Master Limited Partnership (MLP)';
      case 'OrdinaryLossOnWorthlessStock':
          return 'Ordinary Loss on Worthless Stock';
      case 'passThroughEntity':
          return 'Pass-Through Entity';
      case 'passiveLossAndPigs':
          return 'Passive Loss And PIGs';
      case 'primarySaleExclusion':
          return 'Primary Sale Exclusion';
      case 'privateFamilyFoundation':
          return 'Private Family Foundation ';
      case 'qualifiedCharitableDistributions':
          return 'Qualified Charitable Distributions';
      case 'RealEstateDevelopmentCharitable':
          return 'Real Estate Development Charitable';
      case 'RestrictedStockUnits':
          return 'Restricted Stock Units';
      case 'RetireePlanning':
          return 'Retiree Planning';
      case 'SCorpRevocation':
          return 'S-Corp Revocation';
      case 'SecureAct20Strategies':
          return 'Secure Act 20 Strategies';
      case 'seriesIBond':
          return 'Series I Bond';
      case 'shortTermRental':
          return 'Short-Term Rental';
      case 'bonusDepreciation':
          return 'Bonus Depreciation';
      case 'solarPassiveInvestment':
          return 'Solar Passive Investment';
      case 'taxFreeIncome':
          return 'Tax-Free Income';
      case 'workOpportunityTaxCredit':
          return 'Work Opportunity Tax Credit';
      case '1031Exchange':
          return '1031 Exchange';
      case 'definedBenefitPlan':
          return 'Defined Benefit Plan';
      case 'structuredInvestmentProgram':
          return 'Structured Investment Program';
      case 'selfDirectedIRA401K':
          return 'Self-Directed IRA & 401K';
      case 'dayTraderTaxStatus':
          return 'Day Trader Tax Status';
      case 'collegeStudentStrategies':
          return 'College Student Strategies';
      case 'sellHomeToSCorp':
          return 'Sell Home to S-Corp';
      case 'giftingStockStrategy':
          return 'Gifting Stock Strategy';
      case 'realEstateOptions':
          return 'Real Estate Options';
      case 'marriedFilingSeparate':
          return 'Married Filing Separate';
      case 'individualPlanningIdeas':
          return 'Individual Planning Ideas';
      case 'netInvestmentIncomeTax':
          return 'Net Investment Income Tax';
      case 'miscTaxCredits':
          return 'Miscellaneous Tax Credits';
      case 'rentalStrategies754Election':
          return 'Rental Strategies & 754 Election';
      case 'ReasonableCompAnalysis':
          return 'Reasonable Comp Analysis for Owners of Corporations';
      case 'RealEstateProfessional':
          return 'Real Estate Professional';
      case 'CaptiveInsurance':
          return 'Captive Insurance';
      case 'CharitableLLC':
          return 'Charitable LLC';
      case 'SoleProprietor':
          return 'Choice of Entity - Sole Proprietor Sch C';
      case 'ChoiceOfEntity':
          return 'Choice of Entity - Overview & Analysis';
      case 'ChoiceOfEntityCCorp':
          return 'Choice of Entity - C Corporation';
      case 'ChoiceOfEntityPartnership':
          return 'Choice of Entity - Partnership';
      case 'ChoiceOfEntitySCorp':
          return 'Choice of Entity - S Corporation';
      default:
        return '';
    }
  };

  return (
    <>
      <CssBaseline />
      
      {/* AppBar mejorado con borde inferior suave */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: '#fff',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          zIndex: 1300,
          height: '70px',
        }}
      >
        <Toolbar>
          <CustomAppBar 
            userData={userData} 
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            showSearch={showSearch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </Toolbar>
      </AppBar>
      
      {/* Drawer component */}
      <CustomDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        userData={userData}
      />

      {/* Contenido principal con fondo degradado */}
      <Box 
        sx={{ 
          backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #eef1f5 100%)',
          minHeight: '100vh',
          pt: { xs: 10, sm: 12 },
          pb: 8,
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Container maxWidth="lg">
          {/* Logo con animación suave */}
          <Box 
            sx={{ 
              textAlign: 'center',
              my: 4, 
              position: 'relative',
              zIndex: 4,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <img
              src="https://tax.bryanglen.com/logo.png"
              alt="Logo"
              style={{ 
                maxWidth: isMobile ? '250px' : '300px',
                filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))'
              }}
            />
          </Box>
          
          {/* Contenedor principal con tarjeta */}
          {!formId && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              {renderForm()}
            </Box>
          )}
          
          {formId && (
            <Paper
              elevation={0}
              sx={{
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                backgroundColor: '#fff',
                mt: 4
              }}
            >
              <Box 
                sx={{
                  backgroundColor: '#0858e6',
                  backgroundImage: 'linear-gradient(135deg, #0858e6 0%, #4481eb 100%)',
                  padding: { xs: '24px', sm: '32px' },
                  position: 'relative',
                  color: 'white',
                  overflow: 'hidden',
                  textAlign: 'center',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width=\'100%\' height=\'100%\' viewBox=\'0 0 800 800\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' stroke=\'%23ffffff\' stroke-opacity=\'0.1\' stroke-width=\'1\'%3E%3Cpath d=\'M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63\'/%3E%3Cpath d=\'M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764\'/%3E%3Cpath d=\'M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880\'/%3E%3C/g%3E%3C/svg%3E")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.2,
                  }
                }}
              >
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    letterSpacing: '0.5px', 
                    position: 'relative', 
                    zIndex: 1,
                    fontSize: { xs: '1.75rem', sm: '2.125rem' },
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  {getFormTitle()}
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  p: { xs: 2, sm: 3, md: 4 },
                  backgroundColor: '#fff'
                }}
              >
                {renderForm()}
              </Box>
              
              {results && (
                <Box 
                  sx={{ 
                    borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                    p: { xs: 2, sm: 3, md: 4 },
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  <ResultsDisplay results={results} formTitle={getFormTitle()} />
                </Box>
              )}
            </Paper>
          )}
          
          {formId && <CustomSpeedDial />}
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;