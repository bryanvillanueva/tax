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

const FinancedSoftwareLeasebackForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1120");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Campos específicos para Financed Software Leaseback
  const [softwareInvestment, setSoftwareInvestment] = useState("");
  const [leasingNumberOfYears, setLeasingNumberOfYears] = useState("");
  const [residualValue, setResidualValue] = useState("");
  const [leaseExpenses, setLeaseExpenses] = useState(0);
  const [softwareLeasebackDeduction, setSoftwareLeasebackDeduction] = useState(0);

  const { performCalculations } = useCalculations();

  const calculateLeaseback = () => {
    const SI = parseFloat(softwareInvestment);
    const RV = parseFloat(residualValue);
    const LNY = parseFloat(leasingNumberOfYears);

    // Calcular Lease Expenses (LE)
    const LE = (SI - RV) / LNY;
    setLeaseExpenses(LE);

    // Calcular Software Leaseback Deduction
    const SLD = LE;
    setSoftwareLeasebackDeduction(SLD);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }

    if (!softwareInvestment || parseFloat(softwareInvestment) <= 0) {
      setError("Software Investment is required and must be greater than 0.");
      return;
    }

    if (!leasingNumberOfYears || parseFloat(leasingNumberOfYears) <= 0) {
      setError("Leasing Number of Years is required and must be greater than 0.");
      return;
    }

    if (!residualValue || parseFloat(residualValue) < 0) {
      setError("Residual Value is required and must be a valid number.");
      return;
    }

    setError(null);

    // Calcular valores
    calculateLeaseback();

    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID),
      softwareInvestment: parseFloat(softwareInvestment),
      leasingNumberOfYears: parseFloat(leasingNumberOfYears),
      residualValue: parseFloat(residualValue),
      leaseExpenses,
      softwareLeasebackDeduction,
      calculationType: "FinancedSoftwareLeaseback",
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
                label="Software Investment (SI)"
                fullWidth
                type="number"
                value={softwareInvestment}
                onChange={(e) => setSoftwareInvestment(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Leasing Number of Years (LNY)"
                fullWidth
                type="number"
                value={leasingNumberOfYears}
                onChange={(e) => setLeasingNumberOfYears(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Residual Value (RV)"
                fullWidth
                type="number"
                value={residualValue}
                onChange={(e) => setResidualValue(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Lease Expenses (LE)"
                fullWidth
                type="number"
                value={leaseExpenses.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Software Leaseback Deduction"
                fullWidth
                type="number"
                value={softwareLeasebackDeduction.toFixed(2)}
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
                <MenuItem value="1120">1120</MenuItem>
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

export default FinancedSoftwareLeasebackForm;