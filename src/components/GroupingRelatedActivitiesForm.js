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

const GroupingRelatedActivitiesForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Campos específicos para Grouping Related Activities - Section 469
  const [activity1ProfitOrLoss, setActivity1ProfitOrLoss] = useState("");
  const [activity2ProfitOrLoss, setActivity2ProfitOrLoss] = useState("");
  const [activity3ProfitOrLoss, setActivity3ProfitOrLoss] = useState("");
  const [canActivitiesBeGrouped, setCanActivitiesBeGrouped] = useState("No");
  const [groupedNetIncomeOrLoss, setGroupedNetIncomeOrLoss] = useState(0);

  const { performCalculations } = useCalculations();

 
   
 
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError("Gross Income is required and must be greater than 0.");
      return;
    }

    if (!activity1ProfitOrLoss || isNaN(parseFloat(activity1ProfitOrLoss))) {
      setError("Activity #1 - Profit or Loss is required and must be a valid number.");
      return;
    }

  

    if (!activity3ProfitOrLoss || isNaN(parseFloat(activity3ProfitOrLoss))) {
      setError("Activity #3 - Profit or Loss is required and must be a valid number.");
      return;
    }

    setError(null);

    // Calcular valores
    const A1PL = parseFloat(activity1ProfitOrLoss);
    const A2PL = parseFloat(activity2ProfitOrLoss);
    const A3PL = parseFloat(activity3ProfitOrLoss);

    // Calcular Grouped Net Income or Loss (GNIL)
    const GNIL = canActivitiesBeGrouped === "Yes" ? A1PL + A2PL + A3PL : 0;
    setGroupedNetIncomeOrLoss(GNIL);

    // Pasar resultados a la función onCalculate
    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      formType,
      QBID: parseFloat(QBID),
      activity1ProfitOrLoss: parseFloat(activity1ProfitOrLoss),
      activity2ProfitOrLoss: parseFloat(activity2ProfitOrLoss),
      activity3ProfitOrLoss: parseFloat(activity3ProfitOrLoss),
      canActivitiesBeGrouped,
      groupedNetIncomeOrLoss: GNIL,
      calculationType: "GroupingRelatedActivities",
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
                label="Activity #1 - Profit or Loss (A1PL)"
                fullWidth
                type="number"
                value={activity1ProfitOrLoss}
                onChange={(e) => setActivity1ProfitOrLoss(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Activity #2 - Profit or Loss (A2PL)"
                fullWidth
                type="number"
                value={activity2ProfitOrLoss}
                onChange={(e) => setActivity2ProfitOrLoss(e.target.value)}
                margin="normal"
              />
              
            </Grid>

            <Grid item xs={12} md={6}>
            <TextField
                label="Activity #3 - Profit or Loss (A3PL)"
                fullWidth
                type="number"
                value={activity3ProfitOrLoss}
                onChange={(e) => setActivity3ProfitOrLoss(e.target.value)}
                margin="normal"
              />
              <TextField
                select
                label="Can the activities be grouped? (CAG)"
                fullWidth
                value={canActivitiesBeGrouped}
                onChange={(e) => setCanActivitiesBeGrouped(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
              <TextField
                label="Grouped Net Income or Loss (GNIL)"
                fullWidth
                type="number"
                value={groupedNetIncomeOrLoss.toFixed(2)}
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

export default GroupingRelatedActivitiesForm;