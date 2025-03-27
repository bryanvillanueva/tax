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

const CaptiveInsuranceForm = ({ onCalculate }) => {
  // Fixed fields
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040NR - Schedule E");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Specific fields for Captive Insurance
  const [AIP, setAIP] = useState(""); // Annual Insurance Premiums
  const [IAIC, setIAIC] = useState(0); // Investment Amount - Insurance Company
  const [IR, setIR] = useState(""); // Interest Rate
  const [EII, setEII] = useState(0); // Estimate Investment Income (IC)
  const [AEMB, setAEMB] = useState(0); // Additional expenses in the main business

  const { performCalculations } = useCalculations();

  // Calculate Investment Amount - Insurance Company (IAIC)
  useEffect(() => {
    const premiums = parseFloat(AIP) || 0;
    setIAIC(premiums);
    setAEMB(premiums); // AEMB is also equal to AIP
  }, [AIP]);

  // Calculate Estimate Investment Income (EII)
  useEffect(() => {
    const interestRate = parseFloat(IR) || 0;
    setEII(IAIC * (interestRate / 100));
  }, [IAIC, IR]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (!AIP || parseFloat(AIP) <= 0) {
      setError("Annual Insurance Premiums (AIP) is required and must be greater than 0.");
      return;
    }

    if (!IR || parseFloat(IR) <= 0) {
      setError("Interest Rate (IR) is required and must be greater than 0.");
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
      AIP: parseFloat(AIP),
      IAIC,
      IR: parseFloat(IR),
      EII,
      AEMB,
      calculationType: "CaptiveInsurance",
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
                label="Annual Insurance Premiums (AIP)"
                fullWidth
                type="number"
                value={AIP}
                onChange={(e) => setAIP(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Interest Rate (IR) %"
                fullWidth
                type="number"
                value={IR}
                onChange={(e) => setIR(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Investment Amount - Insurance Company (IAIC)"
                fullWidth
                type="number"
                value={IAIC.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Estimate Investment Income (IC) (EII)"
                fullWidth
                type="number"
                value={EII.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Additional expenses in the main business (AEMB)"
                fullWidth
                type="number"
                value={AEMB.toFixed(2)}
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

export default CaptiveInsuranceForm;