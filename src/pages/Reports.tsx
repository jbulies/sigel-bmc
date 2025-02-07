import { Card } from "@/components/ui/card";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { useReports } from "@/hooks/useReports";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReportTable } from "@/components/reports/ReportTable";
import { MobileReportCard } from "@/components/reports/MobileReportCard";
import { translations } from "@/translations/es";
import { useReportFilters } from "@/hooks/useReportFilters";
import { useReportActions } from "@/hooks/useReportActions";
import { ReportHeader } from "@/components/reports/ReportHeader";
import { exportReportsToPDF } from "@/utils/reportExport";
import { Report } from "@/types/report";

const Reports = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { data: reports, isLoading } = useReports();
  const { filters, filterReports } = useReportFilters();
  const { handleDelete, canEditReport } = useReportActions();
  
  const filteredReports = filterReports(reports);

  const handleEdit = (report: Report) => {
    // Implementar edición
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <ReportHeader onExportPDF={() => exportReportsToPDF(filteredReports || [])} />

      <Card className="p-4 sm:p-6">
        <ReportFilters
          search={filters.search}
          setSearch={filters.setSearch}
          status={filters.status}
          setStatus={filters.setStatus}
          department={filters.department}
          setDepartment={filters.setDepartment}
          dateFrom={filters.dateFrom}
          setDateFrom={filters.setDateFrom}
          dateTo={filters.dateTo}
          setDateTo={filters.setDateTo}
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
                canEditReport={(report) => canEditReport(report, user)}
              />
            ))}
          </div>
        ) : (
          <ReportTable
            reports={filteredReports || []}
            onDelete={handleDelete}
            onEdit={handleEdit}
            canEditReport={(report) => canEditReport(report, user)}
          />
        )}
      </Card>
    </div>
  );
};

export default Reports;
