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

const ChoiceOfEntitySCorpForm = ({ onCalculate }) => {
  // Fixed fields
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1120S");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);
  const [qbidModalOpen, setQbidModalOpen] = useState(false);
  const [partnershipShare, setPartnershipShare] = useState('');
  // S Corp specific fields
  const [NI, setNI] = useState(""); // Net Income
  const [AERC, setAERC] = useState(""); // Additional Expense - Reasonable Compensation
  const [NNI, setNNI] = useState(0); // New Net Income
  const [PO, setPO] = useState(""); // Percentage Owned
  const [SSMD, setSSMD] = useState(0); // Social Security and Medicare over Reasonable Compensation
  const [ESSM, setESSM] = useState(0); // Estimated Savings on Social Security and Medicare Taxes
  const [MTR, setMTR] = useState(""); // Marginal Tax Rate
  const [ETD, setETD] = useState(0); // Estimated Tax Due
  const [TSND, setTSND] = useState(0); // Estimated Tax Savings - No Dividends

  const { performCalculations } = useCalculations();

  // Calculate New Net Income
  useEffect(() => {
    const netIncome = parseFloat(NI) || 0;
    const additionalExpenseReasonableCompensation = parseFloat(AERC) || 0;

    const newNetIncome = netIncome - additionalExpenseReasonableCompensation;
    setNNI(newNetIncome);
  }, [NI, AERC]);

  // Calculate Social Security and Medicare Taxes
  useEffect(() => {
    const additionalExpenseReasonableCompensation = parseFloat(AERC) || 0;
    const socialSecurityMedicare = additionalExpenseReasonableCompensation * 0.153;
    setSSMD(socialSecurityMedicare);
  }, [AERC]);

  // Calculate Estimated Savings on Social Security and Medicare Taxes
  useEffect(() => {
    const newNetIncome = parseFloat(NNI) || 0;
    const percentageOwned = parseFloat(PO) || 0;

    const estimatedSavingsSocialSecurityMedicare = newNetIncome * percentageOwned * 0.153;
    setESSM(estimatedSavingsSocialSecurityMedicare / 100);
  }, [NNI, PO]);

  // Calculate Estimated Tax Due and Tax Savings
  useEffect(() => {
    const newNetIncome = parseFloat(NNI) || 0;
    const percentageOwned = parseFloat(PO) || 0;
    const marginalTaxRate = parseFloat(MTR) || 0;

    const estimatedTaxDue = newNetIncome * percentageOwned * marginalTaxRate / 100;
    setETD(estimatedTaxDue / 100);

    const estimatedTaxSavingsNoDividends = newNetIncome * percentageOwned * 0.2;
    setTSND(estimatedTaxSavingsNoDividends / 100);
  }, [NNI, PO, MTR]);

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
    if (!NI || parseFloat(NI) < 0) {
      setError("Net Income (NI) is required and must be a non-negative number.");
      return;
    }

    if (!AERC || parseFloat(AERC) < 0) {
      setError("Additional Expense - Reasonable Compensation (AERC) is required and must be a non-negative number.");
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
      partnershipShare: partnershipShare ? parseFloat(partnershipShare) : 0,
      QBID: parseFloat(QBID) || 0,
      NI: parseFloat(NI),
      AERC: parseFloat(AERC),
      NNI,
      PO: parseFloat(PO),
      SSMD,
      ESSM,
      MTR: parseFloat(MTR),
      ETD,
      TSND,
      calculationType: "ChoiceOfEntitySCorp",
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: "relative", mt: 5 }}>
        <Box sx={{ position: "absolute", top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S99.pdf"
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
                label="Additional Expense - Reasonable Compensation (AERC)"
                fullWidth
                type="number"
                value={AERC}
                onChange={(e) => setAERC(e.target.value)}
                margin="normal"
              />

              <TextField
                label="New Net Income (NNI)"
                fullWidth
                type="number"
                value={NNI.toFixed(2)}
                margin="normal"
                disabled
              />

              <TextField
                label="Percentage Owned (PO) %"
                fullWidth
                type="number"
                value={PO}
                onChange={(e) => setPO(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Social Security and Medicare over Reasonable Compensation (SSMD)"
                fullWidth
                type="number"
                value={SSMD.toFixed(2)}
                margin="normal"
                disabled
              />

              <TextField
                label="Estimated Savings on Social Security and Medicare Taxes (ESSM)"
                fullWidth
                type="number"
                value={ESSM.toFixed(2)}
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

export default ChoiceOfEntitySCorpForm;
