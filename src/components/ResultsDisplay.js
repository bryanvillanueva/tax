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
              <TableCell>{results.formType === '1120' ? formatCurrency(results.corpTaxDue) : results.formType === '1120S' ? formatCurrency(results.taxDue1120S) : formatCurrency(results.totalTaxDue)}</TableCell>
              <TableCell sx={{ 
                backgroundColor: (results.formType === '1120' 
               ? results.totalTaxDue2 - results.corpTaxDue 
               : results.formType === '1120S' 
               ? results.totalTaxDue2 - results.taxDue 
               : results.totalTaxDue2 - results.totalTaxDue) <= 0 
               ? '#e36666' 
               : '#93f5b0',}}
               >{results.formType === '1120' ? formatCurrency(results.totalTaxDue2 - results.corpTaxDue) : results.formType === '1120S' ? formatCurrency(results.totalTaxDue2 - results.taxDue) : formatCurrency(results.totalTaxDue2 - results.totalTaxDue)}</TableCell>
            </TableRow>
        </TableBody>
      </Table>
      </TableContainer>
      
      {/* Segunda Tabla de Resultados */}
      <TableContainer component={Paper} sx={{ mb: 4, marginBottom: '55px', marginTop: '35px' }}>
      <Table >
      <TableHead>
  <TableRow>
    <TableCell sx={{ fontWeight: 'bold' }}>Return - Form</TableCell>
    <TableCell sx={{ fontWeight: 'bold' }}>{results.formType || 'N/A'}</TableCell>
  </TableRow>
</TableHead>
<TableBody>
  <TableRow sx={{ backgroundColor: '#e8f2ff' }}>
    <TableCell>Net Income</TableCell>
    <TableCell>{formatCurrency(results.netIncome)}</TableCell>
  </TableRow>
  <TableRow sx={{ backgroundColor: '#e8f2ff' }}>
    <TableCell>Self-Employment Rate</TableCell>
    <TableCell>
      {results.formType === '1120' ? '0%' : results.formType === '1065' ? '15.3%' : results.formType === 'Schedule C/F' ? '15.3%' : results.formType === '1040NR - Schedule E' ? '0%' : results.formType === '1120S' ? '0%' : `${results.selfEmploymentRate}%`}
    </TableCell>
  </TableRow>

  {/* Fila vacía para separación */}
  <TableRow>
    <TableCell colSpan={2}>&nbsp;</TableCell>
  </TableRow>

  <TableRow sx={{ backgroundColor: '#e8f2ff' }}>
    <TableCell>Adjusted Gross Income (AGI)</TableCell>
    <TableCell>
    {results.formType === '1120'
      ? 'Not Applicable'
      : results.formType === '1120S'
      ? formatCurrency(results.AgiCalculation2y4)
      : results.formType === '1040 - Schedule C/F' && results.partnerType === 'Passive'
      ? formatCurrency(results.agi)
      : results.formType === '1040 - Schedule C/F' && results.partnerType === 'Active'
      ? formatCurrency(results.agi)
      : results.formType === '1040NR - Schedule E'
      ? formatCurrency(results.AgiCalculation2y4)
      : formatCurrency(results.agi)}
  </TableCell>
  </TableRow>
  <TableRow sx={{ backgroundColor: '#e8f2ff' }}>
      <TableCell>Qualified Business Income Deduction</TableCell>
      <TableCell> {results.formType === '1120' ? 'Not Applicable' : formatCurrency(results.QBID || 0)}
  </TableCell>
  </TableRow>
  <TableRow sx={{ backgroundColor: '#e8f2ff' }}>
    <TableCell>Standard Deduction</TableCell>
    <TableCell>
      {results.formType === '1120' ? 'Not Applicable' : formatCurrency(results.standardDeduction)}
    </TableCell>
  </TableRow>
  <TableRow sx={{ backgroundColor: '#e8f2ff' }}>
    <TableCell>Taxable Income</TableCell>
    <TableCell>
      {results.formType === '1120' ? formatCurrency(results.corpTaxableIncome) : results.formType === '1065' ? formatCurrency(results.taxableIncome) : results.formType === '1120S' ? formatCurrency(results.taxableIncome1120S) : results.formType === '1040NR - Schedule E' ? formatCurrency(results.taxableIncome1120S) : formatCurrency(results.taxableIncome)}
    </TableCell>
  </TableRow>
  {/* Fila vacía para separación */}
  <TableRow>
    <TableCell colSpan={2}>&nbsp;</TableCell>
  </TableRow>

  <TableRow sx={{ backgroundColor: '#e8f2ff' }}>
    <TableCell>Tax Due (Self-Employment)</TableCell>
    <TableCell>
      {results.formType === '1120' ? formatCurrency(0) : results.formType === '1120S' ? '$0.00' : results.formType === '1040NR - Schedule E' ? '$0.00' : formatCurrency(results.totalSE)}
    </TableCell>
  </TableRow>
  <TableRow sx={{ backgroundColor: '#e8f2ff' }}>
    <TableCell>Tax Due (Income tax rate)</TableCell>
    <TableCell>
    {results.formType === '1120' ? formatCurrency(results.corpTaxDue) : results.formType === '1065' ? formatCurrency(results.taxDue) : results.formType === '1120S' ?  formatCurrency(results.taxDue1120S) : results.formType === '1040NR - Schedule E' ?  formatCurrency(results.taxDue1120S) : formatCurrency(results.taxDue)}
    </TableCell>
  </TableRow>
  <TableRow sx={{ backgroundColor: '#e8f2ff' }}>
    <TableCell>Tax Credits</TableCell>
    <TableCell>
      {results.formType === '1120' ? '$0.00' : formatCurrency(results.taxCredits)}
    </TableCell>
  </TableRow>
  <TableRow sx={{ backgroundColor: '#e8f2ff' }}>
    <TableCell>Total Tax Due</TableCell>
    <TableCell>
      {results.formType === '1120' ? formatCurrency(results.corpTaxDue) : results.formType === '1065' ? formatCurrency(results.totalTaxDue) : results.formType === '1120S' ? formatCurrency(results.taxDue1120S) : results.formType === '1040NR - Schedule E' ? formatCurrency(results.taxDue1120S) : formatCurrency(results.totalTaxDue)}
    </TableCell>
  </TableRow>
  
  {/* Fila vacía para separación */}
  <TableRow>
    <TableCell colSpan={2}>&nbsp;</TableCell>
  </TableRow>

  <TableRow sx={{ backgroundColor: '#e8f2ff' }}> 
    <TableCell>Effective Tax Rate</TableCell>
    <TableCell>

      {results.formType === '1120' ? `${results.corpEffectiveTaxRate}%` : results.formType === '1065' ? `${results.effectiveTaxRate}%` : results.formType === '1120S' ?  `${results.effectiveTaxRate1120S}%`  : results.formType === '1040NR - Schedule E' ?  `${results.effectiveTaxRate1120S}%`  : `${results.effectiveTaxRate}%`}
    </TableCell>
  </TableRow>
  <TableRow sx={{ backgroundColor: '#e8f2ff' }}>
    <TableCell>Marginal Tax Rate</TableCell>
    <TableCell>
    {results.formType === '1120' ? '21%' : results.formType === '1120S' ?  `${results.marginalRate1120s}%`  : results.formType === '1040NR - Schedule E' ?  `${results.marginalRate1120s}%`  : `${results.marginalRate}%`}
    </TableCell>
  </TableRow>
</TableBody>
 </Table>
  </TableContainer>



           {/*opcion sin estrategia*/} 
      <Typography variant="h5" gutterBottom>
      Values without strategy
      </Typography>
     
  <TableContainer component={Paper} sx={{ mb: 4 }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#fff9c4' }}>Return - Form</TableCell>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#fff9c4' }}>{results.formType || 'N/A'}</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
        <TableCell>Net Income</TableCell>
        <TableCell>{results.formType === '1120' ? formatCurrency(results.netIncome2) : formatCurrency(results.netIncome2)}</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
        <TableCell>Self-Employment Rate</TableCell>
        <TableCell>{results.formType === '1120' ? '0%' : results.formType === '1120S' ? '0%' : `${results.selfEmploymentRate}%`}</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
        <TableCell>Marginal Tax Rate</TableCell>
        <TableCell>{results.formType === '1120' ? '21%' : `${results.marginalRate}%`}</TableCell>
      </TableRow>

      {/* Fila Vacía para Separación */}
      <TableRow>
        <TableCell colSpan={2}>&nbsp;</TableCell>
      </TableRow>

      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
        <TableCell>Adjusted Gross Income (AGI)</TableCell>
        <TableCell>{results.formType === '1120' ? 'Not Applicable' : formatCurrency(results.agi2)}</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
      <TableCell>Qualified Business Income Deduction</TableCell>
      <TableCell>{'Not Applicable'}</TableCell>
  </TableRow>
      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
        <TableCell>Standard Deduction</TableCell>
        <TableCell>{results.formType === '1120' ? 'Not Applicable' : formatCurrency(results.standardDeduction)}</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
        <TableCell>Taxable Income</TableCell>
        <TableCell>{results.formType === '1120' ? formatCurrency(results.corpTaxableIncome2) : formatCurrency(results.taxableIncome2)}</TableCell>
      </TableRow>

      {/* Fila Vacía para Separación */}
      <TableRow>
        <TableCell colSpan={2}>&nbsp;</TableCell>
      </TableRow>

      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
        <TableCell>Tax Due (Self-Employment)</TableCell>
        <TableCell>{results.formType === '1120' ? '$0.00' : results.formType === '1120S' ? '$0.00' : formatCurrency(results.totalSE2)}</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
        <TableCell>Tax Due (Income tax rate)</TableCell>
        <TableCell>{results.formType === '1120' ? formatCurrency(results.corpTaxDue2) : formatCurrency(results.taxDue2)}</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
        <TableCell>Tax Credits</TableCell>
            <TableCell>{'$0.00'}</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
        <TableCell>Total Tax Due</TableCell>
        <TableCell> {results.formType === '1120' ? formatCurrency(results.corpTaxDue2) : results.formType === '1120S' ? formatCurrency(results.taxDue2) : formatCurrency(results.totalTaxDue2)}</TableCell>  
      </TableRow>
      
      {/* Fila Vacía para Separación */}
      <TableRow>
              <TableCell colSpan={3}>&nbsp;</TableCell>
      </TableRow>

      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
        <TableCell>Effective Tax Rate</TableCell>
        <TableCell>{results.formType === '1120' ? `${results.corpEffectiveTaxRate}%` : `${results.effectiveTaxRate2}%`}</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#fff9c4' }}>
        <TableCell>Effective SE Rate</TableCell>
        <TableCell>{ results.formType === '1120' ? '0%' : results.formType === '1120S' ? '0%' : `${results.effectiveSERate2}%`}</TableCell>
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
              <TableCell>{results.formType === '1120S' ? (results.incomeLevel1120S) : (results.incomeLevel)}</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#52a6d8' }}>
              <TableCell>Marginal Rate</TableCell>
              <TableCell>{results.formType === '1120S' ? (results.marginalRate1120s) : (results.marginalRate)}%</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#52a6d8' }}>
              <TableCell>Tax Due (Income tax rate)</TableCell>
              <TableCell>{results.formType === '1120' ? formatCurrency(results.corpTaxDue) : results.formType === '1120S' ?  formatCurrency(results.taxDue1120S) : formatCurrency(results.taxDue)}</TableCell>
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
            {/*Falta agregar formula correcta */}
            <TableRow sx={{ backgroundColor: '#52a6d8' }}>
              <TableCell>NIIT Invest income</TableCell>
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
      {/*Falta agregar formula correcta */}
      <TableRow sx={{ backgroundColor: '#b3e5fc' }}>
          <TableCell>NIIT Invest income</TableCell>
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
