import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, MenuItem, Button, Container } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useCalculations from '../utils/useCalculations';

const DeferredCapitalGainForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [typeOfPartner, setTypeOfPartner] = useState('Active');
  const [capitalGain, setCapitalGain] = useState('');
  const [installmentPeriod, setInstallmentPeriod] = useState('');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [investType, setInvestType] = useState('Section 179');
   const [partnerType, setPartnerType] = useState('Active');
  const [QBID, setQbid] = useState('');

  const trustInterestRate = 0.07; // Fixed value (7%)
  const {performCalculations} = useCalculations();

  const [results, setResults] = useState({
    currentYearTax: '',
    deferredTax: '',
    potentialInterestIncome: '',
    netBenefit: '',
  });

  // Update results dynamically
  useEffect(() => {
    if (capitalGain && installmentPeriod) {
      const currentYearTax = ((capitalGain / installmentPeriod) * 0.2).toFixed(2);
      const deferredTax = ((capitalGain - capitalGain / installmentPeriod) * 0.2).toFixed(2);
      const potentialInterestIncome = (
        (capitalGain - capitalGain / installmentPeriod) * trustInterestRate
      ).toFixed(2);
      const netBenefit =
        parseFloat(grossIncome) && potentialInterestIncome
          ? (parseFloat(potentialInterestIncome) - parseFloat(currentYearTax)).toFixed(2)
          : '';

      setResults({
        currentYearTax,
        deferredTax,
        potentialInterestIncome,
        netBenefit,
      });
    } else {
      setResults({
        currentYearTax: '',
        deferredTax: '',
        potentialInterestIncome: '',
        netBenefit: '',
      });
    }
  }, [capitalGain, installmentPeriod, grossIncome, trustInterestRate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!filingStatus || !grossIncome || !typeOfPartner) {
      alert('All fields are required.');
      return;
    }

    const results = performCalculations({ 
      capitalGain,
      trustInterestRate,
      grossIncome: parseFloat(grossIncome),
      installmentPeriod,
      filingStatus,
      formType,
      calculationType: 'deferredCapitalGain',
      QBID: parseFloat(QBID),
      partnerType: typeOfPartner,
      investType,
      partnerType,
    });
    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        <Box sx={{ position: 'absolute', top: -40, right: 0 }}>
          <Button
            href="https://tax.bryanglen.com/data/Strategies-Structure.pdf"
            target="_blank"
            sx={{
              textTransform: 'none',
              backgroundColor: '#ffffff',
              color: '#0858e6',
              fontSize: '0.875rem',
              marginBottom: '150px',
            }}
            startIcon={<InfoOutlinedIcon />}
          >
            View Strategy Details
          </Button>
        </Box>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            {/* Left side fields */}
            <Box sx={{ flex: 1 }}>
              <TextField
                select
                label="Filing Status"
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
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
                variant="outlined"
                type="number"
                value={grossIncome}
                onChange={(e) => setGrossIncome(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                select
                label="Type of Partner"
                value={typeOfPartner}
                onChange={(e) => setTypeOfPartner(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Passive">Passive</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Capital gain over property sold to the trust"
                type="number"
                value={capitalGain}
                onChange={(e) => setCapitalGain(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Trust Interest Rate"
                value={`7%`}
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Installment period (Years)"
                type="number"
                value={installmentPeriod}
                onChange={(e) => setInstallmentPeriod(e.target.value)}
                sx={{ mb: 2 }}
              />
            </Box>

            {/* Right side fields */}
            <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Capital Gain Tax - Current Year (20%)"
              value={`$${results.currentYearTax}`}
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Capital Gain Tax - Deferred (20%)"
              value={`$${results.deferredTax}`}
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Potential Interest Income - First Year"
              value={`$${results.potentialInterestIncome}`}
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Net Benefit"
              value={`$${results.netBenefit}`}
              disabled
              sx={{ mb: 2 }}
            />
              <TextField
                select
                label="Form Type"
                fullWidth
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                sx={{ mb: 2 }}
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
                sx={{ mb: 2 }}
              />
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#0858e6', color: '#fff' }}>
              Calculate
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};



export default DeferredCapitalGainForm;