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

const SoleProprietorForm = ({ onCalculate }) => {
  // Fixed fields
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Specific fields for Sole Proprietor Schedule C
  const [Inc, setInc] = useState(""); // Income
  const [BE, setBE] = useState(""); // Business expenses
  const [DFOS, setDFOS] = useState(""); // Deduction from other strategies
  const [NI, setNI] = useState(0); // Net Income
  const [ESET, setESET] = useState(0); // Estimated Self-employment tax
  const [SD, setSD] = useState(0); // Standard Deduction
  const [ID, setID] = useState(""); // Itemized Deduction
  const [TI, setTI] = useState(0); // Taxable Income
  const [MTR, setMTR] = useState(""); // Marginal Tax Rate
  const [ETI, setETI] = useState(0); // Estimated Tax Income

  const { performCalculations } = useCalculations();

  // Calculate Standard Deduction based on filing status
  useEffect(() => {
    let standardDeduction = 0;
    switch (filingStatus) {
      case "Single":
      case "MFS":
        standardDeduction = 14600;
        break;
      case "MFJ":
      case "QSS":
        standardDeduction = 29200;
        break;
      case "HH":
        standardDeduction = 21900;
        break;
      default:
        standardDeduction = 0;
    }
    setSD(standardDeduction);
  }, [filingStatus]);

  // Calculate Net Income (NI)
  useEffect(() => {
    const income = parseFloat(Inc) || 0;
    const expenses = parseFloat(BE) || 0;
    const otherDeductions = parseFloat(DFOS) || 0;
    setNI(income - expenses - otherDeductions);
  }, [Inc, BE, DFOS]);

  // Calculate Estimated Self-employment tax (ESET)
  useEffect(() => {
    setESET(NI * 0.153);
  }, [NI]);

  // Calculate Taxable Income (TI)
  useEffect(() => {
    const itemized = parseFloat(ID) || 0;
    const taxableIncome = SD > itemized ? NI - SD : NI - itemized;
    setTI(taxableIncome >= 0 ? taxableIncome : 0);
  }, [NI, SD, ID]);

  // Calculate Estimated Tax Income (ETI)
  useEffect(() => {
    const taxRate = parseFloat(MTR) || 0;
    setETI(TI * (taxRate / 100));
  }, [TI, MTR]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (!Inc || parseFloat(Inc) <= 0) {
      setError("Income (Inc) is required and must be greater than 0.");
      return;
    }

    if (!BE || parseFloat(BE) < 0) {
      setError("Business expenses (BE) is required and must be a valid number.");
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
      Inc: parseFloat(Inc),
      BE: parseFloat(BE),
      DFOS: parseFloat(DFOS) || 0,
      NI,
      ESET,
      SD,
      ID: parseFloat(ID) || 0,
      TI,
      MTR: parseFloat(MTR),
      ETI,
      calculationType: "SoleProprietor",
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
                label="Income (Inc)"
                fullWidth
                type="number"
                value={Inc}
                onChange={(e) => setInc(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Business expenses (BE)"
                fullWidth
                type="number"
                value={BE}
                onChange={(e) => setBE(e.target.value)}
                margin="normal"
              />
               <TextField
                label="Deduction from other strategies (DFOS)"
                fullWidth
                type="number"
                value={DFOS}
                onChange={(e) => setDFOS(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Net Income (NI)"
                fullWidth
                type="number"
                value={NI.toFixed(2)}
                margin="normal"
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
             
              <TextField
                label="Estimated Self-employment tax (ESET)"
                fullWidth
                type="number"
                value={ESET.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Standard Deduction (SD)"
                fullWidth
                type="number"
                value={SD}
                margin="normal"
                disabled
              />
              <TextField
                label="Itemized Deduction (ID)"
                fullWidth
                type="number"
                value={ID}
                onChange={(e) => setID(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Taxable Income (TI)"
                fullWidth
                type="number"
                value={TI.toFixed(2)}
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
                label="Estimated Tax Income (ETI)"
                fullWidth
                type="number"
                value={ETI.toFixed(2)}
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

export default SoleProprietorForm;