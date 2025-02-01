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

const DonorAdvisedFundForm = ({ onCalculate }) => {
    // Campos fijos
    const [filingStatus, setFilingStatus] = useState("Single");
    const [partnerType, setPartnerType] = useState("Active");
    const [formType, setFormType] = useState("1040 - Schedule C/F");
    const [grossIncome, setGrossIncome] = useState("");
    const [QBID, setQbid] = useState("");
    const [error, setError] = useState(null);
    const [dagi, setDagi] = useState('');
    const [usualAnnualDonation, setUsualAnnualDonation] = useState("");
    const [yearsGroupingCharitableContribution, setYearsGroupingCharitableContribution] = useState("");
    const [totalCharitableContributionFirstYear, setTotalCharitableContributionFirstYear] = useState(0);
    
  
    const { performCalculations } = useCalculations();
  
   
     

    const handleSubmit = (e) => {
      e.preventDefault();
  
      // Validaciones
      if (!grossIncome || parseFloat(grossIncome) <= 0) {
        setError("Gross Income is required and must be greater than 0.");
        return;
      }
  
      if (!usualAnnualDonation || parseFloat(usualAnnualDonation) <= 0) {
        setError("Usual Annual Donation is required and must be greater than 0.");
        return;
      }
  
      if (!yearsGroupingCharitableContribution || parseFloat(yearsGroupingCharitableContribution) <= 0) {
        setError("Years of Grouping Charitable Contribution is required and must be greater than 0.");
        return;
      }
  
      setError(null);
  
      const TUAD = parseFloat(usualAnnualDonation);
      const YGCC = parseFloat(yearsGroupingCharitableContribution);
     
      // Calcular Total Charitable Contribution First Year (TCCFY)
      const TCCFY = Math.floor(TUAD * YGCC);
      setTotalCharitableContributionFirstYear(TCCFY);
  
      // Asignar el valor de TCCFY a DAGI
      setDagi(TCCFY); // Updates DAGI state automatically
      const updatedDagi = TCCFY;
     
      // Pasar resultados a la función onCalculate
      const results = performCalculations({
        filingStatus,
        grossIncome: parseFloat(grossIncome),
        partnerType,
        formType,
        QBID: parseFloat(QBID),
        usualAnnualDonation: parseFloat(usualAnnualDonation),
        yearsGroupingCharitableContribution: parseFloat(yearsGroupingCharitableContribution),
        totalCharitableContributionFirstYear,
        calculationType: "DonorAdvisedFund",
        dagi: parseFloat(updatedDagi), // Uses the updated DAGI value from state
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
                  label="Deduction To AGI"
                  fullWidth
                  type="number"
                  value={dagi}
                  onChange={(e) => setDagi(e.target.value)}
                  margin="normal"
                  disabled
                />
              </Grid>
  
              <Grid item xs={12} md={6}>
                <TextField
                  label="Taxpayer Usual Annual Donation (TUAD)"
                  fullWidth
                  type="number"
                  value={usualAnnualDonation}
                  onChange={(e) => setUsualAnnualDonation(e.target.value)}
                  margin="normal"
                />
                <TextField
                  label="Years of Grouping Charitable Contribution (YGCC)"
                  fullWidth
                  type="number"
                  value={yearsGroupingCharitableContribution}
                  onChange={(e) => setYearsGroupingCharitableContribution(e.target.value)}
                  margin="normal"
                />
               
                <TextField
                  label="Total Charitable Contribution First Year (TCCFY)"
                  fullWidth
                  type="number"
                  value={totalCharitableContributionFirstYear}
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
  

export default DonorAdvisedFundForm;
