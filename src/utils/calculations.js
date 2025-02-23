import { ExplicitRounded } from '@mui/icons-material';
import {
  taxBrackets,
  standardDeductions,
  socialSecurityRate,
  socialSecurityWageBase,
  seBaseMultiplier,
  medicareRate,
  additionalMedicareRate,
  additionalMedicareThreshold,
  niitThresholds,
  taxAccumulators,
  niitRate,
 
} from './taxData';



//estrategias en orden

// Calcular el Net Income según el tipo de inversión (Section 179 o Bonus)
export function calculateNetIncome(grossIncome, deduction179 ) { 
  return Math.max(0, grossIncome - deduction179); // Evita valores negativos
}

// Calcular el Net Income para Hire Your Kids
export function calculateNetIncomeKids(grossIncome, hireKidsDeduction) {
  return Math.max(0, grossIncome - hireKidsDeduction); // Evita valores negativos
}


//Calcualar el Net Income para Prepaid Expenses
export function calculateNetIncomePrepaid(grossIncome, totalExpenses, ) {
  return Math.max(0, grossIncome - totalExpenses); // Evita valores negativos
}


// Calcular el Net Income según el tipo de inversión (Augusta Rule)
export function calculateNetIncomeAugusta(grossIncome, averageMonthlyRent, daysOfRent) {
  const totalDeduction = (averageMonthlyRent / 30) * daysOfRent;
  return Math.max(0, grossIncome - totalDeduction); // Evita valores negativos
}


// Calcular el Net Income para Charitable Remainder Trust (CRT)
export function calculateNetIncomeCRT(grossIncome) {
  return Math.max(0, grossIncome );// Evita valores negativos
  };


//Calcular el Net Income para Reimbursment
export function calculateReimbursment(grossIncome, tve, pbuv) {

  if (grossIncome <= 0 || tve <= 0 || pbuv <= 0 || pbuv > 100) {
    throw new Error('Invalid input: All values must be greater than 0, and PBUV must be between 0 and 100.');
  }
  const reimbursment = tve * (pbuv / 100);
  const netIncome = grossIncome - reimbursment;
  return netIncome;
}

// Calcular el Net Income para Hire Your Family
export function calculateNetIncomeFamily(grossIncome, hireFamilyDeduction) {
  return Math.max(0, grossIncome - hireFamilyDeduction); // Evita valores negativos
}

// Calcular el Net Income para Qualified Opportunity Funds (QOF)
export function calculateNetIncomeQOF(grossIncome, reductionInNetIncome) {
  return Math.max(0, grossIncome - reductionInNetIncome); // Evita valores negativos
}

// Calcular el Net Income para Health Savings Accounts (HSA)
export function calculateNetIncomeHSA(grossIncome, hsaContribution ) {
  return Math.max(0, grossIncome - hsaContribution); // Evita valores negativos
}
//calcular el net income para life Time Learning Credit
export function calcualteNetIncomeLifeTimeLearningCredit(grossIncome) {
  return Math.max(0, grossIncome ); // Evita valores negativos
}
//calcular el Net income para amandaPriorYears    
export function calculateNetIncomeAmanda(grossIncome) {
  return Math.max(0, grossIncome ); // Evita valores negativos{
}

// calcular el Net income para exemptionQualifiedSmall
export function calculateNetIncomeExemptionQualifiedSmall(grossIncome, capitalGainQSBS) {
  return Math.max(0, grossIncome ); // Evita valores negativos{
}

// calcular el Net income para costSegregation
export function calculateNetIncomeCostSegregation(grossIncome, deduction){
  return Math.max(0, grossIncome - deduction); // Evita valores negativos{
}

//calcular el Net income accountableplan
export function calculateNetIncomeAccountableplan(grossIncome, totalReimbursableExpenses) {
  return Math.max(0, grossIncome - totalReimbursableExpenses); 
}

// CALCULAR NET INCOME PARA ADOTIONPLAN
export function calculateNetIncomeAdoptionPlan(grossIncome) {
  return Math.max(0, grossIncome ); 
}
//calcular net income para active real 
export function calculateNetIncomeActiveRealEstate(grossIncome){
  return Math.max(0, grossIncome );
}

// calcular net inoome para Backdoor Roth
export function calculateNetIncomeBackdoorRoth(grossIncome, ) {
  return Math.max(0, grossIncome ); 
}


//calcular net income Cancellation By Insolvency
export function calculateNetIncomeCancellationByInsolvency(grossIncome, deductionCancellation) {
  return Math.max(0, grossIncome - deductionCancellation ); 
}

// calcular el Net income para savingsPlan
export function calculateNetIncomeSavingsPlan(grossIncome) {
  return Math.max(0, grossIncome); // Evita valores negativos
}
//calcular el Net income para educationAssistance
export function calculateNetIncomeEducationAssistance(grossIncome, totalEducationalAssistance) {
  return Math.max(0, grossIncome - totalEducationalAssistance); // Evita valores negativos
}

//calcular el Net income para educationTaxCredit
export function calculateNetIncomeEducationTaxCredit(grossIncome) {
  return Math.max(0, grossIncome ); // Evita valores negativos
}

//calcular el Net income para reimbursement
export function calculateNetIncomeHealthReimbursement(grossIncome, totalBenefits) {
  return Math.max(0, grossIncome - totalBenefits); // Evita valores negativos
}

//calcular el Net income para incomeShifting
export function calculateNetIncomeIncomeShifting(grossIncome, totalIncomeShifted) {
  return Math.max(0, grossIncome - totalIncomeShifted); // Evita valores negativos
}

//calcular el Net income para lifeInsurance
export function calculateNetIncomeLifeInsurance(grossIncome) {
  return Math.max(0, grossIncome ); // Evita valores negativos
}

//calcular el Net income para lifetimeLearningCredit
export function calculateNetIncomeMaximizeMiscellaneousExpenses(grossIncome, totalNetDeductionMaxi) {
  return Math.max(0, grossIncome - totalNetDeductionMaxi); // Evita valores negativos 
}
//calcular el Net income para Meals Deduction

export function calculateNetIncomeMealsDeduction(grossIncome, deductionMeals) {
  return Math.max(0, grossIncome - deductionMeals); // Evita valores negativos
}

//calcular el Net income para Operating Losses
export function calculateNetIncomeOperatingLosses(grossIncome, totalNOL) {
  return Math.max(0, grossIncome - totalNOL); // Evita valores negativos
}

//cacular el Net income para solo401k
export function calcularNetIncomeSolo401k(grossIncome, deductionSolo401k) {
  return Math.max(0, grossIncome - deductionSolo401k); // Evita valores negativos
}
//calcular el Net income para researchAndDevelopmentCredit
export function calculateNetIncomeResearchAndDevelopmentCredit(grossIncome) {
  return Math.max(0, grossIncome ); // Evita valores negativos
}
//calcular el Net income para rothIRA
export function calculateNetIncomeRothIRA(grossIncome) {
  return Math.max(0, grossIncome ); // Evita valores negativos
}
//calcular el Net income para healthInsuranceDeduction
export function calculateNetIncomeHealthInsuranceDeduction(grossIncome, totalContribution) {
  return Math.max(0, grossIncome - totalContribution); // Evita valores negativos
}

//calcular el Net income para healthInsuranceDeduction2
export function calculateNetIncomeHealthInsuranceDeduction2 (grossIncome, incomeReduction ) {
  return Math.max(0, grossIncome - incomeReduction); // Evita valores negativos
}
//calcular el Net income para SimpleIRA
export function calculateNetIncomeSimpleIra (grossIncome, totalEmployerContribution) {
  return Math.max(0, grossIncome - totalEmployerContribution); // Evita valores negativos
}
//calcular net income para startupcost
export function calculateNetIncomeStartupCost (grossIncome,deductionStartup){
  return Math.max(0, grossIncome - deductionStartup); // Evita valores negativos
}
// calcular net income para StateTaxSaving
export function calculateNetIncomeStateTaxSavings(grossIncome){
  return Math.max(0, grossIncome ); // Evita valores negativos
}

//calcular Net income para TraditionalIRA
export function calculateNetIncomeTraditionalIRA (grossIncome, totalDeductionTraditionalIRA) {
  return Math.max(0, grossIncome - totalDeductionTraditionalIRA ); // Evita valores negativos
}


//calcular Net income para Unreimbursed Expenses
export function calculateNetIncomeUnreimbursedExpenses (grossIncome, reductionUnreimbursed){
  return Math.max(0, grossIncome - reductionUnreimbursed); // Evita valores negativos
}

//calcular Net Income para Charitable Donation Of Appreciated
export function calculateNetIncomeCharitableDonation (grossIncome ){
  return Math.max(0, grossIncome ); // Evita valores negativos
}
//calcular Net Income para influencer
export function calculateNetIncomeInfluencer (grossIncome, deductionInfluencer){
  return Math.max(0, grossIncome - deductionInfluencer); // Evita valores negativos
}

// calcular net income para deferred Capital Gain
export function calculateNetIncomeCapital (grossIncome){
  return Math.max(0, grossIncome); // Evita valores negativos
}
//calcular net income para covul
export function calculateNetIncomeCovul(grossIncome) {
  return Math.max(0, grossIncome); // Evita valores negativos
}
//calcular net income para depletionDeduction
export function calculateNetIncomeDepletionDeduction (grossIncome, yearDepletion){
  return Math.max(0, grossIncome - yearDepletion); // Evita valores negativos
}

//calcular Net income para Qualified Dividends
export function calculateNetIncomeQualifiedDividends (grossIncome){
  return Math.max(0, grossIncome ); // Evita valores negativos
}


//calcular net income para Donor Advised Fund
export function calculateNetIncomeDonorAdvisedFund (grossIncome){
  return Math.max(0, grossIncome ); // Evita valores negativos
}

//calcular Net income para Electric vehicle credits
export function calculateNetIncomeElectricVehicleCredits (grossIncome){
  return Math.max(0, grossIncome ); // Evita valores negativos
}

// calcular net income para Employee Stock Ownership Plan
export function calculateNetIncomeEmployeeStockOwnershipPlan (grossIncome, sharesValueContributed){
  return Math.max(0, grossIncome - sharesValueContributed); // Evita valores negativos
}

//calcular net income para Federal Solar Investment Tax Credit
export function calculateNetIncomeFederalSolarInvestmentTaxCredit (grossIncome){
  return Math.max(0, grossIncome ); // Evita valores negativos
}

//calcular net income para FINANCED INSURANCE FOR BUSINESS RISKS
export function calculateNetIncomeFinancedInsurance (grossIncome, financedDeduction){
  return Math.max(0, grossIncome - financedDeduction ); // Evita valores negativos
}

//calcular net income para FINANCED Software
export function calculateNetIncomeFinancedSoftware (grossIncome, softwareLeasebackDeduction){
  return Math.max(0, grossIncome - softwareLeasebackDeduction ); // Evita valores negativos
}

//calcular net income para Foreign Earned Income Exclusion
export function calculateNetIncomeForeignEarnedIncome (grossIncome, foreignDeduction){
  return Math.max(0, grossIncome - foreignDeduction ); // Evita valores negativos
}

// calcular net income para Group Health Insurance
export function calculateNetIncomeGroupHealthInsurance (grossIncome, groupHealthInsuranceDeduction){
  return Math.max(0, grossIncome - groupHealthInsuranceDeduction ); // Evita valores negativos
}

//calcular net income para Grouping Related Activities
export function calculateNetIncomeGroupingRelatedActivities (grossIncome){
  return Math.max(0, grossIncome ); // Evita valores negativos  
}

//calcular net income para Home Office Deduction
export function calculateNetIncomeHomeOfficeDeduction (grossIncome, homeOfficeDeduction){
  return Math.max(0, grossIncome - homeOfficeDeduction ); // Evita valores negativos
}

//calcular net income para Historical Preservation Easement
export function calculateNetIncomeHistoricalPreservationEasement (grossIncome ){
  return Math.max(0, grossIncome ); // Evita valores negativos
}

//calcular net income para Installment Sale
export function calculateNetIncomeInstallmentSale (grossIncome, installmentSaleDeduction ){
  return Math.max(0, grossIncome - installmentSaleDeduction ); // Evita valores negativos
}
//calcular net income para Maximize Itemization Strategies
export function calculateNetIncomeMaximizeItemization (grossIncome ){
  return Math.max(0, grossIncome  ); // Evita valores negativos
}

//calcular net income para Noncash Charitable Contributions
export function calculateNetIncomeNoncashCharitableContributions (grossIncome ){
  return Math.max(0, grossIncome  ); // Evita valores negativos
}
//calcular net income para  Oil And Gas Drilling Cost
export function calculateNetIncomeOilAndGasDrillingCost (grossIncome, oilAndGasDrillingCostDeduction ){
  return Math.max(0, grossIncome - oilAndGasDrillingCostDeduction ); // Evita valores negativos
}

//calcular net income para Oil And Gas MLP
export function calculateNetIncomeOilAndGasMLP (grossIncome ){
  return Math.max(0, grossIncome  ); // Evita valores negativos
}
//calcular net income para OrdinaryLossOnWorthlessStock
export function calculateNetIncomeOrdinaryLossOnWorthlessStock (grossIncome, ordinaryLossDeduction ){
  return Math.max(0, grossIncome - ordinaryLossDeduction  ); // Evita valores negativos
}
//calcular net income para Real Estate Development Charitable
export function calculateNetIncomeRealEstateDevelopmentCharitable(grossIncome) {
  return Math.max(0, grossIncome); // Evita valores negativos
}

//calcular net income para Restricted Stock Units
export function calculateNetIncomeRestrictedStockUnits(grossIncome) {
  return Math.max(0, grossIncome); // Evita valores negativos
}

//calcular net income para Retiree Planning
export function calculateNetIncomeRetireePlanning(grossIncome) {
  return Math.max(0, grossIncome); // Evita valores negativos
}

//calcular net income para S-Corp Revocation
export function calculateNetIncomeSCorpRevocation(grossIncome) {
  return Math.max(0, grossIncome); // Evita valores negativos
}

//calcular net income para Secure Act 20 Strategies
export function calculateNetIncomeSecureAct20Strategies(grossIncome) {
  return Math.max(0, grossIncome); // Evita valores negativos
}

//calcular net income para PassThroughEntity
export function calculateNetIncomePassThroughEntity(grossIncome) {
  return Math.max(0, grossIncome); // Evita valores negativos
}

//calcular net income para PassiveLossAndPigs
export function calculateNetIncomePassiveLossAndPigs(grossIncome) {
  return Math.max(0, grossIncome); // Evita valores negativos
}

//calcular net income para PrimarySaleExclusion
export function calculateNetIncomePrimarySaleExclusion(grossIncome) {
  return Math.max(0, grossIncome); // Evita valores negativos
}

//calcular net income para PrivateFamilyFoundation
export function calculateNetIncomePrivateFamilyFoundation(grossIncome) {
  return Math.max(0, grossIncome); // Evita valores negativos
}

//calcular net income para QualifiedCharitableDistributions
export function calculateNetIncomeQualifiedCharitableDistributions(grossIncome, totalDeductionQCDS) {
  return Math.max(0, grossIncome - totalDeductionQCDS); // Evita valores negativos
}

//calcular net income para Series I Bond
export function calculateNetIncomeSeriesIBond(grossIncome) {
  return Math.max(0, grossIncome ); // Evita valores negativos
}

//calcular net income para Short Term Rental
export function calculateNetIncomeShortTermRental(grossIncome) {
  return Math.max(0, grossIncome ); // Evita valores negativos
}

//calcular net income para Bonus Depreciation
export function calculateNetIncomeBonusDepreciation(grossIncome, bonusDepreciationDeduction) {
  return Math.max(0, grossIncome - bonusDepreciationDeduction ); // Evita valores negativos
}

//calcular net income para Solar Passive Investment
export function calculateNetIncomeSolarPassiveInvestment(grossIncome, solarPassiveInvestmentDeduction) {
  return Math.max(0, grossIncome - solarPassiveInvestmentDeduction ); // Evita valores negativos
}

//calcular net income para Tax Free Income
export function calculateNetIncomeTaxFreeIncome(grossIncome) {
  return Math.max(0, grossIncome  ); // Evita valores negativos
}

//calcular net income para Work Opportunity Tax Credit
export function calculateNetIncomeWorkOpportunityTaxCredit(grossIncome, workOpportunityTaxCreditDeduction) {
  return Math.max(0, grossIncome - workOpportunityTaxCreditDeduction ); // Evita valores negativos
}   

//calcular net income para 1031 Exchange
export function calculateNetIncome1031Exchange(grossIncome) {
  return Math.max(0, grossIncome  ); // Evita valores negativos
}

//calcular net income para Defined Benefit Plan
export function calculateNetIncomeDefinedBenefitPlan(grossIncome) {
  return Math.max(0, grossIncome  ); // Evita valores negativos
}

//calcular net income para Structured Investment Program
export function calculateNetIncomeStructuredInvestmentProgram(grossIncome, structuredInvestmentProgramDeduction) {
  return Math.max(0, grossIncome - structuredInvestmentProgramDeduction ); // Evita valores negativos
}

















//////cierre de estrategias////////////////////






/////////////////////calculos generales/////////////////////////////

// Calcular Self-Employment Medicare Tax
export function calculateSEMedicare(netIncome) {
  if (netIncome <= 0) return 0;
  return (netIncome * 0.9235) * 0.029; // Aplicar 2.9% directamente al Net Income
}

// Calcular el AGI (Adjusted Gross Income) 1/3
export function calculateAGI(netIncome, standardDeduction, selfEmploymentTax) {
  return netIncome - (selfEmploymentTax / 2);  
}

// Calcular el AGI para 2 y 4 (1120s y 1040nr)
export function calculateAGI2y4(agi1120S) {
  return agi1120S;
}

// Calcular el Taxable Income  (1/3)
export function calculateTaxableIncome(agi, filingStatus, dagi, dagi2) {
  const standardDeduction = standardDeductions[filingStatus] || 0;
  
  // Elige el valor más alto
  const agiDeduction = dagi > standardDeduction ? dagi : 0;
  // Resta dagi2 al agi
  const agiDeduction2 = dagi2 || 0;
  
  // Si dagi o dagi2 tienen valores, no restar standardDeduction
  if (agiDeduction > 0 || agiDeduction2 > 0) {
    return Math.max(0, agi - agiDeduction - agiDeduction2);
  }
  
  return Math.max(0, agi - standardDeduction);
}

// Calcular el Taxable Income2 sin estrategia
export function calculateTaxableIncome2(agi2, filingStatus) {
  const standardDeduction = standardDeductions[filingStatus] || 0;
  return Math.max(0, agi2 - standardDeduction);
}

// Calcular el Taxable Income  (2/4)
export function calculateTaxableIncome1120S(AgiCalculation2y4, filingStatus, dagi, dagi2) {
  const standardDeduction = standardDeductions[filingStatus] || 0;
  
  // Elige el valor más alto
  const agiDeduction = dagi > standardDeduction ? dagi : 0;
  // Resta dagi2 al agi
  const agiDeduction2 = dagi2 || 0;
  
  // Si dagi o dagi2 tienen valores, no restar standardDeduction
  if (agiDeduction > 0 || agiDeduction2 > 0) {
    return Math.max(0, AgiCalculation2y4 - agiDeduction - agiDeduction2);
  }
  
  return Math.max(0, AgiCalculation2y4 - standardDeduction);
}


// calcular el Taxable Income 1040nr
export function calculateTaxableIncome1040nr(agi, filingStatus, QBID) {
 const standardDeduction = standardDeductions[filingStatus] || 0;
 return Math.max(0, agi - standardDeduction - QBID);
}

// calcular el Taxable Income 1065
export function calculateTaxableIncome1065(agi, filingStatus) {
  const standardDeduction = standardDeductions[filingStatus] || 0;
  return Math.max(0, agi - standardDeduction );
}

//CALCULAR QBID
export function calculateQBID(taxableIncome, filingStatus) {
  return Math.max(0,taxableIncome,filingStatus  )
}


// Calcular el NIIT Threshold y el no formula
export function calculateNIITThreshold(netIncome, filingStatus, partnerType) {
  if (partnerType !== 'Passive') {
    return 0; // Solo se calcula para partners pasivos
  }

  const threshold = niitThresholds[filingStatus] || 0;

  if (netIncome > threshold) {
    const excess = netIncome - threshold;
    return (excess * 0.038).toFixed(2); // Formatear a dos decimales 0.038 es el tax rate NIIT
  }

  return 0;
}

export function calculateNIITThreshold2(netIncome2, filingStatus, partnerType) {
  if (partnerType !== 'Passive') {
    return 0; // Solo se calcula para partners pasivos
  }

  const threshold = niitThresholds[filingStatus] || 0;

  if (netIncome2 > threshold) {
    const excess = netIncome2 - threshold;
    return (excess * 0.038).toFixed(2); // Formatear a dos decimales 0.038 es el tax rate NIIT
  }

  return 0;
}

// Función para calcular el NIIT Invest income
export function calcularNIITInvestIncome(agi, filingStatus,partnerType, partOfInvestmentIncome) {
  const umbral = niitThresholds[filingStatus] || 0;  
  const niitR = niitRate;

  if (partnerType === "Passive" && agi > umbral) {
    return partOfInvestmentIncome * niitR;
  } else {
    return 0;
  }
}
// Función para calcular el NIIT Invest income2
export function calcularNIITInvestIncome2(agi1120S, filingStatus, partnerType, partOfInvestmentIncome) {
  const umbral = niitThresholds[filingStatus] || 0;  
  const niitR = niitRate;

  if (partnerType === "Passive" && agi1120S > umbral) {
    return partOfInvestmentIncome * niitR;
  } else {
    return 0;
  }
}
// Obtener el Marginal Tax Rate y el Income Level
export function getMarginalTaxRateAndLevel(filingStatus, taxableIncome) {
  const brackets = taxBrackets[filingStatus];
  let marginalRate = 0;
  let level = 0;

  for (let i = 0; i < brackets.length; i++) {
    if (taxableIncome >= brackets[i].start) {
      marginalRate = brackets[i].rate;
      level = i;
    } else {
      break;
    }
  }

  return { marginalRate, level };
}

// Obtener el Marginal Tax Rate y el Income Level
export function getMarginalTaxRateAndLevel2(filingStatus, taxableIncome2) {
  const brackets = taxBrackets[filingStatus];
  let marginalRate2 = 0;
  let level2 = 0;

  for (let i = 0; i < brackets.length; i++) {
    if (taxableIncome2 >= brackets[i].start) {
      marginalRate2 = brackets[i].rate;
      level2 = i;
    } else {
      break;
    }
  }

  return { marginalRate2, level2 };
}

// Obtener el Marginal Tax Rate y el Income Level para 1120S
export function getMarginalTaxRateAndLevel1120S(filingStatus, taxableIncome1120S) {
  const brackets = taxBrackets[filingStatus];
  let marginalRate1120s = 0;
  let level1120s = 0;

  for (let i = 0; i < brackets.length; i++) {
    if (taxableIncome1120S >= brackets[i].start) {
      marginalRate1120s = brackets[i].rate;
      level1120s = i;
    } else {
      break;
    }
  }

  return { marginalRate1120s, level1120s};
}

// Obtener el Marginal Tax Rate y el Income Level para 1040nr
export function getMarginalTaxRateAndLevel1040nr(filingStatus, taxableincome1040nr) {
  const brackets = taxBrackets[filingStatus];
  let marginalRate1040nr = 0;
  let level1040nr = 0;

  for (let i = 0; i < brackets.length; i++) {
    if (taxableincome1040nr >= brackets[i].start) {
      marginalRate1040nr = brackets[i].rate;
      level1040nr = i;
    } else {
      break;
    }
  }

  return { marginalRate1040nr, level1040nr};
}

// Calcular el impuesto adeudado (Tax Due) 

export function calculateTaxDue(filingStatus, taxableIncome) {
  const brackets = taxBrackets[filingStatus]; // Obtener los brackets según el estado fiscal
  const accumulated = taxAccumulators[filingStatus]; // Obtener los acumulados correspondientes
  let accumulatedTax = 0;

  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];

    if (taxableIncome <= bracket.end) {
      // Calcular el impuesto en el nivel actual
      if (i === 0) {
        // Nivel 0: No se suma acumulado
        accumulatedTax = taxableIncome * bracket.rate;
      } else {
        // Otros niveles: Usar acumulado del nivel anterior
        const previousBracketEnd = brackets[i - 1].end; // Límite superior del bracket anterior
        accumulatedTax = ((taxableIncome - previousBracketEnd) * bracket.rate) + accumulated[i - 1];
      }
      break; // Detener el cálculo después de encontrar el nivel correspondiente
    }
  }

  return parseFloat(accumulatedTax.toFixed(2));
}


// Calcular el impuesto adeudado (Tax Due)  2
export function calculateTaxDue2(filingStatus, taxableIncome2) {
  taxableIncome2 = parseFloat(taxableIncome2.toFixed(2)); // Asegurarse de que los ingresos tengan 2 decimales

  const brackets = taxBrackets[filingStatus]; // Obtener los brackets según el estado fiscal
  const accumulated = taxAccumulators[filingStatus]; // Obtener los acumulados correspondientes

  let accumulatedTax = 0;

  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];

    if (taxableIncome2 <= bracket.end) {
      if (i === 0) {
        // Nivel 0: No se suma acumulado
        accumulatedTax = parseFloat((taxableIncome2 * bracket.rate).toFixed(2));
      } else {
        // Otros niveles: Usar acumulado del nivel anterior
        const previousBracketEnd = brackets[i - 1].end; // Límite superior del bracket anterior
        const amountInBracket = taxableIncome2 - previousBracketEnd;
        accumulatedTax = parseFloat(
          ((amountInBracket * bracket.rate) + accumulated[i - 1]).toFixed(2)
        );
      }
      break; // Detener el cálculo después de encontrar el nivel correspondiente
    }
  }

  return accumulatedTax;
}

// Calcular el Tax due 1120S (Tax Due 1120S)

export function calculateTaxDue1120S(filingStatus, taxableIncome1120S) {
  taxableIncome1120S = parseFloat(taxableIncome1120S.toFixed(2)); // Asegurarse de que los ingresos tengan 2 decimales

  const brackets = taxBrackets[filingStatus]; // Obtener los brackets según el estado fiscal
  const accumulated = taxAccumulators[filingStatus]; // Obtener los acumulados correspondientes

  let accumulatedTax1120S = 0;

  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];

    if (taxableIncome1120S <= bracket.end) {
      if (i === 0) {
        // Nivel 0: No se suma acumulado
        accumulatedTax1120S = parseFloat((taxableIncome1120S * bracket.rate).toFixed(2));
      } else {
        // Otros niveles: Usar acumulado del nivel anterior
        const previousBracketEnd = brackets[i - 1].end; // Límite superior del bracket anterior
        const amountInBracket = taxableIncome1120S - previousBracketEnd;
        accumulatedTax1120S = parseFloat(
          ((amountInBracket * bracket.rate) + accumulated[i - 1]).toFixed(2)
        );
      }
      break; // Detener el cálculo después de encontrar el nivel correspondiente
    }
  }

  return accumulatedTax1120S;
}

// caucular el Tax Due 1040nr (Tax Due 1040nr)
export function calculateTaxDue1040nr(filingStatus, taxableincome1040nr) {
  taxableincome1040nr = parseFloat(taxableincome1040nr.toFixed(2)); // Asegurarse de que los ingresos tengan 2 decimales

  const brackets = taxBrackets[filingStatus]; // Obtener los brackets según el estado fiscal
  const accumulated = taxAccumulators[filingStatus]; // Obtener los acumulados correspondientes

  let accumulatedTax1040nr = 0;

  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];

    if (taxableincome1040nr <= bracket.end) {
      if (i === 0) {
        // Nivel 0: No se suma acumulado
        taxableincome1040nr = parseFloat((taxableincome1040nr * bracket.rate).toFixed(2));
      } else {
        // Otros niveles: Usar acumulado del nivel anterior
        const previousBracketEnd = brackets[i - 1].end; // Límite superior del bracket anterior
        const amountInBracket = taxableincome1040nr - previousBracketEnd;
        accumulatedTax1040nr = parseFloat(
          ((amountInBracket * bracket.rate) + accumulated[i - 1]).toFixed(2)
        );
      }
      break; 
    }
  }

  return accumulatedTax1040nr; 
}

// caucular el Tax Due 1065 (Tax Due 1065)
export function calculateTaxDue1065(filingStatus, taxableincome1065) {
  taxableincome1065 = parseFloat(taxableincome1065.toFixed(2)); // Asegurarse de que los ingresos tengan 2 decimales

  const brackets = taxBrackets[filingStatus]; // Obtener los brackets según el estado fiscal
  const accumulated = taxAccumulators[filingStatus]; // Obtener los acumulados correspondientes

  let accumulatedTax1065 = 0;

  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];

    if (taxableincome1065 <= bracket.end) {
      if (i === 0) {
        // Nivel 0: No se suma acumulado
        taxableincome1065 = parseFloat((taxableincome1065 * bracket.rate).toFixed(2));
      } else {
        // Otros niveles: Usar acumulado del nivel anterior
        const previousBracketEnd = brackets[i - 1].end; // Límite superior del bracket anterior
        const amountInBracket = taxableincome1065 - previousBracketEnd;
        accumulatedTax1065 = parseFloat(
          ((amountInBracket * bracket.rate) + accumulated[i - 1]).toFixed(2)
        );
      }
      break; 
    }
  }

  return accumulatedTax1065; 
}


// Calcular Additional Medicare Tax
export function calculateAdditionalMedicare(filingStatus, netIncome) {
  const threshold = additionalMedicareThreshold[filingStatus];
  return netIncome > threshold ? ((netIncome * 0.9235) - threshold) * additionalMedicareRate : 0;
}

// Calcular Additional Medicare Tax
export function calculateAdditionalMedicare2(filingStatus, netIncome2) {
  const threshold = additionalMedicareThreshold[filingStatus];
  return netIncome2 > threshold ? ((netIncome2 * 0.9235) - threshold ) * additionalMedicareRate : 0;
}

// Obtener la Self-Employment Rate fija (15.3%)
export function getSelfEmploymentRate() {
  return 15.3; // 12.4% para Social Security + 2.9% para Medicare
}

//calcular tax credits 1
export function calculateTaxcredits(taxCreditsResults) {
return taxCreditsResults;
}



