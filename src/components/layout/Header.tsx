import { Bell } from "lucide-react";

const Header = () => {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm fixed top-0 right-0 left-0 z-30 flex items-center lg:left-64 transition-all duration-300">
      <div className="container flex items-center justify-between">
        <h2 className="text-lg font-medium">Welcome to SIGEL</h2>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full hover:bg-accent transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-status-pending rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;