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

const ChoiceOfEntityForm = ({ onCalculate }) => {
  // Fixed fields
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040NR - Schedule E");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // New Choice of Entity specific fields
  const [DTABA, setDTABA] = useState("No"); // Does Taxpayer's activity require a business analysis?
  const [BSR, setBSR] = useState(""); // Business Structure Recommended
  const [TR, setTR] = useState("N/A"); // Tax Rates
  const [PAT, setPAT] = useState("N/A"); // Possible Additional Taxes
  const [OROB, setOROB] = useState("N/A"); // Owner responsibility over business debts

  const { performCalculations } = useCalculations();

  // Calculate Tax Rates, Possible Additional Taxes, and Owner Responsibility based on DTABA and BSR
  useEffect(() => {
    if (DTABA === "Yes") {
      switch (BSR) {
        case "Sole Proprietorship":
          setTR("10% to 37%");
          setPAT("FICA");
          setOROB("Unlimited");
          break;
        case "Partnership":
          setTR("10% to 37%");
          setPAT("FICA and NIIT");
          setOROB("Unlimited other than LLC");
          break;
        case "C Corporation":
          setTR("21%");
          setPAT("Tax Over Dividends");
          setOROB("Limited");
          break;
        case "S Corporation":
          setTR("10% to 37%");
          setPAT("NIIT");
          setOROB("Limited");
          break;
        default:
          setTR("N/A");
          setPAT("N/A");
          setOROB("N/A");
      }
    } else {
      setTR("N/A");
      setPAT("N/A");
      setOROB("N/A");
    }
  }, [DTABA, BSR]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (DTABA === "Yes" && !BSR) {
      setError("Business Structure Recommended (BSR) is required when Business Analysis is needed.");
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
      DTABA,
      BSR,
      TR,
      PAT,
      OROB,
      calculationType: "ChoiceOfEntity",
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
                select
                label="Does Taxpayer's Activity Require Business Analysis? (DTABA)"
                fullWidth
                value={DTABA}
                onChange={(e) => setDTABA(e.target.value)}
                margin="normal"
              >
                <MenuItem value="No">No</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
              </TextField>

              {DTABA === "Yes" && (
                <TextField
                  select
                  label="Business Structure Recommended (BSR)"
                  fullWidth
                  value={BSR}
                  onChange={(e) => setBSR(e.target.value)}
                  margin="normal"
                  required
                >
                  <MenuItem value="Sole Proprietorship">Sole Proprietorship</MenuItem>
                  <MenuItem value="Partnership">Partnership</MenuItem>
                  <MenuItem value="C Corporation">C Corporation</MenuItem>
                  <MenuItem value="S Corporation">S Corporation</MenuItem>
                </TextField>
              )}

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
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Tax Rates (TR)"
                fullWidth
                value={TR}
                margin="normal"
                disabled
              />

              <TextField
                label="Possible Additional Taxes (PAT)"
                fullWidth
                value={PAT}
                margin="normal"
                disabled
              />

              <TextField
                label="Owner Responsibility over Business Debts (OROB)"
                fullWidth
                value={OROB}
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
                <MenuItem value="1040NR - Schedule E">1040NR - Schedule E</MenuItem>
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

export default ChoiceOfEntityForm;