import React from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper, Button } from '@mui/material';
import ExportPDF from './ExportPDF';

const formatCurrency = (value) => {
  if (value === undefined || value === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const ResultsDisplay = ({ results, formTitle }) => {
  const handlePrint = () => {
    window.print();
  };
  console.log('Results:', results)

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Montserrat, sans-serif', }}>
        Calculation Results
      </Typography>

      {/* Primera Tabla de Resultados */}
      <TableContainer component={Paper} sx={{ mb: 4, marginBottom: '55px', marginTop: '35px' }}>
      <Table >
        <TableHead>
        <TableCell sx={{ fontWeight: 'bold' }}>Value Withouth Strategy</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Value with strategy</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Savings</TableCell>
        </TableHead>
        <TableBody>
            <TableRow sx={{ backgroundColor: '#e8f2ff',}}>
              <TableCell>{formatCurrency(results.totalTaxDue2)}</TableCell>
              <TableCell>{formatCurrency(results.totalTaxDue)}</TableCell>
              <TableCell sx={{ backgroundColor: '#93f5b0',}}>{formatCurrency(results.totalTaxDue2 - results.totalTaxDue)}</TableCell>
            </TableRow>
        </TableBody>
      </Table>
      </TableContainer>

      {/* Segunda Tabla de Resultados */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Return - Form</TableCell>
              <TableCell>{results.formType || 'N/A'}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>1120</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow sx={{ backgroundColor: '#e8f2ff' }}>
              <TableCell>Net Income</TableCell>
              <TableCell>{formatCurrency(results.netIncome)}</TableCell>
              <TableCell>{formatCurrency(results.netIncome)}</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#e8f2ff' }}>
              <TableCell>Self-Employment Rate</TableCell>
              <TableCell>{results.selfEmploymentRate}%</TableCell>
              <TableCell>0%</TableCell>
            </TableRow>

            {/* Fila Vacía para Separación */}
            <TableRow>
              <TableCell colSpan={3}>&nbsp;</TableCell>
            </TableRow>

            <TableRow sx={{ backgroundColor: '#e8f2ff' }}>
              <TableCell>Adjusted Gross Income (AGI)</TableCell>
              <TableCell>{formatCurrency(results.agi)}</TableCell>
              <TableCell>Not applicable</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#e8f2ff' }}>
              <TableCell>Standard Deduction</TableCell>
              <TableCell>{formatCurrency(results.standardDeduction)}</TableCell>
              <TableCell>Not applicable</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#e8f2ff' }}>
              <TableCell>Taxable Income</TableCell>
              <TableCell>{formatCurrency(results.taxableIncome)}</TableCell>
              <TableCell>{formatCurrency(results.corpTaxableIncome)}</TableCell>
            </TableRow>

            {/* Fila Vacía para Separación */}
            <TableRow>
              <TableCell colSpan={3}>&nbsp;</TableCell>
            </TableRow>

            <TableRow sx={{ backgroundColor: '#e8f2ff' }}>
              <TableCell>Tax Due (Self-Employment)</TableCell>
              <TableCell>{formatCurrency(results.totalSE)}</TableCell>
              <TableCell>{formatCurrency(0)}</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#e8f2ff' }}>
              <TableCell>Tax Due (Income tax rate)</TableCell>
              <TableCell>{formatCurrency(results.taxDue)}</TableCell>
              <TableCell>{formatCurrency(results.corpTaxDue)}</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#e8f2ff' }}>
              <TableCell>Tax Credits</TableCell>
              <TableCell>{formatCurrency(results.taxCredits)}</TableCell>
              <TableCell>Not applicable</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#e8f2ff' }}>
              <TableCell>Total Tax Due</TableCell>
              <TableCell>{formatCurrency(results.totalTaxDue)}</TableCell>
              <TableCell>{formatCurrency(results.corpTaxDue)}</TableCell>
            </TableRow>

            {/* Fila Vacía para Separación */}
            <TableRow>
              <TableCell colSpan={3}>&nbsp;</TableCell>
            </TableRow>

            <TableRow sx={{ backgroundColor: '#e8f2ff' }}>
              <TableCell>Effective Tax Rate</TableCell>
              <TableCell>{results.effectiveTaxRate}%</TableCell>
              <TableCell>{results.corpEffectiveTaxRate}%</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#e8f2ff' }}>
            <TableCell>Marginal Tax Rate</TableCell>
              <TableCell>{results.marginalRate}%</TableCell>
              <TableCell>21%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h5" gutterBottom>
      Values without strategy
      </Typography>
  
  <TableContainer component={Paper} sx={{ mb: 4 }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#fff9c4' }}>Return - Form</TableCell>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#fff9c4' }}>1040/1040NR</TableCell>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#fff9c4' }}>1120</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
        <TableCell>Net Income</TableCell>
        <TableCell>{formatCurrency(results.netIncome2)}</TableCell>
        <TableCell>{formatCurrency(results.netIncome2)}</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
        <TableCell>Self-Employment Rate</TableCell>
        <TableCell>{results.selfEmploymentRate}%</TableCell>
        <TableCell>0%</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
        <TableCell>Marginal Tax Rate</TableCell>
        <TableCell>{results.marginalRate}%</TableCell>
        <TableCell>21%</TableCell>
      </TableRow>

      {/* Fila Vacía para Separación */}
      <TableRow>
        <TableCell colSpan={3}>&nbsp;</TableCell>
      </TableRow>

      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
        <TableCell>Adjusted Gross Income (AGI)</TableCell>
        <TableCell>{formatCurrency(results.agi2)}</TableCell>
        <TableCell>Not applicable</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
        <TableCell>Standard Deduction</TableCell>
        <TableCell>{formatCurrency(results.standardDeduction)}</TableCell>
        <TableCell>Not applicable</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
        <TableCell>Taxable Income</TableCell>
        <TableCell>{formatCurrency(results.taxableIncome2)}</TableCell>
        <TableCell>{formatCurrency(results.corpTaxableIncome2)}</TableCell>
      </TableRow>

      {/* Fila Vacía para Separación */}
      <TableRow>
        <TableCell colSpan={3}>&nbsp;</TableCell>
      </TableRow>

      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
        <TableCell>Tax Due (Self-Employment)</TableCell>
        <TableCell>{formatCurrency(results.totalSE2)}</TableCell>
        <TableCell>{formatCurrency(0)}</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
        <TableCell>Tax Due (Income tax rate)</TableCell>
        <TableCell>{formatCurrency(results.taxDue2)}</TableCell>
        <TableCell>{formatCurrency(results.corpTaxDue2)}</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
              <TableCell>Tax Credits</TableCell>
              <TableCell>Not applicable</TableCell>
              <TableCell>Not applicable</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
        <TableCell>Total Tax Due</TableCell>
        <TableCell>{formatCurrency(results.totalTaxDue2)}</TableCell>
        <TableCell>{formatCurrency(results.corpTaxDue2)}</TableCell>
      </TableRow>
      
      {/* Fila Vacía para Separación */}
      <TableRow>
              <TableCell colSpan={3}>&nbsp;</TableCell>
      </TableRow>

      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
        <TableCell>Effective Tax Rate</TableCell>
        <TableCell>{results.effectiveTaxRate2}%</TableCell>
        <TableCell>{results.corpEffectiveTaxRate}%</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
             <TableCell>Effective SE Rate</TableCell>
             <TableCell>{results.effectiveSERate2}%</TableCell>
             <TableCell>0%</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>


      {/* Tercera Tabla de Resultados Adicionales */}
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
              <TableCell>Tax Due (Income tax rate)</TableCell>
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
            <TableRow sx={{ backgroundColor: '#52a6d8' }}>
              <TableCell>NIIT Threshold</TableCell>
              <TableCell>{formatCurrency(results.niitThreshold)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

{/* Segunda Tabla de Resultados Adicionales con Azul Claro */}
<Typography variant="h6" gutterBottom>
Additional calculations without strategy
</Typography>
<TableContainer component={Paper} sx={{ mb: 4 }}>
  <Table>
    <TableBody>
      <TableRow sx={{ backgroundColor: '#b3e5fc' }}>
        <TableCell>Income Level</TableCell>
        <TableCell>{results.incomeLevel2}</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#b3e5fc' }}>
        <TableCell>Marginal Rate</TableCell>
        <TableCell>{results.marginalRate2}%</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#b3e5fc' }}>
        <TableCell>Tax Due (Income tax rate)</TableCell>
        <TableCell>{formatCurrency(results.taxDue2)}</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#b3e5fc' }}>
        <TableCell>Self-Employment Social Security</TableCell>
        <TableCell>{formatCurrency(results.seSocialSecurity2)}</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#b3e5fc' }}>
        <TableCell>Self-Employment Medicare</TableCell>
        <TableCell>{formatCurrency(results.seMedicare2)}</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#b3e5fc' }}>
        <TableCell>Total Self-Employment Tax</TableCell>
        <TableCell>{formatCurrency(results.totalSE2)}</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#b3e5fc' }}>
        <TableCell>Self-Employment Deduction</TableCell>
        <TableCell>{formatCurrency(results.seDeduction2)}</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#b3e5fc' }}>
        <TableCell>Additional Medicare Tax</TableCell>
        <TableCell>{formatCurrency(results.additionalMedicare2)}</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#b3e5fc' }}>
          <TableCell>NIIT Threshold</TableCell>
          <TableCell>{formatCurrency(results.niitThreshold2)}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>



      

      {/* Botón de Imprimir */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <ExportPDF results={results} formTitle={formTitle} />
      </Box>
    </Box>
  );
};

export default ResultsDisplay;
