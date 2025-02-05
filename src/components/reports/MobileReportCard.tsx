import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Edit, Trash2 } from "lucide-react";
import { Report } from "@/types/report";
import { translations } from "@/translations/es";

interface MobileReportCardProps {
  report: Report;
  onDelete: (id: number) => void;
  onEdit: (report: Report) => void;
  canEditReport: (report: Report) => boolean;
}

export function MobileReportCard({ report, onDelete, onEdit, canEditReport }: MobileReportCardProps) {
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
    <Collapsible className="border rounded-lg p-4 mb-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{report.title}</h3>
          <p className="text-sm text-muted-foreground">ID: {report.id}</p>
        </div>
        <CollapsibleTrigger>
          <ChevronDown className="h-5 w-5" />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">{translations.reports.status.label}</p>
            <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
          </div>
          <div>
            <p className="text-sm font-medium">{translations.reports.priority}</p>
            <Badge className={getPriorityColor(report.priority)}>{report.priority}</Badge>
          </div>
          <div>
            <p className="text-sm font-medium">{translations.reports.department}</p>
            <p>{report.department}</p>
          </div>
          <div>
            <p className="text-sm font-medium">{translations.reports.createdBy}</p>
            <p>{report.created_by_name}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium">{translations.reports.date}</p>
            <p>{new Date(report.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        {canEditReport(report) && (
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onEdit(report)}
            >
              <Edit className="h-4 w-4 mr-2" />
              {translations.common.edit}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onDelete(report.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {translations.common.delete}
            </Button>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}