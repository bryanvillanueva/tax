import React from 'react';
import { Button } from '@mui/material';
import { jsPDF } from 'jspdf';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CalculateIcon from '@mui/icons-material/Calculate';
import PercentIcon from '@mui/icons-material/Percent';
import SavingsIcon from '@mui/icons-material/Savings';

const formatCurrency = (value) => {
  return value !== undefined && value !== null
    ? `$${parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    : '$0.00';
};

const ExportQBIDPDF = ({ results }) => {
  const generatePDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const colors = {
      primary: '#0858e6',
      secondary: '#64748b',
      success: '#10b981',
      lightBlue: '#f0f9ff',
      lightGray: '#f8fafc',
      dark: '#334155',
      border: '#e5e7eb'
    };

    // Margins and dimensions
    const margin = 15;
    const pageWidth = 210;
    const contentWidth = pageWidth - (margin * 2);
    let y = 20;

    // Header
    doc.setFillColor(colors.primary);
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor('#ffffff');
    doc.text('QBID Standard Method', pageWidth / 2, 20, { align: 'center' });
    
    // Subheader
    doc.setFontSize(12);
    doc.text('Calculation Report', pageWidth / 2, 28, { align: 'center' });
    
    y = 40;

    // Date
    doc.setFontSize(10);
    doc.setTextColor(colors.secondary);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, margin, y);
    
    y += 15;

    // Summary Section
    doc.setFillColor(colors.lightBlue);
    doc.rect(margin, y, contentWidth, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(colors.primary);
    doc.text('QBID Calculation Summary', margin + 5, y + 7);
    y += 15;

    // Summary Cards
    const colWidth = contentWidth / 2;
    
    // QBI Card
    doc.setFillColor('#ffffff');
    doc.rect(margin, y, colWidth - 5, 30, 'F');
    doc.setDrawColor(colors.border);
    doc.rect(margin, y, colWidth - 5, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(colors.secondary);
    doc.text('Qualified Business Income', margin + 10, y + 8);
    
    doc.setFontSize(14);
    doc.setTextColor(colors.dark);
    doc.text(formatCurrency(results.qualifiedBusinessIncome), margin + 10, y + 18);
    
    doc.setFontSize(8);
    doc.setTextColor(colors.secondary);
    doc.text('QBI', margin + 10, y + 24);

    // QBID Amount Card
    doc.setFillColor('#ffffff');
    doc.rect(margin + colWidth + 5, y, colWidth - 5, 30, 'F');
    doc.setDrawColor(colors.primary);
    doc.rect(margin + colWidth + 5, y, colWidth - 5, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(colors.secondary);
    doc.text('Final QBID Amount', margin + colWidth + 15, y + 8);
    
    doc.setFontSize(14);
    doc.setTextColor(colors.primary);
    doc.text(formatCurrency(results.smallerOfQbidAndLimit), margin + colWidth + 15, y + 18);
    
    doc.setFontSize(8);
    doc.setTextColor(colors.primary);
    doc.text('QBID Applied', margin + colWidth + 15, y + 24);

    y += 40;

    // Input Values Section
    doc.setFillColor(colors.lightGray);
    doc.rect(margin, y, contentWidth, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(colors.dark);
    doc.text('Input Values', margin + 5, y + 7);
    y += 15;

    // Input Values Table
    const addTableRow = (label, value, isAlternate = false) => {
      if (isAlternate) {
        doc.setFillColor(colors.lightGray);
        doc.rect(margin, y - 5, contentWidth, 10, 'F');
      }
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.dark);
      doc.text(label, margin + 5, y);
      
      doc.setFont('helvetica', 'normal');
      doc.text(value, margin + contentWidth - 5, y, { align: 'right' });
      
      y += 7;
    };

    addTableRow('Qualified Business Income (QBI)', formatCurrency(results.qualifiedBusinessIncome));
    addTableRow('Filing Status', results.filingStatus, true);
    addTableRow('Threshold Amount', formatCurrency(results.threshold));
    addTableRow('Taxable Income Before QBID', formatCurrency(results.taxableIncomeBeforeQbid), true);
    addTableRow('Capital Gain', formatCurrency(results.capitalGain));

    y += 10;

    // Calculation Results Section
    doc.setFillColor(colors.lightBlue);
    doc.rect(margin, y, contentWidth, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(colors.primary);
    doc.text('Calculation Results', margin + 5, y + 7);
    y += 15;

    // Calculation Results Table
    addTableRow(`QBI × Component (${results.component}%)`, formatCurrency(results.qbid), true);
    addTableRow('Taxable Income Less Capital Gain', formatCurrency(results.totalIncomeLessCapitalGain));
    addTableRow(`QBID Limit (TT × ${results.componentIncomeLimitation}%)`, formatCurrency(results.qbidLimit), true);
    
    // Final QBID (highlighted)
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.primary);
    doc.setFontSize(11);
    doc.text('Final QBID (Smaller of QBID and Limit)', margin + 5, y);
    doc.text(formatCurrency(results.smallerOfQbidAndLimit), margin + contentWidth - 5, y, { align: 'right' });
    y += 10;

    // Footer
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(colors.secondary);
      doc.text(`Page ${i} of ${totalPages}`, margin, 290);
      doc.text('QBID Calculator', pageWidth / 2, 290, { align: 'center' });
      doc.text(new Date().getFullYear().toString(), pageWidth - margin, 290, { align: 'right' });
    }

    doc.save(`QBID-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <Button
      variant="contained"
      startIcon={<PictureAsPdfIcon />}
      onClick={generatePDF}
      sx={{
        backgroundColor: '#0858e6',
        color: 'white',
        borderRadius: '8px',
        padding: '10px 20px',
        fontWeight: 600,
        textTransform: 'none',
        '&:hover': {
          backgroundColor: '#0347c8',
        },
        boxShadow: '0 2px 4px rgba(8, 88, 230, 0.2)',
        transition: 'all 0.3s ease',
      }}
    >
      Export as PDF
    </Button>
  );
};

export default ExportQBIDPDF;