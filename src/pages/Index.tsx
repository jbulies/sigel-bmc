import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { translations } from "@/translations/es";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { common } = translations;

  console.log("Index component rendered, user:", user?.name);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {common.welcome}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Sistema de Gestión y Control de Reportes
          </p>
          <div className="space-y-4">
            <Button 
              onClick={() => navigate("/reports")} 
              className="w-full"
              size="lg"
            >
              Ver Reportes
            </Button>
            <Button 
              onClick={() => navigate("/users")} 
              variant="outline" 
              className="w-full"
              size="lg"
            >
              Gestionar Usuarios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;