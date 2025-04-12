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

const MiscTaxCreditsForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1120");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);
  const [qbidModalOpen, setQbidModalOpen] = useState(false);

  // Campos específicos para Misc. Tax Credits
  const [ECF, setECF] = useState(""); // Expenditure in Childcare Facilities
  const [ECRR, setECRR] = useState(""); // Expenditure in Childcare Resource or Referral
  const [ECTC, setECTC] = useState(0); // Estimated Childcare Tax Credit
  const [L1, setL1] = useState(150000); // Limit 1 (valor fijo)
  const [CEDAC, setCEDAC] = useState("No"); // Company is eligible for Disabled Access Credit
  const [TEAE, setTEAE] = useState(""); // Total Eligible Access Expenditures
  const [LMA, setLMA] = useState(0); // Less Minimum Amount
  const [EATC, setEATC] = useState(0); // Estimated Access Tax Credit
  const [L2, setL2] = useState(5000); // Limit 2 (valor fijo)
  const [tc, setTc] = useState(0); // Total Tax Credits

  const { performCalculations } = useCalculations();

  // Efecto para calcular Estimated Childcare Tax Credit (ECTC)
  useEffect(() => {
    const expenditureChildcare = parseFloat(ECF) || 0;
    const expenditureResource = parseFloat(ECRR) || 0;

    const childcareCredit = expenditureChildcare * 0.25 + expenditureResource * 0.1;
    setECTC(childcareCredit);
  }, [ECF, ECRR]);

  // Efecto para calcular Less Minimum Amount (LMA)
  useEffect(() => {
    const eligibleExpenditures = parseFloat(TEAE) || 0;
    const lessAmount = eligibleExpenditures - 250 >= 0 ? eligibleExpenditures - 250 : 0;
    setLMA(lessAmount);
  }, [TEAE]);

  // Efecto para calcular Estimated Access Tax Credit (EATC)
  useEffect(() => {
    const accessCredit = LMA / 2;
    setEATC(accessCredit);
  }, [LMA]);

  // Efecto para calcular Total Tax Credits (tc)
  useEffect(() => {
    const childcareCredit = ECTC >= L1 ? L1 : ECTC;
    const accessCredit = EATC >= L2 ? L2 : EATC;
    const totalCredits = childcareCredit + accessCredit;
    setTc(totalCredits);
  }, [ECTC, EATC, L1, L2]);

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
    if (!ECF || parseFloat(ECF) < 0) {
      setError("Expenditure in Childcare Facilities (ECF) is required and must be a valid number.");
      return;
    }

    if (!ECRR || parseFloat(ECRR) < 0) {
      setError("Expenditure in Childcare Resource or Referral (ECRR) is required and must be a valid number.");
      return;
    }

    if (!TEAE || parseFloat(TEAE) < 0) {
      setError("Total Eligible Access Expenditures (TEAE) is required and must be a valid number.");
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
      ECF: parseFloat(ECF),
      ECRR: parseFloat(ECRR),
      ECTC,
      L1,
      CEDAC,
      TEAE: parseFloat(TEAE),
      LMA,
      EATC,
      L2,
      taxCreditsResults: tc,
      calculationType: "MiscTaxCredits",
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: "relative", mt: 5 }}>
        <Box sx={{ position: "absolute", top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S89.pdf"
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
                label="Expenditure in Childcare Facilities (ECF)"
                fullWidth
                type="number"
                value={ECF}
                onChange={(e) => setECF(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Expenditure in Childcare Resource or Referral (ECRR)"
                fullWidth
                type="number"
                value={ECRR}
                onChange={(e) => setECRR(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Estimated Childcare Tax Credit (ECTC)"
                fullWidth
                type="number"
                value={ECTC.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Limit 1 (L1)"
                fullWidth
                type="number"
                value={L1.toFixed(2)}
                margin="normal"
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              
              <TextField
                select
                label="Company is Eligible for Disabled Access Credit (CEDAC)"
                fullWidth
                value={CEDAC}
                onChange={(e) => setCEDAC(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
              <TextField
                label="Total Eligible Access Expenditures (TEAE)"
                fullWidth
                type="number"
                value={TEAE}
                onChange={(e) => setTEAE(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Less Minimum Amount (LMA)"
                fullWidth
                type="number"
                value={LMA.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Estimated Access Tax Credit (EATC)"
                fullWidth
                type="number"
                value={EATC.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Limit 2 (L2)"
                fullWidth
                type="number"
                value={L2.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Total Tax Credits (tc)"
                fullWidth
                type="number"
                value={tc.toFixed(2)}
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

export default MiscTaxCreditsForm;
