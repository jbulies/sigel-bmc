
import { useToast } from "@/hooks/use-toast";
import { translations } from "@/translations/es";
import { useQueryClient } from "@tanstack/react-query";
import { Report } from "@/types/report";
import { User } from "@/types/user";
import { api } from "@/utils/api";

export const useReportActions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleEdit = async (report: Report) => {
    try {
      await api.put(`/reports/${report.id}`, report);
      toast({
        title: translations.common.success,
        description: translations.reports.updateSuccess,
      });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    } catch (error) {
      toast({
        title: translations.common.error,
        description: translations.reports.updateError,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/reports/${id}`);
      toast({
        title: translations.common.success,
        description: translations.reports.deleteSuccess,
      });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    } catch (error) {
      toast({
        title: translations.common.error,
        description: translations.reports.deleteError,
        variant: "destructive",
      });
    }
  };

  const canEditReport = (report: Report, user: User | null) => {
    if (!user) return false;
    if (user.role === "Administrador") return true;
    if (user.role === "Logístico" && report.department === "Logística") return true;
    if (user.role === "Informático" && report.department === "Informática") return true;
    return false;
  };

  return {
    handleEdit,
    handleDelete,
    canEditReport,
  };
};
