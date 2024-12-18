import React from 'react';
import { Button } from '@mui/material';
import { jsPDF } from 'jspdf';

// Función para formatear números a USD
const formatCurrency = (value) => {
  return value !== undefined && value !== null
    ? `$${parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    : '$0.00';
};

const ExportPDF = ({ results, formTitle }) => {
  const handleExportPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');

    // Configurar fuente y colores
    doc.setFont('helvetica');
    doc.setFontSize(24);
    doc.setTextColor('#0858e6');

    // Título del Reporte
    doc.text(`${formTitle} - Report`, 14, 20);

    // Línea divisoria
    doc.setDrawColor(0, 0, 0);
    doc.line(14, 25, 196, 25);

    // Encabezado de la Tabla
    doc.setFontSize(14);
    doc.setTextColor('#000000');
    doc.text('Calculation Results', 14, 35);

    // Posiciones iniciales
    let yPosition = 45;
    const lineHeight = 10;
    const leftColumnX = 14;
    const rightColumnX = 110;

    // Agregar Encabezados de las Columnas
    doc.setFontSize(12);
    doc.text('Values with strategy', leftColumnX, yPosition);
    doc.text('Values without strategy', rightColumnX, yPosition);
    yPosition += lineHeight;

    // Función para Agregar una Fila a la Tabla
    const addResultRow = (label, leftValue, rightValue) => {
      doc.setFontSize(10);
      doc.text(label, leftColumnX, yPosition);
      doc.text(leftValue, leftColumnX + 60, yPosition);
      doc.text(rightValue, rightColumnX + 60, yPosition);
      yPosition += lineHeight;
    };

    // Agregar Datos Comparativos
    addResultRow('Net Income', formatCurrency(results.netIncome), formatCurrency(results.netIncome2));
    addResultRow('Self-Employment Rate', `${results.selfEmploymentRate}%`, `${results.selfEmploymentRate}%`);
    addResultRow('Marginal Tax Rate', `${results.marginalRate}%`, `${results.marginalRate2}%`);
    addResultRow('Adjusted Gross Income (AGI)', formatCurrency(results.agi), formatCurrency(results.agi2));
    addResultRow('Standard Deduction', formatCurrency(results.standardDeduction), formatCurrency(results.standardDeduction));
    addResultRow('Taxable Income', formatCurrency(results.taxableIncome), formatCurrency(results.taxableIncome2));
    addResultRow('Tax Due (Self-Employment)', formatCurrency(results.totalSE), formatCurrency(results.totalSE2));
    addResultRow('Tax Due (Income tax rate)', formatCurrency(results.taxDue), formatCurrency(results.taxDue2));
    addResultRow('Total Tax Due', formatCurrency(results.totalTaxDue), formatCurrency(results.totalTaxDue2));
    addResultRow('Effective Tax Rate', `${results.effectiveTaxRate}%`, `${results.effectiveTaxRate2}%`);
    addResultRow('Effective SE Rate', `${results.effectiveSERate}%`, `${results.effectiveSERate2}%`);

    // Total Savings al Final
    yPosition += lineHeight;
    doc.setFontSize(12);
    doc.setTextColor('#0858e6');
    doc.text(`Total Saving: ${formatCurrency(results.totalTaxDue2 - results.totalTaxDue)}`, leftColumnX, yPosition);

    // Guardar el PDF
    doc.save('calculation_results.pdf');
  };

  return (
    <Button
      variant="contained"
      sx={{ backgroundColor: '#0858e6', color: '#fff', mt: 2 }}
      onClick={handleExportPDF}
    >
      Export as PDF
    </Button>
  );
};

export default ExportPDF;
