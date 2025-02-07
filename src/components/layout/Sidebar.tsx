import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings,
  Menu,
  X,
  LogOut,
  User
} from "lucide-react";
import { translations } from "@/translations/es";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { menu, profile } = translations;
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: menu.dashboard, path: "/" },
    { icon: FileText, label: menu.reports, path: "/reports" },
    { icon: Users, label: menu.users, path: "/users" },
    { icon: Settings, label: menu.settings, path: "/settings" },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await logout();
    toast.success("Sesión cerrada exitosamente");
    navigate("/auth/login");
  };

  return (
    <>
      <button
        className={cn(
          "lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md shadow-md",
          "transition-colors duration-200 ease-in-out",
          "bg-background hover:bg-accent"
        )}
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen",
          "transition-all duration-300 ease-in-out",
          "bg-card shadow-lg",
          "w-64 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="h-[65px] flex items-center px-6 border-b border-border">
            <h1 className="text-2xl font-semibold text-primary">SIGEL</h1>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map(({ icon: Icon, label, path }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md",
                  "transition-all duration-200 ease-in-out",
                  "hover:bg-accent hover:text-accent-foreground",
                  "active:scale-[0.98]",
                  location.pathname === path
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <div className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-md",
                  "hover:bg-accent hover:text-accent-foreground",
                  "transition-colors duration-200 ease-in-out"
                )}>
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <User size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">Juan Pérez</p>
                    <p className="text-xs text-muted-foreground">{profile.role.administrator}</p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{profile.myProfile}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{profile.logout}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;