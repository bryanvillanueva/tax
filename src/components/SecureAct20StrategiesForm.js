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

const SecureAct20StrategiesForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Campos específicos para Secure Act 2.0
  const [meetsAgeRequirements, setMeetsAgeRequirements] = useState("No");
  const [additionalAnnualContribution, setAdditionalAnnualContribution] = useState("");
  const [estimatedYearsContributions, setEstimatedYearsContributions] = useState("");
  const [accountInterestRate, setAccountInterestRate] = useState("");
  const [taxpayerMarginalRate, setTaxpayerMarginalRate] = useState("");
  const [interestIncome, setInterestIncome] = useState(0);
  const [estimatedTaxDeferred, setEstimatedTaxDeferred] = useState(0);

  const { performCalculations } = useCalculations();

  // Función para calcular el Valor Futuro (similar a la función VF de Excel)
  const calculateFutureValue = (rate, nper, pmt) => {
    const r = rate / 100; // Convertir tasa a decimal
    return pmt * (Math.pow(1 + r, nper) - 1) / r;
  };

  // Efecto para calcular Interest Income
  useEffect(() => {
    if (accountInterestRate && estimatedYearsContributions && additionalAnnualContribution) {
      const rate = parseFloat(accountInterestRate) / 100; // Convertir tasa a decimal
      const years = parseFloat(estimatedYearsContributions);
      const contribution = parseFloat(additionalAnnualContribution);
      
      // Cálculo del Valor Futuro sin el negativo
      const II = contribution * (Math.pow(1 + rate, years) - 1) / rate;
      
      setInterestIncome(II);
    }
  }, [accountInterestRate, estimatedYearsContributions, additionalAnnualContribution]);

  // Efecto para calcular Estimated Tax Deferred
  useEffect(() => {
    if (taxpayerMarginalRate && interestIncome) {
      const ETD = (parseFloat(taxpayerMarginalRate) / 100) * interestIncome;
      setEstimatedTaxDeferred(ETD);
    }
  }, [taxpayerMarginalRate, interestIncome]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }

    if (!additionalAnnualContribution || parseFloat(additionalAnnualContribution) <= 0) {
      setError("Additional Annual Contribution is required and must be greater than 0.");
      return;
    }

    if (!estimatedYearsContributions || parseFloat(estimatedYearsContributions) <= 0) {
      setError("Estimated Years for Contributions is required and must be greater than 0.");
      return;
    }

    if (!accountInterestRate || parseFloat(accountInterestRate) < 0) {
      setError("Account Interest Rate is required and must be a valid percentage.");
      return;
    }

    if (!taxpayerMarginalRate || parseFloat(taxpayerMarginalRate) < 0 || parseFloat(taxpayerMarginalRate) > 100) {
      setError("Taxpayer Marginal Rate must be between 0 and 100.");
      return;
    }

    setError(null);

    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID) || 0,
      meetsAgeRequirements,
      additionalAnnualContribution: parseFloat(additionalAnnualContribution),
      estimatedYearsContributions: parseFloat(estimatedYearsContributions),
      accountInterestRate: parseFloat(accountInterestRate),
      taxpayerMarginalRate: parseFloat(taxpayerMarginalRate),
      interestIncome,
      estimatedTaxDeferred,
      calculationType: "SecureAct20Strategies",
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: "relative", mt: 5 }}>
        <Box sx={{ position: "absolute", top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S70.pdf"
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
                select
                label="Meets Age Requirements (TMAR)"
                fullWidth
                value={meetsAgeRequirements}
                onChange={(e) => setMeetsAgeRequirements(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>

              <TextField
                label="Additional Annual Contribution (AACI)"
                fullWidth
                type="number"
                value={additionalAnnualContribution}
                onChange={(e) => setAdditionalAnnualContribution(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Estimated Years for Contributions (EYAD)"
                fullWidth
                type="number"
                value={estimatedYearsContributions}
                onChange={(e) => setEstimatedYearsContributions(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Account Interest Rate (IAIR) %"
                fullWidth
                type="number"
                value={accountInterestRate}
                onChange={(e) => setAccountInterestRate(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Taxpayer Marginal Rate (TMTR) %"
                fullWidth
                type="number"
                value={taxpayerMarginalRate}
                onChange={(e) => setTaxpayerMarginalRate(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Interest Income (II)"
                fullWidth
                type="number"
                value={interestIncome.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Estimated Tax Deferred - IRA Account (ETDI)"
                fullWidth
                type="number"
                value={estimatedTaxDeferred.toFixed(2)}
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

export default SecureAct20StrategiesForm; 
