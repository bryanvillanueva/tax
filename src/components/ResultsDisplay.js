import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableRow, 
  TableHead, 
  Paper, 
  Button, 
  Alert,
  Divider,
  Chip,
  Fade,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Tab,
  Tabs
} from '@mui/material';
import ExportPDF from './ExportPDF';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SavingsIcon from '@mui/icons-material/Savings';
import WarningIcon from '@mui/icons-material/Warning';
import CalculateIcon from '@mui/icons-material/Calculate';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const formatCurrency = (value) => {
  if (value === undefined || value === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const ResultsDisplay = ({ results, formTitle, calculationType }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // useEffect para comparar totalCredit y taxDue
  useEffect(() => {
    if (results.totalCredit > results.taxDue) {
      setShowAlert(true); // Mostrar alerta si totalCredit > taxDue
    } else {
      setShowAlert(false); // Ocultar alerta en caso contrario
    }
  }, [results.totalCredit, results.taxDue]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  console.log('Results:', results)
  console.log('Form:', results.calculationType)

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{ 
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 600,
          color: '#0858e6',
          position: 'relative',
          pb: 1,
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '3px',
            backgroundColor: '#0858e6',
            borderRadius: '2px'
          }
        }}>
          Calculation Results
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', mb: 3, textAlign: 'center' }}>
          {formTitle} tax calculation summary and comparison
        </Typography>
      </Box>

      {/* Mostrar alerta si totalCredit > taxDue */}
      <Fade in={showAlert}>
        <Alert 
          severity="warning" 
          icon={<WarningIcon sx={{ color: '#f59e0b' }} />}
          sx={{ 
            mb: 4, 
            borderRadius: '8px', 
            backgroundColor: '#fffbeb',
            border: '1px solid #fbbf24',
            '& .MuiAlert-message': { color: '#92400e' }
          }}
        >
          The <strong>Total Credit</strong> cannot be greater than the <strong>Tax Due</strong>. Please review the values.
        </Alert>
      </Fade> 

      {/* Tarjeta de Resumen de Ahorro */}
      <Card 
        elevation={2} 
        sx={{ 
          mb: 5, 
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}
      >
        <CardHeader 
          title="Tax Savings Summary" 
          sx={{ 
            backgroundColor: '#f8fafc', 
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            '& .MuiCardHeader-title': {
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#333'
            }
          }}
        />
        <CardContent sx={{ p: 0 }}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={4} sx={{ 
              p: 3, 
              borderRight: { xs: 'none', md: '1px solid rgba(0, 0, 0, 0.05)' },
              borderBottom: { xs: '1px solid rgba(0, 0, 0, 0.05)', md: 'none' }
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
                  Without Strategy
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                  {formatCurrency(results.totalTaxDue2)}
                </Typography>
                <Chip 
                  icon={<TrendingDownIcon />}
                  label="Standard Tax" 
                  size="small" 
                  sx={{ bgcolor: '#f1f5f9', color: '#64748b' }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={4} sx={{ 
              p: 3, 
              borderRight: { xs: 'none', md: '1px solid rgba(0, 0, 0, 0.05)' },
              borderBottom: { xs: '1px solid rgba(0, 0, 0, 0.05)', md: 'none' }
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
                  With Strategy
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#0858e6', mb: 1 }}>
                  {results.formType === '1120' ? formatCurrency(results.corpTaxDue) : results.formType === '1120S' ? formatCurrency(results.taxDue1120S) : formatCurrency(results.totalTaxDue)}
                </Typography>
                <Chip 
                  icon={<TrendingUpIcon />}
                  label="Optimized Tax" 
                  size="small" 
                  sx={{ bgcolor: '#e0f2fe', color: '#0858e6' }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={4} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
                  Total Savings
                </Typography>
                <Typography variant="h4" sx={{ 
                  fontWeight: 600, 
                  color: (results.formType === '1120' 
                    ? results.totalTaxDue2 - results.corpTaxDue 
                    : results.formType === '1120S' 
                      ? results.totalTaxDue2 - results.taxDue 
                      : results.totalTaxDue2 - results.totalTaxDue) <= 0 
                        ? '#ef4444' 
                        : '#10b981',
                  mb: 1
                }}>
                  {results.formType === '1120' 
                    ? formatCurrency(results.totalTaxDue2 - results.corpTaxDue) 
                    : results.formType === '1120S' 
                      ? formatCurrency(results.totalTaxDue2 - results.taxDue) 
                      : formatCurrency(results.totalTaxDue2 - results.totalTaxDue)}
                </Typography>
                <Chip 
                  icon={<SavingsIcon />}
                  label={((results.formType === '1120' 
                    ? results.totalTaxDue2 - results.corpTaxDue 
                    : results.formType === '1120S' 
                      ? results.totalTaxDue2 - results.taxDue 
                      : results.totalTaxDue2 - results.totalTaxDue) <= 0) 
                        ? "No Savings" 
                        : "Total Savings"} 
                  size="small" 
                  sx={{ 
                    bgcolor: ((results.formType === '1120' 
                      ? results.totalTaxDue2 - results.corpTaxDue 
                      : results.formType === '1120S' 
                        ? results.totalTaxDue2 - results.taxDue 
                        : results.totalTaxDue2 - results.totalTaxDue) <= 0) 
                          ? '#fee2e2' 
                          : '#d1fae5',
                    color: ((results.formType === '1120' 
                      ? results.totalTaxDue2 - results.corpTaxDue 
                      : results.formType === '1120S' 
                        ? results.totalTaxDue2 - results.taxDue 
                        : results.totalTaxDue2 - results.totalTaxDue) <= 0) 
                          ? '#ef4444' 
                          : '#10b981'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs para las tablas de resultados */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            aria-label="result tabs"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: '#64748b',
                '&.Mui-selected': {
                  color: '#0858e6',
                  fontWeight: 600
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#0858e6',
                height: 3,
                borderRadius: '2px'
              }
            }}
          >
            <Tab 
              icon={<CalculateIcon fontSize="small" />} 
              iconPosition="start" 
              label="With Strategy" 
            />
            <Tab 
              icon={<CompareArrowsIcon fontSize="small" />} 
              iconPosition="start" 
              label="Without Strategy" 
            />
            <Tab 
              icon={<CalculateIcon fontSize="small" />} 
              iconPosition="start" 
              label="Additional Calculations" 
            />
          </Tabs>
        </Box>

        {/* Tabla 1: Con Estrategia */}
        {activeTab === 0 && (
          <Card 
            elevation={1} 
            sx={{ 
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              maxWidth: '100%'
            }}
          >
            <CardHeader 
              title={`Return Form: ${results.formType || 'N/A'}`}
              sx={{ 
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                '& .MuiCardHeader-title': {
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#0858e6'
                }
              }}
            />
            <CardContent sx={{ p: 0 }}>
              <TableContainer sx={{ width: '100%' }}>
                <Table sx={{ tableLayout: 'fixed' }}>
                  <TableBody>
                    <TableRow sx={{ backgroundColor: 'white' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155', width: '45%' }}>Net Income</TableCell>
                      <TableCell sx={{ color: '#334155', width: '55%' }}>{formatCurrency(results.netIncome)}</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Self-Employment Rate</TableCell>
                      <TableCell sx={{ color: '#334155' }}>
                        {results.formType === '1120' ? '0%' : results.formType === '1065' ? '15.3%' : results.formType === 'Schedule C/F' ? '15.3%' : results.formType === '1040NR - Schedule E' ? '0%' : results.formType === '1120S' ? '0%' : `${results.selfEmploymentRate}%`}
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell colSpan={2} sx={{ py: 0.5, borderBottom: 'none' }}></TableCell>
                    </TableRow>
                    
                    <TableRow sx={{ backgroundColor: 'white' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Adjusted Gross Income (AGI)</TableCell>
                      <TableCell sx={{ color: '#334155' }}>
                        {results.formType === '1120'
                          ? 'Not Applicable'
                          : results.formType === '1120S'
                            ? formatCurrency(results.AgiCalculation2y4)
                            : results.formType === '1040 - Schedule C/F' && (results.partnerType === 'Passive' || results.partnerType === 'Active')
                              ? formatCurrency(results.agi)
                              : results.formType === '1040NR - Schedule E'
                                ? formatCurrency(results.AgiCalculation2y4)
                                : formatCurrency(results.agi)
                        }
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Qualified Business Income Deduction</TableCell>
                      <TableCell sx={{ color: '#334155' }}>{results.formType === '1120' ? 'Not Applicable' : formatCurrency(results.QBID || 0)}</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: 'white' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Standard Deduction</TableCell>
                      <TableCell sx={{ color: '#334155' }}>
                        {results.formType === '1120' ? 'Not Applicable' : formatCurrency(results.standardDeduction)}
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Taxable Income</TableCell>
                      <TableCell sx={{ color: '#334155' }}>
                        {results.formType === '1120' ? formatCurrency(results.corpTaxableIncome) : results.formType === '1065' ? formatCurrency(results.taxableIncome) : results.formType === '1120S' ? formatCurrency(results.taxableIncome1120S) : results.formType === '1040NR - Schedule E' ? formatCurrency(results.taxableIncome1120S) : formatCurrency(results.taxableIncome)}
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell colSpan={2} sx={{ py: 0.5, borderBottom: 'none' }}></TableCell>
                    </TableRow>
                    
                    <TableRow sx={{ backgroundColor: 'white' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Tax Due (Self-Employment)</TableCell>
                      <TableCell sx={{ color: '#334155' }}>
                        {results.formType === '1120' ? formatCurrency(0) : results.formType === '1120S' ? '$0.00' : results.formType === '1040NR - Schedule E' ? '$0.00' : formatCurrency(results.totalSE)}
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Tax Due (Income tax rate)</TableCell>
                      <TableCell sx={{ color: '#334155' }}>
                        {results.formType === '1120' ? formatCurrency(results.corpTaxDue) : results.formType === '1065' ? formatCurrency(results.taxDue) : results.formType === '1120S' ?  formatCurrency(results.taxDue1120S) : results.formType === '1040NR - Schedule E' ?  formatCurrency(results.taxDue1120S) : formatCurrency(results.taxDue)}
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: 'white' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Tax Credits</TableCell>
                      <TableCell sx={{ color: '#334155' }}>
                        {results.formType === '1120' ? '$0.00' : formatCurrency(results.taxCredits)}
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Total Tax Due</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#0858e6' }}>
                        {results.formType === '1120' ? formatCurrency(results.corpTaxDue) : results.formType === '1065' ? formatCurrency(results.totalTaxDue) : results.formType === '1120S' ? formatCurrency(results.taxDue1120S) : results.formType === '1040NR - Schedule E' ? formatCurrency(results.taxDue1120S) : formatCurrency(results.totalTaxDue)}
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell colSpan={2} sx={{ py: 0.5, borderBottom: 'none' }}></TableCell>
                    </TableRow>
                    
                    <TableRow sx={{ backgroundColor: 'white' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Effective Tax Rate</TableCell>
                      <TableCell sx={{ color: '#334155' }}>
                        {results.formType === '1120' ? `${results.corpEffectiveTaxRate}%` : results.formType === '1065' ? `${results.effectiveTaxRate}%` : results.formType === '1120S' ?  `${results.effectiveTaxRate1120S}%`  : results.formType === '1040NR - Schedule E' ?  `${results.effectiveTaxRate1120S}%`  : `${results.effectiveTaxRate}%`}
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Marginal Tax Rate</TableCell>
                      <TableCell sx={{ color: '#334155' }}>
                        {results.formType === '1120' ? '21%' : results.formType === '1120S' ?  `${results.marginalRate1120s}%`  : results.formType === '1040NR - Schedule E' ?  `${results.marginalRate1120s}%`  : `${results.marginalRate}%`}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Tabla 2: Sin Estrategia */}
        {activeTab === 1 && (
          <Card 
            elevation={1} 
            sx={{ 
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              maxWidth: '100%'
            }}
          >
            <CardHeader 
              title={`Without Strategy - Form: ${results.formType || 'N/A'}`}
              sx={{ 
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                '& .MuiCardHeader-title': {
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#64748b'
                }
              }}
            />
            <CardContent sx={{ p: 0 }}>
              <TableContainer sx={{ width: '100%' }}>
                <Table sx={{ tableLayout: 'fixed' }}>
                  <TableBody>
                    <TableRow sx={{ backgroundColor: 'white' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155', width: '45%' }}>Net Income</TableCell>
                      <TableCell sx={{ color: '#334155', width: '55%' }}>{results.formType === '1120' ? formatCurrency(results.netIncome2) : formatCurrency(results.netIncome2)}</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Self-Employment Rate</TableCell>
                      <TableCell sx={{ color: '#334155' }}>{results.formType === '1120' ? '0%' : results.formType === '1120S' ? '0%' : `${results.selfEmploymentRate}%`}</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: 'white' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Marginal Tax Rate</TableCell>
                      <TableCell sx={{ color: '#334155' }}>{results.formType === '1120' ? '21%' : `${results.marginalRate}%`}</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell colSpan={2} sx={{ py: 0.5, borderBottom: 'none' }}></TableCell>
                    </TableRow>
                    
                    <TableRow sx={{ backgroundColor: 'white' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Adjusted Gross Income (AGI)</TableCell>
                      <TableCell sx={{ color: '#334155' }}>{results.formType === '1120' ? 'Not Applicable' : formatCurrency(results.agi2)}</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Qualified Business Income Deduction</TableCell>
                      <TableCell sx={{ color: '#334155' }}>{'Not Applicable'}</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: 'white' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Standard Deduction</TableCell>
                      <TableCell sx={{ color: '#334155' }}>{results.formType === '1120' ? 'Not Applicable' : formatCurrency(results.standardDeduction)}</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Taxable Income</TableCell>
                      <TableCell sx={{ color: '#334155' }}>{results.formType === '1120' ? formatCurrency(results.corpTaxableIncome2) : formatCurrency(results.taxableIncome2)}</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell colSpan={2} sx={{ py: 0.5, borderBottom: 'none' }}></TableCell>
                    </TableRow>
                    
                    <TableRow sx={{ backgroundColor: 'white' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Tax Due (Self-Employment)</TableCell>
                      <TableCell sx={{ color: '#334155' }}>{results.formType === '1120' ? '$0.00' : results.formType === '1120S' ? '$0.00' : formatCurrency(results.totalSE2)}</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Tax Due (Income tax rate)</TableCell>
                      <TableCell sx={{ color: '#334155' }}>{results.formType === '1120' ? formatCurrency(results.corpTaxDue2) : formatCurrency(results.taxDue2)}</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: 'white' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Tax Credits</TableCell>
                      <TableCell sx={{ color: '#334155' }}>{'$0.00'}</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Total Tax Due</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>{results.formType === '1120' ? formatCurrency(results.corpTaxDue2) : results.formType === '1120S' ? formatCurrency(results.taxDue2) : formatCurrency(results.totalTaxDue2)}</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell colSpan={2} sx={{ py: 0.5, borderBottom: 'none' }}></TableCell>
                    </TableRow>
                    
                    <TableRow sx={{ backgroundColor: 'white' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Effective Tax Rate</TableCell>
                      <TableCell sx={{ color: '#334155' }}>{results.formType === '1120' ? `${results.corpEffectiveTaxRate}%` : `${results.effectiveTaxRate2}%`}</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Effective SE Rate</TableCell>
                      <TableCell sx={{ color: '#334155' }}>{results.formType === '1120' ? '0%' : results.formType === '1120S' ? '0%' : `${results.effectiveSERate2}%`}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Tabla 3: Cálculos Adicionales */}
        {activeTab === 2 && (
          <Grid container spacing={3}>
            {/* Cálculos adicionales con estrategia */}
            <Grid item xs={12} md={6}>
              <Card 
                elevation={1} 
                sx={{ 
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  height: '100%',
                  maxWidth: '100%',
                  maxWidth: '100%'
                }}
              >
                <CardHeader 
                  title="With Strategy - Additional Calculations"
                  sx={{ 
                    backgroundColor: '#f0f9ff',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                    '& .MuiCardHeader-title': {
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#0858e6'
                    }
                  }}
                />
                <CardContent sx={{ p: 0 }}>
                  <TableContainer sx={{ width: '100%' }}>
                    <Table sx={{ tableLayout: 'fixed' }}>
                      <TableBody>
                        <TableRow sx={{ backgroundColor: 'white' }}>
                          <TableCell sx={{ fontWeight: 500, color: '#334155', width: '45%' }}>Income Level</TableCell>
                          <TableCell sx={{ color: '#334155', width: '55%' }}>{results.formType === '1120S' ? (results.incomeLevel1120S) : (results.incomeLevel)}</TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                          <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Marginal Rate</TableCell>
                          <TableCell sx={{ color: '#334155' }}>{results.formType === '1120S' ? (results.marginalRate1120s) : (results.marginalRate)}%</TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: 'white' }}>
                          <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Tax Due (Income tax rate)</TableCell>
                          <TableCell sx={{ color: '#334155' }}>{results.formType === '1120' ? formatCurrency(results.corpTaxDue) : results.formType === '1120S' ?  formatCurrency(results.taxDue1120S) : formatCurrency(results.taxDue)}</TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                          <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Self-Employment Social Security</TableCell>
                          <TableCell sx={{ color: '#334155' }}>{formatCurrency(results.seSocialSecurity)}</TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: 'white' }}>
                          <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Self-Employment Medicare</TableCell>
                          <TableCell sx={{ color: '#334155' }}>{formatCurrency(results.seMedicare)}</TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                          <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Total Self-Employment Tax</TableCell>
                          <TableCell sx={{ color: '#334155' }}>{formatCurrency(results.totalSE)}</TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: 'white' }}>
                          <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Self-Employment Deduction</TableCell>
                          <TableCell sx={{ color: '#334155' }}>{formatCurrency(results.seDeduction)}</TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                          <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Additional Medicare Tax</TableCell>
                          <TableCell sx={{ color: '#334155' }}>{formatCurrency(results.additionalMedicare)}</TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: 'white' }}>
                          <TableCell sx={{ fontWeight: 500, color: '#334155' }}>NIIT Threshold</TableCell>
                          <TableCell sx={{ color: '#334155' }}>{formatCurrency(results.niitThreshold)}</TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                          <TableCell sx={{ fontWeight: 500, color: '#334155' }}>NIIT Invest income</TableCell>
                          <TableCell sx={{ color: '#334155' }}>{formatCurrency(results.calcularNIITInvest)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Cálculos adicionales sin estrategia */}
            <Grid item xs={12} md={6}>
              <Card 
                elevation={1} 
                sx={{ 
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  height: '100%'
                }}
              >
                <CardHeader 
                  title="Without Strategy - Additional Calculations"
                  sx={{ 
                    backgroundColor: '#f8fafc',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                    '& .MuiCardHeader-title': {
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#64748b'
                    }
                  }}
                />
                <CardContent sx={{ p: 0 }}>
                  <TableContainer sx={{ width: '100%' }}>
                    <Table sx={{ tableLayout: 'fixed' }}>
                      <TableBody>
                        <TableRow sx={{ backgroundColor: 'white' }}>
                          <TableCell sx={{ fontWeight: 500, color: '#334155', width: '45%' }}>Income Level</TableCell>
                          <TableCell sx={{ color: '#334155', width: '55%' }}>{results.incomeLevel2}</TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                          <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Marginal Rate</TableCell>
                          <TableCell sx={{ color: '#334155' }}>{results.marginalRate2}%</TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: 'white' }}>
                          <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Tax Due (Income tax rate)</TableCell>
                          <TableCell sx={{ color: '#334155' }}>{formatCurrency(results.taxDue2)}</TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                          <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Self-Employment Social Security</TableCell>
                          <TableCell sx={{ color: '#334155' }}>{formatCurrency(results.seSocialSecurity2)}</TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: 'white' }}>
                          <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Self-Employment Medicare</TableCell>
                          <TableCell sx={{ color: '#334155' }}>{formatCurrency(results.seMedicare2)}</TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                          <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Total Self-Employment Tax</TableCell>
                          <TableCell sx={{ color: '#334155' }}>{formatCurrency(results.totalSE2)}</TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: 'white' }}>
                          <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Self-Employment Deduction</TableCell>
                          <TableCell sx={{ color: '#334155' }}>{formatCurrency(results.seDeduction2)}</TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                          <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Additional Medicare Tax</TableCell>
                          <TableCell sx={{ color: '#334155' }}>{formatCurrency(results.additionalMedicare2)}</TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: 'white' }}>
                          <TableCell sx={{ fontWeight: 500, color: '#334155' }}>NIIT Threshold</TableCell>
                          <TableCell sx={{ color: '#334155' }}>{formatCurrency(results.niitThreshold2)}</TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                          <TableCell sx={{ fontWeight: 500, color: '#334155' }}>NIIT Invest income</TableCell>
                          <TableCell sx={{ color: '#334155' }}>{formatCurrency(results.calcularNIITInvest2)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* Botón de Exportar PDF */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <ExportPDF results={results} formTitle={formTitle} />
      </Box>
    </Box>
  );
};

export default ResultsDisplay;