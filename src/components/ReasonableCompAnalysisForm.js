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

const ReasonableCompAnalysisForm = ({ onCalculate }) => {
  // Fixed fields
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1120S");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Specific fields for Reasonable Comp Analysis
  const [CCS, setCCS] = useState(""); // Current Cash Salary
  const [CHIB, setCHIB] = useState(""); // Current Health Insurance Benefits
  const [TCC, setTCC] = useState(0); // Total Current Compensation
  const [RCPH, setRCPH] = useState(""); // Reasonable Comp Plus Health Insurance
  const [S15, setS15] = useState(0); // Savings in Medicare and Social Security (15.3%)
  const [CNII, setCNII] = useState(0); // Company Net Income Increased
  const [EQBI, setEQBI] = useState(0); // Estimated Additional QBI Deduction (20%)
  const [MTR, setMTR] = useState(""); // Marginal Tax Rate
  const [TTS, setTTS] = useState(0); // Total Tax Savings (Tax + FICA)

  const { performCalculations } = useCalculations();

  // Calculate Total Current Compensation (TCC)
  useEffect(() => {
    const cashSalary = parseFloat(CCS) || 0;
    const healthBenefits = parseFloat(CHIB) || 0;
    setTCC(cashSalary + healthBenefits);
  }, [CCS, CHIB]);

  // Calculate Savings in Medicare and Social Security (S15)
  useEffect(() => {
    const healthBenefits = parseFloat(CHIB) || 0;
    setS15(healthBenefits * 0.153);
  }, [CHIB]);

  // Calculate Company Net Income Increased (CNII)
  useEffect(() => {
    const reasonableComp = parseFloat(RCPH) || 0;
    setCNII(TCC - reasonableComp);
  }, [TCC, RCPH]);

  // Calculate Estimated Additional QBI Deduction (EQBI)
  useEffect(() => {
    setEQBI(CNII * 0.2);
  }, [CNII]);

  // Calculate Total Tax Savings (TTS)
  useEffect(() => {
    const marginalRate = parseFloat(MTR) || 0;
    setTTS(S15 + (EQBI * marginalRate / 100));
  }, [S15, EQBI, MTR]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (!CCS || parseFloat(CCS) <= 0) {
      setError("Current Cash Salary (CCS) is required and must be greater than 0.");
      return;
    }

    if (!CHIB || parseFloat(CHIB) < 0) {
      setError("Current Health Insurance Benefits (CHIB) is required and must be a valid number.");
      return;
    }

    if (!RCPH || parseFloat(RCPH) <= 0) {
      setError("Reasonable Comp Plus Health Insurance (RCPH) is required and must be greater than 0.");
      return;
    }

    if (!MTR || parseFloat(MTR) <= 0) {
      setError("Marginal Tax Rate (MTR) is required and must be greater than 0.");
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
      CCS: parseFloat(CCS),
      CHIB: parseFloat(CHIB),
      TCC,
      RCPH: parseFloat(RCPH),
      S15,
      CNII,
      EQBI,
      MTR: parseFloat(MTR),
      TTS,
      calculationType: "ReasonableCompAnalysis",
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
                label="Current Cash Salary (CCS)"
                fullWidth
                type="number"
                value={CCS}
                onChange={(e) => setCCS(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Current Health Insurance Benefits (CHIB)"
                fullWidth
                type="number"
                value={CHIB}
                onChange={(e) => setCHIB(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Reasonable Comp Plus Health Insurance (RCPH)"
                fullWidth
                type="number"
                value={RCPH}
                onChange={(e) => setRCPH(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Marginal Tax Rate (MTR)"
                fullWidth
                type="number"
                value={MTR}
                onChange={(e) => setMTR(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              
              <TextField
                label="Total Current Compensation (TCC)"
                fullWidth
                type="number"
                value={TCC.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Savings in Medicare and Social Security (15.3%) (S15)"
                fullWidth
                type="number"
                value={S15.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Company Net Income Increased (CNII)"
                fullWidth
                type="number"
                value={CNII.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Estimated Additional QBI Deduction (20%) (EQBI)"
                fullWidth
                type="number"
                value={EQBI.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Total Tax Savings (Tax + FICA) (TTS)"
                fullWidth
                type="number"
                value={TTS.toFixed(2)}
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

export default ReasonableCompAnalysisForm;