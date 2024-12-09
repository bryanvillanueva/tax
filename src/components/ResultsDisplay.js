import React from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button } from '@mui/material';

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

      {/* Primera Sección de Resultados */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableBody>
            <TableRow sx={{ backgroundColor: '#9ce7ff' }}>
              <TableCell>Net Income</TableCell>
              <TableCell>{formatCurrency(results.netIncome)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Self-Employment Rate</TableCell>
              <TableCell>{results.selfEmploymentRate}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Marginal Tax Rate</TableCell>
              <TableCell>{results.marginalRate}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Taxable Income</TableCell>
              <TableCell>{formatCurrency(results.taxableIncome)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total Tax Due</TableCell>
              <TableCell>{formatCurrency(results.totalTaxDue)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Segunda Sección de Resultados */}
      <Typography variant="h6" gutterBottom>
        Additional Calculations
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Adjusted Gross Income (AGI)</TableCell>
              <TableCell>{formatCurrency(results.agi)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Self-Employment Social Security</TableCell>
              <TableCell>{formatCurrency(results.seSocialSecurity)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Self-Employment Medicare</TableCell>
              <TableCell>{formatCurrency(results.seMedicare)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total Self-Employment Tax</TableCell>
              <TableCell>{formatCurrency(results.totalSE)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Self-Employment Deduction</TableCell>
              <TableCell>{formatCurrency(results.seDeduction)}</TableCell>
            </TableRow>
            <TableRow>
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
