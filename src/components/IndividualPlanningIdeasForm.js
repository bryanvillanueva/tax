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

const IndividualPlanningIdeasForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Campos específicos para Individual Planning Ideas
  const [IFH, setIFH] = useState(""); // Income From Hobbies
  const [IMTR, setIMTR] = useState(""); // Individual Marginal Tax Rate
  const [CTR, setCTR] = useState(21); // Corporation Tax Rate (valor fijo)
  const [AETP, setAETP] = useState(""); // Applying Estimate Tax Payments to Current Tax Return
  const [TDCTR, setTDCTR] = useState(""); // Tax Due Current Tax Return
  const [OP, setOP] = useState(0); // Overpayment
  const [EQTR, setEQTR] = useState(8); // Estimated Quarterly Tax Rate (valor fijo)
  const [EPA, setEPA] = useState(0); // Estimated Penalty Avoided

  const { performCalculations } = useCalculations();

  // Efecto para calcular Overpayment (OP)
  useEffect(() => {
    const estimatedPayments = parseFloat(AETP) || 0;
    const taxDue = parseFloat(TDCTR) || 0;

    const overpayment = estimatedPayments - taxDue;
    setOP(overpayment);
  }, [AETP, TDCTR]);

  // Efecto para calcular Estimated Penalty Avoided (EPA)
  useEffect(() => {
    const taxDue = parseFloat(TDCTR) || 0;
    const quarterlyRate = parseFloat(EQTR) / 100;

    const penaltyAvoided = (taxDue / 4) * quarterlyRate;
    setEPA(penaltyAvoided);
  }, [TDCTR, EQTR]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!IFH || parseFloat(IFH) <= 0) {
      setError("Income From Hobbies (IFH) is required and must be greater than 0.");
      return;
    }

    if (!IMTR || parseFloat(IMTR) <= 0) {
      setError("Individual Marginal Tax Rate (IMTR) is required and must be greater than 0.");
      return;
    }

    if (!AETP || parseFloat(AETP) < 0) {
      setError("Applying Estimate Tax Payments to Current Tax Return (AETP) is required and must be a valid number.");
      return;
    }

    if (!TDCTR || parseFloat(TDCTR) <= 0) {
      setError("Tax Due Current Tax Return (TDCTR) is required and must be greater than 0.");
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
      IFH: parseFloat(IFH),
      IMTR: parseFloat(IMTR),
      CTR,
      AETP: parseFloat(AETP),
      TDCTR: parseFloat(TDCTR),
      OP,
      EQTR,
      EPA,
      calculationType: "IndividualPlanningIdeas",
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
                label="Income From Hobbies (IFH)"
                fullWidth
                type="number"
                value={IFH}
                onChange={(e) => setIFH(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Individual Marginal Tax Rate (IMTR) %"
                fullWidth
                type="number"
                value={IMTR}
                onChange={(e) => setIMTR(e.target.value)}
                margin="normal"
              />
               <TextField
                label="Applying Estimate Tax Payments to Current Tax Return (AETP)"
                fullWidth
                type="number"
                value={AETP}
                onChange={(e) => setAETP(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
            <TextField
                label="Tax Due Current Tax Return (TDCTR)"
                fullWidth
                type="number"
                value={TDCTR}
                onChange={(e) => setTDCTR(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Corporation Tax Rate (CTR)"
                fullWidth
                type="number"
                value={CTR}
                margin="normal"
                disabled
              />
             
             
              <TextField
                label="Overpayment (OP)"
                fullWidth
                type="number"
                value={OP.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Estimated Quarterly Tax Rate (EQTR)"
                fullWidth
                type="number"
                value={EQTR}
                margin="normal"
                disabled
              />
              <TextField
                label="Estimated Penalty Avoided (EPA)"
                fullWidth
                type="number"
                value={EPA.toFixed(2)}
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

export default IndividualPlanningIdeasForm;