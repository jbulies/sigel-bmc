
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
import { api } from "@/utils/api";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        return await api.get("/users");
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Error al obtener usuarios");
      }
    },
  });

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = async (updatedUser: User) => {
    try {
      await api.put(`/users/${updatedUser.id}`, updatedUser);
      toast.success("Usuario actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar usuario");
    }
  };

  const handleDeactivateUser = async (user: User) => {
    try {
      await api.put(`/users/${user.id}/deactivate`, {});
      toast.success("Usuario desactivado correctamente");
    } catch (error) {
      toast.error("Error al desactivar usuario");
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
