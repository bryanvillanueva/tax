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

const GiftingStockStrategyForm = ({ onCalculate }) => {
  // Campos fijos
  const [filingStatus, setFilingStatus] = useState("Single");
  const [partnerType, setPartnerType] = useState("Active");
  const [formType, setFormType] = useState("1040 - Schedule C/F");
  const [grossIncome, setGrossIncome] = useState("");
  const [QBID, setQbid] = useState("");
  const [error, setError] = useState(null);

  // Campos específicos para Gifting Stock Strategy
  const [ASG, setASG] = useState(""); // Amount of Stocks Gifts
  const [NCPG, setNCPG] = useState(""); // Number of Children or people to gift
  const [LPP, setLPP] = useState(18000); // Limit per person (valor fijo)
  const [GPP, setGPP] = useState(0); // Gift per person
  const [TGTE, setTGTE] = useState(0); // Total Gifts Tax Exempt
  const [LE, setLE] = useState(0); // Lifetime Exemption

  const { performCalculations } = useCalculations();

  // Efecto para calcular Gift per Person (GPP)
  useEffect(() => {
    const amountOfStocks = parseFloat(ASG) || 0;
    const numberOfPeople = parseFloat(NCPG) || 0;

    const giftPerPerson = numberOfPeople > 0 ? amountOfStocks / numberOfPeople : 0;
    setGPP(giftPerPerson);
  }, [ASG, NCPG]);

  // Efecto para calcular Total Gifts Tax Exempt (TGTE)
  useEffect(() => {
    const giftPerPerson = parseFloat(GPP) || 0;
    const numberOfPeople = parseFloat(NCPG) || 0;

    const totalExempt = giftPerPerson >= LPP ? LPP * numberOfPeople : giftPerPerson * numberOfPeople;
    setTGTE(totalExempt);
  }, [GPP, NCPG, LPP]);

  // Efecto para calcular Lifetime Exemption (LE)
  useEffect(() => {
    const amountOfStocks = parseFloat(ASG) || 0;
    const totalExempt = parseFloat(TGTE) || 0;

    const lifetimeExemption = totalExempt >= amountOfStocks ? 0 : amountOfStocks - totalExempt;
    setLE(lifetimeExemption);
  }, [ASG, TGTE]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!ASG || parseFloat(ASG) <= 0) {
      setError("Amount of Stocks Gifts (ASG) is required and must be greater than 0.");
      return;
    }

    if (!NCPG || parseFloat(NCPG) <= 0) {
      setError("Number of Children or People to Gift (NCPG) is required and must be greater than 0.");
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
      ASG: parseFloat(ASG),
      NCPG: parseFloat(NCPG),
      LPP,
      GPP,
      TGTE,
      LE,
      calculationType: "GiftingStockStrategy",
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
                label="Amount of Stocks Gifts (ASG)"
                fullWidth
                type="number"
                value={ASG}
                onChange={(e) => setASG(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Number of Children or People to Gift (NCPG)"
                fullWidth
                type="number"
                value={NCPG}
                onChange={(e) => setNCPG(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Limit per Person (LPP)"
                fullWidth
                type="number"
                value={LPP}
                margin="normal"
                disabled
              />
              <TextField
                label="Gift per Person (GPP)"
                fullWidth
                type="number"
                value={GPP.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Total Gifts Tax Exempt (TGTE)"
                fullWidth
                type="number"
                value={TGTE.toFixed(2)}
                margin="normal"
                disabled
              />
              <TextField
                label="Lifetime Exemption (LE)"
                fullWidth
                type="number"
                value={LE.toFixed(2)}
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

export default GiftingStockStrategyForm;