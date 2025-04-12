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

const CharitableLLCForm = ({ onCalculate }) => {
  // Fixed fields
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);
  const [qbidModalOpen, setQbidModalOpen] = useState(false);
  const [partnershipShare, setPartnershipShare] = useState("");

  // Specific fields for Charitable LLC
  const [ASP, setASP] = useState(""); // Asset Sales Price
  const [CB, setCB] = useState(""); // Cost basis
  const [CG, setCG] = useState(0); // Capital Gain
  const [ETS, setETS] = useState(0); // Estimated Tax Savings (20%)
  const [CLLC, setCLLC] = useState(0); // Charitable LLC - Amount
  const [PNVS, setPNVS] = useState(""); // Percentage Non-voting shares
  const [NVSV, setNVSV] = useState(0); // Non-voting shares value
  const [ANVS, setANVS] = useState(""); // Appraised Non-voting shares value
  const [CD, setCD] = useState(0); // Charitable Deduction

  const { performCalculations } = useCalculations();

  // Calculate Capital Gain (CG)
  useEffect(() => {
    const salesPrice = parseFloat(ASP) || 0;
    const costBasis = parseFloat(CB) || 0;
    setCG(salesPrice - costBasis);
  }, [ASP, CB]);

  // Calculate Estimated Tax Savings (ETS)
  useEffect(() => {
    setETS(CG * 0.2);
  }, [CG]);

  // Calculate Charitable LLC Amount (CLLC)
  useEffect(() => {
    const salesPrice = parseFloat(ASP) || 0;
    setCLLC(salesPrice);
  }, [ASP]);

  // Calculate Non-voting shares value (NVSV)
  useEffect(() => {
    const percentage = parseFloat(PNVS) || 0;
    setNVSV(CLLC * (percentage / 100));
  }, [CLLC, PNVS]);

  // Calculate Charitable Deduction (CD)
  useEffect(() => {
    const appraisedValue = parseFloat(ANVS) || 0;
    setCD(appraisedValue);
  }, [ANVS]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (!ASP || parseFloat(ASP) <= 0) {
      setError("Asset Sales Price (ASP) is required and must be greater than 0.");
      return;
    }

    if (!CB || parseFloat(CB) < 0) {
      setError("Cost basis (CB) is required and must be a valid number.");
      return;
    }

    if (!PNVS || parseFloat(PNVS) <= 0 || parseFloat(PNVS) > 100) {
      setError("Percentage Non-voting shares (PNVS) is required and must be between 0 and 100.");
      return;
    }

    if (!ANVS || parseFloat(ANVS) < 0) {
      setError("Appraised Non-voting shares value (ANVS) is required and must be a valid number.");
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
      ASP: parseFloat(ASP),
      CB: parseFloat(CB),
      CG,
      ETS,
      CLLC,
      PNVS: parseFloat(PNVS),
      NVSV,
      ANVS: parseFloat(ANVS),
      CD,
      calculationType: "CharitableLLC",
      partnershipShare: formType === '1065' ? (parseFloat(partnershipShare) || 0) : 0,
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
                label="Asset Sales Price (ASP)"
                fullWidth
                type="number"
                value={ASP}
                onChange={(e) => setASP(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Cost basis (CB)"
                fullWidth
                type="number"
                value={CB}
                onChange={(e) => setCB(e.target.value)}
                margin="normal"
              />
               <TextField
                label="Capital Gain (CG)"
                fullWidth
                type="number"
                value={CG.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Estimated Tax Savings (20%) (ETS)"
                fullWidth
                type="number"
                value={ETS.toFixed(2)}
                margin="normal"
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
             
              <TextField
                label="Charitable LLC - Amount (CLLC)"
                fullWidth
                type="number"
                value={CLLC.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Percentage Non-voting shares (PNVS) %"
                fullWidth
                type="number"
                value={PNVS}
                onChange={(e) => setPNVS(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Non-voting shares value (NVSV)"
                fullWidth
                type="number"
                value={NVSV.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Appraised Non-voting shares value (ANVS)"
                fullWidth
                type="number"
                value={ANVS}
                onChange={(e) => setANVS(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Charitable Deduction (CD)"
                fullWidth
                type="number"
                value={CD.toFixed(2)}
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

              {formType === '1065' && (
                <TextField
                  label="% Share if partnership"
                  fullWidth
                  type="number"
                  value={partnershipShare}
                  onChange={(e) => {
                    const value = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                    setPartnershipShare(value.toString());
                  }}
                  margin="normal"
                  InputProps={{
                    inputProps: { min: 0, max: 100 },
                    endAdornment: (
                      <span style={{ marginRight: '8px' }}>%</span>
                    ),
                  }}
                  helperText="Enter your partnership share percentage (0-100%)"
                />
              )}

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

export default CharitableLLCForm;