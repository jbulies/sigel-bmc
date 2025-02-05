import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Nuevo reporte",
    message: "Se ha generado un nuevo reporte de ventas",
    read: false,
    createdAt: "2024-03-10T10:00:00",
  },
  {
    id: 2,
    title: "Usuario actualizado",
    message: "Se actualizó la información del usuario Juan Pérez",
    read: true,
    createdAt: "2024-03-09T15:30:00",
  },
];

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-4">
          <h3 className="font-semibold">Notificaciones</h3>
          <p className="text-sm text-muted-foreground">
            Tienes {unreadCount} notificaciones sin leer
          </p>
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`p-4 cursor-pointer ${!notification.read ? 'bg-accent' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="space-y-1">
                <p className="font-medium">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;