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

const HistoricalPreservationEasementForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);
  const [dagi, setDagi] = useState('');

  // Campos específicos para Historical Preservation Easement
  const [propertyValuationBeforeEasement, setPropertyValuationBeforeEasement] = useState("");
  const [propertyValuationAfterEasement, setPropertyValuationAfterEasement] = useState("");
  const [valuationReduction, setValuationReduction] = useState(0);
  const [adjustedGrossIncome, setAdjustedGrossIncome] = useState("");
  const [charitableContribution, setCharitableContribution] = useState(0);
  const [charitableContributionCarriedForward, setCharitableContributionCarriedForward] = useState(0);
 

  const { performCalculations } = useCalculations();




  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }

    if (!propertyValuationBeforeEasement || parseFloat(propertyValuationBeforeEasement) <= 0) {
      setError("Property Valuation Before Easement is required and must be greater than 0.");
      return;
    }

    if (!propertyValuationAfterEasement || parseFloat(propertyValuationAfterEasement) <= 0) {
      setError("Property Valuation After Easement is required and must be greater than 0.");
      return;
    }

    if (!adjustedGrossIncome || parseFloat(adjustedGrossIncome) <= 0) {
      setError("Adjusted Gross Income is required and must be greater than 0.");
      return;
    }

    setError(null);

    // Calcular valores
    const PVBE = parseFloat(propertyValuationBeforeEasement);
    const PVAE = parseFloat(propertyValuationAfterEasement);
    const AGI = parseFloat(adjustedGrossIncome);

    // Calcular Valuation Reduction (VR)
    const VR = PVBE - PVAE;
    setValuationReduction(VR);

    // Calcular Charitable Contribution (CC)
    const CC = VR > AGI * 0.5 ? AGI * 0.5 : VR;
    setCharitableContribution(CC);

    // Calcular Charitable Contribution Carried Forward (CCCF)
    const CCCF = VR - CC;
    setCharitableContributionCarriedForward(CCCF);

    // Calcular Standard Deduction (SD) basado en el estado civil
    const SD = filingStatus === "Single" ? 12950 : filingStatus === "MFJ" ? 25900 : filingStatus === "MFS" ? 12950 : filingStatus === "HH" ? 19400 : 25900;
    const newDagi = CC;
    setDagi(newDagi)
    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID),
      propertyValuationBeforeEasement: parseFloat(propertyValuationBeforeEasement),
      propertyValuationAfterEasement: parseFloat(propertyValuationAfterEasement),
      valuationReduction: VR,
      adjustedGrossIncome: parseFloat(adjustedGrossIncome),
      charitableContribution: CC,
      charitableContributionCarriedForward: CCCF,
      historicalDeduction: SD,
      calculationType: "HistoricalPreservationEasement",
      dagi: parseFloat(newDagi),
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
                label="Deduction To AGI"
                fullWidth
                type="number"
                value={dagi}
                onChange={(e) => setDagi(e.target.value)}
                margin="normal"
                disabled
              />
              <TextField
                label="Property Valuation Before Easement (PVBE)"
                fullWidth
                type="number"
                value={propertyValuationBeforeEasement}
                onChange={(e) => setPropertyValuationBeforeEasement(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Property Valuation After Easement (PVAE)"
                fullWidth
                type="number"
                value={propertyValuationAfterEasement}
                onChange={(e) => setPropertyValuationAfterEasement(e.target.value)}
                margin="normal"
              />
              
            </Grid>

            <Grid item xs={12} md={6}>
            <TextField
                label="Adjusted Gross Income (AGI)"
                fullWidth
                type="number"
                value={adjustedGrossIncome}
                onChange={(e) => setAdjustedGrossIncome(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Valuation Reduction (VR)"
                fullWidth
                type="number"
                value={valuationReduction.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Charitable Contribution (CC)"
                fullWidth
                type="number"
                value={charitableContribution.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Charitable Contribution Carried Forward (CCCF)"
                fullWidth
                type="number"
                value={charitableContributionCarriedForward.toFixed(2)}
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

export default HistoricalPreservationEasementForm;