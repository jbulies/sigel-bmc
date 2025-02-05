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
      <main className="lg:pl-64 pt-16 transition-all duration-300">
        <div className="container py-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;