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
  calculateNetIncomeSelfDirectedIRA401K,
  calculateNetIncomeDayTraderTaxStatus,
  calculateNetIncomeCollegeStudentStrategies,
  calculateNetIncomeSellHomeToSCorp,
  calculateNetIncomeGiftingStockStrategy,
  calculateNetIncomeRealEstateOptions,
  calculateNetIncomeMarriedFilingSeparate,
  calculateNetIncomeIndividualPlanningIdeas,
  calculateNetIncomeNetInvestmentIncomeTax,
  calculateNetIncomeMiscTaxCredits,
  calculateNetIncomeRentalStrategies754Election,
  calculateNetIncomeReasonableCompAnalysis,
  calculateNetIncomeRealEstateProfessional,
  calculateNetIncomeCaptiveInsurance,
  calculateNetIncomeCharitableLLC,
  calculateNetIncomeSoleProprietor,
  calculateNetIncomeChoiceOfEntity,
  calculateNetIncomeChoiceOfEntityCCorp,
  calculateNetIncomeChoiceOfEntityPartnership,
  calculateNetIncomeChoiceOfEntitySCorp,
  calculateNetIncomeHarvestingCryptoInvestors,



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
    partnershipShare,
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
    netIncome = calculateNetIncomeAugusta(grossIncome, averageMonthlyRent, daysOfRent, partnershipShare);
    break;
  case 'prepaid':
    netIncome = calculateNetIncomePrepaid(grossIncome, totalExpenses, totalNonPrepaidExpenses, partnershipShare);
    break;
  case 'hireKids':
    netIncome = calculateNetIncomeKids(grossIncome, hireKidsDeduction, partnershipShare);
    break;
  case 'hireFamily':
    netIncome = calculateNetIncomeFamily(grossIncome, hireFamilyDeduction, partnershipShare);
    break;
  case 'qualifiedOpportunityFunds':
    netIncome = calculateNetIncomeQOF(grossIncome, reductionInNetIncome, partnershipShare);
    break;
  case 'healthSavings':
    netIncome = calculateNetIncomeHSA(grossIncome, hsaContribution, partnershipShare);
    break;
  case 'lifetimeLearningCredit':
    netIncome = calcualteNetIncomeLifeTimeLearningCredit(grossIncome, partnershipShare);
    break;
  case 'charitableRemainderTrust':
    netIncome = calculateNetIncomeCRT(grossIncome, partnershipShare);
    break;
  case 'reimbursment':
    netIncome = calculateReimbursment(grossIncome, tve, pbuv, partnershipShare);
    break;
  case 'amendedPriorYears':
    netIncome = calculateNetIncomeAmanda(grossIncome, partnershipShare);
    break;
  case 'exemptionQualifiedSmall':
    netIncome = calculateNetIncomeExemptionQualifiedSmall(grossIncome, partnershipShare);
    break;
  case 'costSegregation':
    netIncome = calculateNetIncomeCostSegregation(grossIncome, deduction, partnershipShare);
    break;
  case 'savingsPlan':
    netIncome = calculateNetIncomeSavingsPlan(grossIncome, partnershipShare);
    break;
  case 'educationAssistance':
    netIncome = calculateNetIncomeEducationAssistance(grossIncome, totalEducationalAssistance, partnershipShare);
    break;
  case 'accountablePlan':
    netIncome = calculateNetIncomeAccountableplan(grossIncome, totalReimbursableExpenses, partnershipShare);
    break;
  case 'adoptionAndIra':
    netIncome = calculateNetIncomeAdoptionPlan(grossIncome, partnershipShare);
    break;
  case 'educationTaxCredit':
    netIncome = calculateNetIncomeEducationTaxCredit(grossIncome, partnershipShare);
    break;
  case 'healthReimbursement':
    netIncome = calculateNetIncomeHealthReimbursement(grossIncome, totalBenefits, partnershipShare);
    break;
  case 'incomeShifting':
    netIncome = calculateNetIncomeIncomeShifting(grossIncome, totalIncomeShifted, partnershipShare);
    break;
  case 'lifeInsurance':
    netIncome = calculateNetIncomeLifeInsurance(grossIncome, partnershipShare);
    break;
  case 'maximizeMiscellaneousExpenses':
    netIncome = calculateNetIncomeMaximizeMiscellaneousExpenses(grossIncome, totalNetDeductionMaxi, partnershipShare);
    break;
  case 'mealsDeduction':
    netIncome = calculateNetIncomeMealsDeduction(grossIncome, deductionMeals, partnershipShare);
    break;
  case 'lossesDeduction':
    netIncome = calculateNetIncomeOperatingLosses(grossIncome, totalNOL, partnershipShare);
    break;
  case 'solo401k':
    netIncome = calcularNetIncomeSolo401k(grossIncome, deductionSolo401k, partnershipShare);
    break;
  case 'researchAndDevelopmentCredit':
    netIncome = calculateNetIncomeResearchAndDevelopmentCredit(grossIncome, partnershipShare);
    break;
  case 'rothIRA':
    netIncome = calculateNetIncomeRothIRA(grossIncome, partnershipShare);
    break;
  case 'sepContributions':
    netIncome = calculateNetIncomeHealthInsuranceDeduction(grossIncome, totalContribution, partnershipShare);
    break;
  case 'healthInsuranceDeduction2':
    netIncome = calculateNetIncomeHealthInsuranceDeduction2(grossIncome, incomeReduction, partnershipShare);
    break;
  case 'simpleIRA':
    netIncome = calculateNetIncomeSimpleIra(grossIncome, totalEmployerContribution, partnershipShare);
    break;
  case 'startupCostOptimization':
    netIncome = calculateNetIncomeStartupCost(grossIncome, deductionStartup, partnershipShare);
    break;
  case 'stateTaxSavings':
    netIncome = calculateNetIncomeStateTaxSavings(grossIncome, partnershipShare);
    break;
  case 'traditionalIRA':
    netIncome = calculateNetIncomeTraditionalIRA(grossIncome, totalDeductionTraditionalIRA, partnershipShare);
    break;
  case 'unreimbursedExpenses':
    netIncome = calculateNetIncomeUnreimbursedExpenses(grossIncome, reductionUnreimbursed, partnershipShare);
    break;
  case 'charitableDonationSavings':
    netIncome = calculateNetIncomeCharitableDonation(grossIncome, partnershipShare);
    break;
  case 'influencerOptimization':
    netIncome = calculateNetIncomeInfluencer(grossIncome, deductionInfluencer, partnershipShare);
    break;
  case 'CancellationByInsolvency':
    netIncome = calculateNetIncomeCancellationByInsolvency(grossIncome, deductionCancellation, partnershipShare);
    break;
  case 'ActiveRealEstate':
    netIncome = calculateNetIncomeActiveRealEstate(grossIncome, partnershipShare);
    break;
  case 'BackdoorRoth':
    netIncome = calculateNetIncomeBackdoorRoth(grossIncome, partnershipShare);
    break;
  case 'deferredCapitalGain':
    netIncome = calculateNetIncomeCapital(grossIncome, partnershipShare);
    break;
  case 'Covul':
    netIncome = calculateNetIncomeCovul(grossIncome, partnershipShare);
    break;
  case 'DepletionDeduction':
    netIncome = calculateNetIncomeDepletionDeduction(grossIncome, yearDepletion, partnershipShare);
    break;
  case 'QualifiedDividends':
    netIncome = calculateNetIncomeQualifiedDividends(grossIncome, partnershipShare);
    break;
  case 'DonorAdvisedFund':
    netIncome = calculateNetIncomeDonorAdvisedFund(grossIncome, partnershipShare);
    break;
  case 'ElectricVehicleCredits':
    netIncome = calculateNetIncomeElectricVehicleCredits(grossIncome, partnershipShare);
    break;
  case 'ESOP':
    netIncome = calculateNetIncomeEmployeeStockOwnershipPlan(grossIncome, sharesValueContributed, partnershipShare);
    break;
  case 'FederalSolarInvestmentTaxCredit':
    netIncome = calculateNetIncomeFederalSolarInvestmentTaxCredit(grossIncome, partnershipShare);
    break;
  case 'FinancedInsurance':
    netIncome = calculateNetIncomeFinancedInsurance(grossIncome, financedDeduction, partnershipShare);
    break;
  case 'FinancedSoftwareLeaseback':
    netIncome = calculateNetIncomeFinancedSoftware(grossIncome, softwareLeasebackDeduction, partnershipShare);
    break;
  case 'ForeignEarnedIncomeExclusion':
    netIncome = calculateNetIncomeForeignEarnedIncome(grossIncome, foreignDeduction, partnershipShare);
    break;
  case 'GroupHealthInsurance':
    netIncome = calculateNetIncomeGroupHealthInsurance(grossIncome, groupHealthInsuranceDeduction, partnershipShare);
    break;
  case 'GroupingRelatedActivities':
    netIncome = calculateNetIncomeGroupingRelatedActivities(grossIncome, partnershipShare);
    break;
  case 'HomeOfficeDeduction':
    netIncome = calculateNetIncomeHomeOfficeDeduction(grossIncome, homeOfficeDeduction, partnershipShare);
    break;
  case 'HistoricalPreservationEasement':
    netIncome = calculateNetIncomeHistoricalPreservationEasement(grossIncome, partnershipShare);
    break;
  case 'InstallmentSale':
    netIncome = calculateNetIncomeInstallmentSale(grossIncome, installmentSaleDeduction, partnershipShare);
    break;
  case 'MaximizeItemization':
    netIncome = calculateNetIncomeMaximizeItemization(grossIncome, partnershipShare);
    break;
  case 'NoncashCharitableContributions':
    netIncome = calculateNetIncomeNoncashCharitableContributions(grossIncome, partnershipShare);
    break;
  case 'OilAndGasDrillingCost':
    netIncome = calculateNetIncomeOilAndGasDrillingCost(grossIncome, oilAndGasDrillingCostDeduction, partnershipShare);
    break;
  case 'OilAndGasMLP':
    netIncome = calculateNetIncomeOilAndGasMLP(grossIncome, partnershipShare);
    break;
  case 'OrdinaryLossOnWorthlessStock':
    netIncome = calculateNetIncomeOrdinaryLossOnWorthlessStock(grossIncome, ordinaryLossDeduction, partnershipShare);
    break;
  case 'passThroughEntity':
    netIncome = calculateNetIncomePassThroughEntity(grossIncome, partnershipShare);
    break;
  case 'passiveLossAndPigs':
    netIncome = calculateNetIncomePassiveLossAndPigs(grossIncome, partnershipShare);
    break;
  case 'primarySaleExclusion':
    netIncome = calculateNetIncomePrimarySaleExclusion(grossIncome, partnershipShare);
    break;
  case 'privateFamilyFoundation':
    netIncome = calculateNetIncomePrivateFamilyFoundation(grossIncome, partnershipShare);
    break;
  case 'qualifiedCharitableDistributions':
    netIncome = calculateNetIncomeQualifiedCharitableDistributions(grossIncome, totalDeductionQCDS, partnershipShare);
    break;
  case 'RealEstateDevelopmentCharitable':
    netIncome = calculateNetIncomeRealEstateDevelopmentCharitable(grossIncome, partnershipShare);
    break;
  case 'RestrictedStockUnits':
    netIncome = calculateNetIncomeRestrictedStockUnits(grossIncome, partnershipShare);
    break;
  case 'RetireePlanning':
    netIncome = calculateNetIncomeRetireePlanning(grossIncome, partnershipShare);
    break;
  case 'SCorpRevocation':
    netIncome = calculateNetIncomeSCorpRevocation(grossIncome, partnershipShare);
    break;
  case 'SecureAct20Strategies':
    netIncome = calculateNetIncomeSecureAct20Strategies(grossIncome, partnershipShare);
    break;
  case 'SeriesIBond':
    netIncome = calculateNetIncomeSeriesIBond(grossIncome, partnershipShare);
    break;
  case 'ShortTermRental':
    netIncome = calculateNetIncomeShortTermRental(grossIncome, partnershipShare);
    break;
  case 'BonusDepreciation':
    netIncome = calculateNetIncomeBonusDepreciation(grossIncome, bonusDepreciationDeduction, partnershipShare);
    break;
  case 'SolarPassiveInvestment':
    netIncome = calculateNetIncomeSolarPassiveInvestment(grossIncome, SPID, partnershipShare);
    break;
  case 'TaxFreeIncome':
    netIncome = calculateNetIncomeTaxFreeIncome(grossIncome, partnershipShare);
    break;
  case 'WorkOpportunityTaxCredit':
    netIncome = calculateNetIncomeWorkOpportunityTaxCredit(grossIncome, workOpportunityTaxCreditDeduction, partnershipShare);
    break;
  case '1031Exchange':
    netIncome = calculateNetIncome1031Exchange(grossIncome, partnershipShare);
    break;
  case 'DefinedBenefitPlan':
    netIncome = calculateNetIncomeDefinedBenefitPlan(grossIncome, partnershipShare);
    break;
  case 'StructuredInvestmentProgram':
    netIncome = calculateNetIncomeStructuredInvestmentProgram(grossIncome, structuredInvestmentProgramDeduction, partnershipShare);
    break;
  case 'SelfDirectedIRA401K':
    netIncome = calculateNetIncomeSelfDirectedIRA401K(grossIncome, partnershipShare);
    break;
  case 'DayTraderTaxStatus':
    netIncome = calculateNetIncomeDayTraderTaxStatus(grossIncome, partnershipShare);
    break;
  case 'CollegeStudentStrategies':
    netIncome = calculateNetIncomeCollegeStudentStrategies(grossIncome, partnershipShare);
    break;
  case 'SellHomeToSCorp':
    netIncome = calculateNetIncomeSellHomeToSCorp(grossIncome, partnershipShare);
    break;
  case 'GiftingStockStrategy':
    netIncome = calculateNetIncomeGiftingStockStrategy(grossIncome, partnershipShare);
    break;
  case 'RealEstateOptions':
    netIncome = calculateNetIncomeRealEstateOptions(grossIncome, partnershipShare);
    break;
  case 'MarriedFilingSeparate':
    netIncome = calculateNetIncomeMarriedFilingSeparate(grossIncome, partnershipShare);
    break;
  case 'IndividualPlanningIdeas':
    netIncome = calculateNetIncomeIndividualPlanningIdeas(grossIncome, partnershipShare);
    break;
  case 'NetInvestmentIncomeTax':
    netIncome = calculateNetIncomeNetInvestmentIncomeTax(grossIncome, partnershipShare);
    break;
  case 'MiscTaxCredits':
    netIncome = calculateNetIncomeMiscTaxCredits(grossIncome, partnershipShare);
    break;
  case 'rentalStrategies754Election':
    netIncome = calculateNetIncomeRentalStrategies754Election(grossIncome, partnershipShare);
    break;
  case 'ReasonableCompAnalysis':
    netIncome = calculateNetIncomeReasonableCompAnalysis(grossIncome, partnershipShare);
    break;
  case 'RealEstateProfessional':
    netIncome = calculateNetIncomeRealEstateProfessional(grossIncome, partnershipShare);
    break;
  case 'CaptiveInsurance':
    netIncome = calculateNetIncomeCaptiveInsurance(grossIncome, partnershipShare);
    break;
  case 'CharitableLLC':
    netIncome = calculateNetIncomeCharitableLLC(grossIncome, partnershipShare);
    break;
  case 'SoleProprietor':
    netIncome = calculateNetIncomeSoleProprietor(grossIncome, partnershipShare);
    break;
  case 'ChoiceOfEntity':
    netIncome = calculateNetIncomeChoiceOfEntity(grossIncome, partnershipShare);
    break;
  case 'ChoiceOfEntityCCorp':
    netIncome = calculateNetIncomeChoiceOfEntityCCorp(grossIncome, partnershipShare);
    break;
  case 'ChoiceOfEntityPartnership':
    netIncome = calculateNetIncomeChoiceOfEntityPartnership(grossIncome, partnershipShare);
    break;
  case 'ChoiceOfEntitySCorp':
    netIncome = calculateNetIncomeChoiceOfEntitySCorp(grossIncome, partnershipShare);
    break;
  case 'HarvestingCryptoInvestors':
    netIncome = calculateNetIncomeHarvestingCryptoInvestors(grossIncome, partnershipShare);
    break;
  case 'qbidCalculation':
    netIncome = grossIncome; // En este caso, usaremos grossIncome directamente
    break;



         case 'standard':
          netIncome = calculateNetIncome(grossIncome, deduction179, partnershipShare);
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
      let tempTaxCredits = taxCreditsResults * partnershipShare / 100;

      const taxCredits = tempTaxCredits > 0
      ? tempTaxCredits
      : (taxCreditsResults || 0);
      
      
      //const taxCredits = taxCreditsResults || 0;
    

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
        partnershipShare,
       
      };
    };
    
    return { performCalculations };
  
  };
  
  export default useCalculations;
  