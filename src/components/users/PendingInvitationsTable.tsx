
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Invitation {
  id: number;
  email: string;
  role: string;
  status: "Pendiente" | "Aceptada" | "Expirada";
  created_at: string;
}

const PendingInvitationsTable = () => {
  const queryClient = useQueryClient();
  const { data: invitations = [], isLoading } = useQuery({
    queryKey: ["pendingInvitations"],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
      const response = await fetch(`${baseUrl}/api/invitations/pending`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Error al obtener invitaciones");
      return response.json();
    },
  });

  const handleResendInvitation = async (id: number) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
      const response = await fetch(`${baseUrl}/api/invitations/${id}/resend`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Error al reenviar invitación");

      toast.success("Invitación reenviada correctamente");
      queryClient.invalidateQueries({ queryKey: ["pendingInvitations"] });
    } catch (error) {
      toast.error("Error al reenviar la invitación");
    }
  };

  const handleCancelInvitation = async (id: number) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
      const response = await fetch(`${baseUrl}/api/invitations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Error al cancelar invitación");

      toast.success("Invitación cancelada correctamente");
      queryClient.invalidateQueries({ queryKey: ["pendingInvitations"] });
    } catch (error) {
      toast.error("Error al cancelar la invitación");
    }
  };

  if (isLoading) return <div>Cargando invitaciones...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Invitaciones Pendientes</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha de Invitación</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((invitation: Invitation) => (
            <TableRow key={invitation.id}>
              <TableCell>{invitation.email}</TableCell>
              <TableCell>{invitation.role}</TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {invitation.status}
                </span>
              </TableCell>
              <TableCell>
                {new Date(invitation.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResendInvitation(invitation.id)}
                >
                  Reenviar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleCancelInvitation(invitation.id)}
                >
                  Cancelar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PendingInvitationsTable;
