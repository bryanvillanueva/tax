import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  MenuItem,
  Alert,
  Grid,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import useCalculations from "../utils/useCalculations";

const RealEstateDevelopmentCharitableOptionForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1065");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Nuevos campos específicos
  const [initialInvestment, setInitialInvestment] = useState("");
  const [estimatedIncomeRate, setEstimatedIncomeRate] = useState("");
  const [fairMarketValue, setFairMarketValue] = useState("");
  const [estimatedAnnualIncome, setEstimatedAnnualIncome] = useState(0);
  const [amountDonation, setAmountDonation] = useState("");
  const [partnerMarginalRate, setPartnerMarginalRate] = useState("");
  const [estimatedTaxSavings, setEstimatedTaxSavings] = useState(0);

  const { performCalculations } = useCalculations();

  // Efecto para calcular Estimated Annual Income
  useEffect(() => {
    if (initialInvestment && estimatedIncomeRate) {
      const EAI = parseFloat(initialInvestment) * (parseFloat(estimatedIncomeRate) / 100);
      setEstimatedAnnualIncome(EAI);
    }
  }, [initialInvestment, estimatedIncomeRate]);

  // Efecto para calcular Estimated Tax Savings
  useEffect(() => {
    if (amountDonation && partnerMarginalRate) {
      const ETS = parseFloat(amountDonation) * (parseFloat(partnerMarginalRate) / 100);
      setEstimatedTaxSavings(ETS);
    }
  }, [amountDonation, partnerMarginalRate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }

    if (!initialInvestment || parseFloat(initialInvestment) <= 0) {
      setError("Initial Investment is required and must be greater than 0.");
      return;
    }

    if (!estimatedIncomeRate || parseFloat(estimatedIncomeRate) < 0) {
      setError("Estimated Income Rate is required and must be a valid percentage.");
      return;
    }

    if (!fairMarketValue || parseFloat(fairMarketValue) <= 0) {
      setError("Fair Market Value is required and must be greater than 0.");
      return;
    }

    if (!amountDonation || parseFloat(amountDonation) <= 0) {
      setError("Amount of Donation is required and must be greater than 0.");
      return;
    }

    if (!partnerMarginalRate || parseFloat(partnerMarginalRate) < 0) {
      setError("Partner Marginal Rate is required and must be a valid percentage.");
      return;
    }

    setError(null);

    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID) || 0,
      initialInvestment: parseFloat(initialInvestment),
      estimatedIncomeRate: parseFloat(estimatedIncomeRate),
      fairMarketValue: parseFloat(fairMarketValue),
      estimatedAnnualIncome,
      amountDonation: parseFloat(amountDonation),
      partnerMarginalRate: parseFloat(partnerMarginalRate),
      estimatedTaxSavings,
      calculationType: "RealEstateDevelopmentCharitable",
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: "relative", mt: 5 }}>
        <Box sx={{ position: "absolute", top: -10, right: 0 }}>
          <Button
            href="https://tax.bryanglen.com/data/Strategies-Structure.pdf"
            target="_blank"
            sx={{
              textTransform: "none",
              backgroundColor: "#ffffff",
              color: "#0858e6",
              fontSize: "0.875rem",
              marginBottom: "150px",
            }}
            startIcon={<InfoOutlinedIcon />}
          >
            View Strategy Details
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Filing Status"
                fullWidth
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="MFJ">Married Filing Jointly</MenuItem>
                <MenuItem value="MFS">Married Filing Separately</MenuItem>
                <MenuItem value="HH">Head of Household</MenuItem>
                <MenuItem value="QSS">Qualified Surviving Spouse</MenuItem>
              </TextField>
              <TextField
                label="Gross Income"
                fullWidth
                type="number"
                value={grossIncome}
                onChange={(e) => setGrossIncome(e.target.value)}
                margin="normal"
              />
              <TextField
                select
                label="Type of Partner"
                fullWidth
                value={partnerType}
                onChange={(e) => setPartnerType(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Passive">Passive</MenuItem>
              </TextField>
              <TextField
                label="Initial Investment in Real Estate (IVRE)"
                fullWidth
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Estimated Income Rate (EIR) %"
                fullWidth
                type="number"
                value={estimatedIncomeRate}
                onChange={(e) => setEstimatedIncomeRate(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Real Estate Fair Market Value (REFMV)"
                fullWidth
                type="number"
                value={fairMarketValue}
                onChange={(e) => setFairMarketValue(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Estimated Annual Income (EAI)"
                fullWidth
                type="number"
                value={estimatedAnnualIncome.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Amount of Donation (AD)"
                fullWidth
                type="number"
                value={amountDonation}
                onChange={(e) => setAmountDonation(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Partner Marginal Rate (PMR) %"
                fullWidth
                type="number"
                value={partnerMarginalRate}
                onChange={(e) => setPartnerMarginalRate(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Estimated Tax Savings (ETS)"
                fullWidth
                type="number"
                value={estimatedTaxSavings.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                select
                label="Form Type"
                fullWidth
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                margin="normal"
              >
                
                <MenuItem value="1065">1065</MenuItem>
               
              </TextField>
              <TextField
                label="QBID (Qualified Business Income Deduction)"
                fullWidth
                type="number"
                value={QBID}
                onChange={(e) => setQbid(e.target.value)}
                margin="normal"
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "#0858e6", color: "#fff" }}
            >
              Calculate
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default RealEstateDevelopmentCharitableOptionForm; 