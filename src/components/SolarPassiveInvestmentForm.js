// src/components/SolarPassiveInvestmentForm.js
import React, { useState } from "react";
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

const SolarPassiveInvestmentForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Campos específicos para Solar Passive Investment
  const [PI, setPI] = useState(""); // Passive Investment
  const SIC = 0.30; // Solar Investment Credit (30%)
  const [TSC, setTSC] = useState(0); // Total Solar Credit
  const [DRF, setDRF] = useState(""); // Depreciation reported by Fund
  const [totalCredit, setTotalCredit] = useState(0); // Total Credit
  const [SPID, setSPID] = useState(0); // Solar Passive Investment Deduction

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }

    if (!PI || parseFloat(PI) <= 0) {
      setError("Passive Investment is required and must be greater than 0.");
      return;
    }

    if (!DRF || parseFloat(DRF) < 0) {
      setError("Depreciation reported by Fund is required and must be a valid number.");
      return;
    }

    setError(null);

    // Calcular Total Solar Credit (TSC)
    const totalSolarCredit = parseFloat(PI) * SIC;
    setTSC(totalSolarCredit);

    // Calcular Total Credit
    const totalCreditValue = totalSolarCredit;
    setTotalCredit(totalCreditValue);

    // Calcular Solar Passive Investment Deduction
    const solarPassiveInvestmentDeduction = parseFloat(DRF);
    setSPID(solarPassiveInvestmentDeduction);

    // Pasar resultados a la función onCalculate
    const results = performCalculations ({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID),
      PI: parseFloat(PI),
      SIC,
      TSC: totalSolarCredit,
      DRF: parseFloat(DRF),
      taxCreditsResults: totalCreditValue,
      SPID: solarPassiveInvestmentDeduction,
      calculationType: "SolarPassiveInvestment",
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
                label="Passive Investment (PI)"
                fullWidth
                type="number"
                value={PI}
                onChange={(e) => setPI(e.target.value)}
                margin="normal"
              />
               <TextField
                label="Depreciation Reported by Fund (DRF)"
                fullWidth
                type="number"
                value={DRF}
                onChange={(e) => setDRF(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              
              <TextField
                label="Solar Investment Credit (SIC)"
                fullWidth
                type="number"
                value={SIC * 100} // Mostrar como porcentaje
                margin="normal"
                disabled
              />
              <TextField
                label="Total Solar Credit (TSC)"
                fullWidth
                type="number"
                value={TSC}
                margin="normal"
                disabled
              />
             
              <TextField
                label="Total Credit"
                fullWidth
                type="number"
                value={totalCredit}
                margin="normal"
                disabled
              />
              <TextField
                label="Solar Passive Investment Deduction (SPID)"
                fullWidth
                type="number"
                value={SPID}
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

export default SolarPassiveInvestmentForm;