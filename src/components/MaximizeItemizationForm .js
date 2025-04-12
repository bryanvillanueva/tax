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
import { standardDeductions } from '../utils/taxData';

const MaximizeItemizationForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);
  const [dagi, setDagi] = useState('');
  const standardDeduction = standardDeductions[filingStatus];

  // Campos específicos para Maximize Itemization Strategies
  const [taxpayerAGI, setTaxpayerAGI] = useState("");
  const [mortgageInterest, setMortgageInterest] = useState("");
  const [stateTaxesOrRealEstateTaxes, setStateTaxesOrRealEstateTaxes] = useState("");
  const [charitableContributions, setCharitableContributions] = useState("");
  const [otherItemizedDeductions, setOtherItemizedDeductions] = useState("");
  const [jobRelatedExpenses, setJobRelatedExpenses] = useState("");
  const [medicalExpenses, setMedicalExpenses] = useState("");
  const [totalItemizedDeduction, setTotalItemizedDeduction] = useState(0);
 

  const { performCalculations } = useCalculations();



  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }

    if (!taxpayerAGI || parseFloat(taxpayerAGI) <= 0) {
      setError("Taxpayer's Adjusted Gross Income is required and must be greater than 0.");
      return;
    }

   

    setError(null);

    // Calcular valores
      
    const TAGI = parseFloat(taxpayerAGI);
    const MI = parseFloat(mortgageInterest);
    const STRT = parseFloat(stateTaxesOrRealEstateTaxes);
    const CC = parseFloat(charitableContributions);
    const OID = parseFloat(otherItemizedDeductions);
    const JRE = parseFloat(jobRelatedExpenses) || 0 ;
    const ME = parseFloat(medicalExpenses);

    // Calcular Total Itemized Deduction (TID)
    const medicalDeduction = ME >= TAGI * 0.075 ? ME : 0;
    const TID = MI + STRT + CC + OID + JRE + medicalDeduction;
    setTotalItemizedDeduction(TID);

   const newDagi = TID
   setDagi(newDagi)
 

    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID),
      taxpayerAGI: TAGI,
      mortgageInterest: MI,
      stateTaxesOrRealEstateTaxes: STRT,
      charitableContributions: CC,
      otherItemizedDeductions: OID,
      jobRelatedExpenses: JRE,
      medicalExpenses: ME,
      totalItemizedDeduction: TID,
      calculationType: "MaximizeItemization",
      dagi: parseFloat(newDagi),
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: "relative", mt: 5 }}>
        <Box sx={{ position: "absolute", top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S56.pdf"
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
               <TextField
                label="Standar Deduction"
                fullWidth
                type="number"
                value={standardDeduction}
                margin="normal"
                disabled
                />
              <TextField
                label="Taxpayer's Adjusted Gross Income (TAGI)"
                fullWidth
                type="number"
                value={taxpayerAGI}
                onChange={(e) => setTaxpayerAGI(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Mortgage Interest (MI)"
                fullWidth
                type="number"
                value={mortgageInterest}
                onChange={(e) => setMortgageInterest(e.target.value)}
                margin="normal"
              />
             
             
            </Grid>

            <Grid item xs={12} md={6}>
            <TextField
                label="State Taxes or Real Estate Taxes (STRT)"
                fullWidth
                type="number"
                value={stateTaxesOrRealEstateTaxes}
                onChange={(e) => setStateTaxesOrRealEstateTaxes(e.target.value)}
                margin="normal"
              />
            <TextField
                label="Charitable Contributions (CC)"
                fullWidth
                type="number"
                value={charitableContributions}
                onChange={(e) => setCharitableContributions(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Other Itemized Deductions (OID)"
                fullWidth
                type="number"
                value={otherItemizedDeductions}
                onChange={(e) => setOtherItemizedDeductions(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Job Related Expenses (JRE)"
                fullWidth
                type="number"
                value={jobRelatedExpenses}
                onChange={(e) => setJobRelatedExpenses(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Medical Expenses (ME)"
                fullWidth
                type="number"
                value={medicalExpenses}
                onChange={(e) => setMedicalExpenses(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Total Itemized Deduction (TID)"
                fullWidth
                type="number"
                value={totalItemizedDeduction.toFixed(2)}
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

export default MaximizeItemizationForm;
