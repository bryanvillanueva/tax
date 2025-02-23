// src/components/BonusDepreciationForm.js
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

const BonusDepreciationForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Campos específicos para Bonus Depreciation
  const [CI, setCI] = useState(""); // Costos/Inversión
  const [TVLP, setTVLP] = useState("yes"); // The vehicle is a listed property
  const [TLP, setTLP] = useState("Limited Vehicle"); // Type of listed property
  const [CDFY, setCDFY] = useState(""); // Calculated Depreciation First Year
  const [TDP, setTDP] = useState(0); // Total depreciation
  const BDR = 0.60; // Bonus Depreciation Rate (60%)

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }

    if (!CI || parseFloat(CI) <= 0) {
      setError("Costos/Inversión is required and must be greater than 0.");
      return;
    }

    if (!CDFY || parseFloat(CDFY) < 0) {
      setError("Calculated Depreciation First Year is required and must be a valid number.");
      return;
    }

    setError(null);

    // Calcular Bonus Depreciation Limit (BDL)
    const BDL = TVLP === "no" ? 0 : (TLP === "Limited Vehicle" ? 20400 : parseFloat(CI) * BDR);

    // Calcular Bonus Depreciation Amount (BDA)
    const BDA = parseFloat(CI) * BDR;

    // Calcular Total Depreciation (TDP)
    const totalDepreciation = TVLP === "no" ? BDA + parseFloat(CDFY) : (TLP === "Limited Vehicle" ? 20400 : BDA + parseFloat(CDFY));
    setTDP(totalDepreciation);

    // Pasar resultados a la función onCalculate
    const results = performCalculations ({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID),
      CI: parseFloat(CI),
      TVLP,
      TLP,
      BDL,
      BDA,
      CDFY: parseFloat(CDFY),
      TDP: totalDepreciation,
      BDR,
      bonusDepreciationDeduction: totalDepreciation, // Bonus Depreciation Deduction
      calculationType: "BonusDepreciation", 
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
                label="Costos/Inversión (CI)"
                fullWidth
                type="number"
                value={CI}
                onChange={(e) => setCI(e.target.value)}
                margin="normal"
              />
              <TextField
                select
                label="The vehicle is a listed property (TVLP)"
                fullWidth
                value={TVLP}
                onChange={(e) => setTVLP(e.target.value)}
                margin="normal"
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </TextField>
              <TextField
                select
                label="Type of Listed Property (TLP)"
                fullWidth
                value={TLP}
                onChange={(e) => setTLP(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Limited Vehicle">Limited Vehicle</MenuItem>
                <MenuItem value="6.000 - 14.000 pounds">6.000 - 14.000 pounds</MenuItem>
                <MenuItem value="Not Limited Vehicle">Not Limited Vehicle</MenuItem>
                <MenuItem value="N/A">N/A</MenuItem>
              </TextField>
              <TextField
                label="Calculated Depreciation First Year (CDFY)"
                fullWidth
                type="number"
                value={CDFY}
                onChange={(e) => setCDFY(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Total Depreciation (TDP)"
                fullWidth
                type="number"
                value={TDP}
                margin="normal"
                disabled
              />
              <TextField
                label="Bonus Depreciation Rate (BDR)"
                fullWidth
                type="number"
                value={BDR * 100} // Mostrar como porcentaje
                margin="normal"
                disabled
              />
              <TextField
                label="Bonus Depreciation Deduction"
                fullWidth
                type="number"
                value={TDP}
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

export default BonusDepreciationForm;