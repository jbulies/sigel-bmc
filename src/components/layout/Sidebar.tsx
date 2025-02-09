
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Users,
  Menu,
  X
} from "lucide-react";
import { translations } from "@/translations/es";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : true;
  });
  
  const location = useLocation();
  const { menu } = translations;
  const { user } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: menu.dashboard, path: "/", roles: ["Usuario", "Logístico", "Informático", "Administrador"] },
    { icon: FileText, label: menu.reports, path: "/reports", roles: ["Usuario", "Logístico", "Informático", "Administrador"] },
    { icon: Users, label: menu.users, path: "/users", roles: ["Administrador"] },
  ].filter(item => user && item.roles.includes(user.role));

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  if (!user) return null;

  return (
    <>
      <button
        className={cn(
          "lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md shadow-md",
          "transition-colors duration-200 ease-in-out",
          "bg-background hover:bg-accent"
        )}
        onClick={() => setIsOpen(!isOpen)}
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
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
