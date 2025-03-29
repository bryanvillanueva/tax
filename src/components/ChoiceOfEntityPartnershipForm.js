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

const ChoiceOfEntityPartnershipForm = ({ onCalculate }) => {
  // Fixed fields
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1065");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Partnership specific fields
  const [NI, setNI] = useState(""); // Net Income
  const [REB, setREB] = useState("No"); // Real Estate Business
  const [RP, setRP] = useState("No"); // Recommended Partnership
  const [PO, setPO] = useState(""); // Percentage Owned
  const [ESMT, setESMT] = useState(0); // Estimated Social Security and Medicare Taxes
  const [MTR, setMTR] = useState(""); // Marginal Tax Rate
  const [ETD, setETD] = useState(0); // Estimated Tax Due
  const [TSND, setTSND] = useState(0); // Estimated Tax Savings - No Dividends

  const { performCalculations } = useCalculations();

  // Calculate Estimated Social Security and Medicare Taxes
  useEffect(() => {
    const netIncome = parseFloat(NI) || 0;
    const percentageOwned = parseFloat(PO) || 0;

    let estimatedSocialSecurityMedicareTaxes;
    if (RP === "No") {
      estimatedSocialSecurityMedicareTaxes = "N/A";
    } else if (REB === "Yes") {
      estimatedSocialSecurityMedicareTaxes = 0;
    } else {
      estimatedSocialSecurityMedicareTaxes = netIncome * percentageOwned * 0.153;
    }
    setESMT(estimatedSocialSecurityMedicareTaxes / 100);
  }, [NI, REB, RP, PO]);

  // Calculate Estimated Tax Due and Tax Savings
  useEffect(() => {
    const netIncome = parseFloat(NI) || 0;
    const percentageOwned = parseFloat(PO) || 0;
    const marginalTaxRate = parseFloat(MTR) || 0;

    const estimatedTaxDue = netIncome * percentageOwned * marginalTaxRate / 100;
    setETD(estimatedTaxDue / 100);

    const estimatedTaxSavingsNoDividends = netIncome * percentageOwned * 0.2;
    setTSND(estimatedTaxSavingsNoDividends / 100);
  }, [NI, PO, MTR]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (!NI || parseFloat(NI) < 0) {
      setError("Net Income (NI) is required and must be a non-negative number.");
      return;
    }

    if (!PO || parseFloat(PO) < 0 || parseFloat(PO) > 100) {
      setError("Percentage Owned (PO) is required and must be between 0 and 100.");
      return;
    }

    if (!MTR || parseFloat(MTR) < 0) {
      setError("Marginal Tax Rate (MTR) is required and must be a non-negative percentage.");
      return;
    }

    setError(null);

    // Pass results to onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID) || 0,
      NI: parseFloat(NI),
      REB,
      RP,
      PO: parseFloat(PO),
      ESMT,
      MTR: parseFloat(MTR),
      ETD,
      TSND,
      calculationType: "ChoiceOfEntityPartnership",
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
                label="Net Income (NI)"
                fullWidth
                type="number"
                value={NI}
                onChange={(e) => setNI(e.target.value)}
                margin="normal"
              />

              <TextField
                select
                label="Is it a Real Estate Business? (REB)"
                fullWidth
                value={REB}
                onChange={(e) => setREB(e.target.value)}
                margin="normal"
              >
                <MenuItem value="No">No</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
              </TextField>

              <TextField
                select
                label="Is it Recommended to be a Partnership? (RP)"
                fullWidth
                value={RP}
                onChange={(e) => setRP(e.target.value)}
                margin="normal"
              >
                <MenuItem value="No">No</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
              </TextField>

              
            </Grid>

            <Grid item xs={12} md={6}>
            <TextField
                label="Percentage Owned (PO) %"
                fullWidth
                type="number"
                value={PO}
                onChange={(e) => setPO(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Estimated Social Security and Medicare Taxes (ESMT)"
                fullWidth
                type="text"
                value={typeof ESMT === 'number' ? ESMT.toFixed(2) : ESMT}
                margin="normal"
                disabled
              />

              <TextField
                label="Marginal Tax Rate (MTR) %"
                fullWidth
                type="number"
                value={MTR}
                onChange={(e) => setMTR(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Estimated Tax Due (ETD)"
                fullWidth
                type="number"
                value={ETD.toFixed(2)}
                margin="normal"
                disabled
              />

              <TextField
                label="Estimated Tax Savings - No Dividends (TSND)"
                fullWidth
                type="number"
                value={TSND.toFixed(2)}
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

export default ChoiceOfEntityPartnershipForm;