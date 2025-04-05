import React from 'react';
import { Button } from '@mui/material';
import { jsPDF } from 'jspdf';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

// Paleta de colores unificada
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

// Función para formatear números a USD
const formatCurrency = (value) => {
  return value !== undefined && value !== null && !isNaN(value)
    ? `$${parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    : '$0.00';
};

// Función para formatear porcentajes
const formatPercentage = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '0.00%';
  return `${(value * 100).toFixed(2)}%`;
};

const ExportQbidPDF = ({ results, formTitle }) => {
  const handleExportPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const margin = 15;
    const pageWidth = 210;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    // Cabecera del documento
    doc.setFillColor(colors.primary);
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(colors.background);
    doc.text(formTitle, margin, 25);
    doc.setFontSize(12);
    doc.text('Qualified Business Income Deduction Report', margin, 32);

    // Fecha de generación
    y = 45;
    doc.setFontSize(10);
    doc.setTextColor(colors.secondary);
    doc.text(`Generated: ${new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, margin, y);
    
    y += 15;

    // Sección de Resumen QBID
    doc.setFillColor(colors.light);
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(colors.primary);
    doc.text('QBID Summary', margin + 3, y + 5.5);
    y += 12;

    // Grid de resumen
    const summaryData = [
      { label: 'Patron Reduction', value: formatCurrency(results.patronReduction) },
      { label: 'QBID Limit', value: formatCurrency(results.qbidLimit) },
      { label: 'Total QBID', value: formatCurrency(results.totalQbid) }
    ];

    const colWidth = contentWidth / 3;
    summaryData.forEach((item, index) => {
      doc.setFontSize(10);
      doc.setTextColor(colors.secondary);
      doc.text(item.label, margin + (colWidth * index) + 10, y);
      doc.setFontSize(12);
      doc.setTextColor(colors.dark);
      doc.text(item.value, margin + (colWidth * index) + 10, y + 6);
    });

    // Líneas divisorias
    doc.setDrawColor(colors.border);
    [1, 2].forEach(n => {
        doc.line(margin + (colWidth * n), y - 5, margin + (colWidth * n), y + 12);
      });
    y += 20;

    // Función para añadir secciones
    const addSection = (title, data) => {
      // Verificar espacio en página
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      // Encabezado de sección
      doc.setFillColor(colors.light);
      doc.rect(margin, y, contentWidth, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(colors.primary);
      doc.text(title, margin + 3, y + 5.5);
      y += 12;

      // Contenido de la sección
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      data.forEach(([label, value], i) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }

        // Fondo alternado
        if (i % 2 === 0) {
          doc.setFillColor(colors.background);
        } else {
          doc.setFillColor(colors.light);
        }
        doc.rect(margin, y - 4, contentWidth, 10, 'F');

        // Texto
        doc.setTextColor(colors.dark);
        doc.text(label, margin + 3, y);
        doc.setTextColor(colors.primary);
        const textWidth = doc.getTextWidth(value);
        doc.text(value, margin + contentWidth - textWidth - 3, y);

        y += 8;
      });

      y += 10;
    };

    // Sección Standard Method
    addSection('Standard Method Calculations', [
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
      ['Smaller of QBID and W2 Wages', formatCurrency(results.smallerQbidComponent)]
    ]);

    // Sección Phased-In
    addSection('Phased-In Calculations', [
      ['QBID (PI-QBID)', formatCurrency(results.phasedInQbid)],
      ['Greater Component (PI-GC)', formatCurrency(results.phasedInGreaterComponent)],
      ['Amount Applicable to Phase-in (PI-AAPI)', formatCurrency(results.amountApplicableToPhaseIn)],
      ['Taxable Income Before QBID (PI-TIBQ)', formatCurrency(results.taxableIncomeBeforeQbid)],
      ['Threshold (PI-TS)', formatCurrency(results.phasedInThreshold)],
      ['Amount Over Threshold (PI-AMT)', formatCurrency(results.amountOverThreshold)],
      ['Phase-In Range (PI-PIR)', formatCurrency(results.phaseInRange)],
      ['Phase-In Percentage (PI-PIP)', formatPercentage(results.phaseInPercentage)],
      ['Total Phase-in Reduction (PI-TPIR)', formatCurrency(results.totalPhaseInReduction)],
      ['QBID after Phase-in Reduction (PI-QAPI)', formatCurrency(results.qbidAfterPhaseInReduction)]
    ]);

    // Pie de página en todas las páginas
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(colors.secondary);
      
      // Línea decorativa
      doc.setDrawColor(colors.primary);
      doc.line(margin, 285, pageWidth - margin, 285);
      
      // Textos del footer
      doc.text(`Page ${i} of ${totalPages}`, margin, 290);
      doc.text('Generated with Tax App', pageWidth - margin, 290, { align: 'right' });
    }

    // Guardar PDF
    const pdfName = `${formTitle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(pdfName);
  };

  return (
    <Button
      variant="contained"
      startIcon={<PictureAsPdfIcon />}
      sx={{
        backgroundColor: colors.primary,
        color: colors.background,
        borderRadius: '8px',
        padding: '10px 24px',
        fontWeight: 600,
        textTransform: 'none',
        fontFamily: 'Montserrat, sans-serif',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: '#0347c8',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        }
      }}
      onClick={handleExportPDF}
    >
      Export as PDF
    </Button>
  );
};

export default ExportQbidPDF;