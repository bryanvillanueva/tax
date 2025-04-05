import React from 'react';
import { 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableRow, 
  Paper, 
  Chip,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Button
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import PercentIcon from '@mui/icons-material/Percent';
import SavingsIcon from '@mui/icons-material/Savings';
import ExportQBIDPDF from './ExportQBIDPDF';


const formatCurrency = (value) => {
  if (value === undefined || value === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const QBIDResultsDisplay = ({ results, formTitle }) => {
  if (!results) return null;

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{ 
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
          QBID Calculation Results
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', mb: 3, textAlign: 'center' }}>
          Qualified Business Income Deduction calculation summary
        </Typography>
      </Box>

      {/* QBID Summary Card */}
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
          title="QBID Calculation Summary" 
          sx={{ 
            backgroundColor: '#f0f9ff', 
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            '& .MuiCardHeader-title': {
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#0858e6'
            }
          }}
        />
        <CardContent sx={{ p: 0 }}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={6} sx={{ 
              p: 3, 
              borderRight: { xs: 'none', md: '1px solid rgba(0, 0, 0, 0.05)' },
              borderBottom: { xs: '1px solid rgba(0, 0, 0, 0.05)', md: 'none' }
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
                  Qualified Business Income
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                  {formatCurrency(results.qualifiedBusinessIncome)}
                </Typography>
                <Chip 
                  icon={<CalculateIcon />}
                  label="QBI" 
                  size="small" 
                  sx={{ bgcolor: '#f1f5f9', color: '#64748b' }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6} sx={{ 
              p: 3
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
                  Final QBID Amount
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#0858e6', mb: 1 }}>
                  {formatCurrency(results.smallerOfQbidAndLimit)}
                </Typography>
                <Chip 
                  icon={<SavingsIcon />}
                  label="QBID Applied" 
                  size="small" 
                  sx={{ bgcolor: '#e0f2fe', color: '#0858e6' }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Detailed Calculations */}
      <Grid container spacing={3}>
        {/* Input Values */}
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
              title="Input Values" 
              sx={{ 
                backgroundColor: '#f8fafc', 
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                '& .MuiCardHeader-title': {
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#333'
                }
              }}
            />
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow sx={{ backgroundColor: 'white' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Qualified Business Income (QBI)</TableCell>
                      <TableCell sx={{ color: '#334155' }}>{formatCurrency(results.qualifiedBusinessIncome)}</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Filing Status</TableCell>
                      <TableCell sx={{ color: '#334155' }}>{results.filingStatus}</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: 'white' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Threshold</TableCell>
                      <TableCell sx={{ color: '#334155' }}>{formatCurrency(results.threshold)}</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Taxable Income Before QBID</TableCell>
                      <TableCell sx={{ color: '#334155' }}>{formatCurrency(results.taxableIncomeBeforeQbid)}</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: 'white' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Capital Gain</TableCell>
                      <TableCell sx={{ color: '#334155' }}>
                        {formatCurrency(results.capitalGain)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Calculation Results */}
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
              title="Calculation Results" 
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
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow sx={{ backgroundColor: 'white' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>QBI × Component ({results.component}%)</TableCell>
                      <TableCell sx={{ color: '#334155' }}>{formatCurrency(results.qbid)}</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>Taxable Income Less Capital Gain</TableCell>
                      <TableCell sx={{ color: '#334155' }}>{formatCurrency(results.totalIncomeLessCapitalGain)}</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: 'white' }}>
                      <TableCell sx={{ fontWeight: 500, color: '#334155' }}>QBID Limit (TT × {results.componentIncomeLimitation}%)</TableCell>
                      <TableCell sx={{ color: '#334155' }}>{formatCurrency(results.qbidLimit)}</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#0858e6' }}>Final QBID (Smaller of QBID and Limit)</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#0858e6' }}>{formatCurrency(results.smallerOfQbidAndLimit)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Espacio para separación */}
      <Box sx={{ mt: 3 }}></Box>

      {/* Botón de Exportar PDF */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
      <ExportQBIDPDF results={results} formTitle={formTitle}  />
      </Box>
    </Box>
  );
};

export default QBIDResultsDisplay;