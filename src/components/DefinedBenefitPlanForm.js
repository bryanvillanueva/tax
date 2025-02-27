// src/components/DefinedBenefitPlanForm.js
import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Alert,
  Grid,
  MenuItem,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import useCalculations from "../utils/useCalculations";

const DefinedBenefitPlanForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Campos específicos para Defined Benefit Plan/Cash Balance Plan
  const [CSW2, setCSW2] = useState(""); // Current Salary (W2)
  const [AC, setAC] = useState(""); // Annual contribution to DBP/CBP
  const [TMTR, setTMTR] = useState(""); // Taxpayer's Marginal Tax Rate
  const [FITD, setFITD] = useState(0); // Federal Income Tax Deferred
  const [FICA, setFICA] = useState(0); // Employee FICA savings

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }

    if (!CSW2 || parseFloat(CSW2) <= 0) {
      setError("Current Salary (W2) is required and must be greater than 0.");
      return;
    }

    if (!AC || parseFloat(AC) <= 0) {
      setError("Annual contribution to DBP/CBP is required and must be greater than 0.");
      return;
    }

    if (!TMTR || parseFloat(TMTR) < 0) {
      setError("Taxpayer's Marginal Tax Rate is required and must be a valid percentage.");
      return;
    }

    setError(null);

    // Calcular Federal Income Tax Deferred (FITD)
    const federalIncomeTaxDeferred = parseFloat(AC) * (parseFloat(TMTR) / 100);
    setFITD(federalIncomeTaxDeferred);

    // Calcular Employee FICA savings (FICA)
    const employeeFICASavings = parseFloat(AC) * (0.153 / 2);
    setFICA(employeeFICASavings);

    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID),
      CSW2: parseFloat(CSW2),
      AC: parseFloat(AC),
      TMTR: parseFloat(TMTR),
      FITD: federalIncomeTaxDeferred,
      FICA: employeeFICASavings,
      calculationType: "DefinedBenefitPlan", 
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
                label="Current Salary (W2)"
                fullWidth
                type="number"
                value={CSW2}
                onChange={(e) => setCSW2(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Annual Contribution to DBP/CBP (AC)"
                fullWidth
                type="number"
                value={AC}
                onChange={(e) => setAC(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
             
              <TextField
                label="Taxpayer's Marginal Tax Rate (TMTR)"
                fullWidth
                type="number"
                value={TMTR}
                onChange={(e) => setTMTR(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Federal Income Tax Deferred (FITD)"
                fullWidth
                type="number"
                value={FITD}
                margin="normal"
                disabled
              />
              <TextField
                label="Employee FICA Savings (FICA)"
                fullWidth
                type="number"
                value={FICA}
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

export default DefinedBenefitPlanForm;