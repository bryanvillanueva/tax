import {
  calculateNetIncome,
  calculateNetIncomeAugusta,
  calculateNetIncomeCRT,
  calcualteNetIncomeLifeTimeLearningCredit,
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
  calculateNetIncomeCovul,
  calculateNetIncomeDepletionDeduction,
  calculateNetIncomeQualifiedDividends,
  calculateNetIncomeDonorAdvisedFund,
  calculateNetIncomeElectricVehicleCredits,
  calculateNetIncomeEmployeeStockOwnershipPlan,
  calculateNetIncomeFederalSolarInvestmentTaxCredit,
  calculateNetIncomeResearchAndDevelopmentCredit,
  calculateNetIncomeGroupHealthInsurance,
  calculateNetIncomeGroupingRelatedActivities,
  calculateNetIncomeHomeOfficeDeduction,
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
  calcularNIITInvestIncome,
  calcularNIITInvestIncome2,
  calculateNetIncomeCapital,
  calculateNetIncomeAccountableplan,
  calculateNetIncomeAdoptionPlan,
  calculateNetIncomeCancellationByInsolvency,
  calculateNetIncomeActiveRealEstate,
  calculateNetIncomeBackdoorRoth,
  calculateNetIncomeFinancedInsurance,
  calculateNetIncomeFinancedSoftware,
  calculateNetIncomeForeignEarnedIncome,
  calculateNetIncomeHistoricalPreservationEasement,
  calculateNetIncomeInstallmentSale,
  calculateNetIncomeMaximizeItemization,
  calculateNetIncomeNoncashCharitableContributions,
  calculateNetIncomeOilAndGasDrillingCost,
  calculateNetIncomeOilAndGasMLP,
  calculateNetIncomeOrdinaryLossOnWorthlessStock,
  calculateNetIncomePassThroughEntity,
  calculateNetIncomePassiveLossAndPigs,
  calculateNetIncomePrimarySaleExclusion,
  calculateNetIncomePrivateFamilyFoundation,
  calculateNetIncomeQualifiedCharitableDistributions,
  calculateNetIncomeRealEstateDevelopmentCharitable,
  calculateNetIncomeRestrictedStockUnits,
  calculateNetIncomeRetireePlanning,
  calculateNetIncomeSCorpRevocation,
  calculateNetIncomeSecureAct20Strategies,
  calculateNetIncomeSeriesIBond,
  calculateNetIncomeShortTermRental,
  calculateNetIncomeBonusDepreciation,
  calculateNetIncomeSolarPassiveInvestment,
  calculateNetIncomeTaxFreeIncome,
  calculateNetIncomeWorkOpportunityTaxCredit,
  calculateNetIncome1031Exchange,   
  calculateNetIncomeDefinedBenefitPlan,
  calculateNetIncomeStructuredInvestmentProgram,



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
    tve,
    pbuv,
    reductionInNetIncome,
    calculationType = 'standard',
    hsaContribution,
    taxCreditsResults,
    totalReimbursableExpenses,
    capitalGainQSBS,
    deduction,
    deductionCancellation,
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
    deductionInfluencer,
    QBID,
    dagi,
    dagi2,
    partOfInvestmentIncome,
    yearDepletion,
    sharesValueContributed,
    financedDeduction,
    softwareLeasebackDeduction,
    foreignDeduction,
    groupHealthInsuranceDeduction,
    homeOfficeDeduction,
    installmentSaleDeduction,
    oilAndGasDrillingCostDeduction,
    ordinaryLossDeduction,
    totalDeductionQCDS,
    bonusDepreciationDeduction, 
    SPID,
    workOpportunityTaxCreditDeduction,
    structuredInvestmentProgramDeduction,
    
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
        netIncome = calculateNetIncomeHSA(grossIncome, hsaContribution);
        break;
      case 'lifetimeLearningCredit':
        netIncome = calcualteNetIncomeLifeTimeLearningCredit(grossIncome);
        break;
      case 'charitableRemainderTrust':
        netIncome = calculateNetIncomeCRT(grossIncome);
        break;
      case 'reimbursment':
        netIncome = calculateReimbursment(grossIncome, tve, pbuv);
        break;
      case 'amendedPriorYears':
        netIncome = calculateNetIncomeAmanda(grossIncome);
        break;
      case 'exemptionQualifiedSmall':
        netIncome = calculateNetIncomeExemptionQualifiedSmall(grossIncome);
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
      case 'sepContributions':
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
          netIncome = calculateNetIncomeCharitableDonation(grossIncome);
        break;
      case 'influencerOptimization':
          netIncome = calculateNetIncomeInfluencer(grossIncome, deductionInfluencer);
        break;
      case 'CancellationByInsolvency':
          netIncome = calculateNetIncomeCancellationByInsolvency(grossIncome, deductionCancellation);
        break;
      case 'ActiveRealEstate':
          netIncome = calculateNetIncomeActiveRealEstate(grossIncome);
        break;
      case 'BackdoorRoth':
          netIncome = calculateNetIncomeBackdoorRoth(grossIncome);
        break;
      case 'deferredCapitalGain':
          netIncome = calculateNetIncomeCapital(grossIncome);
        break;
      case 'Covul':
          netIncome = calculateNetIncomeCovul(grossIncome);
        break;
      case 'DepletionDeduction':
          netIncome = calculateNetIncomeDepletionDeduction(grossIncome, yearDepletion );
        break;
      case 'QualifiedDividends':
          netIncome = calculateNetIncomeQualifiedDividends(grossIncome );
        break;
      case 'DonorAdvisedFund':
          netIncome = calculateNetIncomeDonorAdvisedFund(grossIncome );
        break;
      case 'ElectricVehicleCredits':
          netIncome = calculateNetIncomeElectricVehicleCredits(grossIncome );
        break;
      case 'ESOP':
          netIncome = calculateNetIncomeEmployeeStockOwnershipPlan(grossIncome, sharesValueContributed );
        break;
      case 'FederalSolarInvestmentTaxCredit':
          netIncome = calculateNetIncomeFederalSolarInvestmentTaxCredit(grossIncome );
        break;
      case 'FinancedInsurance':
          netIncome = calculateNetIncomeFinancedInsurance (grossIncome, financedDeduction); 
        break;
      case 'FinancedSoftwareLeaseback':
          netIncome = calculateNetIncomeFinancedSoftware (grossIncome, softwareLeasebackDeduction);
        break;  
      case 'ForeignEarnedIncomeExclusion':
          netIncome = calculateNetIncomeForeignEarnedIncome (grossIncome, foreignDeduction);
        break;   
      case 'GroupHealthInsurance':
          netIncome = calculateNetIncomeGroupHealthInsurance (grossIncome, groupHealthInsuranceDeduction);
        break;   
      case 'GroupingRelatedActivities':
          netIncome = calculateNetIncomeGroupingRelatedActivities (grossIncome);
        break;   
      case 'HomeOfficeDeduction':
          netIncome = calculateNetIncomeHomeOfficeDeduction (grossIncome, homeOfficeDeduction);
        break;   
      case 'HistoricalPreservationEasement':
          netIncome = calculateNetIncomeHistoricalPreservationEasement (grossIncome);
        break;  
      case 'InstallmentSale':
          netIncome = calculateNetIncomeInstallmentSale (grossIncome, installmentSaleDeduction);
        break;  
      case 'MaximizeItemization':
          netIncome = calculateNetIncomeMaximizeItemization (grossIncome);
        break;  
      case 'NoncashCharitableContributions':
          netIncome = calculateNetIncomeNoncashCharitableContributions (grossIncome);
        break;
      case 'OilAndGasDrillingCost':
          netIncome = calculateNetIncomeOilAndGasDrillingCost (grossIncome, oilAndGasDrillingCostDeduction );
        break;
      case 'OilAndGasMLP':
          netIncome = calculateNetIncomeOilAndGasMLP (grossIncome);
        break;
      case 'OrdinaryLossOnWorthlessStock':
          netIncome = calculateNetIncomeOrdinaryLossOnWorthlessStock (grossIncome, ordinaryLossDeduction);
        break;
      case 'passThroughEntity':
          netIncome = calculateNetIncomePassThroughEntity(grossIncome);
        break;
      case 'passiveLossAndPigs':
        netIncome = calculateNetIncomePassiveLossAndPigs(grossIncome);
        break;
      case 'primarySaleExclusion':
        netIncome = calculateNetIncomePrimarySaleExclusion(grossIncome);
        break;
      case 'privateFamilyFoundation':
        netIncome = calculateNetIncomePrivateFamilyFoundation(grossIncome);
        break;
      case 'qualifiedCharitableDistributions':
        netIncome = calculateNetIncomeQualifiedCharitableDistributions(grossIncome, totalDeductionQCDS);
        break;
        case 'standard':
      case 'RealEstateDevelopmentCharitable':
          netIncome = calculateNetIncomeRealEstateDevelopmentCharitable(grossIncome);
        break;
      case 'RestrictedStockUnits':
          netIncome = calculateNetIncomeRestrictedStockUnits(grossIncome);
        break;
      case 'RetireePlanning':
          netIncome = calculateNetIncomeRetireePlanning(grossIncome);
        break;
      case 'SCorpRevocation':
          netIncome = calculateNetIncomeSCorpRevocation(grossIncome);
        break;
      case 'SecureAct20Strategies':
          netIncome = calculateNetIncomeSecureAct20Strategies(grossIncome);
        break;
      case 'SeriesIBond':
          netIncome = calculateNetIncomeSeriesIBond(grossIncome);
        break;
      case 'ShortTermRental':
          netIncome = calculateNetIncomeShortTermRental(grossIncome);
        break;
      case 'BonusDepreciation':
          netIncome = calculateNetIncomeBonusDepreciation(grossIncome, bonusDepreciationDeduction);
        break;
      case 'SolarPassiveInvestment':
          netIncome = calculateNetIncomeSolarPassiveInvestment(grossIncome, SPID);
        break;
      case 'TaxFreeIncome':
          netIncome = calculateNetIncomeTaxFreeIncome(grossIncome);
        break;
      case 'WorkOpportunityTaxCredit':
          netIncome = calculateNetIncomeWorkOpportunityTaxCredit(grossIncome, workOpportunityTaxCreditDeduction);
        break;
      case '1031Exchange':
          netIncome = calculateNetIncome1031Exchange(grossIncome);
        break;
      case 'DefinedBenefitPlan':
          netIncome = calculateNetIncomeDefinedBenefitPlan(grossIncome);
        break;
      case 'StructuredInvestmentProgram':
          netIncome = calculateNetIncomeStructuredInvestmentProgram(grossIncome, structuredInvestmentProgramDeduction);
        break;
          case 'standard':
          netIncome = calculateNetIncome(grossIncome, deduction179);
        break;
    }
    console.log(`Selected Form Type: ${formType}`);

     //QBID 1040NR
     QBID = parseFloat(QBID) || 0;
     dagi = parseFloat(dagi) || 0; // elige el valor mas alto entre dagi y standardeduction
     dagi2 = parseFloat(dagi2) || 0; // resta dagi al agi
     partOfInvestmentIncome = parseFloat(partOfInvestmentIncome) || 0;

    
      // Cálculo para 1040CF/1065 1/3
      // Modify the calculation section for self-employment tax and related values
      
      const seSocialSecurity = partnerType === 'Active' ? Math.min(netIncome * 0.9235, 160200) * 0.124 : 
      formType === '1040 - Schedule C/F' ? Math.min(netIncome * 0.9235, 160200) * 0.124 : 0;
      const seMedicare = partnerType === 'Active' ? calculateSEMedicare(netIncome) : 
      formType === '1040 - Schedule C/F' ? calculateSEMedicare(netIncome) : 0;
      const selfEmploymentTax = partnerType === 'Active' ? seSocialSecurity + seMedicare : 
      formType === '1040 - Schedule C/F' ? seSocialSecurity + seMedicare : 0;
      const standardDeduction = standardDeductions[filingStatus];
      const agi = calculateAGI(netIncome, standardDeduction, selfEmploymentTax);
      const taxableIncome = calculateTaxableIncome(agi, filingStatus, dagi, dagi2, formType ) - QBID;
      const { marginalRate, level } = getMarginalTaxRateAndLevel(filingStatus, taxableIncome);
      const taxDue = calculateTaxDue(filingStatus, taxableIncome);
      const taxCredits = taxCreditsResults || 0;
      const additionalMedicare = calculateAdditionalMedicare(filingStatus, netIncome);
      const selfEmploymentRate = partnerType === 'Active' ? getSelfEmploymentRate() : 
      formType === '1040 - Schedule C/F' ? getSelfEmploymentRate() : 0;
      //const totalTaxDue = taxDue + selfEmploymentTax - taxCredits;
      const totalTaxDue = (taxDue + selfEmploymentTax + additionalMedicare) - taxCredits;
      const effectiveTaxRate = taxableIncome !== 0 ? ((taxDue / taxableIncome) * 100).toFixed(2) : '0.00';
      const seDeduction = selfEmploymentTax / 2;
      

      // Resultados adicionales para cálculos alternativos 
      const seSocialSecurity2 = partnerType === 'Active' ? Math.min(grossIncome * 0.9235, 160200) * 0.124 : 0;
      const seMedicare2 = partnerType === 'Active' ? calculateSEMedicare(grossIncome) : 0;
      const selfEmploymentTax2 = partnerType === 'Active' ? seSocialSecurity2 + seMedicare2 : 0;
      const seDeduction2 = selfEmploymentTax2 / 2;
      const netIncome2 = grossIncome;
      const agi2 = netIncome2 - selfEmploymentTax2 / 2;
      const taxableIncome2 = calculateTaxableIncome2(agi2, filingStatus);
      const taxDue2 = calculateTaxDue2(filingStatus, taxableIncome2);
      const additionalMedicare2 = calculateAdditionalMedicare2(filingStatus, netIncome2);
      const totalTaxDue2 = (taxDue2 + selfEmploymentTax2 + additionalMedicare2) ;
      const effectiveTaxRate2 = taxableIncome2 !== 0 ? ((taxDue2 / taxableIncome2) * 100).toFixed(2) : '0.00';
      const { marginalRate2, level2 } = getMarginalTaxRateAndLevel2(filingStatus, taxableIncome2);
      const effectiveSERate = netIncome > 0 ?  (((selfEmploymentTax + additionalMedicare)/ netIncome) * 100).toFixed(2) : '0.00';
      
       
     // Calcular NIIT Threshold
      const niitThreshold = calculateNIITThreshold(netIncome, filingStatus, partnerType);
      const niitThreshold2 = calculateNIITThreshold2(netIncome2, filingStatus, partnerType);
      

      // Cálculo para Corporations (1120)
      const corpTaxableIncome = netIncome;
      const corpTaxableIncome2 = netIncome2;
      const corpTaxDue = corpTaxableIncome * 0.21;
      const corpTaxDue2 = corpTaxableIncome2 * 0.21;
      const corpEffectiveTaxRate = corpTaxableIncome !== 0 ? ((corpTaxDue / corpTaxableIncome) * 100).toFixed(2) : '0.00';
      const effectiveSERate2 = netIncome2 > 0 ? (((selfEmploymentTax2 + additionalMedicare2) / netIncome2) * 100).toFixed(2) : '0.00';
      
      
     

      // calculos para el formulario 1120S/1040NR 2/4
     const agi1120S = netIncome;
     const AgiCalculation2y4 = calculateAGI2y4 (agi1120S);
     const taxableIncome1120S = calculateTaxableIncome1120S(AgiCalculation2y4, filingStatus, dagi, dagi2) - QBID;
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

    // Calcular NIIT InvestIncome
    const calcularNIITInvest = calcularNIITInvestIncome(agi1120S, filingStatus, partnerType, partOfInvestmentIncome)
    const calcularNIITInvest2 = calcularNIITInvestIncome2(agi1120S, filingStatus, partnerType, partOfInvestmentIncome)
 
console.log(netIncome, standardDeduction, selfEmploymentTax);

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
        seSocialSecurity2,
        seDeduction,
        seDeduction2,
        seMedicare,
        additionalMedicare,
        additionalMedicare2,
        corpTaxableIncome,
        corpTaxDue,
        effectiveTaxRate,
        effectiveTaxRate2,
        effectiveTaxRate1120S,
        effectiveTaxRate1065,
        corpEffectiveTaxRate,
        seMedicare2,
        selfEmploymentTax2,
        effectiveSERate,
        effectiveSERate2,
        niitThreshold,
        niitThreshold2,
        calcularNIITInvest,
        calcularNIITInvest2,
        formType,  
        QBID, 
        dagi,
        totalCredit: taxCreditsResults,
        calculationType,
        totalSE: seSocialSecurity + seMedicare,
        totalSE2: seSocialSecurity2 + seMedicare2,
       
      };
    };
    
    return { performCalculations };
  
  };
  
  export default useCalculations;
  