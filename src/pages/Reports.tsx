import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { CreateReportDialog } from "@/components/reports/CreateReportDialog";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { Report } from "@/types/report";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileDown } from "lucide-react";
import { isWithinInterval, parseISO } from "date-fns";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { useIsMobile } from "@/hooks/use-mobile";
import { ReportTable } from "@/components/reports/ReportTable";
import { MobileReportCard } from "@/components/reports/MobileReportCard";
import { translations } from "@/translations/es";

const Reports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [department, setDepartment] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const { data: reports, isLoading, refetch } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await fetch("/api/reports", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error(translations.common.error);
      return response.json() as Promise<Report[]>;
    },
  });

  const filteredReports = reports?.filter((report) => {
    const matchesSearch = 
      search === "" || 
      report.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || report.status === status;
    const matchesDepartment = 
      department === "all" || 
      report.department === department;
    
    let matchesDate = true;
    if (dateFrom && dateTo) {
      const reportDate = parseISO(report.created_at);
      matchesDate = isWithinInterval(reportDate, { 
        start: dateFrom, 
        end: dateTo 
      });
    }

    return matchesSearch && matchesStatus && matchesDepartment && matchesDate;
  });

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error(translations.common.error);

      toast({
        title: translations.common.success,
        description: translations.reports.deleteSuccess,
      });

      refetch();
    } catch (error) {
      toast({
        title: translations.common.error,
        description: translations.common.error,
        variant: "destructive",
      });
    }
  };

  const exportToPDF = () => {
    if (!filteredReports?.length) return;

    const doc = new jsPDF();
    
    // Añadir título
    doc.setFontSize(20);
    doc.text('Reporte de Incidencias', 14, 20);
    doc.setFontSize(12);
    doc.text(`Generado el ${new Date().toLocaleDateString()}`, 14, 30);

    // Configurar estilos para la tabla
    const styles = {
      font: 'helvetica',
      fontStyle: 'normal' as const, // Especificamos que es una constante literal
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

    const tableRows = filteredReports.map((report) => [
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

  const canEditReport = (report: Report) => {
    if (user?.role === "Administrador") return true;
    if (user?.role === "Logístico" && report.department === "Logística") return true;
    if (user?.role === "Informático" && report.department === "Informática") return true;
    return false;
  };

  const handleEdit = (report: Report) => {
    // Implementar edición
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{translations.reports.title}</h1>
          <p className="text-muted-foreground mt-2">
            {translations.dashboard.subtitle}
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={exportToPDF}>
            <FileDown className="h-4 w-4 mr-2" />
            {translations.reports.exportPDF}
          </Button>
          <CreateReportDialog />
        </div>
      </div>

      <Card className="p-4 sm:p-6">
        <ReportFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          department={department}
          setDepartment={setDepartment}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
        />

        {isLoading ? (
          <div className="text-center py-8">{translations.common.loading}</div>
        ) : isMobile ? (
          <div className="space-y-4">
            {filteredReports?.map((report) => (
              <MobileReportCard
                key={report.id}
                report={report}
                onDelete={handleDelete}
                onEdit={handleEdit}
                canEditReport={canEditReport}
              />
            ))}
          </div>
        ) : (
          <ReportTable
            reports={filteredReports || []}
            onDelete={handleDelete}
            onEdit={handleEdit}
            canEditReport={canEditReport}
          />
        )}
      </Card>
    </div>
  );
};

export default Reports;
