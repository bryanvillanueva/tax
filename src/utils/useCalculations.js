import {
    calculateNetIncome,
    calculateNetIncomeAugusta,
    calculateNetIncomeCRT,
    calculateSelfEmploymentTax,
    calculateNetIncomeKids,
    calculateReimbursment,
    calculateSEMedicare,
    calculateAGI,
    calculateTaxableIncome,
    calculateTaxableIncome2,
    getMarginalTaxRateAndLevel,
    calculateTaxDue,
    calculateAdditionalMedicare,
    calculateAdditionalMedicare2,
    getSelfEmploymentRate,
    calculateTaxDue2,
    getMarginalTaxRateAndLevel2,
    calculateNetIncomePrepaid
  } from '../utils/calculations';
  import { standardDeductions } from '../utils/taxData';
  
  const useCalculations = () => {
    const performCalculations = ({
        filingStatus,
        grossIncome,
        cost,
        investType,
        partnerType,
        averageMonthlyRent,
        daysOfRent,
        totalExpenses,
        totalNonPrepaidExpenses,
        totalDeduction,
        capitalGain,
        presentValue,
        tve,
        pbuv,
        calculationType = 'standard',
      }) => {
        // Calcular Net Income según el tipo de cálculo
        let netIncome;
      
        switch (calculationType) {
            case 'charitableRemainderTrust':
              const resultCRT = calculateNetIncomeCRT(grossIncome, capitalGain, presentValue, filingStatus);
              netIncome = resultCRT.netIncomeCRT;
              break;
            case 'augusta':
              netIncome = calculateNetIncomeAugusta(grossIncome, averageMonthlyRent, daysOfRent);
              break;
            case 'prepaid':
              netIncome = calculateNetIncomePrepaid(grossIncome, totalExpenses, totalNonPrepaidExpenses);
              break;
            case 'hireKids':
              netIncome = calculateNetIncomeKids(grossIncome, totalDeduction);
              break;
            case 'reimbursment':
              const reimbursment = calculateReimbursment(grossIncome, tve, pbuv);
              netIncome = grossIncome - reimbursment;
        break;
            case 'standard':
            default:
              netIncome = calculateNetIncome(grossIncome, cost, investType);
          }
  
      // Cálculo para 1040/1040NR
      const seSocialSecurity = partnerType === 'Active' ? (netIncome * 0.9235) * 0.124 : 0;
      const seMedicare = partnerType === 'Active' ? calculateSEMedicare(netIncome) : 0;
      const selfEmploymentTax = partnerType === 'Active' ? seSocialSecurity + seMedicare : 0;
      const agi = calculateAGI(netIncome, selfEmploymentTax);
      const standardDeduction = standardDeductions[filingStatus];
      const taxableIncome = calculateTaxableIncome(agi, filingStatus);
      const { marginalRate, level } = getMarginalTaxRateAndLevel(filingStatus, taxableIncome);
      const taxDue = calculateTaxDue(filingStatus, taxableIncome);
      const additionalMedicare = calculateAdditionalMedicare(filingStatus, netIncome);
      const selfEmploymentRate = partnerType === 'Active' ? getSelfEmploymentRate() : 0;
      const totalTaxDue = taxDue + selfEmploymentTax + additionalMedicare;
      const effectiveTaxRate = taxableIncome !== 0 ? ((taxDue / taxableIncome) * 100).toFixed(2) : '0.00';
      const seDeduction = selfEmploymentTax / 2;
  
      // Resultados adicionales para cálculos alternativos
      const seSocialSecurity2 = partnerType === 'Active' ? (grossIncome * 0.9235) * 0.124 : 0;
      const seMedicare2 = partnerType === 'Active' ? calculateSEMedicare(grossIncome) : 0;
      const selfEmploymentTax2 = partnerType === 'Active' ? seSocialSecurity2 + seMedicare2 : 0;
      const seDeduction2 = selfEmploymentTax2 / 2;
      const netIncome2 = grossIncome;
      const agi2 = netIncome2 - selfEmploymentTax2 / 2;
      const taxableIncome2 = calculateTaxableIncome2(agi2, filingStatus);
      const taxDue2 = calculateTaxDue2(filingStatus, taxableIncome2);
      const additionalMedicare2 = calculateAdditionalMedicare2(filingStatus, netIncome2);
      const totalTaxDue2 = taxDue2 + selfEmploymentTax2 + additionalMedicare2;
      const effectiveTaxRate2 = taxableIncome2 !== 0 ? ((taxDue2 / taxableIncome2) * 100).toFixed(2) : '0.00';
      const { marginalRate2, level2 } = getMarginalTaxRateAndLevel2(filingStatus, taxableIncome2);
  
      // Cálculo para Corporations (1120)
      const corpTaxableIncome = netIncome;
      const corpTaxableIncome2 = netIncome2;
      const corpTaxDue = corpTaxableIncome * 0.21;
      const corpTaxDue2 = corpTaxableIncome2 * 0.21;
      const corpEffectiveTaxRate = corpTaxableIncome !== 0 ? ((corpTaxDue / corpTaxableIncome) * 100).toFixed(2) : '0.00';
  
      return {
        netIncome,
        netIncome2,
        corpTaxableIncome2,
        selfEmploymentRate,
        corpTaxDue2,
        agi,
        agi2,
        standardDeduction,
        taxableIncome,
        taxableIncome2,
        marginalRate: (marginalRate * 100).toFixed(2),
        incomeLevel: level,
        taxDue,
        taxDue2,
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
        totalTaxDue,
        corpTaxableIncome,
        corpTaxDue,
        effectiveTaxRate,
        effectiveTaxRate2,
        corpEffectiveTaxRate,
        seDeduction,
        seSocialSecurity2,
        seMedicare2,
        selfEmploymentTax2,
      };
    };
  
    return { performCalculations };
  };
  
  export default useCalculations;
  