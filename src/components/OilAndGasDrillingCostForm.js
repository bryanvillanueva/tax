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

const OilAndGasDrillingCostForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [partnershipShare, setPartnershipShare] = useState("");
  const [error, setError] = useState(null);
  const [qbidModalOpen, setQbidModalOpen] = useState(false);

  // Campos específicos para Oil and Gas - Drilling Cost
  const [totalInvestment, setTotalInvestment] = useState("");
  const [percentageIntangibleDrillingCost, setPercentageIntangibleDrillingCost] = useState("");
  const [intangibleDrillingCost, setIntangibleDrillingCost] = useState(0);
  const [tangibleDrillingCost, setTangibleDrillingCost] = useState(0);
  const [usefulLifeOfTDC, setUsefulLifeOfTDC] = useState("5");
  const [annualDepreciation, setAnnualDepreciation] = useState(0);
  const [oilAndGasDrillingCostDeduction, setOilAndGasDrillingCostDeduction] = useState(0);

  const { performCalculations } = useCalculations();

  const handleQbidCalculateClick = () => {
    setQbidModalOpen(true);
  };

  const handleCloseQbidModal = () => {
    setQbidModalOpen(false);
  };

  const handleQbidSelection = (results, shouldClose = false) => {
    console.log("handleQbidSelection received:", results);
    
    // Recibimos los resultados del cálculo de QBID desde el formulario en el modal
    if (results && results.qbidAmount !== undefined) {
      // Asegurar que el valor es un número
      const qbidValue = parseFloat(results.qbidAmount);
      
      // Actualizamos el valor del QBID con el resultado calculado
      if (!isNaN(qbidValue)) {
        console.log("Setting QBID value to:", qbidValue);
        setQbid(qbidValue.toString());
      } else {
        console.warn("Invalid QBID value received:", results.qbidAmount);
      }
    } else {
      console.warn("No qbidAmount found in results:", results);
    }
    
    // Solo cerramos el modal si se indica explícitamente (cuando se presiona "Apply Results")
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

    if (!totalInvestment || parseFloat(totalInvestment) <= 0) {
      setError("Total Investment is required and must be greater than 0.");
      return;
    }

    if (!percentageIntangibleDrillingCost || parseFloat(percentageIntangibleDrillingCost) <= 0) {
      setError("Percentage of Intangible Drilling Cost is required and must be greater than 0.");
      return;
    }

    if (!usefulLifeOfTDC || parseFloat(usefulLifeOfTDC) <= 0) {
      setError("Useful Life of TDC is required and must be greater than 0.");
      return;
    }

    // No verificamos partnershipShare ya que es opcional
    // El partnership share puede ir en blanco

    setError(null);

    // Calcular valores
    const TI = parseFloat(totalInvestment);
    const PID = parseFloat(percentageIntangibleDrillingCost) / 100; // Convertir a decimal
    const ULT = parseFloat(usefulLifeOfTDC);

    // Calcular Intangible Drilling Cost (IDC)
    const IDC = TI * PID;
    setIntangibleDrillingCost(IDC);

    // Calcular Tangible Drilling Cost (TDC)
    const TDC = TI - IDC;
    setTangibleDrillingCost(TDC);

    // Calcular Annual Depreciation (AD)
    const AD = TDC / ULT;
    setAnnualDepreciation(AD);

    // Calcular Oil and Gas - Drilling Cost Deduction
    const OGDC = IDC + AD;
    setOilAndGasDrillingCostDeduction(OGDC);

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
      totalInvestment: TI,
      percentageIntangibleDrillingCost: PID,
      intangibleDrillingCost: IDC,
      tangibleDrillingCost: TDC,
      usefulLifeOfTDC: ULT,
      annualDepreciation: AD,
      oilAndGasDrillingCostDeduction: OGDC,
      calculationType: "OilAndGasDrillingCost",
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: "relative", mt: 5 }}>
        <Box sx={{ position: "absolute", top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S58.pdf"
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
                label="Total Investment (TI)"
                fullWidth
                type="number"
                value={totalInvestment}
                onChange={(e) => setTotalInvestment(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Percentage of Intangible Drilling Cost (PID) (%)"
                fullWidth
                type="number"
                value={percentageIntangibleDrillingCost}
                onChange={(e) => setPercentageIntangibleDrillingCost(e.target.value)}
                margin="normal"
                />
                
              <TextField
                select
                label="Useful Life of TDC (ULT)"
                fullWidth
                value={usefulLifeOfTDC}
                onChange={(e) => setUsefulLifeOfTDC(e.target.value)}
                margin="normal"
              >
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="7">7</MenuItem>
              </TextField>  
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Intangible Drilling Cost (IDC)"
                fullWidth
                type="number"
                value={intangibleDrillingCost.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Tangible Drilling Cost (TDC)"
                fullWidth
                type="number"
                value={tangibleDrillingCost.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Annual Depreciation (AD)"
                fullWidth
                type="number"
                value={annualDepreciation.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Oil and Gas - Drilling Cost Deduction"
                fullWidth
                type="number"
                value={oilAndGasDrillingCostDeduction.toFixed(2)}
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

      {/* Modal para QBID */}
      <QbidModal 
        open={qbidModalOpen} 
        onClose={handleCloseQbidModal} 
        onSelect={handleQbidSelection}
      />
    </Container>
  );
};

export default OilAndGasDrillingCostForm;
