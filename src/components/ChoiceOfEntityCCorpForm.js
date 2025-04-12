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
import CalculateIcon from "@mui/icons-material/Calculate";
import useCalculations from "../utils/useCalculations";
import QbidModal from "./QbidModal";

const ChoiceOfEntityCCorpForm = ({ onCalculate }) => {
  // Fixed fields
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1120");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);
  const [qbidModalOpen, setQbidModalOpen] = useState(false);

  // C Corp specific fields
  const [NI, setNI] = useState(""); // Net Income
  const [CMTR, setCMTR] = useState(""); // Current Marginal Tax Rate
  const [IPI, setIPI] = useState("No"); // Is Passive Income
  const [ETD, setETD] = useState(0); // Estimated Tax Due
  const [CCTR, setCCTR] = useState(""); // C Corp Tax Rate
  const [CCETD, setCCETD] = useState(0); // C Corp - Estimated Tax Due
  const [ENPA, setENPA] = useState(""); // Expenses not previously allowed
  const [CCNET, setCCNET] = useState(0); // C Corp - New Estimated Tax

  const { performCalculations } = useCalculations();

  // Calculate Estimated Tax Due
  useEffect(() => {
    const netIncome = parseFloat(NI) || 0;
    const currentMarginalTaxRate = parseFloat(CMTR) || 0;

    let estimatedTaxDue;
    if (IPI === "Yes" && netIncome >= 200000) {
      estimatedTaxDue = netIncome * (currentMarginalTaxRate / 100+ 0.038);
    } else {
      estimatedTaxDue = netIncome * (currentMarginalTaxRate / 100);
    }
    setETD(estimatedTaxDue);
  }, [NI, CMTR, IPI]);

  // Calculate C Corp Estimated Tax Due and New Estimated Tax
  useEffect(() => {
    const netIncome = parseFloat(NI) || 0;
    const cCorpTaxRate = parseFloat(CCTR) || 0;
    const expensesNotPreviouslyAllowed = parseFloat(ENPA) || 0;

    const ccEstimatedTaxDue = netIncome * cCorpTaxRate;
    setCCETD(ccEstimatedTaxDue / 100);

    const ccNewEstimatedTax = (netIncome - expensesNotPreviouslyAllowed) * cCorpTaxRate;
    setCCNET(ccNewEstimatedTax / 100);
  }, [NI, CCTR, ENPA]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (!NI || parseFloat(NI) < 0) {
      setError("Net Income (NI) is required and must be a non-negative number.");
      return;
    }

    if (!CMTR || parseFloat(CMTR) < 0) {
      setError("Current Marginal Tax Rate (CMTR) is required and must be a non-negative percentage.");
      return;
    }

    if (!CCTR || parseFloat(CCTR) < 0) {
      setError("C Corp Tax Rate (CCTR) is required and must be a non-negative percentage.");
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
      CMTR: parseFloat(CMTR),
      IPI,
      ETD,
      CCTR: parseFloat(CCTR),
      CCETD,
      ENPA: parseFloat(ENPA),
      CCNET,
      calculationType: "ChoiceOfEntityCCorp",
    });

    onCalculate(results);
  };

  // Manejadores para QBID Modal
  const handleQbidCalculateClick = () => {
    setQbidModalOpen(true);
  };

  const handleCloseQbidModal = () => {
    setQbidModalOpen(false);
  };

  const handleQbidSelection = (results, shouldClose = false) => {
    console.log("handleQbidSelection received:", results);
    
    if (results && results.qbidAmount !== undefined) {
      const qbidValue = parseFloat(results.qbidAmount);
      
      if (!isNaN(qbidValue)) {
        console.log("Setting QBID value to:", qbidValue);
        setQbid(qbidValue.toString());
      } else {
        console.warn("Invalid QBID value received:", results.qbidAmount);
      }
    } else {
      console.warn("No qbidAmount found in results:", results);
    }
    
    if (shouldClose) {
      setQbidModalOpen(false);
    }
  };

  // Efecto para registrar cambios en el valor QBID
  useEffect(() => {
    console.log("QBID state value changed:", QBID);
  }, [QBID]);

  return (
    <Container>
      <Box sx={{ position: "relative", mt: 5 }}>
        <Box sx={{ position: "absolute", top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S97.pdf"
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
                label="Current Marginal Tax Rate (CMTR) %"
                fullWidth
                type="number"
                value={CMTR}
                onChange={(e) => setCMTR(e.target.value)}
                margin="normal"
              />

              <TextField
                select
                label="Is Passive Income? (IPI)"
                fullWidth
                value={IPI}
                onChange={(e) => setIPI(e.target.value)}
                margin="normal"
              >
                <MenuItem value="No">No</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
              </TextField>

            
              
            </Grid>

            <Grid item xs={12} md={6}>
            <TextField
                label="Estimated Tax Due (ETD)"
                fullWidth
                type="number"
                value={ETD.toFixed(2)}
                margin="normal"
                disabled
              />
            <TextField
                label="C Corp Tax Rate (CCTR) %"
                fullWidth
                type="number"
                value={CCTR}
                onChange={(e) => setCCTR(e.target.value)}
                margin="normal"
              />

              <TextField
                label="C Corp - Estimated Tax Due (CCETD)"
                fullWidth
                type="number"
                value={CCETD.toFixed(2)}
                margin="normal"
                disabled
              />

              <TextField
                label="Expenses Not Previously Allowed (ENPA)"
                fullWidth
                type="number"
                value={ENPA}
                onChange={(e) => setENPA(e.target.value)}
                margin="normal"
              />

              <TextField
                label="C Corp - New Estimated Tax (CCNET)"
                fullWidth
                type="number"
                value={CCNET.toFixed(2)}
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
              </TextField>

              <Box sx={{ position: 'relative' }}>
                <TextField
                  label="QBID (Qualified Business Income Deduction)"
                  fullWidth
                  type="number"
                  value={QBID}
                  onChange={(e) => setQbid(e.target.value)}
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <Button
                        onClick={handleQbidCalculateClick}
                        size="small"
                        aria-label="calculate QBID"
                        sx={{
                          color: '#0858e6',
                          textTransform: 'none',
                          fontSize: '0.8rem',
                          fontWeight: 'normal',
                          minWidth: 'auto',
                          ml: 1,
                          p: '4px 8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: 'transparent',
                          '&:hover': {
                            backgroundColor: 'rgba(8, 88, 230, 0.08)',
                          }
                        }}
                      >
                        <CalculateIcon fontSize="small" />
                        Calculate
                      </Button>
                    ),
                  }}
                />
              </Box>
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

      <QbidModal 
        open={qbidModalOpen} 
        onClose={handleCloseQbidModal} 
        onSelect={handleQbidSelection}
      />
    </Container>
  );
};

export default ChoiceOfEntityCCorpForm;
