import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const emailSettingsSchema = z.object({
  smtpHost: z.string().min(1, "El servidor SMTP es requerido"),
  smtpPort: z.string().min(1, "El puerto SMTP es requerido"),
  smtpUser: z.string().email("Debe ser un email válido"),
  smtpPassword: z.string().min(1, "La contraseña SMTP es requerida"),
  senderEmail: z.string().email("Debe ser un email válido")
});

type EmailSettingsForm = z.infer<typeof emailSettingsSchema>;

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const form = useForm<EmailSettingsForm>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpHost: "",
      smtpPort: "",
      smtpUser: "",
      smtpPassword: "",
      senderEmail: ""
    }
  });

  const { data: currentSettings } = useQuery({
    queryKey: ['emailSettings'],
    queryFn: async () => {
      const response = await fetch("/api/settings/email", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Error al cargar la configuración");
      return response.json();
    },
    onSuccess: (data) => {
      form.reset(data);
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: EmailSettingsForm) => {
      const response = await fetch("/api/settings/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al guardar la configuración");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Configuración guardada",
        description: "La configuración de correo se ha guardado exitosamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar la configuración",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: EmailSettingsForm) => {
    mutation.mutate(data);
  };

  // Si no es administrador, no mostrar la página
  if (user?.role !== "Administrador") {
    return null;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona la configuración del sistema
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Configuración de Correo</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="smtpHost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servidor SMTP</FormLabel>
                  <FormControl>
                    <Input placeholder="smtp.ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="smtpPort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Puerto SMTP</FormLabel>
                  <FormControl>
                    <Input placeholder="587" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="smtpUser"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario SMTP</FormLabel>
                  <FormControl>
                    <Input placeholder="usuario@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="smtpPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña SMTP</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="senderEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo del Remitente</FormLabel>
                  <FormControl>
                    <Input placeholder="noreply@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Guardando..." : "Guardar Configuración"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;