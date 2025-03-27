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

const ChoiceOfEntityCCorpForm = ({ onCalculate }) => {
  // Fixed fields
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1120C");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // C Corp specific fields
  const [NI, setNI] = useState(""); // Net Income
  const [CMTR, setCMTR] = useState(""); // Current Marginal Tax Rate
  const [IPI, setIPI] = useState("No"); // Is Passive Income
  const [ETD, setETD] = useState(0); // Estimated Tax Due
  const [CCTR, setCCTR] = useState(""); // C Corp Tax Rate
  const [CCETD, setCCETD] = useState(0); // C Corp - Estimated Tax Due
  const [ENPA, setENPA] = useState(""); // Expenses not previously allowed
  const [CCNET, setCCNET] = useState(0); // C Corp - New Estimated Tax

  const { performCalculations } = useCalculations();

  // Calculate Estimated Tax Due
  useEffect(() => {
    const netIncome = parseFloat(NI) || 0;
    const currentMarginalTaxRate = parseFloat(CMTR) || 0;

    let estimatedTaxDue;
    if (IPI === "Yes" && netIncome >= 200000) {
      estimatedTaxDue = netIncome * (currentMarginalTaxRate + 0.038);
    } else {
      estimatedTaxDue = netIncome * currentMarginalTaxRate;
    }
    setETD(estimatedTaxDue);
  }, [NI, CMTR, IPI]);

  // Calculate C Corp Estimated Tax Due and New Estimated Tax
  useEffect(() => {
    const netIncome = parseFloat(NI) || 0;
    const cCorpTaxRate = parseFloat(CCTR) || 0;
    const expensesNotPreviouslyAllowed = parseFloat(ENPA) || 0;

    const ccEstimatedTaxDue = netIncome * cCorpTaxRate;
    setCCETD(ccEstimatedTaxDue);

    const ccNewEstimatedTax = (netIncome - expensesNotPreviouslyAllowed) * cCorpTaxRate;
    setCCNET(ccNewEstimatedTax);
  }, [NI, CCTR, ENPA]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (!NI || parseFloat(NI) < 0) {
      setError("Net Income (NI) is required and must be a non-negative number.");
      return;
    }

    if (!CMTR || parseFloat(CMTR) < 0) {
      setError("Current Marginal Tax Rate (CMTR) is required and must be a non-negative percentage.");
      return;
    }

    if (!CCTR || parseFloat(CCTR) < 0) {
      setError("C Corp Tax Rate (CCTR) is required and must be a non-negative percentage.");
      return;
    }

    setError(null);

    // Pass results to onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID) || 0,
      NI: parseFloat(NI),
      CMTR: parseFloat(CMTR),
      IPI,
      ETD,
      CCTR: parseFloat(CCTR),
      CCETD,
      ENPA: parseFloat(ENPA),
      CCNET,
      calculationType: "ChoiceOfEntityCCorp",
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
                label="Net Income (NI)"
                fullWidth
                type="number"
                value={NI}
                onChange={(e) => setNI(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Current Marginal Tax Rate (CMTR) %"
                fullWidth
                type="number"
                value={CMTR}
                onChange={(e) => setCMTR(e.target.value)}
                margin="normal"
              />

              <TextField
                select
                label="Is Passive Income? (IPI)"
                fullWidth
                value={IPI}
                onChange={(e) => setIPI(e.target.value)}
                margin="normal"
              >
                <MenuItem value="No">No</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
              </TextField>

              <TextField
                label="Estimated Tax Due (ETD)"
                fullWidth
                type="number"
                value={ETD.toFixed(2)}
                margin="normal"
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="C Corp Tax Rate (CCTR) %"
                fullWidth
                type="number"
                value={CCTR}
                onChange={(e) => setCCTR(e.target.value)}
                margin="normal"
              />

              <TextField
                label="C Corp - Estimated Tax Due (CCETD)"
                fullWidth
                type="number"
                value={CCETD.toFixed(2)}
                margin="normal"
                disabled
              />

              <TextField
                label="Expenses Not Previously Allowed (ENPA)"
                fullWidth
                type="number"
                value={ENPA}
                onChange={(e) => setENPA(e.target.value)}
                margin="normal"
              />

              <TextField
                label="C Corp - New Estimated Tax (CCNET)"
                fullWidth
                type="number"
                value={CCNET.toFixed(2)}
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

export default ChoiceOfEntityCCorpForm;