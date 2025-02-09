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

const OrdinaryLossOnWorthlessStockForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Campos específicos para Ordinary Loss on Worthless Stock
  const [meetsRequirement, setMeetsRequirement] = useState("No");
  const [stocksValue, setStocksValue] = useState("");
  const [limitDeduction, setLimitDeduction] = useState(0);
  const [ordinaryLossDeduction, setOrdinaryLossDeduction] = useState(0);

  const { performCalculations } = useCalculations();

  // Efecto para actualizar el Limit Deduction cuando cambia el Filing Status
  useEffect(() => {
    const LD = filingStatus === "MFJ" ? 100000 : 50000;
    setLimitDeduction(LD);
  }, [filingStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }

    if (!stocksValue || parseFloat(stocksValue) < 0) {
      setError("Stocks Value is required and must be a valid number.");
      return;
    }

    setError(null);

    // Calcular valores
    const SV = parseFloat(stocksValue);

    // Calcular Ordinary Loss Deduction
    const OLD = meetsRequirement === "Yes" ? (SV >= limitDeduction ? limitDeduction : SV) : 0;
    setOrdinaryLossDeduction(OLD);

    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID),
      meetsRequirement,
      stocksValue: SV,
      limitDeduction,
      ordinaryLossDeduction: OLD,
      calculationType: "OrdinaryLossOnWorthlessStock",
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
                select
                label="Meets Requirement of Section 1244 (MR)"
                fullWidth
                value={meetsRequirement}
                onChange={(e) => setMeetsRequirement(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Stocks Value (SV)"
                fullWidth
                type="number"
                value={stocksValue}
                onChange={(e) => setStocksValue(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Limit Deduction (LD)"
                fullWidth
                type="number"
                value={limitDeduction.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Ordinary Loss Deduction"
                fullWidth
                type="number"
                value={ordinaryLossDeduction.toFixed(2)}
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

export default OrdinaryLossOnWorthlessStockForm;