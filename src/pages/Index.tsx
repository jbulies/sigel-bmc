import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <Card className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Bienvenido a SIGEL</h1>
        <p className="text-gray-600 mb-6">
          Sistema de Gestión y Control de Reportes
        </p>
        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/reports")} 
            className="w-full"
          >
            Ver Reportes
          </Button>
          <Button 
            onClick={() => navigate("/users")} 
            variant="outline" 
            className="w-full"
          >
            Gestionar Usuarios
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Index;