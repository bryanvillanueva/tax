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
import CalculateIcon from '@mui/icons-material/Calculate';
import useCalculations from "../utils/useCalculations";
import QbidModal from './QbidModal';

const InstallmentSaleForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [partnershipShare, setPartnershipShare] = useState("");
  const [error, setError] = useState(null);
  const [qbidModalOpen, setQbidModalOpen] = useState(false);

  // Campos específicos para Installment Sale
  const [costBasis, setCostBasis] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [capitalGain, setCapitalGain] = useState(0);
  const [grossProfitRatio, setGrossProfitRatio] = useState(0);
  const [yearsOfInstallment, setYearsOfInstallment] = useState("");
  const [firstYearIncomeRecognition, setFirstYearIncomeRecognition] = useState(0);
  const [capitalGainFirstYear, setCapitalGainFirstYear] = useState(0);
  const [interestRateRemainingCapitalGain, setInterestRateRemainingCapitalGain] = useState("");
  const [secondYearInterestIncome, setSecondYearInterestIncome] = useState(0);
  const [installmentSaleDeduction, setInstallmentSaleDeduction] = useState(0);

  const { performCalculations } = useCalculations();

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

    if (!costBasis || parseFloat(costBasis) <= 0) {
      setError("Cost Basis is required and must be greater than 0.");
      return;
    }

    if (!sellPrice || parseFloat(sellPrice) <= 0) {
      setError("Sell Price is required and must be greater than 0.");
      return;
    }

    if (!yearsOfInstallment || parseFloat(yearsOfInstallment) <= 0) {
      setError("Years of Installment is required and must be greater than 0.");
      return;
    }

    if (!interestRateRemainingCapitalGain || parseFloat(interestRateRemainingCapitalGain) <= 0) {
      setError("Interest Rate - Remaining Capital Gain is required and must be greater than 0.");
      return;
    }

    setError(null);

    // Calcular valores
    const CB = parseFloat(costBasis);
    const SP = parseFloat(sellPrice);
    const YI = parseFloat(yearsOfInstallment);
    const IRRCG = parseFloat(interestRateRemainingCapitalGain) / 100; // Convertir a decimal

    // Calcular Capital Gain (CG)
    const CG = SP - CB;
    setCapitalGain(CG);

    // Calcular Gross Profit Ratio (GPR)
    const GPR = (CG / SP) * 100;
    setGrossProfitRatio(GPR);

    // Calcular First Year Income Recognition (FYIR)
    const FYIR = CG / YI;
    setFirstYearIncomeRecognition(FYIR);

    // Calcular Capital Gain First Year (CGFY)
    const CGFY = (FYIR * GPR) / 100;
    setCapitalGainFirstYear(CGFY);

    // Calcular Second Year Interest Income (SYII)
    const SYII = IRRCG * (CG - FYIR);
    setSecondYearInterestIncome(SYII);

    // Calcular Installment Sale Deduction
    const ISD = CGFY + SYII;
    setInstallmentSaleDeduction(ISD);

    const qbidValue = QBID ? parseFloat(QBID) : 0;
    console.log("Using QBID value for calculation:", qbidValue);

    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      partnershipShare: partnershipShare ? parseFloat(partnershipShare) : 0,
      QBID: qbidValue,
      costBasis: CB,
      sellPrice: SP,
      capitalGain: CG,
      grossProfitRatio: GPR,
      yearsOfInstallment: YI,
      firstYearIncomeRecognition: FYIR,
      capitalGainFirstYear: CGFY,
      interestRateRemainingCapitalGain: parseFloat(interestRateRemainingCapitalGain),
      secondYearInterestIncome: SYII,
      installmentSaleDeduction: ISD,
      calculationType: "InstallmentSale",
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
                label="Cost Basis (CB)"
                fullWidth
                type="number"
                value={costBasis}
                onChange={(e) => setCostBasis(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Sell Price (SP)"
                fullWidth
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Years of Installment (YI)"
                fullWidth 
                type="number"
                value={yearsOfInstallment}
                onChange={(e) => setYearsOfInstallment(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Interest Rate - Remaining Capital Gain (IRRCG) (%)"
                fullWidth
                type="number"
                value={interestRateRemainingCapitalGain}
                onChange={(e) => setInterestRateRemainingCapitalGain(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              
              <TextField
                label="Capital Gain (CG)"
                fullWidth
                type="number"
                value={capitalGain.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Gross Profit Ratio (GPR) (%)"
                fullWidth
                type="text"
                value={`${grossProfitRatio.toFixed(2)}%`}
                margin="normal"
                disabled
              />
              <TextField
                label="First Year Income Recognition (FYIR)"
                fullWidth
                type="number"
                value={firstYearIncomeRecognition.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Capital Gain First Year (CGFY)"
                fullWidth
                type="number"
                value={capitalGainFirstYear.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Second Year Interest Income (SYII)"
                fullWidth
                type="number"
                value={secondYearInterestIncome.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Installment Sale Deduction"
                fullWidth
                type="number"
                value={installmentSaleDeduction.toFixed(2)}
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

      {/* Modal para QBID */}
      <QbidModal 
        open={qbidModalOpen} 
        onClose={handleCloseQbidModal} 
        onSelect={handleQbidSelection}
      />
    </Container>
  );
};

export default InstallmentSaleForm;