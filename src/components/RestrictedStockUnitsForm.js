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

const RestrictedStockUnitsForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1120");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);
  const [qbidModalOpen, setQbidModalOpen] = useState(false);

  // Campos específicos para RSU
  const [numberOfRSU, setNumberOfRSU] = useState("");
  const [valuePerShare, setValuePerShare] = useState("");
  const [vestingMethod, setVestingMethod] = useState("Time");
  const [numberOfYears, setNumberOfYears] = useState("");
  const [goalAchieved, setGoalAchieved] = useState("No");
  const [yearIncomeRecognition, setYearIncomeRecognition] = useState(0);
  const [marginalTaxRate, setMarginalTaxRate] = useState("");
  const [estimatedTaxDue, setEstimatedTaxDue] = useState(0);

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

  // Efecto para calcular Year Income Recognition
  useEffect(() => {
    if (numberOfRSU && valuePerShare) {
      let YIR = 0;
      if (vestingMethod === "Time" && numberOfYears && numberOfYears !== "0") {
        YIR = (parseFloat(numberOfRSU) * parseFloat(valuePerShare)) / parseFloat(numberOfYears);
      } else if (vestingMethod === "Goals" && goalAchieved === "Yes") {
        YIR = parseFloat(numberOfRSU) * parseFloat(valuePerShare);
      }
      setYearIncomeRecognition(YIR);
    }
  }, [numberOfRSU, valuePerShare, vestingMethod, numberOfYears, goalAchieved]);

  // Efecto para calcular Estimated Tax Due
  useEffect(() => {
    if (yearIncomeRecognition && marginalTaxRate) {
      const ETD = yearIncomeRecognition * (parseFloat(marginalTaxRate) / 100);
      setEstimatedTaxDue(ETD);
    }
  }, [yearIncomeRecognition, marginalTaxRate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }

    if (!numberOfRSU || parseFloat(numberOfRSU) <= 0) {
      setError("Number of RSU is required and must be greater than 0.");
      return;
    }

    if (!valuePerShare || parseFloat(valuePerShare) <= 0) {
      setError("Value per Share is required and must be greater than 0.");
      return;
    }

    if (vestingMethod === "Time" && (!numberOfYears || parseFloat(numberOfYears) <= 0)) {
      setError("Number of Years is required and must be greater than 0 for Time vesting method.");
      return;
    }

    if (!marginalTaxRate || parseFloat(marginalTaxRate) < 0) {
      setError("Marginal Tax Rate is required and must be a valid percentage.");
      return;
    }

    setError(null);

    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID) || 0,
      numberOfRSU: parseFloat(numberOfRSU),
      valuePerShare: parseFloat(valuePerShare),
      vestingMethod,
      numberOfYears: parseFloat(numberOfYears),
      goalAchieved,
      yearIncomeRecognition,
      marginalTaxRate: parseFloat(marginalTaxRate),
      estimatedTaxDue,
      calculationType: "RestrictedStockUnits",
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
                label="Number of RSU"
                fullWidth
                type="number"
                value={numberOfRSU}
                onChange={(e) => setNumberOfRSU(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Value per Share (VPS)"
                fullWidth
                type="number"
                value={valuePerShare}
                onChange={(e) => setValuePerShare(e.target.value)}
                margin="normal"
              />
               <TextField
                select
                label="Vesting Method (VM)"
                fullWidth
                value={vestingMethod}
                onChange={(e) => setVestingMethod(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Time">Time</MenuItem>
                <MenuItem value="Goals">Goals</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
             
              {vestingMethod === "Time" && (
                <TextField
                  label="Number of Years (NY)"
                  fullWidth
                  type="number"
                  value={numberOfYears}
                  onChange={(e) => setNumberOfYears(e.target.value)}
                  margin="normal"
                />
              )}
              {vestingMethod === "Goals" && (
                <TextField
                  select
                  label="Goal Achieved (GA)"
                  fullWidth
                  value={goalAchieved}
                  onChange={(e) => setGoalAchieved(e.target.value)}
                  margin="normal"
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              )}
              <TextField
                label="Year Income Recognition (YIR)"
                fullWidth
                type="number"
                value={yearIncomeRecognition.toFixed(2)}
                margin="normal"
                disabled
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
                label="Estimated Tax Due (ETD)"
                fullWidth
                type="number"
                value={estimatedTaxDue.toFixed(2)}
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

export default RestrictedStockUnitsForm; 