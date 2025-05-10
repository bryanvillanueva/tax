import React, { useState } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalculateIcon from '@mui/icons-material/Calculate';
import QbidModal from './QbidModal';
import useCalculations from '../utils/useCalculations';

const SimpleIRAForm = ({ onCalculate }) => {
  const [filingStatus, setFilingStatus] = useState('Single');
  const [grossIncome, setGrossIncome] = useState('');
  const [partnerType, setPartnerType] = useState('Active');
  const [formType, setFormType] = useState('1065');
  const [qualifiedEmployees, setQualifiedEmployees] = useState('');
  const [averageCompensation, setAverageCompensation] = useState('');
  const [contributionMethod, setContributionMethod] = useState('Matching');
  const [employeeAge, setEmployeeAge] = useState('');
  const [averageContribution, setAverageContribution] = useState('');
  const [averageEmployerContribution, setAverageEmployerContribution] = useState(null);
  const [error, setError] = useState(null);
  const [QBID, setQbid] = useState('');
  const [partnershipShare, setPartnershipShare] = useState('');
  const [qbidModalOpen, setQbidModalOpen] = useState(false);

  const { performCalculations } = useCalculations();

  const handleQbidCalculateClick = () => {
    setQbidModalOpen(true);
  };

  const handleCloseQbidModal = () => {
    setQbidModalOpen(false);
  };

  const handleQbidSelection = (results, shouldClose = false) => {
    if (results && results.qbidAmount !== undefined) {
      const qbidValue = parseFloat(results.qbidAmount);
      if (!isNaN(qbidValue)) {
        setQbid(qbidValue.toString());
      }
    }
    if (shouldClose) {
      setQbidModalOpen(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      setError('Gross Income is required and must be greater than 0.');
      return;
    }

    if (!qualifiedEmployees || parseInt(qualifiedEmployees) <= 0) {
      setError('Qualified Employees is required and must be greater than 0.');
      return;
    }

    if (!averageCompensation || parseFloat(averageCompensation) <= 0) {
      setError('Annual Average Employee Compensation is required and must be greater than 0.');
      return;
    }

    if (!employeeAge || parseInt(employeeAge) <= 0) {
      setError('Employee Age is required and must be greater than 0.');
      return;
    }

    if (!averageContribution || parseFloat(averageContribution) <= 0) {
      setError('Average Employees Contribution is required and must be greater than 0.');
      return;
    }

    const compensationLimit = 345000;
    const contributionLimitEmployee = employeeAge >= 50 ? 19500 : 16000;
    const contributionLimitEmployer =
      contributionMethod === 'Matching'
        ? 0.03 * parseFloat(averageCompensation)
        : 0.02 * parseFloat(averageCompensation);

    const calculatedEmployerContribution =
      averageContribution > contributionLimitEmployee
        ? contributionLimitEmployee
        : averageContribution > contributionLimitEmployer
        ? contributionLimitEmployer
        : averageContribution;
    setAverageEmployerContribution(calculatedEmployerContribution);

    const totalEmployerContribution = qualifiedEmployees * calculatedEmployerContribution;

    setError(null);

    const results = performCalculations({
      filingStatus,
      grossIncome: parseFloat(grossIncome),
      qualifiedEmployees: parseInt(qualifiedEmployees),
      formType,
      partnerType,
      averageCompensation: parseFloat(averageCompensation),
      contributionMethod,
      employeeAge: parseInt(employeeAge),
      averageContribution: parseFloat(averageContribution),
      compensationLimit,
      contributionLimitEmployee,
      contributionLimitEmployer,
      averageEmployerContribution,
      totalEmployerContribution,
      calculationType: 'simpleIRA',
      QBID: parseFloat(QBID),
      partnershipShare: partnershipShare ? parseFloat(partnershipShare) : 0,
    });

    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        <Box sx={{ position: 'absolute', top: -10, right: 0 }}>
          <Button
            href="https://cmltaxplanning.com/docs/S31.pdf"
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
                label="Partner Type"
                fullWidth
                value={partnerType}
                onChange={(e) => setPartnerType(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Passive">Passive</MenuItem>
              </TextField>

              <TextField
                label="Qualified Employees"
                fullWidth
                type="number"
                value={qualifiedEmployees}
                onChange={(e) => setQualifiedEmployees(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Annual Average Employee Compensation"
                fullWidth
                type="number"
                value={averageCompensation}
                onChange={(e) => setAverageCompensation(e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Contribution Method Use"
                fullWidth
                value={contributionMethod}
                onChange={(e) => setContributionMethod(e.target.value)}
                margin="normal"
              >
                <MenuItem value="Matching">Matching</MenuItem>
                <MenuItem value="Nonelective">Nonelective</MenuItem>
              </TextField>

              <TextField
                label="Age Employee"
                fullWidth
                type="number"
                value={employeeAge}
                onChange={(e) => setEmployeeAge(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Average Employees Contribution"
                fullWidth
                type="number"
                value={averageContribution}
                onChange={(e) => setAverageContribution(e.target.value)}
                margin="normal"
              />

              <TextField
                select
                label="Form Type"
                fullWidth
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                margin="normal"
              >
                <MenuItem value="1065">1065</MenuItem>
                <MenuItem value="1120S">1120S</MenuItem>
                <MenuItem value="1120">1120</MenuItem>
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

export default SimpleIRAForm;
