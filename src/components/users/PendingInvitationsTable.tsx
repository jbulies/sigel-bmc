import { useState } from "react";
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

interface Invitation {
  id: number;
  email: string;
  role: string;
  status: "Pendiente" | "Aceptada" | "Expirada";
  createdAt: string;
}

// Mock data - será reemplazado con datos reales de la base de datos
const mockInvitations: Invitation[] = [
  {
    id: 1,
    email: "usuario1@ejemplo.com",
    role: "Usuario",
    status: "Pendiente",
    createdAt: "2024-03-15T10:00:00",
  },
  {
    id: 2,
    email: "usuario2@ejemplo.com",
    role: "Logístico",
    status: "Pendiente",
    createdAt: "2024-03-15T11:30:00",
  },
];

const PendingInvitationsTable = () => {
  const [invitations, setInvitations] = useState<Invitation[]>(mockInvitations);

  const handleResendInvitation = (id: number) => {
    // TODO: Implementar lógica para reenviar invitación
    toast.success("Invitación reenviada correctamente");
  };

  const handleCancelInvitation = (id: number) => {
    setInvitations(invitations.filter((inv) => inv.id !== id));
    toast.success("Invitación cancelada correctamente");
  };

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
          {invitations.map((invitation) => (
            <TableRow key={invitation.id}>
              <TableCell>{invitation.email}</TableCell>
              <TableCell>{invitation.role}</TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {invitation.status}
                </span>
              </TableCell>
              <TableCell>
                {new Date(invitation.createdAt).toLocaleDateString()}
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