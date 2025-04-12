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

const TaxFreeIncomeForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);
  const [partnershipShare, setPartnershipShare] = useState("");
  const [qbidModalOpen, setQbidModalOpen] = useState(false);

  // Campos específicos para Tax-Free Income
  const [MBI, setMBI] = useState(""); // Municipal Bond Interest
  const [BAR, setBAR] = useState(""); // Bond Annual Rate
  const [LIP, setLIP] = useState(""); // Life Insurance Payouts
  const [NTI, setNTI] = useState(""); // Non taxable Income from other strategies
  const [TNTI, setTNTI] = useState(0); // Total Non-taxable income
  const [MTR, setMTR] = useState(""); // Marginal Tax Rate
  const [TS, setTS] = useState(0); // Tax Savings

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

    if (!MBI || parseFloat(MBI) < 0) {
      setError("Municipal Bond Interest is required and must be a valid number.");
      return;
    }

    if (!BAR || parseFloat(BAR) <= 0 || parseFloat(BAR) > 100) {
      setError("Bond Annual Rate is required and must be between 0 and 100.");
      return;
    }

    if (!LIP || parseFloat(LIP) < 0) {
      setError("Life Insurance Payouts is required and must be a valid number.");
      return;
    }

    if (!NTI || parseFloat(NTI) < 0) {
      setError("Non taxable Income from other strategies is required and must be a valid number.");
      return;
    }

    if (!MTR || parseFloat(MTR) < 0 || parseFloat(MTR) > 100) {
      setError("Marginal Tax Rate is required and must be between 0 and 100.");
      return;
    }

    setError(null);

    // Convertir BAR y MTR a decimales
    const barDecimal = parseFloat(BAR) / 100;
    const mtrDecimal = parseFloat(MTR) / 100;

    // Calcular Total Non-taxable Income (TNTI)
    const totalNonTaxableIncome = (parseFloat(MBI) * barDecimal) + parseFloat(LIP) + parseFloat(NTI);
    setTNTI(totalNonTaxableIncome);

    // Calcular Tax Savings (TS)
    const taxSavings = totalNonTaxableIncome * mtrDecimal;
    setTS(taxSavings);

    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID) || 0,
      MBI: parseFloat(MBI),
      BAR: barDecimal,
      LIP: parseFloat(LIP),
      NTI: parseFloat(NTI),
      TNTI: totalNonTaxableIncome,
      MTR: mtrDecimal,
      TS: taxSavings,
      calculationType: "TaxFreeIncome",
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
                label="Municipal Bond Interest (MBI)"
                fullWidth
                type="number"
                value={MBI}
                onChange={(e) => setMBI(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Bond Annual Rate (BAR) %"
                fullWidth
                type="number"
                value={BAR}
                onChange={(e) => setBAR(e.target.value)}
                margin="normal"
                inputProps={{ min: 0, max: 100 }}
              />
              <TextField
                label="Life Insurance Payouts (LIP)"
                fullWidth
                type="number"
                value={LIP}
                onChange={(e) => setLIP(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Non Taxable Income (NTI)"
                fullWidth
                type="number"
                value={NTI}
                onChange={(e) => setNTI(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Marginal Tax Rate (MTR) %"
                fullWidth
                type="number"
                value={MTR}
                onChange={(e) => setMTR(e.target.value)}
                margin="normal"
                inputProps={{ min: 0, max: 100 }}
              />
              <TextField
                label="Total Non-taxable Income (TNTI)"
                fullWidth
                type="number"
                value={TNTI}
                margin="normal"
                disabled
              />
              <TextField
                label="Tax Savings (TS)"
                fullWidth
                type="number"
                value={TS}
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

export default TaxFreeIncomeForm;