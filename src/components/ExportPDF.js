import React from 'react';
import { Button } from '@mui/material';
import { jsPDF } from 'jspdf';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

// Función para formatear números a USD
const formatCurrency = (value) => {
  return value !== undefined && value !== null
    ? `$${parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    : '$0.00';
};

// Colores principales del sistema
const colors = {
  primary: '#0858e6',
  secondary: '#64748b',
  success: '#10b981',
  danger: '#ef4444',
  light: '#f8fafc',
  dark: '#334155',
  border: '#e5e7eb',
  background: '#ffffff'
};

const ExportPDF = ({ results, formTitle }) => {
  const handleExportPDF = () => {
    // Crear un nuevo documento PDF
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Añadir fuente personalizada para cabeceras (opciones: helvetica, courier, times, symbol, zapfdingbats)
    doc.setFont('helvetica');
    
    // Margins
    const margin = 15;
    const pageWidth = 210;
    const contentWidth = pageWidth - (margin * 2);
    
    // ------ Cabecera del Documento ------
    // Agregar un rectángulo de color para la cabecera
    doc.setFillColor(colors.primary);
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    // Título del reporte
    doc.setFontSize(22);
    doc.setTextColor('#ffffff');
    doc.setFont('helvetica', 'bold');
    doc.text(`${formTitle}`, margin, 20);
    
    // Subtítulo
    doc.setFontSize(12);
    doc.text('Tax Calculation Report', margin, 28);

    // ------ Información del cálculo ------
    doc.setFontSize(11);
    doc.setTextColor(colors.dark);
    doc.setFont('helvetica', 'normal');
    
    let y = 45; // Posición vertical inicial
    const lineHeight = 7; // Altura de línea
    
    // Fecha de generación
    const currentDate = new Date().toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.setTextColor(colors.secondary);
    doc.text(`Generated on: ${currentDate}`, margin, y);
    
    y += lineHeight * 2;
    
    // ------ Resumen de Ahorro ------
    // Encabezado de sección
    doc.setFillColor(colors.light);
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.primary);
    doc.setFontSize(12);
    doc.text('Tax Savings Summary', margin + 3, y + 5.5);
    
    y += 12;
    
    // Tabla de resumen
    const colWidth = contentWidth / 3;
    
    // Encabezados de columnas
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colors.secondary);
    doc.text('WITHOUT STRATEGY', margin + (colWidth/2) - 20, y);
    doc.text('WITH STRATEGY', margin + colWidth + (colWidth/2) - 15, y);
    doc.text('TOTAL SAVINGS', margin + (colWidth*2) + (colWidth/2) - 15, y);
    
    y += 6;
    
    // Valores
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.dark);
    doc.text(formatCurrency(results.totalTaxDue2), margin + (colWidth/2) - 20, y);
    
    doc.setTextColor(colors.primary);
    const withStrategyAmount = results.formType === '1120' 
      ? results.corpTaxDue 
      : results.formType === '1120S' 
        ? results.taxDue1120S 
        : results.totalTaxDue;
    doc.text(formatCurrency(withStrategyAmount), margin + colWidth + (colWidth/2) - 15, y);
    
    // Total savings
    const savings = results.formType === '1120' 
      ? results.totalTaxDue2 - results.corpTaxDue 
      : results.formType === '1120S' 
        ? results.totalTaxDue2 - results.taxDue 
        : results.totalTaxDue2 - results.totalTaxDue;
    
    doc.setTextColor(savings <= 0 ? colors.danger : colors.success);
    doc.text(formatCurrency(savings), margin + (colWidth*2) + (colWidth/2) - 15, y);
    
    // Líneas divisorias de columnas
    doc.setDrawColor(colors.border);
    doc.line(margin + colWidth, y - 10, margin + colWidth, y + 5);
    doc.line(margin + colWidth*2, y - 10, margin + colWidth*2, y + 5);
    
    y += lineHeight * 3;
    
    // ------ Resultados detallados ------
    // Encabezado de sección - Con Estrategia
    doc.setFillColor(colors.light);
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.primary);
    doc.setFontSize(12);
    doc.text(`Return Form: ${results.formType || 'N/A'} - With Strategy`, margin + 3, y + 5.5);
    
    y += 12;
    
    // Tabla de resultados
    const addDataRow = (label, value, isHighlighted = false, isAlternate = false) => {
      // Verificar si queda suficiente espacio en la página actual
      // Si queda menos de 20mm, añadir una nueva página
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      
      if (isAlternate) {
        doc.setFillColor('#f9fafb');
        doc.rect(margin, y - 5, contentWidth, 7, 'F');
      }
      
      doc.setFont('helvetica', isHighlighted ? 'bold' : 'normal');
      doc.setTextColor(isHighlighted ? colors.primary : colors.dark);
      doc.setFontSize(10);
      doc.text(label, margin + 3, y);
      doc.text(value, margin + contentWidth - doc.getTextWidth(value) - 3, y);
      
      y += lineHeight;
    };
    
    // Datos principales
    addDataRow('Net Income', formatCurrency(results.netIncome));
    addDataRow('Self-Employment Rate', `${results.selfEmploymentRate}%`, false, true);
    
    // Separador
    y += 2;
    doc.setDrawColor(colors.border);
    doc.line(margin, y, margin + contentWidth, y);
    y += 5;
    
    // Datos de ingresos y deducciones
    const agiValue = results.formType === '1120'
      ? 'Not Applicable'
      : results.formType === '1120S'
        ? formatCurrency(results.AgiCalculation2y4)
        : results.formType === '1040 - Schedule C/F' && (results.partnerType === 'Passive' || results.partnerType === 'Active')
          ? formatCurrency(results.agi)
          : results.formType === '1040NR - Schedule E'
            ? formatCurrency(results.AgiCalculation2y4)
            : formatCurrency(results.agi);
    
    addDataRow('Adjusted Gross Income (AGI)', agiValue);
    addDataRow('Qualified Business Income Deduction', results.formType === '1120' ? 'Not Applicable' : formatCurrency(results.QBID || 0), false, true);
    addDataRow('Standard Deduction', results.formType === '1120' ? 'Not Applicable' : formatCurrency(results.standardDeduction));
    
    const taxableIncomeValue = results.formType === '1120' 
      ? formatCurrency(results.corpTaxableIncome) 
      : results.formType === '1065' 
        ? formatCurrency(results.taxableIncome) 
        : results.formType === '1120S' 
          ? formatCurrency(results.taxableIncome1120S) 
          : results.formType === '1040NR - Schedule E' 
            ? formatCurrency(results.taxableIncome1120S) 
            : formatCurrency(results.taxableIncome);
    
    addDataRow('Taxable Income', taxableIncomeValue, false, true);
    
    // Separador
    y += 2;
    doc.setDrawColor(colors.border);
    doc.line(margin, y, margin + contentWidth, y);
    y += 5;
    
    // Datos de impuestos
    const seTaxValue = results.formType === '1120' 
      ? formatCurrency(0) 
      : results.formType === '1120S' 
        ? '$0.00' 
        : results.formType === '1040NR - Schedule E' 
          ? '$0.00' 
          : formatCurrency(results.totalSE);
    
    addDataRow('Tax Due (Self-Employment)', seTaxValue);
    
    const incomeTaxValue = results.formType === '1120' 
      ? formatCurrency(results.corpTaxDue) 
      : results.formType === '1065' 
        ? formatCurrency(results.taxDue) 
        : results.formType === '1120S' 
          ? formatCurrency(results.taxDue1120S) 
          : results.formType === '1040NR - Schedule E' 
            ? formatCurrency(results.taxDue1120S) 
            : formatCurrency(results.taxDue);
    
    addDataRow('Tax Due (Income tax rate)', incomeTaxValue, false, true);
    addDataRow('Tax Credits', results.formType === '1120' ? '$0.00' : formatCurrency(results.taxCredits));
    
    const totalTaxDueValue = results.formType === '1120' 
      ? formatCurrency(results.corpTaxDue) 
      : results.formType === '1065' 
        ? formatCurrency(results.totalTaxDue) 
        : results.formType === '1120S' 
          ? formatCurrency(results.taxDue1120S) 
          : results.formType === '1040NR - Schedule E' 
            ? formatCurrency(results.taxDue1120S) 
            : formatCurrency(results.totalTaxDue);
    
    addDataRow('Total Tax Due', totalTaxDueValue, true, true);
    
    // Separador
    y += 2;
    doc.setDrawColor(colors.border);
    doc.line(margin, y, margin + contentWidth, y);
    y += 5;
    
    // Tasas efectivas
    const effectiveTaxRateValue = results.formType === '1120' 
      ? `${results.corpEffectiveTaxRate}%` 
      : results.formType === '1065' 
        ? `${results.effectiveTaxRate}%` 
        : results.formType === '1120S' 
          ? `${results.effectiveTaxRate1120S}%`  
          : results.formType === '1040NR - Schedule E' 
            ? `${results.effectiveTaxRate1120S}%`  
            : `${results.effectiveTaxRate}%`;
    
    addDataRow('Effective Tax Rate', effectiveTaxRateValue);
    
    const marginalRateValue = results.formType === '1120' 
      ? '21%' 
      : results.formType === '1120S' 
        ? `${results.marginalRate1120s}%`  
        : results.formType === '1040NR - Schedule E' 
          ? `${results.marginalRate1120s}%`  
          : `${results.marginalRate}%`;
    
    addDataRow('Marginal Tax Rate', marginalRateValue, false, true);
    
    // ------ Comparación sin estrategia ------
    // Verificar si queda suficiente espacio para la sección "Sin estrategia"
    // Necesitamos al menos 80mm de espacio para esta sección
    if (y > 200) {
      doc.addPage();
      y = 20;
    } else {
      y += 15;
    }
    
    // Encabezado de sección - Sin Estrategia
    doc.setFillColor(colors.light);
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.secondary);
    doc.setFontSize(12);
    doc.text(`Without Strategy - Comparison`, margin + 3, y + 5.5);
    
    y += 12;
    
    // Datos sin estrategia
    addDataRow('Net Income', formatCurrency(results.netIncome2));
    addDataRow('Self-Employment Rate', results.formType === '1120' ? '0%' : results.formType === '1120S' ? '0%' : `${results.selfEmploymentRate}%`, false, true);
    addDataRow('Adjusted Gross Income (AGI)', results.formType === '1120' ? 'Not Applicable' : formatCurrency(results.agi2));
    addDataRow('Standard Deduction', results.formType === '1120' ? 'Not Applicable' : formatCurrency(results.standardDeduction), false, true);
    addDataRow('Taxable Income', results.formType === '1120' ? formatCurrency(results.corpTaxableIncome2) : formatCurrency(results.taxableIncome2));
    
    // Separador
    y += 2;
    doc.setDrawColor(colors.border);
    doc.line(margin, y, margin + contentWidth, y);
    y += 5;
    
    addDataRow('Tax Due (Self-Employment)', results.formType === '1120' ? '$0.00' : results.formType === '1120S' ? '$0.00' : formatCurrency(results.totalSE2));
    addDataRow('Tax Due (Income tax rate)', results.formType === '1120' ? formatCurrency(results.corpTaxDue2) : formatCurrency(results.taxDue2), false, true);
    addDataRow('Total Tax Due', results.formType === '1120' ? formatCurrency(results.corpTaxDue2) : results.formType === '1120S' ? formatCurrency(results.taxDue2) : formatCurrency(results.totalTaxDue2), true);
    
    // ------ Pie de página ------
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Agregar pie de página
      doc.setFontSize(8);
      doc.setTextColor(colors.secondary);
      
      const footerY = 285;
      doc.text(`Page ${i} of ${totalPages}`, margin, footerY);
      doc.text('Tax Strategy Calculator', pageWidth / 2, footerY, { align: 'center' });
      doc.text('Generated with Tax App', pageWidth - margin, footerY, { align: 'right' });
      
      // Añadir línea decorativa en el footer
      doc.setDrawColor(colors.primary);
      doc.setLineWidth(0.5);
      doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);
    }
    
    // Guardar el PDF con el nombre basado en el título del formulario y la fecha
    const pdfName = `${formTitle.replace(/\s+/g, '-').toLowerCase()}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(pdfName);
  };

  return (
    <Button
      variant="contained"
      startIcon={<PictureAsPdfIcon />}
      sx={{
        backgroundColor: colors.primary,
        color: '#fff',
        borderRadius: '8px',
        padding: '10px 20px',
        fontWeight: 600,
        textTransform: 'none',
        fontFamily: 'Montserrat, sans-serif',
        boxShadow: '0 2px 4px rgba(8, 88, 230, 0.2)',
        '&:hover': {
          backgroundColor: '#0347c8',
          boxShadow: '0 4px 8px rgba(8, 88, 230, 0.3)',
        },
        transition: 'all 0.3s ease',
      }}
      onClick={handleExportPDF}
    >
      Export as PDF
    </Button>
  );
};

export default ExportPDF;
