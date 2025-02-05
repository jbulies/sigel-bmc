import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main className="lg:pl-64 pt-[65px] transition-all duration-300">
        <div className="container py-6">{children}</div>
      </main>
    </div>
  );
};

export default Layout;