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

const SCorpRevocationForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);
  const [partnershipShare, setPartnershipShare] = useState("");
  const [qbidModalOpen, setQbidModalOpen] = useState(false);

  // Campos específicos para S Corp Revocation
  const [companyNetIncome, setCompanyNetIncome] = useState("");
  const [shareholderPercentage, setShareholderPercentage] = useState("");
  const [marginalTaxRate, setMarginalTaxRate] = useState("");
  const CORPORATION_TAX_RATE = 21; // Valor fijo
  const [estimatedTaxDueSCorp, setEstimatedTaxDueSCorp] = useState(0);
  const [estimatedTaxDueCCorp, setEstimatedTaxDueCCorp] = useState(0);
  const [amountReinvestmentSCorp, setAmountReinvestmentSCorp] = useState(0);
  const [amountReinvestmentCCorp, setAmountReinvestmentCCorp] = useState(0);
  const [taxesOverDividends, setTaxesOverDividends] = useState(0);
  const [totalTaxesPaidSCorp, setTotalTaxesPaidSCorp] = useState(0);
  const [totalTaxesPaidCCorp, setTotalTaxesPaidCCorp] = useState(0);

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

  // Efecto para calcular Estimated Tax Due como S Corp
  useEffect(() => {
    if (companyNetIncome && marginalTaxRate) {
      const ETSC = parseFloat(companyNetIncome) * (parseFloat(marginalTaxRate) / 100);
      setEstimatedTaxDueSCorp(ETSC);
    }
  }, [companyNetIncome, marginalTaxRate]);

  // Efecto para calcular Estimated Tax Due como C Corp
  useEffect(() => {
    if (companyNetIncome) {
      const ETCC = parseFloat(companyNetIncome) * (CORPORATION_TAX_RATE / 100);
      setEstimatedTaxDueCCorp(ETCC);
    }
  }, [companyNetIncome]);

  // Efecto para calcular Amount for Reinvestment como S Corp
  useEffect(() => {
    if (companyNetIncome && estimatedTaxDueSCorp) {
      const ARSC = parseFloat(companyNetIncome) - estimatedTaxDueSCorp;
      setAmountReinvestmentSCorp(ARSC);
    }
  }, [companyNetIncome, estimatedTaxDueSCorp]);

  // Efecto para calcular Amount for Reinvestment como C Corp
  useEffect(() => {
    if (companyNetIncome && estimatedTaxDueCCorp) {
      const ARCC = parseFloat(companyNetIncome) - estimatedTaxDueCCorp;
      setAmountReinvestmentCCorp(ARCC);
    }
  }, [companyNetIncome, estimatedTaxDueCCorp]);

  // Efecto para calcular Taxes over Dividends
  useEffect(() => {
    if (amountReinvestmentCCorp) {
      const TODD = amountReinvestmentCCorp * 0.20; // 20% tax rate
      setTaxesOverDividends(TODD);
    }
  }, [amountReinvestmentCCorp]);

  // Efectos para calcular Total Taxes Paid
  useEffect(() => {
    setTotalTaxesPaidSCorp(estimatedTaxDueSCorp);
  }, [estimatedTaxDueSCorp]);

  useEffect(() => {
    const TTCC = estimatedTaxDueCCorp + taxesOverDividends;
    setTotalTaxesPaidCCorp(TTCC);
  }, [estimatedTaxDueCCorp, taxesOverDividends]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }

    if (!companyNetIncome || parseFloat(companyNetIncome) <= 0) {
      setError("Company Net Income is required and must be greater than 0.");
      return;
    }

    if (!shareholderPercentage || parseFloat(shareholderPercentage) <= 0 || parseFloat(shareholderPercentage) > 100) {
      setError("Shareholder Percentage must be between 0 and 100.");
      return;
    }

    if (!marginalTaxRate || parseFloat(marginalTaxRate) < 0 || parseFloat(marginalTaxRate) > 100) {
      setError("Marginal Tax Rate must be between 0 and 100.");
      return;
    }

    setError(null);

    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID) || 0,
      companyNetIncome: parseFloat(companyNetIncome),
      shareholderPercentage: parseFloat(shareholderPercentage),
      marginalTaxRate: parseFloat(marginalTaxRate),
      corporationTaxRate: CORPORATION_TAX_RATE,
      estimatedTaxDueSCorp,
      estimatedTaxDueCCorp,
      amountReinvestmentSCorp,
      amountReinvestmentCCorp,
      taxesOverDividends,
      totalTaxesPaidSCorp,
      totalTaxesPaidCCorp,
      calculationType: "SCorpRevocation",
      partnershipShare: formType === '1065' ? (parseFloat(partnershipShare) || 0) : 0,
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: "relative", mt: 5 }}>
        <Box sx={{ position: "absolute", top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S69.pdf"
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
                label="Company Net Income (CNI)"
                fullWidth
                type="number"
                value={companyNetIncome}
                onChange={(e) => setCompanyNetIncome(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Shareholder Percentage (S%) %"
                fullWidth
                type="number"
                value={shareholderPercentage}
                onChange={(e) => setShareholderPercentage(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Marginal Tax Rate (MTR) %"
                fullWidth
                type="number"
                value={marginalTaxRate}
                onChange={(e) => setMarginalTaxRate(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Corporation Tax Rate (CTR) %"
                fullWidth
                type="number"
                value={CORPORATION_TAX_RATE}
                disabled
                margin="normal"
              />

              <TextField
                label="Estimated Tax Due as S Corp (ETSC)"
                fullWidth
                type="number"
                value={estimatedTaxDueSCorp.toFixed(2)}
                margin="normal"
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Estimated Tax Due as C Corp (ETCC)"
                fullWidth
                type="number"
                value={estimatedTaxDueCCorp.toFixed(2)}
                margin="normal"
                disabled
              />

              <TextField
                label="Amount for Reinvestment as S Corp (ARSC)"
                fullWidth
                type="number"
                value={amountReinvestmentSCorp.toFixed(2)}
                margin="normal"
                disabled
              />

              <TextField
                label="Amount for Reinvestment as C Corp (ARCC)"
                fullWidth
                type="number"
                value={amountReinvestmentCCorp.toFixed(2)}
                margin="normal"
                disabled
              />

              <TextField
                label="Taxes over Dividends if Distributed (TODD)"
                fullWidth
                type="number"
                value={taxesOverDividends.toFixed(2)}
                margin="normal"
                disabled
              />

              <TextField
                label="Total Taxes Paid as S Corp (TTSC)"
                fullWidth
                type="number"
                value={totalTaxesPaidSCorp.toFixed(2)}
                margin="normal"
                disabled
              />

              <TextField
                label="Total Taxes Paid as C Corp (TTCC)"
                fullWidth
                type="number"
                value={totalTaxesPaidCCorp.toFixed(2)}
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

export default SCorpRevocationForm; 
