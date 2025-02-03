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

const FinancedInsuranceForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1120");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Campos específicos para Financed Insurance for Business Risks
  const [loanForInsurancePremium, setLoanForInsurancePremium] = useState("");
  const [loanAnnualRate, setLoanAnnualRate] = useState("");
  const [firstYearInterestExpenses, setFirstYearInterestExpenses] = useState(0);
  const [insurancePremiums, setInsurancePremiums] = useState(0);
  const [financedDeduction, setFinancedDeduction] = useState(0);

  const { performCalculations } = useCalculations();

  

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }

    if (!loanForInsurancePremium || parseFloat(loanForInsurancePremium) <= 0) {
      setError("Loan For Insurance Premium is required and must be greater than 0.");
      return;
    }

    if (!loanAnnualRate || parseFloat(loanAnnualRate) <= 0) {
      setError("Loan Annual Rate is required and must be greater than 0.");
      return;
    }

    setError(null);

    // Calcular valores
    
      const LFIP = parseFloat(loanForInsurancePremium);
      const LAR = parseFloat(loanAnnualRate) / 100; // Convertir a decimal
  
      // Calcular First Year Interest Expenses (FYIE)
      const FYIE = LFIP * LAR;
      setFirstYearInterestExpenses(FYIE);
  
      // Calcular Insurance Premiums (IP)
      const IP = LFIP;
      setInsurancePremiums(IP);
  
      // Calcular Financed Deduction (FD)
      const FD = IP + FYIE;

    

    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID),
      loanForInsurancePremium: parseFloat(loanForInsurancePremium),
      loanAnnualRate: parseFloat(loanAnnualRate),
      firstYearInterestExpenses,
      insurancePremiums,
      financedDeduction: FD,
      calculationType: "FinancedInsurance",
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
                label="Loan For Insurance Premium (LFIP)"
                fullWidth
                type="number"
                value={loanForInsurancePremium}
                onChange={(e) => setLoanForInsurancePremium(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Loan Annual Rate (LAR) (%)"
                fullWidth
                type="number"
                value={loanAnnualRate}
                onChange={(e) => setLoanAnnualRate(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="First Year Interest Expenses (FYIE)"
                fullWidth
                type="number"
                value={firstYearInterestExpenses.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Insurance Premiums (IP)"
                fullWidth
                type="number"
                value={insurancePremiums.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Financed Deduction (FD)"
                fullWidth
                type="number"
                value={financedDeduction.toFixed(2)}
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
                <MenuItem value="1040 - Schedule C/F">1040 - Schedule C/F</MenuItem>
                <MenuItem value="1040NR - Schedule E">1040NR - Schedule E</MenuItem>
                <MenuItem value="1065">1065</MenuItem>
                <MenuItem value="1120S">1120S</MenuItem>
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

export default FinancedInsuranceForm;