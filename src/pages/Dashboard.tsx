import { Card } from "@/components/ui/card";
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Report } from "@/types/report";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  
  const { data: reports, isLoading, error } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await fetch("/api/reports", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al cargar los reportes");
      }
      return response.json() as Promise<Report[]>;
    },
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "No se pudieron cargar los reportes",
    });
  }

  const stats = [
    {
      label: "Total Reportes",
      value: reports?.length || 0,
      icon: ClipboardList,
      color: "text-primary",
    },
    {
      label: "En Progreso",
      value: reports?.filter(r => r.status === "En Progreso").length || 0,
      icon: Clock,
      color: "text-status-inProgress",
    },
    {
      label: "Resueltos",
      value: reports?.filter(r => r.status === "Resuelto").length || 0,
      icon: CheckCircle2,
      color: "text-status-resolved",
    },
    {
      label: "Pendientes",
      value: reports?.filter(r => r.status === "Pendiente").length || 0,
      icon: AlertCircle,
      color: "text-status-pending",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Panel de Control</h1>
        <p className="text-muted-foreground mt-2">
          Vista general del sistema de gestión de reportes
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-full bg-background", stat.color)}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{isLoading ? "..." : stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Reportes Recientes</h3>
          <div className="space-y-4">
            {isLoading ? (
              <p>Cargando...</p>
            ) : reports?.slice(0, 5).map((report) => (
              <div key={report.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{report.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(report.created_at), "PPP", { locale: es })}
                  </p>
                </div>
                <div className={cn(
                  "px-2 py-1 rounded-full text-xs",
                  report.status === "Pendiente" && "bg-yellow-100 text-yellow-800",
                  report.status === "En Progreso" && "bg-blue-100 text-blue-800",
                  report.status === "Resuelto" && "bg-green-100 text-green-800"
                )}>
                  {report.status}
                </div>
              </div>
            ))}
            {!isLoading && (!reports || reports.length === 0) && (
              <p className="text-muted-foreground">No hay reportes disponibles</p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            {isLoading ? (
              <p>Cargando...</p>
            ) : reports?.slice(0, 5).map((report) => (
              <div key={report.id} className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary"></div>
                <div>
                  <p className="font-medium">Nuevo reporte: {report.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Creado por {report.created_by_name} - {format(new Date(report.created_at), "PPP", { locale: es })}
                  </p>
                </div>
              </div>
            ))}
            {!isLoading && (!reports || reports.length === 0) && (
              <p className="text-muted-foreground">No hay actividad reciente</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;