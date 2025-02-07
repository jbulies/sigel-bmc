
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { Report } from "@/types/report";

export const exportReportsToPDF = (reports: Report[]) => {
  if (!reports?.length) return;

  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Reporte de Incidencias', 14, 20);
  doc.setFontSize(12);
  doc.text(`Generado el ${new Date().toLocaleDateString()}`, 14, 30);

  const styles = {
    font: 'helvetica',
    fontStyle: 'normal' as const,
    fontSize: 10
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pendiente': return { textColor: [255, 140, 0] as [number, number, number] };
      case 'En Progreso': return { textColor: [0, 0, 255] as [number, number, number] };
      case 'Resuelto': return { textColor: [0, 128, 0] as [number, number, number] };
      default: return { textColor: [0, 0, 0] as [number, number, number] };
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Alta': return { textColor: [255, 0, 0] as [number, number, number] };
      case 'Media': return { textColor: [255, 140, 0] as [number, number, number] };
      case 'Baja': return { textColor: [0, 128, 0] as [number, number, number] };
      default: return { textColor: [0, 0, 0] as [number, number, number] };
    }
  };

  const tableColumn = [
    "ID",
    "Título",
    "Estado",
    "Prioridad",
    "Departamento",
    "Creado por",
    "Fecha"
  ];

  const tableRows = reports.map((report) => [
    report.id.toString(),
    report.title,
    report.status,
    report.priority,
    report.department,
    report.created_by_name,
    new Date(report.created_at).toLocaleDateString(),
  ]);

  autoTable(doc, {
    startY: 40,
    head: [tableColumn],
    body: tableRows,
    styles,
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 40 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 30 },
      5: { cellWidth: 30 },
      6: { cellWidth: 25 },
    },
    didDrawCell: (data) => {
      if (data.section === 'body' && data.row.index !== undefined) {
        const status = tableRows[data.row.index][2];
        const priority = tableRows[data.row.index][3];
        
        if (data.column.index === 2) {
          const statusStyle = getStatusStyle(status);
          doc.setTextColor(...statusStyle.textColor);
        } else if (data.column.index === 3) {
          const priorityStyle = getPriorityStyle(priority);
          doc.setTextColor(...priorityStyle.textColor);
        } else {
          doc.setTextColor(0, 0, 0);
        }
      }
    },
  });

  doc.save("reporte-incidencias.pdf");
};
