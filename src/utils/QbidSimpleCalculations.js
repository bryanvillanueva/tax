// QBID Simple Calculations
const performQBIDCalculationsSimple = (params) => {
    const {
        calculationType,
        filingStatus,
        qualifiedBusinessIncome,  // Changed from qbi to match component call
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
        qbi: qualifiedBusinessIncome, // Map qualifiedBusinessIncome to qbi in result
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