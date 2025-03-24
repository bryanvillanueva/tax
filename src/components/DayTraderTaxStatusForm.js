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

const DayTraderTaxStatusForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Campos específicos para Day Trader Tax Status (TTS)
  const [TMEC, setTMEC] = useState("No"); // Taxpayer meets eligibility criteria
  const [GS, setGS] = useState(""); // Gains
  const [LS, setLS] = useState(""); // Losses
  const [RE, setRE] = useState(""); // Related Expenses
  const [NTI, setNTI] = useState(0); // Net Trading Income
  const [MTR, setMTR] = useState(""); // Marginal Tax Rate
  const [TS, setTS] = useState(0); // Tax Savings

  const { performCalculations } = useCalculations();

  // Efecto para calcular Net Trading Income (NTI)
  useEffect(() => {
    const gains = parseFloat(GS) || 0;
    const losses = parseFloat(LS) || 0;
    const expenses = parseFloat(RE) || 0;

    const netTradingIncome = gains - losses - expenses;
    setNTI(netTradingIncome);
  }, [GS, LS, RE]);

  // Efecto para calcular Tax Savings (TS)
  useEffect(() => {
    const losses = parseFloat(LS) || 0;
    const expenses = parseFloat(RE) || 0;
    const marginalTaxRate = parseFloat(MTR) || 0;

    const taxSavings = TMEC === "Yes" ? (losses + expenses) * marginalTaxRate / 100 : 0;
    setTS(taxSavings);
  }, [TMEC, LS, RE, MTR]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!GS || parseFloat(GS) < 0) {
      setError("Gains (GS) is required and must be a valid number.");
      return;
    }

    if (!LS || parseFloat(LS) < 0) {
      setError("Losses (LS) is required and must be a valid number.");
      return;
    }

    if (!RE || parseFloat(RE) < 0) {
      setError("Related Expenses (RE) is required and must be a valid number.");
      return;
    }

    if (!MTR || parseFloat(MTR) <= 0) {
      setError("Marginal Tax Rate (MTR) is required and must be greater than 0.");
      return;
    }

    setError(null);

    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID) || 0,
      TMEC,
      GS: parseFloat(GS),
      LS: parseFloat(LS),
      RE: parseFloat(RE),
      NTI,
      MTR: parseFloat(MTR),
      TS,
      calculationType: "DayTraderTaxStatus",
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
                select
                label="Taxpayer Meets Eligibility Criteria (TMEC)"
                fullWidth
                value={TMEC}
                onChange={(e) => setTMEC(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
              <TextField
                label="Gains (GS)"
                fullWidth
                type="number"
                value={GS}
                onChange={(e) => setGS(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Losses (LS)"
                fullWidth
                type="number"
                value={LS}
                onChange={(e) => setLS(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Related Expenses (RE)"
                fullWidth
                type="number"
                value={RE}
                onChange={(e) => setRE(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Net Trading Income (NTI)"
                fullWidth
                type="number"
                value={NTI.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Marginal Tax Rate (MTR) %"
                fullWidth
                type="number"
                value={MTR}
                onChange={(e) => setMTR(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Tax Savings (TS)"
                fullWidth
                type="number"
                value={TS.toFixed(2)}
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

export default DayTraderTaxStatusForm;