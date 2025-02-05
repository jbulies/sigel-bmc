import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Report } from "@/types/report";
import { translations } from "@/translations/es";

interface ReportTableProps {
  reports: Report[];
  onDelete: (id: number) => void;
  onEdit: (report: Report) => void;
  canEditReport: (report: Report) => boolean;
}

export function ReportTable({ reports, onDelete, onEdit, canEditReport }: ReportTableProps) {
  const getStatusColor = (status: Report["status"]) => {
    switch (status) {
      case "Pendiente": return "bg-status-pending";
      case "En Progreso": return "bg-status-inProgress";
      case "Resuelto": return "bg-status-resolved";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: Report["priority"]) => {
    switch (priority) {
      case "Alta": return "bg-red-500";
      case "Media": return "bg-orange-500";
      case "Baja": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>{translations.reports.title}</TableHead>
            <TableHead>{translations.reports.status.label}</TableHead>
            <TableHead>{translations.reports.priority}</TableHead>
            <TableHead>{translations.reports.department}</TableHead>
            <TableHead>{translations.reports.createdBy}</TableHead>
            <TableHead>{translations.reports.date}</TableHead>
            <TableHead>{translations.reports.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports?.map((report) => (
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
                        onClick={() => onEdit(report)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(report.id)}
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
    </div>
  );
}