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

const RealEstateOptionsForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Campos específicos para Real Estate Options
  const [OA, setOA] = useState(""); // Option Amount
  const [IOWS, setIOWS] = useState("No"); // Is the option well-structured?
  const [PSP, setPSP] = useState(""); // Property Sell Price
  const [OP, setOP] = useState(0); // Option's Percentage
  const [TMTR, setTMTR] = useState(""); // Taxpayer's Marginal Tax Rate
  const [TD, setTD] = useState(0); // Tax Deferred

  const { performCalculations } = useCalculations();

  // Efecto para calcular Option's Percentage (OP)
  useEffect(() => {
    const optionAmount = parseFloat(OA) || 0;
    const sellPrice = parseFloat(PSP) || 0;

    const optionPercentage = sellPrice > 0 ? (optionAmount / sellPrice) * 100 : 0;
    setOP(optionPercentage);
  }, [OA, PSP]);

  // Efecto para calcular Tax Deferred (TD)
  useEffect(() => {
    const optionAmount = parseFloat(OA) || 0;
    const taxRate = parseFloat(TMTR) || 0;

    const taxDeferred = IOWS === "Yes" ? optionAmount * taxRate : 0;
    setTD(taxDeferred);
  }, [IOWS, OA, TMTR]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!OA || parseFloat(OA) <= 0) {
      setError("Option Amount (OA) is required and must be greater than 0.");
      return;
    }

    if (!PSP || parseFloat(PSP) <= 0) {
      setError("Property Sell Price (PSP) is required and must be greater than 0.");
      return;
    }

    if (!TMTR || parseFloat(TMTR) <= 0) {
      setError("Taxpayer's Marginal Tax Rate (TMTR) is required and must be greater than 0.");
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
      OA: parseFloat(OA),
      IOWS,
      PSP: parseFloat(PSP),
      OP,
      TMTR: parseFloat(TMTR),
      TD,
      calculationType: "RealEstateOptions",
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
                select
                label="Is the Option Well-Structured? (IOWS)"
                fullWidth
                value={IOWS}
                onChange={(e) => setIOWS(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
              <TextField
                label="Option Amount (OA)"
                fullWidth
                type="number"
                value={OA}
                onChange={(e) => setOA(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Property Sell Price (PSP)"
                fullWidth
                type="number"
                value={PSP}
                onChange={(e) => setPSP(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Option's Percentage (OP)"
                fullWidth
                type="number"
                value={OP.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Taxpayer's Marginal Tax Rate (TMTR)"
                fullWidth
                type="number"
                value={TMTR}
                onChange={(e) => setTMTR(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Tax Deferred (TD)"
                fullWidth
                type="number"
                value={TD.toFixed(2)}
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
                <MenuItem value="1120">1120</MenuItem>
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

export default RealEstateOptionsForm;