import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { CreateReportDialog } from "@/components/reports/CreateReportDialog";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Report } from "@/types/report";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Trash2, FileDown } from "lucide-react";
import { isWithinInterval, parseISO } from "date-fns";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

const Reports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
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
      if (!response.ok) throw new Error("Error al cargar los reportes");
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

      if (!response.ok) throw new Error("Error al eliminar el reporte");

      toast({
        title: "Reporte eliminado",
        description: "El reporte ha sido eliminado exitosamente",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el reporte",
        variant: "destructive",
      });
    }
  };

  const exportToPDF = () => {
    if (!filteredReports?.length) return;

    const doc = new jsPDF();
    const tableColumn = ["ID", "Título", "Estado", "Prioridad", "Departamento", "Creado por", "Fecha"];
    const tableRows = filteredReports.map((report) => [
      report.id,
      report.title,
      report.status,
      report.priority,
      report.department,
      report.created_by_name,
      new Date(report.created_at).toLocaleDateString(),
    ]);

    autoTable(doc, {
      columns: tableColumn.map(title => ({ header: title })),
      body: tableRows
    });

    doc.save("reportes.pdf");
  };

  const getStatusColor = (status: Report["status"]) => {
    switch (status) {
      case "Pendiente":
        return "bg-yellow-500";
      case "En Progreso":
        return "bg-blue-500";
      case "Resuelto":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: Report["priority"]) => {
    switch (priority) {
      case "Alta":
        return "bg-red-500";
      case "Media":
        return "bg-orange-500";
      case "Baja":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const canEditReport = (report: Report) => {
    if (user?.role === "Administrador") return true;
    if (user?.role === "Logístico" && report.department === "Logística") return true;
    if (user?.role === "Informático" && report.department === "Informática") return true;
    return false;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reportes</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona y da seguimiento a todos los reportes
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={exportToPDF}>
            <FileDown className="h-4 w-4 mr-2" />
            Exportar a PDF
          </Button>
          <CreateReportDialog />
        </div>
      </div>

      <Card className="p-6">
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
          <div>Cargando reportes...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Creado por</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports?.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.id}</TableCell>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(report.priority)}>
                      {report.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.department}</TableCell>
                  <TableCell>{report.created_by_name}</TableCell>
                  <TableCell>
                    {new Date(report.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {canEditReport(report) && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {/* Implementar edición */}}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(report.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default Reports;