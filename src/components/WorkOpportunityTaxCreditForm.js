// src/components/WorkOpportunityTaxCreditForm.js
import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Alert,
  Grid,
  MenuItem
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import useCalculations from "../utils/useCalculations";

const WorkOpportunityTaxCreditForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Campos específicos para Work Opportunity Tax Credit
  const [QW120, setQW120] = useState(""); // Qualified Wages First Year - Employees work 120 to 400 hours
  const [QW400, setQW400] = useState(""); // Qualified Wages First Year - Employees work at least 400 hours
  const [QWSY, setQWSY] = useState(""); // Qualified Wages Second Year - Long Term Family Assistance
  const [TC120, setTC120] = useState(0); // Tax Credit First Year - 120 to 400 Hours
  const [TC400, setTC400] = useState(0); // Tax Credit First Year - At least 400 Hours
  const [TCSY, setTCSY] = useState(0); // Tax Credit Second Year - Long Term Family Assistance
  const [WOTC, setWOTC] = useState(0); // Total Work Opportunity Tax Credit
  const [TC, setTC] = useState(0); // Total Credit
  const [TD, setTD] = useState(0); // Total Deduction

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }

    if (!QW120 || parseFloat(QW120) < 0) {
      setError("Qualified Wages First Year - Employees work 120 to 400 hours is required and must be a valid number.");
      return;
    }

    if (!QW400 || parseFloat(QW400) < 0) {
      setError("Qualified Wages First Year - Employees work at least 400 hours is required and must be a valid number.");
      return;
    }

    if (!QWSY || parseFloat(QWSY) < 0) {
      setError("Qualified Wages Second Year - Long Term Family Assistance is required and must be a valid number.");
      return;
    }

    setError(null);

    // Calcular Tax Credits
    const taxCredit120 = parseFloat(QW120) * 0.25;
    const taxCredit400 = parseFloat(QW400) * 0.40;
    const taxCreditSY = parseFloat(QWSY) * 0.50;

    setTC120(taxCredit120);
    setTC400(taxCredit400);
    setTCSY(taxCreditSY);

    // Calcular Total Work Opportunity Tax Credit (WOTC)
    const totalWOTC = taxCredit120 + taxCredit400 + taxCreditSY;
    setWOTC(totalWOTC);

    // Calcular Total Credit (TC)
    setTC(totalWOTC);

    // Calcular Total Deduction (TD)
    const totalDeduction = -totalWOTC;
    setTD(totalDeduction);

    // Pasar resultados a la función onCalculate
    const results = performCalculations ({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID),
      QW120: parseFloat(QW120),
      QW400: parseFloat(QW400),
      QWSY: parseFloat(QWSY),
      TC120: taxCredit120,
      TC400: taxCredit400,
      TCSY: taxCreditSY,
      taxCreditsResults: totalWOTC,
      TC: totalWOTC,
      TD: totalDeduction,
      calculationType: "WorkOpportunityTaxCredit", 
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
                label="QBID (Qualified Business Income Deduction)"
                fullWidth
                type="number"
                value={QBID}
                onChange={(e) => setQbid(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Qualified Wages First Year - Employees work 120 to 400 hours (QW120)"
                fullWidth
                type="number"
                value={QW120}
                onChange={(e) => setQW120(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Qualified Wages First Year - Employees work at least 400 hours (QW400)"
                fullWidth
                type="number"
                value={QW400}
                onChange={(e) => setQW400(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Qualified Wages Second Year - Long Term Family Assistance (QWSY)"
                fullWidth
                type="number"
                value={QWSY}
                onChange={(e) => setQWSY(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Tax Credit First Year - 120 to 400 Hours (TC120)"
                fullWidth
                type="number"
                value={TC120}
                margin="normal"
                disabled
              />
              <TextField
                label="Tax Credit First Year - At least 400 Hours (TC400)"
                fullWidth
                type="number"
                value={TC400}
                margin="normal"
                disabled
              />
              <TextField
                label="Tax Credit Second Year - Long Term Family Assistance (TCSY)"
                fullWidth
                type="number"
                value={TCSY}
                margin="normal"
                disabled
              />
              <TextField
                label="Total Work Opportunity Tax Credit (WOTC)"
                fullWidth
                type="number"
                value={WOTC}
                margin="normal"
                disabled
              />
              <TextField
                label="Total Credit (TC)"
                fullWidth
                type="number"
                value={TC}
                margin="normal"
                disabled
              />
              <TextField
                label="Total Deduction (TD)"
                fullWidth
                type="number"
                value={TD}
                margin="normal"
                disabled
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

export default WorkOpportunityTaxCreditForm;