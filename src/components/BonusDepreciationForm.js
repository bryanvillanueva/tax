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

const BonusDepreciationForm = ({ onCalculate }) => {
  // Estados
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);
  const [partnershipShare, setPartnershipShare] = useState("");
  const [qbidModalOpen, setQbidModalOpen] = useState(false);
  
  const [CI, setCI] = useState(""); // Costos/Inversión
  const [TVLP, setTVLP] = useState("yes"); // The vehicle is a listed property
  const [TLP, setTLP] = useState("Limited Vehicle"); // Type of listed property
  const [CDFY, setCDFY] = useState(""); // Calculated Depreciation First Year
  const BDR = 0.60; // Bonus Depreciation Rate (60%)

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

    if (!CI || parseFloat(CI) <= 0) {
      setError("Costos/Inversión is required and must be greater than 0.");
      return;
    }

    if (!CDFY || parseFloat(CDFY) < 0) {
      setError("Calculated Depreciation First Year is required and must be a valid number.");
      return;
    }

    setError(null);

    // Calcular Bonus Depreciation Limit (BDL)
    const calculatedBDL = TVLP === "no" ? 0 : (TLP === "Limited Vehicle" ? 20400 : parseFloat(CI) * BDR);

    // Calcular Bonus Depreciation Amount (BDA)
    const calculatedBDA = parseFloat(CI) * BDR;

    // Calcular Total Depreciation (TDP)
    const totalDepreciation = TVLP === "no" ? calculatedBDA + parseFloat(CDFY) : (TLP === "Limited Vehicle" ? 20400 : calculatedBDA + parseFloat(CDFY));

    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID) || 0,
      CI: parseFloat(CI),
      TVLP,
      TLP,
      BDL: calculatedBDL,
      BDA: calculatedBDA,
      CDFY: parseFloat(CDFY),
      bonusDepreciationDeduction: totalDepreciation,
      calculationType: "BonusDepreciation",
      partnershipShare: formType === '1065' ? (parseFloat(partnershipShare) || 0) : 0,
    });

    onCalculate(results);
  };

  // Calcular totalDepreciation en el renderizado
  const totalDepreciation = TVLP === "no" 
    ? parseFloat(CI) * BDR + parseFloat(CDFY) 
    : (TLP === "Limited Vehicle" ? 20400 : parseFloat(CI) * BDR + parseFloat(CDFY));

  return (
    <Container>
      <Box sx={{ position: "relative", mt: 5 }}>
        <Box sx={{ position: "absolute", top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S75.pdf"
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
                label="Costos/Inversión (CI)"
                fullWidth
                type="number"
                value={CI}
                onChange={(e) => setCI(e.target.value)}
                margin="normal"
              />
              <TextField
                select
                label="The vehicle is a listed property (TVLP)"
                fullWidth
                value={TVLP}
                onChange={(e) => setTVLP(e.target.value)}
                margin="normal"
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </TextField>
              <TextField
                select
                label="Type of Listed Property (TLP)"
                fullWidth
                value={TLP}
                onChange={(e) => setTLP(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Limited Vehicle">Limited Vehicle</MenuItem>
                <MenuItem value="6.000 - 14.000 pounds">6.000 - 14.000 pounds</MenuItem>
                <MenuItem value="Not Limited Vehicle">Not Limited Vehicle</MenuItem>
                <MenuItem value="N/A">N/A</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Calculated Depreciation First Year (CDFY)"
                fullWidth
                type="number"
                value={CDFY}
                onChange={(e) => setCDFY(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Bonus Depreciation Limit (BDL)"
                fullWidth
                type="number"
                value={TVLP === "no" ? 0 : (TLP === "Limited Vehicle" ? 20400 : parseFloat(CI) * BDR)}
                margin="normal"
                disabled
              />
              <TextField
                label="Bonus Depreciation Amount (BDA)"
                fullWidth
                type="number"
                value={parseFloat(CI) * BDR}
                margin="normal"
                disabled
              />
              <TextField
                label="Bonus Depreciation Rate (BDR)"
                fullWidth
                type="number"
                value={BDR * 100}
                margin="normal"
                disabled
              />
              <TextField
                label="Bonus Depreciation Deduction"
                fullWidth
                type="number"
                value={totalDepreciation}
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

export default BonusDepreciationForm;
