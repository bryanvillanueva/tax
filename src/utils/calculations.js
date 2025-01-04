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
 
} from './taxData';



//estrategias en orden

// Calcular el Net Income según el tipo de inversión (Section 179 o Bonus)
export function calculateNetIncome(grossIncome, cost, investType) {
  const deduction = investType === 'Section 179' ? cost : cost * 0.8;
  return Math.max(0, grossIncome - deduction); // Evita valores negativos
}

// Calcular el Net Income para Hire Your Kids
export function calculateNetIncomeKids(grossIncome, hireKidsDeduction) {
  return Math.max(0, grossIncome - hireKidsDeduction); // Evita valores negativos
}


//Calcualar el Net Income para Prepaid Expenses
export function calculateNetIncomePrepaid(grossIncome, totalExpenses, totalNonPrepaidExpenses) {
  const maxPrepaidDeduction = grossIncome * 0.2; // El máximo permitido será un 20% del ingreso bruto (ajustable según reglas)
  const prepaidDeduction = totalExpenses - totalNonPrepaidExpenses;
  const finalDeduction = Math.min(Math.max(0, prepaidDeduction), maxPrepaidDeduction);
  return Math.max(0, grossIncome - finalDeduction); // Evita valores negativos
}


// Calcular el Net Income según el tipo de inversión (Augusta Rule)
export function calculateNetIncomeAugusta(grossIncome, averageMonthlyRent, daysOfRent) {
  const totalDeduction = (averageMonthlyRent / 30) * daysOfRent;
  return Math.max(0, grossIncome - totalDeduction); // Evita valores negativos
}


// Calcular el Net Income para Charitable Remainder Trust (CRT)
export function calculateNetIncomeCRT(grossIncome, presentValue) {
  return Math.max(0, grossIncome - presentValue);// Evita valores negativos
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
export function calculateNetIncomeHSA(grossIncome, hsac, ewhd) {
  const hsaContribution = hsac * ewhd; 
  return Math.max(0, grossIncome - hsaContribution); // Evita valores negativos
}

//calcular el Net income para amandaPriorYears    
export function calculateNetIncomeAmanda(grossIncome) {
  return Math.max(0, grossIncome ); // Evita valores negativos{
}

// calcular el Net income para exemptionQualifiedSmall
export function calculateNetIncomeExemptionQualifiedSmall(grossIncome, capitalGainQSBS) {
  return Math.max(0, grossIncome - capitalGainQSBS); // Evita valores negativos{
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

//calcular el Net income para educationTaxCredit
export function calculateNetIncomeHealthReimbursement(grossIncome, totalBenefits) {
  return Math.max(0, grossIncome - totalBenefits); // Evita valores negativos
}


















//////cierre de estrategias////////////////////






//////////////////////////////////////////////////

// Calcular Self-Employment Medicare Tax
export function calculateSEMedicare(netIncome) {
  if (netIncome <= 0) return 0;
  return (netIncome * 0.9235) * 0.029; // Aplicar 2.9% directamente al Net Income
}

// Calcular el AGI (Adjusted Gross Income)
export function calculateAGI(netIncome, selfEmploymentTax) {
  return netIncome - selfEmploymentTax / 2;
}

// Calcular el Taxable Income
export function calculateTaxableIncome(agi, filingStatus) {
  const standardDeduction = standardDeductions[filingStatus] || 0;
  return Math.max(0, agi - standardDeduction);
}

// Calcular el Taxable Income2
export function calculateTaxableIncome2(agi2, filingStatus) {
  const standardDeduction = standardDeductions[filingStatus] || 0;
  return Math.max(0, agi2 - standardDeduction);
}

export function calculateTaxableIncome1120S(agi1120S, filingStatus) {
  const standardDeduction = standardDeductions[filingStatus] || 0;
  return Math.max(0, agi1120S - standardDeduction);
}

// Calcular el NIIT Threshold y el no formula
export function calculateNIITThreshold(netIncome, filingStatus, partnerType) {
  if (partnerType !== 'Passive') {
    return 0; // Solo se calcula para partners pasivos
  }

  const threshold = niitThresholds[filingStatus] || 0;

  if (netIncome > threshold) {
    const excess = netIncome - threshold;
    return (excess * 0.038).toFixed(2); // Formatear a dos decimales
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
    return (excess * 0.038).toFixed(2); // Formatear a dos decimales
  }

  return 0;
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




// Calcular Additional Medicare Tax
export function calculateAdditionalMedicare(filingStatus, netIncome) {
  const threshold = additionalMedicareThreshold[filingStatus];
  return netIncome > threshold ? (netIncome - threshold) * additionalMedicareRate : 0;
}

// Calcular Additional Medicare Tax
export function calculateAdditionalMedicare2(filingStatus, netIncome2) {
  const threshold = additionalMedicareThreshold[filingStatus];
  return netIncome2 > threshold ? (netIncome2 - threshold) * additionalMedicareRate : 0;
}

// Obtener la Self-Employment Rate fija (15.3%)
export function getSelfEmploymentRate() {
  return 15.3; // 12.4% para Social Security + 2.9% para Medicare
}

//calcular tax credits 1
export function calculateTaxcredits(taxCreditsResults) {
return taxCreditsResults;
}
