
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
      console.log('Editando reporte:', report);
      const response = await api.put(`/reports/${report.id}`, report);
      if (response) {
        toast({
          title: translations.common.success,
          description: translations.reports.updateSuccess,
        });
        await queryClient.invalidateQueries({ queryKey: ["reports"] });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al actualizar reporte:', error);
      toast({
        title: translations.common.error,
        description: translations.reports.updateError || 'Error al actualizar el reporte',
        variant: "destructive",
      });
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      console.log('Eliminando reporte:', id);
      const response = await api.delete(`/reports/${id}`);
      if (response) {
        toast({
          title: translations.common.success,
          description: translations.reports.deleteSuccess,
        });
        await queryClient.invalidateQueries({ queryKey: ["reports"] });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al eliminar reporte:', error);
      toast({
        title: translations.common.error,
        description: translations.reports.deleteError || 'Error al eliminar el reporte',
        variant: "destructive",
      });
      return false;
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
