export interface User {
  id: number;
  name: string;
  email: string;
  role: "Usuario" | "Logístico" | "Informático";
  status: "Activo" | "Inactivo";
}