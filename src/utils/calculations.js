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


// Calcular el Self-Employment Tax Total
export function calculateSelfEmploymentTax(netIncome) {
  if (netIncome <= 0) return 0;

  // Calcular SE Income para Social Security (92.35% del Net Income)
  const seIncomeForSocialSecurity = netIncome * seBaseMultiplier;
  console.log('SE Income for Social Security:', seIncomeForSocialSecurity);
  const socialSecurity = Math.min(seIncomeForSocialSecurity, socialSecurityWageBase) * socialSecurityRate; // 12.4% para Social Security
  console.log('Social Security Tax:', socialSecurity);
  console.log('Social Security WabeBase:', socialSecurityWageBase);


  // Calcular Medicare Tax directamente del Net Income (sin aplicar el 92.35%)
  const medicare = netIncome * medicareRate;

  // Devolver la suma de Social Security Tax y Medicare Tax
  return socialSecurity + medicare;
}


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

// Obtener el Marginal Tax Rate y el Income Level
export function getMarginalTaxRateAndLevel(filingStatus, taxableIncome) {
  const brackets = taxBrackets[filingStatus];
  let marginalRate = 0;
  let level = 0;

  for (let i = 0; i < brackets.length; i++) {
    // Verifica si el ingreso está dentro del rango actual
    if (taxableIncome >= brackets[i].start && taxableIncome <= brackets[i].end) {
      marginalRate = brackets[i].rate;
      level = i; // Asigna el índice como nivel
      break; // Detén el bucle una vez encontrado
    }
  }

  return { marginalRate, level };
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

// Calcular Additional Medicare Tax
export function calculateAdditionalMedicare(filingStatus, netIncome) {
  const threshold = additionalMedicareThreshold[filingStatus];
  return netIncome > threshold ? (netIncome - threshold) * additionalMedicareRate : 0;
}

// Obtener la Self-Employment Rate fija (15.3%)
export function getSelfEmploymentRate() {
  return 15.3; // 12.4% para Social Security + 2.9% para Medicare
}

