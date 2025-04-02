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

const DepletionDeductionForm = ({ onCalculate }) => {
  
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);
  const [sourceOfIncome, setSourceOfIncome] = useState("Yes");
  const [depletionMethod, setDepletionMethod] = useState("Percentage");
  const [incomePercentageMethod, setIncomePercentageMethod] = useState("");
  const [costCostMethod, setCostCostMethod] = useState("");
  const [fixedRatePercentageMethod, setFixedRatePercentageMethod] = useState("");
  const [totalUnitsCostMethod, setTotalUnitsCostMethod] = useState("");
  const [unitsExtractedYear, setUnitsExtractedYear] = useState("");
  const [yearDepletion, setYearDepletion] = useState(0);

  const { performCalculations } = useCalculations();

  const calculateYearDepletion = () => {
    if (sourceOfIncome === "No") {
      setYearDepletion(0);
      return;
    }

    if (depletionMethod === "Cost") {
      const CCCM = parseFloat(costCostMethod);
      const TUCM = parseFloat(totalUnitsCostMethod);
      const UEY = parseFloat(unitsExtractedYear);

      if (TUCM === 0 || isNaN(CCCM) || isNaN(TUCM) || isNaN(UEY)) {
        setError("Invalid input for Cost Method calculation.");
        return;
      }

      const YD = (CCCM / TUCM) * UEY;
      setYearDepletion(YD);
    } else if (depletionMethod === "Percentage") {
      const ICPM = parseFloat(incomePercentageMethod);
      const FRPM = parseFloat(fixedRatePercentageMethod) / 100; // Convertir a decimal

      if (isNaN(ICPM) || isNaN(FRPM)) {
        setError("Invalid input for Percentage Method calculation.");
        return;
      }

      const YD = ICPM * FRPM;
      setYearDepletion(YD);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }

    if (sourceOfIncome === "Yes" && depletionMethod === "Cost") {
      if (!costCostMethod || parseFloat(costCostMethod) <= 0) {
        setError("Cost in case of Cost Method is required and must be greater than 0.");
        return;
      }

      if (!totalUnitsCostMethod || parseFloat(totalUnitsCostMethod) <= 0) {
        setError("Total units in case of Cost Method is required and must be greater than 0.");
        return;
      }

      if (!unitsExtractedYear || parseFloat(unitsExtractedYear) <= 0) {
        setError("Units extracted in the year is required and must be greater than 0.");
        return;
      }
    }

    if (sourceOfIncome === "Yes" && depletionMethod === "Percentage") {
      if (!incomePercentageMethod || parseFloat(incomePercentageMethod) <= 0) {
        setError("Income in case of Percentage Method is required and must be greater than 0.");
        return;
      }

      if (!fixedRatePercentageMethod || parseFloat(fixedRatePercentageMethod) <= 0) {
        setError("Fixed rate in case of Percentage Method is required and must be greater than 0.");
        return;
      }
    }

    setError(null);

    // Calcular Year Depletion
    calculateYearDepletion();
     
    
    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID),
      sourceOfIncome,
      depletionMethod,
      incomePercentageMethod: parseFloat(incomePercentageMethod),
      costCostMethod: parseFloat(costCostMethod),
      fixedRatePercentageMethod: parseFloat(fixedRatePercentageMethod),
      totalUnitsCostMethod: parseFloat(totalUnitsCostMethod),
      unitsExtractedYear: parseFloat(unitsExtractedYear),
      yearDepletion,
      calculationType: "DepletionDeduction",
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: "relative", mt: 5 }}>
        <Box sx={{ position: "absolute", top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S42.pdf"
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
                label="Source of Income from Natural Resources?"
                fullWidth
                value={sourceOfIncome}
                onChange={(e) => setSourceOfIncome(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
              <TextField
                select
                label="Depletion Method"
                fullWidth
                value={depletionMethod}
                onChange={(e) => setDepletionMethod(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Percentage">Percentage</MenuItem>
                <MenuItem value="Cost">Cost</MenuItem>
              </TextField>
              
              
            </Grid>

            <Grid item xs={12} md={6}>
            {depletionMethod === "Percentage" && (
                <>
                  <TextField
                    label="Income in case of Percentage Method (ICPM)"
                    fullWidth
                    type="number"
                    value={incomePercentageMethod}
                    onChange={(e) => setIncomePercentageMethod(e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    label="Fixed rate in case of Percentage Method (FRPM) (%)"
                    fullWidth
                    type="number"
                    value={fixedRatePercentageMethod}
                    onChange={(e) => setFixedRatePercentageMethod(e.target.value)}
                    margin="normal"
                  />
                </>
              )}
              {depletionMethod === "Cost" && (
                <>
                  <TextField
                    label="Cost in case of Cost Method (CCCM)"
                    fullWidth
                    type="number"
                    value={costCostMethod}
                    onChange={(e) => setCostCostMethod(e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    label="Total units in case of Cost Method (TUCM)"
                    fullWidth
                    type="number"
                    value={totalUnitsCostMethod}
                    onChange={(e) => setTotalUnitsCostMethod(e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    label="Units extracted in the year (UEY)"
                    fullWidth
                    type="number"
                    value={unitsExtractedYear}
                    onChange={(e) => setUnitsExtractedYear(e.target.value)}
                    margin="normal"
                  />
                </>
              )}
              <TextField
                label="Year Depletion (YD)"
                fullWidth
                type="number"
                value={yearDepletion.toFixed(2)}
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

export default DepletionDeductionForm;
