import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalculateIcon from '@mui/icons-material/Calculate';
import useCalculations from '../utils/useCalculations';
import { standardDeductions } from '../utils/taxData';
import QbidModal from './QbidModal';

const PrivateFamilyFoundation = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [error, setError] = useState(null);
  
  // Right side state variables
  const [tagi, setTagi] = useState('');
  const [ccf, setCcf] = useState('');
  const [nccf, setNccf] = useState('');
  const [cl, setCl] = useState('');
  const [ncl, setNcl] = useState('');
  const [tcbl, setTcbl] = useState('');
  const [dl, setDl] = useState('');
  const [tcd, setTcd] = useState('');
  const [QBID, setQbid] = useState('');
  const [dagi, setDagi] = useState('');
  const [formType, setFormType] = useState('1040 - Schedule C/F');
  const [partnershipShare, setPartnershipShare] = useState('');
  const [qbidModalOpen, setQbidModalOpen] = useState(false);

  const standardDeduction = standardDeductions[filingStatus];

  const { performCalculations } = useCalculations();

  // Manejadores para QBID Modal
  const handleQbidCalculateClick = () => {
    setQbidModalOpen(true);
  };

  const handleCloseQbidModal = () => {
    setQbidModalOpen(false);
  };

  const handleQbidSelection = (results, shouldClose = false) => {
    console.log("handleQbidSelection received:", results);
    
    if (results && results.qbidAmount !== undefined) {
      const qbidValue = parseFloat(results.qbidAmount);
      
      if (!isNaN(qbidValue)) {
        console.log("Setting QBID value to:", qbidValue);
        setQbid(qbidValue.toString());
      } else {
        console.warn("Invalid QBID value received:", results.qbidAmount);
      }
    } else {
      console.warn("No qbidAmount found in results:", results);
    }
    
    if (shouldClose) {
      setQbidModalOpen(false);
    }
  };

  // Efecto para registrar cambios en el valor QBID
  useEffect(() => {
    console.log("QBID state value changed:", QBID);
  }, [QBID]);

  // Calculate dependent fields when inputs change
  useEffect(() => {
    if (tagi) {
      // Calculate Cash Limitations (CL)
      const calculatedCl = parseFloat(tagi) * 0.30;
      setCl(calculatedCl.toFixed(2));

      // Calculate Non Cash Limitation (NCL)
      const calculatedNcl = parseFloat(tagi) * 0.20;
      setNcl(calculatedNcl.toFixed(2));

      // Calculate Deduction Limit (DL)
      const calculatedDl = parseFloat(tagi) * 0.30;
      setDl(calculatedDl.toFixed(2));

      if (ccf && nccf) {
        // Calculate Total Contribution before limitation (TCBL)
        const cashContribution = parseFloat(ccf) >= calculatedCl ? calculatedCl : parseFloat(ccf);
        const nonCashContribution = parseFloat(nccf) >= calculatedNcl ? calculatedNcl : parseFloat(nccf);
        const calculatedTcbl = cashContribution + nonCashContribution;
        setTcbl(calculatedTcbl.toFixed(2));

        // Calculate Total Contribution deductible (TCD)
        const calculatedTcd = calculatedTcbl >= calculatedDl ? calculatedDl : calculatedTcbl;
        setTcd(calculatedTcd.toFixed(2));
      }
    }
  }, [tagi, ccf, nccf]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Net Income for Analysis is required and must be greater than 0.');
      return;
    }

    if (!tagi || parseFloat(tagi) <= 0) {
      setError('Taxpayer\'s Adjusted Gross Income is required and must be greater than 0.');
      return;
    }

    setError(null);

    // Calculate DAGI here
    const calculatedDagi = tcd >= standardDeduction ? tcd : 0;
    setDagi(calculatedDagi);

    const results = performCalculations({
      calculationType: 'privateFamilyFoundation',
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      partnerType,
      tagi: parseFloat(tagi),
      ccf: parseFloat(ccf),
      nccf: parseFloat(nccf),
      cl: parseFloat(cl),
      ncl: parseFloat(ncl),
      tcbl: parseFloat(tcbl),
      dl: parseFloat(dl),
      tcd: parseFloat(tcd),
      QBID: parseFloat(QBID) || 0,
      dagi: calculatedDagi,
      formType,
      partnershipShare: formType === '1065' ? (parseFloat(partnershipShare) || 0) : 0,
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        <Box sx={{ position: 'absolute', top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S64.pdf"
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
                disabled
                InputProps={{
                  readOnly: true,
                }}
                margin="normal"
              />

              <TextField
                label="Standard Deduction"
                fullWidth
                type="number"
                value={standardDeduction}
                margin="normal"
                disabled
              />

              <TextField
                label="Total Contribution before limitation (TCBL)"
                fullWidth
                type="number"
                value={tcbl}
                margin="normal"
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                label="Deduction Limit (AGI 30%) (DL)"
                fullWidth
                type="number"
                value={dl}
                margin="normal"
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Taxpayer's Adjusted Gross Income (TAGI)"
                fullWidth
                type="number"
                value={tagi}
                onChange={(e) => setTagi(e.target.value)}
                margin="normal"
                required
                error={tagi !== '' && parseFloat(tagi) <= 0}
                helperText={tagi !== '' && parseFloat(tagi) <= 0 ? 'Must be greater than 0' : ''}
              />
              <TextField
                label="Cash Contributed to the Foundation (CCF)"
                fullWidth
                type="number"
                value={ccf}
                onChange={(e) => setCcf(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Non-cash contributed to the foundation (NCCF)"
                fullWidth
                type="number"
                value={nccf}
                onChange={(e) => setNccf(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Total Contribution deductible (TCD)"
                fullWidth
                type="number"
                value={tcd}
                margin="normal"
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Cash Limitations (CL)"
                fullWidth
                type="number"
                value={cl}
                margin="normal"
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                label="Non Cash Limitation (NCL)"
                fullWidth
                type="number"
                value={ncl}
                margin="normal"
                disabled
                InputProps={{
                  readOnly: true,
                }}
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

              {(formType === '1065' || formType === '1120S') && (
                <TextField
                  label="% Share if partnership"
                  fullWidth
                  type="number"
                  value={partnershipShare}
                  onChange={(e) => {
                    const value = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                    setPartnershipShare(value.toString());
                  }}
                  margin="normal"
                  InputProps={{
                    inputProps: { min: 0, max: 100 },
                    endAdornment: (
                      <span style={{ marginRight: '8px' }}>%</span>
                    ),
                  }}
                  helperText="Enter your partnership share percentage (0-100%)"
                />
              )}

              <Box sx={{ position: 'relative' }}>
                <TextField
                  label="QBID (Qualified Business Income Deduction)"
                  fullWidth
                  type="number"
                  value={QBID}
                  onChange={(e) => setQbid(e.target.value)}
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <Button
                        onClick={handleQbidCalculateClick}
                        size="small"
                        aria-label="calculate QBID"
                        sx={{
                          color: '#0858e6',
                          textTransform: 'none',
                          fontSize: '0.8rem',
                          fontWeight: 'normal',
                          minWidth: 'auto',
                          ml: 1,
                          p: '4px 8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: 'transparent',
                          '&:hover': {
                            backgroundColor: 'rgba(8, 88, 230, 0.08)',
                          }
                        }}
                      >
                        <CalculateIcon fontSize="small" />
                        Calculate
                      </Button>
                    ),
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#0858e6', color: '#fff' }}>
              Calculate
            </Button>
          </Box>
        </form>
      </Box>

      <QbidModal 
        open={qbidModalOpen} 
        onClose={handleCloseQbidModal} 
        onSelect={handleQbidSelection}
      />
    </Container>
  );
};

export default PrivateFamilyFoundation; 
