export interface User {
  id: number;
  name: string;
  email: string;
  role: "Usuario" | "Logístico" | "Informático" | "Administrador";
  status: "Activo" | "Inactivo";
}