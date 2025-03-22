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

const SellHomeToSCorpForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1120S");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Campos específicos para Sell Your Home to your S Corp
  const [HSMR, setHSMR] = useState("No"); // Home sold meets the requirement
  const [CB, setCB] = useState(""); // Cost basis
  const [SP, setSP] = useState(""); // Sell price
  const [CG, setCG] = useState(0); // Capital gain
  const [GE, setGE] = useState(0); // Gain exclusion
  const [TCG, setTCG] = useState(0); // Taxable capital gain
  const [TS20, setTS20] = useState(0); // Tax savings (20%)
  const [NBSC, setNBSC] = useState(0); // New basis - S Corp
  const [ULRRP, setULRRP] = useState(27.5); // Useful life - Residential rental property
  const [ED, setED] = useState(0); // Estimated depreciation

  const { performCalculations } = useCalculations();

  // Efecto para calcular Capital Gain (CG)
  useEffect(() => {
    const costBasis = parseFloat(CB) || 0;
    const sellPrice = parseFloat(SP) || 0;

    const capitalGain = sellPrice - costBasis;
    setCG(capitalGain);
  }, [CB, SP]);

  // Efecto para calcular Gain Exclusion (GE)
  useEffect(() => {
    let gainExclusion = 0;
    if (HSMR === "Yes") {
      gainExclusion = filingStatus === "MFJ" ? 500000 : 250000;
    }
    setGE(gainExclusion);
  }, [HSMR, filingStatus]);

  // Efecto para calcular Taxable Capital Gain (TCG)
  useEffect(() => {
    const taxableGain = Math.max(CG - GE, 0);
    setTCG(taxableGain);
  }, [CG, GE]);

  // Efecto para calcular Tax Savings (20%) (TS20)
  useEffect(() => {
    const taxSavings = CG * 0.2;
    setTS20(taxSavings);
  }, [CG]);

  // Efecto para calcular New Basis - S Corp (NBSC)
  useEffect(() => {
    const sellPrice = parseFloat(SP) || 0;
    setNBSC(sellPrice);
  }, [SP]);

  // Efecto para calcular Estimated Depreciation (ED)
  useEffect(() => {
    const depreciation = NBSC / ULRRP;
    setED(depreciation);
  }, [NBSC, ULRRP]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!CB || parseFloat(CB) <= 0) {
      setError("Cost Basis (CB) is required and must be greater than 0.");
      return;
    }

    if (!SP || parseFloat(SP) <= 0) {
      setError("Sell Price (SP) is required and must be greater than 0.");
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
      HSMR,
      CB: parseFloat(CB),
      SP: parseFloat(SP),
      CG,
      GE,
      TCG,
      TS20,
      NBSC,
      ULRRP,
      ED,
      calculationType: "SellHomeToSCorp",
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
                disabled
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
                label="Home Sold Meets Requirement (HSMR)"
                fullWidth
                value={HSMR}
                onChange={(e) => setHSMR(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
              <TextField
                label="Cost Basis (CB)"
                fullWidth
                type="number"
                value={CB}
                onChange={(e) => setCB(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Sell Price (SP)"
                fullWidth
                type="number"
                value={SP}
                onChange={(e) => setSP(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Capital Gain (CG)"
                fullWidth
                type="number"
                value={CG.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Gain Exclusion (GE)"
                fullWidth
                type="number"
                value={GE.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Taxable Capital Gain (TCG)"
                fullWidth
                type="number"
                value={TCG.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Tax Savings (20%) (TS20)"
                fullWidth
                type="number"
                value={TS20.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="New Basis - S Corp (NBSC)"
                fullWidth
                type="number"
                value={NBSC.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Useful Life - Residential Rental Property (ULRRP)"
                fullWidth
                type="number"
                value={ULRRP}
                margin="normal"
                disabled
              />
              <TextField
                label="Estimated Depreciation (ED)"
                fullWidth
                type="number"
                value={ED.toFixed(2)}
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

export default SellHomeToSCorpForm;