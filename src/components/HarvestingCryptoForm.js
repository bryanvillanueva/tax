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

const HarvestingCryptoForm = ({ onCalculate }) => {
  // Fixed fields (manteniendo exactamente los mismos que especificaste)
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1120S");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);
  const [qbidModalOpen, setQbidModalOpen] = useState(false);
  const [partnershipShare, setPartnershipShare] = useState('');
  // Nuevos campos específicos para Crypto Harvesting
  const [CGTGH, setCGTGH] = useState(""); // Capital Gain (Tax-gain Harvesting)
  const [STLT, setSTLT] = useState("Long"); // Short-term or Long-term
  const [ETO, setETO] = useState(0); // Estimated Tax Owed
  const [ETS, setETS] = useState(0); // Estimated Tax Savings
  const [CLLH, setCLLH] = useState(""); // Capital Loss (Loss Harvesting)
  const [RC, setRC] = useState(""); // Repurchase cost
  const [ACY, setACY] = useState(""); // Applicable in current year
  const [AC, setAC] = useState(0); // Amount Carryover
  const [CYETS, setCYETS] = useState(0); // Current Year Estimated Tax Savings (20%)

  const { performCalculations } = useCalculations();

  // Cálculos para Tax Gain Harvesting
  useEffect(() => {
    const gain = parseFloat(CGTGH) || 0;
    if (STLT === "Short") {
      setETO(gain * 0.2);
      setETS(0);
    } else {
      setETO(gain * 0.15);
      setETS(gain * 0.05);
    }
  }, [CGTGH, STLT]);

  // Cálculos para Loss Harvesting
  useEffect(() => {
    const loss = parseFloat(CLLH) || 0;
    const applicable = parseFloat(ACY) || 0;
    setAC(loss - applicable);
    setCYETS(applicable * 0.2);
  }, [CLLH, ACY]);

  const handleSubmit = (e) => {
    e.preventDefault();

  

    setError(null);

    // Pasar resultados a onCalculate
    const results = performCalculations({
      // Campos fijos
      filingStatus,
      partnerType,
      formType,
      grossIncome: parseFloat(grossIncome) || 0,
      QBID: parseFloat(QBID) || 0,
      partnershipShare: partnershipShare ? parseFloat(partnershipShare) : 0,
      // Nuevos campos de Crypto Harvesting
      CGTGH: parseFloat(CGTGH) || 0,
      STLT,
      ETO,
      ETS,
      CLLH: parseFloat(CLLH) || 0,
      RC: parseFloat(RC) || 0,
      ACY: parseFloat(ACY) || 0,
      AC,
      CYETS,
      
      calculationType: "HarvestingCryptoInvestors",
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
            href="https://cmltaxplanning.com/docs/S102.pdf"
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
            {/* Columna Izquierda - Campos fijos y Tax Gain Harvesting */}
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
                label="Partner Type"
                fullWidth
                value={partnerType}
                onChange={(e) => setPartnerType(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Passive">Passive</MenuItem>
              </TextField>
              
            
              
              
              
              <TextField
                label="Capital Gain (Tax-gain Harvesting)"
                fullWidth
                type="number"
                value={CGTGH}
                onChange={(e) => setCGTGH(e.target.value)}
                margin="normal"
              />
              
              <TextField
                select
                label="Short-term or Long-term"
                fullWidth
                value={STLT}
                onChange={(e) => setSTLT(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Long">Long-term</MenuItem>
                <MenuItem value="Short">Short-term</MenuItem>
              </TextField>
              <TextField
                label="Capital Loss (Loss Harvesting)"
                fullWidth
                type="number"
                value={CLLH}
                onChange={(e) => setCLLH(e.target.value)}
                margin="normal"
                helperText="Ingresar como número negativo"
              />
               <TextField
                label="Repurchase cost (RC)"
                fullWidth
                type="number"
                value={RC}
                onChange={(e) => setRC(e.target.value)}
                margin="normal"
              />
              
            </Grid>

            {/* Columna Derecha - Loss Harvesting y campos restantes */}
            <Grid item xs={12} md={6}>
                
             
              <TextField
                label="Applicable in current year (ACY)"
                fullWidth
                type="number"
                value={ACY}
                onChange={(e) => setACY(e.target.value)}
                margin="normal"
                helperText="Monto de pérdida usado este año"
              />
              <TextField
                label="Estimated Tax Owed (ETO)"
                fullWidth
                type="number"
                value={ETO.toFixed(2)}
                margin="normal"
                disabled
              />
              
              <TextField
                label="Estimated Tax Savings (ETS)"
                fullWidth
                type="number"
                value={ETS.toFixed(2)}
                margin="normal"
                disabled
              />
              
             
              
              
              <TextField
                label="Amount Carryover (AC)"
                fullWidth
                type="number"
                value={AC.toFixed(2)}
                margin="normal"
                disabled
              />
              
              <TextField
                label="Current Year Estimated Tax Savings (20%)"
                fullWidth
                type="number"
                value={CYETS.toFixed(2)}
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
              {(formType === '1065' || formType === '1120S') && (
                <TextField
                  label="% Share if partnership"
                  fullWidth
                  type="number"
                  value={partnershipShare}
                  onChange={(e) => {
                    // Limitar el valor entre 0 y 100
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
              Calcular
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

export default HarvestingCryptoForm;