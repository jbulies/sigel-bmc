import { Bell, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { translations } from "@/translations/es";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";

const Header = () => {
  const { user, logout } = useAuth();
  const { common, profile } = translations;

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm fixed top-0 right-0 left-0 z-30 flex items-center lg:left-64 transition-all duration-300">
      <div className="container flex items-center justify-between">
        <h2 className="text-lg font-medium">{common.welcome}</h2>
        
        <div className="flex items-center gap-4">
          <NotificationDropdown />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <span className="hidden sm:inline-block">{user?.name}</span>
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{profile.myProfile}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>{profile.logout}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;