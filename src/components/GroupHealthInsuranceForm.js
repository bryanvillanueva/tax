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

const GroupHealthInsuranceForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Campos específicos para Group Health Insurance Deduction
  const [monthlyPremiumPerEmployee, setMonthlyPremiumPerEmployee] = useState("");
  const [numberOfEmployees, setNumberOfEmployees] = useState("");
  const [monthsOfPremiumPaid, setMonthsOfPremiumPaid] = useState("");
  const [groupHealthInsuranceDeduction, setGroupHealthInsuranceDeduction] = useState(0);

  const { performCalculations } = useCalculations();

  
   


  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }

    if (!monthlyPremiumPerEmployee || parseFloat(monthlyPremiumPerEmployee) <= 0) {
      setError("Monthly Premium Per Employee is required and must be greater than 0.");
      return;
    }

    if (!numberOfEmployees || parseFloat(numberOfEmployees) <= 0) {
      setError("Number of Employees is required and must be greater than 0.");
      return;
    }

    if (!monthsOfPremiumPaid || parseFloat(monthsOfPremiumPaid) <= 0) {
      setError("Months of Premium Paid is required and must be greater than 0.");
      return;
    }


    setError(null);

    // Calcular valores
    const MPPE = parseFloat(monthlyPremiumPerEmployee);
    const NE = parseFloat(numberOfEmployees);
    const MPP = parseFloat(monthsOfPremiumPaid);

    // Calcular Group Health Insurance Deduction
    const GHID = MPPE * NE * MPP;
    setGroupHealthInsuranceDeduction(GHID);
    

    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID),
      monthlyPremiumPerEmployee: MPPE,
      numberOfEmployees: NE,
      monthsOfPremiumPaid: MPP,
      groupHealthInsuranceDeduction: GHID, 
      calculationType: "GroupHealthInsurance",
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
                label="Monthly Premium Per Employee (MPPE)"
                fullWidth
                type="number"
                value={monthlyPremiumPerEmployee}
                onChange={(e) => setMonthlyPremiumPerEmployee(e.target.value)}
                margin="normal"
              />
             
             
            </Grid>

            <Grid item xs={12} md={6}>
            <TextField
                label="Number of Employees (NE)"
                fullWidth
                type="number"
                value={numberOfEmployees}
                onChange={(e) => setNumberOfEmployees(e.target.value)}
                margin="normal"
              />
            <TextField
                label="Months of Premium Paid (MPP)"
                fullWidth
                type="number"
                value={monthsOfPremiumPaid}
                onChange={(e) => setMonthsOfPremiumPaid(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Group Health Insurance Deduction"
                fullWidth
                type="number"
                value={groupHealthInsuranceDeduction.toFixed(2)}
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

export default GroupHealthInsuranceForm;