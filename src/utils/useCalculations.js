import {
  calculateNetIncome,
  calculateNetIncomeAugusta,
  calculateNetIncomeCRT,
  
  calculateNetIncomeKids,
  calculateReimbursment,
  calculateNetIncomeAmanda,
  calculateNetIncomeCostSegregation,
  calculateNetIncomeExemptionQualifiedSmall,
  calculateNetIncomeSavingsPlan,
  calculateNetIncomeEducationTaxCredit,
  calculateNetIncomeEducationAssistance,
  calculateNetIncomeHealthReimbursement,
  calculateNetIncomeIncomeShifting,
  calculateNetIncomeLifeInsurance,
  calculateNetIncomeMaximizeMiscellaneousExpenses,
  calculateNetIncomeMealsDeduction,
  calculateNetIncomeOperatingLosses,
  calcularNetIncomeSolo401k,
  calculateNetIncomeRothIRA,
  calculateNetIncomeHealthInsuranceDeduction,
  calculateNetIncomeHealthInsuranceDeduction2,
  calculateNetIncomeSimpleIra,
  calculateNetIncomeStartupCost,
  calculateNetIncomeStateTaxSavings,
  calculateNetIncomeTraditionalIRA,
  calculateNetIncomeUnreimbursedExpenses,
  calculateNetIncomeCharitableDonation,
  calculateNetIncomeInfluencer,
  calculateNetIncomeResearchAndDevelopmentCredit,
  calculateSEMedicare,
  calculateAGI,
  calculateAGI2y4,
  calculateTaxableIncome,
  calculateTaxableIncome2,
  calculateTaxableIncome1120S,
  calculateQBID,
  calculateTaxableIncome1040nr,
  getMarginalTaxRateAndLevel,
  getMarginalTaxRateAndLevel1120S,
  getMarginalTaxRateAndLevel1040nr,
  calculateTaxDue,
  calculateTaxDue1120S,
  calculateTaxDue1040nr,
  calculateAdditionalMedicare,
  calculateAdditionalMedicare2,
  getSelfEmploymentRate,
  calculateTaxDue2,
  getMarginalTaxRateAndLevel2,
  calculateNetIncomePrepaid,
  calculateNetIncomeFamily,
  calculateNetIncomeQOF,
  calculateNetIncomeHSA,
  calculateNIITThreshold,
  calculateNIITThreshold2,
  
  calculateNetIncomeAccountableplan,
  calculateNetIncomeAdoptionPlan
  
} from '../utils/calculations';
import { standardDeductions } from '../utils/taxData';

const useCalculations = () => {
  const performCalculations = ({
    filingStatus,
    grossIncome,
    deduction179,
    partnerType,
    averageMonthlyRent,
    daysOfRent,
    totalExpenses,
    totalNonPrepaidExpenses,
    hireKidsDeduction,
    hireFamilyDeduction,
    presentValue,
    tve,
    pbuv,
    reductionInNetIncome,
    calculationType = 'standard',
    hsac,
    ewhd,
    taxCreditsResults,
    totalReimbursableExpenses,
    capitalGainQSBS,
    deduction,
    totalEducationalAssistance,
    totalBenefits,
    totalIncomeShifted,
    totalNetDeductionMaxi,
    deductionMeals,
    formType,
    totalNOL,
    deductionSolo401k,
    totalContribution,
    incomeReduction,
    totalEmployerContribution,
    deductionStartup,
    totalDeductionTraditionalIRA,
    reductionUnreimbursed,
    deductionDonation,
    deductionInfluencer,
    QBID,
    dagi,
    
  }) => {
    // Calcular Net Income según el tipo de cálculo
    let netIncome;
    

    // Calcular Net Income según el tipo de cálculo
    switch (calculationType) {
      case 'augusta':
        netIncome = calculateNetIncomeAugusta(grossIncome, averageMonthlyRent, daysOfRent);
        break;
      case 'prepaid':
        netIncome = calculateNetIncomePrepaid(grossIncome, totalExpenses, totalNonPrepaidExpenses);
        break;
      case 'hireKids':
        netIncome = calculateNetIncomeKids(grossIncome, hireKidsDeduction);
        break;
      case 'hireFamily':
        netIncome = calculateNetIncomeFamily(grossIncome, hireFamilyDeduction);
        break;
      case 'qualifiedOpportunityFunds':
        netIncome = calculateNetIncomeQOF(grossIncome, reductionInNetIncome);
        break;
      case 'healthSavings':
        netIncome = calculateNetIncomeHSA(grossIncome, hsac, ewhd);
        break;
      case 'charitableRemainderTrust':
        netIncome = calculateNetIncomeCRT(grossIncome, presentValue);
        break;
      case 'reimbursment':
        netIncome = calculateReimbursment(grossIncome, tve, pbuv);
        break;
      case 'amendedPriorYears':
        netIncome = calculateNetIncomeAmanda(grossIncome);
        break;
      case 'exemptionQualifiedSmall':
        netIncome = calculateNetIncomeExemptionQualifiedSmall(grossIncome, capitalGainQSBS);
        break;
      case 'costSegregation':
        netIncome = calculateNetIncomeCostSegregation(grossIncome, deduction);
        break;
      case 'savingsPlan':
        netIncome = calculateNetIncomeSavingsPlan(grossIncome);
        break;
      case 'educationAssistance':
        netIncome = calculateNetIncomeEducationAssistance(grossIncome, totalEducationalAssistance);
        break;
      case 'accountablePlan':
          netIncome = calculateNetIncomeAccountableplan(grossIncome, totalReimbursableExpenses);
          break;
      case 'adoptionAndIra':
          netIncome = calculateNetIncomeAdoptionPlan(grossIncome);
          break;
      case 'educationTaxCredit':
        netIncome = calculateNetIncomeEducationTaxCredit(grossIncome);
        break;
      case 'healthReimbursement':
        netIncome = calculateNetIncomeHealthReimbursement(grossIncome, totalBenefits);
        break;
      case 'incomeShifting':
        netIncome = calculateNetIncomeIncomeShifting(grossIncome, totalIncomeShifted);
        break;
      case 'lifeInsurance':
        netIncome = calculateNetIncomeLifeInsurance(grossIncome);
        break;
      case 'maximizeMiscellaneousExpenses':
        netIncome = calculateNetIncomeMaximizeMiscellaneousExpenses(grossIncome, totalNetDeductionMaxi);
        break;
      case 'mealsDeduction':
        netIncome = calculateNetIncomeMealsDeduction(grossIncome, deductionMeals);
        break;
      case 'lossesDeduction':
        netIncome = calculateNetIncomeOperatingLosses(grossIncome, totalNOL);
        break;
      case 'solo401k':
        netIncome = calcularNetIncomeSolo401k(grossIncome, deductionSolo401k);
        break;
      case 'researchAndDevelopmentCredit':
        netIncome = calculateNetIncomeResearchAndDevelopmentCredit(grossIncome);
        break;
      case 'rothIRA':
        netIncome = calculateNetIncomeRothIRA(grossIncome);
        break;
      case 'healthInsuranceDeduction':
        netIncome = calculateNetIncomeHealthInsuranceDeduction(grossIncome, totalContribution, );
        break;
      case 'healthInsuranceDeduction2':
          netIncome = calculateNetIncomeHealthInsuranceDeduction2(grossIncome, incomeReduction );
        break;
      case 'simpleIRA':
          netIncome = calculateNetIncomeSimpleIra(grossIncome, totalEmployerContribution );
        break;
      case 'startupCostOptimization':
          netIncome = calculateNetIncomeStartupCost(grossIncome, deductionStartup );
        break;
      case 'stateTaxSavings':
          netIncome = calculateNetIncomeStateTaxSavings(grossIncome);
        break;
      case 'traditionalIRA':
          netIncome = calculateNetIncomeTraditionalIRA(grossIncome, totalDeductionTraditionalIRA);
        break;
      case 'unreimbursedExpenses':
          netIncome = calculateNetIncomeUnreimbursedExpenses(grossIncome, reductionUnreimbursed);
        break;
      case 'charitableDonationSavings':
          netIncome = calculateNetIncomeCharitableDonation(grossIncome, deductionDonation);
        break;
      case 'influencerOptimization':
          netIncome = calculateNetIncomeInfluencer(grossIncome, deductionInfluencer);
        break;
      case 'standard':
          netIncome = calculateNetIncome(grossIncome, deduction179);
        break;
    }
    console.log(`Selected Form Type: ${formType}`);

     //QBID 1040NR
     QBID = parseFloat(QBID) || 0;
     dagi = parseFloat(dagi) || 0; 

    
      // Cálculo para 1040CF/1065 1/3
      // Modify the calculation section for self-employment tax and related values
      
      const seSocialSecurity = partnerType === 'Active' ? Math.min(netIncome * 0.9235, 168600) * 0.124 : 
      formType === '1040 - Schedule C/F' ? Math.min(netIncome * 0.9235, 168600) * 0.124 : 0;
      const seMedicare = partnerType === 'Active' ? calculateSEMedicare(netIncome) : 
      formType === '1040 - Schedule C/F' ? calculateSEMedicare(netIncome) : 0;
      const selfEmploymentTax = partnerType === 'Active' ? seSocialSecurity + seMedicare : 
      formType === '1040 - Schedule C/F' ? seSocialSecurity + seMedicare : 0;
      const standardDeduction = standardDeductions[filingStatus];
      const agi = calculateAGI(netIncome, standardDeduction, dagi, selfEmploymentTax );
      const taxableIncome = calculateTaxableIncome(agi, filingStatus, dagi, formType ) - QBID;
      const { marginalRate, level } = getMarginalTaxRateAndLevel(filingStatus, taxableIncome);
      const taxDue = calculateTaxDue(filingStatus, taxableIncome);
      const taxCredits = taxCreditsResults || 0;
      const additionalMedicare = calculateAdditionalMedicare(filingStatus, netIncome);
      const selfEmploymentRate = partnerType === 'Active' ? getSelfEmploymentRate() : 
      formType === '1040 - Schedule C/F' ? getSelfEmploymentRate() : 0;
      const totalTaxDue = taxDue + selfEmploymentTax - taxCredits;
      //const totalTaxDue = taxDue + selfEmploymentTax + additionalMedicare;
      const effectiveTaxRate = taxableIncome !== 0 ? ((taxDue / taxableIncome) * 100).toFixed(2) : '0.00';
      const seDeduction = selfEmploymentTax / 2;
      

      // Resultados adicionales para cálculos alternativos 
      const seSocialSecurity2 = partnerType === 'Active' ? Math.min(grossIncome * 0.9235, 168600) * 0.124 : 0;
      const seMedicare2 = partnerType === 'Active' ? calculateSEMedicare(grossIncome) : 0;
      const selfEmploymentTax2 = partnerType === 'Active' ? seSocialSecurity2 + seMedicare2 : 0;
      const seDeduction2 = selfEmploymentTax2 / 2;
      const netIncome2 = grossIncome;
      const agi2 = netIncome2 - selfEmploymentTax2 / 2;
      const taxableIncome2 = calculateTaxableIncome2(agi2, filingStatus);
      const taxDue2 = calculateTaxDue2(filingStatus, taxableIncome2);
      const additionalMedicare2 = calculateAdditionalMedicare2(filingStatus, netIncome2);
      const totalTaxDue2 = taxDue2 + selfEmploymentTax2;
      const effectiveTaxRate2 = taxableIncome2 !== 0 ? ((taxDue2 / taxableIncome2) * 100).toFixed(2) : '0.00';
      const { marginalRate2, level2 } = getMarginalTaxRateAndLevel2(filingStatus, taxableIncome2);
      const effectiveSERate = netIncome > 0 ?  ((selfEmploymentTax / netIncome) * 100).toFixed(2) : '0.00';
      
       
     // Calcular NIIT Threshold
      const niitThreshold = calculateNIITThreshold(netIncome, filingStatus, partnerType);
      const niitThreshold2 = calculateNIITThreshold2(netIncome2, filingStatus, partnerType);
    

  
      // Cálculo para Corporations (1120)
      const corpTaxableIncome = netIncome;
      const corpTaxableIncome2 = netIncome2;
      const corpTaxDue = corpTaxableIncome * 0.21;
      const corpTaxDue2 = corpTaxableIncome2 * 0.21;
      const corpEffectiveTaxRate = corpTaxableIncome !== 0 ? ((corpTaxDue / corpTaxableIncome) * 100).toFixed(2) : '0.00';
      const effectiveSERate2 = netIncome2 > 0 ? ((selfEmploymentTax2 / netIncome2) * 100).toFixed(2) : '0.00';
      
      
     

      // calculos para el formulario 1120S/1040NR 2/4
     const agi1120S = netIncome;
     const AgiCalculation2y4 = calculateAGI2y4 (agi1120S, standardDeduction, dagi);
     const taxableIncome1120S = calculateTaxableIncome1120S(AgiCalculation2y4, filingStatus, dagi) - QBID;
     const taxDue1120S = calculateTaxDue1120S(filingStatus, taxableIncome1120S);
     const effectiveTaxRate1120S = taxableIncome1120S !== 0 ? ((taxDue1120S / taxableIncome1120S) * 100).toFixed(2) : '0.00';
     const {marginalRate1120s, level1120s } = getMarginalTaxRateAndLevel1120S(filingStatus, taxableIncome1120S);
     // calculos para 1040nr
     {/*const taxableincome1040nr = calculateTaxableIncome1040nr (agi, filingStatus, QBID);
     const taxDue1040nr = calculateTaxDue1040nr(filingStatus, taxableincome1040nr);
     const totalTaxDue1040nr = taxDue1040nr + selfEmploymentTax;
     const effectiveTaxRate1040nr = taxableincome1040nr !== 0 ? ((taxDue1040nr / taxableincome1040nr) * 100).toFixed(2) : '0.00';
     const {marginalRate1040nr, level1040nr } = getMarginalTaxRateAndLevel1040nr(filingStatus, taxableincome1040nr);*/}


       // Cálculos adicionales para el formulario 1065
    const taxableIncome1065 = calculateTaxableIncome1120S(agi1120S, filingStatus);
    const effectiveTaxRate1065 = taxableIncome1065 !== 0 ? ((taxDue1120S / taxableIncome1065) * 100).toFixed(2) : '0.00';

    
   

      return {
        netIncome,
        netIncome2,
        corpTaxableIncome2,
        selfEmploymentRate,
        corpTaxDue2,
        agi,
        agi2,
        agi1120S,
        AgiCalculation2y4,
        standardDeduction,
        taxableIncome,
        taxableIncome2,
        taxableIncome1120S,
        taxableIncome1065,
        marginalRate: (marginalRate * 100).toFixed(2),
        marginalRate1120s: (marginalRate1120s * 100).toFixed(2),
        incomeLevel: level,
        incomeLevel1120S: level1120s,
        taxDue,
        taxDue2,
        taxDue1120S,
        taxCredits,
        totalTaxDue,
        totalTaxDue2,
        marginalRate2: (marginalRate2 * 100).toFixed(2),
        incomeLevel2: level2,
        seSocialSecurity,
        seDeduction2,
        seMedicare,
        totalSE: selfEmploymentTax,
        totalSE2: selfEmploymentTax2,
        additionalMedicare,
        additionalMedicare2,
        corpTaxableIncome,
        corpTaxDue,
        effectiveTaxRate,
        effectiveTaxRate2,
        effectiveTaxRate1120S,
        effectiveTaxRate1065,
        corpEffectiveTaxRate,
        seDeduction,
        seSocialSecurity2,
        seMedicare2,
        selfEmploymentTax2,
        effectiveSERate,
        effectiveSERate2,
        niitThreshold,
        niitThreshold2,
        formType,  
        QBID, 
        dagi,
       };
    };
  
    return { performCalculations };
  };
  
  export default useCalculations;
  