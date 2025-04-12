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

const TaxFreeIncomeForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Campos específicos para Tax-Free Income
  const [MBI, setMBI] = useState(""); // Municipal Bond Interest
  const [BAR, setBAR] = useState(""); // Bond Annual Rate
  const [LIP, setLIP] = useState(""); // Life Insurance Payouts
  const [NTI, setNTI] = useState(""); // Non taxable Income from other strategies
  const [TNTI, setTNTI] = useState(0); // Total Non-taxable income
  const [MTR, setMTR] = useState(""); // Marginal Tax Rate
  const [TS, setTS] = useState(0); // Tax Savings

  const { performCalculations } = useCalculations();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }

    if (!MBI || parseFloat(MBI) < 0) {
      setError("Municipal Bond Interest is required and must be a valid number.");
      return;
    }

    if (!BAR || parseFloat(BAR) <= 0 || parseFloat(BAR) > 100) {
      setError("Bond Annual Rate is required and must be between 0 and 100.");
      return;
    }

    if (!LIP || parseFloat(LIP) < 0) {
      setError("Life Insurance Payouts is required and must be a valid number.");
      return;
    }

    if (!NTI || parseFloat(NTI) < 0) {
      setError("Non taxable Income from other strategies is required and must be a valid number.");
      return;
    }

    if (!MTR || parseFloat(MTR) < 0 || parseFloat(MTR) > 100) {
      setError("Marginal Tax Rate is required and must be between 0 and 100.");
      return;
    }

    setError(null);

    // Convertir BAR y MTR a decimales
    const barDecimal = parseFloat(BAR) / 100; // Convertir BAR a decimal
    const mtrDecimal = parseFloat(MTR) / 100; // Convertir MTR a decimal

    // Calcular Total Non-taxable Income (TNTI)
    const totalNonTaxableIncome = (parseFloat(MBI) * barDecimal) + parseFloat(LIP) + parseFloat(NTI);
    setTNTI(totalNonTaxableIncome);

    // Calcular Tax Savings (TS)
    const taxSavings = totalNonTaxableIncome * mtrDecimal;
    setTS(taxSavings);

    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID),
      MBI: parseFloat(MBI),
      BAR: barDecimal, // Usar el valor en decimal
      LIP: parseFloat(LIP),
      NTI: parseFloat(NTI),
      TNTI: totalNonTaxableIncome,
      MTR: mtrDecimal, // Usar el valor en decimal
      TS: taxSavings,
      calculationType: "TaxFreeIncome",
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: "relative", mt: 5 }}>
        <Box sx={{ position: "absolute", top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S77.pdf"
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
                label="Municipal Bond Interest (MBI)"
                fullWidth
                type="number"
                value={MBI}
                onChange={(e) => setMBI(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Bond Annual Rate (BAR) %"
                fullWidth
                type="number"
                value={BAR}
                onChange={(e) => setBAR(e.target.value)}
                margin="normal"
                inputProps={{ min: 0, max: 100 }} // Limitar el rango de entrada
              />
              <TextField
                label="Life Insurance Payouts (LIP)"
                fullWidth
                type="number"
                value={LIP}
                onChange={(e) => setLIP(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Non Taxable Income (NTI)"
                fullWidth
                type="number"
                value={NTI}
                onChange={(e) => setNTI(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Marginal Tax Rate (MTR) %"
                fullWidth
                type="number"
                value={MTR}
                onChange={(e) => setMTR(e.target.value)}
                margin="normal"
                inputProps={{ min: 0, max: 100 }} // Limitar el rango de entrada
              />
              <TextField
                label="Total Non-taxable Income (TNTI)"
                fullWidth
                type="number"
                value={TNTI}
                margin="normal"
                disabled
              />
              <TextField
                label="Tax Savings (TS)"
                fullWidth
                type="number"
                value={TS}
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

export default TaxFreeIncomeForm;
