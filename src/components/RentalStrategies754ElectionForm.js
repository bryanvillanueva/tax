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

const RentalStrategies754ElectionForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1065");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Campos específicos para Rental Strategies - 754 Election
  const [CPBP, setCPBP] = useState(""); // Current Partner Basis in Partnership
  const [PO, setPO] = useState(""); // Percentage Owned
  const [NPBP, setNPBP] = useState(""); // New Partner Basis in Partnership
  const [FITD, setFITD] = useState(0); // Federal Income Tax Deferred 20%

  const { performCalculations } = useCalculations();

  // Efecto para calcular Federal Income Tax Deferred 20% (FITD)
  useEffect(() => {
    const currentBasis = parseFloat(CPBP) || 0;
    const newBasis = parseFloat(NPBP) || 0;

    const taxDeferred = (newBasis - currentBasis) * 0.2;
    setFITD(taxDeferred);
  }, [CPBP, NPBP]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!CPBP || parseFloat(CPBP) < 0) {
      setError("Current Partner Basis in Partnership (CPBP) is required and must be a valid number.");
      return;
    }

    if (!PO || parseFloat(PO) <= 0 || parseFloat(PO) > 100) {
      setError("Percentage Owned (PO) is required and must be between 0 and 100.");
      return;
    }

    if (!NPBP || parseFloat(NPBP) < 0) {
      setError("New Partner Basis in Partnership (NPBP) is required and must be a valid number.");
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
      CPBP: parseFloat(CPBP),
      PO: parseFloat(PO),
      NPBP: parseFloat(NPBP),
      FITD,
      calculationType: "rentalStrategies754Election",
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: "relative", mt: 5 }}>
        <Box sx={{ position: "absolute", top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S90.pdf"
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
                label="Current Partner Basis in Partnership (CPBP)"
                fullWidth
                type="number"
                value={CPBP}
                onChange={(e) => setCPBP(e.target.value)}
                margin="normal"
              />
             
            </Grid>

            <Grid item xs={12} md={6}>
            <TextField
                label="Percentage Owned (PO)"
                fullWidth
                type="number"
                value={PO}
                onChange={(e) => setPO(e.target.value)}
                margin="normal"
              />
              <TextField
                label="New Partner Basis in Partnership (NPBP)"
                fullWidth
                type="number"
                value={NPBP}
                onChange={(e) => setNPBP(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Federal Income Tax Deferred 20% (FITD)"
                fullWidth
                type="number"
                value={FITD.toFixed(2)}
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
                <MenuItem value="1065">1065</MenuItem>
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

export default RentalStrategies754ElectionForm;
