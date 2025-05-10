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
// Si partnershipShare es null o undefined, usa la lógica original;
// si tiene valor, aplica la parte proporcional.
export function calculateNetIncome(grossIncome, deduction179, partnershipShare) {
  // 1. Si no hay valor en partnershipShare, aplicar la resta directa
  if (partnershipShare == null  || partnershipShare === 0) {
    return Math.max(0, grossIncome - deduction179);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y deducción
  const incomeShare    = grossIncome  * shareRatio;  // equivalente a C18*C19
  const deductionShare = deduction179 * shareRatio;  // equivalente a D9*C19

  // 4. Resta y evitar negativos
  const netIncome = incomeShare - deductionShare;
  return Math.max(0, netIncome);
}


// Calcular el Net Income para Hire Your Kids
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeKids(grossIncome, hireKidsDeduction, partnershipShare) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - hireKidsDeduction);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y deducción
  const incomeShare    = grossIncome        * shareRatio;  // grossIncome * ratio
  const deductionShare = hireKidsDeduction  * shareRatio;  // hireKidsDeduction * ratio

  // 4. Resta y evitar resultados negativos
  const netIncome = incomeShare - deductionShare;
  return Math.max(0, netIncome);
}



// Calcular el Net Income para Prepaid Expenses
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomePrepaid(grossIncome, totalExpenses, partnershipShare) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - totalExpenses);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y gastos
  const incomeShare  = grossIncome   * shareRatio;
  const expenseShare = totalExpenses * shareRatio;

  // 4. Resta y evitar resultados negativos
  const netIncome = incomeShare - expenseShare;
  return Math.max(0, netIncome);
}



// Calcular el Net Income según el tipo de inversión (Augusta Rule)
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeAugusta(
  grossIncome,
  averageMonthlyRent,
  daysOfRent,
  partnershipShare
) {
  // 1. Calcular la deducción total según Augusta Rule
  const totalDeduction = (averageMonthlyRent / 30) * daysOfRent;

  // 2. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - totalDeduction);
  }

  // 3. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 4. Calcular la parte proporcional de ingresos y deducción
  const incomeShare    = grossIncome    * shareRatio;
  const deductionShare = totalDeduction * shareRatio;

  // 5. Resta y evitar resultados negativos
  const netIncome = incomeShare - deductionShare;
  return Math.max(0, netIncome);
}



// Calcular el Net Income para Charitable Remainder Trust (CRT)
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeCRT(grossIncome, partnershipShare) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // 4. Evitar resultados negativos (aunque aquí incomeShare nunca será negativo)
  return Math.max(0, incomeShare);
}



// Calcular el Net Income para Reimbursment
// Añadida validación de partnershipShare igual que en calculateNetIncome
export function calculateReimbursment(grossIncome, tve, pbuv, partnershipShare) {
  // 1. Validar inputs obligatorios
  if (grossIncome <= 0 || tve <= 0 || pbuv <= 0 || pbuv > 100) {
    throw new Error('Invalid input: All values must be > 0, and PBUV must be between 0 and 100.');
  }

  // 2. Calcular el monto de reimbursment
  const reimbursment = tve * (pbuv / 100);

  // 3. Si partnershipShare es null, undefined o 0, uso la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - reimbursment);
  }

  // 4. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 5. Calcular parte proporcional de ingresos y reimbursment
  const incomeShare          = grossIncome   * shareRatio;
  const reimbursmentShare    = reimbursment * shareRatio;

  // 6. Resta proporcional y evitar negativos
  const netIncome = incomeShare - reimbursmentShare;
  return Math.max(0, netIncome);
}


// Calcular el Net Income para Hire Your Family
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeFamily(
  grossIncome,
  hireFamilyDeduction,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - hireFamilyDeduction);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y deducción
  const incomeShare    = grossIncome         * shareRatio;
  const deductionShare = hireFamilyDeduction * shareRatio;

  // 4. Resta proporcional y evitar negativos
  const netIncome = incomeShare - deductionShare;
  return Math.max(0, netIncome);
}


// Calcular el Net Income para Qualified Opportunity Funds (QOF)
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeQOF(
  grossIncome,
  reductionInNetIncome,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - reductionInNetIncome);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y reducción
  const incomeShare    = grossIncome           * shareRatio;
  const reductionShare = reductionInNetIncome  * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  const netIncome = incomeShare - reductionShare;
  return Math.max(0, netIncome);
}


// Calcular el Net Income para Health Savings Accounts (HSA)
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeHSA(
  grossIncome,
  hsaContribution,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - hsaContribution);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y contribución HSA
  const incomeShare       = grossIncome      * shareRatio;
  const contributionShare = hsaContribution  * shareRatio;

  // 4. Resta proporcional y evitar negativos
  const netIncome = incomeShare - contributionShare;
  return Math.max(0, netIncome);
}


// Calcular el Net Income para Lifetime Learning Credit
// Cuando no hay deducción ni contribución, tratamos deduction = 0
// y aplicamos partnershipShare igual que en calculateNetIncome:
export function calcualteNetIncomeLifeTimeLearningCredit(
  grossIncome,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original (grossIncome - 0)
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // 4. Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para amendedPriorYears (Amanda)
// Cuando no hay deducción ni contribución, tratamos deduction179 = 0
// y aplicamos partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeAmanda(grossIncome, partnershipShare) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  //    (equivale a grossIncome - 0)
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // 4. Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Exemption Qualified Small
// Cuando no hay deducción ni contribución, tratamos deduction = 0
// y aplicamos partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeExemptionQualifiedSmall(
  grossIncome,
  capitalGainQSBS,    // se ignora aquí, dado que no afecta el cálculo base
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  //    (equivale a grossIncome - 0)
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // 4. Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para costSegregation
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeCostSegregation(
  grossIncome,
  deduction,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - deduction);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y deducción
  const incomeShare    = grossIncome * shareRatio;
  const deductionShare = deduction  * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  const netIncome = incomeShare - deductionShare;
  return Math.max(0, netIncome);
}


// Calcular el Net Income para Accountable Plan
// Añadida validación de partnershipShare como en calculateNetIncome:
export function calculateNetIncomeAccountableplan(
  grossIncome,
  totalReimbursableExpenses,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - totalReimbursableExpenses);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y gastos reembolsables
  const incomeShare   = grossIncome               * shareRatio;
  const expenseShare  = totalReimbursableExpenses * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  const netIncome = incomeShare - expenseShare;
  return Math.max(0, netIncome);
}


// Calcular el Net Income para Adoption Plan
// Cuando no hay deducción, tratamos deduction = 0
// y aplicamos partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeAdoptionPlan(
  grossIncome,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original (grossIncome - 0)
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // 4. Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Active Real Estate
// Cuando no hay deducción, tratamos deduction = 0
// y aplicamos partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeActiveRealEstate(
  grossIncome,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original (grossIncome - 0)
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // 4. Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Backdoor Roth
// Cuando no hay deducción, tratamos deduction = 0
// y aplicamos partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeBackdoorRoth(
  grossIncome,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original (grossIncome - 0)
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // 4. Evitar resultados negativos
  return Math.max(0, incomeShare);
}



// Calcular el Net Income para Cancellation By Insolvency
// Añadida validación de partnershipShare como en calculateNetIncome:
export function calculateNetIncomeCancellationByInsolvency(
  grossIncome,
  deductionCancellation,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - deductionCancellation);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y deducción
  const incomeShare     = grossIncome           * shareRatio;
  const deductionShare  = deductionCancellation * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  const netIncome = incomeShare - deductionShare;
  return Math.max(0, netIncome);
}

// Calcular el Net Income para Savings Plan
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeSavingsPlan(
  grossIncome,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // 4. Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Education Assistance
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeEducationAssistance(
  grossIncome,
  totalEducationalAssistance,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - totalEducationalAssistance);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y asistencia educativa
  const incomeShare      = grossIncome               * shareRatio;
  const assistanceShare  = totalEducationalAssistance * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  const netIncome = incomeShare - assistanceShare;
  return Math.max(0, netIncome);
}


// Calcular el Net Income para Education Tax Credit
// Cuando no hay deducción, tratamos deduction = 0
// y aplicamos partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeEducationTaxCredit(
  grossIncome,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original (grossIncome - 0)
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // 4. Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Health Reimbursement
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeHealthReimbursement(
  grossIncome,
  totalBenefits,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - totalBenefits);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y beneficios
  const incomeShare    = grossIncome     * shareRatio;
  const benefitShare   = totalBenefits   * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  const netIncome = incomeShare - benefitShare;
  return Math.max(0, netIncome);
}


// Calcular el Net Income para Income Shifting
// Añadida validación de partnershipShare como en calculateNetIncome:
export function calculateNetIncomeIncomeShifting(
  grossIncome,
  totalIncomeShifted,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - totalIncomeShifted);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y del monto desplazado
  const incomeShare   = grossIncome         * shareRatio;
  const shiftedShare  = totalIncomeShifted  * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  const netIncome = incomeShare - shiftedShare;
  return Math.max(0, netIncome);
}


// Calcular el Net Income para Life Insurance
// Añadida validación de partnershipShare como en calculateNetIncome:
export function calculateNetIncomeLifeInsurance(
  grossIncome,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // 4. Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Maximize Miscellaneous Expenses
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeMaximizeMiscellaneousExpenses(
  grossIncome,
  totalNetDeductionMaxi,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - totalNetDeductionMaxi);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y deducción
  const incomeShare    = grossIncome             * shareRatio;
  const deductionShare = totalNetDeductionMaxi   * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  const netIncome = incomeShare - deductionShare;
  return Math.max(0, netIncome);
}


// Calcular el Net Income para Meals Deduction
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeMealsDeduction(
  grossIncome,
  deductionMeals,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - deductionMeals);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y deducción de comidas
  const incomeShare    = grossIncome     * shareRatio;
  const deductionShare = deductionMeals * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  const netIncome = incomeShare - deductionShare;
  return Math.max(0, netIncome);
}


// Calcular el Net Income para Operating Losses
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeOperatingLosses(
  grossIncome,
  totalNOL,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - totalNOL);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y pérdidas operativas
  const incomeShare = grossIncome * shareRatio;
  const lossShare   = totalNOL     * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  const netIncome = incomeShare - lossShare;
  return Math.max(0, netIncome);
}


// Calcular el Net Income para Solo 401(k)
// Añadida validación de partnershipShare al igual que en calculateNetIncome:
export function calcularNetIncomeSolo401k(
  grossIncome,
  deductionSolo401k,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - deductionSolo401k);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y deducción
  const incomeShare    = grossIncome         * shareRatio;
  const deductionShare = deductionSolo401k   * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  const netIncome = incomeShare - deductionShare;
  return Math.max(0, netIncome);
}


// Calcular el Net Income para Research & Development Credit
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeResearchAndDevelopmentCredit(
  grossIncome,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // 4. Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Roth IRA
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeRothIRA(
  grossIncome,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original (grossIncome - 0)
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // 4. Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Health Insurance Deduction
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeHealthInsuranceDeduction(
  grossIncome,
  totalContribution,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - totalContribution);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y contribución
  const incomeShare        = grossIncome      * shareRatio;
  const contributionShare  = totalContribution * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  const netIncome = incomeShare - contributionShare;
  return Math.max(0, netIncome);
}


// Calcular el Net Income para Health Insurance Deduction 2
// Añadida validación de partnershipShare al igual que en calculateNetIncome:
export function calculateNetIncomeHealthInsuranceDeduction2(
  grossIncome,
  incomeReduction,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - incomeReduction);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y reducción
  const incomeShare     = grossIncome     * shareRatio;
  const reductionShare  = incomeReduction * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  const netIncome = incomeShare - reductionShare;
  return Math.max(0, netIncome);
}


// Calcular el Net Income para Simple IRA
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeSimpleIra(
  grossIncome,
  totalEmployerContribution,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - totalEmployerContribution);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y contribución del empleador
  const incomeShare       = grossIncome             * shareRatio;
  const contributionShare = totalEmployerContribution * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  const netIncome = incomeShare - contributionShare;
  return Math.max(0, netIncome);
}


// Calcular el Net Income para Startup Cost
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeStartupCost(
  grossIncome,
  deductionStartup,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - deductionStartup);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y deducción
  const incomeShare    = grossIncome      * shareRatio;
  const deductionShare = deductionStartup * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  const netIncome = incomeShare - deductionShare;
  return Math.max(0, netIncome);
}

// Calcular el Net Income para State Tax Savings
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeStateTaxSavings(
  grossIncome,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original (grossIncome - 0)
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // 4. Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Traditional IRA
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeTraditionalIRA(
  grossIncome,
  totalDeductionTraditionalIRA,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usar la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - totalDeductionTraditionalIRA);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y deducción
  const incomeShare    = grossIncome                  * shareRatio;
  const deductionShare = totalDeductionTraditionalIRA * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  const netIncome = incomeShare - deductionShare;
  return Math.max(0, netIncome);
}


// Calcular el Net Income para Unreimbursed Expenses
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeUnreimbursedExpenses(
  grossIncome,
  reductionUnreimbursed,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - reductionUnreimbursed);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y reducción no reembolsada
  const incomeShare     = grossIncome          * shareRatio;
  const reductionShare  = reductionUnreimbursed * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  const netIncome = incomeShare - reductionShare;
  return Math.max(0, netIncome);
}


// Calcular el Net Income para Charitable Donation Of Appreciated
// Añadida validación de partnershipShare como en calculateNetIncome:
export function calculateNetIncomeCharitableDonation(
  grossIncome,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original (grossIncome - 0)
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // 4. Evitar resultados negativos
  return Math.max(0, incomeShare);
}

// Calcular el Net Income para Influencer
// Añadida validación de partnershipShare como en calculateNetIncome:
export function calculateNetIncomeInfluencer(
  grossIncome,
  deductionInfluencer,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - deductionInfluencer);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y deducción
  const incomeShare    = grossIncome           * shareRatio;
  const deductionShare = deductionInfluencer   * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  const netIncome = incomeShare - deductionShare;
  return Math.max(0, netIncome);
}

// Calcular el Net Income para Deferred Capital Gain
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeCapital(
  grossIncome,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original (grossIncome - 0)
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // 4. Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Covul
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeCovul(
  grossIncome,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original (grossIncome - 0)
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // 4. Evitar resultados negativos
  return Math.max(0, incomeShare);
}

// Calcular el Net Income para Depletion Deduction
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeDepletionDeduction(
  grossIncome,
  yearDepletion,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - yearDepletion);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y deducción
  const incomeShare    = grossIncome   * shareRatio;
  const deductionShare = yearDepletion * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  const netIncome = incomeShare - deductionShare;
  return Math.max(0, netIncome);
}

// Calcular el Net Income para Qualified Dividends
// Añadida validación de partnershipShare como en calculateNetIncome:
export function calculateNetIncomeQualifiedDividends(
  grossIncome,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original (grossIncome - 0)
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // 4. Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Donor Advised Fund
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeDonorAdvisedFund(
  grossIncome,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original (grossIncome - 0)
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // 4. Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Electric Vehicle Credits
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeElectricVehicleCredits(
  grossIncome,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original (grossIncome - 0)
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // 4. Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Employee Stock Ownership Plan
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeEmployeeStockOwnershipPlan(
  grossIncome,
  sharesValueContributed,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - sharesValueContributed);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y contribución de acciones
  const incomeShare    = grossIncome             * shareRatio;
  const contributionShare = sharesValueContributed * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  const netIncome = incomeShare - contributionShare;
  return Math.max(0, netIncome);
}


// Calcular el Net Income para Federal Solar Investment Tax Credit
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeFederalSolarInvestmentTaxCredit(
  grossIncome,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original (grossIncome - 0)
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // 4. Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Financed Insurance for Business Risks
// Añadida validación de partnershipShare igual que en calculateNetIncome:
export function calculateNetIncomeFinancedInsurance(
  grossIncome,
  financedDeduction,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - financedDeduction);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y deducción financiada
  const incomeShare     = grossIncome        * shareRatio;
  const deductionShare  = financedDeduction  * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  const netIncome = incomeShare - deductionShare;
  return Math.max(0, netIncome);
}


// Calcular el Net Income para Financed Software Leaseback
// Añadida validación de partnershipShare al igual que calculateNetIncome:
export function calculateNetIncomeFinancedSoftware(
  grossIncome,
  softwareLeasebackDeduction,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - softwareLeasebackDeduction);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y deducción software
  const incomeShare    = grossIncome               * shareRatio;
  const deductionShare = softwareLeasebackDeduction * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  const netIncome = incomeShare - deductionShare;
  return Math.max(0, netIncome);
}


// Calcular el Net Income para Foreign Earned Income Exclusion
export function calculateNetIncomeForeignEarnedIncome(
  grossIncome,
  foreignDeduction,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, aplicamos la resta directa
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - foreignDeduction);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular parte proporcional de ingresos y deducción
  const incomeShare    = grossIncome      * shareRatio;
  const deductionShare = foreignDeduction * shareRatio;

  // Resta proporcional y evitar resultados negativos
  return Math.max(0, incomeShare - deductionShare);
}


// Calcular el Net Income para Group Health Insurance
export function calculateNetIncomeGroupHealthInsurance(
  grossIncome,
  groupHealthInsuranceDeduction,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, aplicamos la resta directa
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - groupHealthInsuranceDeduction);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular parte proporcional de ingresos y deducción de seguro
  const incomeShare    = grossIncome                   * shareRatio;
  const deductionShare = groupHealthInsuranceDeduction * shareRatio;

  // Resta proporcional y evitar resultados negativos
  return Math.max(0, incomeShare - deductionShare);
}


// Calcular el Net Income para Grouping Related Activities
export function calculateNetIncomeGroupingRelatedActivities(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Home Office Deduction
export function calculateNetIncomeHomeOfficeDeduction(
  grossIncome,
  homeOfficeDeduction,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, aplicamos la resta directa
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - homeOfficeDeduction);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular parte proporcional de ingresos y deducción de home office
  const incomeShare    = grossIncome             * shareRatio;
  const deductionShare = homeOfficeDeduction     * shareRatio;

  // Resta proporcional y evitar resultados negativos
  return Math.max(0, incomeShare - deductionShare);
}


// Calcular el Net Income para Historical Preservation Easement
export function calculateNetIncomeHistoricalPreservationEasement(
  grossIncome,
  partnershipShare
) {
  // Si partnershipShare es null, undefined o 0, devolvemos el grossIncome
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Installment Sale
export function calculateNetIncomeInstallmentSale(
  grossIncome,
  installmentSaleDeduction,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, aplicamos la resta directa
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - installmentSaleDeduction);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular parte proporcional de ingresos y deducción
  const incomeShare    = grossIncome               * shareRatio;
  const deductionShare = installmentSaleDeduction  * shareRatio;

  // Resta proporcional y evitar resultados negativos
  return Math.max(0, incomeShare - deductionShare);
}


// Calcular el Net Income para Maximize Itemization Strategies
export function calculateNetIncomeMaximizeItemization(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Noncash Charitable Contributions
export function calculateNetIncomeNoncashCharitableContributions(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Oil And Gas Drilling Cost
export function calculateNetIncomeOilAndGasDrillingCost(
  grossIncome,
  oilAndGasDrillingCostDeduction,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, aplicamos la resta directa
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - oilAndGasDrillingCostDeduction);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular parte proporcional de ingresos y deducción
  const incomeShare    = grossIncome                     * shareRatio;
  const deductionShare = oilAndGasDrillingCostDeduction  * shareRatio;

  // Resta proporcional y evitar resultados negativos
  return Math.max(0, incomeShare - deductionShare);
}


// Calcular el Net Income para Oil And Gas MLP
export function calculateNetIncomeOilAndGasMLP(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Ordinary Loss On Worthless Stock
export function calculateNetIncomeOrdinaryLossOnWorthlessStock(
  grossIncome,
  ordinaryLossDeduction,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, usamos la lógica original
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - ordinaryLossDeduction);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos y deducción
  const incomeShare    = grossIncome              * shareRatio;
  const deductionShare = ordinaryLossDeduction    * shareRatio;

  // 4. Resta proporcional y evitar resultados negativos
  return Math.max(0, incomeShare - deductionShare);
}

// Calcular el Net Income para Real Estate Development Charitable
export function calculateNetIncomeRealEstateDevelopmentCharitable(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Restricted Stock Units
export function calculateNetIncomeRestrictedStockUnits(
  grossIncome,
  partnershipShare
) {
  // Si partnershipShare es null, undefined o 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Retiree Planning
export function calculateNetIncomeRetireePlanning(
  grossIncome,
  partnershipShare
) {
  // Si partnershipShare es null, undefined o 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para S-Corp Revocation
export function calculateNetIncomeSCorpRevocation(
  grossIncome,
  partnershipShare
) {
  // Si partnershipShare es null, undefined o 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Secure Act 20 Strategies
export function calculateNetIncomeSecureAct20Strategies(
  grossIncome,
  partnershipShare
) {
  // Si partnershipShare es null, undefined o 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para PassThroughEntity
export function calculateNetIncomePassThroughEntity(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Passive Loss And Pigs
export function calculateNetIncomePassiveLossAndPigs(
  grossIncome,
  partnershipShare
) {
  // Si partnershipShare es null, undefined o 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Primary Sale Exclusion
export function calculateNetIncomePrimarySaleExclusion(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Private Family Foundation
export function calculateNetIncomePrivateFamilyFoundation(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Qualified Charitable Distributions
export function calculateNetIncomeQualifiedCharitableDistributions(
  grossIncome,
  totalDeductionQCDS,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, aplicamos la resta directa
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - totalDeductionQCDS);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular parte proporcional de ingresos y deducción
  const incomeShare    = grossIncome          * shareRatio;
  const deductionShare = totalDeductionQCDS   * shareRatio;

  // Resta proporcional y evitar resultados negativos
  return Math.max(0, incomeShare - deductionShare);
}


// Calcular el Net Income para Series I Bond
export function calculateNetIncomeSeriesIBond(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Short Term Rental
export function calculateNetIncomeShortTermRental(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Bonus Depreciation
export function calculateNetIncomeBonusDepreciation(
  grossIncome,
  bonusDepreciationDeduction,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, aplicamos la resta directa
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - bonusDepreciationDeduction);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular parte proporcional de ingresos y deducción
  const incomeShare    = grossIncome               * shareRatio;
  const deductionShare = bonusDepreciationDeduction * shareRatio;

  // Resta proporcional y evitar resultados negativos
  return Math.max(0, incomeShare - deductionShare);
}


// Calcular el Net Income para Solar Passive Investment
export function calculateNetIncomeSolarPassiveInvestment(
  grossIncome,
  SPID,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, aplicamos la resta directa
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - SPID);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular parte proporcional de ingresos y deducción
  const incomeShare    = grossIncome * shareRatio;
  const deductionShare = SPID         * shareRatio;

  // Resta proporcional y evitar resultados negativos
  return Math.max(0, incomeShare - deductionShare);
}


// Calcular el Net Income para Tax Free Income
export function calculateNetIncomeTaxFreeIncome(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Work Opportunity Tax Credit
export function calculateNetIncomeWorkOpportunityTaxCredit(
  grossIncome,
  workOpportunityTaxCreditDeduction,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, aplicamos la resta directa
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - workOpportunityTaxCreditDeduction);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular parte proporcional de ingresos y deducción
  const incomeShare    = grossIncome                        * shareRatio;
  const deductionShare = workOpportunityTaxCreditDeduction  * shareRatio;

  // Resta proporcional y evitar resultados negativos
  return Math.max(0, incomeShare - deductionShare);
}
 

// Calcular el Net Income para 1031 Exchange
export function calculateNetIncome1031Exchange(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Defined Benefit Plan
export function calculateNetIncomeDefinedBenefitPlan(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Structured Investment Program
export function calculateNetIncomeStructuredInvestmentProgram(
  grossIncome,
  structuredInvestmentProgramDeduction,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, aplicamos la resta directa
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome - structuredInvestmentProgramDeduction);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular parte proporcional de ingresos y deducción
  const incomeShare    = grossIncome                            * shareRatio;
  const deductionShare = structuredInvestmentProgramDeduction   * shareRatio;

  // Resta proporcional y evitar resultados negativos
  return Math.max(0, incomeShare - deductionShare);
}

// Calcular el Net Income para Self-Directed IRA & 401K
export function calculateNetIncomeSelfDirectedIRA401K(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Day Trader Tax Status
export function calculateNetIncomeDayTraderTaxStatus(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para College Student Strategies
export function calculateNetIncomeCollegeStudentStrategies(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Sell Home to S-Corp
export function calculateNetIncomeSellHomeToSCorp(
  grossIncome,
  partnershipShare
) {
  // 1. Si partnershipShare es null, undefined o 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // 2. Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // 3. Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // 4. Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Gifting Stock Strategy
export function calculateNetIncomeGiftingStockStrategy(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Real Estate Options
export function calculateNetIncomeRealEstateOptions(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Married Filing Separate
export function calculateNetIncomeMarriedFilingSeparate(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Individual Planning Ideas
export function calculateNetIncomeIndividualPlanningIdeas(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Net Investment Income Tax
export function calculateNetIncomeNetInvestmentIncomeTax(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Miscellaneous Tax Credits
export function calculateNetIncomeMiscTaxCredits(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Rental Strategies & 754 Election
export function calculateNetIncomeRentalStrategies754Election(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}

// Calcular el Net Income para Reasonable Compensation Analysis
export function calculateNetIncomeReasonableCompAnalysis(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Real Estate Professional
export function calculateNetIncomeRealEstateProfessional(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Captive Insurance
export function calculateNetIncomeCaptiveInsurance(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Charitable LLC
export function calculateNetIncomeCharitableLLC(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Sole Proprietor
export function calculateNetIncomeSoleProprietor(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Choice of Entity
export function calculateNetIncomeChoiceOfEntity(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Choice of Entity - C Corporation
export function calculateNetIncomeChoiceOfEntityCCorp(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Choice of Entity - Partnership
export function calculateNetIncomeChoiceOfEntityPartnership(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Choice of Entity - S Corporation
export function calculateNetIncomeChoiceOfEntitySCorp(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
}


// Calcular el Net Income para Harvesting Crypto Investors
export function calculateNetIncomeHarvestingCryptoInvestors(
  grossIncome,
  partnershipShare
) {
  // Si no hay partnershipShare o es 0, devolvemos el grossIncome directo
  if (partnershipShare == null || partnershipShare === 0) {
    return Math.max(0, grossIncome);
  }

  // Normalizar partnershipShare a decimal (0–1)
  const shareRatio = partnershipShare > 1
    ? partnershipShare / 100
    : partnershipShare;

  // Calcular la parte proporcional de ingresos
  const incomeShare = grossIncome * shareRatio;

  // Evitar resultados negativos
  return Math.max(0, incomeShare);
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



