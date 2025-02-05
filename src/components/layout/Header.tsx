import { Bell } from "lucide-react";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";

const Header = () => {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm fixed top-0 right-0 left-0 z-30 flex items-center lg:left-64 transition-all duration-300">
      <div className="container flex items-center justify-between">
        <h2 className="text-lg font-medium">Welcome to SIGEL</h2>
        
        <div className="flex items-center gap-4">
          <NotificationDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;