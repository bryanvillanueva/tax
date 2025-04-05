// QbidStandarCalculations.js
const performQBIDCalculations = (params) => {
  const {
    filingStatus,
    threshold,
    qualifiedBusinessIncome,
    componentRate,
    w2Wages,
    component50,
    component25,
    ubia,
    componentUbia,
    taxableIncomeBeforeQbid,
    phasedInThreshold,
    phaseInRange,
    patronReduction,
  } = params;

  // Cálculos básicos (Standard Method)
  const qbiValue = qualifiedBusinessIncome;
  const calculatedQbid = qbiValue * componentRate;
  const totalComponent50 = w2Wages * component50;
  const totalComponent25PlusUbia = (w2Wages * component25) + (ubia * componentUbia);
  const greaterComponent = Math.max(totalComponent50, totalComponent25PlusUbia);

  // Se determina el menor entre QBID calculado y el mayor componente
  let smallerQbidComponent;
  if (qbiValue < threshold) {
    smallerQbidComponent = calculatedQbid;
  } else {
    smallerQbidComponent = Math.min(calculatedQbid, greaterComponent);
  }

  // Cálculos de la sección Phased-In
  const phasedInQbid = calculatedQbid; // PI-QBID = SM-QBID
  const phasedInGreaterComponent = greaterComponent; // PI-GC = SM-GC
  const amountApplicableToPhaseIn = Math.max(phasedInQbid - phasedInGreaterComponent, 0); // PI-AAPI
  const taxableIncome = taxableIncomeBeforeQbid; // PI-TIBQ (valor ingresado por el usuario)
  const amountOverThreshold = Math.max(taxableIncome - phasedInThreshold, 0); // PI-AMT
  const phaseInPercentage = phaseInRange > 0 ? Math.min(amountOverThreshold / phaseInRange, 1) : 0; // PI-PIP
  const totalPhaseInReduction = amountApplicableToPhaseIn * phaseInPercentage; // PI-TPIR
  const qbidAfterPhaseInReduction = phasedInQbid - totalPhaseInReduction; // PI-QAPI

  // Cálculos finales del QBID
  const qbidLimit = taxableIncome * 0.2; // Q-QL
  const maxValue = qbidAfterPhaseInReduction >= smallerQbidComponent ? qbidAfterPhaseInReduction : smallerQbidComponent;
  const afterPatron = maxValue - patronReduction;
  const totalQbid = afterPatron >= qbidLimit ? qbidLimit : afterPatron; // Q-TQBID

  return {
    filingStatus,
    threshold,
    qualifiedBusinessIncome: qbiValue,
    qbid: calculatedQbid,
    w2Wages,
    ubia,
    totalComponent50,
    totalComponent25PlusUbia,
    greaterComponent,
    smallerQbidComponent,
    componentRate,    // 0.20
    component50,      // 0.50
    component25,      // 0.25
    componentUbia,    // 0.025
    phaseInRange,     
    
    // Campos de la sección Phased-In
    phasedInQbid,
    phasedInGreaterComponent,
    amountApplicableToPhaseIn,
    taxableIncomeBeforeQbid,
    phasedInThreshold,
    amountOverThreshold,
    phaseInRange,
    phaseInPercentage,
    totalPhaseInReduction,
    qbidAfterPhaseInReduction,
    // Campos de QBID final
    patronReduction,
    qbidLimit,
    totalQbid,
  };
};

export default performQBIDCalculations;
