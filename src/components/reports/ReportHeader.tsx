
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { CreateReportDialog } from "@/components/reports/CreateReportDialog";
import { translations } from "@/translations/es";

export function ReportHeader({ onExportPDF }: { onExportPDF: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">{translations.reports.title}</h1>
        <p className="text-muted-foreground mt-2">
          {translations.dashboard.subtitle}
        </p>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" onClick={onExportPDF}>
          <FileDown className="h-4 w-4 mr-2" />
          {translations.reports.exportPDF}
        </Button>
        <CreateReportDialog />
      </div>
    </div>
  );
}
