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


const HomeOfficeDeductionForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);
 

  // Campos específicos para Home Office Deduction
  const [calculationMethod, setCalculationMethod] = useState("Simplified");
  const [areaOfYourOffice, setAreaOfYourOffice] = useState("");
  const [totalAreaOfYourHome, setTotalAreaOfYourHome] = useState("");
  const [homeExpenses, setHomeExpenses] = useState("");
  const [expensesDirectlyRelatedToHomeOffice, setExpensesDirectlyRelatedToHomeOffice] = useState("");
  const [deductionSimplifiedMethod, setDeductionSimplifiedMethod] = useState(0);
  const [deductionRegularMethod, setDeductionRegularMethod] = useState(0);
  const [homeOfficeDeduction, setHomeOfficeDeduction] = useState(0);

  const { performCalculations } = useCalculations();

 
  
 

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }

    if (!areaOfYourOffice || parseFloat(areaOfYourOffice) <= 0) {
      setError("Area of Your Office is required and must be greater than 0.");
      return;
    }

    if (!totalAreaOfYourHome || parseFloat(totalAreaOfYourHome) <= 0) {
      setError("Total Area of Your Home is required and must be greater than 0.");
      return;
    }

    if (!homeExpenses || parseFloat(homeExpenses) <= 0) {
      setError("Home Expenses is required and must be greater than 0.");  
      return;
    }


    setError(null);

    // Calcular valores
    const AOYO = parseFloat(areaOfYourOffice);
    const TAYH = parseFloat(totalAreaOfYourHome);
    const HE = parseFloat(homeExpenses);
    const EDHO = parseFloat(expensesDirectlyRelatedToHomeOffice);

    // Calcular Deduction in Simplified Method (DSM)
    const DSM = Math.min(AOYO * 5, 1500);
    setDeductionSimplifiedMethod(DSM);

    // Calcular Deduction in Regular Method (DRM)
    const DRM = (HE * (AOYO / TAYH)) + EDHO;
    setDeductionRegularMethod(DRM);

    // Calcular Home Office Deduction
    const HOD = calculationMethod === "Simplified" ? DSM : DRM;
    setHomeOfficeDeduction(HOD);
    

    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID),
      calculationMethod,
      areaOfYourOffice: parseFloat(areaOfYourOffice),
      totalAreaOfYourHome: parseFloat(totalAreaOfYourHome),
      homeExpenses: parseFloat(homeExpenses),
      expensesDirectlyRelatedToHomeOffice: parseFloat(expensesDirectlyRelatedToHomeOffice),
      deductionSimplifiedMethod: DSM,
      deductionRegularMethod: DRM,
      homeOfficeDeduction: HOD,
      calculationType: "HomeOfficeDeduction",
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: "relative", mt: 5 }}>
        <Box sx={{ position: "absolute", top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S54.pdf"
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
                select
                label="Calculation Method (CM)"
                fullWidth
                value={calculationMethod}
                onChange={(e) => setCalculationMethod(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Simplified">Simplified</MenuItem>
                <MenuItem value="Regular">Regular</MenuItem>
              </TextField>
              <TextField
                label="Area of Your Office (AOYO) (Square Foot)"
                fullWidth
                type="number"
                value={areaOfYourOffice}
                onChange={(e) => setAreaOfYourOffice(e.target.value)}
                margin="normal"
              />
            
            </Grid>

            <Grid item xs={12} md={6}>
            <TextField
                label="Total Area of Your Home (TAYH) (Square Foot)"
                fullWidth
                type="number"
                value={totalAreaOfYourHome}
                onChange={(e) => setTotalAreaOfYourHome(e.target.value)}
                margin="normal"
              />
              
            <TextField
                label="Home Expenses (HE)"
                fullWidth
                type="number"
                value={homeExpenses}
                onChange={(e) => setHomeExpenses(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Expenses Directly Related to Home Office (EDHO)"
                fullWidth
                type="number"
                value={expensesDirectlyRelatedToHomeOffice}
                onChange={(e) => setExpensesDirectlyRelatedToHomeOffice(e.target.value)}
                margin="normal"
              />
               {calculationMethod === "Simplified" ? (
                <TextField
                  label="Deduction in Simplified Method (DSM)"
                  fullWidth
                  type="number"
                  value={deductionSimplifiedMethod.toFixed(2)}
                  margin="normal"
                  disabled
                />
              ) : (
                <TextField
                  label="Deduction in Regular Method (DRM)"
                  fullWidth
                  type="number"
                  value={deductionRegularMethod.toFixed(2)}
                  margin="normal"
                  disabled
                />
              )}
             
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
                
              </TextField>
              <TextField
                label="QBID"
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

export default HomeOfficeDeductionForm;
