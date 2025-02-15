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
import useCalculations from "../utils/useCalculations";

const RetireePlanningForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040NR - Schedule E");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Campos específicos para Retiree Planning
  const [socialSecurityIncome, setSocialSecurityIncome] = useState("");
  const [requiredMinimumDistribution, setRequiredMinimumDistribution] = useState("");
  const [otherOrdinaryIncome, setOtherOrdinaryIncome] = useState("");
  const [otherRetirementIncome, setOtherRetirementIncome] = useState("");
  const [qualifiedCharitableDistributions, setQualifiedCharitableDistributions] = useState("");
  const [combinedIncome, setCombinedIncome] = useState(0);
  const [ssiPercentage, setSSIPercentage] = useState(0);
  const [taxIncomeRestriced, setTaxIncomeRestriced] = useState(0);

  const { performCalculations } = useCalculations();

  // Efecto para calcular Combined Income
  useEffect(() => {
    const ssi = parseFloat(socialSecurityIncome) || 0;
    const rmd = parseFloat(requiredMinimumDistribution) || 0;
    const odi = parseFloat(otherOrdinaryIncome) || 0;
    const ori = parseFloat(otherRetirementIncome) || 0;
    const qcd = parseFloat(qualifiedCharitableDistributions) || 0;

    const CI = (ssi / 2) + 
              (rmd - qcd) + 
              odi + 
              ori;
    
    setCombinedIncome(CI);
  }, [socialSecurityIncome, requiredMinimumDistribution, otherOrdinaryIncome, otherRetirementIncome, qualifiedCharitableDistributions]);

  // Efecto para calcular SSI Percentage
  useEffect(() => {
    if (combinedIncome) {
      let percentage = 0;
      if (filingStatus === "MFJ") {
        if (combinedIncome <= 32000) {
          percentage = 0;
        } else if (combinedIncome > 32000 && combinedIncome <= 44000) {
          percentage = 50;
        } else if (combinedIncome > 44000) {
          percentage = 85;
        }
      } else {
        if (combinedIncome <= 25000) {
          percentage = 0;
        } else if (combinedIncome > 25000 && combinedIncome <= 34000) {
          percentage = 50;
        } else if (combinedIncome > 34000) {
          percentage = 85;
        }
      }
      setSSIPercentage(percentage);
    }
  }, [combinedIncome, filingStatus]);

  // Efecto para calcular Tax Income Restriced
  useEffect(() => {
    const rmd = parseFloat(requiredMinimumDistribution) || 0;
    const odi = parseFloat(otherOrdinaryIncome) || 0;
    const ori = parseFloat(otherRetirementIncome) || 0;
    const ssi = parseFloat(socialSecurityIncome) || 0;
    const qcd = parseFloat(qualifiedCharitableDistributions) || 0;

    const TIR = rmd +
              odi +
              ori +
              (ssi * (ssiPercentage / 100)) -
              qcd;
              
    setTaxIncomeRestriced(TIR);
    setGrossIncome(TIR.toString());
  }, [requiredMinimumDistribution, otherOrdinaryIncome, otherRetirementIncome, socialSecurityIncome, qualifiedCharitableDistributions, ssiPercentage]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!socialSecurityIncome || parseFloat(socialSecurityIncome) < 0) {
      setError("Social Security Income is required and must be a valid number.");
      return;
    }

    setError(null);
    

    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID) || 0,
      socialSecurityIncome: parseFloat(socialSecurityIncome),
      requiredMinimumDistribution: parseFloat(requiredMinimumDistribution),
      otherOrdinaryIncome: parseFloat(otherOrdinaryIncome),
      otherRetirementIncome: parseFloat(otherRetirementIncome),
      qualifiedCharitableDistributions: parseFloat(qualifiedCharitableDistributions),
      combinedIncome,
      ssiPercentage,
      taxIncomeRestriced,
      calculationType: "RetireePlanning",
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
                disabled
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
                label="Social Security Income (SSI)"
                fullWidth
                type="number"
                value={socialSecurityIncome}
                onChange={(e) => setSocialSecurityIncome(e.target.value)}
                margin="normal"
              />
              <TextField
                label="IRA Required Minimum Distribution (RMD)"
                fullWidth
                type="number"
                value={requiredMinimumDistribution}
                onChange={(e) => setRequiredMinimumDistribution(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Other Ordinary Income (ODI)"
                fullWidth
                type="number"
                value={otherOrdinaryIncome}
                onChange={(e) => setOtherOrdinaryIncome(e.target.value)}
                margin="normal"
              />
            
            </Grid>

            <Grid item xs={12} md={6}>
            <TextField
                label="Other Retirement Income (ORI)"
                fullWidth
                type="number"
                value={otherRetirementIncome}
                onChange={(e) => setOtherRetirementIncome(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Qualified Charitable Distributions (QCD)"
                fullWidth
                type="number"
                value={qualifiedCharitableDistributions}
                onChange={(e) => setQualifiedCharitableDistributions(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Combined Income (CI)"
                fullWidth
                type="number"
                value={combinedIncome.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Social Security Income Percentage (SSIP)"
                fullWidth
                value={`${ssiPercentage}%`}
                margin="normal"
                disabled
              />
              <TextField
                label="Taxable Income Restriced (TIR)"
                fullWidth
                type="number"
                value={taxIncomeRestriced.toFixed(2)}
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
                <MenuItem value="1040NR - Schedule E">1040NR - Schedule E</MenuItem>
                
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

export default RetireePlanningForm; 