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

const QualifiedDividendsForm = ({ onCalculate }) => {

  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);
  const [qualifiedDividends, setQualifiedDividends] = useState("");
  const [dividendsRate, setDividendsRate] = useState("");
  const [taxpayerMarginalRate, setTaxpayerMarginalRate] = useState("");
  const [taxOverDividends, setTaxOverDividends] = useState(0);
  const [savingsVsOrdinaryDividends, setSavingsVsOrdinaryDividends] = useState(0);

  const { performCalculations } = useCalculations();

  const calculateDividends = () => {
    const QD = parseFloat(qualifiedDividends);
    const DR = parseFloat(dividendsRate) / 100; // Convertir a decimal
    const TMR = parseFloat(taxpayerMarginalRate) / 100; // Convertir a decimal

    // Calcular Tax Over Dividends (TOD)
    const TOD = QD * DR;
    setTaxOverDividends(TOD);

    // Calcular Savings vs Ordinary Dividends (SOD)
    const SOD = QD * TMR - TOD;
    setSavingsVsOrdinaryDividends(SOD);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }

    if (!qualifiedDividends || parseFloat(qualifiedDividends) <= 0) {
      setError("Qualified Dividends is required and must be greater than 0.");
      return;
    }

    if (!dividendsRate || parseFloat(dividendsRate) <= 0) {
      setError("Dividends Rate is required and must be greater than 0.");
      return;
    }

    if (!taxpayerMarginalRate || parseFloat(taxpayerMarginalRate) <= 0) {
      setError("Taxpayer Marginal Rate is required and must be greater than 0.");
      return;
    }

    setError(null);

    // Calcular valores
    calculateDividends();

    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID),
      qualifiedDividends: parseFloat(qualifiedDividends),
      dividendsRate: parseFloat(dividendsRate),
      taxpayerMarginalRate: parseFloat(taxpayerMarginalRate),
      taxOverDividends,
      savingsVsOrdinaryDividends,
      calculationType: "QualifiedDividends",
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: "relative", mt: 5 }}>
        <Box sx={{ position: "absolute", top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S43.pdf"
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
                label="Qualified Dividends (QD)"
                fullWidth
                type="number"
                value={qualifiedDividends}
                onChange={(e) => setQualifiedDividends(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Dividends Rate (DR) (%)"
                fullWidth
                type="number"
                value={dividendsRate}
                onChange={(e) => setDividendsRate(e.target.value)}
                margin="normal"
              />
              
            </Grid>

            <Grid item xs={12} md={6}>
            <TextField
                label="Taxpayer Marginal Rate (TMR) (%)"
                fullWidth
                type="number"
                value={taxpayerMarginalRate}
                onChange={(e) => setTaxpayerMarginalRate(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Tax Over Dividends (TOD)"
                fullWidth
                type="number"
                value={taxOverDividends.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Savings vs Ordinary Dividends (SOD)"
                fullWidth
                type="number"
                value={savingsVsOrdinaryDividends.toFixed(2)}
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

export default QualifiedDividendsForm;
