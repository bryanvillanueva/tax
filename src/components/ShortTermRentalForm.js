// src/components/ShortTermRentalForm.js
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

const ShortTermRentalForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);
  const [partnershipShare, setPartnershipShare] = useState("");
  const [qbidModalOpen, setQbidModalOpen] = useState(false);

  // Campos específicos para Short-Term Rental
  const [OPP, setOPP] = useState(""); // Original Purchased Price
  const [ROC, setROC] = useState(""); // Renovations and other cost
  const [DRP, setDRP] = useState(""); // Daily Rental Price
  const [AOR, setAOR] = useState(""); // Annual occupancy Rate
  const [TE, setTE] = useState(""); // Total expenses
  const [TI, setTI] = useState(0); // Total investment
  const [AI, setAI] = useState(0); // Annual Income
  const [NR, setNR] = useState(0); // Net Revenue
  const [ROI, setROI] = useState(0); // Return on Investment

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

    if (!OPP || parseFloat(OPP) <= 0) {
      setError("Original Purchased Price is required and must be greater than 0.");
      return;
    }

    if (!ROC || parseFloat(ROC) < 0) {
      setError("Renovations and other cost is required and must be a valid number.");
      return;
    }

    if (!DRP || parseFloat(DRP) <= 0) {
      setError("Daily Rental Price is required and must be greater than 0.");
      return;
    }

    if (!AOR || parseFloat(AOR) < 0 || parseFloat(AOR) > 100) {
      setError("Annual Occupancy Rate must be a valid percentage between 0 and 100.");
      return;
    }

    if (!TE || parseFloat(TE) < 0) {
      setError("Total expenses is required and must be a valid number.");
      return;
    }

    setError(null);

    // Calcular Total Investment (TI)
    const totalInvestment = parseFloat(OPP) + parseFloat(ROC);
    setTI(totalInvestment);

    // Convertir AOR a decimal y calcular Annual Income (AI)
    const annualOccupancyRate = parseFloat(AOR) / 100;
    const annualIncome = parseFloat(DRP) * (365 * annualOccupancyRate);
    setAI(annualIncome);

    // Calcular Net Revenue (NR)
    const netRevenue = annualIncome - parseFloat(TE);
    setNR(netRevenue);

    // Calcular Return on Investment (ROI) como porcentaje
    const returnOnInvestment = totalInvestment > 0 ? (netRevenue / totalInvestment) * 100 : 0;
    setROI(returnOnInvestment.toFixed(2));

    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID) || 0,
      OPP: parseFloat(OPP),
      ROC: parseFloat(ROC),
      DRP: parseFloat(DRP),
      AOR: annualOccupancyRate,
      TE: parseFloat(TE),
      TI: totalInvestment,
      AI: annualIncome,
      NR: netRevenue,
      ROI: returnOnInvestment,
      calculationType: "ShortTermRental",
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
                label="Original Purchased Price (OPP)"
                fullWidth
                type="number"
                value={OPP}
                onChange={(e) => setOPP(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Renovations and Other Cost (ROC)"
                fullWidth
                type="number"
                value={ROC}
                onChange={(e) => setROC(e.target.value)}
                margin="normal"
              />
               <TextField
                label="Daily Rental Price (DRP)"
                fullWidth
                type="number"
                value={DRP}
                onChange={(e) => setDRP(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Annual Occupancy Rate (AOR)"
                fullWidth
                type="number"
                value={AOR}
                onChange={(e) => setAOR(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Total Expenses (TE)"
                fullWidth
                type="number"
                value={TE}
                onChange={(e) => setTE(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Total Investment (TI)"
                fullWidth
                type="number"
                value={TI}
                margin="normal"
                disabled
              />
              <TextField
                label="Annual Income (AI)"
                fullWidth
                type="number"
                value={AI}
                margin="normal"
                disabled
              />
              <TextField
                label="Net Revenue (NR)"
                fullWidth
                type="number"
                value={NR}
                margin="normal"
                disabled
              />
              <TextField
                label="Return on Investment (ROI)"
                fullWidth
                type="text" // Cambiado a "text" para mostrar el porcentaje
                value={`${ROI}%`} // Mostrar como porcentaje
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

export default ShortTermRentalForm;