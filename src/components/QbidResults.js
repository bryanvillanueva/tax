import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader, 
  Table, 
  TableBody, 
  TableRow, 
  TableCell, 
  Grid 
} from '@mui/material';
import ExportQbidPDF2 from './ExportQbidPDF2'; // Importar el componente de exportación a PDF


const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatPercentage = (value) => {
  if (value === undefined || value === null) return '0.00%';
  return `${(value * 100).toFixed(2)}%`;
};



const QbidResults = ({ results, formTitle }) => {
  console.log('Results:', results)
console.log('Form:', results.calculationType)
  return (
    <Box sx={{ mt: 4, px: 2 }}>
      {/* Encabezado */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{ 
          fontWeight: 700,
          color: '#0858e6',
          position: 'relative',
          pb: 2,
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '4px',
            backgroundColor: '#0858e6',
            borderRadius: '4px'
          }
        }}>
          Qualified Business Income Deduction
        </Typography>
        <Typography variant="body1" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Detailed breakdown of Qualified Business Income Deduction calculations
        </Typography>
      </Box>

      {/* QBID Info Section */}
      <Grid item xs={12} md={12} sx={{ mb: 4 }}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <CardHeader 
              title="QBID Summary" 
              sx={{ 
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e5e7eb',
                py: 2,
                '& .MuiCardHeader-title': {
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#0858e6'
                }
              }}
            />
            <CardContent sx={{ p: 0 }}>
              <Grid container>
                <Grid item xs={12} md={4} sx={{ 
                  p: 3,
                  borderRight: { md: '1px solid #e5e7eb' },
                  borderBottom: { xs: '1px solid #e5e7eb', md: 'none' }
                }}>
                  <Box textAlign="center">
                    <Typography variant="subtitle2" sx={{ color: '#6b7280', mb: 1 }}>
                      Patron Reduction
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#374151' }}>
                      {formatCurrency(results.patronReduction)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4} sx={{ 
                  p: 3,
                  borderRight: { md: '1px solid #e5e7eb' },
                  borderBottom: { xs: '1px solid #e5e7eb', md: 'none' }
                }}>
                  <Box textAlign="center">
                    <Typography variant="subtitle2" sx={{ color: '#6b7280', mb: 1 }}>
                      QBID Limit
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#374151' }}>
                      {formatCurrency(results.qbidLimit)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4} sx={{ p: 3 }}>
                  <Box textAlign="center">
                    <Typography variant="subtitle2" sx={{ color: '#6b7280', mb: 1 }}>
                      Total QBID
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#0858e6' }}>
                      {formatCurrency(results.totalQbid)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

      <Grid container spacing={3}>
        {/* Standard Method Section */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <CardHeader 
              title="Standard Method Calculations"
              sx={{ 
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e5e7eb',
                py: 2,
                '& .MuiCardHeader-title': {
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#0858e6'
                }
              }}
            />
            <CardContent sx={{ p: 0 }}>
              <Table>
                <TableBody>
                  {[
                    ['Individual Taxpayer\'s Status', results.filingStatus],
                    ['Threshold', formatCurrency(results.threshold)],
                    ['Qualified Business Income', formatCurrency(results.qualifiedBusinessIncome)],
                    ['Component Rate', formatPercentage(results.componentRate)],
                    ['QBID Calculation', formatCurrency(results.qbid)],
                    ['W2 Wages', formatCurrency(results.w2Wages)],
                    ['Component One (50%)', formatPercentage(results.component50)],
                    ['Component Two (25%)', formatPercentage(results.component25)],
                    ['Amount of UBIA', formatCurrency(results.ubia)],
                    ['Component UBIA', formatPercentage(results.componentUbia)],
                    ['Total Component One (50%)', formatCurrency(results.totalComponent50)],
                    ['Total Component Two (25%) + UBIA', formatCurrency(results.totalComponent25PlusUbia)],
                    ['Greater Component', formatCurrency(results.greaterComponent)],
                    ['Smaller of QBID and Component W2 Wages', formatCurrency(results.smallerQbidComponent)],
                  ].map(([label, value], index) => (
                    <TableRow 
                      key={label}
                      sx={{ 
                        backgroundColor: index % 2 === 0 ? '#fff' : '#f8fafc',
                        '&:last-child td': { borderBottom: 0 }
                      }}
                    >
                      <TableCell sx={{ 
                        fontWeight: 500, 
                        color: '#000',
                        width: '60%',
                        borderRight: '1px solid #e5e7eb'
                      }}>
                        {label}
                      </TableCell>
                      <TableCell sx={{ 
                        color: '#1e3a8a',
                        fontWeight: 400,
                        width: '40%'
                      }}>
                        {value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Phased-In Section */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <CardHeader 
              title="Phased-In Calculations"
              sx={{ 
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e5e7eb',
                py: 2,
                '& .MuiCardHeader-title': {
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#0858e6'
                }
              }}
            />
            <CardContent sx={{ p: 0 }}>
              <Table>
                <TableBody>
                  {[
                    ['QBID', formatCurrency(results.phasedInQbid)],
                    ['Greater Component', formatCurrency(results.phasedInGreaterComponent)],
                    ['Amount Applicable to Phase-in', formatCurrency(results.amountApplicableToPhaseIn)],
                    ['Taxable Income Before QBID', formatCurrency(results.taxableIncomeBeforeQbid)],
                    ['Threshold', formatCurrency(results.phasedInThreshold)],
                    ['Amount Over Threshold', formatCurrency(results.amountOverThreshold)],
                    ['Phase-In Range', formatCurrency(results.phaseInRange)],
                    ['Phase-In Percentage', formatPercentage(results.phaseInPercentage)],
                    ['Total Phase-in Reduction', formatCurrency(results.totalPhaseInReduction)],
                    ['QBID after Phase-in Reduction', formatCurrency(results.qbidAfterPhaseInReduction)],
                  ].map(([label, value], index) => (
                    <TableRow 
                      key={label}
                      sx={{ 
                        backgroundColor: index % 2 === 0 ? '#fff' : '#f8fafc',
                        '&:last-child td': { borderBottom: 0 }
                      }}
                    >
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: '#000',
                        width: '60%',
                        borderRight: '1px solid #e5e7eb'
                      }}>
                        {label}
                      </TableCell>
                      <TableCell sx={{ 
                        color: '#1e3a8a',
                        fontWeight: 300,
                        width: '40%'
                      }}>
                        {value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
    </Grid>
      
      {/* Botón de Exportar PDF */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <ExportQbidPDF2 results={results} formTitle={formTitle} />
     </Box>
   </Box>
    
  );
};

export default QbidResults;