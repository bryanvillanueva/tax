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

const CollegeStudentStrategiesForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Campos específicos para College Student Strategies
  const [CSCB, setCSCB] = useState("No"); // College student can claim benefits
  const [TCE, setTCE] = useState(""); // Total College Expenses
  const [SSA, setSSA] = useState(""); // Self-support amount
  const [CFOS, setCFOS] = useState(""); // Credit from other strategies
  const [SD, setSD] = useState(0); // Standard Deduction
  const [SMTR, setSMTR] = useState(""); // Student Marginal Tax Rate
  const [PMTR, setPMTR] = useState(""); // Parents Marginal Tax Rate
  const [SET, setSET] = useState(0); // Student Estimated Taxes
  const [PET, setPET] = useState(0); // Parents Estimated Taxes
  const [ETS, setETS] = useState(0); // Estimated Tax Savings

  const { performCalculations } = useCalculations();

  // Efecto para calcular Standard Deduction (SD)
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

  // Efecto para calcular Student Estimated Taxes (SET)
  useEffect(() => {
    const selfSupportAmount = parseFloat(SSA) || 0;
    const creditFromOtherStrategies = parseFloat(CFOS) || 0;
    const studentTaxRate = parseFloat(SMTR) || 0;

    const studentTaxes = Math.max((selfSupportAmount - SD) * (studentTaxRate / 100)- creditFromOtherStrategies, 0);
    setSET(studentTaxes);
  }, [SSA, SD, SMTR, CFOS]);

  // Efecto para calcular Parents Estimated Taxes (PET)
  useEffect(() => {
    const selfSupportAmount = parseFloat(SSA) || 0;
    const parentsTaxRate = parseFloat(PMTR) || 0;

    const parentsTaxes = selfSupportAmount * parentsTaxRate / 100;
    setPET(parentsTaxes);
  }, [SSA, PMTR]);

  // Efecto para calcular Estimated Tax Savings (ETS)
  useEffect(() => {
    const taxSavings = PET - SET;
    setETS(taxSavings);
  }, [PET, SET]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!TCE || parseFloat(TCE) <= 0) {
      setError("Total College Expenses (TCE) is required and must be greater than 0.");
      return;
    }

    if (!SSA || parseFloat(SSA) <= 0) {
      setError("Self-support amount (SSA) is required and must be greater than 0.");
      return;
    }

    if (!SMTR || parseFloat(SMTR) <= 0) {
      setError("Student Marginal Tax Rate (SMTR) is required and must be greater than 0.");
      return;
    }

    if (!PMTR || parseFloat(PMTR) <= 0) {
      setError("Parents Marginal Tax Rate (PMTR) is required and must be greater than 0.");
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
      CSCB,
      TCE: parseFloat(TCE),
      SSA: parseFloat(SSA),
      CFOS: parseFloat(CFOS),
      SD,
      SMTR: parseFloat(SMTR),
      PMTR: parseFloat(PMTR),
      SET,
      PET,
      ETS,
      calculationType: "CollegeStudentStrategies",
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: "relative", mt: 5 }}>
        <Box sx={{ position: "absolute", top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S82.pdf"
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
                label="The college student is able to claim the benefits"
                fullWidth
                value={CSCB}
                onChange={(e) => setCSCB(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
              <TextField
                label="Total College Expenses (TCE)"
                fullWidth
                type="number"
                value={TCE}
                onChange={(e) => setTCE(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Self-support Amount (SSA)"
                fullWidth
                type="number"
                value={SSA}
                onChange={(e) => setSSA(e.target.value)}
                margin="normal"
              />
               <TextField
                label="Credit from Other Strategies (CFOS)"
                fullWidth
                type="number"
                value={CFOS}
                onChange={(e) => setCFOS(e.target.value)}
                margin="normal"
              />
              
            </Grid>

            <Grid item xs={12} md={6}>
            <TextField
                label="Standard Deduction (SD)"
                fullWidth
                type="number"
                value={SD.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Student Marginal Tax Rate (SMTR)"
                fullWidth
                type="number"
                value={SMTR}
                onChange={(e) => setSMTR(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Parents Marginal Tax Rate (PMTR)"
                fullWidth
                type="number"
                value={PMTR}
                onChange={(e) => setPMTR(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Student Estimated Taxes (SET)"
                fullWidth
                type="number"
                value={SET.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Parents Estimated Taxes (PET)"
                fullWidth
                type="number"
                value={PET.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Estimated Tax Savings (ETS)"
                fullWidth
                type="number"
                value={ETS.toFixed(2)}
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

export default CollegeStudentStrategiesForm;
