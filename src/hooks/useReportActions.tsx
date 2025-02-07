
import { useToast } from "@/hooks/use-toast";
import { translations } from "@/translations/es";
import { useQueryClient } from "@tanstack/react-query";
import { Report } from "@/types/report";
import { User } from "@/types/user";

export const useReportActions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

      queryClient.invalidateQueries({ queryKey: ["reports"] });
    } catch (error) {
      toast({
        title: translations.common.error,
        description: translations.common.error,
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
    handleDelete,
    canEditReport,
  };
};
