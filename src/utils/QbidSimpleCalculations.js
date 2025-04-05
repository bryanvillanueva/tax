// QBID Simple Calculations
const performQBIDCalculationsSimple = (params) => {
    const {
        calculationType,
        filingStatus,
        qualifiedBusinessIncome,
        threshold,
        component,
        qbid,
        taxableIncomeBeforeQbid,
        capitalGain,
        totalIncomeLessCapitalGain,
        componentIncomeLimitation,
        qbidLimit,
        smallerOfQbidAndLimit,
        finalTaxableIncome,
    } = params;

    // Return object structure matching what component expects
    return {
        qualifiedBusinessIncome, // Mantén el nombre original
        filingStatus,
        threshold,
        component,
        qbid,
        taxableIncomeBeforeQbid,
        capitalGain,
        totalIncomeLessCapitalGain,
        componentIncomeLimitation,
        qbidLimit,
        smallerOfQbidAndLimit,
        finalTaxableIncome,
    };
};

export default performQBIDCalculationsSimple;