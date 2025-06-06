import React, { useState, useEffect } from "react";
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
import CalculateIcon from "@mui/icons-material/Calculate";
import useCalculations from "../utils/useCalculations";
import QbidModal from "./QbidModal";

const ExchangeOnRealEstateForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);
  const [partnershipShare, setPartnershipShare] = useState("");
  const [qbidModalOpen, setQbidModalOpen] = useState(false);

  // Campos específicos para 1031 Exchange
  const [CBSP, setCBSP] = useState(""); // Cost basis of sold property
  const [SP, setSP] = useState(""); // Sell price
  const [CGSP, setCGSP] = useState(0); // Capital gain on Sold property
  const [PPNP, setPPNP] = useState(""); // Purchased price new property
  const [EBOOT, setEBOOT] = useState(0); // Estimated "Boot"
  const [ACBNP, setACBNP] = useState(0); // Adjusted Cost Basis new property
  const [ETDOB, setETDOB] = useState(0); // Estimated Tax Due over "Boot"
  const [ECGTD, setECGTD] = useState(0); // Estimated Capital Gain Tax Deferred

  const { performCalculations } = useCalculations();

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

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }

    if (!CBSP || parseFloat(CBSP) < 0) {
      setError("Cost basis of sold property is required and must be a valid number.");
      return;
    }

    if (!SP || parseFloat(SP) <= 0) {
      setError("Sell price is required and must be greater than 0.");
      return;
    }

    if (!PPNP || parseFloat(PPNP) <= 0) {
      setError("Purchased price new property is required and must be greater than 0.");
      return;
    }

    setError(null);

    // Calcular Capital Gain on Sold Property (CGSP)
    const capitalGain = parseFloat(SP) - parseFloat(CBSP);
    setCGSP(capitalGain);

    // Calcular Estimated "Boot" (EBOOT)
    const estimatedBoot = Math.max(0, parseFloat(SP) - parseFloat(PPNP));
    setEBOOT(estimatedBoot);

    // Calcular Adjusted Cost Basis New Property (ACBNP)
    const adjustedCostBasis = parseFloat(PPNP) - (capitalGain - estimatedBoot);
    setACBNP(adjustedCostBasis);

    // Calcular Estimated Tax Due over "Boot" (ETDOB)
    const estimatedTaxDue = estimatedBoot * 0.2;
    setETDOB(estimatedTaxDue);

    // Calcular Estimated Capital Gain Tax Deferred (ECGTD)
    const estimatedCapitalGainTaxDeferred = Math.max(0, (capitalGain * 0.2) - estimatedTaxDue);
    setECGTD(estimatedCapitalGainTaxDeferred);

    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID) || 0,
      CBSP: parseFloat(CBSP),
      SP: parseFloat(SP),
      CGSP: capitalGain,
      PPNP: parseFloat(PPNP),
      EBOOT: estimatedBoot,
      ACBNP: adjustedCostBasis,
      ETDOB: estimatedTaxDue,
      ECGTD: estimatedCapitalGainTaxDeferred,
      calculationType: "1031Exchange",
      partnershipShare: formType === '1065' ? (parseFloat(partnershipShare) || 0) : 0,
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: "relative", mt: 5 }}>
        <Box sx={{ position: "absolute", top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S79.pdf"
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
                label="Cost Basis of Sold Property (CBSP)"
                fullWidth
                type="number"
                value={CBSP}
                onChange={(e) => setCBSP(e.target.value)}
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
              <TextField
                label="Purchased Price New Property (PPNP)"
                fullWidth
                type="number"
                value={PPNP}
                onChange={(e) => setPPNP(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Capital Gain on Sold Property (CGSP)"
                fullWidth
                type="number"
                value={CGSP}
                margin="normal"
                disabled
              />
              <TextField
                label="Estimated 'Boot' (EBOOT)"
                fullWidth
                type="number"
                value={EBOOT}
                margin="normal"
                disabled
              />
              <TextField
                label="Adjusted Cost Basis New Property (ACBNP)"
                fullWidth
                type="number"
                value={ACBNP}
                margin="normal"
                disabled
              />
              <TextField
                label="Estimated Tax Due over 'Boot' (ETDOB)"
                fullWidth
                type="number"
                value={ETDOB}
                margin="normal"
                disabled
              />
              <TextField
                label="Estimated Capital Gain Tax Deferred (ECGTD)"
                fullWidth
                type="number"
                value={ECGTD}
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

              {(formType === '1065' || formType === '1120S') && (
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

export default ExchangeOnRealEstateForm;
