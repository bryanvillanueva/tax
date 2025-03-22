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

const MarriedFilingSeparateForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("MFS");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Campos específicos para Married Filing Separate (MFS)
  const [IS1, setIS1] = useState(""); // Income Spouse 1
  const [IS2, setIS2] = useState(""); // Income Spouse 2
  const [MES1, setMES1] = useState(""); // Medical Expenses Spouse 1
  const [MES2, setMES2] = useState(""); // Medical Expenses Spouse 2
  const [MFJ_AD, setMFJ_AD] = useState(0); // Total MFJ - Amount Deductible
  const [TS1_AD, setTS1_AD] = useState(0); // Total Spouse 1 - Amount Deductible
  const [TS2_AD, setTS2_AD] = useState(0); // Total Spouse 2 - Amount Deductible
  const [OID_S1, setOID_S1] = useState(""); // Other Itemized Deduction Spouse 1
  const [OID_S2, setOID_S2] = useState(""); // Other Itemized Deduction Spouse 2
  const [SD_MFJ, setSD_MFJ] = useState(29200); // Standard Deduction MFJ (valor fijo)
  const [SD_MFS, setSD_MFS] = useState(14600); // Standard Deduction MFS (valor fijo)
  const [MTR_MFJ, setMTR_MFJ] = useState(""); // Marginal Tax Rate - MFJ
  const [MTR_S1, setMTR_S1] = useState(""); // Marginal Tax Rate - Spouse 1
  const [MTR_S2, setMTR_S2] = useState(""); // Marginal Tax Rate - Spouse 2
  const [ET_MFJ, setET_MFJ] = useState(0); // Estimated Taxes - MFJ
  const [ET_MFS, setET_MFS] = useState(0); // Estimated Taxes - MFS

  const { performCalculations } = useCalculations();

  // Efecto para calcular Total MFJ - Amount Deductible (MFJ_AD)
  useEffect(() => {
    const medicalExpensesTotal = parseFloat(MES1) + parseFloat(MES2);
    const incomeTotal = parseFloat(IS1) + parseFloat(IS2);
    const threshold = incomeTotal * 0.075;

    const mfjDeductible = medicalExpensesTotal >= threshold ? medicalExpensesTotal - threshold : 0;
    setMFJ_AD(mfjDeductible);
  }, [MES1, MES2, IS1, IS2]);

  // Efecto para calcular Total Spouse 1 - Amount Deductible (TS1_AD)
  useEffect(() => {
    const medicalExpenses = parseFloat(MES1);
    const income = parseFloat(IS1);
    const threshold = income * 0.075;

    const ts1Deductible = medicalExpenses >= threshold ? medicalExpenses - threshold : 0;
    setTS1_AD(ts1Deductible);
  }, [MES1, IS1]);

  // Efecto para calcular Total Spouse 2 - Amount Deductible (TS2_AD)
  useEffect(() => {
    const medicalExpenses = parseFloat(MES2);
    const income = parseFloat(IS2);
    const threshold = income * 0.075;

    const ts2Deductible = medicalExpenses >= threshold ? medicalExpenses - threshold : 0;
    setTS2_AD(ts2Deductible);
  }, [MES2, IS2]);

  // Efecto para calcular Estimated Taxes - MFJ (ET_MFJ)
  useEffect(() => {
    const incomeTotal = parseFloat(IS1) + parseFloat(IS2);
    const totalDeductions = MFJ_AD + parseFloat(OID_S1) + parseFloat(OID_S2);
    const standardDeduction = SD_MFJ;

    const taxableIncome = standardDeduction >= totalDeductions ? incomeTotal - standardDeduction : incomeTotal - totalDeductions;
    const estimatedTaxes = taxableIncome * (parseFloat(MTR_MFJ) || 0);
    setET_MFJ(estimatedTaxes);
  }, [IS1, IS2, MFJ_AD, OID_S1, OID_S2, SD_MFJ, MTR_MFJ]);

  // Efecto para calcular Estimated Taxes - MFS (ET_MFS)
  useEffect(() => {
    const incomeSpouse1 = parseFloat(IS1);
    const incomeSpouse2 = parseFloat(IS2);
    const deductionsSpouse1 = TS1_AD + parseFloat(OID_S1);
    const deductionsSpouse2 = TS2_AD + parseFloat(OID_S2);
    const standardDeduction = SD_MFS;

    const taxableIncomeSpouse1 = standardDeduction >= deductionsSpouse1 ? incomeSpouse1 - standardDeduction : incomeSpouse1 - deductionsSpouse1;
    const taxableIncomeSpouse2 = standardDeduction >= deductionsSpouse2 ? incomeSpouse2 - standardDeduction : incomeSpouse2 - deductionsSpouse2;

    const estimatedTaxesSpouse1 = taxableIncomeSpouse1 * (parseFloat(MTR_S1) || 0);
    const estimatedTaxesSpouse2 = taxableIncomeSpouse2 * (parseFloat(MTR_S2) || 0);

    setET_MFS(estimatedTaxesSpouse1 + estimatedTaxesSpouse2);
  }, [IS1, IS2, TS1_AD, TS2_AD, OID_S1, OID_S2, SD_MFS, MTR_S1, MTR_S2]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!IS1 || parseFloat(IS1) <= 0) {
      setError("Income Spouse 1 (IS1) is required and must be greater than 0.");
      return;
    }

    if (!IS2 || parseFloat(IS2) <= 0) {
      setError("Income Spouse 2 (IS2) is required and must be greater than 0.");
      return;
    }

    if (!MTR_MFJ || parseFloat(MTR_MFJ) <= 0) {
      setError("Marginal Tax Rate - MFJ (MTR-MFJ) is required and must be greater than 0.");
      return;
    }

    if (!MTR_S1 || parseFloat(MTR_S1) <= 0) {
      setError("Marginal Tax Rate - Spouse 1 (MTR-S1) is required and must be greater than 0.");
      return;
    }

    if (!MTR_S2 || parseFloat(MTR_S2) <= 0) {
      setError("Marginal Tax Rate - Spouse 2 (MTR-S2) is required and must be greater than 0.");
      return;
    }

    setError(null);

    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID) || 0,
      IS1: parseFloat(IS1),
      IS2: parseFloat(IS2),
      MES1: parseFloat(MES1),
      MES2: parseFloat(MES2),
      MFJ_AD,
      TS1_AD,
      TS2_AD,
      OID_S1: parseFloat(OID_S1),
      OID_S2: parseFloat(OID_S2),
      SD_MFJ,
      SD_MFS,
      MTR_MFJ: parseFloat(MTR_MFJ),
      MTR_S1: parseFloat(MTR_S1),
      MTR_S2: parseFloat(MTR_S2),
      ET_MFJ,
      ET_MFS,
      calculationType: "MarriedFilingSeparate",
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
                <MenuItem value="MFS">Married Filing Separately</MenuItem>
                <MenuItem value="MFJ">Married Filing Jointly</MenuItem>
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
                label="Income Spouse 1 (IS1)"
                fullWidth
                type="number"
                value={IS1}
                onChange={(e) => setIS1(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Income Spouse 2 (IS2)"
                fullWidth
                type="number"
                value={IS2}
                onChange={(e) => setIS2(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Medical Expenses Spouse 1 (MES1)"
                fullWidth
                type="number"
                value={MES1}
                onChange={(e) => setMES1(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Medical Expenses Spouse 2 (MES2)"
                fullWidth
                type="number"
                value={MES2}
                onChange={(e) => setMES2(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Other Itemized Deduction Spouse 1 (OID-S1)"
                fullWidth
                type="number"
                value={OID_S1}
                onChange={(e) => setOID_S1(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Other Itemized Deduction Spouse 2 (OID-S2)"
                fullWidth
                type="number"
                value={OID_S2}
                onChange={(e) => setOID_S2(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Standard Deduction MFJ (SD-MFJ)"
                fullWidth
                type="number"
                value={SD_MFJ}
                margin="normal"
                disabled
              />
              <TextField
                label="Standard Deduction MFS (SD-MFS)"
                fullWidth
                type="number"
                value={SD_MFS}
                margin="normal"
                disabled
              />
              <TextField
                label="Marginal Tax Rate - MFJ (MTR-MFJ)"
                fullWidth
                type="number"
                value={MTR_MFJ}
                onChange={(e) => setMTR_MFJ(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Marginal Tax Rate - Spouse 1 (MTR-S1)"
                fullWidth
                type="number"
                value={MTR_S1}
                onChange={(e) => setMTR_S1(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Marginal Tax Rate - Spouse 2 (MTR-S2)"
                fullWidth
                type="number"
                value={MTR_S2}
                onChange={(e) => setMTR_S2(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Estimated Taxes - MFJ (ET-MFJ)"
                fullWidth
                type="number"
                value={ET_MFJ.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Estimated Taxes - MFS (ET-MFS)"
                fullWidth
                type="number"
                value={ET_MFS.toFixed(2)}
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

export default MarriedFilingSeparateForm;