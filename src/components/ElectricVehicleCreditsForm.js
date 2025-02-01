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
import useCalculations from "../utils/useCalculations";

const ElectricVehicleCreditsForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);
  const [vehicleCost, setVehicleCost] = useState("");
  const [newOrUsed, setNewOrUsed] = useState("New");
  const [typeOfVehicle, setTypeOfVehicle] = useState("Commercial and SUVs");
  const [adjustedGrossIncome, setAdjustedGrossIncome] = useState("");
  const [batteryCapacityKWH, setBatteryCapacityKWH] = useState("");
  const [incomeLimit, setIncomeLimit] = useState(0);
  const [creditLimit, setCreditLimit] = useState(0);
  const [vehicleCostLimit, setVehicleCostLimit] = useState(0);
  const [creditCalculation, setCreditCalculation] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);

  const { performCalculations } = useCalculations();

 
   
  

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }
  
    if (!vehicleCost || parseFloat(vehicleCost) <= 0) {
      setError("Vehicle Cost is required and must be greater than 0.");
      return;
    }
  
    if (!adjustedGrossIncome || parseFloat(adjustedGrossIncome) <= 0) {
      setError("Adjusted Gross Income is required and must be greater than 0.");
      return;
    }
  
    if (!batteryCapacityKWH || parseFloat(batteryCapacityKWH) <= 0) {
      setError("Battery Capacity (KWH) is required and must be greater than 0.");
      return;
    }
  
    setError(null);
  
    // Calcular valores
    const VC = parseFloat(vehicleCost);
    const AGI = parseFloat(adjustedGrossIncome);
    const BCKH = parseFloat(batteryCapacityKWH);
  
    // Calcular Income Limit (IL)
    let IL = 0;
    if (newOrUsed === "New") {
      switch (filingStatus) {
        case "MFJ":
        case "QSS":
          IL = 300000;
          break;
        case "HH":
          IL = 225000;
          break;
        default:
          IL = 150000;
          break;
      }
    } else {
      switch (filingStatus) {
        case "MFJ":
        case "QSS":
          IL = 150000;
          break;
        case "HH":
          IL = 112500;
          break;
        default:
          IL = 75000;
          break;
      }
    }
    setIncomeLimit(IL);
  
    // Calcular Credit Limit (CL)
    const CL = newOrUsed === "New" ? 7500 : 4000;
    setCreditLimit(CL);
  
    // Calcular Vehicle Cost Limit (VCL)
    const VCL =
      newOrUsed === "New"
        ? typeOfVehicle === "Others"
          ? 55000
          : 80000
        : 25000;
    setVehicleCostLimit(VCL);
  
    // Calcular Credit Calculation (CC)
    let CC = 0;
    if (newOrUsed === "New") {
      if (VC >= VCL) {
        CC = 0;
      } else {
        const baseCredit = 2500 + (BCKH >= 7 ? 417 : 0) + (BCKH - 5) * 417;
        CC = baseCredit > CL ? CL : baseCredit;
      }
    } else {
      CC = Math.min(VC * 0.3, 4000);
    }
    setCreditCalculation(CC);
  
    // Calcular Total Credit (TC) and immediately pass it as taxCreditsResults
    const TC = CC; // Total Credit
    setTotalCredit(TC);
  
    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID),
      vehicleCost: parseFloat(vehicleCost),
      newOrUsed,
      typeOfVehicle,
      adjustedGrossIncome: parseFloat(adjustedGrossIncome),
      batteryCapacityKWH: parseFloat(batteryCapacityKWH),
      incomeLimit,
      creditLimit,
      vehicleCostLimit,
      creditCalculation: CC,
      taxCreditsResults: TC, 
      calculationType: "ElectricVehicleCredits",
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
                label="Vehicle Cost (VC)"
                fullWidth
                type="number"
                value={vehicleCost}
                onChange={(e) => setVehicleCost(e.target.value)}
                margin="normal"
              />
              <TextField
                select
                label="New or Used (NoU)"
                fullWidth
                value={newOrUsed}
                onChange={(e) => setNewOrUsed(e.target.value)}
                margin="normal"
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Used">Used</MenuItem>
              </TextField>
              <TextField
                select
                label="Type of Vehicle (ToV)"
                fullWidth
                value={typeOfVehicle}
                onChange={(e) => setTypeOfVehicle(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Commercial and SUVs">Commercial and SUVs</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
              </TextField>
              <TextField
                label="Adjusted Gross Income (AGI)"
                fullWidth
                type="number"
                value={adjustedGrossIncome}
                onChange={(e) => setAdjustedGrossIncome(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
             
              <TextField
                label="Battery Capacity (KWH)"
                fullWidth
                type="number"
                value={batteryCapacityKWH}
                onChange={(e) => setBatteryCapacityKWH(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Income Limit (IL)"
                fullWidth
                type="number"
                value={incomeLimit.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Credit Limit (CL)"
                fullWidth
                type="number"
                value={creditLimit.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Vehicle Cost Limit (VCL)"
                fullWidth
                type="number"
                value={vehicleCostLimit.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Credit Calculation (CC)"
                fullWidth
                type="number"
                value={creditCalculation.toFixed(2)}
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
              <TextField
                label="QBID (Qualified Business Income Deduction)"
                fullWidth
                type="number"
                value={QBID}
                onChange={(e) => setQbid(e.target.value)}
                margin="normal"
              />
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
    </Container>
  );
};

export default ElectricVehicleCreditsForm;