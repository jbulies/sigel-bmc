
import { useState } from "react";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import UserTable from "@/components/users/UserTable";
import InviteUserDialog from "@/components/users/InviteUserDialog";
import PendingInvitationsTable from "@/components/users/PendingInvitationsTable";
import { User } from "@/types/user";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = 'http://localhost:8080';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Error al obtener usuarios");
      }
      return response.json();
    },
  });

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = async (updatedUser: User) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${updatedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Error al actualizar usuario");
      }

      toast.success("Usuario actualizado correctamente");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar usuario");
    }
  };

  const handleDeactivateUser = async (user: User) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${user.id}/deactivate`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Error al desactivar usuario");
      }

      toast.success("Usuario desactivado correctamente");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al desactivar usuario");
    }
  };

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona los usuarios del sistema y sus roles
          </p>
        </div>
        <InviteUserDialog 
          open={isInviteDialogOpen} 
          onOpenChange={setIsInviteDialogOpen} 
        />
      </div>

      <Card>
        <div className="p-6 space-y-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <UserTable
            users={filteredUsers}
            onEditUser={handleEditUser}
            onDeactivateUser={handleDeactivateUser}
          />
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <PendingInvitationsTable />
        </div>
      </Card>
    </div>
  );
};

export default Users;
