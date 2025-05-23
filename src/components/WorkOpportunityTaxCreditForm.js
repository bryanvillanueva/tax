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

const WorkOpportunityTaxCreditForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);
  const [partnershipShare, setPartnershipShare] = useState("");
  const [qbidModalOpen, setQbidModalOpen] = useState(false);

  // Campos específicos para Work Opportunity Tax Credit
  const [QW120, setQW120] = useState(""); // Qualified Wages First Year - Employees work 120 to 400 hours
  const [QW400, setQW400] = useState(""); // Qualified Wages First Year - Employees work at least 400 hours
  const [QWSY, setQWSY] = useState(""); // Qualified Wages Second Year - Long Term Family Assistance (vacío por defecto)
  const [TC120, setTC120] = useState(0); // Tax Credit First Year - 120 to 400 Hours
  const [TC400, setTC400] = useState(0); // Tax Credit First Year - At least 400 Hours
  const [TCSY, setTCSY] = useState(0); // Tax Credit Second Year - Long Term Family Assistance
  const [WOTC, setWOTC] = useState(0); // Total Work Opportunity Tax Credit
  const [TC, setTC] = useState(0); // Total Credit
  const [WD, setWD] = useState(0); // Work Deduction (antes Total Deduction)

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

    if (!QW120 || parseFloat(QW120) < 0) {
      setError("Qualified Wages (120-400 hours) is required and must be a valid number.");
      return;
    }

    if (!QW400 || parseFloat(QW400) < 0) {
      setError("Qualified Wages (400+ hours) is required and must be a valid number.");
      return;
    }

    // Si QWSY no tiene valor, se considera 0 internamente
    const qwsyValue = QWSY === "" ? 0 : parseFloat(QWSY);

    setError(null);

    // Calcular Tax Credits
    const taxCredit120 = parseFloat(QW120) * 0.25;
    const taxCredit400 = parseFloat(QW400) * 0.40;
    const taxCreditSY = qwsyValue * 0.50;

    // Calcular Total Work Opportunity Tax Credit (WOTC)
    const totalWOTC = taxCredit120 + taxCredit400 + taxCreditSY;

    // Calcular Work Deduction (WD) como valor positivo
    const workDeduction = Math.abs(totalWOTC);

    // Actualizar estados
    setTC120(taxCredit120);
    setTC400(taxCredit400);
    setTCSY(taxCreditSY);
    setWOTC(totalWOTC);
    setTC(totalWOTC);
    setWD(workDeduction);

    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID) || 0,
      QW120: parseFloat(QW120),
      QW400: parseFloat(QW400),
      QWSY: qwsyValue,
      TC120: taxCredit120,
      TC400: taxCredit400,
      TCSY: taxCreditSY,
      taxCreditsResults: totalWOTC,
      TC: totalWOTC,
      workOpportunityTaxCreditDeduction: workDeduction,
      calculationType: "WorkOpportunityTaxCredit",
      partnershipShare: formType === '1065' ? (parseFloat(partnershipShare) || 0) : 0,
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: "relative", mt: 5 }}>
        <Box sx={{ position: "absolute", top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S78.pdf"
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
                label="Qualified Wages First Year - Employees work 120 to 400 hours (QW120)"
                fullWidth
                type="number"
                value={QW120}
                onChange={(e) => setQW120(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Qualified Wages First Year - Employees work at least 400 hours (QW400)"
                fullWidth
                type="number"
                value={QW400}
                onChange={(e) => setQW400(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Qualified Wages Second Year - Long Term Family Assistance (QWSY)"
                fullWidth
                type="number"
                value={QWSY}
                onChange={(e) => setQWSY(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Tax Credit First Year - 120 to 400 Hours (TC120)"
                fullWidth
                type="number"
                value={TC120}
                margin="normal"
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Tax Credit First Year - At least 400 Hours (TC400)"
                fullWidth
                type="number"
                value={TC400}
                margin="normal"
                disabled
              />
              <TextField
                label="Tax Credit Second Year - Long Term Family Assistance (TCSY)"
                fullWidth
                type="number"
                value={TCSY}
                margin="normal"
                disabled
              />
              <TextField
                label="Total Work Opportunity Tax Credit (WOTC)"
                fullWidth
                type="number"
                value={WOTC}
                margin="normal"
                disabled
              />
              <TextField
                label="Total Credit (TC)"
                fullWidth
                type="number"
                value={TC}
                margin="normal"
                disabled
              />
              <TextField
                label="Work Deduction (WD)"
                fullWidth
                type="number"
                value={WD}
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

export default WorkOpportunityTaxCreditForm;
