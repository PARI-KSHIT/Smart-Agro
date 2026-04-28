import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TFunction } from 'i18next';

export const generatePDFReport = (history: any[], user: any, t: TFunction) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(16, 185, 129); // Emerald-600
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Smart Agro', 14, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(t('dashboard.report.title'), 14, 33);
  
  // Generated Date
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  const now = new Date().toLocaleString();
  doc.text(`${t('dashboard.report.generatedOn')}: ${now}`, pageWidth - 14, 25, { align: 'right' });

  // User Profile Section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(t('dashboard.report.userProfile'), 14, 55);
  
  doc.setLineWidth(0.5);
  doc.setDrawColor(230, 230, 230);
  doc.line(14, 58, pageWidth - 14, 58);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${t('dashboard.name')}: ${user?.name || 'N/A'}`, 14, 66);
  doc.text(`${t('dashboard.email')}: ${user?.email || 'N/A'}`, 14, 72);

  // Statistics Summary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(t('dashboard.report.stats'), 14, 85);
  doc.line(14, 88, pageWidth - 14, 88);
  
  const totalScans = history.length;
  const diseasesDetected = history.filter(r => r.diseaseName.toLowerCase() !== 'healthy').length;
  const fertilizersSuggested = history.filter(r => r.recommendedFertilizer && r.recommendedFertilizer.toLowerCase() !== 'none').length;
  
  autoTable(doc, {
    startY: 92,
    head: [[t('dashboard.stats.totalScans'), t('dashboard.stats.diseasesDetected'), t('dashboard.stats.fertilizersSuggested')]],
    body: [[totalScans, diseasesDetected, fertilizersSuggested]],
    theme: 'striped',
    headStyles: { fillColor: [16, 185, 129] },
    margin: { left: 14, right: 14 }
  });

  // History Table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(t('dashboard.report.history'), 14, (doc as any).lastAutoTable.finalY + 15);
  doc.line(14, (doc as any).lastAutoTable.finalY + 18, pageWidth - 14, (doc as any).lastAutoTable.finalY + 18);
  
  const historyData = history.map(record => [
    new Date(record.analyzedAt).toLocaleDateString(),
    record.cropName || 'N/A',
    record.diseaseName,
    record.recommendedFertilizer || 'None'
  ]);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 22,
    head: [[t('dashboard.report.date'), 'Crop', t('dashboard.report.disease'), t('dashboard.report.fertilizer')]],
    body: historyData,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129] },
    styles: { fontSize: 9 },
    margin: { left: 14, right: 14 }
  });

  // Insights & Suggestions
  const lastY = (doc as any).lastAutoTable.finalY;
  if (lastY + 60 > doc.internal.pageSize.getHeight()) {
    doc.addPage();
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(t('dashboard.report.suggestions'), 14, 20);
    doc.line(14, 23, pageWidth - 14, 23);
  } else {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(t('dashboard.report.suggestions'), 14, lastY + 15);
    doc.line(14, lastY + 18, pageWidth - 14, lastY + 18);
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const uniqueDiseases = Array.from(new Set(history.filter(r => r.diseaseName.toLowerCase() !== 'healthy').map(r => r.diseaseName)));
  
  let suggestionText = "";
  if (uniqueDiseases.length > 0) {
    suggestionText = `Based on your history, we noticed recurring instances of ${uniqueDiseases.join(', ')}. \n\nTips:\n1. Regularly monitor crop leaves for early signs of infection.\n2. Ensure proper soil nutrition and drainage.\n3. Use recommended bio-fertilizers for better resistance.`;
  } else {
    suggestionText = "Your crops appear to be healthy! Keep up the good work with regular monitoring and balanced fertilization.";
  }

  const splitText = doc.splitTextToSize(suggestionText, pageWidth - 28);
  doc.text(splitText, 14, (doc as any).lastAutoTable.finalY ? (lastY + 28 > doc.internal.pageSize.getHeight() ? 30 : lastY + 28) : 30);

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    doc.text('Smart Agro - Empowering Farmers', 14, doc.internal.pageSize.getHeight() - 10);
  }

  doc.save(`SmartAgro_Report_${new Date().getTime()}.pdf`);
};
