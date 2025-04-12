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

const SelfDirectedIRA401KForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);
  const [qbidModalOpen, setQbidModalOpen] = useState(false);

  // Campos específicos para Self-Directed IRA/401(K) Investments
  const [CBTI, setCBTI] = useState(""); // Current Balance Traditional IRA Account
  const [ATO, setATO] = useState(""); // Amount to Override
  const [EIR, setEIR] = useState(""); // Estimated IRA Revenue
  const [MTR, setMTR] = useState(""); // Marginal Tax Rate
  const [AG, setAG] = useState(0); // Annual Growth
  const [TD, setTD] = useState(0); // Tax Deferred

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

  // Efecto para calcular Annual Growth (AG)
  useEffect(() => {
    const amountToOverride = parseFloat(ATO) || 0;
    const estimatedRevenue = parseFloat(EIR) || 0;

    const annualGrowth = amountToOverride * estimatedRevenue / 100;
    setAG(annualGrowth);
  }, [ATO, EIR]);

  // Efecto para calcular Tax Deferred (TD)
  useEffect(() => {
    const annualGrowth = parseFloat(AG) || 0;
    const marginalTaxRate = parseFloat(MTR) || 0;

    const taxDeferred = annualGrowth * marginalTaxRate / 100;
    setTD(taxDeferred);
  }, [AG, MTR]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!CBTI || parseFloat(CBTI) <= 0) {
      setError("Current Balance Traditional IRA Account (CBTI) is required and must be greater than 0.");
      return;
    }

    if (!ATO || parseFloat(ATO) <= 0) {
      setError("Amount to Override (ATO) is required and must be greater than 0.");
      return;
    }

    if (!EIR || parseFloat(EIR) <= 0) {
      setError("Estimated IRA Revenue (EIR) is required and must be greater than 0.");
      return;
    }

    if (!MTR || parseFloat(MTR) <= 0) {
      setError("Marginal Tax Rate (MTR) is required and must be greater than 0.");
      return;
    }

    setError(null);

    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID) || 0,
      CBTI: parseFloat(CBTI),
      ATO: parseFloat(ATO),
      EIR: parseFloat(EIR),
      AG,
      MTR: parseFloat(MTR),
      TD,
      calculationType: "SelfDirectedIRA401K",
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
                label="Current Balance Traditional IRA Account"
                fullWidth
                type="number"
                value={CBTI}
                onChange={(e) => setCBTI(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Amount to Override (ATO)"
                fullWidth
                type="number"
                value={ATO}
                onChange={(e) => setATO(e.target.value)}
                margin="normal"
              />
              
            </Grid>

            <Grid item xs={12} md={6}>
            <TextField
                label="Estimated IRA Revenue (EIR) %"
                fullWidth
                type="number"
                value={EIR}
                onChange={(e) => setEIR(e.target.value)}
                margin="normal"
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
                label="Annual Growth (AG)"
                fullWidth
                type="number"
                value={AG.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Tax Deferred (TD)"
                fullWidth
                type="number"
                value={TD.toFixed(2)}
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

export default SelfDirectedIRA401KForm;