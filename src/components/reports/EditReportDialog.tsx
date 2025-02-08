
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Report } from "@/types/report";
import { Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/utils/api";

interface EditReportDialogProps {
  report: Report;
}

export function EditReportDialog({ report }: EditReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const canEditStatus = () => {
    if (!user) return false;
    if (report.status === "Resuelto") return false;
    if (user.role === "Administrador") return true;
    if (user.role === "Logístico" && report.department === "Logística") return true;
    if (user.role === "Informático" && report.department === "Informática") return true;
    return false;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as Report["status"],
      priority: formData.get("priority") as Report["priority"],
    };

    try {
      await api.put(`/reports/${report.id}`, data);
      toast.success("Reporte actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      setOpen(false);
    } catch (error) {
      console.error("Error updating report:", error);
      toast.error("Error al actualizar el reporte");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" disabled={!canEditStatus()}>
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Reporte</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              name="title"
              placeholder="Título del reporte"
              defaultValue={report.title}
              required
            />
          </div>
          <div>
            <Textarea
              name="description"
              placeholder="Descripción detallada"
              defaultValue={report.description}
              required
            />
          </div>
          <div>
            <Select name="status" defaultValue={report.status}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="En Progreso">En Progreso</SelectItem>
                <SelectItem value="Resuelto">Resuelto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select name="priority" defaultValue={report.priority}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona la prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Baja">Baja</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Actualizando..." : "Actualizar Reporte"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
