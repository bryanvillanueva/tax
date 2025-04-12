import React, { useState } from "react";
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

const OilAndGasMLPForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Campos específicos para Oil and Gas - MLP
  const [investmentInMLP, setInvestmentInMLP] = useState("");
  const [estimatedAnnualDistribution, setEstimatedAnnualDistribution] = useState("");
  const [annualDistribution, setAnnualDistribution] = useState(0);
  const [taxpayerMarginalRate, setTaxpayerMarginalRate] = useState("");
  const [taxDeferred, setTaxDeferred] = useState(0);

  const { performCalculations } = useCalculations();





  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }

    if (!investmentInMLP || parseFloat(investmentInMLP) <= 0) {
      setError("Investment in MLP is required and must be greater than 0.");
      return;
    }

    if (!estimatedAnnualDistribution || parseFloat(estimatedAnnualDistribution) <= 0) {
      setError("Estimated Annual Distribution is required and must be greater than 0.");
      return;
    }

    if (!taxpayerMarginalRate || parseFloat(taxpayerMarginalRate) <= 0) {
      setError("Taxpayer Marginal Rate is required and must be greater than 0.");
      return;
    }

    setError(null);

    // Calcular valores
    const IMLP = parseFloat(investmentInMLP);
    const EAD = parseFloat(estimatedAnnualDistribution) / 100; // Convertir a decimal
    const TMR = parseFloat(taxpayerMarginalRate) / 100; // Convertir a decimal

    // Calcular Annual Distribution (AD)
    const AD = IMLP * EAD;
    setAnnualDistribution(AD);

    // Calcular Tax Deferred (TD)
    const TD = AD * TMR;
    setTaxDeferred(TD);


    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID),
      investmentInMLP: IMLP,
      estimatedAnnualDistribution: EAD,
      annualDistribution: AD,
      taxpayerMarginalRate: TMR,
      taxDeferred: TD,
      calculationType: "OilAndGasMLP",
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: "relative", mt: 5 }}>
        <Box sx={{ position: "absolute", top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S59.pdf"
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
                label="Investment in MLP (IMLP)"
                fullWidth
                type="number"
                value={investmentInMLP}
                onChange={(e) => setInvestmentInMLP(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Estimated Annual Distribution (EAD) (%)"
                fullWidth
                type="number"
                value={estimatedAnnualDistribution}
                onChange={(e) => setEstimatedAnnualDistribution(e.target.value)}
                margin="normal"
              />
          
            </Grid>

            <Grid item xs={12} md={6}>
            <TextField
                label="Taxpayer Marginal Rate (TMR) (%)"
                fullWidth
                type="number"
                value={taxpayerMarginalRate}
                onChange={(e) => setTaxpayerMarginalRate(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Annual Distribution (AD)"
                fullWidth
                type="number"
                value={annualDistribution.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Tax Deferred (TD)"
                fullWidth
                type="number"
                value={taxDeferred.toFixed(2)}
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
                <MenuItem value="1040 - Schedule C/F">1040 - Schedule C/F</MenuItem>
                <MenuItem value="1040NR - Schedule E">1040NR - Schedule E</MenuItem>
                <MenuItem value="1065">1065</MenuItem>
                <MenuItem value="1120S">1120S</MenuItem>
                
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

export default OilAndGasMLPForm;
