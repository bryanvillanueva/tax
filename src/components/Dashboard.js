import React, { useState } from 'react';
import { Box, Typography, Fab, Container, CssBaseline } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
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
import HealthInsuranceDeductionForm from './HealthInsuranceDeductionForm';
import MaximizeMiscellaneousExpensesForm from './MaximizeMiscellaneousExpensesForm';
import HealthReimbursementArrangementForm from './HealthReimbursementArragementForm';
import HealthInsuranceDeductionForm2 from './HealthInsuranceDeductionForm2';
import NetOperatingLossesForm from './NetOperatingLossesForm';
import FormSelector from './FormSelector';


const Dashboard = () => {
  const [currentForm, setCurrentForm] = useState(null);
  const [results, setResults] = useState(null);

  const handleSelectForm = (form) => {
    setCurrentForm(form);
    setResults(null);
  };

  const handleBackToSelector = () => {
    setCurrentForm(null);
    setResults(null);
  };

  const renderForm = () => {
    switch (currentForm) {
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
      case 'healthInsuranceDeduction':
          return <HealthInsuranceDeductionForm onCalculate={setResults} />;
      case 'healthInsuranceDeduction2':
          return <HealthInsuranceDeductionForm2 onCalculate={setResults} />;
      case 'rothIRA':
          return <RothIRAForm onCalculate={setResults} />;
      case 'simpleIRA':
          return <SimpleIRAForm onCalculate={setResults} />;
      case 'startupCostOptimization':
            return <StartupCostOptimizationForm onCalculate={setResults} />;
      case 'stateTaxSavings':
            return <StateTaxSavingsForm onCalculate={setResults} />;
      default:
        return <FormSelector onSelectForm={handleSelectForm} />;
    }
  };

  const getFormTitle = () => {
    switch (currentForm) {
      case 'depreciation':
        return 'Depreciation Form';
      case 'augusta':
        return 'Augusta Rule Form';
      case 'prepaid':
        return 'Prepaid Expenses Form';
      case 'hireKids':
        return 'Hire Your Kids Form';
      case 'charitableRemainderTrust':
        return 'Charitable Remainder Form';
      case 'reimbursment':
        return 'Reimbursment of Personal Vehicle Form';
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
      case 'healthInsuranceDeduction':
          return 'Health Insurance Deduction Form';
      case 'healthInsuranceDeduction2':
          return 'Health Insurance Deduction Form (Est. 29)';
      case 'rothIRA':
          return 'Roth IRA Form';
      case 'simpleIRA':
            return 'Simple IRA Form';
      case 'startupCostOptimization':
            return 'Startup Cost Optimization Form';
      case 'stateTaxSavings':
            return 'State Tax Savings Form';
      default:
        return '';
    }
  };

  return (
    <Container>
      <CssBaseline />

      {/* Logo */}
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <img
          src="https://tax.bryanglen.com/logo.png"
          alt="Logo"
          style={{ maxWidth: '350px', marginBottom: '20px' }}
        />
      </Box>

      {/* Contenedor principal */}
      <Box sx={{ my: 4, textAlign: 'center' }}>
        {currentForm && (
          <Typography variant="h4" gutterBottom sx={{ mt:4 , margin: '0px 0px 0.35em', fontFamily: 'Montserrat, sans-serif',  }}>
            {getFormTitle()}
          </Typography>
        )}

        {renderForm()}

        {currentForm && (
          <Fab
            color="primary"
            aria-label="back"
            onClick={handleBackToSelector}
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
        )}

       {results && currentForm !== 'deferredCapitalGain' && <ResultsDisplay results={results} formTitle={getFormTitle()} />}

      </Box>
    </Container>
  );
};

export default Dashboard;