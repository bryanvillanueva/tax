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
export function calculateNetIncomeCRT(grossIncome, cgas, pvad) {
  const capitalGainTaxSavings = cgas * 0.20;
  const totalDeduction = pvad;
  const netIncomeCRT = Math.max(0, grossIncome - totalDeduction ); // Evita valores negativos
  return {
    netIncomeCRT, capitalGainTaxSavings, totalDeduction, // PVAD como deducción total
  };
}

//Calcular el Net Income para Reimbursment
export function calculateReimbursment(grossIncome, tve, pbuv) {
  // Validar los valores de entrada
  if (grossIncome <= 0 || tve <= 0 || pbuv <= 0 || pbuv > 100) {
    throw new Error('Invalid input: All values must be greater than 0, and PBUV must be between 0 and 100.');
  }
  const reimbursment = tve * (pbuv / 100);
  return reimbursment;
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



// Calcular el impuesto adeudado (Tax Due) 
export function calculateTaxDue(filingStatus, taxableIncome) {
  const brackets = taxBrackets[filingStatus];
  let tax = 0;
  let accumulatedTax = 0;

  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    if (taxableIncome > bracket.start) {
      const amountInBracket = Math.min(taxableIncome, bracket.end) - bracket.start;
      tax += amountInBracket * bracket.rate;
      accumulatedTax += amountInBracket * bracket.rate;
    } else {
      break; 
    }
  }

  return parseFloat(accumulatedTax.toFixed(2));
}


// Calcular el impuesto adeudado (Tax Due)  2
export function calculateTaxDue2(filingStatus, taxableIncome2) {
  taxableIncome2 = parseFloat(taxableIncome2.toFixed(2));

  const brackets = taxBrackets[filingStatus];
  let tax = 0;
  let accumulatedTax = 0;

 
  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    if (taxableIncome2 > bracket.start) {
      const amountInBracket = Math.min(taxableIncome2, bracket.end) - bracket.start;
      tax += amountInBracket * bracket.rate;  
      accumulatedTax += parseFloat((amountInBracket * bracket.rate).toFixed(2)); 
    } else {
      break; 
    }
  }


  return parseFloat(accumulatedTax.toFixed(2));
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

