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

const NetInvestmentIncomeTaxForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Campos específicos para Net Investment Income Tax (NIIT) Minimization
  const [AGIT, setAGIT] = useState(0); // AGI Threshold
  const [TAGI, setTAGI] = useState(""); // Taxpayer's Adjusted Gross Income
  const [DTMC, setDTMC] = useState("No"); // Does taxpayer must calculate NIIT?
  const [API, setAPI] = useState(""); // Annual Passive Income
  const [RCAI, setRCAI] = useState(""); // Reduction or change to active income
  const [TPI, setTPI] = useState(0); // Total Passive Income
  const [NIITR, setNIITR] = useState(0); // Net Investment Income Tax Rate
  const [TDWS, setTDWS] = useState(0); // Tax Due Without Strategy
  const [NTD, setNTD] = useState(0); // New Tax Due

  const { performCalculations } = useCalculations();

  // Efecto para calcular AGI Threshold (AGIT)
  useEffect(() => {
    let agiThreshold = 0;
    switch (filingStatus) {
      case "Single":
      case "HH":
        agiThreshold = 200000;
        break;
      case "MFJ":
      case "QSS":
        agiThreshold = 250000;
        break;
      case "MFS":
        agiThreshold = 125000;
        break;
      default:
        agiThreshold = 0;
    }
    setAGIT(agiThreshold);
  }, [filingStatus]);

  // Efecto para determinar si se debe calcular NIIT (DTMC)
  useEffect(() => {
    const taxpayerAGI = parseFloat(TAGI) || 0;
    const mustCalculate = taxpayerAGI > AGIT ? "Yes" : "No";
    setDTMC(mustCalculate);
  }, [TAGI, AGIT]);

  // Efecto para calcular Total Passive Income (TPI)
  useEffect(() => {
    const annualPassiveIncome = parseFloat(API) || 0;
    const reductionActiveIncome = parseFloat(RCAI) || 0;

    const totalPassiveIncome = annualPassiveIncome - reductionActiveIncome;
    setTPI(totalPassiveIncome);
  }, [API, RCAI]);

  // Efecto para calcular Net Investment Income Tax Rate (NIITR)
  useEffect(() => {
    const niitRate = DTMC === "Yes" ? 0.038 : 0;
    setNIITR(niitRate);
  }, [DTMC]);

  // Efecto para calcular Tax Due Without Strategy (TDWS)
  useEffect(() => {
    const annualPassiveIncome = parseFloat(API) || 0;
    const taxDue = annualPassiveIncome * NIITR;
    setTDWS(taxDue);
  }, [API, NIITR]);

  // Efecto para calcular New Tax Due (NTD)
  useEffect(() => {
    const totalPassiveIncome = parseFloat(TPI) || 0;
    const newTaxDue = totalPassiveIncome * NIITR;
    setNTD(newTaxDue);
  }, [TPI, NIITR]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!TAGI || parseFloat(TAGI) <= 0) {
      setError("Taxpayer's Adjusted Gross Income (TAGI) is required and must be greater than 0.");
      return;
    }

    if (!API || parseFloat(API) < 0) {
      setError("Annual Passive Income (API) is required and must be a valid number.");
      return;
    }

    if (!RCAI || parseFloat(RCAI) < 0) {
      setError("Reduction or Change to Active Income (RCAI) is required and must be a valid number.");
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
      AGIT,
      TAGI: parseFloat(TAGI),
      DTMC,
      API: parseFloat(API),
      RCAI: parseFloat(RCAI),
      TPI,
      NIITR,
      TDWS,
      NTD,
      calculationType: "NetInvestmentIncomeTax",
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
                disabled
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
                label="Taxpayer's Adjusted Gross Income (TAGI)"
                fullWidth
                type="number"
                value={TAGI}
                onChange={(e) => setTAGI(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Annual Passive Income (API)"
                fullWidth
                type="number"
                value={API}
                onChange={(e) => setAPI(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Reduction or Change to Active Income (RCAI)"
                fullWidth
                type="number"
                value={RCAI}
                onChange={(e) => setRCAI(e.target.value)}
                margin="normal"
              />
              <TextField
                label="AGI Threshold (AGIT)"
                fullWidth
                type="number"
                value={AGIT}
                margin="normal"
                disabled
              />
              <TextField
                label="Does Taxpayer Must Calculate NIIT? (DTMC)"
                fullWidth
                value={DTMC}
                margin="normal"
                disabled
              />
              <TextField
                label="Total Passive Income (TPI)"
                fullWidth
                type="number"
                value={TPI.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Net Investment Income Tax Rate (NIITR)"
                fullWidth
                type="number"
                value={`${(NIITR * 100).toFixed(2)}%`}
                margin="normal"
                disabled
              />
              <TextField
                label="Tax Due Without Strategy (TDWS)"
                fullWidth
                type="number"
                value={TDWS.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="New Tax Due (NTD)"
                fullWidth
                type="number"
                value={NTD.toFixed(2)}
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

export default NetInvestmentIncomeTaxForm;