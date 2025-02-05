import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { CreateReportDTO } from "@/types/report";
import { useAuth } from "@/contexts/AuthContext";

export function CreateReportDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: CreateReportDTO = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: formData.get("priority") as CreateReportDTO["priority"],
      department: formData.get("department") as CreateReportDTO["department"],
    };

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error al crear el reporte");

      toast({
        title: "Reporte creado",
        description: "El reporte ha sido creado exitosamente",
      });

      queryClient.invalidateQueries({ queryKey: ["reports"] });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el reporte",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Solo mostrar el botón si el usuario tiene rol de Usuario
  if (user?.role !== 'Usuario') {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nuevo Reporte</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Reporte</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              name="title"
              placeholder="Título del reporte"
              required
            />
          </div>
          <div>
            <Textarea
              name="description"
              placeholder="Descripción detallada"
              required
            />
          </div>
          <div>
            <Select name="department" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Logística">Logística</SelectItem>
                <SelectItem value="Informática">Informática</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select name="priority" required>
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
            {isLoading ? "Creando..." : "Crear Reporte"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}