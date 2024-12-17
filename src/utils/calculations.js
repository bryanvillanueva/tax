import {
  taxBrackets,
  standardDeductions,
  socialSecurityRate,
  socialSecurityWageBase,
  seBaseMultiplier,
  medicareRate,
  additionalMedicareRate,
  additionalMedicareThreshold,
} from './taxData';





// Calcular el Net Income según el tipo de inversión (Section 179 o Bonus)
export function calculateNetIncome(grossIncome, cost, investType) {
  const deduction = investType === 'Section 179' ? cost : cost * 0.8;
  return Math.max(0, grossIncome - deduction); // Evita valores negativos
}

// Calcular el Net Income para Hire Your Kids
export function calculateNetIncomeKids(grossIncome, totalDeduction) {
  return Math.max(0, grossIncome - totalDeduction); // Evita valores negativos
}

//Calcualar el Net Income para Prepaid Expenses
export function calculateNetIncomePrepaid(grossIncome, totalExpenses, totalNonPrepaidExpenses) {
  const maxPrepaidDeduction = grossIncome * 0.2; // El máximo permitido será un 20% del ingreso bruto (ajustable según reglas)
  const prepaidDeduction = totalExpenses - totalNonPrepaidExpenses;
  const finalDeduction = Math.min(Math.max(0, prepaidDeduction), maxPrepaidDeduction);
  
  // Calcular el Net Income restando la deducción del Gross Income
  return Math.max(0, grossIncome - finalDeduction); // Evita valores negativos
}


// Calcular el Net Income según el tipo de inversión (Augusta Rule)
export function calculateNetIncomeAugusta(grossIncome, averageMonthlyRent, daysOfRent) {
  const totalDeduction = (averageMonthlyRent / 30) * daysOfRent;
  return Math.max(0, grossIncome - totalDeduction); // Evita valores negativos
}

// Calcular el Net Income para Charitable Remainder Trust (CRT)
export function calculateNetIncomeCRT(grossIncome, cgas, pvad) {

  const capitalGainTaxSavings = cgas * 0.20;
  const totalDeduction = pvad;
  const netIncomeCRT = Math.max(0, grossIncome - totalDeduction ); // Evita valores negativos
  return {
    netIncomeCRT, capitalGainTaxSavings, totalDeduction, // PVAD como deducción total
  };
}





//////////////////////////////////////////////////

// Calcular Self-Employment Medicare Tax
export function calculateSEMedicare(netIncome) {
  if (netIncome <= 0) return 0;
  return netIncome * 0.029; // Aplicar 2.9% directamente al Net Income
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

// Calcular el Taxable Income
export function calculateTaxableIncome2(agi2, filingStatus) {
  const standardDeduction = standardDeductions[filingStatus] || 0;
  return Math.max(0, agi2 - standardDeduction);
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



// Calcular el impuesto adeudado (Tax Due) income tax rate
export function calculateTaxDue(filingStatus, taxableIncome) {
  const brackets = taxBrackets[filingStatus];
  let tax = 0;

  for (let i = 0; i < brackets.length; i++) {
    if (taxableIncome > brackets[i].start) {
      const amountInBracket = Math.min(taxableIncome, brackets[i].end) - brackets[i].start;
      tax += amountInBracket * brackets[i].rate;
    } else {
      break;
    }
  }

  return tax;
}

// Calcular el impuesto adeudado (Tax Due) income tax rate
export function calculateTaxDue2(filingStatus, taxableIncome2) {
  const brackets = taxBrackets[filingStatus];
  let tax = 0;

  for (let i = 0; i < brackets.length; i++) {
    if (taxableIncome2 > brackets[i].start) {
      const amountInBracket = Math.min(taxableIncome2, brackets[i].end) - brackets[i].start;
      tax += amountInBracket * brackets[i].rate;
    } else {
      break;
    }
  }

  return tax;
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

