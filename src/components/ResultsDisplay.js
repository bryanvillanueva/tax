import React from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper, Button } from '@mui/material';

const formatCurrency = (value) => {
  return value !== undefined && value !== null ? `$${value.toFixed(2)}` : '$0.00';
};

const ResultsDisplay = ({ results }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Calculation Results
      </Typography>

      {/* Primera Tabla de Resultados */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Return - Form</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>1040/1040NR</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>1120</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow sx={{ backgroundColor: '#9ce7ff' }}>
              <TableCell>Net Income</TableCell>
              <TableCell>{formatCurrency(results.netIncome)}</TableCell>
              <TableCell>{formatCurrency(results.netIncome)}</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#82b484' }}>
              <TableCell>Self-Employment Rate</TableCell>
              <TableCell>{results.selfEmploymentRate}%</TableCell>
              <TableCell>0%</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#82b484' }}>
              <TableCell>Marginal Tax Rate</TableCell>
              <TableCell>{results.marginalRate}%</TableCell>
              <TableCell>21%</TableCell>
            </TableRow>

            {/* Fila Vacía para Separación */}
            <TableRow>
              <TableCell colSpan={3}>&nbsp;</TableCell>
            </TableRow>

            <TableRow sx={{ backgroundColor: '#82b484' }}>
              <TableCell>Adjusted Gross Income (AGI)</TableCell>
              <TableCell>{formatCurrency(results.agi)}</TableCell>
              <TableCell>Not applicable</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#82b484' }}>
              <TableCell>Standard Deduction</TableCell>
              <TableCell>{formatCurrency(results.standardDeduction)}</TableCell>
              <TableCell>Not applicable</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#82b484' }}>
              <TableCell>Taxable Income</TableCell>
              <TableCell>{formatCurrency(results.taxableIncome)}</TableCell>
              <TableCell>{formatCurrency(results.corpTaxableIncome)}</TableCell>
            </TableRow>

            {/* Fila Vacía para Separación */}
            <TableRow>
              <TableCell colSpan={3}>&nbsp;</TableCell>
            </TableRow>

            <TableRow sx={{ backgroundColor: '#82b484' }}>
              <TableCell>Tax Due (Self-Employment)</TableCell>
              <TableCell>{formatCurrency(results.totalSE)}</TableCell>
              <TableCell>{formatCurrency(0)}</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#82b484' }}>
              <TableCell>Tax Due</TableCell>
              <TableCell>{formatCurrency(results.taxDue)}</TableCell>
              <TableCell>{formatCurrency(results.corpTaxDue)}</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#82b484' }}>
              <TableCell>Effective Tax Rate</TableCell>
              <TableCell>{results.effectiveTaxRate}%</TableCell>
              <TableCell>{results.corpEffectiveTaxRate}%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Segunda Tabla de Resultados Adicionales */}
      <Typography variant="h6" gutterBottom>
        Additional Calculations
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableBody>
            <TableRow sx={{ backgroundColor: '#52a6d8' }}>
              <TableCell>Income Level</TableCell>
              <TableCell>{results.incomeLevel}</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#52a6d8' }}>
              <TableCell>Marginal Rate</TableCell>
              <TableCell>{results.marginalRate}%</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#52a6d8' }}>
              <TableCell>Tax Due</TableCell>
              <TableCell>{formatCurrency(results.taxDue)}</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#52a6d8' }}>
              <TableCell>Self-Employment Social Security</TableCell>
              <TableCell>{formatCurrency(results.seSocialSecurity)}</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#52a6d8' }}>
              <TableCell>Self-Employment Medicare</TableCell>
              <TableCell>{formatCurrency(results.seMedicare)}</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#52a6d8' }}>
              <TableCell>Total Self-Employment Tax</TableCell>
              <TableCell>{formatCurrency(results.totalSE)}</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#52a6d8' }}>
              <TableCell>Self-Employment Deduction</TableCell>
              <TableCell>{formatCurrency(results.seDeduction)}</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#52a6d8' }}>
              <TableCell>Additional Medicare Tax</TableCell>
              <TableCell>{formatCurrency(results.additionalMedicare)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Botón de Imprimir */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Button variant="contained" color="primary" onClick={handlePrint}>
          Print Results
        </Button>
      </Box>
    </Box>
  );
};

export default ResultsDisplay;
