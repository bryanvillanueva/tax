import React, { useState } from "react";
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
import CalculateIcon from '@mui/icons-material/Calculate';
import QbidModal from './QbidModal';
import useCalculations from "../utils/useCalculations";

const COVULForm = ({ onCalculate }) => {
  
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1120");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [annualPremiumsPaid, setAnnualPremiumsPaid] = useState("");
  const [annualGrowthRate, setAnnualGrowthRate] = useState("");
  const [totalYears, setTotalYears] = useState("");
  const [marginalTaxRate, setMarginalTaxRate] = useState("");
  const [estimatedFutureValue, setEstimatedFutureValue] = useState(0);
  const [totalContributed, setTotalContributed] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [taxDeferred, setTaxDeferred] = useState(0);
  const [qbidModalOpen, setQbidModalOpen] = useState(false);

  const [error, setError] = useState(null);

  const { performCalculations } = useCalculations();

  const handleQbidCalculateClick = () => {
    setQbidModalOpen(true);
  };

  const handleCloseQbidModal = () => {
    setQbidModalOpen(false);
  };

  const handleQbidSelection = (results, shouldClose = false) => {
    if (results && results.qbidAmount !== undefined) {
      const qbidValue = parseFloat(results.qbidAmount);
      if (!isNaN(qbidValue)) {
        setQbid(qbidValue.toString());
      }
    }
    if (shouldClose) {
      setQbidModalOpen(false);
    }
  };

  const calculateValues = () => {
    const APP = parseFloat(annualPremiumsPaid);
    const AGR = parseFloat(annualGrowthRate) / 100; // Convertir a decimal
    const TY = parseFloat(totalYears);
    const MTR = parseFloat(marginalTaxRate) / 100; // Convertir a decimal

    // Calcular EFV
    const EFV = APP * ((Math.pow(1 + AGR, TY) - 1) / AGR);
    setEstimatedFutureValue(EFV);

    // Calcular TCon
    const TCon = APP * TY;
    setTotalContributed(TCon);

    // Calcular TI
    const TI = EFV - TCon;
    setTotalInterest(TI);

    // Calcular TDef
    const TDef = MTR * TI;
    setTaxDeferred(TDef);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }

    if (!annualPremiumsPaid || parseFloat(annualPremiumsPaid) <= 0) {
      setError("Annual Premiums Paid is required and must be greater than 0.");
      return;
    }

    if (!annualGrowthRate || parseFloat(annualGrowthRate) <= 0) {
      setError("Annual Growth Rate is required and must be greater than 0.");
      return;
    }

    if (!totalYears || parseFloat(totalYears) <= 0) {
      setError("Total Years is required and must be greater than 0.");
      return;
    }

    if (!marginalTaxRate || parseFloat(marginalTaxRate) <= 0) {
      setError("Marginal Tax Rate is required and must be greater than 0.");
      return;
    }

    setError(null);

    // Calcular valores
    calculateValues();

    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID),
      annualPremiumsPaid: parseFloat(annualPremiumsPaid),
      annualGrowthRate: parseFloat(annualGrowthRate),
      totalYears: parseFloat(totalYears),
      marginalTaxRate: parseFloat(marginalTaxRate),
      estimatedFutureValue,
      totalContributed,
      totalInterest,
      taxDeferred,
      calculationType: "Covul",
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: "relative", mt: 5 }}>
        <Box sx={{ position: "absolute", top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S41.pdf"
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
                label="Annual Premiums Paid (APP)"
                fullWidth
                type="number"
                value={annualPremiumsPaid}
                onChange={(e) => setAnnualPremiumsPaid(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Annual Growth Rate (AGR) (%)"
                fullWidth
                type="number"
                value={annualGrowthRate}
                onChange={(e) => setAnnualGrowthRate(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Total Years (TY)"
                fullWidth
                type="number"
                value={totalYears}
                onChange={(e) => setTotalYears(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Marginal Tax Rate (MTR) (%)"
                fullWidth
                type="number"
                value={marginalTaxRate}
                onChange={(e) => setMarginalTaxRate(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Estimated Future Value (EFV)"
                fullWidth
                type="number"
                value={estimatedFutureValue.toFixed(2)}
                margin="normal"
                disabled
              />

              <TextField
                label="Total Contributed (TCon)"
                fullWidth
                type="number"
                value={totalContributed.toFixed(2)}
                margin="normal"
                disabled
              />

              <TextField
                label="Total Interest (TI)"
                fullWidth
                type="number"
                value={totalInterest.toFixed(2)}
                margin="normal"
                disabled
              />

              <TextField
                label="Tax Deferred (TDef)"
                fullWidth
                type="number"
                value={taxDeferred.toFixed(2)}
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

export default COVULForm;

